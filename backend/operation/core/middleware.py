from fastapi.middleware.cors import CORSMiddleware
import time
import uuid
import structlog
from fastapi import Request


log = structlog.get_logger()


origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://customer-analysis-app.vercel.app",
    "customer-analysis-app-k9lk.vercel.app",  # 실제 배포 도메인으로 변경 필요
]


def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )


async def logging_middleware(request: Request, call_next):

    # 요청 ID 생성 및 컨텍스트에 바인딩
    request_id = str(uuid.uuid4())

    # 예외 처리기에서도 접근 가능하도록 상태에 저장
    request.state.request_id = request_id

    structlog.contextvars.bind_contextvars(request_id=request_id)

    start_time = time.time()

    try:
        response = await call_next(request)

        process_time = time.time() - start_time

        status_code = response.status_code

        client = request.client
        client_host = client.host if client else "unknown"

        log.info(
            "request_finished",
            path=request.url.path,
            method=request.method,
            status_code=status_code,
            process_time=round(process_time, 4),
            client_host=client_host,
        )

        # 모든 정상 응답에 요청 ID 헤더 추가
        response.headers["X-Request-ID"] = request_id
        return response

    except Exception as e:
        process_time = time.time() - start_time

        log.error(
            "request_failed",
            path=request.url.path,
            method=request.method,
            status_code=500,  # 예외 발생 시 보통 500
            process_time=round(process_time, 4),
            exception=str(e),
        )
        # 예외는 상위 예외 핸들러에 위임
        raise

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

    # 1. 모든 사용자에게 유일 ID 발급
    request_id = str(uuid.uuid4())

    # 2. 번호표 붙이기
    # 모든 객체 (request) 에 접근할 수 있도록 ID를 저장 === 나중에 에러 났을시 ID로 추적 가능
    request.state.request_id = request_id

    # 3. 번호표를 컨텍스트에 저장 === 로깅에 사용
    structlog.contextvars.bind_contextvars(request_id=request_id)

    # 4. 시작 시간 기록
    start_time = time.time()

    try:
        # 5. 손님을 실제 목적지로 보내기  (라우터/ API 함수)
        # request: 손님
        # call_next: 목적지
        response = await call_next(request)
        # 6. 처리 시간 계산
        process_time = time.time() - start_time
        # 7. 상태 코드 추출
        # 성공했는지(200), 실패했는지 (404, 500) 확인
        status_code = response.status_code

        # 8. 클라이언트 정보 추출 (누가 왔나)
        client = request.client
        client_host = client.host if client else "unknown"

        # 9. 로깅 일지 작성 (성공시)
        log.info(
            "request_finished",
            path=request.url.path,
            method=request.method,
            status_code=status_code,
            process_time=round(process_time, 4),
            client_host=client_host,
        )

        # 10. 영수증에 번호표 추가
        # 손님한테 주는 응답 헤더에도 ID를 추가
        response.headers["X-Request-ID"] = request_id
        return response

    except Exception as e:
        # 11. 에러 발생시
        process_time = time.time() - start_time
        # 12. 에러 일지 작성
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

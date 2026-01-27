from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class CustomException(Exception):
    def __init__(self, error_code: str, message: str, status_code: int):
        self.error_code = error_code
        self.message = message
        self.status_code = status_code


# StarletteHTTPException: FastAPI가 내는 기본 에러 (예: "주소 못 찾음 404")


def add_exception_handlers(app: FastAPI):
    @app.exception_handler(CustomException)
    async def custom_exception_handler(request: Request, exc: CustomException):

        response = JSONResponse(
            status_code=exc.status_code,
            content={"error_code": exc.error_code, "message": exc.message},
        )
        # http의 응답 헤더에 번호표 찾기 (로깅미들웨어에서 저장한 것)
        # 에러가 나도 번호표는 붙여서 내보낸다. 그 이유는 나중에 프론트엔드에서 에러가 났을 때
        # 백엔드 로그와 프론트엔드 로그를 대조하기 위해서

        request_id = getattr(request.state, "request_id", None)
        if request_id:
            response.headers["X-Request-ID"] = request_id
        return response

    # FastAPI의 기본 에러를 잡는 핸들러
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):

        response = JSONResponse(
            status_code=exc.status_code,
            content={"error_code": "HTTP_EXCEPTION", "message": str(exc.detail)},
        )
        request_id = getattr(request.state, "request_id", None)
        if request_id:
            response.headers["X-Request-ID"] = request_id
        return response

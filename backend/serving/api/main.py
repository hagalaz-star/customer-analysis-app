from dotenv import load_dotenv
from fastapi import FastAPI
from operation.core.middleware import setup_cors, logging_middleware
from operation.core.errors import add_exception_handlers
from operation.core.logging_config import setup_logging

# 로깅 설정을 왜 여기서 부터 시작한걸까?
load_dotenv(".env.local")

from .routes import customers_router, analysis_router, monitoring_router, rag_router

# 로깅 설정 실행
setup_logging()


app = FastAPI()

# 라우터 등록
app.include_router(analysis_router.router, prefix="/api/analysis")
app.include_router(customers_router.router, prefix="/api/customers")
app.include_router(rag_router.router, prefix="/api/rag")
app.include_router(monitoring_router.router)


# 미들웨어 추가
app.middleware("http")(logging_middleware)  # 로깅 미들웨어를 가장 먼저 추가
setup_cors(app)

# 예외 핸들러 등록
add_exception_handlers(app)

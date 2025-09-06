from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://your-frontend-domain.vercel.app",  # 실제 배포 도메인으로 변경 필요
]


def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

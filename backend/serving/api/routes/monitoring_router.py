from fastapi import status, HTTPException
from .analysis_router import analyzer
import os
from fastapi import APIRouter


router = APIRouter()


# 앱이 잘 돌아가는지 실시간 확인
# 이 프로세스를 재 시작해야하나 ? 판단
@router.get("/healthz", status_code=status.HTTP_200_OK)
def health_check():
    components = {
        "model": analyzer.model is not None,
        "scaler": analyzer.scaler is not None,
        "columns": analyzer.original_columns is not None,
    }

    if all(components.values()):
        return {"status": "ok", "details": "All components are healthy."}

    # 어떤 구성요소가 문제인지
    unhealthy_components = []
    for name, is_healthy in components.items():
        if not is_healthy:
            unhealthy_components.append(name)

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "status": "unhealthy",
            "message": "One or more components are not available.",
            "unhealthy_components": unhealthy_components,
        },
    )


# 요청 받을 준비가 되었는지 확인
# 지금 트래픽을 보내도 문제  없나?
@router.get("/readyz", status_code=status.HTTP_200_OK)
def readiness_check():
    components = {
        "model": analyzer.model is not None,
        "scaler": analyzer.scaler is not None,
        "columns": analyzer.original_columns is not None,
        "supabase_secret": os.getenv("SUPABASE_JWT_SECRET") is not None,
    }

    if all(components.values()):
        return {"status": "ready", "details": components}

    unhealthy = []
    for name, is_ready in components.items():
        if not is_ready:
            unhealthy.append(name)

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={"status": "not_ready", "unhealthy_compoents": unhealthy},
    )

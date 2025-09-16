import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Request
from analysis import CustomerAnalyzer
from pydantic import BaseModel, Field
from typing import Literal
from core.middleware import setup_cors, logging_middleware
from auth import verify_supabase_token
from core.errors import add_exception_handlers, CustomException
from core.logging_config import setup_logging


# 로깅 설정 실행
setup_logging()

load_dotenv()

current_dir = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(current_dir, "model.pkl")
scaler_path = os.path.join(current_dir, "scaler.pkl")
columns_path = os.path.join(current_dir, "columns.pkl")


analyzer = CustomerAnalyzer(
    model_path=model_path, scaler_path=scaler_path, columns_path=columns_path
)

app = FastAPI()

# 미들웨어 추가 (순서가 중요)
app.middleware("http")(logging_middleware)  # 로깅 미들웨어를 가장 먼저 추가
setup_cors(app)

# 예외 핸들러 등록
add_exception_handlers(app)


class AnalysisResult(BaseModel):
    predicted_cluster: int
    cluster_name: str
    cluster_description: str


class CustomerProfile(BaseModel):
    Age: int = Field(
        ..., alias="Age", ge=0, le=120, description="나이는 0-120 사이여야 합니다"
    )
    purchase_amount: float = Field(
        ...,
        alias="Purchase Amount (USD)",
        ge=0,
        description="구매 금액은 0 이상이어야 합니다",
    )
    subscription_status: bool = Field(..., alias="Subscription Status")
    frequency_of_purchases: Literal[
        "Weekly", "Monthly", "Annually", "Fortnightly", "Quarterly"
    ] = Field(..., alias="Frequency of Purchases")

    model_config = {"populate_by_name": True}


@app.get("/healthz", status_code=status.HTTP_200_OK)
def health_check():
    components = {
        "model": analyzer.model is not None,
        "scaler": analyzer.scaler is not None,
        "columns": analyzer.original_columns is not None,
        "supabase_secret": os.getenv("SUPABASE_JWT_SECRET") is not None,
    }

    if all(components.values()):
        return {"status": "ok", "details": "All components are healthy."}

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


@app.post("/api/analysis", response_model=AnalysisResult, tags=["analysis"])
def analysis_customer(
    profile: CustomerProfile, _payload: dict = Depends(verify_supabase_token)
):
    try:
        customer_data = profile.model_dump(by_alias=True)
        result = analyzer.predict_new_customer(customer_data)
        return AnalysisResult(**result)

    except Exception as e:
        raise CustomException(
            status_code=500,
            error_code="ANALYSIS_FAILED",
            message=f"분석 중 오류가 발생했습니다: {str(e)}",
        )

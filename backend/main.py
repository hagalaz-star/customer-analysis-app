import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from analysis import CustomerAnalyzer
from pydantic import BaseModel, Field
from typing import Literal
from core.middleware import setup_cors, logging_middleware
from auth import optional_verify_supabase_token
from core.errors import add_exception_handlers, CustomException
from core.logging_config import setup_logging
from typing import List


# 로깅 설정 실행
setup_logging()

load_dotenv()

# os.path.dirname(서 파일 이름을 제외한 디렉터리(폴더) 경로)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 파일들을 로드하고 찾아내기 위해서
model_path = os.path.join(current_dir, "model.pkl")
scaler_path = os.path.join(current_dir, "scaler.pkl")
columns_path = os.path.join(current_dir, "columns.pkl")


analyzer = CustomerAnalyzer(
    model_path=model_path, scaler_path=scaler_path, columns_path=columns_path
)

app = FastAPI()

# 미들웨어 추가
app.middleware("http")(logging_middleware)  # 로깅 미들웨어를 가장 먼저 추가
setup_cors(app)

# 예외 핸들러 등록
add_exception_handlers(app)


class AnalysisResult(BaseModel):
    predicted_cluster: int
    cluster_name: str
    cluster_description: str


# 타입검사 , 규칙검사 , 데이터 변환 및 파싱
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
        "Weekly", "Monthly", "Annually", "Fortnightly", "Quarterly", "Bi-Weekly"
    ] = Field(..., alias="Frequency of Purchases")

    #  별칭 이름(alias name)을 기준
    model_config = {"populate_by_name": True}


class BatchRequest(BaseModel):
    profiles: List[CustomerProfile]


# 앱이 잘 돌아가는지 실시간 확인
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


@app.post("/api/analysis", response_model=AnalysisResult, tags=["analysis"])
def analysis_customer(
    profile: CustomerProfile, _payload: dict = Depends(optional_verify_supabase_token)
):
    try:
        # dict 로 변환하기
        customer_data = profile.model_dump(by_alias=True)
        result = analyzer.predict_new_customer(customer_data)
        return AnalysisResult(**result)

    except Exception as e:
        raise CustomException(
            status_code=500,
            error_code="ANALYSIS_FAILED",
            message=f"분석 중 오류가 발생했습니다: {str(e)}",
        )


@app.post("/api/analysis/batch", response_model=List[AnalysisResult], tags=["analysis"])
def analysis_batch(
    request: BatchRequest, _payload: dict = Depends(optional_verify_supabase_token)
):
    try:
        results: List[AnalysisResult] = []

        if not request.profiles:
            return results

        for profile in request.profiles:
            customer_data = profile.model_dump(by_alias=True)
            pred = analyzer.predict_new_customer(customer_data)

            results.append(AnalysisResult(**pred))

        return results

    except Exception as e:
        raise CustomException(
            status_code=500,
            error_code="BATCH_ANALYSIS_FAILED",
            message=f"배치 분석 중 오류가 발생했습니다:{str(e)}",
        )


# 요청 준비가 되었는지 확인
@app.get("/readyz", status_code=status.HTTP_200_OK)
def readiness_check():
    components = {
        "model": analyzer.model is not None,
        "scaler": analyzer.scaler is not None,
        "columns": analyzer.original_columns is not None,
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

import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from ..models.analysis import CustomerAnalyzer
from pydantic import BaseModel, Field
from typing import Literal
from operation.core.middleware import setup_cors, logging_middleware
from .auth import optional_verify_supabase_token
from operation.core.errors import add_exception_handlers, CustomException
from operation.core.logging_config import setup_logging
from typing import List, Annotated
from config.settings import setting

# 로깅 설정 실행
setup_logging()
# 로깅 설정을 왜 여기서 부터 시작한걸까?
load_dotenv()

app = FastAPI()

# 미들웨어 추가
app.middleware("http")(logging_middleware)  # 로깅 미들웨어를 가장 먼저 추가
setup_cors(app)

# 예외 핸들러 등록
add_exception_handlers(app)

# analysis.py 학습시 사용했던 전처리와 모델을 재사용
analyzer = CustomerAnalyzer(
    model_path=str(setting.model_path),
    scaler_path=str(setting.scaler_path),
    columns_path=str(setting.columns_path),
)


# 다시 반환할 결과 타입 정의
class AnalysisResult(BaseModel):
    predicted_cluster: int
    cluster_name: str
    cluster_description: str


# 타입검사 , 규칙검사 , 데이터 변환 및 파싱
# Annotated 를 쓰는 이유는  유효성 검사 규칙, 문서에  설명과 예시를 추가
# 이걸 사용한 이유는 사용자의 정보를 다시 리턴할때 타입이 맞는지 검증하기 위해서
class CustomerProfile(BaseModel):
    age: Annotated[
        int,
        Field(
            ..., alias="Age", ge=0, le=120, description="나이는 0-120 사이여야 합니다"
        ),
    ]
    purchase_amount: Annotated[
        float,
        Field(
            ...,
            alias="Purchase Amount (USD)",
            ge=0,
            description="구매 금액은 0 이상이어야 합니다",
        ),
    ]
    subscription_status: Annotated[str | bool, Field(..., alias="Subscription Status")]
    frequency_of_purchases: Annotated[
        Literal[
            "Weekly",
            "Monthly",
            "Annually",
            "Fortnightly",
            "Quarterly",
            "Bi-Weekly",
            "Every 3 Months",
        ],
        Field(..., alias="Frequency of Purchases"),
    ]

    #  별칭 (alias name) 기준
    model_config = {"populate_by_name": True}


# 여러 고객 정보의 리스트 클래스
class BatchRequest(BaseModel):
    profiles: List[CustomerProfile]


# 단일 고객 사용자의 정보를 입력받아 한건의 예측결과를 리턴
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


# 여러명의 고객 정보를 한꺼번에 받고, 각 프로필을 반복처리
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

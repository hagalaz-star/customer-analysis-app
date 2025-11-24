from ..schemas.customer_schema import CustomerProfile
from pydantic import BaseModel
from typing import List
from ..auth import optional_verify_supabase_token
from fastapi import Depends, APIRouter
from operation.core.errors import CustomException
from ...models.analysis import CustomerAnalyzer
from config.settings import setting


router = APIRouter()


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


# 여러 고객 정보의 리스트 클래스
class BatchRequest(BaseModel):
    profiles: List[CustomerProfile]


# 단일 고객 사용자의 정보를 입력받아 한건의 예측결과를 리턴
@router.post("/", response_model=AnalysisResult, tags=["analysis"])
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
@router.post("/batch", response_model=List[AnalysisResult], tags=["analysis"])
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

from pydantic import BaseModel, Field, field_validator
from typing import Annotated, Literal


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
    subscription_status: Annotated[
        str | bool,
        Field(
            ...,
            alias="Subscription Status",
            description='문자열 "Yes"/"No" 또는 bool',
        ),
    ]
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

    #  Pydantic 에서 자동 인식 하는 설정
    model_config = {"populate_by_name": True}

    # Pythantic 에서 제공 하는 도구
    # "subscription_statu" 값이 들어오면 검사해
    @field_validator("subscription_status")
    # 클래스 소속선언
    @classmethod
    # 실제 검사 함수
    # value: str | bool ->
    def normalize_subscription(cls, value: str | bool) -> str:
        if isinstance(value, bool):
            return "Yes" if value else "No"
        normalized = value.strip().title()
        if normalized not in {"Yes", "No"}:
            raise ValueError('Subscription Status must be "Yes" or "No".')
        return normalized

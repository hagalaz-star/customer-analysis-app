from pydantic import BaseModel, Field, model_validator
from typing import Annotated

from .customer_schema import CustomerProfile


class RagQuery(BaseModel):
    profile: CustomerProfile | None = None
    persona_name: Annotated[
        str | None,
        Field(default=None, description="페르소나 이름 (선택)"),
    ]
    persona_description: Annotated[
        str | None,
        Field(default=None, description="페르소나 설명 (선택)"),
    ]
    query_text: Annotated[
        str | None,
        Field(default=None, description="직접 입력한 검색 텍스트 (선택)"),
    ]
    top_k: Annotated[
        int,
        Field(default=1, ge=1, le=10, description="반환할 매치 개수"),
    ]

    # Pydantic v2에서 모델 전체를 대상으로 한 검증을 할 때 쓰는 데코레이터
    @model_validator(mode="after")
    def validate_query(self) -> "RagQuery":
        if not any(
            [
                self.profile,
                self.persona_name,
                self.persona_description,
                self.query_text,
            ]
        ):
            raise ValueError(
                "profile, persona_name, persona_description, query_text 중 하나는 필요합니다."
            )
        return self


class RagMatch(BaseModel):
    title: str
    description: str
    cluster_name: str
    score: float


class RagResponse(BaseModel):
    matches: list[RagMatch]

import os
from fastapi import FastAPI, Depends
from analysis import CustomerAnalyzer
from pydantic import BaseModel, Field, field_validator
from core.middleware import setup_cors
from auth import verify_supabase_token

analyzer = CustomerAnalyzer(
    model_path="model.pkl", scaler_path="scaler.pkl", columns_path="columns.pkl"
)

app = FastAPI()

setup_cors(app)


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
    frequency_of_purchases: str = Field(..., alias="Frequency of Purchases")

    @field_validator("frequency_of_purchases")
    def validate_frequency(cls, v):
        allowed_values = ["Weekly", "Monthly", "Annually", "Fortnightly", "Quarterly"]
        if v not in allowed_values:
            raise ValueError(f"구매 빈도는 {allowed_values} 중 하나여야 합니다")
        return v

    model_config = {"populate_by_name": True}


@app.post("/api/analysis")
def analysis_customer(
    profile: CustomerProfile, _payload: dict = Depends(verify_supabase_token)
):
    try:
        customer_data = profile.model_dump(by_alias=True)
        predicted_cluster = analyzer.predict_new_customer(customer_data)
        return {"predicted_cluster": predicted_cluster}
    except Exception as e:
        return {"error": "분석 중 오류가 발생했습니다", "status": "failed"}

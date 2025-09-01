import os
from fastapi import FastAPI 
from analysis import CustomerAnalyzer
from pydantic import BaseModel , Field
from core.middleware import setup_cors


analyzer = CustomerAnalyzer(model_path = "model.pkl", scaler_path = "scaler.pkl", columns_path= "columns.pkl")

app = FastAPI()

setup_cors(app)


class CustomerProfile(BaseModel):
    Age:int = Field(..., alias= "Age")
    purchase_amount: float = Field(..., alias= "Purchase Amount (USD)")
    subscription_status: bool =  Field(..., alias="Subscription Status")
    frequency_of_purchases: str = Field(..., alias="Frequency of Purchases")

    class Config:
        populate_by_name = True



@app.post("/api/analysis")
def analysis_customer(profile:CustomerProfile):

    customer_data = profile.model_dump(by_alias= True)
    predicted_cluster = analyzer.predict_new_customer(customer_data)

    return {'predicted_cluster': predicted_cluster}



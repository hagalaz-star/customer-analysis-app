import pytest
from fastapi.testclient import TestClient
from main import app

VALID_CUSTOMER_DATA = {
    "Age": 30,
    "Purchase Amount (USD)": 100.0,
    "Subscription Status": True,
    "Frequency of Purchases": "Monthly",
}


def test_access_analysis_without_token(monkeypatch):
    """토큰 없이 /api/analysis 접근 시 401 에러가 발생하는지 테스트"""
    # 인증 우회를 비활성화하여 401을 기대
    monkeypatch.setenv("DISABLE_AUTH", "0")
    client = TestClient(app)
    response = client.post("/api/analysis", json=VALID_CUSTOMER_DATA)
    assert response.status_code == 401


def test_access_analysis_with_invalid_token(monkeypatch):
    """유효하지 않은(가짜) 토큰으로 접근 시 401 에러가 발생하는지 테스트"""
    # 인증 우회를 비활성화하여 401을 기대
    monkeypatch.setenv("DISABLE_AUTH", "0")
    client = TestClient(app)
    response = client.post(
        "/api/analysis",
        headers={"Authorization": "Bearer I_AM_A_FAKE_TOKEN"},
        json=VALID_CUSTOMER_DATA,
    )
    assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__])

import pytest
from starlette.testclient import TestClient
from serving.api.main import app

VAILD_PROFILE_1 = {
    "Age": 30,
    "Purchase Amount (USD)": 120.0,
    "Subscription Status": True,
    "Frequency of Purchases": "Monthly",
}


VAILD_PROFILE_2 = {
    "Age": 45,
    "Purchase Amount (USD)": 60.5,
    "Subscription Status": False,
    "Frequency of Purchases": "Weekly",
}

VAILD_PROFLE = {
    "Age": 25,
    "Purchase Amount (USD)": 40.0,
    "Subscription Status": True,
    "Frequency of Purchases": "Daily",
}


def test_batch_analysis_sucess(monkeypatch):
    monkeypatch.setenv("DISABLE_AUTH", "1")
    client = TestClient(app)

    payload = {"profiles": [VAILD_PROFILE_1, VAILD_PROFILE_2]}
    res = client.post("/api/analysis/batch", json=payload)

    assert res.status_code == 200

    data = res.json()
    assert isinstance(data, list) and len(data) == 2

    for item in data:
        # 스키마 계약 : 키와 타입을 고정
        assert "predicted_cluster" in item
        assert "cluster_name" in item
        assert "cluster_description" in item
        assert isinstance(item["predicted_cluster"], int)
        assert isinstance(item["cluster_name"], str)
        assert isinstance(item["cluster_description"], str)

    assert res.headers.get("X-Request-ID")


def test_batch_analysis_invalid_profile_422(monkeypatch):
    monkeypatch.setenv("DISABLE_AUTH", "1")
    client = TestClient(app)

    payload = {"profiles": [VAILD_PROFILE_1, VAILD_PROFLE]}
    res = client.post("/api/analysis/batch", json=payload)

    assert res.status_code == 422


def test_batch_analysis_empty_list(monkeypatch):
    monkeypatch.setenv("DISABLE_AUTH", "1")
    client = TestClient(app)

    payload = {"profiles": []}
    res = client.post("/api/analysis/batch", json=payload)

    assert res.status_code == 200
    assert res.json() == []
    assert res.headers.get("X-Request-ID")

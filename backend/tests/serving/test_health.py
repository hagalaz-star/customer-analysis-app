from starlette.testclient import TestClient
from serving.api.main import app


def test_healthz_ok(monkeypatch):
    # Ensure healthz passes secret check
    monkeypatch.setenv("SUPABASE_JWT_SECRET", "changeme")
    client = TestClient(app)
    res = client.get("/healthz")
    assert res.status_code == 200
    assert res.headers.get("X-Request-ID")


def test_readyz_ok():
    client = TestClient(app)
    res = client.get("/readyz")
    assert res.status_code == 200
    data = res.json()
    assert data.get("status") == "ready"
    assert res.headers.get("X-Request-ID")

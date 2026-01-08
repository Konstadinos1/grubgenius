"""
Integration tests for WebSocket endpoints
"""
import asyncio
import json
import pytest
from fastapi.testclient import TestClient
from app.main import app


def test_health_endpoint():
    """Test health check endpoint"""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"


def test_root_endpoint():
    """Test root endpoint"""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert "Voice AI Agent" in data["service"]


def test_voice_webhook():
    """Test Twilio voice webhook returns TwiML"""
    client = TestClient(app)
    response = client.post("/voice")
    assert response.status_code == 200
    assert "application/xml" in response.headers["content-type"]
    assert "<Response>" in response.text
    assert "<Stream" in response.text


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

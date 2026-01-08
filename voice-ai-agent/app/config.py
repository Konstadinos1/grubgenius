"""
Configuration management for Voice AI Agent
Loads environment variables and validates settings
"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Twilio Configuration
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_phone_number: str

    # Google Gemini Configuration
    google_api_key: str
    gemini_model: str = "gemini-2.0-flash-exp"

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    websocket_timeout: int = 300
    debug: bool = False

    # Audio Configuration
    twilio_audio_rate: int = 8000  # Twilio uses 8kHz
    gemini_audio_rate: int = 16000  # Gemini expects 16kHz
    audio_encoding: str = "mulaw"

    # System Prompt
    system_prompt: str = """You are a professional voice assistant for GrubGenius restaurant.
Your role is to help customers with:
- Table reservations
- Menu questions
- Hours of operation
- Directions

Guidelines:
- Be warm and conversational
- Keep responses under 3 sentences
- Speak naturally, as if in a phone conversation
- If you don't know something, say so politely
- End with a question to keep conversation flowing"""

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

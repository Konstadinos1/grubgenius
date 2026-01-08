"""
Google Gemini Multimodal Live API Client
Manages WebSocket connection and streaming audio to Gemini
"""
import asyncio
import json
import base64
from typing import Callable, Optional
import google.generativeai as genai
from google.generativeai import types
import websockets

class GeminiLiveClient:
    """
    Client for Google Gemini Multimodal Live API
    Handles bidirectional audio streaming
    """

    def __init__(self, api_key: str, model_name: str, system_prompt: str):
        """
        Initialize Gemini client

        Args:
            api_key: Google AI API key
            model_name: Gemini model to use
            system_prompt: System instructions for the agent
        """
        genai.configure(api_key=api_key)
        self.model_name = model_name
        self.system_prompt = system_prompt
        self.session = None
        self.is_connected = False

    async def connect(self):
        """
        Establish connection to Gemini Live API
        """
        try:
            # Initialize the model with audio configuration
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=self.system_prompt
            )

            # Start a live session
            self.session = model.start_chat(
                history=[],
                enable_automatic_function_calling=True
            )

            self.is_connected = True
            print("✓ Connected to Gemini Live API")

        except Exception as e:
            print(f"✗ Failed to connect to Gemini: {e}")
            self.is_connected = False
            raise

    async def send_audio(self, audio_base64: str):
        """
        Send audio chunk to Gemini

        Args:
            audio_base64: Base64-encoded PCM audio
        """
        if not self.is_connected or not self.session:
            raise ConnectionError("Not connected to Gemini")

        try:
            # Decode base64 to bytes
            audio_bytes = base64.b64decode(audio_base64)

            # Send to Gemini (implementation depends on Gemini SDK version)
            # For now, we'll accumulate audio and send as text transcription
            # Note: Full audio streaming requires Gemini 2.0 Live API

            # Placeholder for audio streaming
            # In production, use Gemini's live audio API when available
            pass

        except Exception as e:
            print(f"Error sending audio to Gemini: {e}")

    async def send_text(self, text: str) -> str:
        """
        Send text to Gemini and get response
        (Alternative to audio streaming)

        Args:
            text: User's transcribed text

        Returns:
            Gemini's text response
        """
        if not self.session:
            await self.connect()

        try:
            response = self.session.send_message(text)
            return response.text
        except Exception as e:
            print(f"Error getting Gemini response: {e}")
            return "I apologize, I'm having trouble processing that right now."

    async def close(self):
        """
        Close connection to Gemini
        """
        self.is_connected = False
        self.session = None
        print("✓ Disconnected from Gemini")


class GeminiStreamHandler:
    """
    Advanced handler for Gemini audio streaming
    Uses the Gemini 2.0 Multimodal Live API (WebSocket-based)
    """

    def __init__(self, api_key: str, system_prompt: str):
        self.api_key = api_key
        self.system_prompt = system_prompt
        self.ws = None
        self.audio_callback = None

    async def connect_websocket(self):
        """
        Connect to Gemini's WebSocket endpoint for live audio
        """
        # Gemini Live API WebSocket URL
        url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={self.api_key}"

        try:
            self.ws = await websockets.connect(url)

            # Send initial configuration
            setup_message = {
                "setup": {
                    "model": "models/gemini-2.0-flash-exp",
                    "system_instruction": {
                        "parts": [{"text": self.system_prompt}]
                    },
                    "generation_config": {
                        "response_modalities": ["AUDIO"],
                        "speech_config": {
                            "voice_config": {
                                "prebuilt_voice_config": {
                                    "voice_name": "Aoede"  # Female voice
                                }
                            }
                        }
                    }
                }
            }

            await self.ws.send(json.dumps(setup_message))
            print("✓ Connected to Gemini WebSocket")

        except Exception as e:
            print(f"✗ Failed to connect to Gemini WebSocket: {e}")
            raise

    async def send_audio_chunk(self, audio_pcm_base64: str):
        """
        Send audio chunk to Gemini via WebSocket

        Args:
            audio_pcm_base64: Base64-encoded 16kHz PCM audio
        """
        if not self.ws:
            await self.connect_websocket()

        message = {
            "realtime_input": {
                "media_chunks": [
                    {
                        "mime_type": "audio/pcm",
                        "data": audio_pcm_base64
                    }
                ]
            }
        }

        await self.ws.send(json.dumps(message))

    async def receive_responses(self, callback: Callable):
        """
        Listen for responses from Gemini

        Args:
            callback: Async function to call with audio/text responses
        """
        self.audio_callback = callback

        try:
            async for message in self.ws:
                data = json.loads(message)

                # Handle audio response
                if "serverContent" in data:
                    content = data["serverContent"]

                    if "modelTurn" in content:
                        parts = content["modelTurn"]["parts"]

                        for part in parts:
                            # Audio response
                            if "inlineData" in part:
                                audio_data = part["inlineData"]["data"]
                                await callback(audio_data, "audio")

                            # Text response
                            elif "text" in part:
                                text_data = part["text"]
                                await callback(text_data, "text")

        except websockets.exceptions.ConnectionClosed:
            print("Gemini WebSocket connection closed")
        except Exception as e:
            print(f"Error receiving from Gemini: {e}")

    async def close(self):
        """Close WebSocket connection"""
        if self.ws:
            await self.ws.close()
            print("✓ Closed Gemini WebSocket")

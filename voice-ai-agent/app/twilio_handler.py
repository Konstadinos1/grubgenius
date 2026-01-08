"""
Twilio Media Streams WebSocket Handler
Receives audio from Twilio phone calls and bridges to Gemini
"""
import json
import asyncio
from typing import Optional
from fastapi import WebSocket
from app.audio_converter import AudioConverter
from app.gemini_client import GeminiStreamHandler
from app.config import settings

class TwilioMediaStreamHandler:
    """
    Handles Twilio Media Stream WebSocket connection
    Bridges audio between Twilio caller and Gemini AI
    """

    def __init__(self, websocket: WebSocket):
        """
        Initialize handler

        Args:
            websocket: FastAPI WebSocket connection from Twilio
        """
        self.websocket = websocket
        self.stream_sid = None
        self.call_sid = None
        self.audio_converter = AudioConverter(
            input_rate=settings.twilio_audio_rate,
            output_rate=settings.gemini_audio_rate
        )
        self.gemini_client = GeminiStreamHandler(
            api_key=settings.google_api_key,
            system_prompt=settings.system_prompt
        )
        self.is_active = False

    async def handle_connection(self):
        """
        Main handler for the WebSocket connection
        Manages the complete call lifecycle
        """
        try:
            # Accept WebSocket connection from Twilio
            await self.websocket.accept()
            print("✓ WebSocket connection accepted from Twilio")

            # Connect to Gemini
            await self.gemini_client.connect_websocket()

            # Start listening for Gemini responses
            asyncio.create_task(self._listen_to_gemini())

            self.is_active = True

            # Main message loop - receive from Twilio
            while self.is_active:
                message = await self.websocket.receive_text()
                await self._process_twilio_message(message)

        except Exception as e:
            print(f"Error in WebSocket handler: {e}")
        finally:
            await self.cleanup()

    async def _process_twilio_message(self, message: str):
        """
        Process incoming message from Twilio

        Twilio sends three types of messages:
        1. 'start' - Call initiated
        2. 'media' - Audio chunk
        3. 'stop' - Call ended

        Args:
            message: JSON string from Twilio
        """
        try:
            data = json.loads(message)
            event_type = data.get('event')

            if event_type == 'start':
                await self._handle_start(data)

            elif event_type == 'media':
                await self._handle_media(data)

            elif event_type == 'stop':
                await self._handle_stop(data)

        except json.JSONDecodeError as e:
            print(f"Invalid JSON from Twilio: {e}")
        except Exception as e:
            print(f"Error processing Twilio message: {e}")

    async def _handle_start(self, data: dict):
        """
        Handle call start event

        Args:
            data: Start event data from Twilio
        """
        self.stream_sid = data['start']['streamSid']
        self.call_sid = data['start']['callSid']

        print(f"📞 Call started - StreamSID: {self.stream_sid}")
        print(f"   CallSID: {self.call_sid}")

        # Send initial greeting to caller
        await self._send_greeting()

    async def _handle_media(self, data: dict):
        """
        Handle incoming audio chunk from Twilio

        Args:
            data: Media event containing Base64 μ-law audio
        """
        try:
            # Extract audio payload
            media = data['media']
            mulaw_base64 = media['payload']

            # Convert Twilio audio (μ-law 8kHz) → Gemini audio (PCM 16kHz)
            pcm_base64 = self.audio_converter.twilio_to_gemini(mulaw_base64)

            if pcm_base64:
                # Send converted audio to Gemini
                await self.gemini_client.send_audio_chunk(pcm_base64)

        except Exception as e:
            print(f"Error handling media: {e}")

    async def _handle_stop(self, data: dict):
        """
        Handle call end event

        Args:
            data: Stop event data from Twilio
        """
        print(f"📴 Call ended - StreamSID: {self.stream_sid}")
        self.is_active = False

    async def _listen_to_gemini(self):
        """
        Listen for responses from Gemini and send to Twilio
        Runs in background task
        """
        async def gemini_callback(data: str, data_type: str):
            """
            Callback for Gemini responses

            Args:
                data: Audio (Base64) or text response
                data_type: 'audio' or 'text'
            """
            if data_type == "audio":
                # Convert Gemini audio (PCM 16kHz) → Twilio audio (μ-law 8kHz)
                mulaw_base64 = self.audio_converter.gemini_to_twilio(data)

                # Send audio to Twilio
                await self._send_audio_to_twilio(mulaw_base64)

            elif data_type == "text":
                print(f"Gemini (text): {data}")

        # Start receiving from Gemini
        await self.gemini_client.receive_responses(gemini_callback)

    async def _send_audio_to_twilio(self, mulaw_base64: str):
        """
        Send audio back to Twilio caller

        Args:
            mulaw_base64: Base64-encoded μ-law audio
        """
        message = {
            "event": "media",
            "streamSid": self.stream_sid,
            "media": {
                "payload": mulaw_base64
            }
        }

        await self.websocket.send_json(message)

    async def _send_greeting(self):
        """
        Send initial greeting when call starts
        Note: For production, use Gemini's audio response instead
        """
        # Mark the stream as ready
        mark_message = {
            "event": "mark",
            "streamSid": self.stream_sid,
            "mark": {
                "name": "greeting_sent"
            }
        }
        await self.websocket.send_json(mark_message)

    async def cleanup(self):
        """
        Clean up resources when call ends
        """
        self.is_active = False
        await self.gemini_client.close()
        self.audio_converter.reset_state()
        print("✓ Cleaned up call resources")

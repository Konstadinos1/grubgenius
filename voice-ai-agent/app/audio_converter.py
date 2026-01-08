"""
Audio format converter for Twilio (μ-law) ↔ Gemini (PCM)

Handles the critical conversion between:
- Twilio: 8kHz μ-law (G.711) encoded, Base64
- Gemini: 16kHz Linear PCM, Base64
"""
import base64
import audioop
from typing import bytes as Bytes

class AudioConverter:
    """
    Converts audio between Twilio and Gemini formats
    """

    def __init__(self, input_rate: int = 8000, output_rate: int = 16000):
        """
        Initialize audio converter

        Args:
            input_rate: Twilio sample rate (default 8000 Hz)
            output_rate: Gemini sample rate (default 16000 Hz)
        """
        self.input_rate = input_rate
        self.output_rate = output_rate
        self.state = None  # For ratecv state persistence

    def twilio_to_gemini(self, base64_mulaw: str) -> str:
        """
        Convert Twilio's μ-law audio to Gemini's PCM format

        Steps:
        1. Decode Base64 to get μ-law bytes
        2. Convert μ-law to linear PCM (16-bit)
        3. Resample from 8kHz to 16kHz
        4. Encode back to Base64 for Gemini

        Args:
            base64_mulaw: Base64-encoded μ-law audio from Twilio

        Returns:
            Base64-encoded 16kHz PCM audio for Gemini
        """
        try:
            # Step 1: Decode Base64
            mulaw_data = base64.b64decode(base64_mulaw)

            # Step 2: Convert μ-law to linear PCM (16-bit samples)
            # audioop.ulaw2lin converts μ-law to linear PCM
            # width=2 means 16-bit samples (2 bytes per sample)
            pcm_data = audioop.ulaw2lin(mulaw_data, 2)

            # Step 3: Resample from 8kHz to 16kHz
            # This doubles the sample rate
            if self.input_rate != self.output_rate:
                pcm_resampled, self.state = audioop.ratecv(
                    pcm_data,           # Input audio data
                    2,                  # Sample width (2 bytes = 16-bit)
                    1,                  # Number of channels (mono)
                    self.input_rate,    # Input sample rate (8000)
                    self.output_rate,   # Output sample rate (16000)
                    self.state          # State for continuity
                )
            else:
                pcm_resampled = pcm_data

            # Step 4: Encode to Base64 for Gemini
            base64_pcm = base64.b64encode(pcm_resampled).decode('utf-8')

            return base64_pcm

        except Exception as e:
            print(f"Error converting Twilio→Gemini audio: {e}")
            return ""

    def gemini_to_twilio(self, base64_pcm: str) -> str:
        """
        Convert Gemini's PCM audio back to Twilio's μ-law format

        Steps:
        1. Decode Base64 PCM
        2. Resample from 16kHz to 8kHz
        3. Convert linear PCM to μ-law
        4. Encode to Base64 for Twilio

        Args:
            base64_pcm: Base64-encoded PCM audio from Gemini

        Returns:
            Base64-encoded μ-law audio for Twilio
        """
        try:
            # Step 1: Decode Base64
            pcm_data = base64.b64decode(base64_pcm)

            # Step 2: Resample from 16kHz to 8kHz
            if self.output_rate != self.input_rate:
                pcm_resampled, _ = audioop.ratecv(
                    pcm_data,
                    2,                  # 16-bit samples
                    1,                  # Mono
                    self.output_rate,   # From 16kHz
                    self.input_rate,    # To 8kHz
                    None
                )
            else:
                pcm_resampled = pcm_data

            # Step 3: Convert linear PCM to μ-law
            mulaw_data = audioop.lin2ulaw(pcm_resampled, 2)

            # Step 4: Encode to Base64
            base64_mulaw = base64.b64encode(mulaw_data).decode('utf-8')

            return base64_mulaw

        except Exception as e:
            print(f"Error converting Gemini→Twilio audio: {e}")
            return ""

    def reset_state(self):
        """Reset the resampling state (call between conversations)"""
        self.state = None

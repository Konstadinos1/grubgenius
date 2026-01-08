"""
Unit tests for audio conversion
"""
import base64
import pytest
from app.audio_converter import AudioConverter


def test_audio_converter_initialization():
    """Test AudioConverter initialization"""
    converter = AudioConverter(input_rate=8000, output_rate=16000)
    assert converter.input_rate == 8000
    assert converter.output_rate == 16000
    assert converter.state is None


def test_mulaw_to_pcm_conversion():
    """Test μ-law to PCM conversion"""
    converter = AudioConverter()

    # Create sample μ-law data (silence)
    mulaw_data = b'\xff' * 160  # 20ms of μ-law audio at 8kHz
    mulaw_base64 = base64.b64encode(mulaw_data).decode('utf-8')

    # Convert
    pcm_base64 = converter.twilio_to_gemini(mulaw_base64)

    # Verify output exists
    assert pcm_base64 != ""
    assert len(pcm_base64) > 0

    # Verify output is roughly 2x input (due to upsampling)
    pcm_data = base64.b64decode(pcm_base64)
    assert len(pcm_data) >= len(mulaw_data) * 1.8


def test_pcm_to_mulaw_conversion():
    """Test PCM to μ-law conversion"""
    converter = AudioConverter()

    # Create sample PCM data (silence) - 16-bit samples
    pcm_data = b'\x00\x00' * 320  # 20ms of 16kHz PCM audio
    pcm_base64 = base64.b64encode(pcm_data).decode('utf-8')

    # Convert
    mulaw_base64 = converter.gemini_to_twilio(pcm_base64)

    # Verify output exists
    assert mulaw_base64 != ""
    assert len(mulaw_base64) > 0


def test_reset_state():
    """Test state reset"""
    converter = AudioConverter()

    # Do a conversion to set state
    mulaw_data = b'\xff' * 160
    mulaw_base64 = base64.b64encode(mulaw_data).decode('utf-8')
    converter.twilio_to_gemini(mulaw_base64)

    # Reset
    converter.reset_state()
    assert converter.state is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

"""
Main FastAPI application for Voice AI Agent
Provides WebSocket endpoint for Twilio Media Streams
"""
from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import Response, PlainTextResponse
from app.twilio_handler import TwilioMediaStreamHandler
from app.config import settings
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Voice AI Agent",
    description="Real-time voice AI using Twilio + Gemini",
    version="1.0.0"
)

# ============================================================================
# HEALTH CHECK ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "Voice AI Agent",
        "model": settings.gemini_model
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "twilio_configured": bool(settings.twilio_account_sid),
        "gemini_configured": bool(settings.google_api_key)
    }

# ============================================================================
# TWILIO VOICE WEBHOOK
# ============================================================================

@app.post("/voice")
async def voice_webhook(request: Request):
    """
    Twilio voice webhook - receives incoming calls
    Returns TwiML to connect call to WebSocket

    This endpoint is called when someone dials your Twilio number
    """
    # Get the WebSocket URL for this server
    # Replace with your actual public URL in production
    host = request.headers.get("host", "your-server.grubgenius.com")
    ws_url = f"wss://{host}/media-stream"

    # Return TwiML that connects call to WebSocket
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">Please wait while we connect your call.</Say>
    <Connect>
        <Stream url="{ws_url}" />
    </Connect>
</Response>"""

    return Response(content=twiml, media_type="application/xml")

# ============================================================================
# WEBSOCKET ENDPOINT FOR TWILIO MEDIA STREAMS
# ============================================================================

@app.websocket("/media-stream")
async def media_stream_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for Twilio Media Streams

    This is where the magic happens:
    1. Twilio connects and streams audio
    2. We convert and send to Gemini
    3. Gemini responds with audio
    4. We convert and send back to Twilio

    Args:
        websocket: WebSocket connection from Twilio
    """
    print("\n" + "="*60)
    print("📞 New incoming call - WebSocket connection initiated")
    print("="*60)

    # Create handler for this call
    handler = TwilioMediaStreamHandler(websocket)

    try:
        # Handle the entire call lifecycle
        await handler.handle_connection()
    except Exception as e:
        print(f"❌ Error in media stream: {e}")
    finally:
        print("="*60)
        print("📴 Call ended - WebSocket closed")
        print("="*60 + "\n")

# ============================================================================
# TWILIO STATUS CALLBACK (Optional)
# ============================================================================

@app.post("/status-callback")
async def status_callback(request: Request):
    """
    Optional: Receive call status updates from Twilio
    Useful for logging and analytics
    """
    form_data = await request.form()
    call_status = form_data.get("CallStatus")
    call_sid = form_data.get("CallSid")

    print(f"Call {call_sid} status: {call_status}")

    return PlainTextResponse("OK")

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler
    Prevents server crashes from breaking active calls
    """
    print(f"❌ Unhandled exception: {exc}")
    return Response(
        content="Internal server error",
        status_code=500
    )

# ============================================================================
# APPLICATION STARTUP
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Starting Voice AI Agent Server")
    print("="*60)
    print(f"Model: {settings.gemini_model}")
    print(f"Host: {settings.host}:{settings.port}")
    print(f"Debug: {settings.debug}")
    print("="*60 + "\n")

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )

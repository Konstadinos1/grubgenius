# Voice AI Agent for GrubGenius

Real-time Voice AI Agent that handles inbound phone calls using Twilio Media Streams and Google Gemini.

## Features

- 📞 Real-time phone call handling
- 🤖 Google Gemini AI-powered conversations
- 🎙️ Automatic audio format conversion (μ-law ↔ PCM)
- 🔄 WebSocket-based streaming for low latency
- 🐳 Docker-ready deployment
- 📊 Health monitoring endpoints

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Twilio    │ ──WSS──→│   FastAPI    │ ──WSS──→│ Google Gemini   │
│ Media Stream│         │  WebSocket   │         │ Multimodal Live │
└─────────────┘         └──────────────┘         └─────────────────┘
    μ-law 8kHz              Bridge Layer           PCM 16kHz/24kHz
```

## Quick Start

### Prerequisites

- Python 3.11+
- Twilio account with phone number
- Google Gemini API key

### Installation

1. **Clone and navigate to directory**
```bash
cd voice-ai-agent
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
```bash
cp .env.example .env
nano .env  # Add your API keys
```

Required environment variables:
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

4. **Run the server**
```bash
python -m app.main
```

The server will start on `http://localhost:8000`

### Testing Locally

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","twilio_configured":true,"gemini_configured":true}
```

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Production Deployment

See [Complete Deployment Guide](../docs/VOICE_AI_DEPLOYMENT.md) for detailed production deployment instructions.

**Quick production checklist:**
1. Set up Ubuntu server (2GB RAM minimum)
2. Install SSL certificate (Let's Encrypt)
3. Configure Nginx reverse proxy
4. Set up Twilio webhook: `https://your-server.com/voice`
5. Deploy with systemd service

## Configuration

### Twilio Setup

1. **Purchase a phone number:**
```bash
twilio phone-numbers:buy:local --country-code US --area-code 415
```

2. **Configure voice webhook:**
```bash
twilio phone-numbers:update +1415XXXXXXX \
  --voice-url="https://your-server.com/voice" \
  --voice-method="POST"
```

Or configure via Twilio Console:
- Go to Phone Numbers → Active Numbers
- Set Voice Webhook: `https://your-server.com/voice` (HTTP POST)

### Customizing the AI Assistant

Edit the system prompt in `app/config.py`:

```python
system_prompt: str = """You are a professional voice assistant for GrubGenius restaurant.
Your role is to help customers with:
- Table reservations
- Menu questions
- Hours of operation

Be warm, conversational, and keep responses under 3 sentences."""
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed health status |
| `/voice` | POST | Twilio voice webhook (returns TwiML) |
| `/media-stream` | WebSocket | Twilio Media Streams connection |
| `/status-callback` | POST | Optional call status updates |

## File Structure

```
voice-ai-agent/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── audio_converter.py   # Audio format conversion
│   ├── gemini_client.py     # Gemini API client
│   └── twilio_handler.py    # Twilio WebSocket handler
├── twiml/
│   └── connect.xml          # TwiML template
├── tests/
│   ├── test_audio.py        # Audio conversion tests
│   └── test_websocket.py    # WebSocket endpoint tests
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
└── .env.example           # Environment variables template
```

## Testing

Run unit tests:
```bash
# Install test dependencies
pip install pytest

# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_audio.py -v
```

## Troubleshooting

### WebSocket Connection Issues

**Problem:** WebSocket disconnects immediately

**Solution:**
1. Verify server is publicly accessible
2. Check SSL certificate is valid (Twilio requires HTTPS)
3. Ensure webhook URL matches: `wss://your-server.com/media-stream`

### Audio Quality Problems

**Problem:** Choppy or robotic audio

**Solution:**
1. Check sample rate conversion in logs
2. Verify network latency < 50ms to Google
3. Monitor CPU usage (should be < 40% per call)

### Gemini API Errors

**Problem:** Error 429 (Rate limiting)

**Solution:**
- Check quota: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
- Implement retry logic with exponential backoff
- Request quota increase if needed

## Performance Benchmarks

Expected performance:

| Metric | Target |
|--------|--------|
| End-to-end latency | < 1.5s |
| Concurrent calls | 50+ |
| WebSocket uptime | > 99.9% |
| Memory per call | < 100MB |

## Cost Estimates

For 1000 minutes/month:
- Server (2GB VPS): $12/month
- Twilio phone: $1/month
- Twilio usage: $8.50
- Gemini API: ~$10
- **Total: ~$31.50/month**

## Resources

- [Complete Deployment Guide](../docs/VOICE_AI_DEPLOYMENT.md)
- [Twilio Media Streams Docs](https://www.twilio.com/docs/voice/media-streams)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)

## Support

For issues and questions:
1. Check the [troubleshooting guide](../docs/VOICE_AI_DEPLOYMENT.md#troubleshooting)
2. Review server logs: `docker-compose logs -f`
3. Test individual components with unit tests

## License

MIT License - Part of GrubGenius Restaurant Marketing AI Platform

# 📞 Voice AI Agent Deployment Guide
## Technical Implementation Handbook for GrubGenius

---

## Table of Contents
1. [Overview](#overview)
2. [Scenario A: Speed-to-Market Path (Wrapper Method)](#scenario-a)
3. [Scenario B: Custom Engineering Path (Python Stack)](#scenario-b)
4. [Production Deployment Checklist](#deployment-checklist)
5. [Troubleshooting & Common Issues](#troubleshooting)

---

<a name="overview"></a>
## Overview

This guide provides two implementation paths for deploying a real-time Voice AI Agent that handles inbound phone calls for your restaurant business.

**Use Cases:**
- 📞 Automated reservation handling
- ❓ Menu inquiries and recommendations
- 🕐 Hours of operation and directions
- 📋 Order taking and customization

---

<a name="scenario-a"></a>
## SCENARIO A: The "Speed-to-Market" Path (Wrapper Method)

### Overview
Use Vapi.ai or Retell AI as middleware to connect phone infrastructure to Google Gemini. This approach gets you live in **under 1 hour** but with monthly subscription costs.

### Architecture Flow
```
Inbound Call → Vapi/Retell Phone Number → Platform Routes to Gemini → Response → Caller
```

---

### Option 1: Using Vapi.ai

#### Step-by-Step Configuration

**1. Account Setup**
- [ ] Sign up at https://vapi.ai
- [ ] Navigate to Dashboard → API Keys
- [ ] Copy your `VAPI_API_KEY` (starts with `vapi_`)

**2. Configure Gemini Integration**
- [ ] Go to "Models" section
- [ ] Click "Add Custom Model"
- [ ] Select "Google Gemini" from provider list
- [ ] Enter your Google AI Studio API key (get from https://aistudio.google.com/apikey)
- [ ] Select model: `gemini-2.0-flash-exp` (recommended for voice)

**3. Provision Phone Number**
- [ ] Navigate to "Phone Numbers"
- [ ] Click "Buy Number"
- [ ] Select country/area code
- [ ] Cost: ~$1/month + $0.01/min usage

**4. Create Voice Assistant**
- [ ] Go to "Assistants" → "Create New"
- [ ] Configure settings:

```json
{
  "name": "GrubGenius Restaurant Assistant",
  "model": {
    "provider": "google",
    "model": "gemini-2.0-flash-exp",
    "temperature": 0.7,
    "maxTokens": 500
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  },
  "firstMessage": "Hi! Thanks for calling GrubGenius. How can I help you today?",
  "systemPrompt": "You are a friendly restaurant assistant for GrubGenius. Help customers with reservations, menu questions, and hours. Keep responses under 2 sentences. Never provide information you're unsure about. Be warm and conversational.",
  "endCallFunctionEnabled": true,
  "recordingEnabled": true
}
```

**5. Link Phone Number to Assistant**
- [ ] Go to your phone number settings
- [ ] Under "Assistant", select the assistant you created
- [ ] Save changes

**6. Test the System**
```bash
# Call your Vapi number and verify:
- Call connects within 2 seconds
- First message plays correctly
- Gemini responds appropriately
- No audio delays > 3 seconds
```

**7. Advanced Configuration (Optional)**
```javascript
// Custom function calling for booking reservations
{
  "functions": [
    {
      "name": "create_reservation",
      "description": "Books a table reservation",
      "parameters": {
        "type": "object",
        "properties": {
          "date": { "type": "string" },
          "time": { "type": "string" },
          "party_size": { "type": "number" },
          "customer_name": { "type": "string" },
          "phone": { "type": "string" }
        },
        "required": ["date", "time", "party_size"]
      },
      "url": "https://your-api.grubgenius.com/reservations",
      "method": "POST"
    }
  ]
}
```

---

### Option 2: Using Retell AI

#### Step-by-Step Configuration

**1. Account Setup**
- [ ] Sign up at https://retellai.com
- [ ] Get API key from Settings → API Keys
- [ ] Install Retell CLI: `npm install -g retell-sdk`

**2. Create Custom LLM Configuration**

```bash
# Create a custom LLM config file
cat > gemini_config.json << EOF
{
  "llm_type": "custom_llm",
  "custom_llm_websocket_url": "wss://your-server.grubgenius.com/gemini-bridge",
  "general_prompt": "You are a professional restaurant assistant for GrubGenius. Answer questions about reservations, menu items, and hours of operation. Be concise and friendly.",
  "begin_message": "Hello! Thanks for calling GrubGenius. How may I assist you?",
  "general_tools": []
}
EOF
```

**3. Set Up Gemini Bridge Server** (Required for Retell)

You'll need a small WebSocket server to bridge Retell ↔ Gemini:

```python
# retell_gemini_bridge.py
import asyncio
import websockets
import json
import google.generativeai as genai
from fastapi import FastAPI, WebSocket
import uvicorn

app = FastAPI()
genai.configure(api_key="YOUR_GEMINI_API_KEY")

@app.websocket("/gemini-bridge")
async def gemini_bridge(websocket: WebSocket):
    await websocket.accept()

    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    chat = model.start_chat(history=[])

    try:
        while True:
            # Receive message from Retell
            data = await websocket.receive_json()

            if data.get("type") == "user_speech":
                user_text = data["transcript"]

                # Send to Gemini
                response = chat.send_message(user_text)

                # Send back to Retell
                await websocket.send_json({
                    "type": "agent_response",
                    "text": response.text
                })
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**4. Deploy Bridge & Configure Retell**
```bash
# Deploy your bridge server
python retell_gemini_bridge.py

# Use Retell CLI to create agent
retell create-agent \
  --llm-config gemini_config.json \
  --voice-id "openai-alloy" \
  --language "en-US"

# Note the agent_id returned
```

**5. Purchase & Configure Phone Number**
```bash
retell purchase-number --area-code 415
retell link-number --number "+14155551234" --agent-id "agent_xxxxx"
```

---

### Comparison: Vapi vs Retell

| Feature | Vapi.ai | Retell AI |
|---------|---------|-----------|
| Setup Time | 15 minutes | 30 minutes (needs bridge) |
| Cost | $0.05/min | $0.04/min |
| Latency | ~800ms | ~600ms |
| Custom Functions | Native support | Webhook-based |
| Gemini Integration | Direct | Requires bridge server |

**Recommendation**: Use **Vapi.ai** if you want zero code. Use **Retell AI** if you need lower latency and already have infrastructure.

---

<a name="scenario-b"></a>
## SCENARIO B: The "Custom Engineering" Path

### Architecture Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Twilio    │ ──WSS──→│   FastAPI    │ ──WSS──→│ Google Gemini   │
│ Media Stream│         │  WebSocket   │         │ Multimodal Live │
└─────────────┘         └──────────────┘         └─────────────────┘
    μ-law 8kHz              Bridge Layer           PCM 16kHz/24kHz
```

### Implementation Guide

The complete Python implementation is available in the `/voice-ai-agent` directory.

**Directory Structure:**
```
voice-ai-agent/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── twilio_handler.py       # Twilio WebSocket handler
│   ├── gemini_client.py        # Gemini API client
│   ├── audio_converter.py      # Audio format conversion
│   └── config.py               # Configuration management
├── twiml/
│   └── connect.xml             # TwiML response
├── tests/
│   ├── test_audio.py
│   └── test_websocket.py
├── .env.example
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Quick Start

```bash
# Navigate to voice-ai-agent directory
cd voice-ai-agent

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # Add your API keys

# Run locally
python -m app.main

# Test health endpoint
curl http://localhost:8000/health
```

### Audio Format Conversion

The system handles the critical conversion between:
- **Twilio**: 8kHz μ-law (G.711) encoded, Base64
- **Gemini**: 16kHz Linear PCM, Base64

The `AudioConverter` class in `app/audio_converter.py` handles this conversion seamlessly.

### Twilio Configuration

**1. Purchase a Phone Number**
```bash
# Install Twilio CLI
npm install -g twilio-cli

# Login
twilio login

# Buy a number
twilio phone-numbers:buy:local --country-code US --area-code 415
```

**2. Configure Webhook**
```bash
# Set voice webhook URL
twilio phone-numbers:update +1415XXXXXXX \
  --voice-url="https://your-server.grubgenius.com/voice" \
  --voice-method="POST"
```

**Or configure via Twilio Console:**
- Go to Phone Numbers → Manage → Active Numbers
- Click your number
- Under "Voice & Fax":
  - **A CALL COMES IN**: Webhook → `https://your-server.grubgenius.com/voice` → HTTP POST

---

<a name="deployment-checklist"></a>
## Production Deployment Checklist

### Pre-Launch

- [ ] **Server Setup**
  - [ ] Ubuntu 22.04 LTS or similar
  - [ ] Minimum 2GB RAM, 2 vCPUs
  - [ ] Public IP address assigned
  - [ ] Firewall configured (ports 80, 443, 8000)

- [ ] **Domain & SSL**
  - [ ] Domain name purchased (e.g., `api.grubgenius.com`)
  - [ ] DNS A record pointing to server IP
  - [ ] SSL certificate installed (Let's Encrypt)
  - [ ] HTTPS working (`https://api.grubgenius.com/health`)

- [ ] **Twilio Configuration**
  - [ ] Phone number purchased
  - [ ] Voice webhook configured: `https://api.grubgenius.com/voice`
  - [ ] Media streaming enabled on account
  - [ ] Test call completes successfully

- [ ] **Google Gemini**
  - [ ] API key generated
  - [ ] Billing enabled on Google Cloud
  - [ ] Quota limits reviewed (default: 1500 requests/min)
  - [ ] Test API call succeeds

- [ ] **Application Testing**
  - [ ] Local tests pass
  - [ ] WebSocket connection stable
  - [ ] Audio quality acceptable
  - [ ] Latency < 2 seconds end-to-end
  - [ ] Load testing completed (10 concurrent calls)

### Monitoring Setup

- [ ] **Logging**
  - [ ] Structured logging configured
  - [ ] Log rotation enabled (`logrotate`)
  - [ ] Centralized logging (e.g., CloudWatch, Datadog)

- [ ] **Metrics**
  - [ ] Call duration tracking
  - [ ] Error rate monitoring
  - [ ] WebSocket disconnection alerts
  - [ ] API quota usage alerts

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar configured
  - [ ] Alert on 3+ failed health checks
  - [ ] PagerDuty/Slack notifications

### Security

- [ ] **API Keys**
  - [ ] All keys in `.env` file (not in code)
  - [ ] `.env` excluded from git (`.gitignore`)
  - [ ] Key rotation policy defined

- [ ] **Network Security**
  - [ ] Firewall rules configured
  - [ ] Rate limiting enabled (100 req/min per IP)
  - [ ] DDoS protection (Cloudflare)

- [ ] **Access Control**
  - [ ] SSH key-only authentication
  - [ ] Sudo access restricted
  - [ ] Application runs as non-root user

---

<a name="troubleshooting"></a>
## Troubleshooting & Common Issues

### Issue 1: WebSocket Immediately Disconnects

**Symptoms:**
```
WebSocket connection accepted from Twilio
Error: Connection closed before receiving start event
```

**Causes & Solutions:**

1. **Twilio can't reach your server**
   ```bash
   # Test if webhook is accessible
   curl https://your-server.grubgenius.com/voice

   # Should return TwiML XML
   ```
   **Fix:** Ensure server is publicly accessible and DNS is configured

2. **SSL certificate issues**
   ```bash
   # Test SSL
   curl -vI https://your-server.grubgenius.com

   # Look for "SSL certificate verify ok"
   ```
   **Fix:** Install valid SSL certificate (Twilio requires HTTPS)

3. **WebSocket URL mismatch**
   - Check TwiML contains correct `wss://` URL
   - Verify URL matches your FastAPI WebSocket endpoint

---

### Issue 2: Audio Quality Problems

**Symptoms:**
- Choppy or robotic audio
- Echo or feedback
- Caller's voice not heard by AI

**Solutions:**

1. **Check sample rate conversion**
   ```python
   # In audio_converter.py, add debug logging
   def twilio_to_gemini(self, base64_mulaw: str) -> str:
       print(f"Input size: {len(base64.b64decode(base64_mulaw))} bytes")
       # ... conversion code ...
       print(f"Output size: {len(base64.b64decode(base64_pcm))} bytes")
   ```
   - Output should be ~2x input (due to 8kHz→16kHz upsampling)

2. **Verify audio codec**
   ```python
   # Ensure Twilio is sending μ-law
   # In _handle_start():
   print(f"Codec: {data['start']['mediaFormat']['encoding']}")
   # Should print: "audio/x-mulaw"
   ```

3. **Buffer size issues**
   - Twilio sends 20ms chunks (160 bytes μ-law)
   - If chunks are concatenated, adjust buffering logic

---

### Issue 3: Gemini API Errors

**Symptoms:**
```
Error 429: Resource exhausted
Error 401: Invalid API key
Error 500: Internal error
```

**Solutions:**

1. **Rate limiting (429)**
   ```python
   # Add retry logic with exponential backoff
   import time
   from google.api_core import retry

   @retry.Retry(predicate=retry.if_exception_type(Exception))
   async def send_with_retry(self, audio):
       # Your send logic
   ```

2. **Invalid API key (401)**
   ```bash
   # Test API key directly
   curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"test"}]}]}' \
     "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY"
   ```

3. **Quota exceeded**
   - Check quota: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
   - Request increase if needed

---

### Issue 4: High Latency (>3 seconds)

**Causes:**

1. **Network latency**
   ```bash
   # Test latency to Google
   ping generativelanguage.googleapis.com

   # Should be <50ms
   ```
   **Fix:** Deploy server in same region as Gemini (us-central1)

2. **Audio buffering**
   - Reduce buffer sizes
   - Send smaller, more frequent chunks to Gemini

3. **Gemini processing time**
   ```python
   # Add timing logs
   import time

   start = time.time()
   response = await gemini_client.send_audio(audio)
   print(f"Gemini latency: {time.time() - start:.2f}s")
   ```
   - Should be <1 second
   - If higher, consider using `gemini-2.0-flash` instead of `pro`

---

### Issue 5: Memory Leaks

**Symptoms:**
- Server RAM usage grows over time
- Crashes after several hours

**Solutions:**

1. **Reset audio converter state**
   ```python
   # In cleanup():
   self.audio_converter.reset_state()
   ```

2. **Close WebSocket connections**
   ```python
   # Ensure cleanup() is called
   try:
       await handler.handle_connection()
   finally:
       await handler.cleanup()  # Always runs
   ```

3. **Monitor memory**
   ```bash
   # Install monitoring
   pip install memory-profiler

   # Profile code
   @profile
   async def handle_media(self, data):
       # Your code
   ```

---

## Performance Benchmarks

Expected performance for Scenario B:

| Metric | Target | Acceptable | Concerning |
|--------|--------|------------|------------|
| **End-to-end latency** | <1.5s | <2.5s | >3s |
| **Audio quality (MOS)** | >4.0 | >3.5 | <3.0 |
| **Concurrent calls** | 50+ | 20+ | <10 |
| **WebSocket uptime** | >99.9% | >99% | <98% |
| **Memory per call** | <100MB | <200MB | >500MB |
| **CPU per call** | <20% | <40% | >60% |

---

## Cost Comparison

**Scenario A (Vapi.ai):**
- Setup: $0
- Monthly: $99 (Pro plan)
- Per minute: $0.05
- **Total for 1000 min/month:** $149

**Scenario B (Custom):**
- Server (2GB VPS): $12/month
- Twilio phone: $1/month
- Twilio usage: $0.0085/min
- Gemini API: $0.00025/request (~$0.01/min)
- **Total for 1000 min/month:** $31.50

**Savings with Scenario B:** **78% cheaper at scale**

---

## Additional Resources

- **Twilio Media Streams Docs:** https://www.twilio.com/docs/voice/media-streams
- **Google Gemini API:** https://ai.google.dev/gemini-api/docs
- **Vapi.ai Documentation:** https://docs.vapi.ai
- **Retell AI Documentation:** https://retellai.com/docs
- **FastAPI WebSockets:** https://fastapi.tiangolo.com/advanced/websockets/

---

**Need help?** The most common issues are:
1. SSL certificate configuration (use Let's Encrypt)
2. Audio format conversion (use the provided AudioConverter)
3. WebSocket timeouts (add keepalive pings)

Good luck with your deployment! 🚀

# Restaurant Marketing AI Platform

AI-powered marketing platform for Quick Service Restaurants (QSR) - inspired by Owner.com.

## Features

- 🔍 **AI Competitor Analysis** - Analyze rival restaurants and get actionable insights
- 🎯 **SEO Page Generator** - Create optimized landing pages for menu items
- 📱 **Branded App Builder** - Build custom mobile ordering apps with live preview
- 📞 **Voice AI Agent** - Real-time phone call handling with Google Gemini AI

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

### Frontend
- Vite + Vanilla JavaScript
- Modern CSS with glassmorphism & animations
- SVG-based charts
- SPA routing

### Voice AI Backend
- Python + FastAPI
- Twilio Media Streams (WebSocket)
- Google Gemini Multimodal Live API
- Docker containerization

## Voice AI Agent

Automate customer phone calls with AI-powered voice assistance.

### Quick Setup

Two deployment options available:

**Option A - Speed to Market (15 minutes)**
- Use Vapi.ai or Retell AI as wrapper
- Connect Twilio phone number to Google Gemini
- Zero code required

**Option B - Custom Engineering (Full control)**
- Python + FastAPI + Twilio Media Streams
- Direct integration with Google Gemini
- 78% cheaper at scale

### Get Started

```bash
cd voice-ai-agent
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
python -m app.main
```

📖 **[Complete Deployment Guide](docs/VOICE_AI_DEPLOYMENT.md)**

### Features
- Real-time voice conversations with Gemini AI
- Automatic audio format conversion
- WebSocket-based low-latency streaming
- Docker-ready deployment
- Production-tested architecture

---

## Screenshots

### Dashboard
Analytics overview with charts and AI tool access

### Competitor Analysis
AI-powered insights to outrank competition

### App Builder
Live iPhone mockup with brand customization

## License

MIT

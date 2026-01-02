# AI Phone Agent for QSR

Autonomous voice agent system for handling high-volume inbound calls at Quick Service Restaurants.

## 🎯 Overview

The AI Phone Agent is designed to:
- Answer calls in <1 ring (3-5 seconds)
- Take complex orders with 95%+ accuracy
- Execute strategic upselling (40-60% attachment rate)
- Integrate seamlessly with major POS platforms (Toast, Square, Clover)
- Handle edge cases and gracefully handoff to humans when needed

## 📁 Directory Structure

```
ai-phone-agent/
├── WORKFLOW_PLAN.md           # Comprehensive workflow documentation
├── architecture/               # System architecture diagrams and docs
├── api-schemas/               # API specifications and examples
├── examples/                  # Sample conversation flows and configs
└── README.md                  # This file
```

## 🚀 Quick Start

1. **Read the Workflow Plan**: Start with [WORKFLOW_PLAN.md](./WORKFLOW_PLAN.md) for the complete technical specification

2. **Review Architecture**: Check the `architecture/` folder for system design details

3. **Explore API Schemas**: See `api-schemas/` for POS integration specifications

4. **Test with Examples**: Use conversation flows in `examples/` for testing

## 🏗️ System Architecture

```
Inbound Calls → Telephony (Twilio/Vonage)
              → Voice API (Vapi/Retell)
              → Antigravity AI Platform
              → POS Integration (Toast/Square/Clover)
              → Kitchen Display System
```

## 📊 Key Performance Indicators

| Metric | Target |
|--------|--------|
| Response Time | <1 ring (3-5s) |
| Order Accuracy | >95% |
| Upsell Success | 40-60% |
| Human Handoff | <5% |
| Customer Satisfaction | >4.5/5 |

## 🔧 Integration Requirements

### Required APIs
- **POS System**: Toast, Square, or Clover API access
- **Voice Platform**: Vapi or Retell account
- **Telephony**: Twilio/Vonage SIP trunking
- **Payment**: Stripe or POS-native payment processing

### Environment Variables
```bash
ANTIGRAVITY_API_KEY=your_key_here
VAPI_API_KEY=your_key_here
TOAST_API_KEY=your_key_here  # Or Square/Clover
STRIPE_API_KEY=your_key_here
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
```

## 📝 Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Platform setup (Antigravity, Vapi, POS adapters)
- [ ] Basic order flow (single item, pickup only)
- [ ] Menu data caching system

### Phase 2: Core Features (Week 3-4)
- [ ] Delivery validation
- [ ] Customer lookup
- [ ] Upselling logic
- [ ] Payment processing

### Phase 3: Advanced Features (Week 5-6)
- [ ] Human handoff (SIP transfer)
- [ ] Menu knowledge base (RAG)
- [ ] "The Usual" auto-suggestions
- [ ] Admin dashboard

### Phase 4: Production (Week 7-8)
- [ ] Load testing (100 concurrent calls)
- [ ] Failover testing
- [ ] Latency optimization
- [ ] Soft launch (20% traffic)

## 🎤 Sample Conversation

```
Agent: "Thanks for calling Pizza Pizza, this is Emma.
        Are we starting a new order for pickup or delivery?"

Customer: "Delivery please. Two large pepperonis."

Agent: "Great! What's the delivery address?"

Customer: "123 Main Street."

Agent: "Perfect, we deliver there in 35 minutes.
        Two large pepperonis at $14.99 each. Our wings
        are super popular with that—add an 8-piece for $9.99?"

Customer: "Sure!"

Agent: "Awesome! Your total is $49.16 including tax and delivery.
        What name for the order?"
```

## 🛠️ Tools & Technologies

- **AI Platform**: Antigravity AI
- **LLM**: GPT-4 Turbo / Claude 3.5 Sonnet
- **Voice AI**: Vapi (Deepgram STT + ElevenLabs TTS)
- **POS Integration**: REST APIs (Toast/Square/Clover)
- **Knowledge Base**: Pinecone/Weaviate (RAG)
- **Monitoring**: Custom dashboard + alerts

## 📈 Expected ROI

For a restaurant with 100 calls/day:

| Metric | Before (Human) | After (AI) | Improvement |
|--------|---------------|------------|-------------|
| Answer Rate | 70% | 98% | +40% |
| Orders/Day | 70 | 98 | +28 orders |
| Upsell Rate | 15% | 50% | +233% |
| Daily Revenue | $2,576 | $4,704 | +$2,128 |
| **Monthly Gain** | - | - | **$63,500** |
| **AI Cost** | - | $500/mo | **ROI: 12,600%** |

## 🔐 Compliance & Security

- **PCI DSS**: Compliant payment handling (no raw card data)
- **Call Recording**: Disclosure in two-party consent states
- **Data Privacy**: GDPR/CCPA compliant
- **Accessibility**: ADA-compliant with human fallback option

## 📞 Support & Contact

- **Documentation Issues**: Create a GitHub issue
- **Integration Help**: integrations@grubgenius.com
- **Emergency Support**: support@grubgenius.com

## 📚 Additional Resources

- [Antigravity AI Documentation](https://docs.antigravity.ai)
- [Vapi Voice AI Docs](https://docs.vapi.ai)
- [Toast POS API](https://doc.toasttab.com)
- [Square API](https://developer.squareup.com)
- [Clover API](https://docs.clover.com)

---

**Version**: 1.0
**Last Updated**: 2026-01-02
**Maintained by**: QSR Systems Architecture Team

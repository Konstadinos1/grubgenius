# System Architecture Overview
## QSR AI Phone Agent

**Version:** 1.0
**Last Updated:** 2026-01-02

---

## Architecture Principles

1. **High Availability:** 99.9% uptime target
2. **Low Latency:** <2 second response time
3. **Scalability:** Handle unlimited concurrent calls
4. **Fault Tolerance:** Graceful degradation and human fallback
5. **Security:** PCI-compliant payment handling

---

## Component Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER                                    │
│                    (Inbound Phone Call)                             │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│                    TELEPHONY LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ SIP Trunk (Twilio/Vonage/Bandwidth)                          │  │
│  │ - Geographic Routing                                         │  │
│  │ - Call Queue Management                                      │  │
│  │ - Caller ID Extraction                                       │  │
│  │ - Call Recording                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│                  VOICE AI LAYER (Vapi/Retell)                       │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ Speech-to-Text (STT)    │  │ Text-to-Speech (TTS)            │  │
│  │ - Deepgram Nova-2       │  │ - ElevenLabs Multilingual v2    │  │
│  │ - Real-time streaming   │  │ - Natural voice synthesis       │  │
│  │ - Confidence scoring    │  │ - 300ms latency                 │  │
│  │ - 95%+ accuracy         │  │ - Customizable brand voice      │  │
│  └─────────────────────────┘  └─────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Voice Activity Detection (VAD)                               │  │
│  │ - 800ms silence threshold                                    │  │
│  │ - Barge-in enabled                                           │  │
│  │ - Background noise filtering                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│              ANTIGRAVITY AI PLATFORM (Orchestration)                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ LLM Core (GPT-4 Turbo / Claude 3.5 Sonnet)                   │  │
│  │ ┌────────────────┐ ┌────────────────┐ ┌────────────────────┐ │  │
│  │ │ Intent         │ │ Entity         │ │ Context            │ │  │
│  │ │ Classification │ │ Extraction     │ │ Management         │ │  │
│  │ └────────────────┘ └────────────────┘ └────────────────────┘ │  │
│  │ ┌─────────────────────────────────────────────────────────┐  │  │
│  │ │ Conversation State Machine                              │  │  │
│  │ │ - GREETING → ORDER_TYPE → ITEM_INTAKE → VALIDATION      │  │  │
│  │ │ - UPSELL → CONFIRMATION → PAYMENT → SUBMIT              │  │  │
│  │ └─────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Tool Execution Engine                                        │  │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐  │  │
│  │ │ Tool_POS     │ │ Tool_Customer│ │ Tool_Menu_KB         │  │  │
│  │ │ _Check       │ │ _Lookup      │ │ (RAG)                │  │  │
│  │ └──────────────┘ └──────────────┘ └──────────────────────┘  │  │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐  │  │
│  │ │ Tool_Order   │ │ Tool_Address │ │ Tool_Human           │  │  │
│  │ │ _Submit      │ │ _Validation  │ │ _Handoff             │  │  │
│  │ └──────────────┘ └──────────────┘ └──────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Session Management (Redis)                                   │  │
│  │ - Conversation history                                       │  │
│  │ - Order state persistence                                    │  │
│  │ - Customer context cache                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────┬──────────────┬────────────────────────────┘
                         │              │
            ┌────────────┴──────┐      ┌┴──────────────────────┐
            ▼                   ▼      ▼                       ▼
┌────────────────────┐ ┌────────────────┐ ┌──────────────────────────┐
│  POS INTEGRATION   │ │  KNOWLEDGE BASE│ │  ANALYTICS & MONITORING  │
│                    │ │     (RAG)      │ │                          │
│ ┌────────────────┐ │ │ ┌────────────┐ │ │ ┌──────────────────────┐ │
│ │ Toast Adapter  │ │ │ │ Vector DB  │ │ │ │ Real-time Dashboard  │ │
│ │ - Menu API     │ │ │ │ (Pinecone) │ │ │ │ - Active calls       │ │
│ │ - Orders API   │ │ │ │            │ │ │ │ - Avg latency        │ │
│ │ - Inventory    │ │ │ │ Menu Data: │ │ │ │ - Upsell rates       │ │
│ └────────────────┘ │ │ │ - Items    │ │ │ │ - Error rates        │ │
│                    │ │ │ - Allergens│ │ │ └──────────────────────┘ │
│ ┌────────────────┐ │ │ │ - Nutrition│ │ │                          │
│ │ Square Adapter │ │ │ │ - Promos   │ │ │ ┌──────────────────────┐ │
│ │ - Catalog API  │ │ │ └────────────┘ │ │ │ Alerts & Logging     │ │
│ │ - Orders API   │ │ │                │ │ │ - High latency       │ │
│ │ - Payments     │ │ │ Embedding:     │ │ │ - POS failures       │ │
│ └────────────────┘ │ │ - OpenAI       │ │ │ - Call recordings    │ │
│                    │ │   text-embed   │ │ │ - Transcripts        │ │
│ ┌────────────────┐ │ │   -3-small     │ │ └──────────────────────┘ │
│ │ Clover Adapter │ │ │                │ │                          │
│ │ - REST API     │ │ │ Retrieval:     │ │ ┌──────────────────────┐ │
│ │ - Atomic       │ │ │ - Top-k=3      │ │ │ Quality Assurance    │ │
│ │   Orders       │ │ │ - Min score    │ │ │ - Call reviews       │ │
│ └────────────────┘ │ │   0.7          │ │ │ - Agent training     │ │
│                    │ │                │ │ │ - A/B testing        │ │
│ Generic REST       │ │                │ │ └──────────────────────┘ │
│ Adapter Pattern    │ │                │ │                          │
└─────────┬──────────┘ └────────────────┘ └──────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────────┐
│               POS / KITCHEN DISPLAY SYSTEM (KDS)                    │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Order Queue      │  │ Payment          │  │ Inventory Mgmt   │  │
│  │ - Kitchen view   │  │ Processing       │  │ - 86'd items     │  │
│  │ - Prep timers    │  │ - Stripe         │  │ - Stock levels   │  │
│  │ - Routing logic  │  │ - POS native     │  │ - Auto-ordering  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Order Intake Flow

```
Customer Speaks
      │
      ▼
┌─────────────────────┐
│ Deepgram STT        │ → Transcription + Confidence Score (0.0-1.0)
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Confidence Check    │
└─────────────────────┘
      │
      ├─ >0.7: Proceed
      ├─ 0.5-0.7: Confirm interpretation
      └─ <0.5: Ask to repeat
      │
      ▼
┌─────────────────────┐
│ LLM Processing      │
│ - Intent extraction │
│ - Entity parsing    │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Tool_POS_Check      │ → Validate items & get prices
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Update Order State  │ → Add items to cart
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ TTS Response        │ → "One large pepperoni at $14.99..."
└─────────────────────┘
```

### 2. Upsell Decision Flow

```
Order Items Confirmed
      │
      ▼
┌─────────────────────────────────────┐
│ Analyze Order Composition           │
│ - Has pizza? Has sides? Has drinks? │
│ - Total value vs. thresholds        │
│ - Delivery vs. pickup               │
└─────────────────────────────────────┘
      │
      ├─── No Side Item? ────────────┐
      │                              ▼
      ├─── No Beverage? ──────────┐  Suggest Wings/Bites
      │                           ▼
      │                          Suggest 2L Soda
      │
      └─── Below Free Delivery Threshold ($30)?
                                 ▼
                          Suggest Item to Hit $30
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ Present Upsell         │
                    │ "Can I add X for $Y?"  │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
               "Yes, add it"             "No thanks"
                    │                         │
                    ▼                         ▼
            Update Order State          Continue to Confirmation
```

### 3. Error Handling & Fallback

```
Any System Component
      │
      ▼
┌─────────────────────┐
│ Error Detected      │
└─────────────────────┘
      │
      ├─── POS API Timeout (>2s) ────────┐
      │                                   ▼
      ├─── Low STT Confidence (<0.5) ──┐  Retry with backoff (max 2x)
      │                                 ▼        │
      ├─── Payment Failure ──────────┐  Ask customer to repeat
      │                              ▼        │
      ├─── Customer Complaint ────┐  Notify about issue, offer alternatives
      │                           ▼        │
      │                     Immediate handoff
      │                           │
      └───────────────────────────┴──────────┐
                                             ▼
                                  ┌────────────────────────┐
                                  │ Tool_Human_Handoff     │
                                  │ - Log context          │
                                  │ - SIP transfer         │
                                  │ - Brief human agent    │
                                  └────────────────────────┘
```

---

## Technology Stack

### Core Platform
- **AI Orchestration:** Antigravity AI
- **LLM:** OpenAI GPT-4 Turbo (primary), Anthropic Claude 3.5 Sonnet (backup)
- **Context Window:** 16k tokens
- **Function Calling:** Native support

### Voice AI
| Component | Provider | Specification |
|-----------|----------|---------------|
| STT | Deepgram | Nova-2, 300ms latency, 95%+ accuracy |
| TTS | ElevenLabs | Multilingual v2, natural voice |
| VAD | Vapi Built-in | 800ms silence threshold |
| Telephony | Twilio | SIP trunking, E.164 numbers |

### Data & Storage
- **Session Store:** Redis (in-memory, <10ms latency)
- **Vector DB:** Pinecone (menu knowledge base)
- **Analytics DB:** PostgreSQL (call logs, metrics)
- **Cache TTL:** Menu data = 5min, Customer data = 5min

### Integrations
- **POS Systems:** Toast, Square, Clover (REST APIs)
- **Payment:** Stripe Checkout (PCI-compliant)
- **Monitoring:** Custom dashboard + PagerDuty alerts

---

## Scalability & Performance

### Horizontal Scaling

```
Load Balancer (Geographic)
      │
      ├─── Region: US-East ─────┐
      │    (Antigravity Instance 1-N)
      │
      ├─── Region: US-West ─────┐
      │    (Antigravity Instance 1-N)
      │
      └─── Region: Canada ──────┐
           (Antigravity Instance 1-N)

Each instance can handle:
- 100+ concurrent calls
- Auto-scale based on load
- Independent failure domains
```

### Performance Targets

| Metric | Target | P99 Threshold |
|--------|--------|---------------|
| STT Latency | <300ms | 600ms |
| LLM Response | <1000ms | 2000ms |
| TTS Latency | <300ms | 600ms |
| POS API Call | <500ms | 2000ms |
| **Total Turn Latency** | **<2000ms** | **4000ms** |

**Turn Latency** = Time from "customer stops speaking" to "agent starts speaking"

### Caching Strategy

```python
# Menu Data Caching
menu_cache_ttl = 300  # 5 minutes
cache_key = f"menu:{restaurant_id}"

if redis.exists(cache_key):
    menu = redis.get(cache_key)
else:
    menu = await POS.get_menu()
    redis.setex(cache_key, menu_cache_ttl, menu)

# Customer Lookup Caching
customer_cache_ttl = 300  # 5 minutes
cache_key = f"customer:{phone_number}"

# Invalidate on:
# - New order placed
# - Customer updates profile
# - Webhook notification from POS
```

---

## Security Architecture

### 1. PCI Compliance (Payment Card Industry)

**Problem:** Never expose card data to LLM or logs

**Solution:**
```
Customer provides card number
      │
      ▼
┌─────────────────────────────────┐
│ Option A: Secure IVR Transfer   │
│ - Switch to DTMF-based input    │
│ - Vapi secure card capture      │
│ - Tokenize immediately          │
└─────────────────────────────────┘
      │
      OR
      │
┌─────────────────────────────────┐
│ Option B: SMS Payment Link      │
│ - Send Stripe Checkout URL     │
│ - Customer pays on phone/web    │
│ - Webhook confirms payment      │
└─────────────────────────────────┘
      │
      ▼
Order marked as PAID
```

### 2. Data Encryption

- **In Transit:** TLS 1.3 for all API calls
- **At Rest:** AES-256 for PII in PostgreSQL
- **PII Fields:** Name, phone, address, email
- **Redaction:** Call transcripts redact card numbers, SSNs

### 3. Access Control

```yaml
roles:
  - name: ai_agent
    permissions:
      - pos:read_menu
      - pos:create_order
      - customer:read
      - payment:tokenize_only

  - name: store_manager
    permissions:
      - all

  - name: analytics
    permissions:
      - metrics:read
      - recordings:listen
      - no_pii_access
```

### 4. Compliance

- **GDPR:** Right to deletion, data portability
- **CCPA:** Privacy notices, opt-out mechanisms
- **Call Recording Disclosure:** Required in 2-party consent states
- **Accessibility (ADA):** Option to press 0 for human

---

## Monitoring & Observability

### Real-Time Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  QSR AI Phone Agent - Live Metrics                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Active Calls: 47                    Avg Turn Latency: 1.8s  │
│  Calls Today: 1,247                  P99 Latency: 3.2s       │
│  Orders Created: 1,189 (95.3%)       Error Rate: 0.8%        │
│  Upsell Rate: 52.1%                  Handoff Rate: 3.2%      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Call Volume (Last Hour)                                │  │
│  │     █                                                  │  │
│  │   █ █ █                                                │  │
│  │ █ █ █ █ █                                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  POS API Status: ✅ Healthy (98.7% success, 420ms avg)       │
│  Voice AI Status: ✅ Healthy (STT: 94% conf, TTS: 310ms)     │
│  Redis: ✅ Healthy (2ms avg)                                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Alert Conditions

```yaml
alerts:
  high_latency:
    condition: avg_turn_latency > 3000ms
    duration: 5 minutes
    severity: warning
    action: notify_engineering

  pos_api_down:
    condition: pos_success_rate < 95%
    duration: 2 minutes
    severity: critical
    action: page_on_call + enable_human_backup

  high_handoff_rate:
    condition: handoff_rate > 15%
    duration: 10 minutes
    severity: warning
    action: review_recent_calls

  payment_failures:
    condition: payment_failure_rate > 5%
    duration: 5 minutes
    severity: critical
    action: check_stripe_status
```

### Logging Strategy

```python
# Structured Logging
log.info("call_completed", {
    "call_id": "CALL-20260102-18234",
    "duration_seconds": 142,
    "customer_phone": "+15551234567",  # Hashed for privacy
    "order_id": "ORD-42",
    "items_count": 3,
    "subtotal": 39.97,
    "upsell_accepted": ["APP-WINGS-8"],
    "upsell_revenue": 9.99,
    "confidence_avg": 0.93,
    "handoff": False,
    "errors": []
})

# Retention Policy
- Call recordings: 90 days
- Transcripts: 1 year
- Metrics: 2 years
- PII: Encrypted, deletable on request
```

---

## Disaster Recovery & Failover

### 1. POS API Unavailable

```
POS API returns 5xx or times out
      │
      ▼
┌─────────────────────────────────┐
│ Retry with exponential backoff  │
│ - Attempt 1: Immediate          │
│ - Attempt 2: +2 seconds         │
│ - Attempt 3: +4 seconds         │
└─────────────────────────────────┘
      │
      ├─ Success: Continue
      │
      └─ All attempts failed:
            │
            ▼
   ┌─────────────────────────────────┐
   │ Agent: "I'm having trouble       │
   │ connecting to our order system.  │
   │ Let me transfer you to someone   │
   │ who can help."                   │
   │                                  │
   │ → Tool_Human_Handoff             │
   └─────────────────────────────────┘
```

### 2. Voice AI Degradation

```
Deepgram STT service degraded
      │
      ▼
Automatically switch to backup provider (AssemblyAI)
      │
      ▼
If both fail:
      │
      ▼
┌─────────────────────────────────┐
│ Agent: "I'm having trouble       │
│ hearing you. I can text you a    │
│ link to order online, or         │
│ transfer to someone in store."   │
└─────────────────────────────────┘
```

### 3. Complete System Failure

```
Antigravity Platform Outage
      │
      ▼
┌─────────────────────────────────┐
│ Phone System Fallback Plan      │
│                                  │
│ 1. Auto-redirect to human queue │
│ 2. Play hold message:           │
│    "We're experiencing high     │
│     volume. A team member will  │
│     take your order shortly."   │
│                                  │
│ 3. Text callback option         │
└─────────────────────────────────┘
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│  AWS / GCP / Azure Cloud                                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Load Balancer (CloudFlare / AWS ALB)               │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                               │
│          ┌──────────────┼──────────────┐                │
│          ▼              ▼              ▼                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Antigravity  │ │ Antigravity  │ │ Antigravity  │   │
│  │ Instance 1   │ │ Instance 2   │ │ Instance N   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│          │              │              │                │
│          └──────────────┼──────────────┘                │
│                         ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Redis Cluster (Session State)                      │ │
│  │ - Primary + 2 Replicas                             │ │
│  │ - Auto-failover                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                               │
│                         ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │ PostgreSQL (Analytics & Logs)                      │ │
│  │ - Primary + Read Replicas                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
Developer commits code
      │
      ▼
GitHub Actions / GitLab CI
      │
      ├─ Run tests (unit, integration)
      ├─ Security scan (OWASP, dependency check)
      ├─ Build container image
      │
      ▼
Deploy to Staging
      │
      ├─ Smoke tests
      ├─ Load test (simulated calls)
      ├─ QA review
      │
      ▼
Approval Required
      │
      ▼
Blue-Green Deployment to Production
      │
      ├─ Route 10% traffic to new version
      ├─ Monitor error rates, latency
      ├─ If healthy: Route 100%
      └─ If issues: Instant rollback
```

---

## Cost Analysis

### Per-Call Cost Breakdown (100 calls/day)

| Component | Cost per Call | Monthly Cost (3000 calls) |
|-----------|---------------|---------------------------|
| Deepgram STT | $0.0043 | $12.90 |
| ElevenLabs TTS | $0.018 | $54.00 |
| GPT-4 Turbo | $0.015 | $45.00 |
| Twilio Telephony | $0.013 | $39.00 |
| Antigravity Platform | $0.08 | $240.00 |
| Redis/PostgreSQL | $0.001 | $3.00 |
| **Total per Call** | **$0.13** | **$393.90** |

**vs. Human Staff:**
- Average wage: $15/hour
- 1 staff member handles ~10 calls/hour
- Cost per call: $1.50

**Savings: 91% cost reduction per call**

---

## Future Enhancements

### Phase 2 (Q2 2026)
- Multilingual support (Spanish, French)
- Voice biometrics for customer identification
- Predictive ordering ("You usually order on Friday nights...")
- Integration with loyalty programs

### Phase 3 (Q3 2026)
- Outbound calling for order confirmations
- Proactive delay notifications
- Catering & large order handling
- Multi-location corporate accounts

### Phase 4 (Q4 2026)
- Voice sentiment analysis (detect frustration)
- Dynamic pricing based on demand
- Integration with third-party delivery (DoorDash, Uber Eats)
- Advanced analytics: customer lifetime value prediction

---

**Document Version:** 1.0
**Maintained by:** QSR Systems Architecture Team
**Contact:** architecture@grubgenius.com

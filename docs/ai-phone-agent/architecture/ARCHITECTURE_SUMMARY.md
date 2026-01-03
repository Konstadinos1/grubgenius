# QSR Phone Agent - Architecture Summary
## Quick Reference Guide

---

## 🎯 System at a Glance

**Purpose:** Autonomous AI voice agent that answers restaurant calls, takes orders, and processes them through POS systems.

**Key Metrics:**
- Response time: <1 ring (3-5 seconds)
- Cost per call: ~$0.13 vs $1.50 (human)
- Upsell success: 40-60% target
- Concurrent calls: Unlimited

---

## 📊 Architecture Layers (Top to Bottom)

### 1. **Customer Layer**
- Customers call restaurant phone number
- Any standard phone (mobile, landline)

### 2. **Telephony Layer**
- **Twilio SIP Trunking**
- Routes calls to Vapi
- Captures caller ID
- Records calls (optional)

### 3. **Voice AI Layer**
- **Vapi** - Orchestration platform
- **Deepgram Nova-2** - Speech-to-Text (300ms)
- **ElevenLabs** - Text-to-Speech (natural voice)
- Manages WebSocket connections

### 4. **AI Brain Layer**
- **Antigravity AI Platform** - Agent orchestration
- **GPT-4 Turbo** - Natural language processing
- Function calling to backend tools
- State machine management

### 5. **Backend API Layer**
- **Node.js + Express** - REST API server
- Tool endpoints (POS check, customer lookup, order submit)
- Webhook handlers (Vapi, Stripe, POS)
- Business logic services

### 6. **Integration Layer**
- **Toast/Square/Clover APIs** - POS systems
- **Stripe API** - Payment processing
- **Pinecone** - Menu knowledge base (RAG)
- **Twilio SMS** - Payment links

### 7. **Data Layer**
- **PostgreSQL** - Orders, customers, analytics
- **Redis** - Session cache, menu cache
- **AWS S3** - Call recordings, transcripts

### 8. **Frontend Layer**
- **React Dashboard** - Admin monitoring
- Live call tracking
- Analytics & reports
- Configuration management

---

## 🔌 Key Integrations

### Required External Services

| Service | Purpose | Cost Estimate |
|---------|---------|---------------|
| **Twilio** | Phone service | ~$0.013/call |
| **Vapi** | Voice AI orchestration | ~$0.08/call |
| **Deepgram** | Speech-to-text | ~$0.0043/call |
| **ElevenLabs** | Text-to-speech | ~$0.018/call |
| **OpenAI** | GPT-4 LLM | ~$0.015/call |
| **Antigravity** | AI platform | Custom pricing |
| **Stripe** | Payments | 2.9% + $0.30 |
| **Toast/Square/Clover** | POS system | Existing |
| **AWS/GCP** | Hosting | ~$200-500/mo |

**Total: ~$0.13 per call + hosting**

---

## 🗄️ Database Schema (Simplified)

```
customers
├─ id, phone, name, email
├─ loyalty_points, lifetime_value
└─ addresses (1-to-many)

orders
├─ id, order_number, customer_id
├─ subtotal, tax, delivery_fee, total
├─ fulfillment_type (pickup/delivery)
├─ status, pos_order_id
└─ order_items (1-to-many)
    └─ order_modifiers (1-to-many)

call_logs
├─ id, call_id, customer_id, order_id
├─ duration, confidence_score
├─ upsells_attempted, upsell_revenue
└─ recording_url, transcript_url

menu_items
├─ id, sku, name, description
├─ price, category, allergens
└─ is_available, is_86ed

analytics_metrics
├─ metric_date, hour
├─ total_calls, orders_created
└─ total_revenue, avg_order_value
```

---

## 🔧 Tech Stack Summary

### Backend
```javascript
{
  "runtime": "Node.js 20+",
  "framework": "Express 4.x",
  "database": "PostgreSQL 15",
  "cache": "Redis 7.x",
  "orm": "Sequelize",
  "validation": "Joi",
  "testing": "Jest"
}
```

### Frontend
```javascript
{
  "framework": "React 18",
  "bundler": "Vite 5",
  "ui": "Tailwind CSS",
  "charts": "Recharts",
  "state": "Zustand",
  "api": "Axios"
}
```

### Infrastructure
```yaml
hosting: AWS / GCP / Azure
compute: ECS Fargate (containers)
database: RDS PostgreSQL (multi-AZ)
cache: ElastiCache Redis
storage: S3 (recordings)
cdn: CloudFront
monitoring: CloudWatch / Datadog
```

---

## 📋 API Endpoints Reference

### Tool Endpoints (called by AI)
```
POST   /api/v1/tools/pos-check         - Validate menu items
GET    /api/v1/tools/customer-lookup   - Get customer data
POST   /api/v1/tools/order-submit      - Submit order to POS
GET    /api/v1/tools/address-validate  - Check delivery zone
POST   /api/v1/tools/human-handoff     - Transfer to human
```

### Webhook Endpoints
```
POST   /api/v1/webhooks/vapi          - Vapi call events
POST   /api/v1/webhooks/stripe        - Payment events
POST   /api/v1/webhooks/toast         - Toast updates
POST   /api/v1/webhooks/square        - Square updates
```

### Admin API Endpoints
```
GET    /api/v1/analytics/calls        - Call metrics
GET    /api/v1/analytics/revenue      - Revenue data
GET    /api/v1/orders                 - Order history
GET    /api/v1/customers              - Customer list
GET    /api/v1/menu                   - Current menu
```

---

## 🔄 Typical Call Flow

```
1. Customer calls → Twilio
2. Twilio → Vapi (WebSocket)
3. Vapi → Deepgram (STT) + ElevenLabs (TTS)
4. Vapi → Antigravity AI (LLM)
5. Antigravity → Backend API Tools
6. Backend → POS API (Toast/Square/Clover)
7. Backend → PostgreSQL (save order)
8. Backend → Stripe (payment)
9. Backend → Twilio SMS (payment link)
10. Order sent to Kitchen Display System
```

**Average latency per turn: <2 seconds**

---

## 📁 Project Structure

```
qsr-phone-agent/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   │   ├── pos/         # POS adapters
│   │   │   ├── llm/         # AI services
│   │   │   └── ...
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   └── utils/
│   ├── tests/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/           # Dashboard pages
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API client
│   │   └── hooks/
│   └── package.json
│
├── docs/
│   └── ai-phone-agent/
│       ├── WORKFLOW_PLAN.md
│       ├── architecture/
│       │   ├── technical-architecture.md  ← You are here
│       │   └── system-overview.md
│       ├── api-schemas/
│       └── examples/
│
└── infrastructure/
    ├── terraform/           # IaC configs
    └── docker-compose.yml   # Local dev
```

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/yourorg/qsr-phone-agent.git
cd qsr-phone-agent

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Set up environment
cp backend/.env.example backend/.env
# Edit .env with your API keys

# 4. Start databases
docker-compose up -d postgres redis

# 5. Run migrations
cd backend
npx sequelize-cli db:migrate

# 6. Start services
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### Production Deployment

```bash
# Using AWS ECS + Terraform
cd infrastructure/terraform
terraform init
terraform plan
terraform apply

# Or using Docker
docker build -t qsr-phone-agent-api ./backend
docker push your-registry/qsr-phone-agent-api:latest
```

---

## 🔐 Security Checklist

- [ ] PCI-compliant payment handling (no raw cards in logs)
- [ ] HTTPS/TLS for all API connections
- [ ] JWT authentication for admin dashboard
- [ ] Rate limiting on public endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection on frontend
- [ ] Call recording disclosure (two-party consent states)
- [ ] GDPR/CCPA compliance (data deletion)
- [ ] Secrets in environment variables (never committed)
- [ ] Database backups automated

---

## 📊 Monitoring Dashboard Metrics

### Real-Time
- Active calls count
- Current queue length
- Average turn latency
- POS API health status

### Daily Aggregates
- Total calls / answered calls
- Orders created / revenue
- Upsell acceptance rate
- Average order value
- Customer satisfaction score

### Alerts
- Turn latency >3 seconds
- POS API success rate <95%
- Handoff rate >15%
- Payment failures >5%

---

## 🎯 Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Response time | <1 ring | <3 rings |
| Turn latency | <2s | <4s |
| Order accuracy | >95% | >90% |
| Upsell rate | 40-60% | >30% |
| Answer rate | >98% | >90% |
| Handoff rate | <5% | <10% |

---

## 📞 Support

**Technical Documentation:**
- Full architecture: [technical-architecture.md](./technical-architecture.md)
- Workflow plan: [../WORKFLOW_PLAN.md](../WORKFLOW_PLAN.md)
- API schemas: [../api-schemas/](../api-schemas/)

**Contact:**
- Architecture questions: architecture@grubgenius.com
- Integration support: integrations@grubgenius.com
- Emergency: support@grubgenius.com

---

**Version:** 1.0
**Last Updated:** 2026-01-03

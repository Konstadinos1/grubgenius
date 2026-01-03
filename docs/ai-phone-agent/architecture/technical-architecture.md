# AI Phone Agent - Technical Architecture
## Complete System Design & Integration Map

**Version:** 1.0
**Last Updated:** 2026-01-03
**Status:** Implementation Ready

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Component Architecture](#component-architecture)
4. [API Integrations](#api-integrations)
5. [Database Schema](#database-schema)
6. [Front-End Dashboard](#front-end-dashboard)
7. [Back-End Services](#back-end-services)
8. [Deployment Architecture](#deployment-architecture)
9. [Development Setup](#development-setup)
10. [Integration Flow Examples](#integration-flow-examples)

---

## System Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CUSTOMER LAYER                                 │
│                                                                           │
│  ┌──────────────┐                                                        │
│  │   Customer   │ ──── Phone Call ────┐                                 │
│  │ (555-1234)   │                      │                                 │
│  └──────────────┘                      │                                 │
│                                         │                                 │
└─────────────────────────────────────────┼─────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        TELEPHONY LAYER                                   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Twilio SIP Trunking                                              │   │
│  │ - Phone Number: +1-XXX-XXX-XXXX                                  │   │
│  │ - Caller ID capture                                              │   │
│  │ - Call routing & queueing                                        │   │
│  │ - Call recording (optional)                                      │   │
│  │ - WebSocket connection to Vapi                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       VOICE AI LAYER (Vapi)                              │
│                                                                           │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐   │
│  │ Deepgram Nova-2 (STT) │  │ ElevenLabs Multilingual v2 (TTS)     │   │
│  │ - Real-time streaming │  │ - Voice: Rachel (friendly female)    │   │
│  │ - 300ms latency       │  │ - 300ms latency                      │   │
│  │ - 95%+ accuracy       │  │ - Natural prosody                    │   │
│  │ - Confidence scoring  │  │ - Streaming audio                    │   │
│  └───────────────────────┘  └──────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Vapi Orchestration Platform                                      │   │
│  │ - WebSocket connection management                                │   │
│  │ - Voice Activity Detection (VAD)                                 │   │
│  │ - Function calling to Antigravity                                │   │
│  │ - Session state management                                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   ANTIGRAVITY AI PLATFORM (Brain)                        │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ LLM Core (OpenAI GPT-4 Turbo)                                    │   │
│  │ - Model: gpt-4-turbo-2024-04-09                                  │   │
│  │ - Context: 16k tokens                                            │   │
│  │ - Temperature: 0.7                                               │   │
│  │ - System prompt: QSR order-taking specialist                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Agent Orchestration Engine                                       │   │
│  │ - State machine management                                       │   │
│  │ - Tool/function routing                                          │   │
│  │ - Context window management                                      │   │
│  │ - Multi-turn conversation handling                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER (Node.js)                         │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Express.js REST API Server                                       │   │
│  │ - Port: 3000 (internal)                                          │   │
│  │ - HTTPS with SSL/TLS                                             │   │
│  │ - JWT authentication                                             │   │
│  │ - Rate limiting                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐    │
│  │ POS Integration   │  │ Customer Service  │  │ Order Service    │    │
│  │ Service           │  │ - Lookup by phone │  │ - Validation     │    │
│  │ - Toast adapter   │  │ - Order history   │  │ - Submission     │    │
│  │ - Square adapter  │  │ - Loyalty points  │  │ - Pricing calc   │    │
│  │ - Clover adapter  │  │ - Preferences     │  │ - Status track   │    │
│  └───────────────────┘  └───────────────────┘  └──────────────────┘    │
│                                                                           │
│  ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐    │
│  │ Menu Service      │  │ Analytics Service │  │ Webhook Service  │    │
│  │ - Cache manager   │  │ - Call logging    │  │ - Vapi events    │    │
│  │ - Real-time sync  │  │ - Metrics agg     │  │ - POS webhooks   │    │
│  │ - 86'd tracking   │  │ - Reporting       │  │ - Stripe events  │    │
│  └───────────────────┘  └───────────────────┘  └──────────────────┘    │
│                                                                           │
└─────┬───────────┬───────────┬───────────┬───────────┬────────────────────┘
      │           │           │           │           │
      ▼           ▼           ▼           ▼           ▼
┌──────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐
│  Toast   │ │ Square │ │  Clover  │ │ Stripe │ │ Pinecone│
│   API    │ │  API   │ │   API    │ │  API   │ │  (RAG)  │
└──────────┘ └────────┘ └──────────┘ └────────┘ └─────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                        │
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Redis Cache      │  │ PostgreSQL DB    │  │ S3 Object Storage    │  │
│  │ - Session state  │  │ - Customers      │  │ - Call recordings    │  │
│  │ - Menu cache     │  │ - Orders         │  │ - Transcripts        │  │
│  │ - Customer cache │  │ - Call logs      │  │ - Backups            │  │
│  │ TTL: 5 minutes   │  │ - Analytics      │  │ Retention: 90 days   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND DASHBOARD (React)                           │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Admin Dashboard (web)                                            │   │
│  │ - Live call monitoring                                           │   │
│  │ - Analytics & reports                                            │   │
│  │ - Configuration management                                       │   │
│  │ - Call recordings playback                                       │   │
│  │ - Upsell performance metrics                                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Platform Components

| Layer | Technology | Purpose | Version |
|-------|------------|---------|---------|
| **Telephony** | Twilio | SIP trunking, phone numbers, call routing | API v2010 |
| **Voice AI** | Vapi | Voice orchestration, STT/TTS coordination | Latest |
| **STT** | Deepgram | Speech-to-Text conversion | Nova-2 |
| **TTS** | ElevenLabs | Text-to-Speech synthesis | Multilingual v2 |
| **LLM** | OpenAI GPT-4 Turbo | Natural language understanding & generation | gpt-4-turbo |
| **AI Platform** | Antigravity AI | Agent orchestration, function calling | Latest |
| **Backend** | Node.js + Express | REST API server | Node 20.x, Express 4.x |
| **Database** | PostgreSQL | Persistent data storage | PostgreSQL 15 |
| **Cache** | Redis | Session & menu caching | Redis 7.x |
| **Vector DB** | Pinecone | Menu knowledge base (RAG) | Latest |
| **Storage** | AWS S3 | Call recordings, backups | - |
| **Frontend** | React + Vite | Admin dashboard | React 18, Vite 5 |
| **Payment** | Stripe | Payment processing | API 2024-11-20 |

### External APIs & Integrations

| Service | Provider | Purpose | Protocol |
|---------|----------|---------|----------|
| **POS - Toast** | Toast POS | Menu, orders, inventory | REST API v2 |
| **POS - Square** | Square | Catalog, orders, payments | REST API 2024-11-20 |
| **POS - Clover** | Clover | Orders, inventory | REST API v3 |
| **Payments** | Stripe | Card processing, checkout links | REST + Webhooks |
| **Maps** | Google Maps API | Address validation, delivery zones | REST API |
| **SMS** | Twilio SMS | Payment links, order confirmations | REST API |
| **Monitoring** | Datadog | Metrics, alerts, APM | Agent + API |

---

## Component Architecture

### 1. Telephony Layer (Twilio)

**Configuration:**
```javascript
// Twilio Setup
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER, // +1-XXX-XXX-XXXX

  // SIP trunk configuration
  sipTrunk: {
    originationUrl: 'sip:vapi.ai',
    terminationUrl: 'sip:pstn.twilio.com',
    secure: true,
    encryption: 'sdes'
  },

  // Call routing
  routing: {
    defaultDestination: 'vapi_websocket',
    fallbackNumber: process.env.STORE_PHONE_NUMBER,
    maxQueueTime: 30 // seconds
  },

  // Recording
  recording: {
    enabled: true,
    recordingStatusCallback: 'https://api.yourapp.com/webhooks/twilio/recording',
    recordingChannels: 'dual',
    trim: 'trim-silence'
  }
};
```

**Twilio TwiML for Call Routing:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://vapi.ai/ws/YOUR_ASSISTANT_ID">
      <Parameter name="caller_id" value="+15551234567"/>
      <Parameter name="restaurant_id" value="RST001"/>
    </Stream>
  </Connect>
</Response>
```

---

### 2. Voice AI Layer (Vapi)

**Vapi Assistant Configuration:**
```javascript
// Create Vapi Assistant
const vapiAssistant = {
  name: "Pizza Pizza Order Assistant",

  // Voice settings
  voice: {
    provider: "11labs",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
    stability: 0.8,
    similarityBoost: 0.75,
    style: 0.4,
    speed: 1.0
  },

  // Transcriber settings
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
    smartFormat: true,
    keywords: ["pepperoni:5", "delivery:3", "pickup:3"]
  },

  // LLM settings
  model: {
    provider: "custom-llm", // Points to Antigravity
    url: "https://api.yourapp.com/v1/llm/chat",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY"
    },
    temperature: 0.7,
    maxTokens: 500
  },

  // Function calling
  functions: [
    {
      name: "Tool_POS_Check",
      description: "Check POS for menu items and availability",
      url: "https://api.yourapp.com/v1/tools/pos-check",
      method: "POST"
    },
    {
      name: "Tool_Customer_Lookup",
      description: "Lookup customer by phone number",
      url: "https://api.yourapp.com/v1/tools/customer-lookup",
      method: "GET"
    },
    // ... other functions
  ],

  // Conversation settings
  firstMessage: "Thanks for calling Pizza Pizza, this is Emma. Are we starting a new order for pickup or delivery today?",
  silenceTimeoutSeconds: 30,
  responseDelaySeconds: 0.4,
  interruptionsEnabled: true,
  backgroundSound: "office",

  // Webhooks
  serverUrl: "https://api.yourapp.com/webhooks/vapi",
  serverMessages: [
    "conversation-update",
    "function-call",
    "hang",
    "speech-update",
    "transcript"
  ]
};
```

---

### 3. Backend API Layer (Node.js/Express)

**Project Structure:**
```
backend/
├── src/
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   ├── database.js           # PostgreSQL config
│   │   ├── redis.js              # Redis config
│   │   └── env.js                # Environment variables
│   ├── routes/
│   │   ├── webhooks.js           # Vapi, Stripe, POS webhooks
│   │   ├── tools.js              # Antigravity tool endpoints
│   │   ├── orders.js             # Order management
│   │   ├── customers.js          # Customer management
│   │   └── analytics.js          # Analytics API
│   ├── services/
│   │   ├── pos/
│   │   │   ├── toast.service.js
│   │   │   ├── square.service.js
│   │   │   ├── clover.service.js
│   │   │   └── adapter.js        # Unified POS interface
│   │   ├── llm/
│   │   │   ├── antigravity.service.js
│   │   │   └── prompt.templates.js
│   │   ├── customer.service.js
│   │   ├── menu.service.js
│   │   ├── order.service.js
│   │   ├── analytics.service.js
│   │   └── cache.service.js
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Order.js
│   │   ├── CallLog.js
│   │   └── MenuItem.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   ├── errorHandler.js
│   │   └── logging.js
│   └── utils/
│       ├── validators.js
│       ├── formatters.js
│       └── helpers.js
├── tests/
├── package.json
└── .env.example
```

**Key Backend Endpoints:**

```javascript
// Tool Endpoints (called by Antigravity via Vapi)
POST   /api/v1/tools/pos-check           // Check menu/inventory
GET    /api/v1/tools/customer-lookup     // Get customer data
POST   /api/v1/tools/order-submit        // Submit order to POS
GET    /api/v1/tools/address-validate    // Validate delivery address
POST   /api/v1/tools/human-handoff       // Initiate SIP transfer

// Webhook Endpoints
POST   /api/v1/webhooks/vapi             // Vapi events
POST   /api/v1/webhooks/stripe           // Stripe payment events
POST   /api/v1/webhooks/toast            // Toast POS updates
POST   /api/v1/webhooks/square           // Square updates

// Admin API Endpoints
GET    /api/v1/analytics/calls           // Call metrics
GET    /api/v1/analytics/revenue         // Revenue metrics
GET    /api/v1/orders                    // Order history
GET    /api/v1/customers                 // Customer list
GET    /api/v1/menu                      // Current menu
PUT    /api/v1/config                    // Update configuration

// LLM Proxy Endpoint (for Vapi to call Antigravity)
POST   /api/v1/llm/chat                  // Chat completion proxy
```

---

## API Integrations

### 1. Toast POS Integration

**Authentication:**
```javascript
const toastClient = axios.create({
  baseURL: 'https://api.toasttab.com/restaurants/v2',
  headers: {
    'Authorization': `Bearer ${process.env.TOAST_API_KEY}`,
    'Toast-Restaurant-External-ID': process.env.TOAST_RESTAURANT_ID,
    'Content-Type': 'application/json'
  }
});
```

**Key Endpoints:**
```javascript
// Get Menu
GET /menus
Response: {
  menus: [{
    guid: "menu-guid",
    name: "Main Menu",
    groups: [{
      guid: "group-guid",
      name: "Pizzas",
      items: [{
        guid: "item-guid",
        name: "Large Pepperoni Pizza",
        price: 1499, // in cents
        modifierGroups: [...]
      }]
    }]
  }]
}

// Check Item Availability (86'd items)
GET /inventory/counts
Response: {
  items: [{
    itemGuid: "item-guid",
    quantity: 0,  // Out of stock
    outOfStock: true
  }]
}

// Create Order
POST /orders
Body: {
  businessDate: "2026-01-03",
  diningOption: "TAKE_OUT", // or "DELIVERY"
  customer: {
    phone: "+15551234567",
    firstName: "John",
    lastName: "Smith"
  },
  selections: [{
    itemGuid: "item-guid",
    quantity: 2,
    modifiers: [...]
  }],
  deliveryInfo: {
    address: "123 Main St",
    deliveryTime: "2026-01-03T18:30:00Z"
  }
}
```

---

### 2. Square Integration

**Authentication:**
```javascript
const { Client, Environment } = require('square');

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});
```

**Key Operations:**
```javascript
// Get Catalog (Menu)
const { result } = await squareClient.catalogApi.listCatalog({
  types: 'ITEM,MODIFIER_LIST'
});

// Create Order
const order = await squareClient.ordersApi.createOrder({
  locationId: process.env.SQUARE_LOCATION_ID,
  order: {
    customerId: 'customer-id',
    lineItems: [{
      catalogObjectId: 'item-id',
      quantity: '2',
      modifiers: [...]
    }],
    fulfillments: [{
      type: 'PICKUP',
      state: 'PROPOSED',
      pickupDetails: {
        scheduleType: 'ASAP'
      }
    }]
  }
});
```

---

### 3. Clover Integration

**Authentication:**
```javascript
const cloverClient = axios.create({
  baseURL: `https://api.clover.com/v3/merchants/${process.env.CLOVER_MERCHANT_ID}`,
  headers: {
    'Authorization': `Bearer ${process.env.CLOVER_ACCESS_TOKEN}`
  }
});
```

**Key Endpoints:**
```javascript
// Get Menu Items
GET /items?expand=modifierGroups

// Create Atomic Order
POST /atomic_order/orders
Body: {
  orderType: {
    id: "order-type-id"
  },
  lineItems: [{
    item: { id: "item-id" },
    printed: false,
    binName: "DEFAULT",
    userData: "From AI Phone Agent"
  }]
}
```

---

### 4. Stripe Payment Integration

**Setup:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 4970, // $49.70 in cents
  currency: 'usd',
  customer: 'cus_XXXXXX',
  metadata: {
    order_id: 'ORD-42',
    source: 'ai_phone_agent'
  },
  automatic_payment_methods: {
    enabled: true
  }
});

// Create Checkout Session (for SMS payment links)
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Pizza Order #42',
        description: '2x Large Pepperoni, 8pc Wings'
      },
      unit_amount: 4970
    },
    quantity: 1
  }],
  success_url: 'https://yourapp.com/order/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://yourapp.com/order/cancel',
  customer: 'cus_XXXXXX',
  metadata: {
    order_id: 'ORD-42'
  }
});

// Send SMS with payment link
await twilioClient.messages.create({
  body: `Complete your Pizza Pizza order payment here: ${session.url}`,
  to: '+15551234567',
  from: process.env.TWILIO_PHONE_NUMBER
});
```

---

### 5. Pinecone Vector DB (Menu Knowledge Base)

**Setup:**
```javascript
const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.index('menu-knowledge');

// Index menu data
const embeddings = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: [
    'Large pepperoni pizza contains dairy, gluten. 2400 calories.',
    'Veggie pizza is vegetarian, contains dairy, gluten. 1800 calories.',
    // ... all menu items with allergens, nutrition, descriptions
  ]
});

await index.upsert(
  embeddings.data.map((emb, i) => ({
    id: `item-${i}`,
    values: emb.embedding,
    metadata: { text: input[i] }
  }))
);

// Query for allergen info
const queryEmbedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'Does the veggie pizza contain gluten?'
});

const results = await index.query({
  vector: queryEmbedding.data[0].embedding,
  topK: 3,
  includeMetadata: true
});
```

---

## Database Schema

### PostgreSQL Tables

```sql
-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  loyalty_points INTEGER DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50),
  postal_code VARCHAR(20),
  delivery_zone VARCHAR(50),
  delivery_fee DECIMAL(6,2),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  call_id VARCHAR(100),

  -- Order details
  fulfillment_type VARCHAR(20) NOT NULL, -- 'pickup' or 'delivery'
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, preparing, ready, completed, cancelled

  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(6,2) DEFAULT 0,
  tip DECIMAL(6,2) DEFAULT 0,
  discount DECIMAL(6,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Timestamps
  requested_time TIMESTAMP,
  estimated_ready_time TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Metadata
  pos_order_id VARCHAR(100),
  pos_system VARCHAR(50), -- 'toast', 'square', 'clover'
  source VARCHAR(50) DEFAULT 'ai_phone_agent',
  special_instructions TEXT
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order modifiers table
CREATE TABLE order_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,

  modifier_id VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(6,2) DEFAULT 0,
  quantity INTEGER DEFAULT 1
);

-- Call logs table
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id VARCHAR(100) UNIQUE NOT NULL,

  -- Call details
  customer_id UUID REFERENCES customers(id),
  caller_phone VARCHAR(20) NOT NULL,
  order_id UUID REFERENCES orders(id),

  -- Call metrics
  duration_seconds INTEGER,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,

  -- AI metrics
  avg_confidence_score DECIMAL(3,2),
  turn_count INTEGER,
  handoff_occurred BOOLEAN DEFAULT false,
  handoff_reason VARCHAR(100),

  -- Upselling
  upsells_attempted JSONB, -- [{type, item, accepted, revenue}]
  upsell_revenue DECIMAL(10,2) DEFAULT 0,

  -- Recording
  recording_url TEXT,
  transcript_url TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_call_logs_customer ON call_logs(customer_id);
CREATE INDEX idx_call_logs_started ON call_logs(started_at);

-- Menu cache table (synced from POS)
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),

  base_price DECIMAL(10,2),

  allergens TEXT[], -- ['dairy', 'gluten']
  calories INTEGER,

  is_available BOOLEAN DEFAULT true,
  is_86ed BOOLEAN DEFAULT false,

  pos_item_id VARCHAR(100),
  pos_system VARCHAR(50),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_sku ON menu_items(sku);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

-- Analytics metrics table
CREATE TABLE analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  metric_date DATE NOT NULL,
  hour INTEGER, -- 0-23, null for daily aggregates

  -- Call metrics
  total_calls INTEGER DEFAULT 0,
  answered_calls INTEGER DEFAULT 0,
  orders_created INTEGER DEFAULT 0,
  handoffs INTEGER DEFAULT 0,

  -- Revenue metrics
  total_revenue DECIMAL(10,2) DEFAULT 0,
  upsell_revenue DECIMAL(10,2) DEFAULT 0,
  avg_order_value DECIMAL(10,2) DEFAULT 0,

  -- Performance metrics
  avg_turn_latency_ms INTEGER,
  avg_confidence_score DECIMAL(3,2),
  error_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(metric_date, hour)
);

CREATE INDEX idx_metrics_date ON analytics_metrics(metric_date);
```

---

## Front-End Dashboard

### React Admin Dashboard

**Project Structure:**
```
frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main overview
│   │   ├── LiveCalls.jsx           # Real-time call monitoring
│   │   ├── Analytics.jsx           # Charts & metrics
│   │   ├── Orders.jsx              # Order history
│   │   ├── Customers.jsx           # Customer management
│   │   ├── CallRecordings.jsx      # Playback interface
│   │   └── Settings.jsx            # Configuration
│   ├── components/
│   │   ├── MetricCard.jsx
│   │   ├── CallCard.jsx
│   │   ├── OrderTable.jsx
│   │   ├── RevenueChart.jsx
│   │   └── UpsellMetrics.jsx
│   ├── services/
│   │   ├── api.js                  # API client
│   │   └── websocket.js            # Real-time updates
│   ├── hooks/
│   │   ├── useRealTimeMetrics.js
│   │   └── useCallMonitor.js
│   └── utils/
│       └── formatters.js
├── package.json
└── vite.config.js
```

**Key Dashboard Features:**

1. **Live Call Monitor**
```jsx
// LiveCalls.jsx
import { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export default function LiveCalls() {
  const [activeCalls, setActiveCalls] = useState([]);
  const ws = useWebSocket('wss://api.yourapp.com/ws/calls');

  useEffect(() => {
    ws.on('call.started', (call) => {
      setActiveCalls(prev => [...prev, call]);
    });

    ws.on('call.updated', (call) => {
      setActiveCalls(prev =>
        prev.map(c => c.id === call.id ? call : c)
      );
    });

    ws.on('call.ended', (call) => {
      setActiveCalls(prev =>
        prev.filter(c => c.id !== call.id)
      );
    });
  }, [ws]);

  return (
    <div className="live-calls">
      <h2>Active Calls: {activeCalls.length}</h2>
      {activeCalls.map(call => (
        <CallCard key={call.id} call={call} />
      ))}
    </div>
  );
}
```

2. **Analytics Dashboard**
```jsx
// Dashboard.jsx
export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/v1/analytics/summary')
      .then(res => res.json())
      .then(setMetrics);
  }, []);

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard
          title="Calls Today"
          value={metrics?.total_calls}
          change={+12.5}
        />
        <MetricCard
          title="Orders Created"
          value={metrics?.orders_created}
          change={+8.3}
        />
        <MetricCard
          title="Upsell Rate"
          value={`${metrics?.upsell_rate}%`}
          change={+5.2}
        />
        <MetricCard
          title="Revenue Today"
          value={`$${metrics?.total_revenue}`}
          change={+15.7}
        />
      </div>

      <RevenueChart data={metrics?.hourly_revenue} />
      <UpsellMetrics data={metrics?.upsell_breakdown} />
    </div>
  );
}
```

---

## Back-End Services

### Example: POS Integration Service

```javascript
// services/pos/adapter.js
class POSAdapter {
  constructor(posSystem) {
    this.system = posSystem; // 'toast', 'square', 'clover'

    switch(posSystem) {
      case 'toast':
        this.client = new ToastClient();
        break;
      case 'square':
        this.client = new SquareClient();
        break;
      case 'clover':
        this.client = new CloverClient();
        break;
      default:
        throw new Error(`Unsupported POS: ${posSystem}`);
    }
  }

  async getMenu() {
    // Unified interface across all POS systems
    const rawMenu = await this.client.fetchMenu();
    return this.normalizeMenu(rawMenu);
  }

  async checkItemAvailability(items) {
    const inventory = await this.client.fetchInventory();
    return items.map(item => ({
      sku: item.sku,
      available: !inventory.outOfStock.includes(item.sku),
      price: inventory.prices[item.sku]
    }));
  }

  async createOrder(orderData) {
    const posOrder = this.transformOrderForPOS(orderData);
    const result = await this.client.submitOrder(posOrder);

    // Store order in local DB
    await Order.create({
      ...orderData,
      pos_order_id: result.id,
      pos_system: this.system
    });

    return result;
  }

  normalizeMenu(rawMenu) {
    // Transform POS-specific format to unified format
    // ... normalization logic
  }

  transformOrderForPOS(orderData) {
    // Transform unified format to POS-specific format
    // ... transformation logic
  }
}

module.exports = POSAdapter;
```

### Example: Tool Endpoint Handler

```javascript
// routes/tools.js
const express = require('express');
const router = express.Router();
const POSAdapter = require('../services/pos/adapter');
const Customer = require('../models/Customer');
const cache = require('../services/cache.service');

// Tool_POS_Check endpoint
router.post('/pos-check', async (req, res) => {
  try {
    const { action, items } = req.body;

    // Try cache first
    const cacheKey = `pos-check:${JSON.stringify(items)}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Query POS
    const pos = new POSAdapter(process.env.POS_SYSTEM);

    let result;
    switch(action) {
      case 'get_menu':
        result = await pos.getMenu();
        break;
      case 'check_stock':
        result = await pos.checkItemAvailability(items);
        break;
      case 'validate_item':
        result = await pos.checkItemAvailability(items);
        break;
    }

    // Cache for 5 minutes
    await cache.set(cacheKey, result, 300);

    res.json(result);

  } catch (error) {
    console.error('POS check error:', error);
    res.status(500).json({ error: 'POS system unavailable' });
  }
});

// Tool_Customer_Lookup endpoint
router.get('/customer-lookup', async (req, res) => {
  try {
    const { phone } = req.query;

    // Try cache
    const cached = await cache.get(`customer:${phone}`);
    if (cached) {
      return res.json(cached);
    }

    // Query database
    const customer = await Customer.findOne({
      where: { phone },
      include: ['addresses', 'orderHistory']
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Find "The Usual" (most frequent recent order)
    const favoriteOrder = customer.orderHistory
      .slice(0, 10)
      .reduce((acc, order) => {
        const key = JSON.stringify(order.items);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const result = {
      customer_id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      phone: customer.phone,
      addresses: customer.addresses,
      order_history: customer.orderHistory.slice(0, 5),
      loyalty_points: customer.loyalty_points,
      favorite_order: Object.keys(favoriteOrder)[0] || null
    };

    // Cache for 5 minutes
    await cache.set(`customer:${phone}`, result, 300);

    res.json(result);

  } catch (error) {
    console.error('Customer lookup error:', error);
    res.status(500).json({ error: 'Lookup failed' });
  }
});

module.exports = router;
```

---

## Deployment Architecture

### Production Environment (AWS)

```
┌────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Route 53 (DNS)                                           │  │
│  │ - api.yourapp.com                                        │  │
│  │ - dashboard.yourapp.com                                  │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CloudFront CDN                                           │  │
│  │ - Global edge locations                                  │  │
│  │ - SSL/TLS termination                                    │  │
│  │ - DDoS protection                                        │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│         ┌─────────────────┴─────────────────┐                  │
│         ▼                                   ▼                  │
│  ┌─────────────────┐              ┌──────────────────────┐    │
│  │ S3 + CloudFront │              │ Application Load     │    │
│  │ (Frontend)      │              │ Balancer (ALB)       │    │
│  │ - React build   │              │ - HTTPS listeners    │    │
│  │ - Static assets │              │ - Health checks      │    │
│  └─────────────────┘              │ - Path routing       │    │
│                                   └──────────┬───────────┘    │
│                                              │                 │
│                      ┌───────────────────────┼────────────┐    │
│                      ▼                       ▼            ▼    │
│           ┌──────────────────┐   ┌──────────────────┐ ┌────┐  │
│           │ ECS Fargate      │   │ ECS Fargate      │ │... │  │
│           │ (API Server 1)   │   │ (API Server 2)   │ │    │  │
│           │ - Node.js app    │   │ - Node.js app    │ │    │  │
│           │ - Auto-scaling   │   │ - Auto-scaling   │ │    │  │
│           └──────────────────┘   └──────────────────┘ └────┘  │
│                      │                       │                 │
│                      └───────────┬───────────┘                 │
│                                  │                             │
│                                  ▼                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ElastiCache (Redis)                                      │  │
│  │ - Cluster mode enabled                                   │  │
│  │ - Multi-AZ with automatic failover                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ RDS PostgreSQL                                           │  │
│  │ - Multi-AZ deployment                                    │  │
│  │ - Automated backups                                      │  │
│  │ - Read replicas for analytics                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ S3 Buckets                                               │  │
│  │ - call-recordings/                                       │  │
│  │ - transcripts/                                           │  │
│  │ - backups/                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CloudWatch                                               │  │
│  │ - Logs aggregation                                       │  │
│  │ - Metrics & dashboards                                   │  │
│  │ - Alarms → SNS → PagerDuty                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

External Services (via Internet):
- Twilio (SIP trunk)
- Vapi (WebSocket)
- Antigravity AI (HTTPS)
- OpenAI API (HTTPS)
- Deepgram (HTTPS)
- ElevenLabs (HTTPS)
- POS Systems (HTTPS)
```

**Infrastructure as Code (Terraform):**

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "api_cluster" {
  name = "qsr-phone-agent-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "api_task" {
  family                   = "qsr-phone-agent-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = jsonencode([{
    name  = "api"
    image = "${aws_ecr_repository.api.repository_url}:latest"

    portMappings = [{
      containerPort = 3000
      protocol      = "tcp"
    }]

    environment = [
      { name = "NODE_ENV", value = "production" },
      { name = "REDIS_HOST", value = aws_elasticache_cluster.redis.cache_nodes[0].address }
    ]

    secrets = [
      { name = "TWILIO_AUTH_TOKEN", valueFrom = aws_secretsmanager_secret.twilio.arn },
      { name = "STRIPE_SECRET_KEY", valueFrom = aws_secretsmanager_secret.stripe.arn }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/qsr-phone-agent"
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "api"
      }
    }
  }])
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "qsr-phone-agent-db"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100

  db_name  = "phoneagent"
  username = "admin"
  password = random_password.db_password.result

  multi_az               = true
  backup_retention_period = 7
  backup_window          = "03:00-04:00"

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "qsr-phone-agent-cache"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}
```

---

## Development Setup

### Local Environment Setup

**1. Prerequisites:**
```bash
# Install dependencies
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)
```

**2. Clone and Install:**
```bash
git clone https://github.com/yourorg/qsr-phone-agent.git
cd qsr-phone-agent

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**3. Environment Configuration:**

```bash
# backend/.env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://localhost:5432/phoneagent_dev
REDIS_URL=redis://localhost:6379

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Vapi
VAPI_API_KEY=xxxxx
VAPI_ASSISTANT_ID=xxxxx

# Antigravity AI
ANTIGRAVITY_API_KEY=xxxxx

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-xxxxx

# POS Systems (choose one)
POS_SYSTEM=toast  # or 'square', 'clover'
TOAST_API_KEY=xxxxx
TOAST_RESTAURANT_ID=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Pinecone
PINECONE_API_KEY=xxxxx
PINECONE_INDEX=menu-knowledge

# AWS (for S3)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=qsr-phone-agent-recordings
```

**4. Database Setup:**
```bash
# Create database
createdb phoneagent_dev

# Run migrations
cd backend
npx sequelize-cli db:migrate

# Seed sample data
npx sequelize-cli db:seed:all
```

**5. Start Development Servers:**

```bash
# Terminal 1: Backend API
cd backend
npm run dev  # Runs on http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev  # Runs on http://localhost:5173

# Terminal 3: Redis (if not using Docker)
redis-server

# Terminal 4: PostgreSQL (if not using Docker)
postgres -D /usr/local/var/postgres
```

**6. Docker Compose (Alternative):**

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: phoneagent_dev
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/phoneagent_dev
      REDIS_URL: redis://redis:6379
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

```bash
# Start all services
docker-compose up -d
```

---

## Integration Flow Examples

### Complete Call Flow with API Interactions

```
1. Customer calls restaurant phone number
   └─> Twilio receives call
       └─> Extracts caller ID: +15551234567
           └─> Establishes WebSocket to Vapi

2. Vapi starts conversation
   └─> Plays first message (TTS via ElevenLabs)
       └─> "Thanks for calling Pizza Pizza, this is Emma..."

3. Customer responds: "Delivery please"
   └─> Deepgram converts speech to text
       └─> Vapi sends to Antigravity LLM
           └─> Antigravity classifies intent: "new_order_delivery"
               └─> Calls Tool_Customer_Lookup
                   └─> GET /api/v1/tools/customer-lookup?phone=+15551234567
                       └─> Backend queries PostgreSQL
                           └─> Customer found with address
                               └─> Returns customer data to Antigravity
                                   └─> Antigravity generates response:
                                       "Great! I have your address as 123 Main St..."

4. Customer: "I want two large pepperonis"
   └─> Antigravity extracts entities: [{ type: pizza, size: large, variety: pepperoni, qty: 2 }]
       └─> Calls Tool_POS_Check
           └─> POST /api/v1/tools/pos-check
               Body: { action: "validate_item", items: [{ sku: "PIZ-LG-PEP", quantity: 2 }] }
               └─> Backend checks Redis cache (miss)
                   └─> Queries Toast API
                       └─> GET https://api.toasttab.com/restaurants/v2/menus
                           └─> Item available, price: $14.99
                               └─> Cache result in Redis (TTL: 5min)
                                   └─> Return to Antigravity
                                       └─> Response: "Got it, two large pepperonis at $14.99 each..."

5. Upsell trigger: No side items
   └─> Antigravity suggests: "Can I add 8-piece wings for $9.99?"
       └─> Customer: "Sure"
           └─> Add to order

6. Order confirmation
   └─> Antigravity calls Tool_Order_Submit
       └─> POST /api/v1/tools/order-submit
           Body: { customer_id, items: [...], fulfillment: "delivery", ... }
           └─> Backend:
               ├─> Calculate pricing (tax, delivery fee)
               ├─> Create order in PostgreSQL
               ├─> Submit to Toast API
               │   └─> POST https://api.toasttab.com/restaurants/v2/orders
               │       └─> Toast returns order_id: "TOAST-42"
               ├─> Generate Stripe checkout session
               │   └─> POST https://api.stripe.com/v1/checkout/sessions
               │       └─> Stripe returns session URL
               ├─> Send SMS payment link via Twilio
               │   └─> POST https://api.twilio.com/2010-04-01/.../Messages
               └─> Return order confirmation to Antigravity
                   └─> Response: "Order 42 is on the way. Payment link sent!"

7. Call ends
   └─> Vapi sends webhook: call.ended
       └─> POST /api/v1/webhooks/vapi
           └─> Backend logs call metrics to PostgreSQL
               └─> Update analytics_metrics table
                   └─> WebSocket push to dashboard (live update)

8. Customer completes payment
   └─> Stripe webhook: checkout.session.completed
       └─> POST /api/v1/webhooks/stripe
           └─> Backend updates order status to "paid"
               └─> Notify Toast to start preparing
                   └─> Kitchen receives order on KDS
```

---

## Next Steps

1. **Set up development environment** using the guide above
2. **Configure Twilio** phone number and SIP trunk
3. **Create Vapi assistant** with function calling
4. **Implement backend API** following the project structure
5. **Connect POS system** (start with one: Toast, Square, or Clover)
6. **Build frontend dashboard** for monitoring
7. **Test end-to-end** with test calls
8. **Deploy to staging** environment
9. **Load test** with simulated calls
10. **Production deployment** with gradual rollout

---

**Document Version:** 1.0
**Contact:** architecture@grubgenius.com
**Last Updated:** 2026-01-03

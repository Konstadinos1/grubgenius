# QSR Phone Agent Workflow Plan
## Autonomous AI Voice Agent for High-Volume Quick Service Restaurants

**Version:** 1.0
**Platform:** Antigravity AI
**Target Environment:** Pizza Pizza-style QSR Operations
**Last Updated:** 2026-01-02

---

## Executive Summary

This document outlines the complete workflow for an autonomous AI phone agent designed to handle high-volume inbound calls for Quick Service Restaurants. The system integrates telephony, advanced LLM processing, and POS systems to deliver a seamless ordering experience that outperforms human staff in consistency, speed, and upselling effectiveness.

**Key Performance Indicators:**
- **Response Time:** <1 ring (3-5 seconds)
- **Order Accuracy:** >95% through real-time POS validation
- **Upsell Success Rate:** Target 40-60% attachment rate
- **Human Handoff Rate:** <5% of total calls
- **Concurrent Call Handling:** Unlimited (vs. 1-2 for human staff)

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Order Logic Tree (Decision Flow)](#2-order-logic-tree-decision-flow)
3. [API Schema Requirements](#3-api-schema-requirements)
4. [Antigravity Tool Capabilities](#4-antigravity-tool-capabilities)
5. [Upselling Strategy & Logic](#5-upselling-strategy--logic)
6. [Error Handling & Human Handoff](#6-error-handling--human-handoff)
7. [Edge Cases & Recovery Strategies](#7-edge-cases--recovery-strategies)
8. [Performance Optimization](#8-performance-optimization)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INBOUND CALL FLOW                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  TELEPHONY LAYER (SIP/PSTN)                                      │
│  - Phone Number Routing                                          │
│  - Caller ID Extraction                                          │
│  - Call Queue Management                                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  VOICE API LAYER (Vapi/Retell)                                   │
│  - Speech-to-Text (STT): Real-time streaming                     │
│  - Text-to-Speech (TTS): Natural voice synthesis                │
│  - Voice Activity Detection (VAD)                                │
│  - Confidence Scoring                                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ANTIGRAVITY AI PLATFORM (Agent Orchestration)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ LLM Core (GPT-4/Claude)                                    │  │
│  │ - Intent Classification                                    │  │
│  │ - Entity Extraction                                        │  │
│  │ - Context Management                                       │  │
│  │ - Conversation State Machine                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Tool Execution Engine                                      │  │
│  │ - POS API Client                                           │  │
│  │ - Customer Lookup Service                                  │  │
│  │ - Menu Knowledge Base (RAG)                                │  │
│  │ - Order Validation Engine                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  POS INTEGRATION LAYER       │  │  KNOWLEDGE BASE (RAG)        │
│  - Toast API                 │  │  - Menu Items & Descriptions │
│  - Square API                │  │  - Allergen Information      │
│  - Clover API                │  │  - Nutritional Data          │
│  - Generic REST Adapter      │  │  - Promotional Content       │
└──────────────────────────────┘  └──────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  POS/KDS SYSTEM (Kitchen Display System)                        │
│  - Order Routing                                                 │
│  - Payment Processing                                            │
│  - Inventory Management                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Details

#### 1.2.1 Telephony Layer
- **Provider Options:** Twilio, Vonage, Bandwidth
- **Configuration:**
  - SIP Trunking for enterprise-grade reliability
  - Auto-failover to secondary numbers
  - Geographic routing for multi-location brands
  - Call recording for quality assurance & training

#### 1.2.2 Voice API Layer (Vapi/Retell)
**Recommended: Vapi for Production**

| Feature | Configuration | Rationale |
|---------|---------------|-----------|
| STT Engine | Deepgram Nova-2 | Lowest latency (300ms), best accent handling |
| TTS Voice | ElevenLabs Multilingual v2 | Most natural, customizable brand voice |
| VAD Sensitivity | Medium-High | QSR environments have background noise |
| Endpointing | 800ms silence threshold | Balance between interruption and wait time |
| Barge-in | Enabled | Allow customers to interrupt upsell prompts |

#### 1.2.3 Antigravity AI Platform
- **LLM Model:** GPT-4 Turbo or Claude 3.5 Sonnet
- **Context Window:** 16k tokens (handles complex multi-item orders)
- **Function Calling:** Native support for POS API tools
- **State Persistence:** Redis for multi-turn conversation context

#### 1.2.4 POS Integration Layer
**Unified API Adapter Pattern:**
```javascript
class POSAdapter {
  async getMenu()       // Retrieve current menu with prices
  async checkStock()    // Verify item availability (86-ed items)
  async createOrder()   // Submit order to KDS
  async getCustomer()   // Lookup customer by phone
  async applyDiscount() // Apply promotional codes
}
```

**Specific Implementations:**
- **Toast:** REST API v2 + Webhooks for real-time updates
- **Square:** Catalog API + Orders API
- **Clover:** REST API + Atomic Orders

---

## 2. Order Logic Tree (Decision Flow)

### 2.1 State Machine Overview

```
[CALL_START] → [GREETING] → [ORDER_TYPE] → [ITEM_INTAKE] → [VALIDATION]
    → [UPSELL_LOOP] → [CONFIRMATION] → [PAYMENT_INFO] → [SUBMIT] → [END]
                           ↓
                    [HUMAN_HANDOFF] (if needed)
```

### 2.2 Detailed State Definitions

#### STATE 1: GREETING
**Duration:** 5-7 seconds
**Agent Prompt:**
```
"Thanks for calling [Business Name], this is [Agent Name].
Are we starting a new order for pickup or delivery today?"
```

**Intent Recognition:**
- `new_order_pickup`
- `new_order_delivery`
- `track_existing_order`
- `complaint_or_issue`
- `question_about_menu`

**Branch Logic:**
- If Caller ID matches existing customer → Trigger `Tool_Customer_Lookup`
- If recognized → "Welcome back, [Name]! Would you like your usual [Last Order]?"
- If delivery → Collect/verify address before proceeding
- If complaint → Immediate transfer to manager (STATE: HUMAN_HANDOFF)

#### STATE 2: ORDER_TYPE_COLLECTION
**Delivery-Specific Sub-Flow:**
```
Agent: "Great! What's the delivery address?"
Customer: "123 Main Street"
Agent: [Calls Tool_Address_Validation]
  - If in delivery zone → "Perfect, we deliver there in 30-40 minutes."
  - If out of zone → "I'm sorry, that's outside our delivery area.
                      We can do pickup at [Nearest Location]?"
```

#### STATE 3: ITEM_INTAKE (Core Ordering Loop)
**Natural Language Processing:**

**Example Customer Utterances:**
- "I want two large pepperonis and a diet coke"
- "Can I get the meat lovers with extra cheese?"
- "Large cheese pizza, hold the mushrooms"

**Agent Processing:**
1. **Entity Extraction:**
   ```json
   {
     "items": [
       {
         "type": "pizza",
         "size": "large",
         "variety": "pepperoni",
         "quantity": 2,
         "modifications": []
       },
       {
         "type": "beverage",
         "variety": "diet coke",
         "size": "2L",
         "quantity": 1
       }
     ]
   }
   ```

2. **Real-Time Validation (Tool_POS_Check):**
   ```javascript
   // API Call to POS
   const validation = await POS.validateItems([
     { sku: "PIZ-LG-PEP", quantity: 2 },
     { sku: "BEV-DCOKE-2L", quantity: 1 }
   ]);

   // Response
   {
     "PIZ-LG-PEP": { available: true, price: 14.99 },
     "BEV-DCOKE-2L": { available: false, substitute: "BEV-COKE-2L" }
   }
   ```

3. **Agent Response:**
   ```
   "Got it! Two large pepperonis. Just so you know, we're out of
   Diet Coke today, but I can do regular Coke or Sprite. Which works?"
   ```

**Handling Ambiguity:**
| Customer Says | Ambiguity | Agent Clarification |
|---------------|-----------|---------------------|
| "Large pizza" | Which variety? | "Which pizza would you like? We have pepperoni, cheese, veggie..." |
| "Extra cheese" | Paid topping? | "Did you want to add extra cheese for $2.50?" |
| "The usual" | No history found | "I don't see a previous order. What can I start for you?" |

#### STATE 4: UPSELL_LOOP
**(See Section 5 for detailed upselling logic)**

#### STATE 5: CONFIRMATION
**Agent Script:**
```
"Perfect! Let me confirm your order:
- Two large pepperoni pizzas: $29.98
- One 2-liter Coke: $3.99
- Eight wings (your upgrade): $9.99

Your subtotal is $43.96, plus tax brings you to $49.70.
This will be ready for [pickup/delivery] in about 35 minutes.

Should I go ahead and send that to the kitchen?"
```

**Customer Confirmation:**
- "Yes" → Proceed to PAYMENT_INFO
- "Actually, change..." → Return to ITEM_INTAKE
- "Cancel" → "No problem! Call us back anytime."

#### STATE 6: PAYMENT_INFO
**Pickup Orders:**
```
"We'll have your order ready in 30 minutes. The total is $49.70.
You can pay when you arrive. What name should I put this under?"
```

**Delivery Orders:**
```
"For delivery, I'll need a credit card. You can give me the number now,
or I can text you a secure payment link. Which do you prefer?"
```

**PCI Compliance:**
- **Option A:** Use Vapi's secure IVR transfer for card input (DTMF tones)
- **Option B:** Send SMS payment link (Stripe Checkout)
- **Never** have the LLM process raw card numbers

#### STATE 7: ORDER_SUBMIT
**API Call to POS:**
```javascript
const order = await POS.createOrder({
  source: "phone_ai_agent",
  customer: {
    phone: "+15551234567",
    name: "John Smith",
    address: "123 Main St" // if delivery
  },
  items: [
    { sku: "PIZ-LG-PEP", quantity: 2, price: 14.99, mods: [] },
    { sku: "BEV-COKE-2L", quantity: 1, price: 3.99 },
    { sku: "APP-WINGS-8", quantity: 1, price: 9.99 }
  ],
  fulfillment_type: "pickup",
  payment_method: "cash_on_pickup",
  special_instructions: "Extra napkins"
});

// Response
{
  "order_id": "ORD-20260102-00042",
  "estimated_ready_time": "2026-01-02T18:35:00Z",
  "confirmation_code": "PICK42"
}
```

**Agent Closing:**
```
"All set! Your order number is 42, and we'll have it ready by 6:35 PM.
Thanks for calling [Business Name], see you soon!"
```

---

## 3. API Schema Requirements

### 3.1 POS → Agent (Required Data Points)

#### Menu Data Endpoint
**GET /api/v1/menu**

```json
{
  "categories": [
    {
      "id": "pizza",
      "name": "Pizzas",
      "items": [
        {
          "id": "PIZ-LG-PEP",
          "name": "Large Pepperoni Pizza",
          "description": "Classic pepperoni with mozzarella cheese",
          "sizes": [
            {
              "size": "medium",
              "price": 12.99,
              "calories": 1800,
              "available": true
            },
            {
              "size": "large",
              "price": 14.99,
              "calories": 2400,
              "available": true
            }
          ],
          "modifiers": [
            {
              "id": "MOD-EXTRACHS",
              "name": "Extra Cheese",
              "price": 2.50,
              "available": true
            }
          ],
          "allergens": ["dairy", "gluten"],
          "is_86ed": false  // Out of stock flag
        }
      ]
    }
  ],
  "last_updated": "2026-01-02T15:30:00Z"
}
```

**Caching Strategy:** Update every 5 minutes or on webhook notification

#### Inventory Status Endpoint
**GET /api/v1/inventory/status**

```json
{
  "86ed_items": [
    {
      "sku": "BEV-DCOKE-2L",
      "reason": "out_of_stock",
      "expected_restock": "2026-01-03T09:00:00Z",
      "suggested_substitute": "BEV-COKE-2L"
    }
  ],
  "low_stock_items": ["APP-WINGS-12"]
}
```

**Real-Time Updates:** Webhook notification when items are 86'd

#### Customer Lookup Endpoint
**GET /api/v1/customers/lookup?phone=+15551234567**

```json
{
  "customer_id": "CUST-98765",
  "name": "John Smith",
  "phone": "+15551234567",
  "email": "john@example.com",
  "addresses": [
    {
      "id": "ADDR-001",
      "street": "123 Main St",
      "city": "Toronto",
      "postal_code": "M5V 3A8",
      "is_default": true,
      "delivery_zone": "zone_1",
      "delivery_fee": 4.99
    }
  ],
  "order_history": [
    {
      "order_id": "ORD-20260101-00312",
      "date": "2026-01-01",
      "items": [
        { "name": "Large Pepperoni Pizza", "quantity": 2 }
      ],
      "total": 34.56,
      "is_favorite": true  // "The Usual" marker
    }
  ],
  "loyalty_points": 450,
  "lifetime_value": 1247.50,
  "preferred_payment": "visa_ending_4242"
}
```

### 3.2 Agent → POS (Order Submission Schema)

**POST /api/v1/orders**

```json
{
  "order": {
    "source": "antigravity_phone_agent",
    "call_id": "CALL-20260102-18234",
    "customer": {
      "id": "CUST-98765",  // If existing
      "phone": "+15551234567",
      "name": "John Smith",
      "email": "john@example.com"  // Optional
    },
    "fulfillment": {
      "type": "delivery",  // or "pickup"
      "address_id": "ADDR-001",
      "requested_time": "asap",  // or ISO timestamp
      "delivery_instructions": "Ring doorbell twice"
    },
    "items": [
      {
        "sku": "PIZ-LG-PEP",
        "quantity": 2,
        "unit_price": 14.99,
        "modifiers": [
          { "id": "MOD-EXTRACHS", "quantity": 1 }
        ],
        "special_instructions": "Well done"
      }
    ],
    "pricing": {
      "subtotal": 43.96,
      "tax": 5.74,
      "delivery_fee": 4.99,
      "tip": 5.00,
      "discount": 0.00,
      "total": 59.69
    },
    "payment": {
      "method": "card_on_file",  // or "cash", "card_on_delivery"
      "payment_intent_id": "pi_stripe_abc123"  // If prepaid
    },
    "metadata": {
      "upsell_accepted": ["APP-WINGS-8"],
      "agent_version": "v2.1.0",
      "call_duration_seconds": 142,
      "confidence_score": 0.94
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "ORD-20260102-00042",
  "confirmation_code": "PICK42",
  "estimated_ready_time": "2026-01-02T18:35:00Z",
  "kitchen_received": true,
  "customer_notifications": {
    "sms_sent": true,
    "email_sent": false
  }
}
```

### 3.3 Delivery Zone Validation

**GET /api/v1/delivery/zones/validate?address=123+Main+St&postal_code=M5V3A8**

```json
{
  "is_deliverable": true,
  "zone": "zone_1",
  "delivery_fee": 4.99,
  "estimated_time_minutes": 35,
  "minimum_order": 15.00,
  "free_delivery_threshold": 30.00,
  "distance_km": 2.8
}
```

---

## 4. Antigravity Tool Capabilities

### 4.1 Tool Registry

```python
# Antigravity Tool Definitions

tools = [
    {
        "name": "Tool_POS_Check",
        "description": "Query POS for menu prices, item availability, and 86'd items",
        "parameters": {
            "action": {
                "type": "enum",
                "values": ["get_menu", "check_stock", "validate_item"]
            },
            "items": {
                "type": "array",
                "items": {
                    "sku": "string",
                    "quantity": "integer"
                }
            }
        },
        "timeout_ms": 2000,
        "retry_policy": "exponential_backoff"
    },

    {
        "name": "Tool_Customer_Lookup",
        "description": "Retrieve customer data, order history, and 'The Usual' preferences",
        "parameters": {
            "phone": {
                "type": "string",
                "format": "E164"  # +15551234567
            },
            "include_history": {
                "type": "boolean",
                "default": True
            }
        },
        "timeout_ms": 1500
    },

    {
        "name": "Tool_Order_Submit",
        "description": "POST finalized order to POS Kitchen Display System",
        "parameters": {
            "order_payload": {
                "type": "object",
                "schema": "OrderSchema_v2"  # See Section 3.2
            }
        },
        "timeout_ms": 3000,
        "retry_policy": "none",  # Only attempt once to avoid duplicate orders
        "confirmation_required": True
    },

    {
        "name": "Tool_Menu_Knowledge_Base",
        "description": "RAG query for allergens, calories, ingredients, promotions",
        "parameters": {
            "query": {
                "type": "string",
                "examples": [
                    "Does the veggie pizza contain gluten?",
                    "How many calories in a large pepperoni?",
                    "What's in the garlic dipping sauce?"
                ]
            },
            "max_results": {
                "type": "integer",
                "default": 3
            }
        },
        "timeout_ms": 1000
    },

    {
        "name": "Tool_Address_Validation",
        "description": "Validate delivery address and calculate zone/fee",
        "parameters": {
            "address": {
                "type": "string"
            },
            "postal_code": {
                "type": "string",
                "optional": True
            }
        },
        "timeout_ms": 2000
    },

    {
        "name": "Tool_Calculate_Pricing",
        "description": "Calculate order totals including tax, fees, discounts",
        "parameters": {
            "items": "array",
            "fulfillment_type": "enum[pickup, delivery]",
            "promo_code": "string (optional)"
        },
        "timeout_ms": 500
    },

    {
        "name": "Tool_Human_Handoff",
        "description": "Initiate SIP transfer to in-store staff or manager",
        "parameters": {
            "reason": {
                "type": "enum",
                "values": ["complaint", "complex_question", "payment_issue", "customer_request"]
            },
            "context": {
                "type": "string",
                "description": "Summary to brief human agent"
            }
        },
        "timeout_ms": 5000
    }
]
```

### 4.2 Tool Execution Flow Example

**Scenario:** Customer says *"I want a large pepperoni and wings"*

```python
# Agent's internal reasoning
user_utterance = "I want a large pepperoni and wings"

# Step 1: Entity extraction
entities = llm.extract_entities(user_utterance)
# → { items: [{ type: "pizza", size: "large", variety: "pepperoni" },
#             { type: "appetizer", variety: "wings" }] }

# Step 2: Resolve ambiguity (wings size not specified)
agent_response = "Sure! Did you want the 8-piece or 12-piece wings?"
# → Customer: "Eight piece"

# Step 3: Call Tool_POS_Check
result = await Tool_POS_Check({
    "action": "validate_item",
    "items": [
        { "sku": "PIZ-LG-PEP", "quantity": 1 },
        { "sku": "APP-WINGS-8", "quantity": 1 }
    ]
})

# Step 4: Process tool result
if result["PIZ-LG-PEP"]["available"]:
    agent_response += "One large pepperoni: $14.99"

if result["APP-WINGS-8"]["available"]:
    agent_response += " and eight wings: $9.99. Anything else?"
```

---

## 5. Upselling Strategy & Logic

### 5.1 Core Upselling Principles

**Psychology-Driven Approach:**
1. **Timing:** Upsell AFTER primary order is confirmed (not before)
2. **Relevance:** Suggest items that complement the order
3. **Value Framing:** Focus on benefits, not just price
4. **Single Ask:** Don't overwhelm with multiple upsells at once
5. **Easy Decline:** Make "no thanks" frictionless

### 5.2 Mandatory Upsell Rules

#### Rule A: No Side Item → Suggest Appetizer
**Trigger Condition:**
```javascript
if (order.has_pizza && !order.has_appetizer) {
    return UPSELL_APPETIZER;
}
```

**Agent Script:**
```
"Perfect! Just so you know, our wings and garlic bites are super
popular to go with that pizza. Can I add an 8-piece wings for $9.99?"
```

**Data-Driven Selection:**
- If order has 2+ pizzas → Suggest larger appetizer (12-piece wings)
- If order is <$25 → Suggest lower-price appetizer (garlic bites $5.99)
- Use customer history: "Last time you loved the wings, want those again?"

#### Rule B: No Beverage → Suggest Drink
**Trigger Condition:**
```javascript
if (order.total_items >= 2 && !order.has_beverage) {
    return UPSELL_BEVERAGE;
}
```

**Agent Script:**
```
"And can I grab you a 2-liter Pepsi or some bottled water with that?"
```

**Smart Pairing:**
- Pizza + Wings → Suggest 2L soda ($3.99)
- Single item order → Suggest bottled water ($1.99)
- Delivery orders → Emphasize convenience: "Save a trip, add drinks now?"

#### Rule C: Below Free Delivery Threshold → Suggest Combo Upgrade
**Trigger Condition:**
```javascript
if (order.fulfillment_type === "delivery" &&
    order.subtotal < FREE_DELIVERY_THRESHOLD &&
    (FREE_DELIVERY_THRESHOLD - order.subtotal) <= 15) {
    return UPSELL_THRESHOLD;
}
```

**Agent Script (Example: $30 threshold, order is $24):**
```
"Just a heads up—you're only $6 away from free delivery.
I could add a side of breadsticks for $5.99 and save you the $4.99 delivery fee.
That's basically free breadsticks!"
```

**Calculation Display:**
```
Current Total:    $24.00
+ Delivery Fee:   $ 4.99
─────────────────────────
                  $28.99

WITH BREADSTICKS:
Current Total:    $24.00
+ Breadsticks:    $ 5.99
+ Delivery Fee:   $ 0.00 (FREE!)
─────────────────────────
                  $29.99  ← Save $1.00 + get breadsticks!
```

### 5.3 Advanced Upselling (Optional)

#### Time-Based Promotions
```javascript
const currentHour = new Date().getHours();

if (currentHour >= 14 && currentHour <= 17) {  // 2-5 PM slow period
    agent.append_upsell("By the way, it's Happy Hour! " +
        "Second pizza is 50% off if you order now.");
}
```

#### Loyalty-Based Upselling
```javascript
if (customer.loyalty_points >= 400) {
    agent.append_upsell("You have 450 points! That's enough for " +
        "a free order of wings. Want to redeem those today?");
}
```

#### High-Value Customer Recognition
```javascript
if (customer.lifetime_value > 500) {
    agent.tone = "VIP";  // More personalized, premium suggestions
    agent.append_upsell("As one of our VIP customers, I can offer you " +
        "our new truffle pizza—it's not on the regular menu yet.");
}
```

### 5.4 Upsell Performance Tracking

**Metrics to Log:**
```json
{
  "call_id": "CALL-20260102-18234",
  "upsells_attempted": [
    {
      "type": "appetizer",
      "item": "APP-WINGS-8",
      "trigger": "no_side_item",
      "accepted": true,
      "incremental_revenue": 9.99
    },
    {
      "type": "beverage",
      "item": "BEV-PEPSI-2L",
      "trigger": "no_beverage",
      "accepted": false
    }
  ],
  "upsell_revenue": 9.99,
  "base_order_revenue": 14.99,
  "upsell_percentage": 66.6
}
```

**Weekly Report:**
- Upsell acceptance rate by item
- Revenue per call (with vs. without upsells)
- Top-performing upsell triggers
- A/B test different upsell scripts

---

## 6. Error Handling & Human Handoff

### 6.1 Confidence Scoring & Recovery

**Low Confidence Scenarios:**

| Confidence Score | Agent Action | Example |
|------------------|--------------|---------|
| < 0.5 | Immediate re-prompt | "I didn't catch that. Could you repeat?" |
| 0.5 - 0.7 | Confirm interpretation | "Did you say large *pepperoni* or large *cheese*?" |
| 0.7 - 0.85 | Proceed with caution | (Continue, but flag for review) |
| > 0.85 | High confidence | (Proceed normally) |

**Implementation:**
```python
def handle_low_confidence(transcription, confidence_score):
    if confidence_score < 0.5:
        return agent_say("Sorry, it's a bit noisy. Could you repeat that?")

    elif confidence_score < 0.7:
        # Extract best-guess entities and confirm
        entities = llm.extract_entities(transcription)
        confirmation = format_confirmation(entities)
        return agent_say(f"Just to confirm, you said {confirmation}. Is that right?")

    else:
        # Proceed but log for quality review
        log_warning(f"Medium confidence: {confidence_score} - '{transcription}'")
        return proceed_with_order(transcription)
```

### 6.2 Human Handoff Triggers

**Automatic Handoff Scenarios:**

1. **Customer Explicitly Requests:**
   - "Let me talk to a person"
   - "I want to speak to the manager"
   - "Are you a robot?"

   **Agent Response:**
   ```
   "Of course! Let me transfer you to someone in the store right now.
   One moment please."
   ```

2. **Complaint or Issue:**
   - "My last order was wrong"
   - "I was charged twice"
   - "The food was cold"

   **Agent Response:**
   ```
   "I'm really sorry to hear that. Let me get you to a manager who
   can help make this right. Please hold."
   ```

3. **Complex Question Outside Knowledge Base:**
   - "Do you cater for 100 people?"
   - "Can I order for next Tuesday?"
   - "Do you have a catering menu?"

   **Agent Response:**
   ```
   "That's a great question! Let me connect you with someone who can
   help with that. One second."
   ```

4. **Payment Processing Failure:**
   - Card declined 2+ times
   - Customer disputes charge

   **Agent Response:**
   ```
   "I'm having trouble processing that payment. Let me transfer you
   to someone who can help."
   ```

5. **Technical Error:**
   - POS API timeout (>3 seconds)
   - Order submission fails twice

   **Agent Response:**
   ```
   "I'm experiencing a technical issue. Let me get you to someone
   in the store who can take your order directly."
   ```

### 6.3 Handoff Protocol

**SIP Transfer Process:**
```javascript
async function initiate_handoff(reason, context) {
    // 1. Notify in-store staff
    await notify_staff({
        type: "incoming_transfer",
        reason: reason,
        customer_phone: call.caller_id,
        context: context,
        call_duration: call.elapsed_time
    });

    // 2. Brief customer
    agent_say("Transferring you now. Thanks for holding!");

    // 3. Perform SIP transfer
    await vapi.transfer_call({
        destination: store_phone_number,
        transfer_type: "warm",  // Stay on line until answered
        timeout_seconds: 30
    });

    // 4. Log handoff
    log_event({
        event: "human_handoff",
        reason: reason,
        call_id: call.id,
        timestamp: new Date()
    });
}
```

**Warm Transfer Context (What Human Agent Sees):**
```
📞 INCOMING TRANSFER FROM AI AGENT

Customer: John Smith (+1-555-123-4567)
Reason: Customer complaint about previous order
Context: Customer mentioned "last order was wrong"

Order In Progress:
- 2x Large Pepperoni ($29.98)
- 1x Wings 8pc ($9.99)

Call Duration: 2:34
AI Confidence: 0.82
```

### 6.4 Fallback to SMS Ordering

**When Voice Fails Completely:**
```python
if consecutive_failures >= 3:
    agent_say("I'm having trouble hearing you clearly. " +
              "I can text you a link to place your order online instead. " +
              "Should I send that to this number?")

    if customer_agrees:
        send_sms(
            to=call.caller_id,
            message=f"Order online: https://order.pizzapizza.com?ref=call_{call.id}"
        )
```

---

## 7. Edge Cases & Recovery Strategies

### 7.1 Background Noise Handling

**High-Noise Environments:**
- Drive-through
- Busy restaurant
- Outdoor calling

**Detection:**
```python
if noise_level_db > 70:
    agent.tts_volume = 1.2  # Speak louder
    agent.vad_sensitivity = "high"  # More aggressive noise cancellation
```

**Recovery Script:**
```
"It sounds like you're in a noisy spot. If it's easier, I can text
you to finish the order, or we can keep trying. What works for you?"
```

### 7.2 Multiple Speakers on Call

**Detection:**
```python
if voice_diarization.speakers_detected > 1:
    agent_say("I hear a few voices! Just to make sure I get this right, " +
              "can one person give me the full order?")
```

**Family Order Scenario:**
```
Customer 1: "I want pepperoni"
Customer 2: "And I want veggie!"
Customer 1: "Oh and add wings"

Agent: "Got it! So that's one pepperoni, one veggie, and wings.
        What size for the pizzas—both large?"
```

### 7.3 Language & Accent Challenges

**Non-Native English Speakers:**
```python
if confidence_score < 0.6 and retry_count < 2:
    agent.tts_speed = 0.9  # Speak slower
    agent.use_simpler_vocabulary = True

    agent_say("No problem, I'll go slow. Did you want pickup or delivery?")
```

**Multilingual Support (Future):**
```python
if detected_language == "spanish":
    agent.switch_language("es-MX")
    agent_say("¡Hola! ¿Es para recoger o entregar?")
```

### 7.4 Menu Item Not Found

**Customer Says:** "I want the Super Supreme Deluxe"
**Issue:** That item doesn't exist in POS

**Recovery:**
```python
fuzzy_match = find_closest_menu_item("Super Supreme Deluxe")
# → Result: "Supreme Pizza" (confidence: 0.78)

if fuzzy_match.confidence > 0.7:
    agent_say(f"We don't have a 'Super Supreme Deluxe', but we have a " +
              f"{fuzzy_match.name}. Is that what you meant?")
else:
    agent_say("I don't see that one on the menu. Let me list our specialty " +
              "pizzas: Pepperoni, Supreme, Veggie Deluxe, Meat Lovers...")
```

### 7.5 Caller Hangs Up Mid-Order

**Detection:**
```python
if call_status == "disconnected" and order_state != "completed":
    # Save partial order
    save_abandoned_order({
        "customer_phone": call.caller_id,
        "partial_order": current_order,
        "state": order_state,
        "timestamp": now()
    })

    # Send follow-up SMS after 2 minutes
    schedule_sms(
        delay_seconds=120,
        message="Hi! We got disconnected. Reply YES to complete your order, " +
                "or call us back anytime!"
    )
```

### 7.6 Price Discrepancy

**Customer Says:** "Wait, I saw online the large is $12.99, not $14.99"

**Agent Response:**
```
"You might be looking at an old promotion. The current price is $14.99,
but I can check if we have any active deals. One second..."

[Calls Tool_Menu_Knowledge_Base with query: "current promotions"]

"Actually, we do have a '2 for $25' deal on large pizzas right now.
Want to add a second pizza and save $5?"
```

### 7.7 System Outage Scenarios

**POS API Down:**
```python
if POS.health_check() == False:
    agent_say("I'm having trouble connecting to our order system. " +
              "I can take your order and call you back to confirm in 5 minutes, " +
              "or you can try calling again shortly. Which works better?")

    if customer_chooses_callback:
        # Manually log order details
        email_to_manager({
            "subject": "MANUAL ORDER - POS DOWN",
            "customer": call.caller_id,
            "order_details": transcription_log
        })
```

---

## 8. Performance Optimization

### 8.1 Latency Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Speech-to-Text Latency | <400ms | 800ms |
| LLM Response Generation | <1000ms | 2000ms |
| Text-to-Speech Latency | <300ms | 600ms |
| POS API Call | <500ms | 2000ms |
| Total Turn Latency | <2000ms | 4000ms |

**Turn Latency = Time from customer stops speaking to agent starts speaking**

### 8.2 Optimization Strategies

#### 8.2.1 Streaming Responses
```python
# Don't wait for full LLM response before starting TTS
async def stream_agent_response():
    llm_stream = llm.generate_stream(prompt)
    tts_buffer = ""

    async for token in llm_stream:
        tts_buffer += token

        # Start speaking after first complete sentence
        if token in ['.', '!', '?']:
            await vapi.speak(tts_buffer)
            tts_buffer = ""
```

#### 8.2.2 Predictive API Calls
```python
# Call Tool_POS_Check proactively while customer is still speaking
async def handle_customer_utterance(partial_transcription):
    if "pizza" in partial_transcription.lower():
        # Start fetching menu data before customer finishes
        asyncio.create_task(Tool_POS_Check.prefetch_menu())
```

#### 8.2.3 Menu Data Caching
```python
# Cache menu in Redis with 5-minute TTL
menu_cache = redis.get("menu:current")
if not menu_cache or is_stale(menu_cache):
    menu_cache = await POS.get_menu()
    redis.setex("menu:current", 300, menu_cache)  # 5-minute cache
```

### 8.3 Monitoring & Alerts

**Real-Time Dashboards:**
- Active call count
- Average turn latency
- POS API success rate
- Upsell acceptance rate
- Human handoff percentage

**Alert Conditions:**
```yaml
alerts:
  - name: "High Latency"
    condition: avg_turn_latency > 3000ms
    duration: 5 minutes
    action: notify_engineering_team

  - name: "POS API Degradation"
    condition: pos_api_success_rate < 95%
    duration: 2 minutes
    action: page_on_call

  - name: "High Handoff Rate"
    condition: handoff_percentage > 15%
    duration: 10 minutes
    action: review_call_recordings
```

---

## 9. Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Antigravity AI account and project
- [ ] Configure Vapi/Retell account with phone number
- [ ] Implement POS API adapters (Toast, Square, Clover)
- [ ] Build menu data caching system
- [ ] Create basic order flow state machine
- [ ] Test with simple orders (single item, pickup only)

### Phase 2: Core Features (Week 3-4)
- [ ] Implement delivery address validation
- [ ] Add customer lookup via caller ID
- [ ] Build upselling logic (Rules A, B, C)
- [ ] Integrate payment processing (Stripe/POS native)
- [ ] Add order confirmation read-back
- [ ] Test with complex orders (multiple items, modifications)

### Phase 3: Advanced Features (Week 5-6)
- [ ] Implement human handoff (SIP transfer)
- [ ] Build menu knowledge base (RAG for allergens/nutrition)
- [ ] Add "The Usual" auto-suggestions
- [ ] Create admin dashboard for monitoring
- [ ] Set up call recording and quality review system
- [ ] A/B test upsell scripts

### Phase 4: Production Hardening (Week 7-8)
- [ ] Load testing (simulate 100 concurrent calls)
- [ ] Failover testing (POS outage scenarios)
- [ ] Optimize latency (streaming, caching)
- [ ] Set up monitoring and alerts
- [ ] Train in-store staff on handoff protocol
- [ ] Soft launch with 20% call routing

### Phase 5: Scaling & Optimization (Ongoing)
- [ ] Analyze call recordings for improvement opportunities
- [ ] Fine-tune upselling based on acceptance rates
- [ ] Add seasonal menu item promotions
- [ ] Implement multilingual support
- [ ] Expand to catering and large orders
- [ ] Build loyalty program integration

---

## Appendix A: Sample Conversation Flows

### A.1 Perfect Path (No Issues)

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Delivery please.

🔵 AGENT: Great! What's the delivery address?

🟢 CUSTOMER: 123 Main Street, apartment 4B.

🔵 AGENT: [Calls Tool_Address_Validation]
          Perfect, we deliver there in about 35 minutes. What can I get for you?

🟢 CUSTOMER: I want two large pepperoni pizzas.

🔵 AGENT: [Calls Tool_POS_Check]
          Got it, two large pepperonis at $14.99 each. Anything else?

🟢 CUSTOMER: That's it.

🔵 AGENT: [UPSELL TRIGGER: No side items]
          Perfect! Our wings are super popular with that order.
          Can I add an 8-piece for $9.99?

🟢 CUSTOMER: Sure, why not.

🔵 AGENT: Awesome! And can I grab you a 2-liter Pepsi with that?

🟢 CUSTOMER: No thanks.

🔵 AGENT: [Calls Tool_Calculate_Pricing]
          No problem. Let me confirm your order:
          - Two large pepperoni pizzas: $29.98
          - Eight wings: $9.99

          Your subtotal is $39.97, plus tax and a $4.99 delivery fee
          brings you to $49.16. This will be at your door in about 35 minutes.

          Should I send that to the kitchen?

🟢 CUSTOMER: Yes.

🔵 AGENT: Perfect! What name should I put this under?

🟢 CUSTOMER: John Smith.

🔵 AGENT: Great, John. For delivery, I'll need a credit card or I can
          text you a payment link. Which do you prefer?

🟢 CUSTOMER: Text me the link.

🔵 AGENT: [Sends SMS payment link]
          Done! I just sent that to this number. Once you pay, we'll
          get cooking. Your order number is 42. Thanks for calling Pizza Pizza!

🟢 CUSTOMER: Thanks! [Hangs up]

📊 METRICS:
   - Call Duration: 1:58
   - Upsell Revenue: $9.99
   - Turn Latency: 1.8s average
   - Confidence Score: 0.91 average
```

### A.2 Complex Order with Modifications

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Pickup. I want a large pepperoni with extra cheese,
             a medium veggie with no olives, and a gluten-free crust.

🔵 AGENT: [Calls Tool_POS_Check for all items]
          Got it! One large pepperoni with extra cheese for $17.49,
          and one medium veggie. Just to confirm—did you want the gluten-free
          crust on the veggie pizza?

🟢 CUSTOMER: Yes, gluten-free for the veggie.

🔵 AGENT: [Checks POS for gluten-free availability]
          Perfect. The medium veggie on gluten-free crust, no olives,
          is $15.99. Anything else?

🟢 CUSTOMER: That's it.

🔵 AGENT: [UPSELL TRIGGER: No beverages]
          Great! Can I add a 2-liter Coke or some bottled water?

🟢 CUSTOMER: No thanks, we're good.

🔵 AGENT: No problem. Your total is:
          - Large pepperoni w/ extra cheese: $17.49
          - Medium veggie, gluten-free, no olives: $15.99

          Subtotal: $33.48, plus tax: $38.39.
          This will be ready for pickup in 25 minutes.

          What name for the order?

🟢 CUSTOMER: Sarah.

🔵 AGENT: [Calls Tool_Order_Submit]
          All set, Sarah! Your order number is 87. We'll see you in 25 minutes.
          You can pay when you pick up. Thanks!
```

### A.3 Human Handoff Scenario

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Actually, I ordered last night and the pizza was cold and wrong.

🔵 AGENT: [HANDOFF TRIGGER: Complaint]
          I'm really sorry to hear that. Let me get you to a manager
          who can make this right. Please hold for just a moment.

🟢 CUSTOMER: Okay.

🔵 AGENT: [Calls Tool_Human_Handoff]
          [Performs SIP transfer to store]

🟠 MANAGER: [Picks up] Hi, this is Mike the manager. I see there was an
            issue with your order last night. Let me pull that up and
            we'll get you taken care of...
```

---

## Appendix B: Technical Configuration Examples

### B.1 Vapi Configuration

```json
{
  "assistant": {
    "name": "Pizza Pizza Order Assistant",
    "model": {
      "provider": "openai",
      "model": "gpt-4-turbo",
      "temperature": 0.7,
      "max_tokens": 500
    },
    "voice": {
      "provider": "11labs",
      "voice_id": "21m00Tcm4TlvDq8ikWAM",  // Rachel - friendly, professional
      "stability": 0.8,
      "similarity_boost": 0.75,
      "speed": 1.0
    },
    "transcriber": {
      "provider": "deepgram",
      "model": "nova-2",
      "language": "en-US",
      "smart_format": true,
      "profanity_filter": false,
      "redact": ["ssn", "credit_card"]
    },
    "first_message": "Thanks for calling Pizza Pizza, this is Emma. Are we starting a new order for pickup or delivery today?",
    "end_call_phrases": [
      "thanks bye",
      "goodbye",
      "that's all"
    ],
    "background_sound": "office_ambient",  // Subtle background to sound human
    "interruptions_enabled": true,
    "max_duration_seconds": 600  // 10-minute max call
  }
}
```

### B.2 Antigravity Tool Schema

```python
# antigravity_config.yaml

tools:
  - name: Tool_POS_Check
    type: http_request
    config:
      base_url: https://api.toastpos.com/v2
      auth:
        type: bearer
        token_env: TOAST_API_KEY
      endpoints:
        validate_items:
          method: POST
          path: /inventory/validate
          timeout: 2000
          retry:
            max_attempts: 2
            backoff: exponential

  - name: Tool_Customer_Lookup
    type: http_request
    config:
      base_url: https://api.yourcrm.com/v1
      auth:
        type: api_key
        header: X-API-Key
        token_env: CRM_API_KEY
      endpoints:
        lookup_by_phone:
          method: GET
          path: /customers/search?phone={phone}
          cache_ttl: 300  # 5-minute cache

  - name: Tool_Menu_Knowledge_Base
    type: vector_search
    config:
      provider: pinecone
      index: pizza_menu_knowledge
      embedding_model: text-embedding-3-small
      top_k: 3
      min_score: 0.7
```

---

## Appendix C: Success Metrics & KPIs

### C.1 Operational Metrics

| Metric | Target | Calculation |
|--------|--------|-------------|
| **Answer Rate** | >95% | Calls answered / Total inbound calls |
| **Average Handle Time** | <3 minutes | Total call duration / Calls completed |
| **Order Accuracy** | >95% | Correct orders / Total orders |
| **Upsell Attachment Rate** | 40-60% | Orders with upsell / Total orders |
| **Human Handoff Rate** | <5% | Calls transferred / Total calls |
| **First Call Resolution** | >90% | Orders completed without callback |

### C.2 Financial Metrics

| Metric | Benchmark | Impact |
|--------|-----------|--------|
| **Revenue Per Call** | $35-50 | (Total order value / Calls) |
| **Incremental Upsell Revenue** | $8-12/call | Revenue from accepted upsells |
| **Cost Per Call** | <$0.50 | (AI platform costs + telephony) |
| **ROI vs. Human Staff** | 300-500% | (Revenue increase - Costs) / Costs |

**Sample ROI Calculation:**
```
Restaurant with 100 calls/day:

BEFORE (Human Staff):
- 100 calls x 70% answer rate = 70 orders
- Average order: $32
- Daily revenue: $2,240
- Upsell rate: 15%
- Upsell revenue: $336
- Total: $2,576/day

AFTER (AI Agent):
- 100 calls x 98% answer rate = 98 orders
- Average order: $32
- Daily revenue: $3,136
- Upsell rate: 50%
- Upsell revenue: $1,568
- Total: $4,704/day

INCREMENTAL REVENUE: $2,128/day = $64,000/month
AI COST: ~$500/month (platform + telephony)
NET GAIN: $63,500/month
```

### C.3 Quality Metrics

- **Customer Satisfaction (CSAT):** Target >4.5/5
  - Post-call SMS survey: "How was your ordering experience? Reply 1-5"

- **Net Promoter Score (NPS):** Target >50
  - "How likely are you to recommend ordering by phone? 0-10"

- **Error Rate:** <2%
  - Wrong items, incorrect pricing, failed orders

---

## Appendix D: Compliance & Legal Considerations

### D.1 Call Recording Disclosure

**Required in Two-Party Consent States:**
```
"This call may be recorded for quality and training purposes.
By continuing, you consent to recording."
```

**States Requiring Disclosure:**
- California, Florida, Maryland, Massachusetts, Montana,
  New Hampshire, Pennsylvania, Washington

### D.2 PCI Compliance for Payment

**NEVER** have the AI agent or voice platform process raw credit card data.

**Compliant Methods:**
1. **PCI-Certified IVR:**
   - Transfer to secure DTMF-based system for card entry

2. **Payment Links:**
   - Send SMS with Stripe Checkout URL

3. **Card on File:**
   - Use tokenized cards from customer profile

4. **Pay on Pickup/Delivery:**
   - Accept cash or card at fulfillment

### D.3 Accessibility (ADA Compliance)

- Provide option to press 0 for human assistance
- Support TTY/TDD devices for hearing-impaired
- Ensure voice is clear and not too fast (1.0x speed)

### D.4 Data Retention

- **Call Recordings:** Retain for 90 days (quality review)
- **Transcripts:** Retain for 1 year (analytics)
- **Customer PII:** Follow GDPR/CCPA guidelines
  - Allow deletion requests
  - Encrypt at rest and in transit

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | AI Systems Architect | Initial workflow plan created |

---

## Contact & Support

**For Implementation Questions:**
- Antigravity AI Support: support@antigravity.ai
- Vapi Documentation: https://docs.vapi.ai
- POS Integration Help: integrations@yourcompany.com

**Document Maintainer:**
- Role: QSR Systems Architect
- Email: architect@grubgenius.com

---

**END OF WORKFLOW PLAN**

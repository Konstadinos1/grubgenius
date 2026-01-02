# Sample Conversation Flows

This document contains realistic conversation examples demonstrating various scenarios the AI Phone Agent should handle.

## Table of Contents
1. [Perfect Order Flow](#1-perfect-order-flow)
2. [Returning Customer with "The Usual"](#2-returning-customer-with-the-usual)
3. [Out of Stock Item Handling](#3-out-of-stock-item-handling)
4. [Complex Order with Modifications](#4-complex-order-with-modifications)
5. [Delivery Threshold Upsell](#5-delivery-threshold-upsell)
6. [Customer Complaint - Human Handoff](#6-customer-complaint---human-handoff)
7. [Low Confidence Recovery](#7-low-confidence-recovery)
8. [Multiple Speakers on Call](#8-multiple-speakers-on-call)

---

## 1. Perfect Order Flow

**Scenario:** New customer, simple order, accepts upsell

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Pickup.

🔵 AGENT: Perfect! What can I get for you?

🟢 CUSTOMER: I'll take a large pepperoni pizza.

🔵 AGENT: [Calls Tool_POS_Check]
          Great! One large pepperoni is $14.99. Anything else?

🟢 CUSTOMER: That's all.

🔵 AGENT: [UPSELL TRIGGER: No side items]
          Awesome! Our wings are really popular with that order.
          Can I add an 8-piece for $9.99?

🟢 CUSTOMER: Yeah, sure.

🔵 AGENT: Perfect! And can I grab you a 2-liter Pepsi or some
          bottled water with that?

🟢 CUSTOMER: I'll take a Pepsi.

🔵 AGENT: [Calls Tool_Calculate_Pricing]
          Great! Let me confirm:
          - Large pepperoni: $14.99
          - 8-piece wings: $9.99
          - 2-liter Pepsi: $3.99

          Your total is $32.66 with tax. This will be ready for
          pickup in 25 minutes. What name for the order?

🟢 CUSTOMER: Mike.

🔵 AGENT: [Calls Tool_Order_Submit]
          All set, Mike! Your order number is 23, and we'll have
          it ready by 6:25. You can pay when you pick up.
          Thanks for calling!

🟢 CUSTOMER: Thanks!

📊 CALL METRICS:
   Duration: 1:42
   Items Ordered: 3
   Base Order: $14.99
   Upsell Revenue: $13.98 (+93%)
   Upsell Acceptance: 2/2 (100%)
   Confidence Avg: 0.93
```

---

## 2. Returning Customer with "The Usual"

**Scenario:** Caller ID matches existing customer, offer previous order

```
🔵 AGENT: [Detects caller ID, calls Tool_Customer_Lookup]
          Thanks for calling Pizza Pizza, this is Emma.
          Welcome back, Sarah! Would you like your usual—
          two large pepperonis and garlic bites?

🟢 CUSTOMER: Yes please! But make it delivery this time.

🔵 AGENT: Perfect! I have your address as 456 Oak Street.
          Is that still good?

🟢 CUSTOMER: Yep, that's right.

🔵 AGENT: [Calls Tool_Address_Validation]
          Great! We'll have that delivered in about 35 minutes.
          Your usual order is $32.97 plus a $4.99 delivery fee.

          Can I add a 2-liter drink today?

🟢 CUSTOMER: No thanks.

🔵 AGENT: No problem! Your total is $42.76 including tax and delivery.
          Should I charge your Visa ending in 4242 that we have on file?

🟢 CUSTOMER: Yes.

🔵 AGENT: [Calls Tool_Order_Submit with card_on_file]
          Perfect! Order 45 is on the way. You should get a text
          when the driver is close. Thanks, Sarah!

📊 CALL METRICS:
   Duration: 1:18
   Returning Customer: Yes
   Used "The Usual": Yes
   Upsell Attempted: 1
   Upsell Accepted: 0
   Saved Time: 40% vs new customer
```

---

## 3. Out of Stock Item Handling

**Scenario:** Customer orders an 86'd item, agent suggests substitute

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Delivery. I want a large Hawaiian pizza and a Diet Coke.

🔵 AGENT: [Calls Tool_POS_Check - detects Diet Coke is 86'd]
          Great! One large Hawaiian is $15.99. Just a heads up—
          we're actually out of Diet Coke right now, but I can do
          regular Coke, Coke Zero, or Sprite. Which works for you?

🟢 CUSTOMER: Coke Zero is fine.

🔵 AGENT: Perfect! What's the delivery address?

🟢 CUSTOMER: 789 Maple Avenue.

🔵 AGENT: [Calls Tool_Address_Validation]
          Got it! We deliver there in about 40 minutes. Your total is:
          - Large Hawaiian: $15.99
          - Coke Zero: $3.99
          - Delivery fee: $4.99

          That's $28.17 with tax. Want to add anything else?

🟢 CUSTOMER: No, that's good.

🔵 AGENT: [Skips upsell since total is close to threshold]
          Sounds good! What name for the order?

🟢 CUSTOMER: Jessica.

🔵 AGENT: Perfect, Jessica. For delivery I'll need a credit card
          or I can text you a payment link. Which do you prefer?

🟢 CUSTOMER: Text the link.

🔵 AGENT: [Sends SMS payment link]
          Done! Just sent that to your phone. Once you pay, we'll
          start making your order. Order number 56. Thanks!

📊 CALL METRICS:
   Duration: 2:05
   Out of Stock Handled: 1
   Substitute Accepted: Yes
   Customer Friction: Low
   Confidence: 0.88
```

---

## 4. Complex Order with Modifications

**Scenario:** Multiple items with custom modifications

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Pickup. I need a large pepperoni with extra cheese,
             a medium veggie with no mushrooms and light sauce,
             and 12 wings with honey garlic.

🔵 AGENT: Got it! Let me confirm that:
          - Large pepperoni with extra cheese: $17.49
          - Medium veggie, no mushrooms, light sauce: $13.99
          - 12 wings with honey garlic sauce: $14.99

          Is that right?

🟢 CUSTOMER: Yes.

🔵 AGENT: [Calls Tool_POS_Check to validate all items]
          Perfect! Your subtotal is $46.47. Anything else?

🟢 CUSTOMER: That's it.

🔵 AGENT: [UPSELL TRIGGER: No beverages on large order]
          Great order! Can I add a 2-liter Pepsi or some bottled
          drinks for $3.99?

🟢 CUSTOMER: No thanks.

🔵 AGENT: No problem! Your total is $52.52 with tax. This will be
          ready in about 30 minutes. What name?

🟢 CUSTOMER: Tom.

🔵 AGENT: [Calls Tool_Order_Submit with all modifications]
          All set, Tom! Order 78 will be ready by 7:30.
          You can pay when you pick up. Thanks!

📊 CALL METRICS:
   Duration: 2:28
   Items with Mods: 2
   Total Modifications: 4
   Order Accuracy: 100%
   Confirmation Used: Yes
```

---

## 5. Delivery Threshold Upsell

**Scenario:** Order is $5 below free delivery, agent suggests strategic upsell

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Delivery. Large cheese pizza please.

🔵 AGENT: Great! What's the delivery address?

🟢 CUSTOMER: 321 Pine Street.

🔵 AGENT: [Calls Tool_Address_Validation]
          Perfect, we deliver there. One large cheese is $12.99.
          Anything else?

🟢 CUSTOMER: That's all.

🔵 AGENT: [UPSELL TRIGGER: $12.99 subtotal, free delivery at $30]
          Sounds good! Just a heads up—you're only $5 away from
          free delivery. I could add garlic bites for $5.99 and
          save you the $4.99 delivery fee. That's basically free
          garlic bites! Want to do that?

🟢 CUSTOMER: Oh! Yeah, that makes sense. Add the garlic bites.

🔵 AGENT: [Calls Tool_Calculate_Pricing]
          Smart choice! Your new total is:
          - Large cheese: $12.99
          - Garlic bites: $5.99
          - Delivery: FREE! (saved $4.99)

          Total: $21.88 with tax. What name for the order?

🟢 CUSTOMER: Rachel.

🔵 AGENT: Perfect, Rachel! For delivery I'll need a card or I can
          text a payment link. Which works?

🟢 CUSTOMER: Text me.

🔵 AGENT: [Sends SMS link]
          Done! Link sent. Order 92 will be there in 35 minutes. Thanks!

📊 CALL METRICS:
   Duration: 2:15
   Threshold Upsell: Yes
   Customer Saved: $4.99 (perceived)
   Incremental Revenue: $5.99
   Upsell ROI: Excellent
```

---

## 6. Customer Complaint - Human Handoff

**Scenario:** Customer has issue with previous order, needs manager

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: Actually, I ordered last night and the pizza was cold
             and half the toppings were missing.

🔵 AGENT: [HANDOFF TRIGGER: Complaint detected]
          I'm really sorry to hear that happened. Let me get you
          to a manager who can make this right. Can you hold for
          just a moment?

🟢 CUSTOMER: Sure.

🔵 AGENT: [Calls Tool_Human_Handoff with context]
          [Initiates SIP transfer to store manager]

🟠 MANAGER: Hi there! This is David, the manager. I see there was
            an issue with your order last night. I'm pulling it
            up now. Can I get your name and phone number?

🟢 CUSTOMER: It's Mark, 555-8765.

🟠 MANAGER: Thanks Mark. I see your order here. I'm so sorry about that.
            Let me send you a full refund right now and I'll add
            a credit for a free large pizza on your next order...

📊 CALL METRICS:
   Duration: 0:47 (before handoff)
   Handoff Reason: Complaint
   Handoff Time: 12 seconds
   Manager Context Provided: Yes
   Appropriate Handoff: Yes
```

---

## 7. Low Confidence Recovery

**Scenario:** Background noise causes low STT confidence, agent recovers

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 CUSTOMER: [Background noise: traffic, wind]
             I want a... [garbled] ...roni and... [unclear]

🔵 AGENT: [Confidence score: 0.42 - TRIGGER: Ask to repeat]
          Sorry, it's a bit noisy! Could you repeat that for me?

🟢 CUSTOMER: [Clearer] I want a large pepperoni and some wings.

🔵 AGENT: [Confidence: 0.78 - TRIGGER: Confirm interpretation]
          Got it! Did you say a large pepperoni and wings?

🟢 CUSTOMER: Yes.

🔵 AGENT: Perfect! Did you want 8-piece or 12-piece wings?

🟢 CUSTOMER: Eight.

🔵 AGENT: [Calls Tool_POS_Check - confidence restored]
          Great! One large pepperoni at $14.99 and 8-piece wings
          at $9.99. Is this for pickup or delivery?

🟢 CUSTOMER: Pickup.

🔵 AGENT: [Continues normal flow...]

📊 CALL METRICS:
   Duration: 2:35
   Low Confidence Events: 2
   Recovery Successful: Yes
   Customer Frustration: Low
   Final Order Accuracy: 100%
```

---

## 8. Multiple Speakers on Call

**Scenario:** Family ordering together, multiple voices detected

```
🔵 AGENT: Thanks for calling Pizza Pizza, this is Emma. Are we starting
          a new order for pickup or delivery today?

🟢 SPEAKER 1: Delivery.

🟢 SPEAKER 2: Wait, no—pickup!

🟢 SPEAKER 1: Oh yeah, pickup.

🔵 AGENT: [Detects multiple speakers]
          No problem! I hear a few people there. Just to make sure
          I get everything right, can one person give me the full order?

🟢 SPEAKER 1: Sure. We want two large pizzas—one pepperoni and one veggie.

🟢 SPEAKER 2: And I want wings!

🟢 SPEAKER 1: Right, and 12 wings.

🔵 AGENT: Perfect! So that's:
          - One large pepperoni
          - One large veggie
          - 12-piece wings

          Is that everything?

🟢 SPEAKER 1: Yes.

🔵 AGENT: [Calls Tool_POS_Check]
          Great! Your total is:
          - Large pepperoni: $14.99
          - Large veggie: $14.99
          - 12 wings: $14.99

          Subtotal $44.97, plus tax: $50.76. Ready in 30 minutes.
          What name for the order?

🟢 SPEAKER 1: Johnson family.

🔵 AGENT: Perfect! Order 34 will be ready for the Johnson family
          at 7:00. Thanks!

📊 CALL METRICS:
   Duration: 2:18
   Speakers Detected: 2
   Confusion Events: 1 (pickup/delivery)
   Resolution: Confirmation question
   Order Accuracy: 100%
```

---

## Key Patterns Demonstrated

### Successful Recovery Strategies
1. **Low Confidence:** Ask to repeat or confirm interpretation
2. **Out of Stock:** Immediately suggest substitute
3. **Multiple Speakers:** Politely request single order-giver
4. **Ambiguity:** Use confirmation questions
5. **Complaints:** Quick handoff with context

### Upsell Best Practices
1. **Timing:** After primary order confirmed
2. **Relevance:** Match upsell to order type
3. **Value Framing:** "Save $X" or "Only $X more"
4. **Easy Decline:** Don't pressure
5. **Strategic:** Threshold upsells for delivery

### Conversation Management
1. **Confirmations:** Always read back complex orders
2. **Brevity:** Keep responses concise
3. **Natural Flow:** Sound human, not robotic
4. **Empathy:** Acknowledge issues genuinely
5. **Efficiency:** Average call under 2:30

---

**Document Version:** 1.0
**Last Updated:** 2026-01-02

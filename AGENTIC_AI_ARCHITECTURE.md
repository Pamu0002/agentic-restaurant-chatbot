# 🤖 AGENTIC AI ARCHITECTURE
## Agentic Restaurant Chatbot - Multi-Agent Orchestration System

**Project:** AgentDine (Agentic Restaurant Chatbot)  
**Architecture:** Multi-Agent System with Orchestration  
**Framework:** LangChain + Google Vertex AI Gemini  
**Status:** Foundation built, agents in development

---

## 🎯 CORE CONCEPT

Your project uses **4 Specialized Agents** orchestrated by a **Master Orchestrator**, all powered by Gemini AI for natural language understanding and tool calling.

```
User Message (Chat)
        ↓
   Orchestrator Agent
   (Intent Detection)
        ↓
   ┌───┴────┬────────────────┐
   ↓        ↓                 ↓
Discovery  Recommendation  Reservation  Payment
Agent      Agent          Agent        Agent
   ↓        ↓                 ↓         ↓
Firestore / APIs / Services / Payment Gateways
```

---

## 🤖 THE 4 AGENTS

### **AGENT 1: DISCOVERY AGENT** 🔍
**Purpose:** Search and filter restaurants based on user queries

**Capabilities:**
- Understand user search intent ("Find Italian restaurants near me")
- Extract entities: cuisine, location, price range, party size, date/time
- Query Firestore restaurant database
- Return filtered results ranked by relevance

**Tools/Actions:**
```
Input: "Find Italian restaurants in Colombo for 4 people"
  ↓
Query Firestore: db.collection('restaurants')
  .where('cuisines', 'array-contains', 'Italian')
  .where('location', '==', 'Colombo')
  .where('capacity', '>=', 4)
  ↓
Output: { restaurants: [...], reasoning: "Found 5 Italian restaurants that match your criteria" }
```

**Current Status:** ⏳ 40% - Basic search implemented, filtering in progress

---

### **AGENT 2: RECOMMENDATION AGENT** 💡
**Purpose:** Provide personalized restaurant suggestions

**Capabilities:**
- Analyze user history (past bookings, searches)
- Query Neo4j knowledge graph for user-cuisine-restaurant relationships
- Consider user preferences and dietary restrictions
- Suggest "hidden gems" and trending restaurants
- Explain recommendations in natural language

**Tools/Actions:**
```
Input: User history + current context
  ↓
Query Neo4j: MATCH (u:User)-[:PREFERS]->(c:Cuisine)<-[:SERVES]-(r:Restaurant)
WHERE u.id = $userId AND r.rating > 4.0
RETURN r ORDER BY r.recommendation_score DESC LIMIT 5
  ↓
Output: { recommendations: [...], reasoning: "You enjoyed Italian last month, so we suggest..." }
```

**Current Status:** ❌ 0% - Deferred to Phase 2 (requires ML component)

---

### **AGENT 3: RESERVATION AGENT** 📅
**Purpose:** Handle table booking and availability management

**Capabilities:**
- Check real-time table availability
- Create reservation records
- Handle modification/cancellation requests
- Generate confirmation codes
- Track reservation status

**Tools/Actions:**
```
Input: "Book a table for 4 at 7 PM tomorrow"
  ↓
Step 1: Check availability
  Query Firestore: db.collection('availability')
    .where('restaurantId', '==', restaurantId)
    .where('date', '==', tomorrow)
    .where('availableSlots', '>=', 4)
  ↓
Step 2: Create reservation
  db.collection('reservations').add({
    restaurantId, userId, date, time, partySize,
    confirmationCode, status: 'confirmed'
  })
  ↓
Step 3: Trigger notifications
  sendEmail(confirmationEmail)
  ↓
Output: { confirmationCode: "ABC123", reservationDetails: {...} }
```

**Current Status:** ❌ 0% - Deferred to Phase 2

---

### **AGENT 4: PAYMENT AGENT** 💳
**Purpose:** Secure payment processing for deposits/prepayments

**Capabilities:**
- Validate payment information
- Process credit/debit cards via Stripe
- Support local payment methods (PayHere)
- Generate receipts and transaction records
- Handle refunds and chargebacks

**Tools/Actions:**
```
Input: { amount, cardDetails, restaurantId }
  ↓
Step 1: Tokenize (PCI compliance)
  stripe.createPaymentMethod({ cardDetails })
  ↓
Step 2: Process payment
  stripe.paymentIntents.create({
    amount, currency, metadata: { reservationId }
  })
  ↓
Step 3: Store transaction
  db.collection('transactions').add({
    transactionId, amount, status, timestamp
  })
  ↓
Step 4: Send receipt
  sendEmail(paymentReceipt)
  ↓
Output: { transactionId, status: 'completed', receipt }
```

**Current Status:** ❌ 0% - Deferred to Phase 3

---

## 🎼 THE ORCHESTRATOR AGENT (Master Controller)

**Purpose:** Route user intents to appropriate specialized agents

### **How It Works:**

```javascript
User Message:
"I want to cancel my reservation tomorrow at Nuwara Eliya Restaurant"

↓

Orchestrator receives message:
• Sends to Gemini for intent understanding
• Extracts intent: CANCELLATION
• Identifies agent: ReservationAgent
• Extracts context: { restaurantName, date: tomorrow }

↓

Routes to ReservationAgent:
• Find reservation matching criteria
• Mark as CANCELLED
• Trigger refund if applicable
• Send cancellation confirmation

↓

Returns to chat:
"Your reservation at Nuwara Eliya Restaurant for tomorrow 
has been cancelled. A refund of $45 will be processed within 24 hours."
```

### **Intent Mapping:**

```
Intent          → Agent             Example User Input
────────────────────────────────────────────────────────
DISCOVERY       → DiscoveryAgent    "Find Italian restaurants"
RECOMMENDATION  → RecommendAgent    "What do you recommend?"
RESERVATION     → ReservationAgent  "Book a table for 4"
CANCELLATION    → ReservationAgent  "Cancel my booking"
MODIFICATION    → ReservationAgent  "Change time to 8 PM"
PAYMENT         → PaymentAgent      "Process my payment"
DINING_INFO     → DiscoveryAgent    "Show me the menu"
LOOKUP          → DiscoveryAgent    "What's their phone number?"
```

---

## 🔄 CONVERSATION FLOW WITH AGENTS

### **Example: Natural Multi-Turn Conversation**

```
User: "I'm hungry, find me a good Indian restaurant"
  ↓
Orchestrator: DISCOVERY intent detected
  ↓
DiscoveryAgent: Queries Firestore for Indian restaurants
  ↓
System: Shows 5 results with ratings and availability
  
User: "Tell me about the top-rated one"
  ↓
Orchestrator: LOOKUP intent, context from previous discovery
  ↓
DiscoveryAgent: Returns details (menu, hours, reviews)
  
User: "Book a table for 3 at 7 PM tomorrow"
  ↓
Orchestrator: RESERVATION intent detected with extracted context
  ↓
ReservationAgent: Checks availability, creates reservation
  ↓
System: Confirms booking with code ABC123

User: "How much do I owe for the deposit?"
  ↓
Orchestrator: PAYMENT inquiry
  ↓
PaymentAgent: Calculates charges, shows payment options
  
User: "Process my payment with card XYZ"
  ↓
Orchestrator: PAYMENT intent
  ↓
PaymentAgent: Tokenizes and processes payment securely
  ↓
System: Sends confirmation and receipt
```

**Key:** Context maintained across all turns, agents collaborate seamlessly

---

## 🛠️ TECHNICAL ARCHITECTURE

### **Backend Stack:**

```
Frontend (React)
    ↓
Node.js Express API
(localhost:5000)
    ├─ Chat routes
    ├─ Auth routes
    └─ Proxy to AI service
         ↓
Python FastAPI
(localhost:8000)
    ├─ Orchestrator
    ├─ Agent 1: DiscoveryAgent
    ├─ Agent 2: RecommendationAgent  (Phase 2)
    ├─ Agent 3: ReservationAgent    (Phase 2)
    └─ Agent 4: PaymentAgent        (Phase 3)
         ↓
External APIs:
├─ Google Vertex AI Gemini (LLM)
├─ Firebase Firestore (Data)
├─ Neo4j (Knowledge graph for Phase 2)
├─ Stripe (Payments for Phase 3)
└─ Twilio/SendGrid (Notifications Phase 2)
```

### **Agent Communication Pattern:**

```
Message Flow:
User Input
  ↓
Express API (/api/chat/message)
  ↓
FastAPI Orchestrator (/agents/orchestrate)
  ↓
Gemini LLM (Intent + Entity Extraction)
  ↓
Agent Selection + Tool Calling
  ↓
Firestore / External APIs
  ↓
Response Generation
  ↓
Express API returns to React
  ↓
Display to User
```

---

## 📊 AGENT STATUS FOR 25% COMPLETION

| Agent | Epic | Ph 1 | Ph 2 | Ph 3 | Viva |
|-------|------|------|------|------|------|
| **DiscoveryAgent** | 4 | ✅ 50% | ⬜ | - | ✅ SHOW |
| **RecommendationAgent** | 5 | ❌ 0% | ⬜ | - | ⏸️ DEFER |
| **ReservationAgent** | 6 | ❌ 0% | ⬜ | - | ⏸️ DEFER |
| **PaymentAgent** | 7 | ❌ 0% | ⬜ | ⬜ | ⏸️ DEFER |
| **Orchestrator** | 3 | ⚠️ 20% | - | - | ✅ FOUNDATION |

---

## 🚀 AGENT IMPLEMENTATION FOR YOUR 25% VIVA

### **What to Focus On:**

**FOR VIVA (Restaurant Discovery Flow):**
```
1. DiscoveryAgent completes 50% → 100%
   - Multi-criteria search (name, cuisine, price, location)
   - Results ranking and filtering
   - Integration with Firestore

2. Orchestrator basic routing
   - Intent detection for DISCOVERY
   - Context passing to DiscoveryAgent
   - Response formatting for chat

3. Demo flow:
   User: "Find Italian restaurants in Colombo"
     ↓
   Orchestrator: Detect DISCOVERY
     ↓
   DiscoveryAgent: Query Firestore
     ↓
   System shows: 5 Italian restaurants with details
```

---

## 📝 API ENDPOINTS FOR AGENTS

### **Node.js Express API (localhost:5000):**
```
POST /api/chat/message
  Body: { message, conversationId, userId }
  Response: { botResponse, insights }

POST /api/chat/agent-call
  Body: { agentType, context }
  Response: { agentResult }
```

### **Python FastAPI Agents (localhost:8000):**
```
POST /api/v1/agents/orchestrate
  Body: { userMessage, context, userId }
  Response: { intent, agentType, result }

POST /api/v1/agents/discover
  Body: { query, location, cuisine, priceRange }
  Response: { restaurants: [], reasoning }

POST /api/v1/agents/recommend
  Body: { userId, context }
  Response: { recommendations: [], reasoning }

POST /api/v1/agents/reserve
  Body: { restaurantId, date, time, partySize }
  Response: { confirmationCode, reservation }

POST /api/v1/agents/payment
  Body: { amount, paymentMethod, reservationId }
  Response: { transactionId, status, receipt }
```

---

## 🎯 YOUR ACTION ITEMS FOR 25%

### **Phase 1 (Day 1): Foundation**
```
✅ Understand agent architecture (reading this doc)
✅ Complete authentication (already 85% done)
✅ Seed Firestore with restaurant data
```

### **Phase 2 (Day 2): Discovery Agent MVP**
```
🆕 Implement basic DiscoveryAgent
🆕 Basic intent detection (DISCOVERY)
🆕 Restaurant search from Firestore
🆕 Return results to chat
```

### **Phase 3 (Day 3): Polish**
```
✨ Test agent-to-chat flow
✨ Refine search filtering
✨ Polish UI and responses
✨ Demo ready!
```

---

## 💡 FUTURE PHASES

**Phase 2 (Recommendations + Reservations):**
- Implement RecommendationAgent with Neo4j
- Implement ReservationAgent for bookings
- Add notification system

**Phase 3 (Payments + Analytics):**
- Implement PaymentAgent with Stripe
- Add advanced Orchestrator with state management
- Analytics and trending restaurants

---

## ✅ SUMMARY

**Your agentic system is designed as:**
1. **DiscoveryAgent** - Search restaurants (For 25%)
2. **RecommendationAgent** - Suggest restaurants (Phase 2)
3. **ReservationAgent** - Handle bookings (Phase 2)
4. **PaymentAgent** - Process payments (Phase 3)
5. **Orchestrator** - Routes between agents

**For your viva, focus on #1 + Orchestrator foundation = Impressive AI demo! 🎯**

---

Ready to implement? Let me know! 🚀

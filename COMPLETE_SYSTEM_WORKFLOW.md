# 🎯 COMPLETE SYSTEM WORKFLOW GUIDE
**Agentic Restaurant Chatbot Platform**

---

## 📋 TABLE OF CONTENTS
1. [System Users & Personas](#system-users--personas)
2. [System Architecture Layers](#system-architecture-layers)
3. [Complete User Workflows](#complete-user-workflows)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Multi-Portal Architecture](#multi-portal-architecture)
6. [AI Agent Ecosystem](#ai-agent-ecosystem)
7. [Technology Stack Integration](#technology-stack-integration)
8. [Communication Patterns](#communication-patterns)

---

## 🧑‍💼 SYSTEM USERS & PERSONAS

### **1. CUSTOMER / DINER** (Any Authenticated User)
**Primary Platform**: Customer Portal (Port 5173)  
**Theme**: Red (#ff6b6b)  
**Device**: Mobile-first, responsive web

#### Customer Journey:
```
┌─ Discover Restaurants ─────────────────┐
│ • Search by cuisine, location, price   │
│ • Filter by dietary restrictions       │
│ • View restaurant details & reviews    │
└─────────────────────────────────────────┘
           ↓
┌─ Get AI Recommendations ───────────────┐
│ • Chat with Chef Assistant             │
│ • Personalized suggestions             │
│ • Based on history & preferences       │
└─────────────────────────────────────────┘
           ↓
┌─ Make Reservation ─────────────────────┐
│ • Select date, time, party size        │
│ • Receive confirmation code            │
│ • Modify or cancel booking             │
└─────────────────────────────────────────┘
           ↓
┌─ Process Payment ──────────────────────┐
│ • Secure payment (optional deposit)    │
│ • Payment confirmation & receipt       │
│ • Refund policy info                   │
└─────────────────────────────────────────┘
           ↓
┌─ Manage Reservations ──────────────────┐
│ • View upcoming bookings               │
│ • Modify reservation details           │
│ • Cancel with refund tracking          │
│ • View booking history                 │
└─────────────────────────────────────────┘
```

#### Customer Actions:
- ✅ Sign up / Sign in (OAuth 2.0 Google or email)
- ✅ Search restaurants (location, cuisine, availabilty)
- ✅ Chat with AI chatbot (Intent: SEARCH, RECOMMEND, RESERVE, CANCEL)
- ✅ Book reservations (Check availability → Book → Pay)
- ✅ Manage profile (Dietary restrictions, preferences, saved restaurants)
- ✅ View order status (Real-time tracking)
- ✅ Leave reviews (Post-visit feedback)

---

### **2. RESTAURANT OWNER / PROVIDER** (Role: `owner`)
**Primary Platforms**: 
- Provider Portal (Port 5174) - Operations
- Provider Analytics (Port 5175) - Business Intelligence

**Theme**: Teal (#4ecdc4) | Purple (#9b59b6)  
**Device**: Desktop & tablet

#### Provider Portal (Operations) Features:
```
┌─ Reservation Management ───────────────┐
│ • View incoming reservations           │
│ • Accept/Reject bookings               │
│ • Modify reservation (date/time/party) │
│ • Send customer notifications          │
│ • Manage table assignments             │
└─────────────────────────────────────────┘
           ↓
┌─ Menu Management ──────────────────────┐
│ • Create/Edit/Delete menu items        │
│ • Upload dish images                   │
│ • Set pricing & availability           │
│ • Manage dietary tags (vegetarian...)  │
│ • Update availability times            │
└─────────────────────────────────────────┘
           ↓
┌─ Restaurant Settings ──────────────────┐
│ • Basic info (name, address, cuisine)  │
│ • Table configuration                  │
│ • Opening hours                        │
│ • Special policies & descriptions      │
│ • Payment settings                     │
└─────────────────────────────────────────┘
           ↓
┌─ Staff Management ─────────────────────┐
│ • Add/Remove staff members             │
│ • Assign roles & permissions           │
│ • View staff activity logs             │
└─────────────────────────────────────────┘
```

#### Provider Analytics Dashboard Features:
```
┌─ Revenue Insights ─────────────────────┐
│ • Daily/Weekly/Monthly revenue         │
│ • Revenue by cuisine type              │
│ • Average booking value                │
│ • Payment method breakdowns            │
│ • Trend analysis & forecasting         │
└─────────────────────────────────────────┘
           ↓
┌─ Customer Insights ────────────────────┐
│ • Repeat customer analysis             │
│ • Customer lifetime value              │
│ • Dietary preference trends            │
│ • Peak visit times & seasons           │
│ • Customer demographics                │
└─────────────────────────────────────────┘
           ↓
┌─ Performance Metrics ──────────────────┐
│ • Reservation conversion rates         │
│ • Cancellation trends                  │
│ • Table turnover rates                 │
│ • Customer satisfaction (ratings)      │
│ • Staff performance                    │
└─────────────────────────────────────────┘
           ↓
┌─ Reports & Export ─────────────────────┐
│ • Custom date range reports            │
│ • CSV/PDF export                       │
│ • Tax reporting (ready for accounting) │
│ • Email scheduled reports              │
└─────────────────────────────────────────┘
```

#### Provider Actions:
- ✅ Sign up as owner (Email verification)
- ✅ Submit restaurant application
- ✅ Manage restaurant profile
- ✅ CRUD menu items
- ✅ Accept/reject reservations
- ✅ Configure table availability
- ✅ View analytics dashboards
- ✅ Export reports
- ✅ Manage staff accounts

---

### **3. ADMIN / PLATFORM MANAGER** (Role: `admin`)
**Primary Platform**: Admin Portal (Port 5176)  
**Theme**: Red (#e74c3c)  
**Device**: Desktop

#### Admin Dashboard Features:
```
┌─ User Management ──────────────────────┐
│ • View all users (customers, owners)   │
│ • Deactivate/suspend accounts          │
│ • Assign/revoke roles                  │
│ • Monitor user activity                │
│ • Reset passwords (support)            │
└─────────────────────────────────────────┘
           ↓
┌─ Restaurant Management ────────────────┐
│ • Review restaurant applications       │
│ • Approve/Reject new restaurants       │
│ • View active restaurants              │
│ • Delete/restrict restaurants          │
│ • Compliance verification              │
└─────────────────────────────────────────┘
           ↓
┌─ Approval Workflow ────────────────────┐
│ • Queue of pending applications        │
│ • Document verification                │
│ • Contact restaurant owners            │
│ • Set conditions/restrictions          │
│ • Notify of approval/rejection         │
└─────────────────────────────────────────┘
           ↓
┌─ System Configuration ─────────────────┐
│ • Feature flags (enable/disable)       │
│ • System settings & parameters         │
│ • Commission rates                     │
│ • Payment gateway configs              │
│ • Email templates                      │
└─────────────────────────────────────────┘
           ↓
┌─ Audit & Security ─────────────────────┐
│ • View all transaction logs            │
│ • Monitor suspicious activity          │
│ • Compliance reports                   │
│ • Security incident tracking           │
│ • Data export for compliance           │
└─────────────────────────────────────────┘
```

#### Admin Actions:
- ✅ Sign in (admin credentials)
- ✅ Review user/restaurant applications
- ✅ Approve/reject restaurants
- ✅ Manage system settings
- ✅ Monitor audit logs
- ✅ Issue refunds/disputes
- ✅ Generate compliance reports
- ✅ Manage feature flags

---

### **4. SUPPORT STAFF** (Role: `support` | Phase 2)
**Primary Platform**: Support Portal (Port 5177) - Coming Soon  
**Theme**: Blue (#3498db)  
**Status**: Scaffolded for Phase 2

#### Planned Support Features:
- Support ticket management
- Customer communication interface
- Content moderation tools
- Dispute resolution workflow
- Customer feedback aggregation

---

## 🏗️ SYSTEM ARCHITECTURE LAYERS

```
┌────────────────────────────────────────────────────────────────┐
│                      LAYER 1: PRESENTATION                     │
│                         (React PWA)                            │
├─────────────┬──────────────┬──────────────┬──────────────┬─────┤
│  Customer   │  Provider    │ Provider     │  Admin       │Supp.│
│  Portal     │  Portal      │ Analytics    │  Portal      │Port.│
│  (:5173)    │  (:5174)     │  (:5175)     │  (:5176)     │(:51)│
└─────────────┴──────────────┴──────────────┴──────────────┴─────┘
                         ↓ ↓ ↓ ↓ (All HTTP+WS)
┌────────────────────────────────────────────────────────────────┐
│                   LAYER 2A: API GATEWAY                        │
│            Vite Dev Proxy (Dev) / Cloud Load Balancer (Prod)   │
│                   → http://localhost:5000                       │
└────────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────────┐
│     LAYER 2B: BACKEND SERVICES (Microservices Architecture)    │
├────────────────────────────┬──────────────────────────────────┤
│  L2B-1: Node.js API        │  L2B-2: Python FastAPI AI        │
│  (Express.js)              │  (LangChain + Vertex AI)         │
│                            │                                  │
│  REST Endpoints:           │  AI Endpoints:                   │
│  • POST /auth/signup       │  • POST /chat/message            │
│  • POST /auth/login        │  • POST /agents/discover         │
│  • GET /restaurants        │  • POST /agents/recommend        │
│  • POST /restaurants/:id   │  • POST /agents/reserve          │
│    /reservations           │  • POST /agents/payment          │
│  • WebSocket events        │  • GET /embeddings              │
│  • POST /payments          │  • GET /vector-search            │
│                            │                                  │
│  Database Clients:         │  Service Integrations:           │
│  • Firebase Admin SDK      │  • Google Vertex AI LLM          │
│  • Neo4j Driver            │  • PineconeVector Search         │
│  • Stripe SDK              │  • LangChain Orchestration       │
│  • Socket.io Server        │  • LlamaIndex RAG                │
└────────────────────────────┴──────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────────┐
│                  LAYER 3: DATA PERSISTENCE                     │
├────────────┬────────────────┬───────────────┬────────────────┤
│ Firestore  │   Neo4j        │   MongoDB     │ Vector Search  │
│ (NoSQL)    │   (Graph)      │   (NoSQL)     │ (Embeddings)   │
│            │                │               │                │
│ • Users    │ • Preferences  │ • Audit logs  │ • Embeddings   │
│ • Restau.  │ • Ratings      │ • Analytics   │ • Search       │
│ • Reserv.  │ • Recommend.   │ • History     │ • Ranking      │
│ • Payments │ • Friendship   │ • Events      │                │
└────────────┴────────────────┴───────────────┴────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────────┐
│              LAYER 4: EXTERNAL SERVICES                        │
├─────────────────┬─────────────────┬────────────────────────────┤
│  Google Vertex  │  Stripe         │  Google Cloud              │
│  • Gemini LLM   │  • Payments     │  • Cloud Storage           │
│  • Embeddings   │  • Webhooks     │  • Cloud Run               │
│  • Vector Search│  • Verification │  • Pub/Sub                 │
└─────────────────┴─────────────────┴────────────────────────────┘
```

---

## 🔄 COMPLETE USER WORKFLOWS

### **WORKFLOW 1: Customer Registration & First Search**

```
START: Customer opens app
│
├─→ [NOT LOGGED IN?]
│   └─→ Sign In/Sign Up Screen
│       ├─ Email signup (create account)
│       ├─ Google OAuth login
│       └─ Set profile (name, dietary restrictions, preferences)
│           ↓
│       [Firebase Auth Service]
│       ├─ Create user in Firestore
│       ├─ Generate JWT token
│       └─ Store in localStorage
│           ↓
├─→ [LOGGED IN: Customer Portal]
│   └─→ Dashboard / Home Screen
│       ├─ "Hi [Name]!" greeting
│       └─ Quick start options:
│           • 🔍 Find Italian Restaurants
│           • 📅 Book a Table
│           • 🥗 Find Vegan-Friendly
│           • 🔥 Trending Now
│           ↓
│       [Click: "Find Italian Restaurants"]
│           ↓
│
├─→ SEARCH REQUEST
│   ├─ Frontend: "Show Italian restaurants near me"
│   │   ├─ Auto-detect location (browser geolocation API)
│   │   └─ Compile search params:
│   │       {
│   │         cuisine: "Italian",
│   │         location: { lat: 40.7128, lng: -74.0060 },
│   │         maxDistance: 15, // km
│   │         partySize: 2,    // default
│   │         date: "2026-04-08"
│   │       }
│   │           ↓
│   └─→ HTTP POST /api/chat/message
│       {
│         userId: "cust-123",
│         message: "Show Italian restaurants",
│         context: { location, preferences }
│       }
│           ↓
│
├─→ BACKEND API (Node.js)
│   └─→ POST /chat/message Handler
│       ├─ Validate request (JWT, rate limit)
│       ├─ Extract user context from Firestore
│       └─ Forward to AI service
│           ↓
│       HTTP POST http://localhost:8000/chat
│           {
│             message: "Show Italian restaurants",
│             intent: "SEARCH",
│             context: { userId, preferences, location }
│           }
│           ↓
│
├─→ AI SERVICE (Python FastAPI)
│   └─→ POST /chat/message Handler
│       ├─[1] Intent Classifier Agent
│       │   ├─ Process message with Gemini LLM
│       │   └─ Output: { intent: "SEARCH", entities: { cuisine: "Italian" }, confidence: 0.95 }
│       │           ↓
│       ├─[2] Context Manager
│       │   ├─ Load user preferences from Firestore
│       │   ├─ Get conversation history (Redis cache)
│       │   └─ Build ConversationContext
│       │           ↓
│       ├─[3] Discovery Agent
│       │   ├─ Query Firestore:
│       │   │   • Find restaurants where cuisine="Italian"
│       │   │   • Filter by distance (15km radius)
│       │   │   • Filter by available time slots
│       │   │   • Apply dietary filters (user preferences)
│       │   │       ↓
│       │   ├─ Results: [Restaurant A, Restaurant B, Restaurant C]
│       │   │       ↓
│       │   ├─ Rank by:
│       │   │   • Distance (closest first)
│       │   │   • User ratings (highest first)
│       │   │   • Match with user preferences
│       │   │       ↓
│       │   └─ Vector Search (embeddings):
│       │       • Convert search terms to vectors
│       │       • Semantic search via Vertex AI Vector Search
│       │       • Personalized ranking
│       │           ↓
│       ├─[4] Response Generation
│       │   ├─ Use Gemini to format response
│       │   ├─ Add explanations (why these are recommended)
│       │   └─ Generate suggested actions:
│       │       [
│       │         { type: "VIEW_RESTAURANT", id: "rest-1", text: "View Details" },
│       │         { type: "BOOK_NOW", id: "rest-1", text: "Book Table" },
│       │         { type: "SAVE", id: "rest-1", text: "Save for Later" }
│       │       ]
│       │           ↓
│       ├─[5] Context Manager - Save
│       │   ├─ Store message in conversation history (Redis + Firestore)
│       │   ├─ Log action: "SEARCH - Italian restaurants"
│       │   └─ Update user context (remember Italian interest)
│       │           ↓
│       └─ Return Response:
│           {
│             intent: "SEARCH",
│             response: "I found 3 excellent Italian restaurants...",
│             suggestedActions: [...],
│             restaurants: [
│               {
│                 id: "rest-1",
│                 name: "La Bella Italia",
│                 cuisine: ["Italian"],
│                 rating: 4.8,
│                 address: "123 Main St",
│                 distance: "2.3 km",
│                 availableTimes: ["18:00", "18:30", "19:00", ...]
│               },
│               ...
│             ]
│           }
│           ↓
│
├─→ BACKEND API (Node.js)
│   └─→ Format & return to Frontend
│       HTTP 200 OK
│           {
│             conversationId: "conv-abc123",
│             message: { ...response from AI },
│             timestamp: "2026-04-08T10:30:00Z"
│           }
│           ↓
│
├─→ FRONTEND (React)
│   └─→ Display Results
│       ├─ Show "Chef Assistant is typing..." indicator
│       ├─ Render restaurants as scrollable cards
│       ├─ Each card shows:
│       │   • Restaurant image/emoji
│       │   • Name + Rating (⭐4.8)
│       │   • Cuisine tags (#Italian, #Fine Dining)
│       │   • Distance (2.3 km)
│       │   • Price level ($$$)
│       │   • Buttons: [📅 Book] [ℹ️ Details]
│       │
│       ├─ Show suggested actions as pills:
│       │   [Show more options] [Book this restaurant] [View menu]
│       │
│       └─ Auto-scroll to latest message
│           ↓
│
└─→ END: Customer sees restaurant options & can proceed to booking
```

---

### **WORKFLOW 2: AI-Powered Reservation (Complex Multi-Agent)**

```
START: Customer says "I want to book a vegetarian Italian place for 4"
│
├─→ [FRONTEND SENDS]
│   POST /api/chat/message
│   {
│     userId: "cust-123",
│     message: "I want to book a vegetarian Italian place for 4",
│     context: { location, preferences }
│   }
│           ↓
│
├─→ [BACKEND API]
│   └─→ Route to AI Service
│           ↓
│
├─→ [AI SERVICE - ORCHESTRATOR]
│   │
│   ├─[1] INTENT CLASSIFIER
│   │   ├─ Input: "book a vegetarian Italian place for 4"
│   │   └─ Output: {
│   │       intent: "RESERVATION",
│   │       confidence: 0.92,
│   │       entities: {
│   │         cuisine: "Italian",
│   │         dietaryRestriction: "vegetarian",
│   │         partySize: 4,
│   │         timeFrame: "soon" (not specified → default)
│   │       },
│   │       requiredAgents: ["DISCOVERY", "RECOMMENDATION", "RESERVATION"]
│   │     }
│   │           ↓
│   │
│   ├─[2] CONTEXT MANAGER - INIT
│   │   ├─ Load user data:
│   │   │   {
│   │   │     userId: "cust-123",
│   │   │     name: "John Doe",
│   │   │     email: "john@example.com",
│   │   │     phone: "+1-555-0123",
│   │   │     preferences: {
│   │   │       cuisines: ["Italian", "Spanish"],
│   │   │       dietary: ["vegetarian"],
│   │   │       priceRange: "$$ - $$$"
│   │   │     },
│   │   │     bookingHistory: [
│   │   │       { restaurantId: "rest-1", date, rating: 4.5 },
│   │   │       { restaurantId: "rest-3", date, rating: 5 }
│   │   │     ]
│   │   │   }
│   │   └─ Store in ConversationContext
│   │           ↓
│   │
│   ├─[3] DISCOVERY AGENT
│   │   ├─ Query Firestore:
│   │   │   db.collection('restaurants')
│   │   │     .where('cuisine', '==', 'Italian')
│   │   │     .where('vegetarianOptions', '==', true)
│   │   │     .where('location.distance', '<', 15)  // km
│   │   │     .where('status', '==', 'active')
│   │   │     .get()
│   │   │
│   │   ├─ Results: [rest-1, rest-2, rest-5, rest-7] (4 matches)
│   │   │
│   │   ├─ Filter by availability:
│   │   │   ├─ Check party size: 4 people
│   │   │   ├─ Check time slots: Today/Tomorrow
│   │   │   └─ Results: [rest-1, rest-5, rest-7] (3 have availability)
│   │   │           ↓
│   │   └─ Output:
│   │       {
│   │         candidates: [
│   │           {
│   │             id: "rest-1",
│   │             name: "La Bella Italia",
│   │             vegetarianRating: 4.9,
│   │             availableSlots: ["18:00", "19:00", "20:00"]
│   │           },
│   │           ...
│   │         ]
│   │       }
│   │           ↓
│   │
│   ├─[4] RECOMMENDATION AGENT (Optional: Multi-Agent Ranking)
│   │   ├─ Query Neo4j Graph:
│   │   │   MATCH (u:User)-[r:RATED]→(rest:Restaurant)
│   │   │   WHERE u.id = "cust-123"
│   │   │   AND rest.cuisine = "Italian"
│   │   │   RETURN rest, AVG(r.rating) as avgRating
│   │   │
│   │   ├─ User history analysis:
│   │   │   • Has rated 2 Italian restaurants before
│   │   │   • Average rating: 4.75
│   │   │   • Prefers high-end vegetarian
│   │   │
│   │   ├─ Collaborative filtering:
│   │   │   • Find similar users (vegetarians, Italian lovers)
│   │   │   • See where they book highly
│   │   │   • Rank rest-1 highest (user + similar users love it)
│   │   │
│   │   ├─ Content-based filtering:
│   │   │   • Vector similarity of restaurant attributes
│   │   │   • Match with user profile vectors
│   │   │           ↓
│   │   └─ Output Ranking:
│   │       1. rest-1 (Score: 4.9) ← Top recommendation
│   │       2. rest-5 (Score: 4.6)
│   │       3. rest-7 (Score: 4.3)
│   │           ↓
│   │
│   ├─[5] RESERVATION AGENT
│   │   ├─ Check Table Availability:
│   │   │   restaurantId: "rest-1"
│   │   │   date: "2026-04-08"
│   │   │   time: "19:00"
│   │   │   partySize: 4
│   │   │
│   │   ├─ Query Firestore tables:
│   │   │   db.collection('restaurants/rest-1/tables')
│   │   │     .where('capacity', '>=', 4)
│   │   │     .where('available', '==', true)
│   │   │     .get()
│   │   │   Result: [table-2, table-5] available at 19:00
│   │   │
│   │   ├─ Generate Confirmation Code:
│   │   │   confirmationCode = generateCode() // "BELLE7F9X"
│   │   │
│   │   ├─ Create Reservation Record:
│   │   │   db.collection('reservations').add({
│   │   │     id: "res-xyz789",
│   │   │     userId: "cust-123",
│   │   │     restaurantId: "rest-1",
│   │   │     date: "2026-04-08",
│   │   │     time: "19:00",
│   │   │     partySize: 4,
│   │   │     tableId: "table-2",
│   │   │     status: "pending",  // awaiting confirmation
│   │   │     confirmationCode: "BELLE7F9X",
│   │   │     createdAt: now(),
│   │   │     expiresAt: now() + 15minutes
│   │   │   })
│   │   │
│   │   ├─ Update Table Availability:
│   │   │   db.collection('restaurants/rest-1/tables/table-2')
│   │   │     .update({ available: false, reservedUntil: "19:45" })
│   │   │
│   │   ├─ Send Confirmation Email:
│   │   │   email.send({
│   │   │     to: "john@example.com",
│   │   │     subject: "Reservation Confirmed - La Bella Italia",
│   │   │     body: {
│   │   │       confirmation: "BELLE7F9X",
│   │   │       restaurant: "La Bella Italia",
│   │   │       date: "April 8, 2026",
│   │   │       time: "7:00 PM",
│   │   │       party: "4 guests",
│   │   │       address: "123 Main St",
│   │   │       phone: "+1-555-0456",
│   │   │       cancellationLink: "...",
│   │   │       modifyLink: "..."
│   │   │     }
│   │   │   })
│   │   │
│   │   ├─ Notify Restaurant (WebSocket):
│   │   │   socket.emit('new_reservation', {
│   │   │     restaurantId: "rest-1",
│   │   │     reservation: { ... }
│   │   │   })
│   │   │
│   │   └─ Output:
│   │       {
│   │         status: "success",
│   │         reservation: {
│   │           confirmationCode: "BELLE7F9X",
│   │           restaurantId: "rest-1",
│   │           restaurantName: "La Bella Italia",
│   │           date: "2026-04-08",
│   │           time: "19:00",
│   │           partySize: 4,
│   │           modifications: {
│   │             canModify: true,
│   │             deadlineToModify: "2 hours before"
│   │           },
│   │           cancellation: {
│   │             canCancel: true,
│   │             refundPolicy: "Full refund if cancelled 24h before"
│   │           }
│   │         }
│   │       }
│   │           ↓
│   │
│   ├─[6] CONTEXT MANAGER - SAVE
│   │   ├─ Store all actions:
│   │   │   {
│   │   │     action: "RESERVATION_CREATED",
│   │   │     details: { restaurantId, reservationId, confirmationCode },
│   │   │     timestamp: now()
│   │   │   }
│   │   │
│   │   ├─ Update user preferences:
│   │   │   - Preferences.lastSearched = ["Italian", "vegetarian"]
│   │   │   - Preferences.lastBookedRestaurant = "rest-1"
│   │   │
│   │   └─ Persist to Redis + Firestore:
│   │       redis.set(key, context, EX=86400)
│   │       firestore.collection('conversations').add(context)
│   │           ↓
│   │
│   └─[7] RESPONSE GENERATION
│       ├─ Gemini formats natural response:
│       │   "Perfect! I've booked La Bella Italia for you on April 8 at 7:00 PM
│       │    for 4 guests. Your confirmation code is BELLE7F9X.
│       │
│       │    📍 La Bella Italia
│       │    123 Main St
│       │    ⭐ 4.9 stars | 🥗 Excellent vegetarian options
│       │
│       │    You'll receive a confirmation email shortly.
│       │    You can modify until 5:00 PM or cancel for a full refund."
│       │
│       ├─ Suggested next actions:
│       │   [View Restaurant] [Add to Calendar] [Share with Friends]
│       │
│       └─ Return to Backend API
│           ↓
│
├─→ [BACKEND API: Format Response]
│   HTTP 200 OK
│   {
│     conversationId: "conv-abc123",
│     message: { intent, response, restaurants, suggestedActions },
│     reservation: { confirmationCode, ... }
│   }
│           ↓
│
├─→ [FRONTEND: Display Success]
│   ├─ Show animated confirmation screen
│   ├─ Display confirmation code prominently
│   ├─ Show reservation details
│   ├─ Add to calendar option
│   ├─ Share reservation link
│   └─ Suggested next actions
│           ↓
│
└─→ END: Reservation confirmed, confirmation email sent to customer
```

---

### **WORKFLOW 3: Restaurant Owner - Accept & Manage Reservations**

```
START: Restaurant Owner (Provider) logs in to Provider Portal
│
├─→ [Provider Portal - Port 5174]
│   └─→ Authentication
│       ├─ Email/password login
│       ├─ Verify credentials against Firestore
│       ├─ Issue JWT token
│       └─ Load restaurant profile
│           ↓
│
├─→ [Provider Dashboard]
│   ├─ Welcome: "Hi, [Restaurant Name]!"
│   ├─ Key metrics:
│   │   • Today's reservations: 12
│   │   • Ready tables: 5 / 8
│   │   • Pending confirmations: 3
│   │   • Revenue today: $4,200
│   │
│   └─ Navigation: [Reservations] [Menu] [Tables] [Analytics] [Settings]
│           ↓
│
├─→ [Click: RESERVATIONS]
│   └─→ Reservation List View
│       ├─ Filters: [All] [Pending] [Confirmed] [Completed] [Cancelled]
│       ├─ Sort: [By Time] [By Party Size] [By Date]
│       │
│       └─ Pending Reservation Card:
│           ┌─────────────────────────────────────┐
│           │ 👤 John Doe                         │
│           │ 👥 Party of 4                       │
│           │ 📅 Apr 8, 2026 at 7:00 PM          │
│           │ 📞 +1-555-0123                      │
│           │ 🎫 Confirmation: BELLE7F9X         │
│           │ ⏱️  Pending confirmation (expires  │
│           │     in 12 minutes)                  │
│           │                                     │
│           │ [✅ ACCEPT] [❌ REJECT] [❓ HOLD]   │
│           └─────────────────────────────────────┘
│           ↓
│
├─→ [Click: ACCEPT]
│   ├─ Backend receives:
│   │   PUT /api/reservations/{reservationId}/confirm
│   │   {
│   │     restaurantId: "rest-1",
│   │     status: "confirmed",
│   │     confirmedBy: "owner-1",
│   │     confirmedAt: now()
│   │   }
│   │           ↓
│   │
│   ├─ Backend updates Firestore:
│   │   db.collection('reservations/{resId}').update({
│   │     status: "confirmed",
│   │     confirmedAt: now(),
│   │     ownerNotes: ""
│   │   })
│   │
│   │   // Also update table status
│   │   db.collection('restaurants/rest-1/tables/table-2')
│   │     .update({ status: "reserved", partySize: 4 })
│   │
│   │   // Broadcast to all connected clients (WebSocket)
│   │   socket.emit('reservation_confirmed', { reservationId })
│   │           ↓
│   │
│   ├─ Backend sends Notification Email:
│   │   email.send({
│   │     to: "john@example.com",
│   │     subject: "Your reservation is confirmed!",
│   │     body: "Your reservation at La Bella Italia on April 8
│   │             at 7:00 PM for 4 is confirmed. Conf: BELLE7F9X"
│   │   })
│   │           ↓
│   │
│   ├─ Frontend updates:
│   │   ├─ Card shows "✅ Confirmed"
│   │   ├─ Changes to green background
│   │   ├─ Shows new options:
│   │   │   [📝 Add Notes] [📞 Send SMS] [🔔 Remind] [❌ Cancel]
│   │   │
│   │   └─ Toast notification: "Reservation confirmed!"
│   │           ↓
│
├─→ [Optional: Add Owner Notes]
│   ├─ Click [📝 Add Notes]
│   ├─ Modal opens with text field
│   ├─ Owner types: "Special occasion - birthday party. Surprise cake?"
│   ├─ Backend stores:
│   │   db.collection('reservations/{resId}').update({
│   │     ownerNotes: "Special occasion - birthday party. Surprise cake?"
│   │   })
│   │           ↓
│   └─ Notes visible to staff on day of reservation
│           ↓
│
├─→ [Later: Time approaches (e.g., 6:30 PM)]
│   ├─ Backend scheduled job triggers:
│   │   - Find all reservations for today within 30 mins
│   │   - Mark status: "upcoming"
│   │
│   ├─ Frontend UI highlights:
│   │   ├─ Reservation card moves to "Upcoming" tab
│   │   ├─ Shows "🔔 Starting in 30 minutes" badge
│   │   ├─ New buttons appear:
│   │   │   [✅ Check-In] [⏸️ Delay] [❌ No-Show]
│   │   │
│   │   └─ WebSocket notification to owner:
│   │       "Party of 4 (Doe) arriving in 30 minutes"
│   │           ↓
│
├─→ [7:00 PM: Customer Arrives]
│   ├─ Owner scans QR code from confirmation email
│   │   OR
│   │ Owner clicks [✅ Check-In]
│   │           ↓
│   │
│   ├─ Backend updates:
│   │   db.collection('reservations/{resId}').update({
│   │     status: "checked_in",
│   │     checkedInAt: now(),
│   │     actualPartySize: 4
│   │   })
│   │           ↓
│   │
│   ├─ Table status changes:
│   │   db.collection('restaurants/rest-1/tables/table-2')
│   │     .update({ 
│   │       status: "occupied",
│   │       occupiedAt: now(),
│   │       expectedCheckoutTime: now() + 2hours
│   │     })
│   │           ↓
│   │
│   └─ Frontend displays:
│       ├─ Reservation moves to "Active" tab
│       ├─ Shows "⏱️ Seated 2 mins ago"
│       ├─ Staff can access:
│       │   - Order history
│       │   - Dietary restrictions
│       │   - Owner notes
│       │   - Special requests
│       │
│       └─ Buttons: [Complete] [Delay] [Issues?]
│           ↓
│
├─→ [Staff Complete Dining]
│   ├─ Click [Complete] after customer leaves
│   │           ↓
│   │
│   ├─ Backend updates:
│   │   db.collection('reservations/{resId}').update({
│   │     status: "completed",
│   │     completedAt: now(),
│   │     duration: now() - checkedInAt  // 2.5 hours
│   │   })
│   │
│   │   // Release table
│   │   db.collection('restaurants/rest-1/tables/table-2')
│   │     .update({ 
│   │       status: "available",
│   │       available: true,
│   │       clearedAt: now()
│   │     })
│   │           ↓
│   │
│   ├─ Send Follow-up Email to Customer:
│   │   email.send({
│   │     to: "john@example.com",
│   │     subject: "How was your meal at La Bella Italia?",
│   │     body: "Please rate your experience and leave a review..."
│   │   })
│   │           ↓
│   │
│   └─ Frontend:
│       ├─ Reservation archived
│       ├─ Revenue recorded in analytics
│       └─ Table available for next booking
│           ↓
│
└─→ END: Full reservation lifecycle complete
```

---

### **WORKFLOW 4: Admin - Review & Approve New Restaurant**

```
START: New restaurant owner submits application via Provider signup
│
├─→ [Frontend: Provider Signup]
│   ├─ Step 1: Email & password
│   ├─ Step 2: Restaurant details
│   │   ├─ Name, cuisine type, address
│   │   ├─ Opening hours, table count
│   │   ├─ Business license upload
│   │   └─ Owner ID/passport upload
│   │
│   ├─ Step 3: Agreement terms
│   │   └─ "I agree to platform policies"
│   │
│   └─ Submit
│           ↓
│
├─→ [Backend: Store Application]
│   ├─ POST /api/restaurants/apply
│   │
│   ├─ Firestore stores:
│   │   db.collection('restaurant_applications').add({
│   │     id: "app-xyz123",
│   │     ownerId: "owner-1",
│   │     appStatus: "pending_review",
│   │     submittedAt: now(),
│   │     expiresAt: now() + 30days,
│   │     details: {
│   │       name: "New Pasta House",
│   │       cuisine: ["Italian", "Pasta"],
│   │       address: "456 Oak St",
│   │       phone: "+1-555-0789",
│   │       tables: 20,
│   │       openingHours: { ... }
│   │     },
│   │     documents: {
│   │       businessLicense: "https://storage/...",
│   │       ownerId: "https://storage/..."
│   │     },
│   │     review: {
│   │       status: null,  // null = pending
│   │       reviewedBy: null,
│   │       reviewedAt: null,
│   │       notes: null,
│   │       reasons: null
│   │     }
│   │   })
│   │           ↓
│   │
│   ├─ Send notification to Admin:
│   │   - Email admin team: "New restaurant application pending review"
│   │   - WebSocket alert in Admin Portal
│   │           ↓
│
├─→ [Admin Portal - Port 5176]
│   ├─ Admin logs in
│   │           ↓
│   │
│   └─→ [Approvals / Queue Section]
│       ├─ Pending count: 1
│       │           ↓
│       └─→ Application Card
│           ┌──────────────────────────────────────┐
│           │ 📍 NEW PASTA HOUSE                   │
│           │ 🔗 Owner: owner-1 (first-time)      │
│           │                                      │
│           │ Cuisine: Italian, Pasta              │
│           │ Location: 456 Oak St                 │
│           │ Tables: 20                           │
│           │ Phone: +1-555-0789                   │
│           │                                      │
│           │ Submission: Apr 8, 2026              │
│           │ Expires in: 29 days                  │
│           │                                      │
│           │ [📄 View License] [🆔 View ID]      │
│           │ [📍 Verify Location] [☎️ Call]     │
│           │                                      │
│           │ [✅ APPROVE] [❌ REJECT] [⏸️ HOLD]  │
│           └──────────────────────────────────────┘
│           ↓
│
├─→ [Admin Verification Steps]
│   │
│   ├─ [📄 View License]
│   │   └─ Opens document preview (PDF)
│   │       ├─ Validates:
│   │       │   - License number legible
│   │       │   - Expiry date valid
│   │       │   - Matches restaurant name
│   │       │   - Registration country correct
│   │       │
│   │       └─ Admin checks: ✅ Valid
│   │           ↓
│   │
│   ├─ [🆔 View ID]
│   │   └─ Opens owner ID preview
│   │       ├─ Validates:
│   │       │   - ID not expired
│   │       │   - Face matches application
│   │       │   - Name matches registration
│   │       │
│   │       └─ Admin checks: ✅ Valid
│   │           ↓
│   │
│   ├─ [📍 Verify Location]
│   │   └─ Opens map view
│   │       ├─ Pins location: 456 Oak St
│   │       ├─ Checks:
│   │       │   - Is commercial area (not residential)
│   │       │   - Parking available
│   │       │   - Compliance with zoning (if available)
│   │       │
│   │       └─ Admin checks: ✅ Valid location
│   │           ↓
│   │
│   └─ [☎️ Call]
│       └─ Optional: Call owner to verify
│           │
│           └─ Admin notes:
│               ├─ Owner friendly & professional
│               ├─ Has restaurant experience
│               └─ Clear business plan
│                   ↓
│
├─→ [Admin Decision: APPROVE]
│   │
│   ├─ Click [✅ APPROVE]
│   │           ↓
│   │
│   ├─ Modal appears:
│   │   ┌──────────────────────────────────────┐
│   │   │ Approval Notes (optional):           │
│   │   │ ┌─────────────────────────────────┐ │
│   │   │ │ "All documents validated.       │ │
│   │   │ │  Owner verified via call.       │ │
│   │   │ │  Approved for platform launch." │ │
│   │   │ └─────────────────────────────────┘ │
│   │   │                                      │
│   │   │ [📋 No restrictions] [Add condition]│
│   │   │ [CONFIRM] [Cancel]                 │
│   │   └──────────────────────────────────────┘
│   │           ↓
│   │
│   └─ [CONFIRM]
│       ├─ Backend receives:
│       │   PUT /api/restaurants/{appId}/approve
│       │   {
│       │     adminId: "admin-1",
│       │     notes: "All documents validated...",
│       │     conditions: [],
│       │     approvedAt: now()
│       │   }
│       │           ↓
│       │
│       ├─ Firestore updates application:
│       │   db.collection('restaurant_applications/{appId}')
│       │     .update({
│       │       appStatus: "approved",
│       │       review: {
│       │         status: "approved",
│       │         reviewedBy: "admin-1",
│       │         reviewedAt: now(),
│       │         notes: "All documents validated..."
│       │       }
│       │     })
│       │           ↓
│       │
│       ├─ Create restaurant record in main collection:
│       │   db.collection('restaurants').add({
│       │     id: "rest-new-1",
│       │     ownerId: "owner-1",
│       │     status: "active",
│       │     details: { ... application details ... },
│       │     approvalDate: now(),
│       │     commissionRate: 0.15,  // 15% platform commission
│       │     bankDetails: { ... pending owner setup ... }
│       │   })
│       │           ↓
│       │
│       ├─ Send approval email to owner:
│       │   email.send({
│       │     to: "owner@email.com",
│       │     subject: "Welcome to DineBot! Your restaurant is now active",
│       │     body: `
│       │       Congratulations! Your restaurant "New Pasta House"
│       │       has been approved and is now live on our platform.
│       │
│       │       Next steps:
│       │       1. Log in to Provider Portal
│       │       2. Complete menu setup
│       │       3. Configure table settings
│       │       4. Add staff members
│       │
│       │       You can now start accepting reservations!
│       │     `
│       │   })
│       │           ↓
│       │
│       ├─ Send notification to owner (in-app):
│       │   - WebSocket alert
│       │   - Dashboard message
│       │           ↓
│       │
│       └─ Frontend updates:
│           ├─ Admin sees: "✅ APPROVED"
│           ├─ Application moves to "Completed" tab
│           ├─ Next application in queue appears
│           │
│           └─ Owner's Provider Portal:
│               ├─ Can now access full dashboard
│               ├─ Can add menu items
│               ├─ Can configure tables
│               └─ Can start accepting reservations
│                   ↓
│
└─→ END: Restaurant approved and live on platform
```

---

## 📡 DATA FLOW ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                        │
│          (Frontend portals - React PWA)                     │
└─────────────────────────────────────────────────────────────┘
         ↓            ↓            ↓            ↓
    ┌────────────────────────────────────────────┐
    │  LAYER 2A: REST API Gateway (Node.js)      │
    │  POST /api/chat/message                    │
    │  GET /api/restaurants                      │
    │  POST /api/reservations                    │
    │  PUT /api/restaurants/{id}/reservations    │
    │  GET /api/analytics                        │
    └────────────────────────────────────────────┘
         ↓  (synchronous HTTP)  ↓
    ┌─────────────────────────────────────────────────────┐
    │ LAYER 2B: AI Service (Python FastAPI)              │
    │                                                     │
    │ ┌─────────────────────────────────────────────┐   │
    │ │ [1] Intent Classifier (Gemini LLM)          │   │
    │ │     Input: Raw user message                 │   │
    │ │     Output: Intent + Entities               │   │
    │ └─────────────────────────────────────────────┘   │
    │              ↓                                     │
    │ ┌─────────────────────────────────────────────┐   │
    │ │ [2] Context Manager                         │   │
    │ │     • Load user preferences (Firestore)     │   │
    │ │     • Fetch conversation history (Redis)    │   │
    │ │     • Build context for agents              │   │
    │ └─────────────────────────────────────────────┘   │
    │              ↓                                     │
    │ ┌─────────────────────────────────────────────┐   │
    │ │ [3] Domain Agents (Parallel Execution)      │   │
    │ │                                             │   │
    │ │ ┌─────────────────┐  ┌─────────────────┐  │   │
    │ │ │ Discovery Agent │  │ Recommendation │  │   │
    │ │ │ (SEARCH)        │  │ Agent (RANK)   │  │   │
    │ │ │ • Query Firestore  │ • Query Neo4j │  │   │
    │ │ │ • Filter & sort    │ • Collab filters  │   │
    │ │ └─────────────────┘  └─────────────────┘  │   │
    │ │                                             │   │
    │ │ ┌─────────────────┐  ┌─────────────────┐  │   │
    │ │ │ Reservation Ag. │  │ Payment Agent  │  │   │
    │ │ │ (RESERVE)       │  │ (PAY)          │  │   │
    │ │ │ • Check tables     │ • Stripe API   │  │   │
    │ │ │ • Create booking   │ • Verify & log │  │   │
    │ │ └─────────────────┘  └─────────────────┘  │   │
    │ └─────────────────────────────────────────────┘   │
    │              ↓                                     │
    │ ┌─────────────────────────────────────────────┐   │
    │ │ [4] Response Generation (Gemini)            │   │
    │ │     Format natural language response         │   │
    │ │     Add suggested actions                    │   │
    │ └─────────────────────────────────────────────┘   │
    │              ↓                                     │
    │ ┌─────────────────────────────────────────────┐   │
    │ │ [5] Context Manager - Persist               │   │
    │ │     • Store conversation (Firestore)        │   │
    │ │     • Cache session (Redis/24h TTL)         │   │
    │ │     • Log action analytics                  │   │
    │ └─────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │   LAYER 3: DATA PERSISTENCE             │
    ├──────────┬────────────┬─────────────────┤
    │ Firestore│   Neo4j    │   MongoDB  │Vector│
    │ (NoSQL)  │   (Graph)  │   (NoSQL)  │Search│
    │          │            │            │     │
    │ • Users  │ • Prefs    │ • Logs     │• Emb│
    │ • Rests. │ • Ratings  │ • Analytics│     │
    │ • Reserv.│ • Graphs   │            │     │
    │ • Apps   │            │            │     │
    └──────────┴────────────┴────────────┴─────┘
         ↓
    ┌─────────────────────────────────────────┐
    │   LAYER 4: EXTERNAL INTEGRATIONS        │
    ├──────────┬────────────────┬─────────────┤
    │ Stripe   │ Vertex AI      │ Google      │
    │ (Payments│ (LLM,Vectors)  │ Cloud       │
    │          │                │ (Storage)   │
    └──────────┴────────────────┴─────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │   LAYER 5: NOTIFICATIONS                │
    ├──────────┬────────────────┬─────────────┤
    │ Email    │  SMS (Twilio)  │ WebSocket   │
    │ (Gmail)  │  (optional)    │ (Real-time) │
    └──────────┴────────────────┴─────────────┘
```

---

## 🏛️ MULTI-PORTAL ARCHITECTURE

### **Portal Overview Table**

| Portal | Port | Role(s) | Theme | Primary Users | Key Features |
|--------|------|---------|-------|---------------|--------------|
| **Customer** | 5173 | Any user | Red (#ff6b6b) | Diners | Search, book, chat, orders |
| **Provider** | 5174 | owner | Teal (#4ecdc4) | Restaurant owners | Reservation mgmt, menu editor |
| **Analytics** | 5175 | owner | Purple (#9b59b6) | Restaurant owners | Revenue, customers, insights |
| **Admin** | 5176 | admin | Dark Red (#e74c3c) | Platform managers | Approvals, user mgmt, settings |
| **Support** | 5177 | support | Blue (#3498db) | Support staff | Tickets, moderation (Phase 2) |

### **Auth Flow**

```
┌─ Customer Portal
│  ├─ Email signup / Google OAuth
│  ├─ Verify email (if needed)
│  └─ JWT token stored in localStorage
│
├─ Provider Portal
│  ├─ Restaurant owner email + password
│  ├─ Email verification required
│  ├─ Application submission (before approval)
│  └─ JWT token in localStorage
│
├─ Analytics Portal
│  ├─ Same as Provider Portal (owner-only access)
│  └─ Extra role check: role === 'owner'
│
├─ Admin Portal
│  ├─ Admin email + password (invite-only signup)
│  ├─ 2FA required (TOTP or SMS)
│  ├─ Admin verification
│  └─ JWT token with admin scope
│
└─ Support Portal
   ├─ Email + password (invite-only)
   └─ Role-based: role === 'support' OR 'admin'
```

---

## 🤖 AI AGENT ECOSYSTEM

### **3 Core Agents**

**1. Intent Classifier Agent**
- **Input**: Raw user message + conversation context
- **Process**: Gemini LLM analyzes intent + entity extraction
- **Output**: {intent, entities, confidence, required_agents}
- **Intents**: SEARCH, RECOMMEND, RESERVE, CANCEL, HELP, etc.

**2. Context Manager Agent**
- **Input**: Messages, preferences, user data
- **Process**: Load/update session state
- **Storage**: Redis (fast cache, TTL 24h) + Firestore (persistent)
- **Output**: ConversationContext (maintains state across turns)

**3. Master Orchestrator Agent**
- **Input**: Intent + Context + User request
- **Process**: Route to appropriate domain agents
- **Coordination**: Execute agents in sequence or parallel
- **Aggregation**: Combine results into response

### **4 Domain Sub-Agents**

**1. Discovery Agent** (Epic 4)
- **Purpose**: Restaurant search & filtering
- **Input**: location, cuisine, party_size, dietary_restrictions, budget
- **Process**: Query Firestore + Vector Search
- **Output**: Ranked restaurant list with details

**2. Recommendation Agent** (Epic 5)
- **Purpose**: Personalized recommendations
- **Input**: user_id, history, preferences
- **Process**: Neo4j collaborative filtering + content-based ranking
- **Output**: Top recommendations with reasoning

**3. Reservation Agent** (Epic 6)
- **Purpose**: Booking management
- **Input**: restaurant_id, date, time, party_size, user_contact
- **Process**: Check availability → Generate code → Create record → Notify
- **Output**: Confirmation with code & details

**4. Payment Agent** (Epic 7)
- **Purpose**: Secure payment processing
- **Input**: amount, restaurant, reservation_id, payment_method
- **Process**: Call Stripe API → Verify → Log transaction
- **Output**: Transaction status & receipt

---

## 🛠️ TECHNOLOGY STACK INTEGRATION

### **Frontend (React PWA)**
- **Framework**: React 18 + Vite
- **State**: TanStack Query + Zustand
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Framer Motion
- **HTTP**: Axios with dev proxy to backend
- **Real-time**: Socket.io-client for WebSocket updates
- **PWA**: Workbox service workers

### **Backend API (Node.js)**
- **Framework**: Express.js + TypeScript
- **Auth**: JWT + OAuth 2.0 (Google)
- **Database**: Firebase Admin SDK + Neo4j Driver + Stripe SDK
- **Real-time**: Socket.io server
- **Validation**: Joi/Zod schemas
- **Testing**: Jest + Supertest

### **AI Service (Python FastAPI)**
- **Framework**: FastAPI + Uvicorn (async)
- **Agents**: LangChain 0.1+ for orchestration
- **LLM**: Google Vertex AI Gemini (primary) + OpenAI GPT-4 (fallback)
- **Embeddings**: Vertex AI Embeddings API
- **RAG**: LlamaIndex for document indexing
- **Database**: Firestore + Neo4j + MongoDB + Pinecone
- **Testing**: Pytest

### **Databases**
- **Firestore**: User data, restaurants, reservations, applications (real-time sync)
- **Neo4j**: User preferences, ratings, recommendations (graph queries)
- **MongoDB**: Audit logs, analytics history
- **Vector Search**: Vertex AI Vector Search for semantic search
- **Cache**: Redis for session caching (optional)

### **Cloud Infrastructure (GCP)**
- **Compute**: Cloud Run (auto-scaling containers)
- **Storage**: Cloud Storage (images, documents)
- **Pub/Sub**: Async messaging
- **Monitoring**: Cloud Logging + Cloud Monitoring

---

## 💬 COMMUNICATION PATTERNS

### **HTTP REST (Request-Response)**
```
[Frontend] → (HTTP POST) → [Backend API] 
                ↓
         [Process & Validate]
                ↓
         [Call AI Service]
                ↓
         [Query Databases]
                ↓
[Frontend] ← (HTTP 200/400/500) ← [Response JSON]
```

### **WebSocket (Real-Time)**
```
[Frontend] ←→ (Socket.io) ↔→ [Backend Server]
              
Events:
- new_message → broadcast to all
- reservation_confirmed → notify owner + customer
- table_available → notify customers
- typing_indicator → show "typing..."
```

### **Async Processing (Background Jobs)**
```
[Backend API] → [Cloud Pub/Sub] → [Async Worker]

Examples:
- Send email confirmation (after booking)
- Generate analytics reports (hourly)
- Vector embedding updates (nightly)
- Cleanup expired sessions
```

---

## 🔐 SECURITY ARCHITECTURE

### **Authentication**
- **Customers**: Email + password (Firebase Auth) OR Google OAuth
- **Owners**: Email + password (Firebase Auth)
- **Admins**: Email + password + 2FA (TOTP)

### **Authorization**
```typescript
// Role-based access control (RBAC)
CUSTOMER  → Customer Portal only (read own data)
OWNER     → Provider + Analytics (read/write own restaurant)
ADMIN     → Admin Portal (all data, management functions)
SUPPORT   → Support Portal + view any user (Phase 2)
```

### **Data Protection**
- **Transit**: HTTPS/TLS encryption (all connections)
- **Storage**: Firestore encryption at rest (GCP managed)
- **Sensitive**: Payment tokens (PCI-DSS via Stripe), passwords (bcryptjs)

### **API Security**
- **Rate Limiting**: 100 requests/minute per IP
- **CORS**: Whitelist known domain origins
- **JWT**: Expiration 1 hour, refresh tokens after 7 days
- **Stripe Webhooks**: Signature verification

---

## 📊 ANALYTICS & MONITORING

### **What We Track**
```
Customer:
  • Restaurant searches (cuisine, location patterns)
  • Bookings (when, where, frequency)
  • Ratings & reviews
  • Repeat visit rate
  
Owner:
  • Reservation acceptance rate
  • No-show rate
  • Average revenue per reservation
  • Peak hours
  • Menu item popularity
  
Admin:
  • Platform signups
  • Application approval rate
  • Payment processing errors
  • System uptime
```

### **Real-Time Dashboards**
- **Customer Portal**: View booking history, saved restaurants
- **Provider Analytics**: Revenue, customers, performance metrics
- **Admin Dashboard**: Platform KPIs, user analytics, compliance

---

## ✅ IMPLEMENTATION ROADMAP (Epics)

| Epic | Title | Status | Features |
|------|-------|--------|----------|
| **1** | Authentication | ✅ Complete | Signup, login, OAuth, JWT |
| **2** | Chatbot UI | ✅ Complete | Chat interface, message display |
| **3** | Agentic System | 🚀 Ready | Core + domain agents architecture |
| **4** | Discovery | 📋 Planned | Restaurant search + filtering |
| **5** | Recommendations | 📋 Planned | Neo4j-powered suggestions |
| **6** | Reservations | 📋 Planned | Booking + confirmation |
| **7** | Payments | 📋 Planned | Stripe integration |
| **8** | Firebase | 🚀 Ready | All database schemas |

---

**Generated**: April 8, 2026  
**Document Version**: 1.0  
**Architecture**: Microservices (Frontend PWA + Node.js API + Python AI Service)  
**Status**: System design complete, ready for Phase 4+ implementation

# 🎨 SYSTEM ARCHITECTURE DIAGRAMS

---

## 1️⃣ HIGH-LEVEL SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
├─────────┬──────────┬──────────┬──────────┬──────────┬───────────┤
│ Customer│ Customer │ Restaurant Restaurant  Admin   │ Support  │
│  Site   │  Mobile  │  Owner -  Owner -     Portal  │ Portal   │
│ (5173)  │ Via PWA  │ Ops Dash  Analytics   (5176)  │ (5177)   │
│         │          │ (5174)    (5175)      R:admin  │ Phase 2  │
│         │          │ R:owner   R:owner     Only     │          │
│ Any User│ Any User │ R:owner   R:owner             │          │
│         │          │           Only                 │          │
└─────────┴──────────┴──────────┴──────────┴──────────┴───────────┘
│                                                                  │
│                          ↓ ↓ ↓ ↓ (All HTTP + WebSocket)         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                API GATEWAY / LOAD BALANCER                      │
│              (Vite proxy dev / Cloud LB prod)                   │
└─────────────────────────────────────────────────────────────────┘
│                          ↓                                       │
├──────────────────────────────────────────────────────────────────┤
│                    MICROSERVICES LAYER                          │
├──────────────────────────┬──────────────────────────────────────┤
│   NODE.JS BACKEND API    │   PYTHON FASTAPI AI                  │
│   (Express.js)           │   (LangChain + Vertex AI)            │
│   Port: 5000             │   Port: 8000                         │
│                          │                                      │
│ • REST endpoints         │ • Intent Classifier (Gemini)         │
│ • JWT Auth               │ • Context Manager                    │
│ • WebSocket server       │ • Discovery Agent                    │
│ • Reservation mgmt       │ • Recommendation Agent               │
│ • Menu CRUD              │ • Reservation Agent                  │
│ • Analytics APIs         │ • Payment Agent                      │
│ • Admin endpoints        │ • Vector Search                      │
│ • Payment webhooks       │ • RAG + Embeddings                   │
│                          │                                      │
│ DB Clients:              │ Service Integrations:                │
│ • Firebase Admin         │ • Vertex AI LLM                     │
│ • Neo4j Driver           │ • Pinecone                           │
│ • Stripe SDK             │ • LlamaIndex                         │
└──────────────────────────┴──────────────────────────────────────┘
│                          ↓                                       │
├──────────────────────────────────────────────────────────────────┤
│                   PERSISTENCE LAYER                             │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│  FIRESTORE   │    NEO4J     │   MONGODB    │  VECTOR SEARCH   │
│  (Real-time) │   (Graph)    │   (Logs)     │  (Embeddings)    │
│              │              │              │                  │
│ ✓ Users      │ ✓ Prefs      │ ✓ Audit      │ ✓ Embeddings     │
│ ✓ Restau.    │ ✓ Ratings    │ ✓ Analytics  │ ✓ Semantic       │
│ ✓ Reserv.    │ ✓ Graphs     │ ✓ Events     │ ✓ NLP Search     │
│ ✓ Menus      │ ✓ Recommend. │              │                  │
│ ✓ Apps       │ ✓ Collab     │              │                  │
└──────────────┴──────────────┴──────────────┴──────────────────┘
│                          ↓                                       │
├──────────────────────────────────────────────────────────────────┤
│                  EXTERNAL SERVICES                              │
├──────────┬──────────────┬──────────────┬──────────────────────┤
│  Stripe  │ Vertex AI    │  Gmail API   │  Google Cloud        │
│  (Pay)   │ (LLM)        │  (Email)     │  (Storage, Run)      │
└──────────┴──────────────┴──────────────┴──────────────────────┘
```

---

## 2️⃣ USER ROLES & PORTAL ACCESS

```
┌──────────────────────────────────────────────────────────────┐
│                   USER ROLES MATRIX                          │
├──────────────┬───────────────┬────────────────────────────┤
│ ROLE         │ SIGNUP PATH   │ PORTALS ACCESSIBLE        │
├──────────────┼───────────────┼────────────────────────────┤
│              │               │                            │
│ CUSTOMER     │ Sign up with  │ ✅ Customer Portal         │
│ (Any user)   │ email or      │    • Search restaurants  │
│              │ Google OAuth  │    • Make reservations    │
│              │               │    • View bookings        │
│              │               │    • Chat with AI         │
│              │               │ ❌ Provider Portal        │
│              │               │ ❌ Admin Portal           │
│              │               │                            │
├──────────────┼───────────────┼────────────────────────────┤
│              │               │                            │
│ OWNER        │ Restaurant    │ ✅ Provider Portal         │
│ (Provider)   │ signup form   │    • Manage menu          │
│              │ + Application │    • Accept reservations  │
│              │ Email verify. │    • Configure tables     │
│              │ Admin approve │ ✅ Analytics Portal       │
│              │               │    • View revenue         │
│              │               │    • Customer insights    │
│              │               │    • Reports & export     │
│              │               │ ❌ Admin Portal           │
│              │               │                            │
├──────────────┼───────────────┼────────────────────────────┤
│              │               │                            │
│ ADMIN        │ Invite-only   │ ✅ Admin Portal            │
│ (Platform)   │ Email + 2FA   │    • User management      │
│              │ Verification  │    • Restaurant approval  │
│              │               │    • System settings      │
│              │               │    • Audit logs           │
│              │               │ ✅ Can view all data     │
│              │               │ ❌ Customer Portal        │
│              │               │ ❌ Provider Portal        │
│              │               │                            │
├──────────────┼───────────────┼────────────────────────────┤
│              │               │                            │
│ SUPPORT      │ Invite-only   │ ✅ Support Portal         │
│ (Phase 2)    │ Email         │    • Ticket management    │
│              │ Basic auth    │    • Customer messages    │
│              │               │    • Dispute resolution   │
│              │               │ (Coming in Phase 2)       │
│              │               │                            │
└──────────────┴───────────────┴────────────────────────────┘
```

---

## 3️⃣ AI AGENT ORCHESTRATION FLOW

```
                         INCOMING MESSAGE
                              ↓
                    ┌──────────────────────┐
                    │  [1] MESSAGE PARSER  │
                    │  • Normalize text    │
                    │  • Spell check       │
                    │  • Tokenize          │
                    └──────────────────────┘
                              ↓
                    ┌──────────────────────────────────┐
                    │  [2] INTENT CLASSIFIER AGENT     │
                    │  (Google Vertex AI Gemini)       │
                    │                                  │
                    │  Input: "book vegetarian Italian"│
                    │                                  │
                    │  Process:                        │
                    │  • Classify intent               │
                    │  • Extract entities              │
                    │  • Assign confidence             │
                    │                                  │
                    │  Output:                         │
                    │  {                               │
                    │    intent: "RESERVATION",        │
                    │    confidence: 0.92,             │
                    │    entities: {                   │
                    │      cuisine: "Italian",         │
                    │      dietary: "vegetarian",      │
                    │      partySize: 4                │
                    │    },                            │
                    │    requiredAgents: [             │
                    │      "DISCOVERY",                │
                    │      "RECOMMENDATION",           │
                    │      "RESERVATION"               │
                    │    ]                             │
                    │  }                               │
                    └──────────────────────────────────┘
                              ↓
                    ┌──────────────────────────────────┐
                    │  [3] CONTEXT MANAGER AGENT       │
                    │                                  │
                    │  Load:                           │
                    │  • User profile                  │
                    │  • Preferences                   │
                    │  • Conversation history          │
                    │  • Previous actions              │
                    │                                  │
                    │  Build ConversationContext       │
                    │  with full user & session info   │
                    └──────────────────────────────────┘
                              ↓
                    ┌──────────────────────────────────┐
                    │  [4] MASTER ORCHESTRATOR        │
                    │                                  │
                    │  Decides agent execution plan:   │
                    │  SERIAL vs PARALLEL              │
                    │                                  │
                    │  For "book vegetarian Italian": │
                    │    1. Run Discovery Agent        │
                    │       ↓                          │
                    │    2. Run Recommendation Agent   │
                    │       ↓                          │
                    │    3. Run Reservation Agent      │
                    └──────────────────────────────────┘
                              ↓
              ┌───────────────┬───────────────┬──────────────┐
              ↓               ↓               ↓              ↓
    ┌──────────────────┐ ┌──────────────────┐ ┌────────────┐
    │ [DISCOVERY AGENT]│ │[RECOMMEND AGENT] │ │[RESERV AG] │
    │ (if needed)      │ │ (if needed)      │ │ (if needed)│
    │                  │ │                  │ │            │
    │ Search Query:    │ │ Rank candidates: │ │ Book table:│
    │ Firestore        │ │ Neo4j            │ │ Create rec.│
    │ + Vector Search  │ │ + Vector Search  │ │ + Confirm  │
    │                  │ │                  │ │            │
    │ Output: [rest-1, │ │ Output: [rest-1, │ │Output:✅   │
    │           rest-2,│ │           rest-3,│ │Confirm Code│
    │           rest-3]│ │           rest-2]│ │ + Email    │
    └──────────────────┘ │ (sorted by score)│ └────────────┘
                         └──────────────────┘
              └───────────────┬───────────────┴──────────────┘
                              ↓
                    ┌──────────────────────────────────┐
                    │ [5] CONTEXT MANAGER - PERSIST    │
                    │                                  │
                    │ Save to:                         │
                    │ • Redis (cache, 24h TTL)         │
                    │ • Firestore (persistent history) │
                    │                                  │
                    │ Log:                             │
                    │ • Message received               │
                    │ • Intent classified              │
                    │ • Agents executed                │
                    │ • Actions taken                  │
                    └──────────────────────────────────┘
                              ↓
                    ┌──────────────────────────────────┐
                    │ [6] RESPONSE GENERATION          │
                    │ (Gemini LLM)                     │
                    │                                  │
                    │ Input: Aggregated agent results  │
                    │                                  │
                    │ Generate:                        │
                    │ • Natural language response      │
                    │ • Suggested next actions         │
                    │ • Confidence & explanation       │
                    │                                  │
                    │ Output:                          │
                    │ "Perfect! I've booked La Bella   │
                    │  Italia for 4 on April 8...      │
                    │  Confirmation: BELLE7F9X"        │
                    └──────────────────────────────────┘
                              ↓
                        SEND TO FRONTEND
```

---

## 4️⃣ RESERVATION WORKFLOW (Complete Journey)

```
CUSTOMER INITIATES                  SYSTEM PROCESSES                RESULTS
                                                                     
┌─────────────────┐         ┌──────────────────────┐     ┌──────────────┐
│ "Book Italian   │ ─HTTP→ │ Backend API receives │ ──→ │ Intent:      │
│  place for 4"   │        │ message & context    │     │ RESERVATION  │
└─────────────────┘        └──────────────────────┘     └──────────────┘
                                    ↓
                           ┌──────────────────────┐     
                           │ AI Service:          │     
                           │ 1. Classify intent   │     
                           │ 2. Load user context │     
                           └──────────────────────┘     
                                    ↓
                    ┌───────────────┬───────────────┐
                    ↓               ↓               ↓
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ DISCOVERY    │ │ RECOMMEND    │ │ RESERVATION  │
            │ AGENT        │ │ AGENT        │ │ AGENT        │
            │              │ │              │ │              │
            │ Query:       │ │ Rank by:     │ │ Check:       │
            │ Firestore    │ │ Neo4j graph  │ │ Table avail. │
            │ Italian + veg│ │ User history │ │ Create rec.  │
            │              │ │ Collab score │ │ Gen. code    │
            │ Result:      │ │ + Vector sim │ │ Send email   │
            │ [rest-1,     │ │              │ │ WebSocket    │
            │  rest-2,     │ │ Result:      │ │ notify       │
            │  rest-3]     │ │ [rest-1✓✓✓, │ │              │
            │              │ │  rest-5✓✓,  │ │ Result:      │
            │              │ │  rest-7✓]   │ │ ✅ Confirmed │
            └──────────────┘ └──────────────┘ └──────────────┘
                    └───────────────┬───────────────┘
                                    ↓
                          ┌──────────────────────┐
                          │ RESPONSE GENERATION  │
                          │ (Gemini LLM)         │
                          │                      │
                          │ "Perfect! I've       │
                          │  booked La Bella     │
                          │  Italia for 4...     │
                          │  Confirmation:      │
                          │  BELLE7F9X"          │
                          └──────────────────────┘
                                    ↓
                          ┌──────────────────────┐
                          │ CONTEXT SAVED        │
                          │ • Redis (cache)      │
                          │ • Firestore          │
                          │ • Action logged      │
                          └──────────────────────┘
                                    ↓
                          ←─HTTP 200 with results ←
                                    ↓
┌─────────────────────────────────────────────────────────┐
│ CUSTOMER SEES:                                          │
│ ✅ Confirmation code: BELLE7F9X                         │
│ 📍 Restaurant: La Bella Italia                          │
│ 📅 Date/Time: April 8, 7:00 PM                          │
│ 👥 Party: 4 guests                                      │
│ ⭐ Rating: 4.9 stars                                    │
│ [View Menu] [Add to Calendar] [Confirmed in Email]    │
└─────────────────────────────────────────────────────────┘
          ↑                                   
          └─────────── SIMULTANEOUSLY ───────→ 
                                               
OWNER RECEIVES IN PROVIDER PORTAL:
┌────────────────────────────────────────────┐
│ NEW RESERVATION NOTIFICATION               │
│ ┌────────────────────────────────────────┐ │
│ │ John Doe                              │ │
│ │ Party of 4                            │ │
│ │ April 8, 7:00 PM                      │ │
│ │ Conf: BELLE7F9X                       │ │
│ │                                        │ │
│ │ [✅ ACCEPT] [❌ REJECT] [⏸ HOLD]   │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ • Via WebSocket real-time notification    │
│ • Can also see in Reservations list       │
└────────────────────────────────────────────┘
```

---

## 5️⃣ AUTHENTICATION & AUTHORIZATION FLOW

```
┌──────────────────────────────────────────────────────────┐
│                AUTHENTICATION LAYER                      │
└──────────────────────────────────────────────────────────┘

SIGNUP FLOW (Customer):
═══════════════════════
Frontend               Backend API              Firebase Auth
│                      │                        │
├─→ Email, Password ──→ POST /auth/signup      │
│                      ├─ Validate input       │
│                      ├─ Check if exists      │
│                      │                       │
│                      ├────────────────────→  Create user
│                      │      Firebase Auth    │
│                      │←────────────────────┤ Return user ID
│                      ├─ Hash password       │
│                      ├─ Create Firestore    │
│                      │  user record          │
│                      │                       │
│                      ├─ Generate JWT         │
│←─ JWT Token ────────┤  token (1hr exp)      │
│                      ├─ Send email           │
│                      │  verification link    │
│                      └─────────────────────→ Email sent


SIGNIP FLOW (Restaurant Owner):
════════════════════════════════
Frontend               Backend API              Firebase Auth / Firestore
│                      │                        │
├─→ Email, Password +  │                        │
│   Restaurant info ──→ POST /auth/owner/signup │
│                      ├─ Validate input       │
│                      ├─ Create user          │
│                      │  (Firebase Auth)      │
│                      │                       │
│                      ├─ Create application   │
│                      │  in Firestore:        │
│                      │  {                    │
│                      │    status: "pending" │
│                      │    restaurantInfo:.. │
│                      │  }                    │
│                      │                       │
│                      ├─ Generate JWT         │
│←─ JWT Token ────────┤  (limited scope)      │
│                      │                       │
│                      ├─ Notify admin:        │
│                      │  "New restaurant app" │
│                      └───────────────────────┘


LOGIN FLOW (All users):
════════════════════════
Frontend               Backend API              Firebase Auth
│                      │                        │
├─→ Email, Password ──→ POST /auth/login       │
│                      ├─ Validate input       │
│                      │                       │
│                      ├────────────────────→  Verify password
│                      │   Firebase Auth       │
│                      │←────────────────────┤ Return user
│                      ├─ Load user role      │
│                      │  from Firestore      │
│                      ├─ Generate JWT         │
│←─ JWT Token ────────┤  (1hr exp, role)     │
│                      ├─ localStorage store   │
│                      └───────────────────────┘


AUTHORIZATION (Per Request):
═════════════════════════════
Frontend Request       Backend API              Firestore
│                      │                        │
├─→ GET /restaurants  │                        │
│   (JWT in header) ──→ authMiddleware         │
│                      ├─ Verify JWT sig.     │
│                      ├─ Check expiration    │
│                      ├─ Extract user ID     │
│                      │  & role              │
│                      ├─ Check role perms:   │
│                      │  {                   │
│                      │    "customer": [     │
│                      │      "search",       │
│                      │      "book",         │
│                      │      "view_own"      │
│                      │    ]                 │
│                      │  }                   │
│                      ├─ Allowed? YES        │
│                      │                       │
│                      ├─ Query Firestore ────→ Get restaurants
│                      │  (customer perms)    │
│                      │←────────────────────┤ Return filtered
│                      │                       │
│←─ Results ──────────┤ JSON response         │
│                      └───────────────────────┘
```

---

## 6️⃣ DATA PERSISTENCE ARCHITECTURE

```
┌────────────────────────────────────────────────────────────┐
│                  DATA MODELS                               │
└────────────────────────────────────────────────────────────┘

FIRESTORE Collections:
══════════════════════
users/
  └─ {userId}
     ├─ email
     ├─ name
     ├─ role: "customer" | "owner" | "admin"
     ├─ preferences
     │  ├─ cuisines: ["Italian", "Spanish"]
     │  ├─ dietary: ["vegetarian"]
     │  └─ budget: "$$"
     └─ metadata
        ├─ createdAt
        ├─ lastLogin
        └─ status: "active" | "suspended"

restaurants/
  └─ {restaurantId}
     ├─ name
     ├─ ownerId
     ├─ cuisine: ["Italian", "Pasta"]
     ├─ location
     │  ├─ address
     │  ├─ lat / lng
     │  └─ distance (indexed)
     ├─ tables/
     │  └─ {tableId}
     │     ├─ capacity
     │     ├─ available: true/false
     │     └─ reservedUntil
     ├─ menus/
     │  └─ {menuItemId}
     │     ├─ name
     │     ├─ price
     │     ├─ dietary: ["vegetarian"]
     │     └─ available: true
     ├─ status: "active" | "pending" | "closed"
     └─ approvalDate

reservations/
  └─ {reservationId}
     ├─ userId
     ├─ restaurantId
     ├─ date: "2026-04-08"
     ├─ time: "19:00"
     ├─ partySize
     ├─ tableId
     ├─ status: "pending" | "confirmed" | "completed" | "cancelled"
     ├─ confirmationCode
     ├─ createdAt
     ├─ modifiedAt
     └─ ownerNotes

restaurant_applications/
  └─ {applicationId}
     ├─ ownerId
     ├─ appStatus: "pending_review" | "approved" | "rejected"
     ├─ details: { restaurantInfo... }
     ├─ documents: { businessLicense, ownerId }
     ├─ review
     │  ├─ status
     │  ├─ reviewedBy (adminId)
     │  ├─ reviewedAt
     │  └─ notes
     └─ expiresAt

conversations/
  └─ {conversationId}
     ├─ userId
     ├─ messages: [
     │  {
     │    id,
     │    role: "user" | "assistant",
     │    content,
     │    intent,
     │    entities,
     │    timestamp
     │  }
     │ ]
     ├─ context: { userPrefs, history... }
     ├─ createdAt
     └─ lastMessageAt

NEO4J Graph Database:
═════════════════════
Nodes:
  • User (id, email, name)
  • Restaurant (id, name, cuisine)
  • Review (rating, text)
  • Cuisine (type)
  • Location (city, region)

Relationships:
  • (User)-[RATES {score}]->(Restaurant)
  • (User)-[PREFERS]->(Cuisine)
  • (User)-[VISITED]->(Restaurant)
  • (User)-[FRIENDS_WITH]->(User)
  • (Restaurant)-[IN_LOCATION]->(Location)
  • (Restaurant)-[SERVES {level}]->(Cuisine)

Queries:
  MATCH (u:User {id: "cust-123"})-[r:RATES]
   ->(rest:Restaurant)←-[r2:RATES]-(u2:User)
  WHERE u2 != u
  RETURN rest, AVG(r2.score) as score
  ORDER BY score DESC LIMIT 5

MONGODB Collections:
════════════════════
audit_logs:
  └─ {
       timestamp,
       userId,
       action: "RESERVATION_CREATED",
       entityType: "reservation",
       entityId: "res-123",
       changes: { from, to }
     }

analytics:
  └─ {
       date: "2026-04-08",
       restaurantId: "rest-1",
       metrics: {
         totalReservations: 12,
         totalRevenue: 4200.50,
         avgPartySize: 3.5,
         noShowRate: 0.08
       }
     }

VERTEX AI VECTOR SEARCH:
════════════════════════
Embeddings Index:
  • Vector dimension: 768 (Gemini embeddings)
  • Restaurant descriptions → vectors
  • Search query → vector → top-k nearest

Example:
  Query: "vegetarian italian pasta"
  → Vector: [0.12, 0.45, -0.23, ..., 0.78]
  → Search: Find top 5 similar restaurant vectors
  → Return: [rest-1, rest-3, rest-2, rest-5, rest-4]
```

---

## 7️⃣ DEPLOYMENT ARCHITECTURE (GCP)

```
┌─────────────────────────────────────────────────────────┐
│            PUBLIC INTERNET                              │
│         (Users accessing from browsers)                 │
└─────────────────────────────────────────────────────────┘
                        ↓ HTTPS
              ┌─────────────────────┐
              │   Cloud CDN +        │
              │  Cloud Load Balancer │
              │   (Auto scaling)     │
              └─────────────────────┘
                   ↓         ↓
              ┌──────────────────────┐
              │  Cloud Storage       │
              │  (Static assets)     │
              │  • index.html        │
              │  • JS/CSS/Images     │
              └──────────────────────┘
                   ↓         ↓
        ┌──────────────────────────────┐
        │  Cloud Run Services          │
        │  (Auto-scaling containers)   │
        ├──────────────┬───────────────┤
        │ Backend API  │ AI Service    │
        │ (Node.js)    │ (Python)      │
        │ 3x replicas  │ 2x replicas   │
        │ 512MB RAM    │ 2GB RAM       │
        └──────────────┴───────────────┘
                 ↓         ↓
        ┌──────────────────────────────┐
        │  Cloud SQL / Firestore       │
        │  • Firestore                 │
        │  • Transactions              │
        │  • Real-time sync            │
        └──────────────────────────────┘
                 ↓
        ┌──────────────────────────────┐
        │ Cloud Databases              │
        ├──────────────┬───────────────┤
        │  Neo4j Aura  │ MongoDB Atlas │
        │  (Graph DB)  │ (Logs/History)│
        │  (Managed)   │ (Managed)     │
        └──────────────┴───────────────┘
                 ↓
        ┌──────────────────────────────┐
        │ Vertex AI Vector Search      │
        │ • Embeddings index           │
        │ • Semantic search            │
        └──────────────────────────────┘
                 ↓
        ┌──────────────────────────────┐
        │ External Services            │
        ├──────────────┬───────────────┤
        │ Stripe API   │ Gemini API    │
        │ (Payments)   │ (LLM)         │
        └──────────────┴───────────────┘
```

---

**Architecture Complete ✅**  
**Version**: 1.0  
**Last Updated**: April 8, 2026

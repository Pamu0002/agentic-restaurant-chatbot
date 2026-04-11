# 📚 QUICK REFERENCE GUIDE

---

## 🎯 ALL USERS AT A GLANCE

| User Type | Portal | Port | Key Actions | Data Access | Auth |
|-----------|--------|------|----------|----------|------|
| **Customer** | Customer Portal | 5173 | • Search <br> • Book <br> • Rate <br> • Chat AI | Own profile, saved <br> reservations, history | Email/Google OAuth |
| **Restaurant Owner** | Provider Portal | 5174 | • Manage menu <br> • Accept reservations <br> • Configure tables <br> • View bookings | Own restaurant data <br> Own customer info | Email + password |
| **Owner** | Analytics Portal | 5175 | • Revenue reports <br> • Customer insights <br> • Performance metrics <br> • Export data | Own restaurant <br> analytics | Same as Provider |
| **Admin** | Admin Portal | 5176 | • Review applications <br> • Manage users <br> • System settings <br> • Audit logs | All platform data | Email + 2FA |
| **Support** | Support Portal | 5177 | • Manage tickets <br> • Resolve disputes <br> • Content moderation | Customer tickets, <br> messages | Invite-only (Phase 2) |

---

## 🔄 COMPLETE USER JOURNEYS (5 Main Flows)

### **Flow 1: Customer Restaurant Discovery**
```
Customer Opens App
  ↓
(NOT LOGGED IN?) → Sign Up / Google OAuth
  ↓
(LOGGED IN) → Customer Portal Dashboard
  ↓
Search Italian Restaurants
  ↓
Intent: SEARCH → AI Service
  ↓
Discovery Agent: Query Firestore + Neo4j
  ↓
Display 3 restaurants with options
  ↓
Customer sees [Details] [Book Now] buttons
```

### **Flow 2: Reservation (Multi-Agent)**
```
"Book vegetarian Italian place for 4"
  ↓
Intent: RESERVATION (confidence 0.92)
  ↓
Parallel Agents:
  Discovery → Find restaurants
  Recommendation → Rank by user history
  Reservation → Check availability & book
  ↓
Confirmation code issued (BELLE7F9X)
  ↓
Owner gets WebSocket notification
  ↓
Confirmation email to customer
```

### **Flow 3: Owner Accepts Reservation**
```
Provider Dashboard
  ↓
[Reservations] Tab
  ↓
New pending reservation card appears
  ↓
Owner reviews: John Doe, party of 4, 7:00 PM
  ↓
Click [✅ ACCEPT]
  ↓
Backend updates Firestore status → "confirmed"
  ↓
WebSocket notifies customer
  ↓
Customer receives confirmation email
```

### **Flow 4: New Restaurant Application**
```
Owner signs up: Restaurant name + details
  ↓
Application stored: status = "pending_review"
  ↓
Admin notified via email & WebSocket
  ↓
Admin Portal → Approvals section
  ↓
Admin verifies: License, location, documents
  ↓
Click [✅ APPROVE]
  ↓
Restaurant created in active database
  ↓
Owner notified: Can now accept reservations
```

### **Flow 5: Revenue Analytics**
```
Owner logs into Analytics Portal
  ↓
Dashboard shows:
  • $4,200 revenue today
  • 12 reservations
  • 4.8★ average rating
  ↓
Click [Revenue Breakdown]
  ↓
Charts show:
  • Time-series data (daily/weekly/monthly)
  • Revenue by cuisine type
  • Customer demographics
  ↓
[Download CSV] → Export report
```

---

## 🛠️ SYSTEM COMPONENTS AT A GLANCE

| Layer | Technology | Port | Purpose | Deployed On |
|-------|-----------|------|---------|------------|
| **Frontend** | React 18 + Vite | 5173-5177 | 5 portals (PWA) | Cloud Storage + CDN |
| **Backend API** | Node.js + Express | 5000 | REST API, WebSocket | Cloud Run |
| **Backend AI** | Python + FastAPI | 8000 | Agents, LLMs, vectors | Cloud Run |
| **Database** | Firestore | - | Real-time user data | GCP Firestore |
| **Graph DB** | Neo4j Aura | - | Recommendations | Neo4j Cloud |
| **Structured** | MongoDB Atlas | - | Logs, analytics | MongoDB Cloud |
| **Vectors** | Vertex AI Vector Search | - | Embeddings, search | GCP |
| **LLM** | Vertex AI Gemini | - | Intent, responses | GCP |
| **Fallback LLM** | OpenAI GPT-4 | - | Backup model | OpenAI |
| **Payments** | Stripe | - | Transactions | Stripe |

---

## 📊 DATA FLOW SUMMARY

### **HTTP Request → Response**
```
Frontend (React)
  ↓ HTTP POST /api/chat/message
Backend API (Node.js)
  ↓ Route to AI Service
AI Service (Python)
  ↓ Intent Classifier → Agents → Response
[Query Databases]
  ↓ Firestore, Neo4j, MongoDB, Vector Search
  ↓
Response formatted → JSON
  ↓ HTTP 200
Frontend displays results
```

### **Real-Time Updates (WebSocket)**
```
Event: New Reservation → Backend
  ↓ Socket.emit('new_reservation', data)
All connected Owner clients
  ↓ Receive notification immediately
  ↓ Update UI (new card appears)
```

### **Async Jobs (Pub/Sub)**
```
Action completed: Reservation created
  ↓ Publish to Cloud Pub/Sub
Workers subscribe:
  • Send confirmation email
  • Generate invoice
  • Update analytics
  • Prepare report
```

---

## 🔐 SECURITY & PERMISSIONS

### **Role-Based Access Control (RBAC)**

```typescript
// Permissions Example
const permissions = {
  customer: {
    // Read own data only
    restaurants: ["search", "view"],
    reservations: ["create", "view_own", "modify_own", "cancel_own"],
    profile: ["view_own", "edit_own"]
  },
  owner: {
    // Full control of restaurant
    restaurants: ["view_own", "edit_own", "delete_own"],
    reservations: ["view_own", "accept", "reject", "modify"],
    menus: ["create", "edit", "delete"],
    analytics: ["view_own"],
    tables: ["configure", "manage"]
  },
  admin: {
    // Full system access
    users: ["view_all", "edit_all", "suspend"],
    restaurants: ["view_all", "approve", "reject", "delete"],
    reservations: ["view_all"],
    system: ["settings", "logs", "reports"]
  }
};
```

### **Authentication Methods**

| User Type | Method | 2FA | Session Duration |
|-----------|--------|-----|-----------------|
| Customer | Email/OAuth | No | 7 days (refresh) |
| Owner | Email + password | No | 7 days (refresh) |
| Admin | Email + password | ✅ Yes (TOTP) | 4 hours |
| Support | Email + password | No | 24 hours |

---

## 📱 FRONTEND ARCHITECTURE

### **Shared Components (All Portals)**

```typescript
// Shared code (single source of truth)
packages/@restaurant/shared/
  src/
    services/
      │── firebaseService.ts    // DB access
      │── authService.ts        // Auth logic
      └── apiClient.ts          // API calls
    contexts/
      │── AuthContext.tsx       // User auth state
      └── ThemeContext.tsx      // Theming
    types/
      │── auth.ts              // User, Auth types
      │── restaurant.ts        // Restaurant types
      └── reservation.ts       // Reservation types
    hooks/
      │── useAuth.ts           // Auth hook
      │── useAPI.ts            // API calls
      └── useLocalStorage.ts   // Persistence

// Portal-specific code
packages/@restaurant/customer-web/
  src/
    components/
      │── ChatInterface.tsx     // AI chat
      │── SearchBar.tsx         // Restaurant search
      └── RestaurantCard.tsx    // Restaurant display
    pages/
      │── HomePage.tsx
      │── SearchPage.tsx
      └── ReservationPage.tsx

packages/@restaurant/provider-web/
  src/
    components/
      │── ReservationList.tsx
      │── MenuEditor.tsx
      └── TableManager.tsx
    pages/
      │── DashboardPage.tsx
      └── SettingsPage.tsx

packages/@restaurant/provider-analytics/
  src/
    components/
      │── RevenuChart.tsx
      │── CustomerInsights.tsx
      └── ReportExporter.tsx
```

### **State Management**

```typescript
// TanStack Query (server state)
const { data: restaurants, isLoading } = useQuery({
  queryKey: ['restaurants', location, cuisine],
  queryFn: () => api.searchRestaurants(...)
});

// Zustand (client state)
const userStore = create(state => ({
  user: null,
  setUser: (user) => state.user = user,
  login: async (email, password) => { ... }
}));

// Context (auth & theme)
<AuthProvider>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</AuthProvider>
```

---

## ⚙️ AGENT SYSTEM DETAILS

### **Core Agents**

| Agent | Input | Process | Output | LLM |
|-------|-------|---------|--------|-----|
| **Intent Classifier** | Raw message | Analyze intent + entities | {intent, entities, confidence} | Gemini |
| **Context Manager** | Session data | Load user context + history | ConversationContext | None |
| **Orchestrator** | Classified intent | Route to domain agents | Agent execution plan | None |

### **Domain Agents**

| Agent | Trigger | Query | Database | Output |
|-------|---------|-------|----------|--------|
| **Discovery** | intent=SEARCH | Filter restaurants | Firestore + Vector | [restaurant list] |
| **Recommendation** | intent=RECOMMEND | Collaborative filtering | Neo4j | [ranked restaurants] |
| **Reservation** | intent=RESERVE | Check availability | Firestore | Confirmation code |
| **Payment** | intent=PAY | Process transaction | Stripe | Receipt |

### **Intent Examples**

```
User Input                          → Detected Intent
─────────────────────────────────  ┬─────────────────
"Find Italian restaurants"          → SEARCH
"Show me vegetarian options"        → SEARCH
"I want to book a table"            → RESERVE
"Book Italian for 4 at 7pm"         → RESERVE
"What's the most popular?"          → RECOMMEND
"Cancel my reservation"             → CANCEL
"What are your hours?"              → HELP
"Good morning!"                     → SMALL_TALK
```

---

## 📈 KEY METRICS & KPIs

### **Customer Metrics**
- Searches per session
- Booking conversion rate
- Average party size
- Reservation completion rate
- Customer lifetime value

### **Owner Metrics**
- Reservation acceptance rate
- No-show rate
- Average revenue per reservation
- Peak hours analysis
- Menu item popularity
- Customer repeat rate

### **Platform Metrics**
- User signups (daily/weekly)
- Restaurant approvals (pending/approved)
- Total reservations (daily/weekly)
- Payment success rate
- System uptime (SLA: 99.9%)
- Average response time (<500ms)

---

## 🚀 DEPLOYMENT CHECKLIST

### **Before Going to Production**

**Frontend**
- [ ] All portals tested on mobile/tablet/desktop
- [ ] Responsive design verified
- [ ] PWA functionality working (offline support)
- [ ] Error handling & fallbacks
- [ ] Loading states & animations
- [ ] Accessibility (WCAG 2.1 AA)

**Backend API**
- [ ] All endpoints tested (Jest + Supertest)
- [ ] Rate limiting configured
- [ ] CORS properly scoped
- [ ] Error responses standardized
- [ ] Logging configured
- [ ] Database indexes optimized

**AI Service**
- [ ] Intent classifier accuracy >90%
- [ ] Agent latency <2 seconds
- [ ] Fallback LLM tested
- [ ] Vector search top-k working
- [ ] Error handling for API failures
- [ ] Concurrency tested (10+ parallel requests)

**Databases**
- [ ] Firestore indexes created
- [ ] Neo4j constraints configured
- [ ] MongoDB sharding ready
- [ ] Backup & recovery tested
- [ ] Data retention policies set

**Security**
- [ ] SSL/TLS certificates valid
- [ ] Database credentials in Secret Manager
- [ ] API keys rotated
- [ ] OWASP Top 10 checked
- [ ] Penetration testing done
- [ ] Data privacy compliance (GDPR, CCPA)

**Infrastructure**
- [ ] Cloud Run auto-scaling configured
- [ ] Cloud CDN caching rules set
- [ ] Load balancer health checks passing
- [ ] Monitoring & alerting active
- [ ] Disaster recovery plan documented
- [ ] Cost optimization reviewed

---

## 🐛 TROUBLESHOOTING QUICK GUIDE

| Problem | Symptoms | Root Cause | Solution |
|---------|----------|-----------|----------|
| API not responding | 503 Service Unavailable | Cloud Run replica crash | Check logs in Cloud Logging |
| Slow searches | >5s response time | DB query timeout | Add Firestore indexes |
| AI not responding | Timeout after 30s | Python service error | Check FastAPI logs |
| Reservations failing | "Table unavailable" | Race condition on table status | Implement transaction locks |
| WebSocket disconnected | Real-time updates stop | Network issue or server error | Implement auto-reconnect |
| Payment declined | Stripe error message | Invalid card or rate limit | Check Stripe dashboard |
| JWT expired | "Unauthorized" | Token >1 hour old | Use refresh token endpoint |
| High latency | >2s response time | Cold start on serverless | Warm up with scheduled pings |

---

## 📚 DOCUMENTATION FILES

| File | Purpose | Audience |
|------|---------|----------|
| **COMPLETE_SYSTEM_WORKFLOW.md** | Full system overview with all workflows | Everyone |
| **ARCHITECTURE_DIAGRAMS.md** | Visual system architecture | Architects, Leads |
| **QUICKSTART.md** | 5-minute setup guide | New developers |
| **DEVELOPMENT_METHODOLOGY.md** | TDD + Git practices | Developers |
| **FEATURE_DEVELOPMENT_PATTERNS.md** | Reusable code patterns | Developers |
| **DEV_PLAN_INDUSTRY_STANDARD.md** | 8-phase testing plan | QA, Leads |
| **API_INTEGRATION_GUIDE.md** | Backend API documentation | Backend developers |
| **MULTI_PORTAL_ARCHITECTURE.md** | Portal-specific architecture | Frontend developers |

---

## 🎓 LEARNING PATH FOR NEW DEVELOPERS

### **Week 1: Understanding**
1. Read: COMPLETE_SYSTEM_WORKFLOW.md
2. Read: ARCHITECTURE_DIAGRAMS.md
3. Explore: Portal code structure
4. Run: QUICKSTART.md

### **Week 2: Backend Development**
1. Read: API_INTEGRATION_GUIDE.md
2. Study: Express routes & controllers
3. Study: Firebase Firestore queries
4. Run tests: Jest tests locally

### **Week 3: Frontend Development**
1. Read: MULTI_PORTAL_ARCHITECTURE.md
2. Study: React components & routing
3. Study: TanStack Query usage
4. Run portal locally: `pnpm -F @restaurant/customer-web dev`

### **Week 4: AI & Agents**
1. Read: FEATURE_DEVELOPMENT_PATTERNS.md
2. Study: AI agent architecture
3. Study: LangChain orchestration
4. Run AI service: `python -m uvicorn app.main:app`

### **Week 5: Testing**
1. Read: DEV_PLAN_INDUSTRY_STANDARD.md
2. Write: Unit tests for your feature
3. Write: Integration tests
4. Run full test suite

### **Week 6: Deployment**
1. Set up GCP account
2. Configure Cloud Run
3. Set up CI/CD (GitHub Actions)
4. Deploy to staging → production

---

**Total Documentation**: 8 comprehensive guides  
**Estimated Read Time**: 4-6 hours  
**Implementation Ready**: Yes ✅  
**Status**: Production-ready architecture


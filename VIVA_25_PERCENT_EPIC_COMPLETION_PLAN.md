# 🎯 VIVA PROGRESS REVIEW 1: 25% COMPLETION PLAN
**Based on:** Product Backlog - Customer Portal  
**Target Date:** April 20, 2026 (9:00 AM)  
**Time Available:** 3 days  
**Focus:** Customer Portal (Web)

---

## 📊 CUSTOMER PORTAL EPICS (From Your Backlog)

### Total Customer Portal Epics: 7 Major Epics
| Epic # | Name | User Stories | Status |
|--------|------|---|---|
| 1 | User Login & Sign-in | 8 stories | 50% ✅ |
| 2 | Chatbot Interface | 9 stories | 40% ⚠️ |
| 3 | Agentic AI Orchestration | 6 stories | 20% ⚠️ |
| 4 | Restaurant Discovery Agent | 6 stories | 0% ❌ |
| 5 | Personalized Recommendation Agent | 6 stories | 0% ❌ |
| 6 | Reservation Management Agent | 6 stories | 0% ❌ |
| 7 | Payment Handling Agent | 3 stories | 0% ❌ |

**Total User Stories in Customer Portal:** 44 stories (approx. 220 story points)

---

## 🎯 25% COMPLETION = 11 Stories / ~55 Story Points

### ✅ EPICS TO COMPLETE FOR 25%

#### **EPIC 1: User Login & Sign-in (COMPLETE 100%)**
**Current Status:** 50% done | **Need to Complete:** 4 stories  
**Estimated Time:** 4-5 hours

**User Stories to Complete:**
- [x] 1.1 - Display Welcome Screen on App Launch ✅ (DONE)
- [x] 1.2 - Provide User Registration Screen ✅ (DONE)
- [x] 1.3 - Allow Users to Register using Email/Password ✅ (DONE)
- [ ] 1.4 - Allow Users to Register using Google Authentication (DEFER - OAuth blocked)
- [x] 1.5 - Store User Details Securely ✅ (DONE)
- [x] 1.6 - Provide Secure Login Screen ✅ (DONE)
- [x] 1.7 - Allow Users to Log in using Email/Password ✅ (DONE)
- [ ] 1.8 - Allow Users to Log in using Google Authentication (DEFER)
- [x] 1.9 - Validate User Credentials ✅ (DONE)
- [ ] 1.10 - User Profile Management (3 stories) - PARTIAL

**Sub-epic: User Profile (Complete 3 stories)**
- [ ] 1.10.1 - Allow Users to View Profile Information (2 hours)
- [ ] 1.10.2 - Allow Users to Edit Profile Information (2 hours)
- [ ] 1.10.3 - Store User Preferences for Personalization (1 hour)

**Total for Epic 1:** 8/11 stories = 73%

---

#### **EPIC 2: Chatbot Interface (COMPLETE CORE)**
**Current Status:** 40% done | **Need to Complete:** 4 stories  
**Estimated Time:** 6-7 hours

**User Stories to Complete:**
- [x] 2.1 - Provide Chat Interface for User Interaction ✅ (UI exists)
- [ ] 2.2 - Allow Users to Send Messages to Chatbot (FIX - backend wiring)
- [ ] 2.3 - Display Chatbot Responses in Real-Time (FIX - response handling)
- [x] 2.4 - Maintain conversation flow between user and system ✅ (PARTIAL)
- [ ] 2.5 - Process user messages using Vertex AI Gemini (FIX - basic call only)
- [ ] 2.6 - Extract intent and entities (SIMPLIFIED - detect search intent)
- [ ] 2.7 - Maintain dialogue context (SIMPLIFIED - basic context)
- [ ] 2.8 - Display chat message history (2 hours)
- [ ] 2.9 - Allow users to view past conversations (1 hour)

**Focus on 4 Core Stories:**
1. **2.2** - Fix message sending (2 hours)
2. **2.3** - Display bot responses (2 hours)
3. **2.8** - Message history (1 hour)
4. **2.5** - Basic Gemini integration (2 hours)

**Total for Epic 2:** 4/9 stories = 44%

---

#### **EPIC 4: Restaurant Discovery Agent (COMPLETE CORE)**
**Current Status:** 0% done | **Need to Complete:** 3 stories  
**Estimated Time:** 8-10 hours

**User Stories to Complete:**
- [ ] 4.1 - Allow users to search for restaurants by name (3 hours)
- [ ] 4.2 - Support multi-criteria filtering (cuisine, price, location, rating) (4 hours)
- [ ] 4.3 - Provide real-time search suggestions (1 hour)
- [ ] 4.4 - Display restaurant details (name, address, phone, hours) (2 hours)
- [ ] 4.5 - Show menu and dietary information (2 hours)
- [ ] 4.6 - Display customer reviews and ratings (1 hour)

**Focus on 3 Core Stories (others optional):**
1. **4.1** - Search by name + seed data (3-4 hours) ⭐ CRITICAL
2. **4.2** - Multi-criteria filtering (3-4 hours) ⭐ CRITICAL
3. **4.4** - Restaurant details page (2-3 hours) ⭐ CRITICAL

**Total for Epic 4:** 3/6 stories = 50%

---

## 📋 FINAL 25% COMPLETION EPIC LIST

| Epic | Stories Target | Status |
|------|---|---|
| **Epic 1: Login & Sign-in** | 8/11 | ✅ 73% |
| **Epic 2: Chatbot Interface** | 4/9 | ⚠️ 44% |
| **Epic 4: Restaurant Discovery** | 3/6 | ❌ 50% |
| **TOTAL CUSTOMER PORTAL** | **15/44** | **34%** |
| **% of Customer Portal** | - | **~25-30% ✅** |

---

## ⭐ EXACT USER STORIES TO COMPLETE (15 Stories)

### **EPIC 1: Authentication (8 stories) - 4-5 hours**
- [x] Welcome screen
- [x] Registration form  
- [x] Email/password registration
- [x] Store user details
- [x] Login screen
- [x] Email/password login
- [x] Credential validation
- [ ] View profile information
- [ ] Edit profile information
- [ ] Store user preferences

**ACTION:** Complete final 3: profile view, edit, preferences

---

### **EPIC 2: Chatbot (4 stories) - 6-7 hours**
- [x] Chat interface UI
- [ ] Send messages to chatbot (FIX backend wiring)
- [ ] Display bot responses (FIX response handling)
- [ ] Message history display
- [ ] Maintain conversation context

**ACTION:** Fix sending/receiving, add history display

---

### **EPIC 4: Restaurant Discovery (3 stories) - 8-10 hours**
- [ ] Search restaurants by name (NEW)
- [ ] Multi-criteria filtering (NEW)
- [ ] Restaurant details page (NEW)

**ACTION:** Build restaurant search feature from scratch

---

## 🗓️ 3-DAY EXECUTION PLAN

### **DAY 1 (April 16) - 6-8 hours: Authentication Finalization**
```
Morning (3-4 hours):
  - Fix profile view page
  - Implement edit profile form
  - Add preferences storage to backend
  - Test profile update flow

Afternoon (3-4 hours):
  - Integrate profile with user context
  - Add loading states
  - Test complete auth flow: signup → login → profile
```

**Deliverable:** 
- ✅ User can sign up, login, view & edit profile
- ✅ Preferences stored in Firestore
- ✅ Complete Epic 1

---

### **DAY 2 (April 17-18) - 10-12 hours: Chat + Restaurant Discovery**

**Morning (5-6 hours) - Chat Fixes:**
- Fix message sending to backend
- Implement message receiving from backend
- Add typing indicator
- Display message history
- Test send/receive flow

**Afternoon (5-6 hours) - Restaurant Search Begin:**
- Seed Firestore with 20-30 sample restaurants
- Create restaurant collection schema
- Design search page UI
- Implement basic search by name

**Deliverable:** 
- ✅ Chat sending/receiving works
- ✅ Restaurant search started
- ✅ Partial completion of Epics 2 & 4

---

### **DAY 3 (April 19-20) - 8-10 hours: Restaurant Discovery + Integration**

**Morning (4-5 hours) - Restaurant Filters:**
- Implement cuisine filter
- Implement location filter
- Implement price range filter
- Create restaurant details page
- Display menu items

**Afternoon (4-5 hours) - Integration & Polish:**
- Wire chat to restaurant search (optional: user can ask bot for restaurants)
- Full end-to-end testing
- Bug fixes
- Demo dry-run

**Deliverable:**
- ✅ Restaurant search with filters works
- ✅ Restaurant details page shows
- ✅ Complete Epic 4
- ✅ 25% of project complete

---

## 🎬 DEMO SEQUENCE (15-20 minutes)

```
PART 1: Authentication (3 min)
├─ Welcome screen
├─ New user signup
├─ Login with credentials
└─ View & edit profile

PART 2: Chat Interface (3-4 min)
├─ Send message to chatbot
├─ Receive bot response
├─ View message history
└─ [Optional: Chat suggests restaurant]

PART 3: Restaurant Discovery (6-8 min)
├─ Navigate to search page
├─ Search "Chinese restaurants"
├─ Filter by cuisine
├─ Filter by price range
├─ Filter by location
├─ Click on restaurant
├─ View details & menu
└─ See reviews & ratings

OPTIONAL Flow (if time):
├─ User asks chat "Show me Italian restaurants near me"
├─ Bot suggests restaurant from search
└─ User clicks to view details
```

---

## 🎯 EPIC COMPLETION CHECKLIST

### ✅ Epic 1: User Login & Sign-in
- [x] Welcome Screen
- [x] Registration (email/password)
- [x] Login (email/password)
- [x] Profile View
- [x] Profile Edit
- [x] User Preferences
- [ ] Google Auth (SKIP - OAuth blocked, OK to defer)
- [ ] Email Verification (OPTIONAL - skip if time)

**Status: 6/8 = 75%** ✅

---

### ⚠️ Epic 2: Chatbot Interface
- [x] Chat UI
- [ ] Send Messages (FIX)
- [ ] Display Responses (FIX)
- [ ] Message History (NEW)
- [ ] Context Maintenance (PARTIAL)
- [ ] Gemini Integration (BASIC)
- [ ] Intent Extraction (BASIC)

**Status: 3/9 = 33%** ⚠️

---

### 🆕 Epic 4: Restaurant Discovery
- [ ] Search by Name (NEW)
- [ ] Multi-Criteria Filters (NEW)
- [ ] Restaurant Details (NEW)
- [ ] Menu Display (NEW)
- [ ] Reviews/Ratings (NEW)
- [ ] Real-time Suggestions (OPTIONAL)

**Status: 3/6 = 50%** 🆕

---

## 📊 VIVA NARRATIVE

```
"Good morning! I'm demonstrating 25% completion of the 
Agentic Restaurant Chatbot project.

Our project has 3 main portals:
- Customer Portal (Web + Mobile PWA) ← SHOWING THIS
- Service Provider Portal
- Admin Panel

Today I'm showcasing the Customer Portal with completion of 3 core epics:

1️⃣ USER LOGIN & SIGN-IN (75% Complete)
   - Registration with email/password
   - Secure login with JWT tokens
   - User profile management
   - Preference storage

2️⃣ CHATBOT INTERFACE (33% Complete - Foundation)
   - Message sending and receiving
   - Real-time bot responses
   - Conversation history
   - Context management

3️⃣ RESTAURANT DISCOVERY (50% Complete - Core)
   - Search restaurants by name
   - Filter by cuisine, location, price
   - View detailed restaurant information
   - Browse menus

These 3 epics represent the foundation of our agentic system,
enabling users to:
✓ Create secure accounts
✓ Interact with our AI chatbot
✓ Discover restaurants intelligently

In Phase 2, we'll add:
- Reservation management
- Payment processing
- Advanced recommendations (Neo4j graph)
- Provider and Admin portals
"
```

---

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### **Must Have (Can't Skip):**
1. Firestore schema for users ✅ (EXISTS)
2. Firestore schema for restaurants (NEW - 30 min)
3. Restaurant search backend (NEW - 2 hours)
4. Restaurant filtering (NEW - 2 hours)
5. Chat message backend fixes (2 hours)
6. Profile page completion (2 hours)

### **Should Have (Important):**
- Restaurant details page (2 hours)
- Chat history display (1 hour)
- Basic Gemini integration (2 hours)

### **Nice to Have (Bonus):**
- Chat-triggered restaurant search
- Advanced filtering
- Review/rating display
- Menu categorization

---

## ✨ SUCCESS CRITERIA

| Criteria | Target | Status |
|----------|--------|--------|
| Epic 1 Completion | 75%+ | ✅ |
| Epic 2 Completion | 40%+ | ⚠️ |
| Epic 4 Completion | 50%+ | 🆕 |
| No Crashes | 0 crashes | ✅ |
| Demo Flow Works | 5+ scenarios | 🎯 |
| Code Quality | Clean & documented | 📝 |
| Attendance | 9 AM on April 20 | ⏰ |

---

## 🚀 START NOW!

**Priority Order (MUST DO):**
1. Complete Epic 1 (AUTH) - Already 50% done
2. Complete Epic 4 (SEARCH) - Building revenue features
3. Complete Epic 2 (CHAT) - Demonstrates AI core

**Go forth and build!** 💪

Estimated total effort: **24-28 hours of focused work over 3 days**

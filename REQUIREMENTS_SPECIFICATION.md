# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Agentic Restaurant Chatbot Platform

**Document Version:** 1.0  
**Date:** April 2026  
**Project:** Agentic Restaurant Chatbot - Multi-Portal System  
**Status:** In Development

---

## 1. EXECUTIVE SUMMARY

The Agentic Restaurant Chatbot is an intelligent conversational platform enabling customers to discover restaurants, check availability, make reservations, and process payments through natural language interaction. The system comprises three main portals: Customer Portal, Service Provider Portal, and Admin Panel, all powered by advanced AI agents and real-time data management.

---

## 2. DOCUMENT OBJECTIVES

This SRS defines:
- **Primary functional requirements** for each portal
- **Non-functional quality attributes** and constraints
- **System scope** and stakeholder expectations
- **Technical and business requirements**

---

---

# 📋 PART I: FUNCTIONAL REQUIREMENTS

## Overview
The system comprises **10 primary functional requirements** aligned with business capabilities:

---

## FR1: RESTAURANT DISCOVERY VIA CHATBOT
**Module:** Customer Portal | **Priority:** 🔴 CRITICAL | **Complexity:** HIGH

### Description
Users interact with an AI chatbot using natural language to discover restaurants based on specific preferences and needs.

### Key Capabilities
- **Natural Language Search**: Accept conversational queries about restaurant preferences
- **Multi-Criteria Discovery**: Support filtering by cuisine, location, price range, ratings, dietary restrictions
- **Real-Time Results**: Return relevant restaurant suggestions with availability status
- **Context Awareness**: Understand and maintain context across multiple conversation turns
- **Recommendation Engine**: Suggest restaurants based on user history and preferences

### Acceptance Criteria
- [ ] User can type "Find Italian restaurants near me"
- [ ] System returns filtered results < 1 second
- [ ] Results include restaurant name, location, ratings, availability
- [ ] System maintains conversation context across 5+ turns
- [ ] Mobile responsive design

### Data Dependencies
- Restaurant Firestore collection
- User preferences stored in Firestore
- Neo4j knowledge graph for context

---

## FR2: CONVERSATIONAL USER INTERACTION MANAGEMENT
**Module:** Customer Portal & All Portals | **Priority:** 🔴 CRITICAL | **Complexity:** MEDIUM

### Description
Comprehensive chat interface enabling bidirectional communication between users and AI agents with full conversation lifecycle management.

### Key Capabilities
- **Message Display & Format**: Show user and bot messages in distinct conversation bubbles
- **Real-Time Messaging**: Send and receive messages with WebSocket support
- **Typing Indicators**: Display "bot is typing" feedback during processing
- **Conversation History**: Store and retrieve all messages indefinitely
- **Context Maintenance**: Pass conversation state between agents and turns
- **Error Recovery**: Graceful handling of network failures and timeouts

### Acceptance Criteria
- [ ] User can send text message and receive response
- [ ] Messages display with timestamps and sender identification
- [ ] Typing indicator shows within 200ms of request
- [ ] Message history loads automatically on login
- [ ] Maximum message length enforced (500 chars)
- [ ] Chat interface responsive on all devices

### Data Dependencies
- Firestore messages collection
- User session context
- Conversation state management

---

## FR3: DYNAMIC RESTAURANT INFORMATION MANAGEMENT
**Module:** Customer Portal & Provider Portal | **Priority:** 🔴 CRITICAL | **Complexity:** MEDIUM

### Description
Comprehensive restaurant profile management with real-time menu, availability, and metadata updates from providers.

### Key Capabilities
- **Restaurant Profiles**: Display complete restaurant info (name, address, hours, contact)
- **Dynamic Menus**: Show up-to-date menu items with pricing and dietary information
- **Gallery Management**: Display restaurant photos and branding
- **Business Hours**: Display opening/closing times with special hours
- **Cuisine Classification**: Multi-category cuisine tagging
- **Promotional Information**: Show current offers and special deals

### Acceptance Criteria
- [ ] Restaurant details page loads < 1 second
- [ ] Menu items include price, description, dietary tags
- [ ] Restaurant hours display with timezone support
- [ ] Images cache optimally for mobile (< 200KB per image)
- [ ] Provider can update menu items within 2 minutes
- [ ] Customer sees updates within 5 minutes

### Data Dependencies
- Firestore restaurants collection
- Firestore menus subcollection
- Cloud Storage for images/gallery

---

## FR4: REAL-TIME TABLE AVAILABILITY TRACKING
**Module:** Customer Portal & Provider Portal | **Priority:** 🔴 CRITICAL | **Complexity:** HIGH

### Description
Real-time synchronization of table availability status across provider systems and customer-facing interfaces.

### Key Capabilities
- **Live Availability**: Query restaurant table status by date, time, party size
- **Time Slot Display**: Show available time slots in 15-minute increments
- **Party Size Options**: Display capacity availability for different group sizes
- **Availability Calendar**: Multi-day calendar view with color coding
- **Auto-Update**: Real-time sync when tables are booked/cancelled
- **Occupancy Status**: Track current table occupancy (dine-in only)

### Acceptance Criteria
- [ ] Availability query returns results < 500ms
- [ ] Time slots update automatically on reservation
- [ ] Customer sees "booked/available" status accurate to <1 minute
- [ ] provider can see all table statuses in real-time dashboard
- [ ] System handles simultaneous booking requests (conflict resolution)

### Data Dependencies
- Firestore availability collection
- Firestore reservations collection
- WebSocket for real-time updates
- Pub/Sub messaging for event distribution

---

## FR5: PERSONALIZED RESTAURANT RECOMMENDATIONS
**Module:** Customer Portal | **Priority:** 🟡 HIGH | **Complexity:** VERY HIGH

### Description
AI-powered recommendation engine using knowledge graphs and user interaction history to suggest restaurants aligned with individual preferences.

### Key Capabilities
- **Preference Learning**: Track user cuisine preferences and dining patterns
- **Knowledge Graph**: Neo4j-based relationship modeling (user→cuisine→restaurant)
- **Historical Analysis**: Analyze past bookings and searches
- **Cold-Start Handling**: Handle new users with generic recommendations
- **Contextual Suggestions**: Recommend based on current conversation context
- **Trending Venues**: Surface popular restaurants by booking volume/ratings

### Acceptance Criteria
- [ ] Recommendations personalized by user history
- [ ] Cold-start users receive relevant suggestions
- [ ] Recommendation explanation provided (e.g., "You liked Italian last week")
- [ ] System adapts after 5+ interactions
- [ ] Trending restaurants updated daily

### Data Dependencies
- Neo4j knowledge graph
- Firestore user interaction logs
- Firestore recommendation cache
- Machine learning pipeline for preference modeling

---

## FR6: RESERVATION CREATION AND MANAGEMENT
**Module:** Customer Portal | **Priority:** 🔴 CRITICAL | **Complexity:** HIGH

### Description
Complete reservation lifecycle from discovery through post-dining follow-up, including modification and cancellation workflows.

### Key Capabilities
- **Reservation Request**: Capture date, time, party size, special requests
- **Booking Confirmation**: Generate unique confirmation code
- **Modification Support**: Allow date/time changes up to 24 hours prior
- **Cancellation Workflow**: Support cancellations with confirmation
- **Reservation History**: Archive and display all past reservations
- **Reservation Details**: Store guest preferences and dietary restrictions

### Acceptance Criteria
- [ ] User can book table through chat in < 60 seconds
- [ ] Confirmation code generated and delivered via email
- [ ] User can modify reservation date/time before 24-hour cutoff
- [ ] Cancellation removes reservation and reallocates table
- [ ] Reservation history visible with past details
- [ ] No double-booking (conflict detection)

### Data Dependencies
- Firestore reservations collection
- Firestore availability tracking
- Email notification service
- Unique code generation service

---

## FR7: RESERVATION CONFIRMATION AND NOTIFICATIONS
**Module:** ALL Portals | **Priority:** 🔴 CRITICAL | **Complexity:** MEDIUM

### Description
Multi-channel notification system for reservation lifecycle events (confirmation, reminders, cancellations, completion).

### Key Capabilities
- **Booking Confirmation**: Email confirmation with reservation details
- **Reminder Notifications**: 24-hour and 1-hour advance reminders
- **Cancellation Alerts**: Notify on cancellation or modification
- **SMS Support**: Optional SMS notifications for urgent alerts
- **In-App Notifications**: In-application notification center
- **Post-Dining Follow-up**: Feedback request 24 hours after reservation

### Acceptance Criteria
- [ ] Confirmation email sent within 2 minutes of booking
- [ ] Reminder SMS/email sent at 24h and 1h marks
- [ ] Notification delivery rate > 98%
- [ ] Users can customize notification preferences
- [ ] SMS support available (optional tier)
- [ ] Post-visit survey triggered after reservation completion

### Data Dependencies
- Email service (SendGrid/similar)
- SMS service (Twilio/Dialog/similar)
- Firestore notification preferences
- Message queue (Cloud Pub/Sub)

---

## FR8: SECURE PAYMENT PROCESSING
**Module:** Customer Portal | **Priority:** 🟡 HIGH | **Complexity:** VERY HIGH

### Description
PCI-DSS compliant payment processing supporting multiple payment methods for dining packages, advance deposits, or prepayment scenarios.

### Key Capabilities
- **Payment Gateway Integration**: Stripe for credit/debit cards
- **Local Payment Methods**: Support local options (PayHere, Dialog eCash)
- **Secure Tokenization**: PCI-compliant card tokenization
- **Payment Confirmation**: Receipt generation and email delivery
- **Refund Processing**: Support refunds and chargebacks
- **Transaction Logging**: Audit trail for all transactions

### Acceptance Criteria
- [ ] Credit/debit card payments processed securely
- [ ] Local payment options integrated
- [ ] Receipt sent within 5 minutes of transaction
- [ ] Refund processed within 24 hours
- [ ] Zero PCI compliance violations in audits
- [ ] Payment failure retry mechanism (3 attempts)

### Data Dependencies
- Stripe API client
- PayHere API integration
- Firestore transactions collection (encrypted)
- PCI-compliant database for payment records

---

## FR9: USER AUTHENTICATION AND ROLE-BASED ACCESS CONTROL
**Module:** ALL Portals | **Priority:** 🔴 CRITICAL | **Complexity:** MEDIUM

### Description
Secure authentication system with role-based authorization across three distinct user types with appropriate permission scoping.

### Key Capabilities
- **Email/Password Authentication**: Secure account creation and login
- **OAuth 2.0 Integration**: Google single sign-on support
- **Role-Based Access Control (RBAC)**: Three role types - Customer, Provider, Admin
- **Session Management**: JWT token lifecycle with refresh mechanisms
- **Multi-Device Support**: User login on multiple devices
- **Account Security**: Password reset, account suspension, 2FA (Phase 2)

### Acceptance Criteria
- [ ] User can register with email and strong password
- [ ] Login generates JWT tokens (15-min access, 7-day refresh)
- [ ] Google OAuth login completes in < 5 seconds
- [ ] Role-based pages restricted appropriately
- [ ] Password reset email sent within 2 minutes
- [ ] Inactive sessions timeout after 30 minutes
- [ ] Users can view active sessions and logout remotely

### Data Dependencies
- Firestore users collection
- Firestore sessions collection
- JWT signing service
- bcryptjs for password hashing

---

## FR10: ADMINISTRATIVE MONITORING AND SYSTEM MANAGEMENT
**Module:** Admin Panel | **Priority:** 🟡 HIGH | **Complexity:** MEDIUM

### Description
Administrative dashboard for system oversight, user management, restaurant verification, and platform analytics.

### Key Capabilities
- **User Management**: View, suspend, activate user accounts
- **Restaurant Verification**: Approve/reject new restaurant registrations
- **System Monitoring**: View system health, API performance, error rates
- **Analytics Dashboard**: Key metrics (bookings, revenue, user growth)
- **Dispute Resolution**: Handle user complaints and provider disputes
- **Audit Logging**: Track administrative actions for compliance

### Acceptance Criteria
- [ ] Admin dashboard loads key metrics within 2 seconds
- [ ] Can view all users with search/filter capability
- [ ] Can approve/reject restaurant registrations within UI
- [ ] System uptime metric displays accurately
- [ ] Error logs visible with filtering and search
- [ ] All admin actions logged with timestamp and actor

### Data Dependencies
- Firestore users, restaurants collections
- Cloud Logging for system events
- Cloud Monitoring dashboards
- Firestore audit logs collection

---

---

# ⚙️ PART II: NON-FUNCTIONAL REQUIREMENTS

## Overview
The system must satisfy **5 quality attribute categories** with specific measurable targets:

---

## NFR1: PERFORMANCE
**Priority:** 🔴 CRITICAL

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | < 2 seconds (first load) | Lighthouse audit |
| **API Response Time** | < 500ms (p95) | New Relic/APM |
| **Chat Response Time** | < 5 seconds (AI processing) | End-to-end timing |
| **Search Latency** | < 500ms (restaurant search) | Database query + API |
| **Database Query** | < 100ms (p95) | Firestore metrics |
| **Static Asset Load** | < 1 second (images, CSS, JS) | CDN performance |
| **Mobile Performance** | < 3 seconds load time | Mobile device testing |

### Implementation Strategies
- Frontend code splitting and lazy loading
- Firestore indexing optimization
- Cloud CDN for static assets
- Response caching (Redis, in-memory)
- Image optimization and compression
- API endpoint caching strategies

### Success Metrics
- Lighthouse score > 80 (mobile and desktop)
- Real user monitoring average load time < 2s
- API p95 response time consistently < 500ms
- Page Speed Insights > 85 score

---

## NFR2: SCALABILITY
**Priority:** 🟡 HIGH

### Scalability Requirements

| Metric | Target | Notes |
|--------|--------|-------|
| **Concurrent Users** | 1,000+ simultaneous | Peak load capacity |
| **Registered Users** | 100,000+ | Database sizing |
| **Monthly Transactions** | 50,000+ reservations | Throughput requirement |
| **Restaurants** | 10,000+ in database | Data scale |
| **API Throughput** | 10,000 req/min | Peak rate capacity |
| **Database Connections** | 50+ concurrent | Connection pooling |
| **Message Queue** | 100 msgs/sec peak | Pub/Sub capacity |

### Architectural Approaches
- Horizontal scaling via microservices
- Firestore auto-scaling
- Cloud Run auto-scaling
- Database connection pooling
- Message queue for async operations
- Caching layers (Redis)
- Load balancing across instances

### Growth Roadmap
- **Phase 1 (0-100K users):** Single region deployment
- **Phase 2 (100K-1M users):** Multi-region with read replicas
- **Phase 3 (1M+ users):** Global CDN + database sharding

---

## NFR3: SECURITY
**Priority:** 🔴 CRITICAL

### Security Requirements

#### Authentication & Authorization
- [x] JWT-based stateless authentication (RS256 algorithm)
- [x] Session tokens with expiration (15 min access, 7 day refresh)
- [x] OAuth 2.0 for Google authentication
- [x] Role-based access control (RBAC) with 3 permission levels
- [x] Multi-factor authentication (Phase 2)
- [x] Account lockout after 5 failed attempts
- [x] Logout on all devices capability

#### Data Protection
- [x] TLS 1.3 encryption for all network traffic
- [x] AES-256 encryption at rest for sensitive data
- [x] End-to-end encryption for payment data (PCI-DSS)
- [x] Secure password hashing (bcryptjs, 12 rounds)
- [x] API key rotation policy (quarterly)
- [x] Database access restrictions and IAM policies

#### Application Security
- [x] Input validation and sanitization (OWASP Top 10)
- [x] SQL injection prevention (parameterized queries)
- [x] Cross-site scripting (XSS) protection via Content Security Policy
- [x] Cross-site request forgery (CSRF) token protection
- [x] Rate limiting (5 attempts/15 min for login)
- [x] DDoS protection via Cloud Armor
- [x] Web Application Firewall (WAF)

#### Compliance
- [x] PCI DSS Level 1 compliance for payment data
- [x] GDPR compliance (data privacy, right to deletion)
- [x] Data Protection Act compliance (local jurisdiction)
- [x] Regular penetration testing (quarterly)
- [x] Vulnerability scanning (automated weekly)
- [x] Security audit logging (all transactions logged)

### Security Monitoring
- Automated threat detection
- Real-time security alerts
- Incident response procedures
- Security incident tracking

---

## NFR4: AVAILABILITY & RELIABILITY
**Priority:** 🔴 CRITICAL

### Availability Targets

| Metric | Target | Notes |
|--------|--------|-------|
| **Uptime SLA** | 99.9% | 8.76 hours downtime/year |
| **Planned Maintenance** | < 2 hours/month | Zero-downtime deployment |
| **Unplanned Downtime** | < 30 min/month | RTO target |
| **Recovery Time Objective (RTO)** | < 30 minutes | Max acceptable downtime |
| **Recovery Point Objective (RPO)** | < 1 hour | Max acceptable data loss |

### Reliability Mechanisms
- **Automated Backups:** Daily snapshots with 30-day retention
- **Database Replication:** Cross-region read replicas
- **Failover Automation:** Auto-failover to backup region
- **Load Balancing:** Multiple instances behind load balancer
- **Circuit Breakers:** Prevent cascading failures
- **Graceful Degradation:** Partial functionality during outages

### Health Monitoring
- Health check endpoints every 30 seconds
- Uptime monitoring dashboard
- Alert thresholds for latency/errors
- Synthetic monitoring for user flows
- Custom dashboards for ops team

### Disaster Recovery
- Documented recovery procedures
- Quarterly disaster recovery drills
- Backup restoration testing (monthly)
- Multi-region failover strategy
- Data loss impact assessment

---

## NFR5: USABILITY & COMPATIBILITY
**Priority:** 🟡 HIGH

### Usability Requirements
- **Response to Actions:** All user actions receive feedback < 200ms
- **Accessibility:** WCAG 2.1 AA compliance
  - Keyboard navigation support
  - Screen reader compatibility
  - Color contrast ratios (4.5:1 minimum)
  - Alt text for all images
- **Internationalization:** Support multiple languages (Phase 2)
- **Mobile Responsiveness:** Fully functional on devices 320px-2560px width
- **Intuitive Design:** Average task completion < 2 minutes
- **Documentation:** User guides, in-app help, FAQs

### Browser & Device Compatibility

| Platform | Support Level |
|----------|---|
| **Browsers** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Mobile** | iOS 13+, Android 10+ |
| **Desktop** | Windows, macOS, Linux |
| **Tablets** | iPad (7th gen+), Android tablets (8"+) |
| **Progressive Web App (PWA)** | Full offline support, installable |

### API Compatibility
- REST API v1.0 with versioning strategy
- Backward compatibility for 2 major versions
- Semantic versioning (MAJOR.MINOR.PATCH)
- GraphQL API (Phase 2, optional)
- WebSocket for real-time features

---

---

# 📊 REQUIREMENTS SUMMARY TABLE

| Category | Count | Priority Distribution |
|----------|-------|---|
| **Functional Requirements** | 10 | 6 🔴 Critical, 4 🟡 High |
| **Non-Functional Requirements** | 5 | 3 🔴 Critical, 2 🟡 High |
| **Total Requirements** | 15 | - |

---

# 🎯 MAPPING TO 25% VIVA COMPLETION

| Requirement | Epic | Completion Target | Status |
|---|---|---|---|
| FR1: Restaurant Discovery | Epic 4 | 50% | 🆕 NEW |
| FR2: Conversational Interaction | Epic 2 | 40% | ⚠️ PARTIAL |
| FR3: Dynamic Restaurant Info | Epic 4 | 50% | 🆕 NEW |
| FR4: Table Availability | Epic 6 | 0% | ⏸️ DEFER |
| FR5: Recommendations | Epic 5 | 0% | ⏸️ DEFER |
| FR6: Reservation Creation | Epic 6 | 0% | ⏸️ DEFER |
| FR7: Notifications | Epic 6 | 0% | ⏸️ DEFER |
| FR8: Payment Processing | Epic 7 | 0% | ⏸️ DEFER |
| FR9: Authentication & RBAC | Epic 1 | 75% | ✅ MOSTLY DONE |
| FR10: Admin Management | - | 0% | ⏸️ DEFER |
| **NFR: All Quality Attributes** | - | 85% | ✅ INFRASTRUCTURE DONE |

---

# 🔄 REQUIREMENTS TRACEABILITY

**For Your Viva (15-20 minutes demo):**

```
FR9: Authentication ✅ → Demo 1: Sign up & login (2 min)
FR2: Conversational Interaction ⚠️ → Demo 2: Chat with bot (3 min)
FR1: Restaurant Discovery 🆕 → Demo 3: Search restaurants (6 min)
FR3: Dynamic Restaurant Info 🆕 → Demo 4: View details (4 min)
NFR: Performance ✅ → Mention page load times (1 min)
```

**Total Demo Time: 16 minutes** ✅

---

# ✅ NEXT STEPS

1. **Review & Approve** this requirements document
2. **Create implementation backlog** from these 10 FRs
3. **Start development** on FR1, FR2, FR3, FR9 (Focus on 25%)
4. **Defer** FR4, FR5, FR6, FR7, FR8, FR10 to Phase 2

**Ready to proceed with implementation?** 🚀


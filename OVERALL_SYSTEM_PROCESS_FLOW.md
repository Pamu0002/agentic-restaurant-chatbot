# 🍽️ OVERALL SYSTEM PROCESS FLOW
## Agentic Restaurant Chatbot - Complete Customer Journey & Technical Architecture

**Version:** 1.0  
**Date:** April 12, 2026  
**Status:** Design & Planning Phase  
**Last Updated:** By Development Team

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Customer Journey Flow](#customer-journey-flow)
4. [Technical Architecture](#technical-architecture)
5. [API Endpoints Specification](#api-endpoints-specification)
6. [Data Models & Database Schema](#data-models--database-schema)
7. [Chatbot As Entry Point](#chatbot-as-entry-point)
8. [Guest Mode vs Authenticated Mode](#guest-mode-vs-authenticated-mode)
9. [Order Processing Flow](#order-processing-flow)
10. [Authentication & Session Management](#authentication--session-management)
11. [Key Features & Workflows](#key-features--workflows)
12. [Integration Points](#integration-points)
13. [Implementation Phases](#implementation-phases)
14. [Security Considerations](#security-considerations)
15. [Performance & Scalability](#performance--scalability)

---

## 🎯 EXECUTIVE SUMMARY

The Agentic Restaurant Chatbot system is designed as a **unified customer entry point** where users can:

- **As Guests**: Browse restaurants, view menus, ask questions, get recommendations
- **As Authenticated Users**: Place orders, make reservations, track orders, manage accounts
- **Order Journey**: Seamlessly transition from guest browsing → authentication → order checkout → payment → tracking

### Key Differentiators:
✅ **Chatbot-First Approach** - Single conversational UI for all interactions  
✅ **Zero-Friction Guest Access** - Browse without signup  
✅ **Intelligent Intent Detection** - AI understands order intent, collects required info  
✅ **Seamless Auth Transition** - Guest browse → auth → checkout without re-entering data  
✅ **Multi-Channel** - Chat, but backed by structured order data  

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER INTERFACE LAYER                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │         Single Page Application (React/Vite)                │  │
│  │         URL: http://localhost:5175                          │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌─────────────────────┐    ┌──────────────────────────┐  │  │
│  │  │  Landing Page       │    │  Auth Modal (Overlay)    │  │  │
│  │  │  - Browse Sections  │    │  - Sign Up / Sign In     │  │  │
│  │  │  - Restaurant List  │    │  - Social Login (Future) │  │  │
│  │  │  - Category Filter  │    └──────────────────────────┘  │  │
│  │  └─────────────────────┘                                   │  │
│  │           │                                                │  │
│  │           └─────────┬──────────────────────────────┐      │  │
│  │                     ├─→ Guest Mode: Limited UI     │      │  │
│  │                     └─→ Auth Mode: Full Features   │      │  │
│  │                                                    │      │  │
│  │  ┌──────────────────────────────────────────────┐ │      │  │
│  │  │  CHATBOT WIDGET (Always Visible)             │ │      │  │
│  │  │  Position: Bottom Right                      │ │      │  │
│  │  ├──────────────────────────────────────────────┤ │      │  │
│  │  │ "Hi! 👋 Looking for something delicious?"  │ │      │  │
│  │  │                                              │ │      │  │
│  │  │ ┌──────────────────────────────────────┐   │ │      │  │
│  │  │ │ [Guest Mode - Browse Only]           │   │ │      │  │
│  │  │ │ • Browse Restaurants                 │   │ │      │  │
│  │  │ │ • View Menus & Prices                │   │ │      │  │
│  │  │ │ • Get Recommendations                │   │ │      │  │
│  │  │ │ → [Sign In to Order]                 │   │ │      │  │
│  │  │ └──────────────────────────────────────┘   │ │      │  │
│  │  │                                              │ │      │  │
│  │  │ ┌──────────────────────────────────────┐   │ │      │  │
│  │  │ │ [Auth Mode - Full Features]          │   │ │      │  │
│  │  │ │ • Browse & Order                     │   │ │      │  │
│  │  │ │ • Track Orders                       │   │ │      │  │
│  │  │ │ • Save Preferences                   │   │ │      │  │
│  │  │ │ • Manage Reservations                │   │ │      │  │
│  │  │ └──────────────────────────────────────┘   │ │      │  │
│  │  └──────────────────────────────────────────────┘ │      │  │
│  │                                                    │      │  │
│  └────────────────────────────────────────────────────┘      │  │
│                                                               │  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────────┐
        ↓ HTTP/REST/JSON                  ↓ WebSocket (Real-time Events)
        
┌─────────────────────────────────────────────────────────────────────┐
│                  BACKEND APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │           Express.js API Server (Node.js/TypeScript)        │ │
│  │           URL: http://localhost:5000                        │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  ✓ Request Processing                                       │ │
│  │  ✓ JWT Token Verification                                   │ │
│  │  ✓ Rate Limiting                                            │ │
│  │  ✓ CORS Management                                          │ │
│  │  ✓ Error Handling & Logging                                 │ │
│  │                                                              │ │
│  │  Routes:                                                     │ │
│  │  ├─ /api/auth/*           (Authentication)                  │ │
│  │  ├─ /api/chat/*           (Messaging)                       │ │
│  │  ├─ /api/restaurants/*    (Restaurant Data)                 │ │
│  │  ├─ /api/orders/*         (Order Management)                │ │
│  │  ├─ /api/menu/*           (Menu Items)                      │ │
│  │  └─ /api/users/*          (User Profiles)                   │ │
│  │                                                              │ │
│  └────────────────┬──────────────────────────┬─────────────────┘ │
│                   │                          │                   │
└───────────────────┼──────────────────────────┼───────────────────┘
                    │                          │
        ┌───────────┴──────┐      ┌────────────┴─────────┐
        ↓                  ↓      ↓                      ↓
        
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  FIRESTORE       │  │  AI SERVICE      │  │  PAYMENT GATEWAY │
│  Database        │  │  (Python/FastAPI)│  │  (Future)        │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Collections:     │  │ Port: 8000       │  │ Stripe/PayPal    │
│ • users          │  │ • Orchestrator   │  │ • Card Processing│
│ • conversations  │  │ • GeminiService  │  │ • Webhooks       │
│ • messages       │  │ • Agents:        │  │ • Verification   │
│ • restaurants    │  │   - Discovery    │  └──────────────────┘
│ • menu_items     │  │   - Recommend    │
│ • orders         │  │   - Reservation  │
│ • sessions       │  │   - Order Agent  │
│ • audit_logs     │  └──────────────────┘
└──────────────────┘
```

---

## 👥 CUSTOMER JOURNEY FLOW

### Complete Customer Lifecycle

```
┌─ START: User Visits Application ─────────────────────────────────┐
│                                                                   │
│  ↓ Browser Loads: http://localhost:5175                          │
│                                                                   │
│  ┌──────────────────────────────────┐                            │
│  │ DECISION POINT 1: User Status    │                            │
│  └──────────────────────────────────┘                            │
│    ├─→ New/Guest User → Continue as Guest                       │
│    └─→ Returning User → Auto-login with saved token             │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


┌─ PHASE 1: GUEST BROWSING (No Authentication) ────────────────────┐
│                                                                   │
│  STATE: isAuthenticated = false                                  │
│  CONTEXT: guestSessionId = unique-session-abc123                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Landing Page Displays:                                     │ │
│  │ ✓ Search Bar (Location, Cuisine, Budget)                   │ │
│  │ ✓ Featured Restaurants (Top Rated, New, Trending)          │ │
│  │ ✓ Category Filters (Italian, Chinese, Biryani, etc.)       │ │
│  │ ✓ Chatbot Widget (Bottom Right)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Chatbot Initial Interaction (Guest Mode):                  │ │
│  │                                                             │ │
│  │ Bot: "Hi! 👋 What are you craving today?                  │ │
│  │      • I can help you find restaurants                     │ │
│  │      • Show you menus & prices                             │ │
│  │      • Get recommendations                                 │ │
│  │                                                             │ │
│  │      To place an order, just sign in! 😊"                 │ │
│  │                                                             │ │
│  │ User Options:                                              │ │
│  │ ├─ "Find Italian restaurants in Colombo"                  │ │
│  │ ├─ "Show me affordable options"                           │ │
│  │ ├─ "What's popular today?"                                │ │
│  │ └─ [Browse Menu] buttons on restaurant cards              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ GUEST CAN:                        GUEST CANNOT:            │ │
│  │ ✓ Browse restaurants              ✗ Place orders            │ │
│  │ ✓ View full menus & prices        ✗ Make reservations      │ │
│  │ ✓ See ratings & reviews           ✗ Track orders            │ │
│  │ ✓ Get AI recommendations          ✗ Save preferences       │ │
│  │ ✓ Ask questions via chat          ✗ Access order history   │ │
│  │ ✓ View restaurant hours/location  ✗ Use wallet              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                IF ORDER INTENT DETECTED...                       │
│                              ↓                                   │
│  "Looks like you're ready to order from [Restaurant]!            │
│   Sign in or create an account to complete your order."         │
│                                                                   │
│                     ┌──────────────┐                             │
│                     │ [Sign In]    │                             │
│                     │ [Sign Up]    │                             │
│                     └──────────────┘                             │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


┌─ PHASE 2: AUTHENTICATION TRANSITION ───────────────────────────────┐
│                                                                     │
│  USER CLICKS: [Sign Up] or [Sign In]                              │
│                           │                                        │
│              ┌────────────┴────────────┐                           │
│              ↓                         ↓                           │
│         [Sign Up Path]          [Sign In Path]                    │
│              │                         │                          │
│              ├─ Email Validation       ├─ Email/Password Check    │
│              ├─ Password Requirements  ├─ Verify Against Firebase │
│              ├─ Display Name           └─ Retrieve User Profile   │
│              ├─ Phone Number (Optional)                           │
│              └─ Terms & Conditions                                │
│                     │                  │                          │
│                     └────────┬─────────┘                          │
│                              ↓                                    │
│              ┌──────────────────────────────────┐                │
│              │  Firebase Authentication Service │                │
│              │  • Hash password (bcryptjs)      │                │
│              │  • Create user document          │                │
│              │  • Generate JWT tokens           │                │
│              └──────────────────────────────────┘                │
│                              ↓                                    │
│              ┌──────────────────────────────────┐                │
│              │  Response to Frontend:           │                │
│              │  {                               │                │
│              │    accessToken: "jwt...",        │                │
│              │    refreshToken: "jwt...",       │                │
│              │    user: {                       │                │
│              │      id: "user-123",             │                │
│              │      email: "user@email.com",    │                │
│              │      displayName: "John"         │                │
│              │    }                             │                │
│              │  }                               │                │
│              └──────────────────────────────────┘                │
│                              ↓                                    │
│              ┌──────────────────────────────────┐                │
│              │  Frontend Processing:            │                │
│              │  • Store tokens in localStorage  │                │
│              │  • Update authContext state      │                │
│              │  • Close auth modal              │                │
│              │  • Session: Connect guestOrder   │                │
│              │    to authenticated userId       │                │
│              └──────────────────────────────────┘                │
│                              ↓                                    │
│              "Great! Welcome 🎉                 │                │
│               Your order from [Restaurant]      │                │
│               is ready to proceed to checkout."  │                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─ PHASE 3: ORDER CONVERSATION & COLLECTION ─────────────────────────┐
│                                                                     │
│  STATE: isAuthenticated = true                                    │
│  CONTEXT: userId = "user-123", conversationId = "conv-456"        │
│           restaurantId = "rest-789"                               │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Chatbot Now Shows Authenticated Options:                    │  │
│  │                                                              │  │
│  │ Bot: "Perfect! Let's build your order. 🍔                  │  │
│  │       You saw our Italian menu, right?                     │  │
│  │       What would you like?"                                │  │
│  │                                                              │  │
│  │ User: "2 large pepperoni pizzas and a salad"               │  │
│  │                                                              │  │
│  │ Bot: "Great choice! Let me confirm:                        │  │
│  │       • Large Pepperoni Pizza x2 ... Rs. 1,800             │  │
│  │       • Garden Fresh Salad x1 ... Rs. 400                  │  │
│  │       Subtotal: Rs. 2,200                                  │  │
│  │                                                              │  │
│  │       Any dietary restrictions or special requests?" │  │
│  │                                                              │  │
│  │ User: "No onions, extra cheese please"                      │  │
│  │                                                              │  │
│  │ Bot: "Perfect! 📍 Where should we deliver?                │  │
│  │       [Use Saved Address] [Enter New Address]"            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                    │
│           AI Service Processing (Real-time):                      │
│           • Intent: ORDER_CONFIRMATION                            │
│           • Entities: Items, Quantity, Preferences               │
│           • Extract: Special Instructions                        │
│           • Validate: Stock availability                         │
│           • Calculate: Total, Delivery Fee, Tax                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─ PHASE 4: ORDER CONFIRMATION & PAYMENT ────────────────────────────┐
│                                                                     │
│  USER PROVIDES: Delivery Address & Payment Info                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Order Summary Displayed:                                    │  │
│  │                                                              │  │
│  │ ┌─────────────────────────────────────────────────────┐    │  │
│  │ │ 🍔 Order from Pizzeria XYZ                          │    │  │
│  │ ├─────────────────────────────────────────────────────┤    │  │
│  │ │ Items:                                              │    │  │
│  │ │ • Large Pepperoni Pizza (No onions, +Cheese) x2    │    │  │
│  │ │   Rs. 900 x 2 = Rs. 1,800                           │    │  │
│  │ │ • Garden Fresh Salad x1                            │    │  │
│  │ │   Rs. 400 x 1 = Rs. 400                            │    │  │
│  │ ├─────────────────────────────────────────────────────┤    │  │
│  │ │ Subtotal: Rs. 2,200                                │    │  │
│  │ │ Tax (5%): Rs. 110                                  │    │  │
│  │ │ Delivery Fee: Rs. 200                              │    │  │
│  │ ├─────────────────────────────────────────────────────┤    │  │
│  │ │ TOTAL: Rs. 2,510                                   │    │  │
│  │ └─────────────────────────────────────────────────────┘    │  │
│  │                                                              │  │
│  │ Delivery To:                                                │  │
│  │ 123 Main Street, Colombo 7                                 │  │
│  │ Est. Delivery: 35 minutes                                  │  │
│  │                                                              │  │
│  │ Payment Method:                                             │  │
│  │ [Bank Card] [Cash on Delivery] [Digital Wallet]            │  │
│  │                                                              │  │
│  │ ┌──────────────────────────────────────────────────┐       │  │
│  │ │ [✓ Confirm & Pay]  [Cancel Order]               │       │  │
│  │ └──────────────────────────────────────────────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ↓                                    │
│  IF PAYMENT METHOD = "Card":                                      │
│  POST /api/payments/process                                       │
│  ├─ Amount: 2,510                                                 │
│  ├─ Currency: LKR                                                 │
│  ├─ Card Token: stripe_token_xyz                                  │
│  └─ Metadata: orderId, userId, restaurantId                       │
│                          ↓                                        │
│              Payment Gateway (Stripe)                             │
│              • Validate card                                      │
│              • Process transaction                                │
│              • Return status                                      │
│                          ↓                                        │
│              ✅ Payment Successful OR ❌ Payment Failed             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─ PHASE 5: ORDER CREATION & RESTAURANT NOTIFICATION ────────────────┐
│                                                                     │
│  POST /api/orders/create                                          │
│  {                                                                 │
│    userId: "user-123",                                            │
│    restaurantId: "rest-789",                                      │
│    items: [                                                        │
│      {                                                             │
│        menuItemId: "item-1",                                      │
│        name: "Large Pepperoni Pizza",                            │
│        quantity: 2,                                               │
│        price: 900,                                                │
│        specialInstructions: "No onions, extra cheese"            │
│      },                                                            │
│      {                                                             │
│        menuItemId: "item-5",                                      │
│        name: "Garden Fresh Salad",                               │
│        quantity: 1,                                               │
│        price: 400,                                                │
│        specialInstructions: ""                                    │
│      }                                                             │
│    ],                                                              │
│    orderType: "delivery",                                         │
│    deliveryAddress: {                                             │
│      street: "123 Main Street",                                   │
│      city: "Colombo",                                             │
│      postalCode: "00700",                                         │
│      coordinates: { lat: 6.9145, lng: 80.6358 }                  │
│    },                                                              │
│    paymentMethod: "card",                                         │
│    paymentStatus: "completed",                                    │
│    subtotal: 2200,                                                │
│    tax: 110,                                                       │
│    deliveryFee: 200,                                              │
│    total: 2510                                                     │
│  }                                                                 │
│                              ↓                                    │
│  Backend Processing:                                              │
│  ✓ Validate all items exist & are available                      │
│  ✓ Check minimum order amount                                    │
│  ✓ Save order to Firestore → orders collection                   │
│  ✓ Send notification to restaurant                               │
│  ✓ Send confirmation email to customer                           │
│  ✓ Update order status: "pending" → "confirmed"                  │
│                              ↓                                    │
│  Response to Frontend:                                            │
│  {                                                                 │
│    success: true,                                                 │
│    orderId: "ord-abc123xyz",                                      │
│    status: "confirmed",                                           │
│    estimatedDelivery: "35 minutes",                              │
│    trackingUrl: "/track/ord-abc123xyz"                            │
│  }                                                                 │
│                              ↓                                    │
│  Chatbot Confirmation Message:                                    │
│  "🎉 Order Confirmed!                                            │
│   Order #ORD-ABC123                                              │
│   Status: Confirmed                                               │
│   Est. Delivery: 35 minutes                                       │
│   Track your order: [View Tracking]"                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─ PHASE 6: ORDER TRACKING & REAL-TIME UPDATES ──────────────────────┐
│                                                                     │
│  User can now:                                                    │
│  • View order status in real-time                                │
│  • Track delivery location (if enabled)                          │
│  • Communicate with restaurant/delivery                          │
│  • Receive notifications                                         │
│                                                                     │
│  Order Status Flow:                                              │
│  pending ↓                                                         │
│  confirmed (Restaurant received order) ↓                          │
│  preparing (Kitchen preparing) ↓                                  │
│  ready (Ready for pickup) ↓                                       │
│  out-for-delivery (Delivery in progress) ↓                        │
│  delivered (Order delivered) ✓                                    │
│                                                                     │
│  Each status change triggers:                                     │
│  ✓ Push notification to user                                     │
│  ✓ Chatbot message update                                        │
│  ✓ Email notification (optional)                                 │
│  ✓ SMS notification (future)                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─ PHASE 7: POST-DELIVERY & ENGAGEMENT ──────────────────────────────┐
│                                                                     │
│  After Delivery (30 minutes later):                               │
│                                                                     │
│  Chatbot: "Hope you enjoyed your meal! 😊                        │
│            We'd love your feedback!                               │
│            Rate your experience & help us improve!               │
│            [Excellent ⭐⭐⭐⭐⭐] [..] [Rate Now]"                 │
│                                                                     │
│  User can also:                                                   │
│  ✓ Reorder the same items (quick order)                          │
│  ✓ Save favorite restaurants                                     │
│  ✓ Save preferences for next order                               │
│  ✓ Become regular customer                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─ END OF CYCLE: User Becomes Regular Customer ──────────────────────┐
│                                                                     │
│  Next Time User Visits:                                           │
│  • Immediate authentication (token exists)                        │
│  • Chatbot shows: "Welcome back! Order again? [Quick Order]"     │
│  • Personalized recommendations                                  │
│  • Saved addresses & payment methods                              │
│  • Order history accessible                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECHNICAL ARCHITECTURE

### Layered Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (React - Vite)                       │
├─────────────────────────────────────────────────────────┤
│ Components:                                             │
│ • LandingPage (Restaurant Browse)                       │
│ • ChatbotWidget (Floating/Bottom Right)                 │
│ • AuthModal (Sign In/Sign Up)                           │
│ • OrderConfirmation                                     │
│ • OrderTracking                                         │
│ • UserProfile                                           │
│                                                          │
│ State Management:                                       │
│ • AuthContext (JWT, User Info, isAuthenticated)         │
│ • ChatContext (Messages, Conversation)                  │
│ • OrderContext (Cart, Current Order)                    │
│ • GuestSessionContext (Guest ID, Browse History)        │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴──────────────────┐
        ↓ HTTP/REST API                   ↓ WebSocket
        
┌─────────────────────────────────────────────────────────┐
│ API GATEWAY LAYER (Express Middleware)                  │
├─────────────────────────────────────────────────────────┤
│ Middleware:                                             │
│ • CORS Handler                                          │
│ • Rate Limiter                                          │
│ • Request Logger                                        │
│ • Error Handler                                         │
│ • Authentication Verifier (JWT)                         │
│                                                          │
│ Controllers:                                            │
│ • AuthController (Sign Up, Sign In, Logout)            │
│ • ChatController (Send Message, Get History)           │
│ • RestaurantController (Browse, Search, Filter)        │
│ • OrderController (Create, Update, Cancel, Track)      │
│ • PaymentController (Process, Verify, Refund)          │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴──────────────────┐
        ↓ Service Logic                   ↓ Database Calls
        
┌─────────────────────────────────────────────────────────┐
│ BUSINESS LOGIC LAYER (Services)                         │
├─────────────────────────────────────────────────────────┤
│ Services:                                               │
│ • AuthService (JWT, Token Refresh, Password Hash)      │
│ • ChatService (Message Processing, AI Integration)     │
│ • OrderService (Order Creation, Status Management)     │
│ • PaymentService (Payment Processing, Verification)    │
│ • NotificationService (Emails, Push, SMS)             │
│ • RecommendationService (AI-based suggestions)         │
│                                                          │
│ Repositories:                                           │
│ • UserRepository (CRUD operations)                      │
│ • ConversationRepository                                │
│ • MessageRepository                                     │
│ • OrderRepository                                       │
│ • RestaurantRepository                                  │
│ • MenuItemRepository                                    │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴──────────────────┐
        │                                │
        ↓ Database Queries              ↓ External API Calls
        
┌─────────────────────────────────────────────────────────┐
│ DATA ACCESS LAYER                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────┐     ┌──────────────────────────┐  │
│ │ Firestore        │     │ AI Service (Python)      │  │
│ │ • Collections:   │     │ localhost:8000           │  │
│ │  - users         │     │ • Orchestrator           │  │
│ │  - restaurants   │     │ • GeminiService (Vertex) │  │
│ │  - orders        │     │ • Agents:                │  │
│ │  - messages      │     │  - Discovery             │  │
│ │  - conversations │     │  - Recommendation        │  │
│ │  - menu_items    │     │  - Order                 │  │
│ │  - sessions      │     │  - Reservation           │  │
│ │  - payments      │     └──────────────────────────┘  │
│ └──────────────────┘                                   │
│                                                          │
│ ┌──────────────────┐     ┌──────────────────────────┐  │
│ │ Redis (Cache)    │     │ Payment Gateway          │  │
│ │ • Sessions Cache │     │ • Stripe / PayPal        │  │
│ │ • Rate Limit     │     │ • Transaction Records    │  │
│ │ • User Prefs     │     │ • Webhook Integration    │  │
│ └──────────────────┘     └──────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📡 API ENDPOINTS SPECIFICATION

### Authentication Endpoints

```typescript
// SIGN UP
POST /api/auth/signup
Content-Type: application/json

Request:
{
  email: string;              // Required
  password: string;           // Min 8 chars, 1 uppercase, 1 number
  displayName: string;        // Required
  phoneNumber?: string;       // Optional
  termsAccepted: boolean;     // Required
}

Response (201):
{
  success: true;
  data: {
    accessToken: string;      // JWT (15 min expiry)
    refreshToken: string;     // JWT (7 day expiry)
    user: {
      id: string;             // UUID
      email: string;
      displayName: string;
      phoneNumber?: string;
      role: "customer";
      createdAt: timestamp;
    }
  }
}

Errors:
400 - Invalid email format
400 - Password too weak
409 - Email already registered
500 - Server error


// SIGN IN
POST /api/auth/signin
Content-Type: application/json

Request:
{
  email: string;
  password: string;
}

Response (200):
{
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    user: { /*...*/ }
  }
}

Errors:
401 - Invalid credentials
404 - User not found


// LOGOUT
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer <accessToken>

Response (200):
{
  success: true;
  message: "Logged out successfully"
}


// REFRESH TOKEN
POST /api/auth/refresh
Content-Type: application/json

Request:
{
  refreshToken: string;
}

Response (200):
{
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;  // New refresh token
  }
}

Errors:
401 - Invalid or expired refresh token
```

### Chat Endpoints

```typescript
// GUEST BROWSE (No Auth)
POST /api/chat/guest/browse
Content-Type: application/json

Request:
{
  guestSessionId?: string;    // Generated if not provided
  intent: "browse" | "recommend" | "question";
  location?: string;
  cuisine?: string[];
  budget?: "low" | "medium" | "high";
  query?: string;             // Free text query
}

Response (200):
{
  success: true;
  data: {
    restaurants: [
      {
        id: string;
        name: string;
        cuisine: string[];
        rating: number;
        distance: number;       // km
        deliveryTime: number;   // minutes
        deliveryFee: number;
        minOrder: number;
        isOpen: boolean;
        image: string;          // URL
      }
    ];
    message: string;            // AI response
    sessionId: string;          // For guest tracking
  }
}


// SEND MESSAGE (Auth Required)
POST /api/chat/send
Content-Type: application/json
Authorization: Bearer <accessToken>

Request:
{
  conversationId?: string;    // Creates new if not provided
  message: string;            // User message
  metadata?: {                // Optional context
    restaurantId?: string;
    orderContext?: object;
    userPreferences?: object;
  }
}

Response (200):
{
  success: true;
  data: {
    message: {
      id: string;
      conversationId: string;
      role: "assistant";
      content: string;
      intent: string;
      metadata: object;
      createdAt: timestamp;
    }
  }
}

Errors:
401 - Unauthorized (no token)
400 - Invalid request
500 - AI service error (returns fallback response)


// GET CONVERSATION HISTORY
GET /api/chat/conversations/:conversationId
Authorization: Bearer <accessToken>

Query Parameters:
?limit=50&offset=0

Response (200):
{
  success: true;
  data: {
    conversation: {
      id: string;
      userId: string;
      title: string;
      createdAt: timestamp;
      lastActivityAt: timestamp;
      messageCount: number;
    };
    messages: Message[];      // Array of messages
  }
}
```

### Order Endpoints

```typescript
// CREATE ORDER
POST /api/orders/create
Content-Type: application/json
Authorization: Bearer <accessToken>

Request:
{
  restaurantId: string;
  items: [
    {
      menuItemId: string;
      name: string;
      quantity: number;
      price: number;
      specialInstructions?: string;
    }
  ];
  orderType: "delivery" | "pickup" | "dine-in";
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    coordinates: { lat: number; lng: number };
  };
  paymentMethod: "card" | "cash" | "wallet";
  specialRequests?: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

Response (201):
{
  success: true;
  data: {
    orderId: string;
    status: "pending";
    estimatedDelivery: number;  // minutes
    trackingUrl: string;
    total: number;
  }
}

Errors:
400 - Invalid items or order data
402 - Payment failed
500 - Order creation failed


// GET ORDER DETAILS
GET /api/orders/:orderId
Authorization: Bearer <accessToken>

Response (200):
{
  success: true;
  data: {
    id: string;
    userId: string;
    restaurantId: string;
    items: [];
    status: string;
    estimatedDelivery: timestamp;
    deliveredAt?: timestamp;
    total: number;
    trackingInfo?: {
      location: { lat, lng };
      driver?: string;
    }
  }
}


// CANCEL ORDER
POST /api/orders/:orderId/cancel
Authorization: Bearer <accessToken>

Response (200):
{
  success: true;
  message: "Order cancelled successfully",
  refundAmount: number;
}

Errors:
400 - Order cannot be cancelled (already preparing/delivered)
402 - Refund processing failed
```

### Restaurant Endpoints

```typescript
// LIST RESTAURANTS
GET /api/restaurants
Query: ?location=Colombo&cuisine=Italian&limit=20&offset=0

Response (200):
{
  success: true;
  data: {
    restaurants: [
      {
        id: string;
        name: string;
        description: string;
        cuisine: string[];
        rating: number;
        reviewCount: number;
        location: { street, city, coordinates };
        hours: { monday: { open, close }, /*...*/ };
        deliveryTime: number;
        deliveryFee: number;
        minOrder: number;
        isOpen: boolean;
        image: string;
      }
    ];
    total: number;
  }
}


// GET RESTAURANT DETAILS
GET /api/restaurants/:restaurantId

Response (200):
{
  success: true;
  data: {
    id: string;
    name: string;
    /*...full restaurant details...*/
    menu: {
      categories: [
        {
          name: string;
          items: [
            {
              id: string;
              name: string;
              description: string;
              price: number;
              image: string;
              vegetarian: boolean;
              spiceLevel: number;
            }
          ]
        }
      ]
    }
  }
}
```

---

## 💾 DATA MODELS & DATABASE SCHEMA

### Firestore Collections

#### 1. Users Collection

```
Collection: users
├─ Document ID: (user ID - UUID)
│
├─ Fields:
│  ├─ id: string (UUID)
│  ├─ email: string (unique, indexed)
│  ├─ passwordHash: string (bcrypt)
│  ├─ displayName: string
│  ├─ phoneNumber: string
│  ├─ profileImage: string (URL)
│  ├─ role: "customer" | "restaurant" | "driver" | "admin"
│  │
│  ├─ Preferences:
│  │  ├─ cuisinePreferences: string[]
│  │  ├─ dietaryRestrictions: string[]
│  │  ├─ spiceTolerance: 0-5
│  │  ├─ notificationsEnabled: boolean
│  │  ├─ newsletter: boolean
│  │
│  ├─ Addresses: (subcollection)
│  │  ├─ savedAddresses: [
│  │  │   {
│  │  │     id: string;
│  │  │     label: "Home" | "Work" | "Other";
│  │  │     street: string;
│  │  │     city: string;
│  │  │     coordinates: { lat, lng };
│  │  │     isDefault: boolean;
│  │  │   }
│  │  │ ]
│  │
│  ├─ PaymentMethods: (subcollection)
│  │  ├─ [
│  │  │   {
│  │  │     id: string;
│  │  │     type: "card" | "wallet" | "bank";
│  │  │     lastFour: string;
│  │  │     isDefault: boolean;
│  │  │     expiryDate?: string;
│  │  │   }
│  │  │ ]
│  │
│  ├─ Statistics:
│  │  ├─ totalOrders: number
│  │  ├─ totalSpent: number
│  │  ├─ averageRating: number
│  │
│  ├─ createdAt: timestamp
│  ├─ updatedAt: timestamp
│  └─ lastLoginAt: timestamp
```

#### 2. Conversations Collection

```
Collection: conversations
├─ Document ID: (conversation ID - UUID)
│
├─ Fields:
│  ├─ id: string
│  ├─ userId: string (indexed)
│  ├─ participantIds: string[]
│  │
│  ├─ Metadata:
│  │  ├─ title: string (auto-generated or user-set)
│  │  ├─ type: "support" | "order" | "recommendation" | "general"
│  │  ├─ status: "active" | "archived" | "closed"
│  │  ├─ relatedOrderId?: string
│  │  ├─ relatedRestaurantId?: string
│  │
│  ├─ Stats:
│  │  ├─ messageCount: number
│  │  ├─ unreadCount: number
│  │  ├─ lastMessageType: "user" | "assistant"
│  │  ├─ lastMessagePreview: string
│  │
│  ├─ Timestamps:
│  │  ├─ createdAt: timestamp
│  │  ├─ updatedAt: timestamp
│  │  ├─ lastActivityAt: timestamp
│  │  └─ archivedAt?: timestamp
```

#### 3. Messages Collection

```
Collection: conversations/{conversationId}/messages
├─ Document ID: (message ID - UUID)
│
├─ Fields:
│  ├─ id: string
│  ├─ conversationId: string
│  ├─ userId: string
│  │
│  ├─ Content:
│  │  ├─ role: "user" | "assistant"
│  │  ├─ content: string (message text)
│  │  ├─ type: "text" | "button" | "card" | "image"
│  │
│  ├─ AI Processing (if role == "assistant"):
│  │  ├─ intent: string ("ORDER", "BROWSE", "RECOMMEND", etc.)
│  │  ├─ confidence: number (0-1)
│  │  ├─ entities: {
│  │  │   restaurantId?: string;
│  │  │   cuisineTypes?: string[];
│  │  │   budget?: string;
│  │  │   items?: [{ name, quantity }];
│  │  │ }
│  │  ├─ model: string ("gemini-1.5-pro")
│  │  ├─ temperature: number (0-1)
│  │  ├─ processingTime: number (ms)
│  │  └─ agentName: string
│  │
│  ├─ Context:
│  │  ├─ metadata?: object
│  │  ├─ attachments?: string[] (URLs)
│  │  ├─ reactions?: { emoji: count }
│  │  └─ isRead: boolean
│  │
│  ├─ Timestamps:
│  │  ├─ createdAt: timestamp
│  │  ├─ updatedAt: timestamp
│  │  └─ editedAt?: timestamp
```

#### 4. Orders Collection

```
Collection: orders
├─ Document ID: (order ID - UUID)
│
├─ Fields:
│  ├─ id: string
│  ├─ userId: string (indexed)
│  ├─ restaurantId: string (indexed)
│  ├─ conversationId?: string (reference to chat)
│  │
│  ├─ Items:
│  │  ├─ items: [
│  │  │   {
│  │  │     menuItemId: string;
│  │  │     name: string;
│  │  │     quantity: number;
│  │  │     price: number;
│  │  │     specialInstructions: string;
│  │  │   }
│  │  │ ]
│  │
│  ├─ Pricing:
│  │  ├─ subtotal: number
│  │  ├─ tax: number
│  │  ├─ deliveryFee: number
│  │  ├─ discount?: number
│  │  ├─ total: number
│  │
│  ├─ Delivery:
│  │  ├─ orderType: "delivery" | "pickup" | "dine-in"
│  │  ├─ deliveryAddress: {
│  │  │   street: string;
│  │  │   city: string;
│  │  │   coordinates: { lat, lng };
│  │  │ }
│  │  ├─ estimatedDeliveryTime: number (minutes)
│  │  ├─ actualDeliveryTime?: number
│  │
│  ├─ Status:
│  │  ├─ status: "pending" | "confirmed" | "preparing" | 
│  │  │           "ready" | "out-for-delivery" | "delivered" | "cancelled"
│  │  ├─ statusHistory: [
│  │  │   { status, timestamp, note }
│  │  │ ]
│  │
│  ├─ Payment:
│  │  ├─ paymentMethod: "card" | "cash" | "wallet"
│  │  ├─ paymentStatus: "pending" | "completed" | "failed"
│  │  ├─ transactionId: string
│  │  ├─ paymentTimestamp: timestamp
│  │
│  ├─ Additional:
│  │  ├─ specialRequests: string
│  │  ├─ trackingId?: string (for delivery)
│  │  ├─ driverId?: string
│  │  ├─ rating?: number (1-5)
│  │  ├─ review?: string
│  │
│  ├─ Timestamps:
│  │  ├─ createdAt: timestamp
│  │  ├─ confirmedAt?: timestamp
│  │  ├─ preparingAt?: timestamp
│  │  ├─ readyAt?: timestamp
│  │  ├─ deliveredAt?: timestamp
│  │  └─ cancelledAt?: timestamp
```

#### 5. Restaurants Collection

```
Collection: restaurants
├─ Document ID: (restaurant ID - UUID)
│
├─ Fields:
│  ├─ id: string
│  ├─ name: string (indexed)
│  ├─ description: string
│  │
│  ├─ Cuisine:
│  │  ├─ cuisines: string[] ("Italian", "Chinese", "Biryani", etc.)
│  │  ├─ tags: string[]
│  │
│  ├─ Location:
│  │  ├─ address: string
│  │  ├─ city: string
│  │  ├─ coordinates: { lat, lng }
│  │  ├─ deliveryRadius: number (km)
│  │
│  ├─ Hours:
│  │  ├─ hours: {
│  │  │   monday: { open: "10:00", close: "22:00" };
│  │  │   tuesday: { open: "10:00", close: "22:00" };
│  │  │   // ... etc
│  │  │ }
│  │  └─ holidays: string[]
│  │
│  ├─ Delivery:
│  │  ├─ averageDeliveryTime: number (minutes)
│  │  ├─ deliveryFee: number
│  │  ├─ minimumOrder: number
│  │  ├─ acceptsDelivery: boolean
│  │  ├─ acceptsPickup: boolean
│  │
│  ├─ Ratings:
│  │  ├─ rating: number (1-5)
│  │  ├─ totalReviews: number
│  │  ├─ reviewBreakdown: { 5: count, 4: count, ... }
│  │
│  ├─ Contact:
│  │  ├─ phone: string
│  │  ├─ email: string
│  │  ├─ website?: string
│  │
│  ├─ Media:
│  │  ├─ logo: string (URL)
│  │  ├─ banner: string (URL)
│  │  ├─ images: string[] (URLs)
│  │
│  ├─ Operations:
│  │  ├─ isOpen: boolean (computed)
│  │  ├─ acceptingOrders: boolean
│  │  ├─ verificationStatus: "pending" | "verified" | "rejected"
│  │
│  ├─ Timestamps:
│  │  ├─ createdAt: timestamp
│  │  ├─ updatedAt: timestamp
│  │  └─ lastOrderAt?: timestamp
```

#### 6. MenuItem Collection

```
Collection: restaurants/{restaurantId}/menu_items
├─ Document ID: (item ID - UUID)
│
├─ Fields:
│  ├─ id: string
│  ├─ name: string
│  ├─ description: string
│  ├─ category: string ("Pizza", "Pasta", "Salad", etc.)
│  ├─ price: number
│  │
│  ├─ Attributes:
│  │  ├─ available: boolean
│  │  ├─ vegetarian: boolean
│  │  ├─ vegan: boolean
│  │  ├─ gluten_free: boolean
│  │  ├─ spiceLevel: 0-5
│  │
│  ├─ Dietary:
│  │  ├─ allergens: string[]
│  │  ├─ calories?: number
│  │  ├─ ingredients: string[]
│  │
│  ├─ Media:
│  │  ├─ image: string (URL)
│  │
│  ├─ Customization:
│  │  ├─ modifiers?: [
│  │  │   {
│  │  │     name: string;
│  │  │     options: string[];
│  │  │     isRequired: boolean;
│  │  │   }
│  │  │ ]
│  │
│  ├─ Stats:
│  │  ├─ popularity: number
│  │  ├─ orderCount: number
│  │
│  └─ Timestamps:
│     ├─ createdAt: timestamp
│     └─ updatedAt: timestamp
```

#### 7. Sessions Collection

```
Collection: sessions
├─ Document ID: (session ID - UUID)
│
├─ Fields:
│  ├─ id: string
│  ├─ userId: string (indexed)
│  ├─ refreshToken: string
│  ├─ deviceInfo: {
│  │   userAgent: string;
│  │   ipAddress: string;
│  │   deviceType: "mobile" | "desktop" | "tablet";
│  │ }
│  ├─ lastActivityAt: timestamp
│  ├─ expiresAt: timestamp
│  └─ isActive: boolean
```

---

## 🤖 CHATBOT AS ENTRY POINT

### Chatbot Widget Architecture

```
┌─────────────────────────────────────────────┐
│     CHATBOT WIDGET (Always Visible)         │
│  Position: Bottom Right or Sidebar          │
├─────────────────────────────────────────────┤
│                                             │
│  Header:                                    │
│  [Restaurant Logo] [Restaurant Name]  [x]  │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Message Area (Scrollable):                 │
│  ┌───────────────────────────────────────┐ │
│  │ Bot: "Hi! 👋 What can I help you     │ │
│  │      with today?"                     │ │
│  │                                       │ │
│  │ [Browse Restaurants] [Promotions]    │ │
│  │ [Track Order] [My Account]           │ │
│  │                                       │ │
│  │ User: "Find me Italian food"         │ │
│  │ Bot: "I found 5 Italian restaurants" │ │
│  │ [Restaurant 1] [Restaurant 2] ...    │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Input Area:                                │
│  ┌─────────────────────┬─────────────────┐ │
│  │ Type your message.. │ [Attach] [Send] │ │
│  └─────────────────────┴─────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Intent Recognition System

```
User Input → NLP Processing → Intent Classification

Possible Intents & Flows:

1. BROWSE Intent
   "Show me Italian restaurants"
   ├─ Extract: Cuisine ("Italian")
   ├─ Extract: Location (if mentioned)
   └─ Return: Filtered restaurant list

2. ORDER Intent
   "I want to order pizza"
   ├─ Detect: Restaurant preference
   ├─ Collect: Items & Quantity
   ├─ Collect: Delivery address
   ├─ Redirect: Auth (if guest)
   └─ Process: Payment

3. RECOMMENDATION Intent
   "What would you suggest?"
   ├─ Extract: User preferences
   ├─ Query: AI Service
   ├─ Personalize: Based on history
   └─ Return: Top recommendations

4. TRACK Intent
   "Where is my order?"
   ├─ Verify: Auth required
   ├─ Fetch: Last active order
   ├─ Return: Real-time status
   └─ Display: Map (if available)

5. SUPPORT Intent
   "I have a problem with my order"
   ├─ Collect: Order ID
   ├─ Understand: Issue type
   ├─ Route: To support agent (future)
   └─ Offer: Solutions

6. ACCOUNT Intent
   "Update my profile"
   ├─ Verify: Auth required
   ├─ Offer: Options
   └─ Process: Changes
```

### Context Management

```
Chatbot Maintains Multi-Level Context:

1. SESSION Context (Guest)
   {
     guestSessionId: "session-xyz",
     browseHistory: ["rest-1", "rest-2"],
     currentBrowseFilters: {
       location: "Colombo",
       cuisine: "Italian",
       budget: "moderate"
     }
   }

2. CONVERSATION Context (Active)
   {
     conversationId: "conv-abc",
     currentIntent: "ORDER",
     collectedInfo: {
       restaurantId: "rest-123",
       items: [{ id, qty, price }],
       deliveryAddress: {...}
     }
   }

3. USER Context (Authenticated)
   {
     userId: "user-456",
     preferences: {
       favoriteCuisines: ["Italian", "Thai"],
       spiceLevel: 3,
       restrictions: ["gluten"]
     },
     savedAddresses: [...],
     orderHistory: [...]
   }

4. REQUEST Context (Current Turn)
   {
     userMessage: "Order 2 large pizzas",
     tokens: ["Order", "2", "large", "pizzas"],
     confidence: 0.95,
     metadata: {...}
   }
```

---

## 📱 GUEST MODE VS AUTHENTICATED MODE

### Feature Comparison Matrix

```
Feature                          | Guest | Authenticated
─────────────────────────────────┼───────┼───────────────
Browse Restaurants               |  ✅   |      ✅
View Menus & Prices              |  ✅   |      ✅
Search & Filter                  |  ✅   |      ✅
View Ratings & Reviews           |  ✅   |      ✅
Get AI Recommendations           |  ✅   |      ✅
Ask Questions (Chat)             |  ✅   |      ✅
Initiate Order                   |  ✅   |      ✅
─────────────────────────────────┼───────┼───────────────
Confirm & Pay Order              |  ❌   |      ✅
Make Reservations                |  ❌   |      ✅
Track Active Orders              |  ❌   |      ✅
View Order History               |  ❌   |      ✅
Save Preferences                 |  ❌   |      ✅
Use Saved Addresses              |  ❌   |      ✅
Use Saved Payment Methods        |  ❌   |      ✅
Get Personalized Recommendations |  ⚠️   |      ✅
Access Loyalty Points            |  ❌   |      ✅
Reorder Previous Items           |  ❌   |      ✅
─────────────────────────────────┼───────┼───────────────

Legend:
✅ = Full Access
⚠️  = Limited/Generic
❌ = Not Available
```

### Guest Session Lifecycle

```
Guest Visits → Generate Session
    │
    └─→ guestSessionId = UUID
        │
        ├─ Store in localStorage
        ├─ Send with all guest requests
        
    Browse Interactions (Session Active)
        │
        ├─ Visit restaurants: /api/chat/guest/browse
        ├─ View menus: /api/restaurants/{id}/menu
        ├─ Read reviews: /api/restaurants/{id}/reviews
        │
        └─ Session Context Builds:
           • browseHistory: [rest-1, rest-2, rest-3]
           • viewedItems: [item-1, item-2, item-5]
           • timeOnSite: calculated
           • deviceType: mobile/desktop

    Order Intent Detected
        │
        └─→ Offer Authentication
            [Sign In] [Create Account]
                │
                ├─→ After Auth:
                │   ├─ Merge session context
                │   ├─ Retrieve stored order cart
                │   ├─ Link to user account
                │   └─ Continue checkout
                │
                └─→ If Declined:
                    └─ Guest continues (limited)
                       Can browse but can't checkout

    Session Expires
        │
        ├─→ No activity for 24 hours
        ├─→ LocalStorage cleared
        └─→ Session archived in database
```

---

## 🛒 ORDER PROCESSING FLOW

### Complete Order Lifecycle State Machine

```
                          ┌─────────────┐
                          │  STARTED    │
                          └──────┬──────┘
                                 │
                    User selects items from menu
                                 │
                          ┌──────▼──────┐
                          │   BROWSING  │
                          └──────┬──────┘
                                 │
                   User adds item to cart / Order
                                 │
                          ┌──────▼──────┐
                          │   DRAFTING  │
                          └──────┬──────┘
                                 │
                   User confirms items, address, etc.
                                 │
                          ┌──────▼──────┐
                          │  REVIEWING  │
                          └──────┬──────┘
                                 │
                    User proceeds to payment
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            Payment Processing         [Cancel]
                    │                    │
        ┌───────────┘                    │
        │                                │
    Authorized?                          │
        │                                │
    ┌───┴───┐                            │
    │ ✅    │                            │
    │       └────────── Payment Failed──┐│
    │           │ Retry?       Error,  │└─→ [CANCELLED]
    │           │              Refund  │
    │           └─────────┬──────────────┘
    │                     │
    │         ┌───────────┴───────────┐
    │         │                       │
    │      [Retry]            [Decline]
    │         │                       │
    │    Continue             Refund & Cancel
    │         │                       │
    │  ┌──────▼──────┐         [CANCELLED]
    │  │   PENDING   │
    │  └──────┬──────┘
    │         │
    │  Restaurant receives order
    │  Backend notifies restaurant
    │         │
    │  ┌──────▼─────────┐
    │  │   CONFIRMED    │
    │  └──────┬─────────┘
    │         │
    │  Restaurant accepts & starts prep
    │         │
    │  ┌──────▼──────────┐
    │  │   PREPARING     │
    │  └──────┬──────────┘
    │         │
    │  Kitchen finishes food
    │         │
    │  ┌──────▼──────────┐
    │  │      READY      │
    │  └──────┬──────────┘
    │         │
    │  Driver assigned (if delivery)
    │         │
    │  ┌──────▼────────────────┐
    │  │  OUT_FOR_DELIVERY or  │
    │  │  READY_FOR_PICKUP     │
    │  └──────┬────────────────┘
    │         │
    │  Order delivered / picked up
    │         │
    │  ┌──────▼──────────┐
    │  │   DELIVERED  ✓  │
    │  └──────┬──────────┘
    │         │
    │  [Optional: Rating & Review]
    │         │
    │  ┌──────▼──────────┐
    │  │   COMPLETED  ✓  │
    │  └─────────────────┘
    │
    └─────────────────────────────────► [CANCELLED] (Anytime)
                                        [REFUNDED] (If applicable)
```

### Order Confirmation Email Template

```
Subject: Order Confirmed! #ORD-ABC123 from Pizzeria XYZ

Dear John,

✅ Your order has been confirmed!

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: ORD-ABC123
Restaurant: Pizzeria XYZ
Placed at: April 12, 2026 | 6:30 PM

Items:
• Large Pepperoni Pizza (No onions, +Cheese) x2 ... Rs. 1,800
• Garden Fresh Salad x1 ... Rs. 400

Subtotal: Rs. 2,200
Tax (5%): Rs. 110
Delivery Fee: Rs. 200
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: Rs. 2,510

Delivery Address:
123 Main Street, Colombo 7

Estimated Delivery: 35 minutes (by 7:05 PM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
1️⃣  Restaurant is confirming your order
2️⃣  Kitchen starts preparing
3️⃣  Driver is assigned
4️⃣  Your food is on the way!

Track Your Order: [Link to Tracking Page]

Questions? Chat with us: [Chat Link]

Thank you for your order! 😊

Best Regards,
Restaurant Chatbot Team
```

---

## 🔐 AUTHENTICATION & SESSION MANAGEMENT

### JWT Token Structure

```
Access Token (15 minutes expiry):
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "user-123",
    email: "john@example.com",
    role: "customer",
    iat: 1712964600,           // issued at
    exp: 1712965500            // expires in 15 mins
  },
  signature: "HMACSHA256(...)"
}

Refresh Token (7 days expiry):
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "user-123",
    iat: 1712964600,
    exp: 1713569400            // expires in 7 days
  },
  signature: "HMACSHA256(...)"
}
```

### Session Lifecycle

```
1. USER SIGNUP/SIGNIN
   POST /api/auth/signup or signin
      ↓
   Backend validates credentials
      ↓
   Generates tokens
      ↓
   Response: { accessToken, refreshToken, user }

2. FRONTEND STORAGE
   localStorage.setItem('accessToken', token)
   localStorage.setItem('refreshToken', token)
      ↓
   Set in Authorization header for all requests

3. MAKING AUTHENTICATED REQUESTS
   GET /api/orders
   Headers: { Authorization: "Bearer <accessToken>" }
      ↓
   Backend middleware verifies token
      ↓
   If valid → Process request
   If expired → Error 401

4. TOKEN REFRESH (When Access Token Expires)
   POST /api/auth/refresh
   Body: { refreshToken }
      ↓
   Backend validates refresh token
      ↓
   Issues new access token
      ↓
   Frontend updates localStorage
      ↓
   Retry original request with new token

5. LOGOUT
   POST /api/auth/logout
      ↓
   Backend invalidates refresh token (optional)
      ↓
   Frontend clears localStorage
      ↓
   Redirect to landing page
```

---

## ✨ KEY FEATURES & WORKFLOWS

### Feature Matrix with Workflows

#### 1. Smart Restaurant Search
```
User: "Show me cheap pizza places near me"
   ↓
NLP Processing:
├─ Intent: SEARCH
├─ Cuisine: Pizzas
├─ Budget: Low
├─ Location: User's geolocation (if allowed)

DB Query:
SELECT * FROM restaurants 
WHERE city = "Colombo" 
  AND cuisines CONTAINS "Pizza"
  AND minOrder < 500
ORDER BY rating DESC

Response:
[Restaurant 1] [Restaurant 2] [Restaurant 3]
"I found 3 pizza places under Rs. 500 minimum!"
```

#### 2. Intelligent Order Building
```
User: "2 large pepperoni pizzas, no onions, and a coke"
   ↓
NLP Extraction:
├─ Items: ["Large Pepperoni Pizza"]
├─ Quantity: 2
├─ Modifications: "no onions"
├─ Additional: "coke"

Validation:
├─ Check item exists in restaurant
├─ Check item is available
├─ Check minimum order met

Response:
"Got it! Adding to your cart:
• Large Pepperoni Pizza (No onions) x2 ... Rs. 1,800
Anything else?"
```

#### 3. Context-Aware Recommendations
```
System Tracks:
├─ Order History: Previous orders
├─ Browse History: Restaurants viewed
├─ User Preferences: Cuisine likes
├─ Time of Day: What users order when

AI Generates:
├─ "You often order from Italian places..."
├─ "Based on your tastes, try this..."
├─ "Your favorite restaurant is offering 15% off!"

Personalization:
├─ Vegetarian options (if user history shows)
├─ Spice level adjustments
├─ Budget-appropriate suggestions
```

#### 4. Real-time Order Tracking
```
User: "Where's my order?"
   ↓
Backend Fetches Current Status
   ↓
Returns:
PENDING: "Restaurant is confirming"
CONFIRMED: "Order confirmed! Kitchen is preparing"
PREPARING: "🍳 Your food is being prepared"
READY: "Your order is ready!"
OUT_FOR_DELIVERY: "🚗 On the way! [Live Map]"
DELIVERED: "✅ Delivered!"

Notifications:
├─ Status update via Push
├─ Email notification
├─ In-app chat message
└─ SMS (future feature)
```

---

## 🔌 INTEGRATION POINTS

### Third-Party Integrations

```
1. PAYMENT GATEWAY (Stripe / PayPal)
   ├─ When: User confirms order
   ├─ Flow: 
   │  ├─ Prepare payment request
   │  ├─ Send to Stripe API
   │  ├─ Receive payment confirmation
   │  └─ Update order status
   ├─ Webhook: Payment confirmation
   └─ Error Handling: Retry logic, Refunds

2. EMAIL SERVICE (SendGrid / SES)
   ├─ When: Order confirmation, status updates, support
   ├─ Triggered Events:
   │  ├─ Order confirmed → Send confirmation email
   │  ├─ Order delivered → Send receipt
   │  └─ Support ticket → Send acknowledgment
   └─ Template System: Dynamic variables

3. MAPS & LOCATION (Google Maps)
   ├─ When: Setting delivery address, tracking
   ├─ Features:
   │  ├─ Address autocomplete
   │  ├─ Geocoding
   │  ├─ Distance calculation
   │  ├─ ETA calculation
   │  └─ Live tracking map
   └─ API: Google Maps API

4. NOTIFICATIONS (Firebase Cloud Messaging)
   ├─ When: Order status updates, promotions
   ├─ Types: Push notifications, In-app alerts
   └─ Schedule: Real-time + Scheduled

5. ANALYTICS (Google Analytics / Mixpanel)
   ├─ What: User behavior, order patterns, revenue
   ├─ Tracks:
   │  ├─ User journey from browse to order
   │  ├─ Conversion rates
   │  ├─ Popular restaurants & items
   │  └─ Revenue per user
   └─ Purpose: Business insights

6. AI/LLM (Google Vertex AI - Gemini)
   ├─ When: Every user message
   ├─ Usage:
   │  ├─ Intent detection
   │  ├─ Entity extraction
   │  ├─ Response generation
   │  └─ Recommendations
   └─ Rate Limiting: Quota management

7. SMS PROVIDER (Twilio) - Future
   ├─ When: Order updates via SMS
   └─ Use Case: Feature phone users

8. RESTAURANT MANAGEMENT SYSTEM - Future
   ├─ When: Sending orders, menu updates
   └─ Protocol: REST API / Webhooks
```

---

## 📅 IMPLEMENTATION PHASES

### Phase 1: Foundation (Weeks 1-2)
**Goals:** Guest browsing + chatbot UI

- [ ] Chatbot widget development
- [ ] Guest session management
- [ ] Restaurant browse endpoint
- [ ] Basic NLP for intent detection
- [ ] UI/UX for landing page

**Milestones:**
- Guest can browse restaurants
- Chatbot responds to queries
- Restaurant filtering works

### Phase 2: Authentication & Checkout (Weeks 3-4)
**Goals:** Order placement flow

- [ ] Improve auth modal (overlay)
- [ ] Session merge logic (guest→auth)
- [ ] Order creation API
- [ ] Basic cart management
- [ ] Frontend order UI

**Milestones:**
- Users can sign up through chatbot
- Order intent triggers auth
- Orders save to database

### Phase 3: Payment & Notifications (Weeks 5-6)
**Goals:** Payment processing

- [ ] Integrate payment gateway (Stripe)
- [ ] Order confirmation emails
- [ ] Push notifications setup
- [ ] Email templates

**Milestones:**
- Users can pay for orders
- Confirmation emails sent
- Order status notifications working

### Phase 4: Tracking & Advanced Features (Weeks 7-8)
**Goals:** Order tracking + AI improvements

- [ ] Live tracking page
- [ ] GeminiService optimization
- [ ] Restaurant integration
- [ ] Real-time status updates (WebSockets)

**Milestones:**
- Users can track orders
- AI generates better recommendations
- Real-time updates work

### Phase 5: Optimization & Scaling (Weeks 9-10)
**Goals:** Performance + feature completeness

- [ ] Caching layer (Redis)
- [ ] Database optimization
- [ ] Load testing
- [ ] Security hardening
- [ ] Additional features (loyalty, favorites)

---

## 🔒 SECURITY CONSIDERATIONS

### Security Measures

```
1. AUTHENTICATION SECURITY
   ├─ Password Hashing: bcryptjs (salt rounds: 10)
   ├─ JWT Secrets: Strong random strings
   ├─ Token Expiry: Access (15 min), Refresh (7 days)
   └─ HTTPS Only: All API calls

2. DATA PROTECTION
   ├─ SSL/TLS: All data in transit
   ├─ Firestore Security Rules: Row-level access control
   ├─ PII Encryption: Sensitive data at rest
   ├─ No PCI Compliance: Use payment gateway tokens
   └─ GDPR Compliance: Data export/deletion available

3. API SECURITY
   ├─ Rate Limiting: 100 requests/minute per IP
   ├─ Input Validation: Sanitize all inputs
   ├─ CORS: Restricted to frontend domain
   ├─ Headers: Security headers (HSTS, CSP, XSS)
   └─ Authorization: Verify userId on all endpoints

4. FRAUD PREVENTION
   ├─ Payment Verification: CVV, 3D Secure
   ├─ Unusual Pattern Detection: (future)
   ├─ IP Verification: Track suspicious logins
   └─ Email Verification: For new accounts

5. AUDIT & LOGGING
   ├─ API Request Logs: All requests logged
   ├─ Error Logs: Detailed error tracking
   ├─ User Action Logs: Order history, payments
   └─ Security Logs: Failed logins, permission errors

6. SENSITIVE ENDPOINTS
   ├─ POST /api/orders/create: Auth + Rate limit
   ├─ POST /api/payments/process: Auth + Verification
   ├─ DELETE /api/users/:id: Auth + Password verify
   └─ GET /api/admin/*: Admin role required
```

---

## ⚡ PERFORMANCE & SCALABILITY

### Performance Optimization Strategies

```
1. CACHING STRATEGY
   ├─ Firestore Cache: 30-minute TTL for restaurants
   ├─ Redis Cache:
   │  ├─ User sessions: 24 hours
   │  ├─ Popular restaurants: 1 hour
   │  ├─ Menu items: 30 minutes
   │  └─ Rate limit counters: 1 minute
   └─ Browser Cache: Static assets (CSS, JS, images)

2. DATABASE OPTIMIZATION
   ├─ Indexing: Created for all queries
   │  ├─ users.email (unique)
   │  ├─ orders.userId + createdAt
   │  ├─ messages.conversationId + createdAt
   │  └─ restaurants.coordinates (geo)
   ├─ Query Optimization: Select only needed fields
   └─ Connection Pooling: Reuse connections

3. API OPTIMIZATION
   ├─ Response Compression: gzip enabled
   ├─ Pagination: 20 items default, 50 max
   ├─ Lazy Loading: Images, reviews loaded on demand
   └─ Batch Requests: Combine multiple calls

4. FRONTEND OPTIMIZATION
   ├─ Code Splitting: Routes split into chunks
   ├─ Lazy Loading: Components loaded on route change
   ├─ Image Optimization: WebP format, responsive sizes
   ├─ CDN: Static assets served from global CDN
   └─ Service Worker: Offline support

5. SCALING STRATEGY
   ├─ Horizontal: Multiple Node.js instances
   ├─ Load Balancer: Distribute traffic
   ├─ Database Sharding: Partition by userId (future)
   ├─ Microservices: Split by domain (future)
   └─ Message Queue: Kafka for async jobs (future)

6. MONITORING
   ├─ Analytics: Google Analytics for user tracking
   ├─ Error Tracking: Sentry for exception handling
   ├─ Performance Monitoring: Web Vitals
   ├─ Infrastructure: Cloud monitoring dashboards
   └─ Alerts: Automated notifications for issues
```

---

## 📊 Success Metrics

### Key Performance Indicators

```
1. USER ENGAGEMENT
   ├─ Daily Active Users (DAU)
   ├─ Monthly Active Users (MAU)
   ├─ Average session duration
   ├─ Chat message count
   └─ Return rate

2. CONVERSION METRICS
   ├─ Guest → Authenticated conversion: Target 30%
   ├─ Browse → Order conversion: Target 15%
   ├─ Average order value: Target Rs. 2,500+
   ├─ Cart abandonment rate: Target < 40%
   └─ Payment success rate: Target > 98%

3. OPERATIONAL METRICS
   ├─ Average order delivery time: < 40 mins
   ├─ Restaurant response time: < 2 mins
   ├─ Chatbot response time: < 500ms
   ├─ Customer satisfaction: Target 4.5/5 stars
   └─ Support ticket resolution time: < 1 hour

4. TECHNICAL METRICS
   ├─ API uptime: Target 99.9%
   ├─ Page load time: < 2 seconds
   ├─ Chatbot latency: < 500ms
   ├─ Payment processing: < 3 seconds
   └─ Error rate: < 0.1%

5. REVENUE METRICS
   ├─ Total order value
   ├─ Average revenue per user
   ├─ Customer acquisition cost
   ├─ Customer lifetime value
   └─ Commission/margin per order
```

---

## 🎯 CONCLUSION

The **Agentic Restaurant Chatbot** represents a paradigm shift in food ordering interfaces. By making the chatbot the primary entry point, we:

✅ **Lower friction**: No login walls prevent guest browsing  
✅ **Increase engagement**: Conversational UI is more interactive  
✅ **Enable AI**: Intelligent routing and recommendations  
✅ **Streamline checkout**: One-conversation journey from browse to deliver  
✅ **Reduce development**: Single interface for all interactions  

### Next Steps:
1. Review and approve architecture
2. Set up development environment
3. Begin Phase 1 implementation (Guest browsing)
4. Conduct UI/UX testing with beta users
5. Iterate based on feedback

---

**Document Version:** 1.0  
**Last Updated:** April 12, 2026  
**Status:** Ready for Development  
**Author:** Development Team

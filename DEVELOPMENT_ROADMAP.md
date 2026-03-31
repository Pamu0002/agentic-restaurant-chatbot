# Agentic Restaurant Chatbot - Development Roadmap

## Project Overview
- **Name**: Agentic Restaurant Chatbot
- **Tech Stack**: React + TypeScript (Frontend), Node.js/Express (Backend)
- **Start Date**: March 11, 2026
- **Focus**: Authentication first, then features

---

## Phase 1: Setup & Infrastructure ✅ [IN PROGRESS]

### Step 1.1: Create Industry-Standard Folder Structure
```
agentic-restaurant-chatbot/
├── apps/                          # All runnable applications
│   ├── web/                       # React web app (PWA)
│   └── mobile/                    # React Native (future)
├── packages/                      # Shared code
│   ├── shared-ui/                 # Shared UI components
│   ├── shared-types/              # TypeScript types
│   └── shared-utils/              # Utilities & helpers
├── services/                      # Backend services
│   ├── api/                       # REST API (Express)
│   └── ai/                        # AI service (Python)
├── docs/                          # Documentation
├── scripts/                       # Build & deployment scripts
├── package.json                   # Monorepo root
└── tsconfig.json                  # TypeScript config
```

### Step 1.2: Install Dependencies
- Monorepo setup (npm workspaces)
- Build tools (Vite)
- Testing (Jest, React Testing Library)

---

## Phase 2: Frontend Development - Authentication 🎯 [STARTING]

### Step 2.1: Create `apps/web` with Vite + React + TypeScript
- [ ] Initialize React project
- [ ] Set up TypeScript config
- [ ] Configure build tools

### Step 2.2: Build Authentication UI
- [ ] Google OAuth integration
- [ ] Sign-in page
- [ ] Sign-up page
- [ ] Auth callback handler

### Step 2.3: Create Auth Logic & State Management
- [ ] Auth service layer
- [ ] Context API setup
- [ ] Token storage (localStorage, cookies)
- [ ] Auth guards/middleware

### Step 2.4: Test Authentication Flow
- [ ] Google OAuth flow
- [ ] Token verification
- [ ] Session persistence

---

## Phase 3: Backend Development (After Frontend Auth)

### Step 3.1: Create `services/api` (Express)
- [ ] Server setup
- [ ] Routes structure
- [ ] Middleware (CORS, auth, logging)

### Step 3.2: Authentication Endpoints
- [ ] POST `/api/auth/google` - Token verification
- [ ] POST `/api/auth/verify` - Check token
- [ ] POST `/api/auth/logout` - Clear session

### Step 3.3: Database Setup
- [ ] Choose database (MongoDB/PostgreSQL)
- [ ] User schema
- [ ] Connection pool

---

## Phase 4: Core Features (After Auth)
- [ ] Restaurant listing
- [ ] Search & filters
- [ ] Reservation system
- [ ] Chat interface

---

## Current Status

**TODAY (March 11, 2026):**
- [x] Define project scope & tech stack
- [x] Create development roadmap
- [ ] **NEXT**: Create industry-standard folder structure (STEP 1.1)

---

## Development Order

1. **✅ Plan** - Define structure and roadmap
2. **→ Folder Setup** - Create clean directory structure
3. **→ Frontend Init** - Vite + React + TypeScript
4. **→ Auth UI** - Sign-in and sign-up pages
5. **→ Auth Logic** - Google OAuth + session management
6. **→ Backend Init** - Express API server
7. **→ Auth Endpoints** - Backend verification
8. **→ Integration** - Connect frontend ↔ backend
9. **→ Testing** - End-to-end auth flow
10. **→ Features** - Restaurant listing, search, etc.

---

## Key Principles

✅ **Industry Standard**: Follow best practices for monorepo structure
✅ **Type Safe**: Full TypeScript across frontend
✅ **Modular**: Shared code in `packages/`
✅ **Testable**: Unit and integration tests from the start
✅ **Documented**: Clear comments and setup guides

---

## Next Action

Ready to create the folder structure? I'll:
1. Create clean `apps/`, `packages/`, `services/` folders
2. Initialize `apps/web` with Vite + React + TypeScript
3. Set up basic project structure
4. Start building authentication UI

**Proceed?** (Yes/No)

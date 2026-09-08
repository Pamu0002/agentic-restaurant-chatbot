# Multi-Portal Architecture Complete Guide

## Overview

This document describes the complete multi-portal architecture for the Agentic Restaurant Chatbot platform. The system is built as a monorepo with **4 active portals + 1 scaffolded Phase 2 portal**, each serving distinct user personas and business functions.

## Architecture Decision Rationale

**Why Multiple Portals?**

Instead of building a single application with role-based routing, we created separate portals because:

1. **User Experience**: Each portal is optimized for its specific user's workflow and device
2. **Performance**: Smaller bundles, faster load times, tab isolation
3. **Complexity Management**: Cleaner codebases per portal (no feature flags/conditional rendering)
4. **Independent Deployment**: Each portal can be deployed/updated independently
5. **Team Organization**: Different teams can own different portals
6. **Analytics Separation**: Isolated user behavior tracking per portal

## Portal Architecture

### 1. Customer Portal (`@restaurant/customer-web`)
**Port:** 5173  |  **Theme:** Red (#ff6b6b)  |  **Role:** Any authenticated user

**Purpose:** User-facing PWA for restaurant discovery, reservations, and AI-powered dining assistance.

**Key Features:**
- Restaurant search and discovery
- Reservation management (book, modify, cancel)
- Real-time order tracking
- AI chatbot for dining recommendations
- Progressive Web App (offline support)
- Responsive design (mobile-first)

**Routes:** (TODO - to be implemented)
- `/` - Home/Dashboard
- `/search` - Restaurant discovery
- `/reservations` - My reservations
- `/chat` - AI dining assistant
- `/profile` - User profile (authenticated)

**Tech Stack:**
- React 18 + Vite
- React Router v6
- Axios + TanStack Query (data fetching)
- Framer Motion (animations)
- Zustand (state management)

**Dependencies in package.json:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "axios": "^1.5.0",
  "@tanstack/react-query": "^5.0.0",
  "framer-motion": "^10.16.0",
  "zustand": "^4.4.1"
}
```

---

### 2. Provider Portal (`@restaurant/provider-web`)
**Port:** 5174  |  **Theme:** Teal (#4ecdc4)  |  **Role:** `owner` only

**Purpose:** Core restaurant management interface for quick operational tasks.

**Key Features:**
- Reservation management (accept/reject/modify)
- Menu management (CRUD operations)
- Table management (capacity, availability)
- Real-time restaurant settings
- Staff management
- Quick operational dashboard

**Routes:** (TODO - to be implemented)
- `/dashboard` - Operations overview
- `/reservations` - Incoming/confirmed reservations
- `/menu` - Menu editor and management
- `/tables` - Table configuration and availability
- `/settings` - Restaurant settings and staff

**Auth Guard:**
```typescript
const isProvider = user?.role === 'owner';
// Only owners can access this portal
```

**Tech Stack:** Same as Customer Portal (React 18, Vite, Router, Query)

---

### 3. Provider Analytics Portal (`@restaurant/provider-analytics`)
**Port:** 5175  |  **Theme:** Purple (#9b59b6)  |  **Role:** `owner` only

**Purpose:** Business intelligence and analytics dashboard for restaurant owners showing revenue, customer behavior, and performance metrics.

**Differentiation from Provider Portal:**
- **Data-Heavy**: Hundreds of charts and visualizations
- **Device**: Optimized for tablet/desktop (not mobile-first)
- **Real-time Updates**: Continuous streaming of metrics
- **Export Functionality**: Reports, CSV, PDF exports
- **Separate Build**: Reduces Provider Portal bundle size

**Key Features:**
- Revenue analytics (daily, weekly, monthly, yearly)
- Customer insights (repeat customers, demographics)
- Performance metrics (reservation conversion, table turnover)
- Peak hours analysis
- Menu performance (popular dishes)
- Reports and data export

**Routes:** (TODO - to be implemented)
- `/dashboard` - Analytics overview
- `/revenue` - Revenue breakdown and trends
- `/customers` - Customer insights and behavior
- `/performance` - Operational performance metrics
- `/reports` - Generate and download reports

**Auth Guard:**
```typescript
const isProvider = user?.role === 'owner';
// Only owners can access analytics
```

**Tech Stack:**
- React 18 + Vite (same as others)
- **+ Recharts** (^2.10.3) - Data visualization
- **+ date-fns** (^2.30.0) - Time-series data handling

---

### 4. Admin Portal (`@restaurant/admin-web`)
**Port:** 5176  |  **Theme:** Red (#e74c3c)  |  **Role:** `admin` only

**Purpose:** System administration for platform maintainers. Manage users, restaurants, approvals, system settings, and audit logs.

**Key Features:**
- User management (create, deactivate, role assignment)
- Restaurant management (onboarding, deletion, restrictions)
- Approval workflow (new restaurant applications)
- System settings and feature flags
- Audit logs and security monitoring
- Compliance and reporting

**Routes:** (TODO - to be implemented)
- `/dashboard` - Admin overview
- `/users` - User management
- `/restaurants` - Restaurant management and verification
- `/approvals` - Pending restaurant applications
- `/settings` - System configuration
- `/audit-logs` - Security and compliance logs

**Auth Guard:**
```typescript
const isAdmin = user?.role === 'admin';
// Only admins can access admin portal
```

**Tech Stack:** Same as Customer Portal (React 18, Vite, Router, Query)

---

### 5. Support Portal (`@restaurant/support-web`)
**Port:** 5177  |  **Theme:** Blue (#3498db)  |  **Role:** admin/support (Phase 2)

**Purpose:** DEFERRED TO PHASE 2 - Customer support operations, ticket management, content moderation, and dispute resolution.

**Planned Features (Phase 2):**
- Support ticket management
- Customer communication interface
- Content moderation tools
- Dispute resolution workflow
- Customer feedback aggregation

**Current Status:** Structure scaffolded, marked "Coming Soon"

**Auth Guard:** Placeholder - to be implemented in Phase 2

---

## Communication Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Portal Layer                              │
├───────────────┬──────────────┬──────────────┬──────────────┤
│  Customer     │  Provider    │  Provider    │  Admin       │
│  Portal       │  Portal      │  Analytics   │  Portal      │
│  (:5173)      │  (:5174)     │  (:5175)     │  (:5176)     │
└───────────────┴──────────────┴──────────────┴──────────────┘
                    ▼ ▼ ▼ ▼ (All use same API proxy)
┌─────────────────────────────────────────────────────────────┐
│              API Proxy (Vite Dev Server)                     │
│          /api → http://localhost:5000                        │
└─────────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Backend API Service (Express.js)                     │
│              Port 5000 - services/api                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth Routes  │  │ User Routes  │  │  Other APIs  │       │
│  │ (JWT/OAuth)  │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (Polyglot)                       │
├───────────────┬──────────────┬──────────────┬──────────────┤
│  Firestore    │  MongoDB     │  Neo4j       │  Vertex AI   │
│  (Auth,       │  (Analytics, │  (Recom-     │  Vector      │
│   Sessions)   │   Logs)      │   mendations)│  Search      │
└───────────────┴──────────────┴──────────────┴──────────────┘
```

### Authentication Flow

```
Portal (any)
    │
    ├─→ Check localStorage for JWT token
    │
    ├─→ If valid: Attach to requests as Authorization header
    │
    ├─→ If expired: Use refresh token to get new access token
    │
    └─→ If invalid: Redirect to login (handled by @restaurant/shared AuthContext)
```

---

## Shared Code Layer (`@restaurant/shared`)

### Purpose
Single source of truth for code reused across all 5 portals.

### Exports

```typescript
// AuthContext and hooks
export { AuthContext, AuthProvider } from './contexts/AuthContext';
export { useAuth } from './hooks/useAuth';

// API client configuration
export { apiClient } from './services/apiClient';

// TypeScript types
export type { User, Role, AuthResponse } from './types/auth';

// Utility functions
export { formatDate, validateEmail, ... } from './utils';
```

### TypeScript Path Mapping (in all portals' tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@restaurant/shared": ["../../shared/src"]
    }
  }
}
```

### Usage in Portals

```typescript
// In customer-web/src/App.tsx
import { useAuth, AuthContext } from '@restaurant/shared';

function App() {
  const { isAuthenticated, user } = useAuth();
  // ...
}
```

---

## Development Workflow

### Start All Portals Together

```bash
# Install dependencies for all packages
pnpm install

# Start all portals + API backend concurrently
pnpm dev:all
```

**What this does:**
- Customer Portal: http://localhost:5173
- Provider Portal: http://localhost:5174
- Provider Analytics: http://localhost:5175
- Admin Portal: http://localhost:5176
- Support Portal: http://localhost:5177
- API Backend: http://localhost:5000

### Start Individual Portal

```bash
# For development of a specific portal
cd packages/@restaurant/customer-web
pnpm dev

# Or from root
pnpm --filter @restaurant/customer-web dev
```

### API Backend Only

```bash
cd services/api
pnpm dev
```

---

## File Structure Summary

```
packages/@restaurant/
├── shared/                               # Shared code layer
│   ├── src/
│   │   ├── contexts/AuthContext.tsx     # Auth provider
│   │   ├── services/apiClient.ts        # Axios instance
│   │   ├── types/auth.ts                # TypeScript types
│   │   └── utils/                       # Shared utilities
│   └── package.json
│
├── customer-web/                         # Portal 1: Customers
│   ├── src/
│   │   ├── App.tsx                      # Role guard: any auth user
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── vite-env.d.ts
│   │   ├── pages/                       # HomePage, SearchPage, etc.
│   │   ├── components/                  # UI components
│   │   └── services/                    # Portal-specific services
│   ├── index.html
│   ├── vite.config.ts                   # Port 5173
│   ├── tsconfig.json
│   └── package.json
│
├── provider-web/                         # Portal 2: Restaurant Owners (Management)
│   ├── src/
│   │   ├── App.tsx                      # Role guard: owner only
│   │   ├── pages/                       # Dashboard, Reservations, Menu, Tables, Settings
│   │   ├── components/
│   │   └── services/
│   ├── vite.config.ts                   # Port 5174
│   └── [other files]
│
├── provider-analytics/                   # Portal 3: Restaurant Owners (Analytics)
│   ├── src/
│   │   ├── App.tsx                      # Role guard: owner only
│   │   ├── pages/                       # Analytics, Revenue, Customers, Performance, Reports
│   │   ├── components/                  # Recharts-based charts
│   │   └── services/
│   ├── vite.config.ts                   # Port 5175
│   └── [other files]
│
├── admin-web/                            # Portal 4: System Admins
│   ├── src/
│   │   ├── App.tsx                      # Role guard: admin only
│   │   ├── pages/                       # Users, Restaurants, Approvals, Settings, AuditLogs
│   │   ├── components/
│   │   └── services/
│   ├── vite.config.ts                   # Port 5176
│   └── [other files]
│
└── support-web/                          # Portal 5: Support Team (Phase 2 - Scaffolded)
    ├── src/
    │   ├── App.tsx                      # Marked "Phase 2 - Coming Soon"
    │   ├── pages/                       # Placeholder routes
    │   ├── components/
    │   └── services/
    ├── vite.config.ts                   # Port 5177
    └── [other files]

services/
├── api/                                  # Backend Express.js service
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── auth.ts (11 endpoints)
│   │   │   └── [other routes]
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   └── [other services]
│   │   ├── models/
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   └── rateLimiter.ts
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts (Firestore)
│   │   │   ├── SessionRepository.ts (Firestore)
│   │   │   └── AuditLogRepository.ts (Firestore)
│   │   ├── config/
│   │   │   └── database.ts (Firestore Admin SDK)
│   │   └── utils/
│   └── package.json
│
└── ai/                                   # AI service (separate)
    ├── app/
    │   ├── main.py
    │   ├── agents/
    │   ├── api/
    │   └── database/
    └── requirements.txt
```

---

## Role-Based Access Control

### User Roles

```typescript
type Role = 'customer' | 'owner' | 'admin' | 'support';
```

### Portal Access Matrix

| Role | Customer | Provider | Analytics | Admin | Support |
|------|----------|----------|-----------|-------|---------|
| customer | ✅ | ❌ | ❌ | ❌ | ❌ |
| owner | ❌ | ✅ | ✅ | ❌ | ❌ |
| admin | ❌ | ❌ | ❌ | ✅ | ✅* |
| support | ❌ | ❌ | ❌ | | ✅ |

*Support portal access deferred to Phase 2

### Implementation (in App.tsx)

```typescript
// Customer Portal
export default function App() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <CustomerRoutes />;
}

// Provider Portal
export default function App() {
  const { user } = useAuth();
  const isProvider = user?.role === 'owner';
  if (!isProvider) return <Navigate to="/" replace />;
  return <ProviderRoutes />;
}

// Admin Portal
export default function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminRoutes />;
}
```

---

## Port Configuration

### Development Ports

```
5000 - Backend API (Express.js)
5173 - Customer Portal (Vite)
5174 - Provider Portal (Vite)
5175 - Provider Analytics (Vite)
5176 - Admin Portal (Vite)
5177 - Support Portal (Vite)
```

### Vite Proxy Configuration (All Portals)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5173, // Different per portal
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Database Architecture (Polyglot Persistence)

### Firestore (Primary - Real-time Auth & Users)
- **collections:**
  - `users` - User profiles, roles, authentication data
  - `sessions` - Active JWT sessions
  - `auditLogs` - Security and compliance tracking

- **Fields (camelCase):**
  - `userId`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt`

### MongoDB Atlas (Analytics & Logs)
- **collections:**
  - `analytics` - Reservation, revenue, customer behavior data
  - `operationalLogs` - System logs

### Neo4j Aura (Recommendations)
- **nodes:** Restaurants, Users, Cuisines, Preferences
- **edges:** User→Restaurants (visited, liked), recommendations

### Vertex AI Vector Search (AI Embeddings)
- **vectors:** Restaurant descriptions, menu items for semantic search

---

## Next Steps

### Phase 1 (Current - Portal Setup) ✅ COMPLETE
- [x] Architecture decision making
- [x] Portal structure scaffolding
- [x] Configuration files created
- [x] Role-based routing foundation

### Phase 1 (Remaining - Page Implementation)
- [ ] Implement Customer Portal pages
- [ ] Implement Provider Portal pages
- [ ] Implement Provider Analytics pages
- [ ] Implement Admin Portal pages
- [ ] Connect all portals to @restaurant/shared AuthContext
- [ ] Run integration tests

### Phase 2 (Support Portal)
- [ ] Define support team features
- [ ] Implement Support Portal pages
- [ ] Ticket management system
- [ ] Content moderation tools

---

## Key Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| 5 Separate Portals | UX optimization, performance, team scalability |
| Monorepo with pnpm | Single codebase, shared dependencies, faster dev |
| @restaurant/shared | DRY principle, AuthContext reuse, type consistency |
| Vite for all portals | Fast HMR, small dev builds, optimized production bundles |
| Firestore primary DB | Real-time capabilities, GCP ecosystem, NoSQL flexibility |
| JWT + Refresh tokens | Stateless auth, security, mobile-friendly |
| Role-based in App.tsx | Security-first, prevents accidental access, clear intent |

---

## Troubleshooting

**Portal doesn't load?**
1. Ensure API backend is running on port 5000
2. Check `pnpm dev:all` is running all services
3. Verify auth token in localStorage

**Styles are broken?**
1. Each portal has its own `index.css` with CSS variables
2. Check color theme in browser dev tools

**TypeScript errors about @restaurant/shared?**
1. Verify path mapping in `tsconfig.json`
2. Run `pnpm install` to link packages
3. Check shared layer is exporting types

---

## Summary

The multi-portal architecture provides:
- ✅ **Scalability** - Each portal independent, can scale separately
- ✅ **Maintainability** - Clear separation of concerns, easier testing
- ✅ **Performance** - Smaller bundles, faster builds, optimized per use case
- ✅ **Flexibility** - Supports future portal additions (Support Portal Phase 2)
- ✅ **Security** - Role-based access enforced at portal level
- ✅ **Developer Experience** - Monorepo simplicity + individual portal autonomy

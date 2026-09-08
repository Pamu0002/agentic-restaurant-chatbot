# 📚 Monorepo Complete Learning Guide

## What is a Monorepo?

A **Monorepo** (Mono Repository) is ONE Git repository containing MULTIPLE projects/packages that are related but independent.

### Simple Analogy 🏢

**Before (Separate Repos):**
```
GitHub
├── restaurant-mobile-repo/
├── restaurant-web-repo/
├── restaurant-api-repo/
└── restaurant-ai-repo/

Problems:
❌ 4 separate Git projects
❌ Code duplication (types, utils)
❌ Hard to share code
❌ Complex deployment
```

**After (Monorepo):**
```
GitHub
└── agentic-restaurant-chatbot/  (ONE repo)
    ├── packages/
    │   ├── mobile/
    │   ├── web/
    │   └── shared/
    ├── services/
    │   ├── api/
    │   └── ai/
    
Benefits:
✅ ONE Git repo to maintain
✅ Shared code in "shared/"
✅ Single deployment pipeline
✅ Easier refactoring
```

---

## Why Use Monorepo?

### 1. **Shared Code (DRY Principle)**

```
Without Monorepo:
- Mobile needs types → TypeScript definitions in mobile/
- Web needs same types → Duplicate code in web/
- API defines types → DUPLICATE code in api/

With Monorepo:
- Types defined ONCE in packages/shared/types/
- Mobile, Web, API all IMPORT from shared/types/
- Update once = updated everywhere
```

### 2. **Atomic Commits**

```
Without Monorepo:
- Change API endpoint
- Update mobile to call new endpoint
- Update web to call new endpoint
- 3 separate commits, 3 PRs, confusion!

With Monorepo:
- Change API endpoint
- Update mobile
- Update web
- 1 atomic commit = no inconsistencies
```

### 3. **Shared Utilities**

```
Auth function needed in:
- Mobile app
- Web app
- To validate in backend

With Monorepo:
packages/shared/auth/
  ├── validateToken.ts  (used by all)
  ├── refreshToken.ts   (used by all)
  └── types.ts          (used by all)
```

### 4. **Easier State Management**

```
Global app state shared:
- User auth state
- Theme preferences
- API configuration

All packages/mobile and packages/web
can import from packages/shared/store/
```

---

## The New Structure Explained

### **Root Level**
```
agentic-restaurant-chatbot/
├── packages/              ← Shared, reusable code
├── services/              ← Backend services (API, AI)
├── docs/                  ← Documentation
├── pnpm-workspace.yaml    ← Workspace configuration
├── docker-compose.yml     ← Local dev environment
└── package.json           ← Root package (scripts only)
```

---

## **packages/** - Shared Code

This folder contains code that MULTIPLE projects use.

### **packages/shared/** - Common utilities
```
packages/shared/
├── types/                 ← TypeScript types for ALL apps
│   ├── user.types.ts      ← User interface
│   ├── restaurant.types.ts  ← Restaurant data structure
│   └── api.types.ts       ← API response types
│
├── utils/                 ← Reusable functions
│   ├── auth.ts            ← Login/logout logic
│   ├── api.ts             ← API call helper
│   └── validation.ts      ← Form validation
│
├── ui/                    ← UI components used in both web & mobile
│   ├── Button.tsx         ← Can be React or React Native
│   ├── Input.tsx
│   └── Card.tsx
│
└── package.json           ← Dependencies for shared code
```

**Usage in other packages:**
```typescript
// In mobile app
import { User } from '@restaurant/shared/types'
import { validateEmail } from '@restaurant/shared/utils'

// In web app
import { User } from '@restaurant/shared/types'
import { validateEmail } from '@restaurant/shared/utils'

// In API
import type { User } from '@restaurant/shared/types'
```

### **packages/mobile/** - React Native App
```
packages/mobile/
├── src/
│   ├── screens/            ← Mobile screens (full pages)
│   │   ├── HomeScreen.tsx  ← Home page
│   │   ├── LoginScreen.tsx ← Login page
│   │   └── ProfileScreen.tsx
│   │
│   ├── components/         ← Reusable mobile components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── services/           ← API calls specific to mobile
│   │   └── restaurantService.ts
│   │
│   ├── contexts/           ← State management
│   │   └── AuthContext.tsx
│   │
│   └── App.tsx             ← App entry point
│
├── app.json                ← Expo config
└── package.json            ← Mobile dependencies
```

### **packages/web/** - React Web/PWA App
```
packages/web/
├── src/
│   ├── pages/              ← Web pages
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── components/         ← Reusable web components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── services/           ← API calls
│   │   └── restaurantService.ts
│   │
│   ├── contexts/           ← State management
│   │   └── AuthContext.tsx
│   │
│   └── App.tsx             ← App entry point
│
├── vite.config.ts          ← Bundler config
└── package.json            ← Web dependencies
```

---

## **services/** - Backend Services

These are standalone services that can run independently.

### **services/api/** - Node.js REST API
```
services/api/
├── src/
│   ├── main.ts             ← Entry point
│   ├── controllers/        ← Business logic
│   │   ├── userController.ts
│   │   └── restaurantController.ts
│   │
│   ├── services/           ← Database operations
│   │   ├── userService.ts
│   │   └── restaurantService.ts
│   │
│   ├── routes/             ← API endpoints
│   │   ├── users.ts        ← /api/users routes
│   │   └── restaurants.ts  ← /api/restaurants routes
│   │
│   ├── middleware/         ← Auth, validation
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   │
│   └── config/             ← Configuration
│       ├── database.ts
│       └── env.ts
│
├── package.json
└── Dockerfile
```

### **services/ai/** - Python FastAPI
```
services/ai/
├── app/
│   ├── main.py             ← FastAPI app
│   ├── agents/             ← AI agents
│   │   ├── chatbot_agent.py
│   │   └── recommendation_agent.py
│   │
│   ├── models/             ← ML models
│   │   ├── nlp.py
│   │   └── embeddings.py
│   │
│   ├── utils/              ← Helper functions
│   │   ├── llm_utils.py
│   │   └── data_processing.py
│   │
│   └── config/
│       └── settings.py
│
├── requirements.txt
└── Dockerfile
```

---

## How Monorepo Works - Dependency Example

### **Scenario: Creating a User Type**

**Step 1: Define in shared**
```typescript
// packages/shared/types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
```

**Step 2: Mobile uses it**
```typescript
// packages/mobile/src/components/Profile.tsx
import { User } from '@restaurant/shared/types'

interface ProfileProps {
  user: User
}

export function Profile({ user }: ProfileProps) {
  return <Text>{user.name}</Text>
}
```

**Step 3: Web uses it**
```typescript
// packages/web/src/components/Profile.tsx
import { User } from '@restaurant/shared/types'

interface ProfileProps {
  user: User
}

export function Profile({ user }: ProfileProps) {
  return <div>{user.name}</div>
}
```

**Step 4: API imports it**
```typescript
// services/api/src/controllers/userController.ts
import type { User } from '@restaurant/shared/types'

export async function getUser(id: string): Promise<User> {
  // database call
  return user
}
```

**Why this is powerful:**
- User interface defined ONCE
- If you add `avatar: string` to User
- Mobile, Web, AND API automatically have it
- No duplicates, no inconsistencies ✅

---

## **pnpm-workspace.yaml** - What is it?

This file tells npm/pnpm: "These are the packages in this monorepo"

```yaml
packages:
  - 'packages/*'      # All folders in packages/
  - 'services/*'      # All folders in services/
```

**What it enables:**

```bash
# Install dependencies for ALL packages
pnpm install

# Run script in one package
pnpm -F @restaurant/mobile dev

# Run script in all packages
pnpm --recursive run build

# Link packages internally
# packages/mobile can import from packages/shared AUTOMATICALLY
```

---

## Development Workflow

### **Install Everything**
```bash
pnpm install
```
This installs:
- All dependencies for packages/shared
- All dependencies for packages/mobile
- All dependencies for packages/web
- All dependencies for services/api
- All dependencies for services/ai

### **Run Multiple Services**

```bash
# Terminal 1: Start API
cd services/api && npm run dev

# Terminal 2: Start AI service
cd services/ai && python -m uvicorn app.main:app --reload

# Terminal 3: Start mobile dev
pnpm -F @restaurant/mobile dev

# Terminal 4: Start web dev
pnpm -F @restaurant/web dev
```

Or with docker-compose:
```bash
docker-compose up
```

### **Make a Change Everywhere**

If you add a new field to User type:

```
1. Edit packages/shared/types/user.types.ts
2. Mobile automatically sees the change (next hot reload)
3. Web automatically sees the change (next hot reload)
4. API automatically sees the change (with import)
5. Done! No update needed in 3 places.
```

---

## Benefits Summary

| Aspect | Without Monorepo | With Monorepo |
|--------|------------------|---------------|
| **Code Sharing** | Duplicate | Single source |
| **Type Consistency** | Manual sync | Automatic |
| **Deployment** | 4 separate builds | 1 coordinated |
| **Testing** | Separate test suites | Integrated |
| **Refactoring** | 4 repos to change | 1 atomic commit |
| **Developer Experience** | Context switching | All code in one IDE |

---

## File Structure in Practice

```
When you need to add a "Restaurant Search" feature:

1. Add types in:
   packages/shared/types/restaurant.types.ts

2. Add utils in:
   packages/shared/utils/restaurantSearch.ts

3. Use in mobile:
   packages/mobile/src/screens/SearchScreen.tsx

4. Use in web:
   packages/web/src/pages/SearchPage.tsx

5. Use in API:
   services/api/src/controllers/restaurantController.ts

All consuming the SAME types and utils!
```

---

## Next Steps

1. **Understand the structure** ← You are here
2. Migrate existing code to new folders
3. Set up pnpm workspaces
4. Update import paths
5. Test everything still works
6. Start adding React Native

This structure will scale from startup to enterprise. 🚀

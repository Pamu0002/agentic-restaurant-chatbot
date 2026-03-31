# 🚀 Quick Start - Monorepo Setup

## 1️⃣ Install pnpm (Package Manager)

```bash
npm install -g pnpm@8
pnpm --version  # Verify (should show 8.x.x)
```

## 2️⃣ Install All Dependencies

```bash
pnpm install
```

This installs dependencies for:
- `@restaurant/web`
- `@restaurant/mobile`
- `@restaurant/shared`
- `@restaurant/api`
- `@restaurant/ai`

## 3️⃣ Run the Web App

```bash
pnpm -F @restaurant/web dev
```

Open: http://localhost:3000

## 4️⃣ Run the API (in another terminal)

```bash
pnpm -F @restaurant/api dev
```

Open: http://localhost:5000

## 5️⃣ Run Everything With Docker

```bash
docker-compose up -d
```

---

## 📁 Monorepo Structure

```
packages/@restaurant/
├── shared/    ← Shared auth, types, services
├── web/       ← React PWA
└── mobile/    ← React Native (coming soon)

services/
├── api/       ← Node.js Express
└── ai/        ← Python FastAPI
```

---

## 🎯 Common Commands

```bash
# Install deps everywhere
pnpm install

# Run web dev server
pnpm -F @restaurant/web dev

# Run API
pnpm -F @restaurant/api dev

# Run mobile
pnpm -F @restaurant/mobile start

# Build everything
pnpm --recursive run build

# Add package to web app
pnpm -F @restaurant/web add react-router-dom
```

---

## 📚 Study These Files

1. **MONOREPO_COMPLETE_GUIDE.md** - Learn monorepo concepts (30 min read)
2. **MONOREPO_MIGRATION.md** - Understand what changed
3. **GETTING_STARTED.md** - Original setup guide

---

## ✅ Verify Everything Works

### Web App
```bash
pnpm -F @restaurant/web dev
# Open http://localhost:3000
# You should see the Restaurant Chatbot app
```

### API
```bash
pnpm -F @restaurant/api dev
# Server running on http://localhost:5000
```

### Check Imports
The web app should now import from `@restaurant/shared`:
```typescript
import { AuthProvider, useAuth } from '@restaurant/shared/contexts'
import { signInWithGoogle } from '@restaurant/shared/services'
```

---

## 🤔 Troubleshooting

**"Cannot find @restaurant/shared"**
```bash
pnpm install
```

**"Port 3000 already in use"**
```bash
# Kill the process on port 3000
# Or change Vite port in packages/@restaurant/web/vite.config.ts
```

**"ES module error"**
```bash
# Make sure you're using Node 16+
node --version  # Should be v16+
```

---

Next: Read **MONOREPO_COMPLETE_GUIDE.md** to understand the architecture! 📖

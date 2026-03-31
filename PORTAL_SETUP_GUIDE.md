# Multi-Portal Development Environment - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- pnpm package manager installed (`npm install -g pnpm@latest`)
- Firestore credentials configured in services/api/.env

## Installation

### 1. Install all dependencies (root level)
```bash
pnpm install
```

This installs dependencies for:
- @restaurant/shared
- @restaurant/customer-web
- @restaurant/provider-web
- @restaurant/provider-analytics
- @restaurant/admin-web
- @restaurant/support-web
- services/api
- services/ai (if Python dependencies configured)

### 2. Configure Environment Variables

Create `.env` files in each service:

**services/api/.env:**
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
FIRESTORE_PROJECT_ID=your_project_id
FIRESTORE_PRIVATE_KEY=your_private_key
FIRESTORE_CLIENT_EMAIL=your_client_email
```

## Running Development Environment

### Option 1: All Services at Once (Bash/Git Bash)
```bash
./start-all-portals.sh
```

### Option 2: Individual Terminal Windows (Windows/Mac/Linux)

**Terminal 1 - Backend API:**
```bash
cd services/api
pnpm dev
# Runs on http://localhost:5000
```

**Terminal 2 - Customer Portal:**
```bash
cd packages/@restaurant/customer-web
pnpm dev
# Runs on http://localhost:5173
```

**Terminal 3 - Provider Portal:**
```bash
cd packages/@restaurant/provider-web
pnpm dev
# Runs on http://localhost:5174
```

**Terminal 4 - Provider Analytics:**
```bash
cd packages/@restaurant/provider-analytics
pnpm dev
# Runs on http://localhost:5175
```

**Terminal 5 - Admin Portal:**
```bash
cd packages/@restaurant/admin-web
pnpm dev
# Runs on http://localhost:5176
```

**Terminal 6 - Support Portal (Optional - Phase 2):**
```bash
cd packages/@restaurant/support-web
pnpm dev
# Runs on http://localhost:5177
```

### Option 3: Using pnpm filter (from root)
```bash
# Start API backend
pnpm --filter @restaurant/api dev

# Start customer portal
pnpm --filter @restaurant/customer-web dev

# Start provider portal
pnpm --filter @restaurant/provider-web dev

# Start analytics portal
pnpm --filter @restaurant/provider-analytics dev

# Start admin portal
pnpm --filter @restaurant/admin-web dev
```

## Accessing the Portals

After all services start, open these URLs in your browser:

| Portal | URL | Role | Purpose |
|--------|-----|------|---------|
| **API Backend** | http://localhost:5000 | - | Backend API server |
| **Customer Portal** | http://localhost:5173 | customer | Restaurant discovery, reservations, chat |
| **Provider Portal** | http://localhost:5174 | owner | Restaurant management |
| **Provider Analytics** | http://localhost:5175 | owner | Business intelligence dashboard |
| **Admin Portal** | http://localhost:5176 | admin | System administration |
| **Support Portal** | http://localhost:5177 | support | Support team operations (Phase 2) |

## Testing Authentication

### 1. Sign Up (create account)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

Response includes JWT access token - use this for authenticated requests.

### 3. Access Protected Route
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/auth/profile
```

## Build for Production

### Build all portals
```bash
pnpm build
```

Build outputs:
- `packages/@restaurant/customer-web/dist/customer-web`
- `packages/@restaurant/provider-web/dist/provider-web`
- `packages/@restaurant/provider-analytics/dist/provider-analytics`
- `packages/@restaurant/admin-web/dist/admin-web`
- `packages/@restaurant/support-web/dist/support-web`

### Build specific portal
```bash
pnpm --filter @restaurant/customer-web build
```

## Directory Structure Reminder

```
root/
├── packages/@restaurant/
│   ├── shared/                 # Shared code for all portals
│   ├── customer-web/           # Customer portal (5173)
│   ├── provider-web/           # Provider portal (5174)
│   ├── provider-analytics/     # Analytics portal (5175)
│   ├── admin-web/              # Admin portal (5176)
│   └── support-web/            # Support portal (5177)
├── services/
│   ├── api/                    # Express backend (5000)
│   └── ai/                     # AI service (Python)
└── pnpm-workspace.yaml         # Monorepo config
```

## Common Commands

```bash
# Install dependencies across all packages
pnpm install

# Update all dependencies
pnpm update --latest

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Clean all node_modules and pnpm-lock.yaml
pnpm clean

# View monorepo structure
pnpm list --depth=0

# Run specific command in specific package
pnpm --filter @restaurant/customer-web dev
```

## Troubleshooting

**Issue: "Cannot find module '@restaurant/shared'"**
- Solution: Run `pnpm install` from root directory

**Issue: API backend won't start on port 5000**
- Solution: Check if port is already in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Kill existing process and restart

**Issue: Portal shows "API connection failed"**
- Solution: Ensure backend API is running on http://localhost:5000
- Check browser console for CORS errors

**Issue: Authentication not working**
- Solution: Check `.env` file in services/api has correct credentials
- Verify JWT_SECRET is set correctly

**Issue: TypeScript errors in portals**
- Solution: Ensure tsconfig.json path mapping points to @restaurant/shared
- Rebuild TypeScript: `pnpm build`

## Next Steps

1. ✅ **Setup complete** - All portals scaffolded and running
2. 📝 **Implement Portal Pages** - Start with customer-web pages (HomePage, SearchPage, etc.)
3. 🧪 **Test Authentication** - Verify auth flow works across portals
4. 🎨 **Style Portal UIs** - Use theme colors from index.css
5. 📊 **Implement Analytics Charts** - Add Recharts components to provider-analytics
6. 🔧 **System Testing** - Test role-based access across portals
7. 📱 **Responsive Design** - Ensure mobile optimization for customer portal
8. 🚀 **Deploy** - Configure CI/CD deployments per portal

## Support

For detailed architecture information, see: [MULTI_PORTAL_ARCHITECTURE.md](./MULTI_PORTAL_ARCHITECTURE.md)

For authentication details, see: [services/api/README.md](./services/api/README.md)

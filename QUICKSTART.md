# 🚀 Quick Start - Running the Project

**Status**: Setting up development environment  
**Target**: Full-stack development with Frontend, Backend API, and AI Service

---

## 📋 Prerequisites

✅ Installed:
- Node.js 18+ with npm/pnpm
- Python 3.11+ (for AI service)
- Docker (optional, for containerized deployment)

---

## 🎯 Start Services Individually

Currently recommended: Start each service in a separate terminal

### Terminal 1: Frontend (React + Vite)
```bash
cd packages/@restaurant/customer-web
pnpm dev
# Runs on http://localhost:5173
```

### Terminal 2: Backend API (Node.js + Express)
```bash
cd services/api
npm install  # if not done
pnpm dev
# Should run on http://localhost:5000
```

### Terminal 3: AI Service (Python + FastAPI)
```bash
cd services/ai
pip install -r requirements.txt
python app/main.py
# Should run on http://localhost:8000
```

---

## 🐳 Alternative: Docker Compose

Run all services in containers:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📊 Service URLs When Running

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend API | http://localhost:5000 | Express.js |
| AI Service | http://localhost:8000/docs | FastAPI Swagger |

---

## ✅ Verification Checklist

- [ ] **Frontend Started**
  - Terminal output shows: `VITE vX.X.X ready`
  - URL loads: http://localhost:5173

- [ ] **Backend API Started**  
  - Terminal output shows: `Server running on port 5000`
  - API responds: `curl http://localhost:5000/health`

- [ ] **AI Service Started**
  - Terminal output shows: `Uvicorn running on http://0.0.0.0:8000`
  - Docs available: http://localhost:8000/docs

---

## 🐛 Common Issues & Fixes

### Issue: Module not found errors

**Solution**:
```bash
# Root directory
pnpm install --recursive

# Or individual service
cd services/api && npm install
```

### Issue: Port already in use

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: Environment variables not set

**Solution: Create `.env.local` files**

`services/api/.env.local`:
```
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=test-project
JWT_ACCESS_SECRET=dev-secret-access
JWT_REFRESH_SECRET=dev-secret-refresh
```

`services/ai/.env.local`:
```
ENVIRONMENT=development
LOG_LEVEL=INFO
GOOGLE_CLOUD_PROJECT=test-project
```

---

## 📝 Example: Full Stack Flow

1. Open Terminal A - Frontend
```bash
cd packages/@restaurant/customer-web && pnpm dev
```

2. Open Terminal B - Backend
```bash
cd services/api && pnpm dev
```

3. Test API:
```bash
curl http://localhost:5000/health
```

4. Frontend loads at http://localhost:5173 and calls:
```
http://localhost:5000/api/auth/...
```

---

## 🎯 Next Steps

After confirming all services run:

1. Run authentication tests:
   ```bash
   cd services/api && pnpm test:auth
   ```

2. Run full test suite:
   ```bash
   pnpm test
   ```

3. View test coverage:
   ```bash
   pnpm test:coverage
   ```

---

## 📞 Support

See these guides for detailed setup:
- [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md) - Firebase authentication
- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - OAuth configuration
- [DEVELOPMENT_METHODOLOGY.md](./DEVELOPMENT_METHODOLOGY.md) - Dev standards
- [DEV_PLAN_INDUSTRY_STANDARD.md](./DEV_PLAN_INDUSTRY_STANDARD.md) - Feature development


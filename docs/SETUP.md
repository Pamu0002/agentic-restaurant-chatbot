# AGENTIC RESTAURANT CHATBOT - PRODUCTION SETUP GUIDE

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
5. [Development Workflow](#development-workflow)
6. [Testing Strategy](#testing-strategy)
7. [Deployment](#deployment)
8. [Production Checklist](#production-checklist)

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone and setup
git clone <your-repo>
cd agentic-restaurant-chatbot

# Run complete setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or using make
make setup
```

### Option 2: Step-by-Step Setup
```bash
# 1. Install dependencies
make install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Run migrations
make db-migrate

# 4. Seed sample data
make db-seed

# 5. Start development
make dev
```

---

## 🏗️ Architecture Overview

### Microservices Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Frontend   │  │   Mobile App │  │    Admin    │       │
│  │  (React      │  │  (React      │  │  Dashboard  │       │
│  │  + Vite)     │  │  Native)     │  │             │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/WebSocket
┌──────────────────────┴──────────────────────────────────────┐
│                 API GATEWAY LAYER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Authentication | Rate Limiting | Logging | Caching    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ 
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
┌───────┴────────┐ ┌──┴──────────┐ ┌┴────────────┐ │
│  API SERVICE   │ │  AI SERVICE │ │  WEBSOCKET  │ │
│  (Node.js      │ │  (Python    │ │  SERVICE    │ │
│  + Express)    │ │  + FastAPI) │ │  (Node.js)  │ │
└───────┬────────┘ └──┬──────────┘ └┴────────────┘ │
        │              │                             │
┌───────┴──────────────┴─────────────────────────────┴───────┐
│              DATA LAYER (Multi-Database)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐       │
│  │  Firestore  │  │   MongoDB   │  │   Neo4j      │       │
│  │  (Real-time │  │  (Analytics,│  │ (Preferences,│       │
│  │  Operational)   │   Audit)    │  │   Recommendations) │
│  └─────────────┘  └─────────────┘  └──────────────┘       │
└───────────────────────────────────────────────────────────┘
        │               │                    │
┌───────┴───────────────┴────────────────────┴────────────┐
│              EXTERNAL INTEGRATIONS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Gemini AI  │  │    Stripe    │  │    SendGrid  │ │
│  │   (LLM)      │  │  (Payments)  │  │  (Email)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Service Responsibilities

**API Service (Node.js/Express)**
- REST API endpoints
- Authentication & authorization
- Request validation
- Business logic orchestration
- Database operations (Firestore, MongoDB)

**AI Service (Python/FastAPI)**
- Gemini LLM integration
- Intent detection
- Entity extraction
- Conversation context management
- Recommendation engine

**WebSocket Service (Node.js)**
- Real-time notifications
- Live table availability updates
- Reservation status updates
- User presence

---

## 📦 Prerequisites

### Required Software
- **Node.js**: v18.0.0+
- **Python**: 3.11.0+
- **pnpm**: 8.0.0+
- **Git**: 2.0.0+
- **Docker**: 20.0.0+ (for deployment)

### Required Credentials
- Google Cloud account with:
  - Firestore enabled
  - Vertex AI API enabled
  - Service account created
  - credentials.json downloaded
- Stripe test/live keys
- MongoDB Atlas connection string (optional)
- Neo4j connection (local or Aura)

### Environment Checklist
```bash
# Verify installations
node --version        # v18.x.x
python3 --version     # Python 3.11.x
pnpm --version        # 8.x.x
docker --version      # 20.x.x
git --version         # 2.x.x
```

---

## 🔧 Setup Instructions

### Step 1: Clone Repository
```bash
git clone https://github.com/your-repo/agentic-restaurant-chatbot.git
cd agentic-restaurant-chatbot
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and fill in:
```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=services/ai/credentials.json
VERTEX_AI_REGION=us-central1
VERTEX_AI_MODEL=gemini-1.5-pro

# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_PROJECT_ID=your-project-id

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# JWT
JWT_SECRET=your-super-secret-key

# Ports
API_PORT=5000
AI_SERVICE_PORT=8000
PORT=5173
```

### Step 3: Download Google Cloud Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select your project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **Service Account**
5. Download JSON key as `credentials.json`
6. Save to `services/ai/credentials.json`

### Step 4: Install Dependencies
```bash
make install
# Or manually:
pnpm install
cd services/ai && pip install -r requirements.txt && cd ../..
```

### Step 5: Create Database Schemas
```bash
make db-migrate
# Runs: database/migrate.py
# Creates Firestore collections, MongoDB indexes, Neo4j constraints
```

### Step 6: Seed Sample Data
```bash
make db-seed
# Runs: database/seed.py
# Inserts: 10 restaurants, 5 users, 15 reservations, sample menus
```

### Step 7: Start Development Environment
```bash
make dev
# Starts all services:
# - Frontend: http://localhost:5173
# - API: http://localhost:5000
# - AI Service: http://localhost:8000
```

---

## 💻 Development Workflow

### Making Code Changes
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes in your editor
# Code is auto-reloaded (hot reload enabled)

# 3. Run tests locally
make test

# 4. Format code
make format

# 5. Lint code
make lint

# 6. Commit and push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### Directory Structure
```
agentic-restaurant-chatbot/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          ← CI/CD pipeline
├── database/
│   ├── migrate.py             ← Migrations
│   ├── seed.py               ← Sample data
│   └── migrations/
├── docs/
│   ├── ARCHITECTURE.md        ← System design
│   ├── API.md                ← API docs
│   └── SETUP.md              ← This file
├── infrastructure/
│   └── terraform/             ← IaC configs
├── scripts/
│   ├── setup.sh              ← Setup script
│   └── deploy.sh             ← Deployment
├── services/
│   ├── api/                  ← REST API
│   │   ├── src/
│   │   ├── tests/
│   │   └── Dockerfile
│   └── ai/                   ← AI service
│       ├── app/
│       ├── tests/
│       └── Dockerfile
├── packages/
│   └── @restaurant/
│       ├── web/              ← React frontend
│       ├── mobile/           ← React Native
│       └── shared/           ← Shared types
├── tests/
│   ├── e2e/                  ← End-to-end tests
│   └── integration/          ← Integration tests
├── .env.example
├── Makefile                  ← Command center
├── docker-compose.yml        ← Local development
├── docker-compose.prod.yml   ← Production
├── package.json
└── README.md
```

---

## 🧪 Testing Strategy

### Test Types
```bash
# Unit Tests (Fast, no external dependencies)
make test-unit
# Tests: Business logic, utilities, helpers
# Coverage: >80%

# Integration Tests (Databases, APIs)
make test-integration
# Tests: Service-to-service communication
# Coverage: >70%

# E2E Tests (Full user journeys)
make test-e2e
# Tests: Complete workflows
# Tools: Cypress/Playwright

# All Tests
make test
# Runs unit + integration + E2E
# Must pass before deployment
```

### Testing Best Practices
1. Write tests BEFORE code (TDD)
2. Aim for >80% coverage
3. Test happy paths AND error cases
4. Use descriptive test names
5. Keep tests independent

---

## 🚀 Deployment

### Staging Deployment (Automatic)
Every push to `develop` branch auto-deploys to staging:
```bash
git push origin develop
# → GitHub Actions triggers
# → Runs all tests  
# → Builds Docker images
# → Deploys to staging
```

### Production Deployment
```bash
# 1. Merge to main
git checkout main
git merge develop

# 2. Create release tag
git tag v1.0.0

# 3. Push
git push origin main --tags
# → GitHub Actions triggers production deployment

# Or manual deployment
make deploy
```

### Manual Deployment to GCP
```bash
# Build images
docker-compose build

# Push to GCP
./scripts/deploy.sh

# Verify
gcloud app describe
gcloud app logs read -n 100
```

---

## ✅ Production Checklist

Before October 1 delivery, verify:

### Code Quality
- [ ] All tests passing (>80% coverage)
- [ ] No security vulnerabilities (OWASP)
- [ ] Code formatted (prettier/black)
- [ ] Linting passes (ESLint/Pylint)
- [ ] No hardcoded secrets
- [ ] No console.logs left

### Performance
- [ ] API response time <200ms
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Caching strategy implemented
- [ ] Load tested (1000+ concurrent users)

### Security
- [ ] OAuth2 implementation verified
- [ ] Encryption at rest enabled
- [ ] HTTPS only
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Secrets in Secret Manager
- [ ] Backup strategy implemented

### Operations
- [ ] Logging configured (all services)
- [ ] Monitoring setup (APM)
- [ ] Alerting configured
- [ ] Rollback procedures documented
- [ ] Disaster recovery plan ready
- [ ] On-call runbooks created

### Documentation
- [ ] API documentation complete
- [ ] Architecture decision records (ADRs) written
- [ ] Operational runbooks ready
- [ ] README updated
- [ ] Thesis chapters 4-5 written

---

## 📞 Support & Troubleshooting

### Common Issues

**Docker won't start**
```bash
# Clean and restart
make docker-down
docker-compose rm -f
make docker-up
```

**Migrations fail**
```bash
# Check credentials
echo $GOOGLE_APPLICATION_CREDENTIALS

# Verify file exists
ls -la services/ai/credentials.json

# Try again
make db-migrate
```

**Tests fail**
```bash
# Run with verbose output
make test -- --verbose

# Check environment
echo $NODE_ENV
echo $MONGODB_URI
```

**Services won't connect**
```bash
# Check ports
lsof -i :5000
lsof -i :8000
lsof -i :5173

# Check logs
make logs
```

---

## 📚 Additional Resources

- [Architecture Design Document](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Guide](docs/SECURITY.md)

---

**Last Updated:** March 12, 2026  
**Status:** Production Ready

# Agentic Restaurant Chatbot Platform

A unified, intelligent conversational AI platform for restaurant discovery, real-time availability management, personalized recommendations, reservation handling, and payment processing.

## 📋 Project Overview

This is a complete system with:
- **Progressive Web App (PWA)** for responsive web & mobile interfaces
- **Node.js REST API Service** for business logic and real-time features
- **Python FastAPI AI Service** for LLM integration and agent orchestration
- **Multi-agent system** using LangChain for autonomous task execution
- **Google Cloud Platform** for scalable infrastructure
- **Real-time data management** with Firestore, Neo4j, and MongoDB

## 🏗️ Architecture

```
Frontend (React PWA)
    ↓
API Gateway / Load Balancer
    ├→ Node.js API Service (REST, WebSocket)
    └→ Python FastAPI Service (AI, Agents, Embeddings)
         ↓
     Databases (Firestore, Neo4j, MongoDB, Vector Search)
         ↓
     External Services (Google Vertex AI, Stripe, etc.)
```

## 📁 Project Structure

```
agentic-restaurant-chatbot/
├── apps/
│   ├── web-pwa/              # React PWA application
│   ├── backend-api/          # Node.js Express API service
│   └── backend-ai/           # Python FastAPI AI service
├── packages/
│   ├── shared-types/         # Shared TypeScript types
│   ├── shared-utils/         # Shared utilities
│   └── shared-schemas/       # Shared validation schemas
├── .github/workflows/        # GitHub Actions CI/CD
├── docker-compose.yml        # Local development setup
├── package.json              # Root npm workspace
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ LTS
- **Python** 3.11+
- **Docker** & **Docker Compose**
- **Google Cloud Platform** account (for Vertex AI, Firestore)

### Local Development Setup

1. **Clone & Setup Environment**
   ```bash
   cd agentic-restaurant-chatbot
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Services**
   ```bash
   npm run docker:up
   ```

4. **Access Applications**
   - Frontend PWA: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Development Commands

```bash
# Start all services in development mode
npm run dev

# Build all services
npm run build

# Run tests across all packages
npm run test

# Code linting
npm run lint

# Docker operations
npm run docker:up      # Start containers
npm run docker:down    # Stop containers
npm run docker:logs    # View logs
```

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **React Query** - State management
- **Socket.io** - Real-time communication

### Backend API (Node.js)
- **Express.js** - REST framework
- **Firebase Admin SDK** - Database client
- **Neo4j Driver** - Graph database
- **Stripe SDK** - Payment processing
- **JWT** - Authentication
- **Socket.io** - WebSocket server

### Backend AI (Python)
- **FastAPI** - ASGI web framework
- **LangChain** - Agent orchestration
- **Google Vertex AI** - LLM service
- **Pinecone / Vertex AI Vector Search** - Vector embeddings
- **Pydantic** - Data validation

### Databases
- **Firebase Firestore** - Real-time NoSQL
- **Neo4j** - Graph database
- **MongoDB Atlas** - Structured data
- **Vertex AI Vector Search** - Vector embeddings

### Cloud Platform
- **Google Cloud Run** - Container deployment
- **Cloud Storage** - Static assets
- **Cloud Pub/Sub** - Async messaging
- **Cloud Monitoring** - Observability
- **Secret Manager** - Credentials

## 📚 Documentation

- [Technology Stack](./TECHNOLOGY_STACK.md) - Complete tech stack details
- [Summary](./SUMMARY.md) - Project research & approach

## 🔧 Configuration

### Environment Variables

Create `.env.local` based on `.env.example`:

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Vertex AI
VERTEX_AI_REGION=us-central1

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx

# JWT
JWT_SECRET=your-secret-key
```

## 🧪 Testing

```bash
# Frontend tests
cd apps/web-pwa
npm run test

# Backend API tests
cd apps/backend-api
npm run test

# AI Service tests
cd apps/backend-ai
pytest
```

## 🐳 Docker Deployment

```bash
# Build images
docker-compose build

# Run services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 API Endpoints

### Node.js API Service (Port 5000)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/restaurants` - List restaurants
- `POST /api/v1/reservations` - Create reservation
- `POST /api/v1/payments` - Process payment

### FastAPI AI Service (Port 8000)
- `POST /api/v1/agents/discover` - Discovery agent
- `POST /api/v1/agents/recommend` - Recommendation agent
- `POST /api/v1/agents/reserve` - Reservation agent
- `GET /api/v1/docs` - API documentation (Swagger)

## 🔐 Security

- JWT-based authentication
- OAuth 2.0 integration (Google, Facebook)
- PCI DSS compliance (Stripe)
- Environment variable encryption
- Role-based access control (RBAC)
- Rate limiting on API endpoints

## 📊 Monitoring & Logging

- **Cloud Logging** - Centralized log aggregation
- **Sentry** - Error tracking
- **Cloud Monitoring** - Metrics & alerts
- **ELK Stack** - Optional log analysis

## 🚀 Deployment

### To Google Cloud Run

```bash
# Set up GCP project
gcloud init

# Build and deploy API service
gcloud run deploy restaurant-api --source ./apps/backend-api

# Build and deploy AI service
gcloud run deploy restaurant-ai --source ./apps/backend-ai

# Deploy frontend to Cloud Storage
gsutil -m cp -r ./apps/web-pwa/dist/* gs://your-bucket/
```

## 👥 Team & Contribution

This project follows **Agile methodology** with iterative sprints.

## 📄 License

MIT License - See LICENSE file

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Status**: 🔄 In Development  
**Last Updated**: March 5, 2026  
**Version**: 1.0.0 (Alpha)

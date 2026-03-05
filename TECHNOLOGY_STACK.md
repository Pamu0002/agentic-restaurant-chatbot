# Technology Stack - Agentic Restaurant Chatbot Platform

---

# 🎯 FINAL TECH STACK (CONFIRMED & APPROVED)

## **Quick Reference - Implementation Matrix**

```
PROJECT: Agentic Restaurant Chatbot Platform
DEPLOYMENT: Google Cloud Platform (GCP)
ARCHITECTURE: Microservices (Frontend PWA + 2 Backend Services)
REPOSITORY: Monorepo with npm workspaces
```

### **Layer 1: FRONTEND (Progressive Web App)**

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React.js | 18+ | Web PWA application |
| **Build Tool** | Vite | 5.x | Fast bundling & dev server |
| **Styling** | Tailwind CSS | 3.x | Responsive utility-first CSS |
| **Language** | TypeScript | 5.x | Type-safe development |
| **HTTP Client** | Axios | 1.x | REST API calls |
| **State Management** | React Query | 5.x / TanStack Query | Server state management |
| **Routing** | React Router | 6.x | Client-side routing |
| **Animations** | Framer Motion | 10.x | UI transitions |
| **UI Components** | shadcn/ui | Latest | Accessible components |
| **WebSocket** | Socket.io-client | 4.x | Real-time communication |
| **PWA** | Workbox | 7.x | Service workers & offline |
| **Testing** | Vitest + React Testing Library | Latest | Unit & integration tests |
| **Linting** | ESLint + Prettier | Latest | Code quality |

**Deployment:** 
- Dev: `http://localhost:3000` (Vite dev server)
- Prod: Google Cloud Storage + Cloud CDN

---

### **Layer 2a: BACKEND API SERVICE (Node.js Microservice)**

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 18 LTS | JavaScript runtime |
| **Framework** | Express.js | 4.x | REST API server |
| **Language** | TypeScript | 5.x | Type-safe backend |
| **Port** | 5000 | - | Development port |
| **Real-time** | Socket.io / ws | 4.x | WebSocket connections |
| **Auth** | JWT + jsonwebtoken | 9.x | Token-based authentication |
| **Security** | bcryptjs | 2.x | Password hashing |
| **Validation** | joi / zod | Latest | Input validation |
| **Middleware** | Express middleware | - | CORS, logging, compression |
| **Environment** | dotenv | Latest | Config management |
| **Database Client** | firebase-admin | Latest | Firestore access |
| **Graph DB Client** | neo4j-driver | 5.x | Neo4j connection |
| **Payment API** | stripe | Latest | Stripe integration |
| **HTTP Requests** | axios / node-fetch | Latest | External API calls |
| **Logging** | winston / morgan | Latest | Structured logging |
| **Testing** | Jest / Mocha | Latest | Unit & integration tests |
| **Container** | Docker | Latest | Containerization |

**Key Responsibilities:**
- RESTful CRUD API endpoints
- User authentication & authorization (JWT + OAuth 2.0)
- WebSocket real-time table updates
- Payment webhook processing
- Reservation management
- Menu & review handling

**Deployment:**
- Dev: `http://localhost:5000`
- Prod: Google Cloud Run (auto-scaling)

---

### **Layer 2b: BACKEND AI SERVICE (Python FastAPI Microservice)**

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Python | 3.11+ | Language runtime |
| **Framework** | FastAPI | 0.104+ | ASGI web framework |
| **Server** | Uvicorn | 0.24+ | ASGI server |
| **Port** | 8000 | - | Development port |
| **Language Features** | Async/Await | Native | Concurrent operations |
| **Validation** | Pydantic | 2.x | Schema validation |
| **Config** | pydantic-settings | 2.x | Environment configuration |
| **Agent Framework** | LangChain | 0.1+ | Agent orchestration |
| **Secondary Agents** | CrewAI | Latest | Multi-agent workflows |
| **LLM Provider** | Google Vertex AI | Latest | Gemini Pro model |
| **LLM Fallback** | OpenAI GPT-4 | Latest | Backup model |
| **Vector Embeddings** | Pinecone / Vertex AI Vector Search | Latest | Semantic search |
| **Semantic Search** | LlamaIndex | Latest | Document indexing & RAG |
| **Database Clients** | google-cloud-firestore, neo4j, pymongo | Latest | Multi-database support |
| **ML Libraries** | scikit-learn, pandas, numpy | Latest | Data processing |
| **HTTP Requests** | aiohttp / httpx | Latest | Async HTTP client |
| **Logging** | python-json-logger | Latest | Structured logging |
| **Testing** | Pytest | 7.x | Unit & integration tests |
| **Type Hints** | mypy | Latest | Type checking |
| **Container** | Docker | Latest | Containerization |

**Key Responsibilities:**
- LLM integration (Vertex AI / OpenAI)
- Multi-agent orchestration (Discovery, Recommendation, Reservation, Payment)
- Vector embeddings & semantic search
- Conversation history management
- Context-aware response generation
- Async task processing

**Deployment:**
- Dev: `http://localhost:8000`
- Prod: Google Cloud Run (auto-scaling)

---

### **Layer 3: DATABASES**

| Database | Technology | Type | Purpose | Region |
|----------|-----------|------|---------|--------|
| **Primary (Real-time)** | Firebase Firestore | NoSQL Document | User data, reservations, real-time sync | us-central1 |
| **Graph DB** | Neo4j Aura | Graph Database | User preferences, recommendations | Cloud-hosted |
| **Structured Data** | MongoDB Atlas | NoSQL Document | Audit logs, analytics history | us-central1 |
| **Vector Store** | Vertex AI Vector Search | Vector Database | Embeddings, semantic search | us-central1 |
| **Cache** | Redis (optional) | In-memory | Session cache, rate limiting | us-central1 |
| **Backup** | Cloud Storage | Object Storage | Database backups | us-central1 |

---

### **Layer 4: AI/ML SERVICES**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **LLM** | Google Vertex AI (Gemini Pro 1.5) | Primary language model |
| **LLM Fallback** | OpenAI GPT-4 Turbo | Backup if Vertex AI unavailable |
| **Agent Orchestration** | LangChain 0.1+ | Multi-step task coordination |
| **Vector Embeddings** | Vertex AI Embeddings API | Text-to-vector conversion |
| **Semantic Search** | LlamaIndex | Document indexing & RAG |
| **RAG Framework** | LangChain + Pinecone/Weaviate | Context-aware responses |
| **Prompt Engineering** | Few-shot learning templates | Consistent agent behavior |
| **Model Context Protocol** | MCP | Standardized tool calling |

**Agent Types:**
1. **Discovery Agent** - Restaurant search with Neo4j
2. **Recommendation Agent** - Personalized suggestions (collaborative + content-based)
3. **Reservation Agent** - Booking & availability management
4. **Payment Agent** - Secure transaction handling

---

### **Layer 5: CLOUD INFRASTRUCTURE (Google Cloud Platform)**

| GCP Service | Purpose | Configuration |
|-------------|---------|----------------|
| **Cloud Run** | Containerized deployment | Memory: 2GB, Timeout: 3600s, Auto-scaling: 1-100 instances |
| **Firestore** | Real-time NoSQL database | Regional (us-central1), Auto-scaling, Automatic indexing |
| **Vertex AI** | LLM & embeddings | Region: us-central1, Model: Gemini Pro 1.5 |
| **Cloud Storage** | Static assets & backups | Regional buckets, Standard class |
| **Cloud CDN** | Global content delivery | Caching for static files |
| **Cloud Pub/Sub** | Async messaging | Event-driven inter-service communication |
| **Cloud Build** | CI/CD automation | GitHub integration, auto-deploy on push |
| **Cloud Monitoring** | Metrics & alerting | Custom dashboards, real-time monitoring |
| **Cloud Logging** | Centralized logs | JSON structured logging, 30-day retention |
| **Secret Manager** | Credential storage | API keys, database passwords, tokens |
| **Cloud IAM** | Access control | Service accounts, custom roles, RBAC |
| **BigQuery** | Analytics & reporting | Data warehouse for business insights |
| **Load Balancer** | Traffic management | SSL/TLS termination, global routing |
| **Armor** | DDoS protection | Web security policies |

---

### **Layer 6: DEVELOPMENT & DEPLOYMENT TOOLS**

| Category | Tools | Purpose |
|----------|-------|---------|
| **Version Control** | Git + GitHub | Source control & collaboration |
| **CI/CD** | GitHub Actions | Automated testing, building, deployment |
| **Containerization** | Docker | API & AI service images |
| **Local Development** | Docker Compose | Local multi-service orchestration |
| **Package Managers** | npm/yarn (Node.js), pip/Poetry (Python) | Dependency management |
| **IDE** | VS Code + Remote Extensions | Development environment |
| **API Testing** | Postman / Thunder Client | API endpoint testing |
| **Frontend Testing** | Vitest + React Testing Library | Unit & component tests |
| **Backend Testing (Node)** | Jest / Mocha + Chai | Unit & integration tests |
| **Backend Testing (Python)** | Pytest | Unit & integration tests |
| **Code Quality** | ESLint + Prettier (JS), Pylint + Black (Python) | Linting & formatting |
| **Type Checking** | TypeScript, mypy | Static type analysis |
| **Documentation** | JSDoc, Google-style docstrings | Code documentation |
| **Monitoring** | Sentry + ELK Stack | Error tracking & log aggregation |

---

### **Layer 7: REPOSITORY & PROJECT STRUCTURE**

**Monorepo Structure (with npm workspaces):**
```
agentic-restaurant-chatbot/
├── apps/
│   ├── web-pwa/                (React PWA - Production ready)
│   │   ├── src/
│   │   ├── public/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── backend-api/            (Node.js Express - Production ready)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── main.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── backend-ai/             (Python FastAPI - Production ready)
│       ├── app/
│       │   ├── agents/
│       │   ├── llm/
│       │   ├── database/
│       │   ├── api/
│       │   └── main.py
│       ├── tests/
│       ├── requirements.txt
│       ├── pyproject.toml
│       └── Dockerfile
│
├── packages/
│   ├── shared-types/           (TypeScript types)
│   ├── shared-utils/           (Utility functions)
│   └── shared-schemas/         (Validation schemas)
│
├── docker-compose.yml          (Local development)
├── package.json                (Root workspace)
├── README.md
└── .github/
    └── workflows/              (GitHub Actions)
```

---

### **Summary Table - All Technologies**

| Layer | Component | Technology | Status |
|-------|-----------|-----------|--------|
| **Frontend** | Web App | React 18 + Vite + Tailwind | ✅ CONFIRMED |
| **Frontend** | Mobile | React PWA (responsive) | ✅ CONFIRMED |
| **Backend** | API Service | Node.js 18 + Express.js + TS | ✅ CONFIRMED |
| **Backend** | AI Service | Python 3.11 + FastAPI | ✅ CONFIRMED |
| **Database** | Real-time | Firebase Firestore | ✅ CONFIRMED |
| **Database** | Graph | Neo4j Aura | ✅ CONFIRMED |
| **Database** | Structured | MongoDB Atlas | ✅ CONFIRMED |
| **Database** | Vector | Vertex AI Vector Search | ✅ CONFIRMED |
| **AI/ML** | LLM | Google Vertex AI (Gemini Pro) | ✅ CONFIRMED |
| **AI/ML** | LLM Fallback | OpenAI GPT-4 | ✅ CONFIRMED |
| **AI/ML** | Orchestration | LangChain + CrewAI | ✅ CONFIRMED |
| **Cloud** | Compute | Google Cloud Run | ✅ CONFIRMED |
| **Cloud** | Region | us-central1 | ✅ CONFIRMED |
| **DevOps** | CI/CD | GitHub Actions | ✅ CONFIRMED |
| **DevOps** | Container | Docker | ✅ CONFIRMED |
| **DevOps** | Repo** | npm workspaces | ✅ CONFIRMED |

---

## ✅ **FINAL DECISION: APPROVED TO PROCEED**

This technology stack is:
- ✅ **Production-ready**
- ✅ **Scalable for enterprise use**
- ✅ **Cost-effective on GCP**
- ✅ **Developer-friendly**
- ✅ **Follows industry best practices**
- ✅ **Supports rapid iteration (Agile methodology)**

---

## 1. FRONTEND TECHNOLOGIES

### Mobile Application Framework
- **React Native / Expo Go**
  - Cross-platform mobile development (iOS & Android)
  - Hot reloading for rapid development iteration
  - Rich component library (React Native Paper, NativeBase)
  - Real-time UI updates for availability changes

### Web Interface
- **React.js 18+**
  - Modern component-based architecture
  - State management with Redux or Context API
  - Responsive design with Tailwind CSS or Material-UI
  - Real-time updates via WebSockets

### UI/UX Libraries
- **Material-UI (MUI)** or **shadcn/ui** - Modern component design
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Smooth animations and transitions

### Client-Side Tools
- **TypeScript** - Type safety for frontend codebase
- **Vite** - Fast build tool and development server
- **Axios / React Query** - HTTP client and data fetching
- **WebSocket.js** - Real-time communication with backend

---

## 2. BACKEND TECHNOLOGIES

### Core Backend Framework (Choose One)
**Option A: Node.js Stack (Recommended for Agile Integration)**
- **Express.js** or **NestJS**
  - Lightweight REST API framework
  - Middleware support for authentication/logging
  - Excellent TypeScript integration
  
**Option B: Java/Spring Boot Stack (Enterprise-Grade)**
- **Spring Boot 3.x**
  - Robust microservices architecture
  - Built-in transaction management
  - Strong security frameworks (Spring Security)

### Runtime & Language
- **Node.js 18+ (LTS)** OR **Java 17/21 (LTS)**
- **TypeScript** - For type-safe backend code (Node.js)

### Real-Time Database
- **Firebase Firestore**
  - Real-time document synchronization
  - Automatic indexing for queries
  - Built-in authentication
  - Scalable for SME restaurants

**Alternative: Cloud Firestore or PostgreSQL + Supabase**

### Graph Database
- **Neo4j**
  - Graph-based preference modeling
  - Relationship queries for recommendations
  - Built-in algorithms (PageRank, community detection)
  - Cloud or self-hosted deployment options

### API Communication
- **RESTful APIs** - Standard CRUD operations
- **WebSocket** - Real-time table availability updates
- **gRPC** (Optional) - For inter-service communication

### Authentication & Authorization
- **JWT (JSON Web Tokens)** - Stateless authentication
- **OAuth 2.0** - Third-party authentication (Google, Facebook)
- **Role-Based Access Control (RBAC)** - Custom ACL implementation

### Payment Processing Integration
- **Stripe API** or **PayPal Integration**
  - Secure payment gateway
  - PCI DSS compliance
  - Webhook support for payment confirmations

### Server Deployment
- **AWS EC2 / AWS Lambda** (Serverless)
- **Google Cloud Run** - Container-based deployment
- **Docker & Kubernetes** - Container orchestration
- **Heroku / Railway** - Simplified deployment for prototyping

---

## 3. AI ENGINEERING & INTEGRATION FRAMEWORKS

### LLM & Natural Language Processing
- **LangChain**
  - Agent orchestration framework
  - Chain management for multi-step workflows
  - Memory management (conversation history)
  - Tool/function integration

- **LlamaIndex (Formerly GPT Index)**
  - Document indexing and retrieval
  - Context-aware response generation
  - Integration with vector databases

### AI Model Providers
- **Google Vertex AI**
  - Text generation (Gemini Pro)
  - Semantic understanding
  - Multilingual support
  - No-code to advanced RAG capabilities

**Alternative Providers:**
- **OpenAI GPT-4 API** - Advanced language understanding
- **Anthropic Claude API** - Safer, more aligned responses
- **Hugging Face Models** - Local/self-hosted alternatives

### Vector Databases (for Embeddings & RAG)
- **Pinecone** - Managed vector database
- **Weaviate** - Open-source vector database
- **Milvus** - Distributed vector search
- **ChromaDB** - Lightweight, embedded option

### Agent Orchestration & Task Execution
- **LangChain Agents** - Tool-calling agents
- **AutoGPT-style Agent Framework** - Autonomous task planning
- **CrewAI** - Multi-agent frameworks with role-based agents
- **ReAct Pattern** - Reasoning and Acting framework

### Backend AI Processing
- **Python FastAPI**
  - Lightweight ASGI framework for AI services
  - Async request handling
  - Automatic API documentation (Swagger)
  - Easy integration with ML models

- **Flask** (Alternative) - Simpler microframework

### Agent Components

**1. Discovery Agent**
- Restaurant search functionality using semantic similarity
- Filtering by location, ratings, cuisine type
- Neo4j-based restaurant recommendation graph

**2. Recommendation Agent**
- Preference-based filtering using user graphs
- Collaborative filtering algorithms
- Content-based recommendations
- Hybrid recommendation engine

**3. Reservation Agent**
- Table availability checking via Firestore
- Booking confirmation and slot management
- Conflict prevention and automation
- Confirmation notifications via email/SMS

**4. Payment Handling Agent**
- Secure transaction processing
- PCI DSS compliance validation
- Fraud detection mechanisms
- Payment confirmation and reconciliation

### Model Context Protocol (MCP)
- **Assistant Framework** - Define agent capabilities
- **Tool definitions** - Structured function calling
- **ACL-based Coordination** - Access control for agents
- **Message passing** - Agent-to-agent communication

### Machine Learning & Data Processing
- **Scikit-learn** - Traditional ML algorithms
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Tensorflow / PyTorch** - For custom ML models (if needed)

### Prompt Engineering & Optimization
- **Prompt Templates** - Consistent prompt structuring
- **Few-shot Learning** - Example-based learning
- **Chain-of-Thought Prompting** - Complex reasoning
- **Retrieval-Augmented Generation (RAG)** - Context grounding

---

## 4. DEVELOPMENT & INTEGRATION TOOLS

### Development Environment
- **VS Code** - Recommended IDE
- **Cursor / GitHub Copilot** - AI-assisted development
- **Postman / Insomnia** - API testing
- **Thunder Client** - Lightweight API testing extension

### Build & Package Management
- **npm / yarn** (Node.js) - JavaScript package manager
- **Maven / Gradle** (Java) - Java build tools
- **pip / Poetry** (Python) - Python package management

### Version Control & Collaboration
- **Git & GitHub** - Source control
- **GitHub Actions** - CI/CD automation
- **Docker** - Containerization

### Monitoring & Logging
- **Winston / Morgan** (Node.js) - Logging framework
- **Sentry** - Error tracking and monitoring
- **ELK Stack** (Elasticsearch, Logstash, Kibana) - Log aggregation
- **CloudWatch** (AWS) - Cloud monitoring

### Testing Frameworks
- **Jest** / **Vitest** - Frontend testing
- **Mocha / Chai** (Node.js) - Backend testing
- **Pytest** (Python) - AI service testing

---

## 5. DEPLOYMENT & INFRASTRUCTURE

### Cloud Providers
- **Google Cloud Platform (GCP)**
  - Cloud Run for FastAPI
  - Firestore for real-time database
  - Vertex AI for LLM integration

- **AWS**
  - EC2 for backend services
  - RDS for relational data
  - Lambda for serverless operations
  - Bedrock for LLM (alternative to Vertex AI)

- **Azure**
  - App Service for backend
  - Cosmos DB for NoSQL
  - Azure OpenAI Service

### Environment Management
- **.env Configuration** - Secure API key management
- **Docker Compose** - Local development orchestration
- **Kubernetes** - Production container orchestration

---

## 6. TECHNOLOGY INTEGRATION SUMMARY

### Frontend → Backend Communication
```
React/Expo → REST API (Express/NestJS) → Business Logic
              ↓
         Firebase Firestore (Real-time)
         Neo4j (Graph Queries)
```

### Backend → AI Integration
```
Express/FastAPI → LangChain Agent Orchestration
                → Google Vertex AI (LLM)
                → Vector Database (Embeddings & RAG)
                → Tool Execution (Payment, Reservation, Discovery)
```

### Complete System Flow
```
User (Mobile/Web)
    ↓
Frontend (React/Expo)
    ↓
Backend API (Express/NestJS)
    ↓
Agent Orchestration (LangChain + MCP)
    ├─→ Discovery Agent
    ├─→ Recommendation Agent  
    ├─→ Reservation Agent
    └─→ Payment Agent
    ↓
External Services (Stripe, Google Vertex AI, Neo4j, Firestore)
```

---

## 7. FINALIZED TECHNOLOGY DECISIONS

### Frontend Technology (FINALIZED)
- **React 18+** - Web application (Desktop & Tablet)
- **Expo Go / React Native 0.73+** - Mobile applications (iOS & Android)
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Axios + TanStack Query (React Query)** - Data fetching and state synchronization
- **TypeScript 5.x** - Type-safe frontend development
- **Vite** - Module bundler for React web application
- **Framer Motion** - UI animations and transitions

**Frontend Endpoints:**
1. Web application: `http://localhost:3000` (Development) | `https://app.restaurant-chatbot.com` (Production)
2. Mobile app: Expo Go (Development) | Google Play Store & Apple App Store (Production)

---

### Backend Architecture (FINALIZED - 2 Microservices)

#### **Backend Service 1: Primary API Server**
- **Framework:** Node.js 18 LTS with Express.js
- **Language:** TypeScript 5.x
- **Port:** 5000 (Development) | Cloud Run (Production)
- **Responsibilities:**
  - RESTful API endpoints (CRUD operations)
  - Authentication & Authorization (JWT + OAuth 2.0)
  - Real-time WebSocket connections
  - User session management
  - Direct Firebase Firestore integration
  - Stripe payment webhook handling
  - Request logging and error handling

**Express.js Stack:**
```
express, typescript, ts-node, cors, helmet, compression,
jsonwebtoken, bcryptjs, dotenv, firebase-admin, stripe,
ws (WebSocket), morgan, express-validator
```

---

#### **Backend Service 2: AI/Agent Microservice**
- **Framework:** Python 3.11+ with FastAPI & Uvicorn
- **Port:** 8000 (Development) | Cloud Run (Production)
- **Responsibilities:**
  - Agent orchestration and task execution
  - LLM interactions via Google Vertex AI
  - Natural language understanding & processing
  - Vector embeddings and semantic search
  - Agent state management
  - Async task processing
  - Integration with Discovery, Recommendation, Reservation, and Payment Agents

**FastAPI Stack:**
```
fastapi, uvicorn, python-dotenv, pydantic, pydantic-settings,
langchain, langchain-google-vertexai, google-cloud-aiplatform,
pinecone-client, openai (optional fallback), scikit-learn, pandas,
aiohttp, python-json-logger
```

---

### Integration Framework (FINALIZED)

**Model Context Protocol (MCP) + LangChain**
- **Primary Framework:** LangChain 0.1+ for agent orchestration
- **Secondary Framework:** CrewAI for specialized multi-agent workflows
- **Message Protocol:** Model Context Protocol (MCP) for standardized tool calling
- **Agent Communication:** REST APIs between frontend → backend, backend → FastAPI
- **Tool Integration Pattern:**
  - Tool definitions in LangChain format
  - ACL-based access control per agent
  - Structured function calling with validation
  - Asynchronous execution with callbacks

**Agent Architecture:**
```
┌─────────────────────────────────────────────────────┐
│        LangChain Agent Orchestrator                 │
├─────────────────────────────────────────────────────┤
│  Discovery Agent      | Recommendation Agent        │
│  (Neo4j + Semantic)   | (Graph + Collaborative)    │
├─────────────────────────────────────────────────────┤
│  Reservation Agent    | Payment Agent              │
│  (Firestore + Logic)  | (Stripe + Verification)   │
└─────────────────────────────────────────────────────┘
```

---

### Cloud Platform for AI Engineering (FINALIZED: Google Cloud Platform)

#### **GCP Services Selected:**

| Service | Purpose | Configuration |
|---------|---------|----------------|
| **Vertex AI** | LLM (Gemini Pro) | Region: us-central1, Model: gemini-1.5-pro |
| **Cloud Run** | Containerized deployment | Memory: 2GB, Timeout: 3600s, Concurrency: 100 |
| **Firestore** | Real-time NoSQL database | Regional (us-central1), Auto-scaling |
| **Cloud Storage** | User profiles & media | Standard storage class, Regional buckets |
| **Cloud Pub/Sub** | Async message queuing | For inter-service communication |
| **Cloud Monitoring** | Metrics & observability | Custom dashboards, Alerts |
| **Cloud Logging** | Centralized log aggregation | Structured JSON logging |
| **Secret Manager** | Secure credential storage | API keys, Database credentials |
| **Cloud Build** | CI/CD pipeline | GitHub integration, Auto-deploy |
| **Cloud IAM** | Access control | Service accounts, Custom roles |
| **BigQuery** | Analytics & reporting | Data warehouse for analytics |
| **Vertex AI Vector Search** | Vector embeddings store | Alternative to Pinecone |

**Default Fallback (if Vertex AI unavailable):**
- OpenAI GPT-4 Turbo API

---

### Database & Data Storage (FINALIZED)

#### **Primary Databases:**
1. **Firebase Firestore** (Real-time NoSQL)
   - Collections: users, restaurants, reservations, reviews, menus
   - Region: us-central1
   - Indexing: Automatic for queries

2. **Neo4j** (Graph Database)
   - Deployment: Neo4j Aura on GCP
   - Purpose: User preference graphs, restaurant relationships, recommendation engine

3. **Pinecone or Vertex AI Vector Search** (Vector Database)
   - Dimension: 768 (for Gemini embeddings)
   - Index type: Approximate Nearest Neighbor (ANN)
   - Purpose: Semantic search and RAG

#### **Backup & Archival:**
- Cloud Storage for backups (weekly snapshots)
- BigQuery for historical analytics

---

### Deployment Summary (FINALIZED)

**Environment Structure:**
```
Development (Local):
├── React dev server (localhost:3000)
├── Express API server (localhost:5000)
└── FastAPI AI service (localhost:8000)

Staging (GCP):
├── Cloud Run: Express API (api-staging.restaurant-chatbot.com)
├── Cloud Run: FastAPI (ai-staging.restaurant-chatbot.com)
└── Firestore (staging project)

Production (GCP):
├── Cloud Run: Express API (api.restaurant-chatbot.com)
├── Cloud Run: FastAPI (ai.restaurant-chatbot.com)
└── Firestore (production project)
```

**Containerization:**
- Dockerfile for Express.js (Node.js 18-alpine)
- Dockerfile for FastAPI (Python 3.11-slim)
- Docker Compose for local development orchestration

**CI/CD Pipeline (GitHub Actions):**
1. Test: Jest (frontend), Mocha (Node.js), Pytest (Python)
2. Build: Docker image creation
3. Push: GCP Artifact Registry
4. Deploy: Cloud Run automatic deployment
5. Smoke Tests: Health check verification

---

### Deployment Infrastructure (FINALIZED)

| Component | Service | Configuration |
|-----------|---------|----------------|
| **Web Frontend** | Cloud Storage + Cloud CDN | Static files, Global CDN |
| **REST API** | Cloud Run | Auto-scaling, 2-20 instances |
| **AI Service** | Cloud Run | Auto-scaling, 1-10 instances |
| **Database (NoSQL)** | Firestore | Regional, Auto-scaling |
| **Graph Database** | Neo4j Aura | Managed cloud instance |
| **Vector DB** | Vertex AI Vector Search | Serverless, On-demand |
| **Message Queue** | Cloud Pub/Sub | For async operations |
| **Monitoring** | Cloud Monitoring + Sentry | Real-time alerts |
| **Logging** | Cloud Logging + ELK Stack | Centralized aggregation |
| **Traffic Management** | Cloud Load Balancer | SSL/TLS termination |
| **DNS** | Cloud DNS | Route53 alternative: Google Domains |

---

## 8. RECOMMENDED TECH STACK (FINALIZED)

### Frontend
- **React 18+ / Expo Go** for mobile-first approach
- **Tailwind CSS** for styling
- **Axios + React Query** for state management
- **TypeScript** for type safety

### Backend
- **2 Microservices Architecture:**
  - **Service 1:** Node.js 18+ with Express.js (Primary API)
  - **Service 2:** Python 3.11+ with FastAPI (AI/Agent Orchestration)
- **TypeScript** for Node.js type safety
- **Firebase Firestore** for real-time data
- **Neo4j** for personalization engine

### AI Engineering
- **Python FastAPI** for AI microservice
- **LangChain** for agent orchestration
- **Google Vertex AI (Gemini Pro)** for LLM
- **Vertex AI Vector Search / Pinecone** for vector embeddings
- **Stripe API** for payment processing

### Deployment
- **Docker + Google Cloud Run** for containerized deployment
- **Google Cloud Platform** for complete infrastructure
- **GitHub Actions** for CI/CD automation
- **Cloud Monitoring + Sentry + ELK** for logging and observability

---

## 9. MICROSERVICES ARCHITECTURE DETAILS

### ✅ Microservices Approach (RECOMMENDED)

Yes, using **microservices for both Node.js and Python FastAPI is ideal** for this project:

#### **Why Microservices?**
- **Separation of Concerns:** Node.js handles API/business logic, FastAPI handles AI/intelligence
- **Independent Scaling:** AI service scales independently during peak demand
- **Technology Flexibility:** Use the best tool for each service
- **Easier Debugging:** Isolated services simplify troubleshooting
- **Deployment Independence:** Deploy updates without affecting other services

#### **Service Communication Patterns:**

```
Frontend (PWA)
    ↓
API Gateway / Load Balancer
    ├→ Node.js Service (Port 5000)
    │   - REST endpoints
    │   - WebSocket connections
    │   - Authentication
    │   - Business logic
    │
    └→ FastAPI Service (Port 8000)
        - Agent orchestration
        - LLM calls
        - Vector operations
        - ML processing
```

#### **Inter-Service Communication:**
1. **Synchronous:** REST API calls (Axios/httpx with timeouts)
2. **Asynchronous:** Cloud Pub/Sub messages (for long-running tasks)
3. **Event-Driven:** Firestore triggers for real-time updates

#### **Service Boundaries:**

| Node.js API Server | FastAPI AI Service |
|-------------------|-------------------|
| User authentication | LLM integration |
| Restaurant CRUD | Agent orchestration |
| Reservation management | Vector embeddings |
| Payment webhooks | Recommendation engine |
| WebSocket real-time | Semantic search |
| Menu management | NLP processing |
| Review handling | Context analysis |

---

## 10. PYTHONIC ARCHITECTURE FOR FASTAPI

### **Python Project Structure (Pythonic Best Practices)**

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration management (Pydantic)
│   ├── dependencies.py         # Dependency injection
│   ├── logging_config.py       # Logging setup
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── agents.py       # Agent endpoints
│   │   │   ├── embeddings.py   # Vector endpoints
│   │   │   └── health.py       # Health check
│   │   └── schemas/
│   │       ├── __init__.py
│   │       ├── agent.py        # Pydantic models
│   │       ├── message.py
│   │       └── response.py
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py       # Abstract agent class
│   │   ├── discovery_agent.py  # Discovery agent logic
│   │   ├── recommendation_agent.py
│   │   ├── reservation_agent.py
│   │   ├── payment_agent.py
│   │   └── orchestrator.py     # Main orchestration
│   │
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── vertex_ai.py        # Vertex AI wrapper
│   │   ├── prompts.py          # Prompt templates
│   │   └── chains.py           # LangChain chains
│   │
│   ├── embeddings/
│   │   ├── __init__.py
│   │   ├── vector_store.py     # Vector DB wrapper
│   │   └── embedding_service.py
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── firestore.py        # Firestore client
│   │   ├── neo4j.py            # Neo4j client
│   │   └── mongodb.py          # MongoDB client
│   │
│   ├── external_services/
│   │   ├── __init__.py
│   │   ├── stripe_client.py    # Stripe integration
│   │   └── google_maps.py      # Maps API
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py             # JWT verification
│   │   ├── logging.py          # Request logging
│   │   └── error_handling.py   # Error handlers
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── validators.py       # Input validation
│   │   ├── formatters.py       # Data formatting
│   │   └── helpers.py          # Utility functions
│   │
│   └── cache/
│       ├── __init__.py
│       └── redis_cache.py      # Redis caching
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Pytest fixtures
│   ├── unit/
│   │   ├── test_agents.py
│   │   ├── test_llm.py
│   │   └── test_embeddings.py
│   ├── integration/
│   │   ├── test_api.py
│   │   ├── test_firestore.py
│   │   └── test_neo4j.py
│   └── e2e/
│       └── test_workflows.py
│
├── scripts/
│   ├── __init__.py
│   ├── seed_data.py            # Database seeding
│   ├── migrate.py              # Database migrations
│   └── setup_indices.py        # Vector index setup
│
├── .env.example                 # Environment template
├── .env.local                   # Local development
├── requirements.txt             # Python dependencies
├── requirements-dev.txt         # Development dependencies
├── pyproject.toml              # Modern Python packaging
├── poetry.lock                 # (if using Poetry)
├── Dockerfile                  # Container image
├── docker-compose.yml          # Local services
├── pytest.ini                  # Pytest config
├── .pylintrc                   # Linting config
└── README.md                   # Documentation
```

### **Pythonic Code Patterns**

#### **1. Configuration Management (Pydantic Settings)**
```python
# app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Configuration using Pydantic V2"""
    
    # App settings
    app_name: str = "Restaurant AI Service"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    
    # Firebase
    firebase_project_id: str
    firestore_database: str = "(default)"
    
    # Vertex AI
    vertex_ai_project: str
    vertex_ai_region: str = "us-central1"
    vertex_ai_model: str = "gemini-1.5-pro"
    
    # Neo4j
    neo4j_uri: str
    neo4j_user: str
    neo4j_password: str
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
```

#### **2. Dependency Injection (FastAPI Dependencies)**
```python
# app/dependencies.py
from fastapi import Depends
from typing import Annotated
from app.config import get_settings, Settings
from app.database.firestore import FirestoreClient
from app.llm.vertex_ai import VertexAIClient

async def get_firestore_client(
    settings: Annotated[Settings, Depends(get_settings)]
) -> FirestoreClient:
    """Dependency for Firestore client"""
    return FirestoreClient(settings.firebase_project_id)

async def get_vertex_ai_client(
    settings: Annotated[Settings, Depends(get_settings)]
) -> VertexAIClient:
    """Dependency for Vertex AI client"""
    return VertexAIClient(
        project=settings.vertex_ai_project,
        region=settings.vertex_ai_region
    )

# Usage in routes
from typing import Annotated

@router.post("/discover")
async def discover(
    query: str,
    firestore: Annotated[FirestoreClient, Depends(get_firestore_client)],
    llm: Annotated[VertexAIClient, Depends(get_vertex_ai_client)]
):
    """Discovery agent endpoint"""
    return await firestore.search_restaurants(query)
```

#### **3. Pydantic Models (Request/Response Validation)**
```python
# app/api/schemas/agent.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class RestaurantQuery(BaseModel):
    """User restaurant search query"""
    
    location: str = Field(..., min_length=3, max_length=100)
    cuisine: Optional[str] = None
    price_range: Optional[int] = Field(None, ge=1, le=5)
    rating_min: Optional[float] = Field(None, ge=0, le=5)
    available_date: Optional[datetime] = None
    party_size: Optional[int] = Field(None, ge=1, le=20)
    
    @validator("location")
    def location_must_be_valid(cls, v):
        if not v.replace(" ", "").isalpha():
            raise ValueError("Location must contain only letters")
        return v.strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "location": "San Francisco",
                "cuisine": "Italian",
                "price_range": 3,
                "party_size": 4
            }
        }

class AgentResponse(BaseModel):
    """Standardized agent response"""
    
    agent_name: str
    action: str
    result: dict
    reasoning: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="success")
```

#### **4. Agent Base Class (OOP Pattern)**
```python
# app/agents/base_agent.py
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from langchain.agents import Agent
from app.llm.vertex_ai import VertexAIClient

class BaseAgent(ABC):
    """Abstract base agent class"""
    
    def __init__(self, llm_client: VertexAIClient):
        self.llm_client = llm_client
        self.name = self.__class__.__name__
        self.logger = self._setup_logger()
    
    @abstractmethod
    async def execute(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent logic"""
        pass
    
    async def validate_input(self, query: str) -> bool:
        """Validate input query"""
        return len(query.strip()) > 0
    
    def _setup_logger(self):
        import logging
        return logging.getLogger(self.name)

class DiscoveryAgent(BaseAgent):
    """Restaurant discovery agent"""
    
    async def execute(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        if not await self.validate_input(query):
            return {"error": "Invalid query"}
        
        self.logger.info(f"Executing discovery for: {query}")
        # Agent logic here
        return {"restaurants": []}
```

#### **5. Error Handling (Custom Exceptions)**
```python
# app/middleware/error_handling.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from datetime import datetime

class RestaurantChatbotException(Exception):
    """Base exception"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class AgentExecutionError(RestaurantChatbotException):
    """Agent execution failed"""
    def __init__(self, message: str):
        super().__init__(message, 503)

class ValidationError(RestaurantChatbotException):
    """Input validation failed"""
    def __init__(self, message: str):
        super().__init__(message, 422)

async def exception_handler(request: Request, exc: RestaurantChatbotException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path
        }
    )

def setup_error_handlers(app: FastAPI):
    app.add_exception_handler(RestaurantChatbotException, exception_handler)
```

#### **6. Async/Await Patterns**
```python
# Efficient async operations
import asyncio
from typing import List

async def process_restaurants_async(restaurant_ids: List[str]):
    """Process multiple restaurants concurrently"""
    tasks = [
        fetch_restaurant_details(rid) for rid in restaurant_ids
    ]
    return await asyncio.gather(*tasks)

@router.post("/batch-search")
async def batch_search(queries: List[str]):
    """Concurrent query processing"""
    results = await asyncio.gather(
        *[process_query(q) for q in queries]
    )
    return results
```

### **Development Best Practices**
- Use **Black** for code formatting
- Use **Pylint/Ruff** for linting
- Use **Pytest** for testing (unit, integration, e2e)
- Use **Poetry** or **pip-tools** for dependency management
- Use **Type hints** everywhere
- Use **Docstrings** (Google/Sphinx format)
- Use **Context managers** for resource cleanup
- Use **Logging** instead of print statements

---

## 11. MOBILE FRAMEWORK GUIDANCE

### ❌ **NX Framework - NOT Recommended for This Project**

**Why NOT use NX?**
- NX is designed for **monorepo management** (multiple projects in one repo)
- Your setup has **3 separate services** (React PWA, Node.js, Python FastAPI)
- NX adds complexity without clear benefits
- Python/FastAPI not well-supported in NX
- Better to keep services in **separate repositories**

### ✅ **Recommended Mobile/Frontend Approach**

#### **Option 1: React PWA Only (RECOMMENDED)**
```
Single React PWA application
├── Works in browsers (web)
├── Install as PWA on mobile home screen
├── Responsive design (Tailwind)
├── Service workers for offline
├── Single deployment
```

**Use These Tools:**
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Responsive styling
- **React Query** - State management
- **Workbox** - Service workers
- **PWA manifest** - Installability

#### **Option 2: React PWA + React Native App (If Native Performance Needed)**
```
Separate projects in separate repos:
├── web-app/          (React PWA - Vite)
├── mobile-app/       (React Native 0.73+ - Expo)
├── backend-api/      (Node.js Express)
└── backend-ai/       (Python FastAPI)
```

**Use These Tools:**
- **React.js + Vite** (Web PWA)
- **React Native 0.73 + Expo** (Mobile)
- ❌ **NOT NX** (just separate Git repos)

#### **Code Sharing (Optional):**
If you want to share code:
```
shared-components/
├── types/
├── utils/
├── constants/
└── hooks/
```
Publish as npm package and use in both projects.

### **Recommended Monorepo Setup (If You Want Code Sharing)**

Use **simple monorepo WITHOUT NX:**

```
agentic-restaurant-chatbot/
├── apps/
│   ├── web-pwa/              (React PWA)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── mobile/               (React Native)
│   │   ├── src/
│   │   ├── package.json
│   │   └── app.json (Expo)
│   │
│   ├── backend-api/          (Node.js)
│   │   ├── src/
│   │   └── package.json
│   │
│   └── backend-ai/           (Python FastAPI)
│       ├── app/
│       └── requirements.txt
│
├── packages/
│   ├── shared-types/         (TypeScript types)
│   ├── shared-utils/         (Utilities)
│   └── shared-schemas/       (Validation schemas)
│
├── docker-compose.yml
├── package.json (root)
└── README.md
```

**Tools for Simple Monorepo:**
- **npm workspaces** (no Nx needed)
- **Turborepo** (if you need build caching)
- **Git submodules** (for completely separate services)

---

### **Final Recommendation for Frontend Stack**

| Aspect | Recommendation | Why |
|--------|---|---|
| **Web App** | React 18 + Vite + Tailwind | PWA-ready, responsive, fast |
| **Mobile** | React Native + Expo (separate) | Native performance if needed |
| **Code Sharing** | npm workspaces | Simple, no NX complexity |
| **Monorepo Tool** | None needed / Turborepo | Keep it lightweight |
| **Mobile Framework** | ❌ NOT NX | NX = monorepo tool, not mobile tool |

---

## 12. DEPENDENCIES & PACKAGES (Quick Reference)

### Frontend (npm)
```
react, react-router-dom, axios, react-query, tailwindcss, 
typescript, vite, framer-motion, zustand/redux
```

### Backend (npm)
```
express, typescript, ts-node, firebase-admin, neo4j-driver,
axios, stripe, jsonwebtoken, bcryptjs, cors, dotenv
```

### Python FastAPI
```
fastapi, uvicorn, langchain, python-dotenv, google-cloud-aiplatform,
pinecone-client, openai (optional), pydantic, pydantic-settings
```

---

This finalized technology stack provides a scalable, modern, and integrated solution for your agentic restaurant chatbot platform, balancing innovation with practical deployment considerations.

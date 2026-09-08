# API Configuration & Authentication Guide

## ✅ What's Already Set Up

### 1. **Google Cloud Credentials** (For Gemini & Vertex AI)
- ✅ Service account key: `credentials.json`
- ✅ Project ID: `agentic-restaurant`
- ✅ Already configured in: `services/ai/.env`

### 2. **Firebase Credentials** (For Authentication & Firestore)
- ✅ Service account key: `credentials.json` (same as Google Cloud)
- ✅ Project ID: `agentic-restaurant-chatbot`
- ✅ Already configured in: `services/api/.env.local`

### 3. **Frontend Configuration** (Vite + React)
- ✅ Firebase Web API Key: Configured in `packages/@restaurant/web/.env.local`
- ✅ Google OAuth Client ID: Configured in `packages/@restaurant/web/.env.local`
- ✅ API URL: `http://localhost:5000`

---

## 🚀 Starting All Services

### Option 1: Individual Terminal Windows (Easiest)

**Terminal 1 - Start Express API (Port 5000):**
```bash
cd services/api
npm run dev
```

**Terminal 2 - Start Python AI Service (Port 8000):**
```bash
cd services/ai
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 3 - Start Frontend (Port 5173):**
```bash
cd packages/@restaurant/web
npm run dev
```

### Option 2: Using Batch Scripts (Windows)

Run the provided startup scripts:
1. `start-api-service.bat` - Express API
2. `start-ai-service.bat` - Python AI Service
3. `start-web.sh` or manual `npm run dev` in web folder

---

## 🔑 API Keys & Credentials Breakdown

| Service | Type | Location | Status |
|---------|------|----------|--------|
| **Google Cloud / Gemini** | Service Account Key | `credentials.json` | ✅ Ready |
| **Firebase** | Service Account Key | `credentials.json` | ✅ Ready |
| **Firebase Web** | Web API Key | `packages/@restaurant/web/.env.local` | ✅ Ready |
| **Google OAuth** | Client ID | `packages/@restaurant/web/.env.local` | ✅ Ready |

---

## 📋 Environment Variables

### Python AI Service (services/ai/.env)
```bash
GOOGLE_CLOUD_PROJECT=agentic-restaurant
GOOGLE_APPLICATION_CREDENTIALS=../../credentials.json
VERTEX_AI_REGION=us-central1
VERTEX_AI_MODEL=gemini-1.5-pro
PORT=8000
```

### Backend API (services/api/.env.local)
```bash
PORT=5000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
```

### Frontend (packages/@restaurant/web/.env.local)
```bash
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_PROJECT_ID=agentic-restaurant-chatbot
VITE_GOOGLE_CLIENT_ID=your-client-id
```

---

## ✅ Verification

Check if all services are running:

```bash
# Check Express API
netstat -ano | findstr :5000
# Should show: LISTENING on port 5000

# Check Python AI Service
netstat -ano | findstr :8000
# Should show: LISTENING on port 8000

# Check Frontend (if running)
netstat -ano | findstr :5173
# Should show: LISTENING on port 5173
```

Or use curl:
```bash
curl http://localhost:5000/api/health
curl http://localhost:8000/docs
```

---

## 🛠️ Troubleshooting

### AI Service Won't Start
1. Check if credentials.json exists
2. Verify GOOGLE_CLOUD_PROJECT is set
3. Check if port 8000 is available
4. Install python-dotenv: `pip install python-dotenv`

### API Responding with Errors
1. Check .env files are properly configured
2. Verify credentials.json path is correct
3. Check Firebase project ID matches

### Frontend Can't Connect to API
1. Ensure VITE_API_URL points to correct port
2. Check CORS is enabled in backend
3. Verify both backend and frontend are running

---

## 📚 API Endpoints

### AI Service (http://localhost:8000)
- `POST /api/v1/agents/discover` - Discovery Agent
- `POST /api/v1/agents/recommend` - Recommendation Agent
- `GET /docs` - API Documentation (Swagger UI)

### Backend API (http://localhost:5000)
- `POST /api/chat/send` - Send chat message
- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup

---

## ✨ Next Steps

1. ✅ All services are configured and ready
2. 🚀 Start the services using the command above
3. 💬 Open chatbot in browser: `http://localhost:5173`
4. 🧪 Try a test message: "Find Italian restaurants in Colombo"

Everything is connected! You're ready to go! 🎉

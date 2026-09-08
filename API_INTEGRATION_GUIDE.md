# API Integration Setup Guide

## Overview
The chatbot front-end is now fully integrated with your backend services. This guide explains how to set everything up and run it.

**🇱🇰 Important:** This chatbot is designed exclusively for Sri Lankan restaurants and locations. Only Sri Lankan cities are supported (Colombo, Kandy, Galle, Jaffna, Trincomalee, etc.). See [SRI_LANKAN_LOCATIONS.md](SRI_LANKAN_LOCATIONS.md) for the complete list of supported cities.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│            React Web Application                        │
│  (packages/@restaurant/web)                             │
│                                                          │
│  ChatInterface → chatService.ts → API Calls            │
└────────────┬──────────────────────────────────────────┘
             │
    ┌────────┴──────────┐
    ▼                   ▼
┌─────────────┐   ┌──────────────┐
│ Express API │   │ Python AI    │
│ (Port 5000) │   │ Service      │
│             │   │ (Port 8000)  │
├─────────────┤   ├──────────────┤
│ /api/chat/*  │   │ /api/v1/...  │
│ (chat routes)│   │ agents/*     │
└─────────────┘   └──────────────┘
    │ │               │ │ │
    └─┴───────────────┴─┴─┘
        Firebase + Neo4j
```

---

## Environment Setup

### Step 1: Configure Environment Variables

1. Copy the example file:
```bash
cd packages/@restaurant/web
cp .env.example .env.local
```

2. Edit `.env.local` and set your API URLs:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:8000
```

**Note**: Leave these as localhost for local development. For production, change to your server URLs.

---

## Running All Services

### Terminal 1: Start Python AI Service

```bash
cd services/ai
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Terminal 2: Start Express API Service

```bash
cd services/api
npm install
npm run dev
```

**Expected Output**:
```
🚀 Express API Server Started
📡 Listening on http://localhost:5000
💬 Chat endpoints: http://localhost:5000/api/chat/*
```

### Terminal 3: Start React Development Server

```bash
cd packages/@restaurant/web
npm install
npm run dev
```

**Expected Output**:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Testing the Integration

### Test 1: Simple Health Check

In your browser or terminal, check if services are running:

```bash
# Express API
curl http://localhost:5000/health

# Python AI Service
curl http://localhost:8000/health
```

Both should return JSON with status "healthy".

### Test 2: Discovery Agent End-to-End

1. Open http://localhost:5173 in your browser
2. In the chat, type: "Find Italian restaurants in Colombo for 4 people"
3. Observe:
   - Message sent to React component
   - ChatService extracts query: `{ location: "Colombo", cuisine: "Italian", party_size: 4 }`
   - API call to `http://localhost:8000/api/v1/agents/discover`
   - Python AI service processes request
   - Response returned with real restaurant data
   - Restaurant cards displayed in chat

### Test 3: Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message in chat
4. See requests to:
   - `localhost:8000` (Python AI service) - for agent calls
   - `localhost:5000` (Express API) - for chat management

---

## How It Works Now

### Before (Hardcoded Data)
```
User: "Find restaurants"
  ↓
ChatInterface
  ↓
setTimeout → mock data 
  ↓
Display hardcoded results
```

### After (Real API)
```
User: "Find Italian restaurants for 4 in Colombo"
  ↓
ChatInterface.handleSendMessage()
  ↓
shouldCallAgent() → detects "discovery"
  ↓
extractRestaurantQuery() → parses message
  ↓
discoverRestaurants(query) → calls Python AI
  ↓
POST http://localhost:8000/api/v1/agents/discover
  ↓
Python AI processes with agents
  ↓
Returns: { restaurants: [...], reasoning: "..." }
  ↓
Display real restaurant data
```

---

## API Endpoints

### Python AI Service Endpoints (Used by ChatService)

**Discovery Agent** - Search restaurants
```
POST /api/v1/agents/discover
Body: {
  location: "Colombo",
  cuisine?: "Italian",
  party_size: 4,
  budget?: "moderate"
}

Response: {
  agent_name: "DiscoveryAgent",
  action: "searched_restaurants",
  result: {
    restaurants: [...],
    count: 3,
    reasoning: "Found 3 restaurants..."
  }
}
```

**Recommendation Agent** - Get personalized suggestions
```
POST /api/v1/agents/recommend?user_id=123
Response: {
  agent_name: "RecommendationAgent",
  action: "generated_recommendations",
  result: { restaurants: [...] }
}
```

**Reservation Agent** - Create booking
```
POST /api/v1/agents/reserve
Body: {
  user_id: "123",
  restaurant_id: "rest_1",
  date: "2024-03-10",
  time: "19:30",
  party_size: 4,
  special_requests?: "Window seat"
}

Response: {
  agent_name: "ReservationAgent",
  action: "created_reservation",
  result: { confirmation_code: "ABC123" }
}
```

---

## Chat Service Functions

Located in `services/chatService.ts`:

### Main Functions
- `sendChatMessage()` - Send message to backend (future)
- `getConversations()` - Get user's conversation history
- `getConversation()` - Get specific conversation with messages
- `createConversation()` - Start new conversation
- `deleteConversation()` - Delete a conversation

### Agent Functions
- `discoverRestaurants(query)` - Call Discovery Agent
- `getRecommendations(userId)` - Call Recommendation Agent
- `makeReservation(data)` - Call Reservation Agent

### Helper Functions
- `extractRestaurantQuery(message)` - Parse user message to extract search parameters
- `shouldCallAgent(message)` - Detect which agent to call based on message content

---

## Troubleshooting

### "Failed to fetch from localhost:8000"
- Check if Python AI service is running
- Verify port 8000 is not in use
- Check CORS settings (should be open for localhost)

### "Chat API error: 401"
- Add authentication token to requests
- Check `.env.local` for correct API URLs

### "Cannot find module _services/chatService_"
- Ensure file was created at correct path
- Check file is imported correctly in ChatInterface

### Restaurants not showing
- Check browser console (F12) for errors
- Verify Discovery Agent response format
- Check that restaurant data includes required fields

### Empty state still shows after message
- Ensure Firebase initialization is correct
- Check conversation creation is working

---

## Next Steps

### Implement Missing Features
- [ ] Real authentication with JWT tokens
- [ ] Firebase conversation persistence
- [ ] WebSocket for real-time messages
- [ ] User profile integration
- [ ] Reservation confirmation emails/SMS
- [ ] Payment processing integration

### Optimize Performance
- [ ] Cache restaurant search results
- [ ] Implement pagination for large result sets
- [ ] Add loading skeletons
- [ ] Compress images
- [ ] Lazy-load conversation history

### Enhance UX
- [ ] Add voice input/output
- [ ] Implement rich message formatting
- [ ] Add image upload for receipts
- [ ] Create booking confirmation UI
- [ ] Add user feedback/ratings

### Testing
- [ ] Add unit tests for chatService
- [ ] Add E2E tests for chat flow
- [ ] Load testing for concurrent chats
- [ ] API response validation

---

## Configuration Notes

### CORS Configuration
Make sure your Express API has CORS properly configured for localhost:5173:

```typescript
// services/api/src/main.ts
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

### Python AI Service CORS
Ensure FastAPI has CORS middleware for frontend requests:

```python
# services/ai/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Production Deployment

### Environment Variables
Change `.env.production`:
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_AI_SERVICE_URL=https://ai-service.yourdomain.com
```

### API URLs
Update to use HTTPS on your production servers.

### Authentication
Implement proper JWT token refresh mechanism in chatService.

### Rate Limiting
Add rate limiting to prevent abuse of discovery searches.

---

## Support

For issues or questions:
1. Check browser console (F12) for detailed errors
2. Review terminal output of each service
3. Verify all services are running on correct ports
4. Check `.env.local` configuration
5. Review API response formats match expected structure

---

**Status**: ✅ API Integration Ready - You can now send real restaurant queries!

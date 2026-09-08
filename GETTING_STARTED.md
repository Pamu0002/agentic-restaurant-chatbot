# 🚀 Step-by-Step Getting Started Guide

This guide will help you run the project and understand each component. We'll start with the basics!

## ⏱️ Estimated Time: 30 minutes

---

## Step 1: Verify Project Structure ✅

First, let's check that everything is in place:

```bash
# You should see this structure:
agentic-restaurant-chatbot/
├── apps/
│   ├── web-pwa/              ← React Frontend
│   ├── backend-api/          ← Node.js API
│   └── backend-ai/           ← Python FastAPI
├── packages/                 ← Shared code
├── package.json
└── docker-compose.yml
```

---

## Step 2: Start the Backend API (Node.js) 🖥️

The backend API handles business logic and database operations.

### Open Terminal 1:

```bash
# Navigate to backend-api folder
cd apps/backend-api

# Start the development server
npm run dev
```

**Expected output:**
```
═══════════════════════════════════════════════════════
🚀 Express API Server Started
📡 Listening on http://localhost:5000
🏥 Health check: http://localhost:5000/health
═══════════════════════════════════════════════════════
```

### Test the API:

In your browser, visit: http://localhost:5000/health

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": ...
}
```

**What's happening:**
- Express server starts on port 5000
- Listens for HTTP requests
- Routes are defined in `src/main.ts`

---

## Step 3: Start the FastAPI AI Service 🤖

The AI service handles intelligent features and agent orchestration.

### Open Terminal 2:

```bash
# Navigate to backend-ai folder
cd apps/backend-ai

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
═══════════════════════════════════════════════════════
🚀 FastAPI AI Service Starting
📡 Listening on http://localhost:8000
📖 API Docs: http://localhost:8000/docs
═══════════════════════════════════════════════════════
```

### Test the API:

In your browser, visit: http://localhost:8000/docs

You'll see **Swagger UI** - interactive API documentation!

**Click on any endpoint to test it:**
1. Click `/api/v1/agents/discover`
2. Click "Try it out"
3. Enter a query
4. Click "Execute"

**What's happening:**
- FastAPI creates automatic API docs
- Each endpoint is listed with inputs/outputs
- You can test API without using curl/Postman

---

## Step 4: Start the React Frontend 🎨

The frontend is what users interact with.

### Open Terminal 3:

```bash
# Navigate to web-pwa folder
cd apps/web-pwa

# Start the development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://127.0.0.1:3000/
  ➜  press h to show help
```

### Visit the App:

Open in your browser: http://localhost:3000

You should see:
- Navigation bar
- Search box
- Welcome message
- Featured restaurants

**What's happening:**
- Vite starts development server
- Hot reload enabled (changes reflect instantly)
- React components render to the browser
- Frontend communicates with backend via API

---

## Step 5: Test Frontend ↔ Backend Communication 🔗

Let's test if frontend can talk to backend!

### Test 1: GET Restaurants

1. In your browser, go to: http://localhost:3000
2. Search for "Paris"
3. Open browser DevTools (F12)
4. Go to Network tab
5. Click Search button
6. You should see a request to:
   `GET http://localhost:5000/api/v1/restaurants?location=Paris`

**What you should see:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "1",
      "name": "Pizza Palace",
      "location": "Paris",
      "cuisine": "Italian",
      "rating": 4.5
    },
    ...
  ]
}
```

### Test 2: Test API Directly

In your browser, go to: http://localhost:5000/api/v1/restaurants?location=Paris

You should see the same JSON response!

---

## Step 6: Understanding the Data Flow 📊

Here's what happens when you search:

```
User types "Paris" in search box
           ↓
onClick → handleSearch() function runs (HomePage.tsx)
           ↓
Axios makes HTTP GET request to backend
GET /api/v1/restaurants?location=Paris
           ↓
Express server (main.ts) receives request
           ↓
Route handler processes it:
- Extracts query parameter: location = "Paris"
- TODO: Query Firestore database
- Returns mock restaurant data
           ↓
Response sent back to frontend as JSON
           ↓
React state updates with data
           ↓
Component re-renders with new data
           ↓
User sees search results!
```

---

## Step 7: Create Your First API Endpoint 🔧

Let's add a new endpoint that the frontend can use!

### Add to `apps/backend-api/src/main.ts`:

```typescript
/**
 * GET TOP RESTAURANTS
 * Returns the most popular restaurants
 */
app.get('/api/v1/restaurants/top', async (req: Request, res: Response) => {
  try {
    // Mock top restaurants
    const topRestaurants = [
      { id: '1', name: 'Pizza Palace', rating: 4.9, location: 'Paris' },
      { id: '2', name: 'Le Petit Bistro', rating: 4.8, location: 'Paris' },
      { id: '3', name: 'Tokyo Express', rating: 4.7, location: 'Paris' }
    ];

    res.json({
      success: true,
      data: topRestaurants
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top restaurants' });
  }
});
```

### Test it:

Visit: http://localhost:5000/api/v1/restaurants/top

You should see the top restaurants!

---

## Step 8: Create Your First React Component 🎯

Let's create a component that displays top restaurants!

### Create file: `apps/web-pwa/src/components/TopRestaurants.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function TopRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top restaurants when component mounts
    const fetchTopRestaurants = async () => {
      try {
        const response = await axios.get('/api/v1/restaurants/top');
        setRestaurants(response.data.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRestaurants();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Top Rated Restaurants</h2>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>
          <h3>{restaurant.name}</h3>
          <p>⭐ {restaurant.rating}</p>
        </div>
      ))}
    </div>
  );
}
```

### Use it in HomePage:

Add to `apps/web-pwa/src/pages/HomePage.tsx`:

```typescript
import TopRestaurants from '../components/TopRestaurants';

// Inside the component:
return (
  <div className="home-page">
    {/* ... other content ... */}
    <TopRestaurants />
  </div>
);
```

### Verify it works:

1. Save the file
2. Browser should auto-refresh
3. You should see "Top Rated Restaurants" section on homepage

---

## Step 9: Test with Postman or Thunder Client (Optional) 📮

For more advanced testing, use Postman or Thunder Client:

### POST Test (Create Reservation):

```
Method: POST
URL: http://localhost:5000/api/v1/reservations
Headers: Content-Type: application/json
Body:
{
  "userId": "user123",
  "restaurantId": "rest456",
  "date": "2024-03-10",
  "partySize": 4
}
```

Expected Response:
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "res_1709980234",
    "userId": "user123",
    "restaurantId": "rest456",
    "date": "2024-03-10",
    "partySize": 4,
    "status": "pending"
  }
}
```

---

## Step 10: Key Concepts to Remember 🧠

### Frontend (React)
- **Components** = Reusable UI pieces
- **State** = Data that can change
- **Props** = Pass data between components
- **Hooks** = Special functions (useState, useEffect)
- **API calls** = Axios to fetch data from backend

### Backend API (Express)
- **Routes** = URL endpoints (/api/v1/...)
- **HTTP Methods** = GET, POST, PUT, DELETE
- **Middleware** = Process requests (cors, helmet, etc.)
- **Request/Response** = Receive data, send back data
- **Validation** = Check input is correct

### AI Service (FastAPI)
- **Endpoints** = Routes for AI operations
- **Pydantic Models** = Define data structure
- **Async/Await** = Handle multiple requests
- **Agents** = AI decision makers
- **Auto Docs** = Swagger UI at /docs

---

## 🎓 Learning Path

| Week | Topic | Action |
|------|-------|--------|
| 1 | Basics | Run servers, understand flow |
| 2 | Frontend | Create components, fetch data |
| 3 | Backend | Build API endpoints |
| 4 | Database | Connect Firestore/Neo4j |
| 5 | AI Integration | Test agents |
| 6 | Full Features | Authentication, real-time |
| 7 | Testing | Write tests |
| 8 | Deployment | Deploy to cloud |

---

## ❓ Troubleshooting

### Port already in use?
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### npm/pip not found?
- Install Node.js from nodejs.org
- Install Python from python.org
- Close and reopen terminal

### CORS error?
- Make sure backend is running on port 5000
- Check frontend is on port 3000
- CORS middleware in Express allows 3000

### Changes not showing?
- Check browser console for errors (F12)
- Refresh the page
- Check if server auto-restarted

---

## 📚 Quick Command Reference

```bash
# Start backend API
cd apps/backend-api && npm run dev

# Start AI service
cd apps/backend-ai && python -m uvicorn app.main:app --reload

# Start frontend
cd apps/web-pwa && npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

---

## 🎉 Congratulations! 

You now understand:
✅ Project structure  
✅ How frontend talks to backend  
✅ How to create API endpoints  
✅ How to create React components  
✅ Complete data flow  

**Next Step:** Add database integration and create more features!

---

**Need more help?** Check the LEARNING_GUIDE.md file!

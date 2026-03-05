# 🎓 Agentic Restaurant Chatbot - Learning Guide

## Welcome! 👋

This guide will teach you how to build a professional-grade AI chatbot system from scratch. We'll go step-by-step, covering both the **why** and **how** of each component.

---

## 📚 Table of Contents

1. [Project Architecture Basics](#project-architecture-basics)
2. [Frontend (React & Vite)](#frontend-react--vite)
3. [Backend API (Node.js & Express)](#backend-api-nodejs--express)
4. [Backend AI (Python & FastAPI)](#backend-ai-python--fastapi)
5. [Databases Explained](#databases-explained)
6. [API Design Principles](#api-design-principles)
7. [Real-time Communication](#real-time-communication)
8. [Development Workflow](#development-workflow)

---

## 🏗️ Project Architecture Basics

### **The Big Picture**

Your application has **3 main layers**:

```
┌─────────────────────────────────┐
│  USER INTERFACE (React PWA)     │  ← What users see
│  - Browser-based web app        │  ← Responsive design
└─────────────┬───────────────────┘
              │ HTTP & WebSocket
┌─────────────▼───────────────────┐
│  API LAYER (Node.js Express)    │  ← Business Logic
│  - Handles requests             │  ← Authentication
│  - Manages reservations         │  ← Real-time updates
└─────────────┬───────────────────┘
              │ REST API calls
┌─────────────▼───────────────────┐
│  AI LAYER (Python FastAPI)      │  ← Intelligence
│  - Talks to Google Vertex AI    │  ← Agent orchestration
│  - Processes natural language   │  ← Recommendations
└─────────────┬───────────────────┘
              │ Database queries
┌─────────────▼───────────────────┐
│  DATA LAYER                     │  ← Storage & Knowledge
│  - Firestore (Real-time DB)     │  ← User data & reservations
│  - Neo4j (Graph DB)             │  ← Recommendations
│  - MongoDB (Structured data)    │  ← Analytics
└─────────────────────────────────┘
```

---

## 💻 Frontend (React & Vite)

### **What is React?**

React is a JavaScript library that makes building interactive web interfaces easy. Think of it as **Lego blocks** for web UIs:
- Each component is a reusable block
- Components can use **state** (data that changes)
- When data changes, the UI automatically updates

### **Simple React Component Example**

```jsx
// A simple button component
import React, { useState } from 'react';

export function SearchRestaurant() {
  // State: This data persists until changed
  const [searchQuery, setSearchQuery] = useState('');

  // Handler: What happens when user clicks button
  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Send request to backend API
  };

  // JSX: HTML-like syntax in JavaScript
  return (
    <div className="search-container">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter restaurant name..."
      />
      <button onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
```

**Key Concepts:**
- `useState` = store data that can change
- `onChange` = react to user typing
- `onClick` = react to button clicks
- Component returns JSX (looks like HTML)

### **What is Vite?**

Vite is a build tool that:
1. Bundles your code into JavaScript files
2. Provides a fast development server (hot reload)
3. Optimizes for production

**Running React Dev Server:**
```bash
cd apps/web-pwa
npm run dev
# Visit http://localhost:3000 in your browser
```

---

## 🖥️ Backend API (Node.js & Express)

### **What is Node.js?**

Node.js is JavaScript that runs on the **server** (not in the browser). It lets you:
- Handle HTTP requests
- Connect to databases
- Process data
- Run business logic

### **What is Express.js?**

Express is a lightweight **web framework** for Node.js. Think of it as:
- A framework for handling **routes** (URLs)
- Middleware system for processing requests
- Easy integration with databases

### **Express Route Example**

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json()); // Parse JSON requests

// ROUTE: GET /api/v1/restaurants
// This endpoint returns a list of restaurants
app.get('/api/v1/restaurants', async (req, res) => {
  try {
    // Get query parameters
    const { location, cuisine } = req.query;
    
    // Fetch from database (example)
    const restaurants = await firestore
      .collection('restaurants')
      .where('location', '==', location)
      .get();

    // Send response back to client
    res.json({
      success: true,
      data: restaurants.docs.map(doc => doc.data()),
      count: restaurants.size
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ROUTE: POST /api/v1/reservations
// This endpoint creates a new reservation
app.post('/api/v1/reservations', async (req, res) => {
  try {
    // Get data from request body
    const { userId, restaurantId, date, partySize } = req.body;

    // Validate input (important!)
    if (!userId || !restaurantId || !date || !partySize) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Save to database
    const reservation = await firestore
      .collection('reservations')
      .add({
        userId,
        restaurantId,
        date,
        partySize,
        createdAt: new Date(),
        status: 'pending'
      });

    // Return created reservation
    res.status(201).json({
      success: true,
      data: {
        id: reservation.id,
        userId,
        restaurantId,
        date,
        partySize
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create reservation'
    });
  }
});

// Start server on port 5000
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
```

**Key Concepts:**
- `app.get()` = handle GET requests
- `app.post()` = handle POST requests (creating data)
- `req.query` = URL parameters (?location=paris)
- `req.body` = data sent in request
- `res.json()` = send JSON response

### **HTTP Methods (CRUD Operations)**

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Read data | Get list of restaurants |
| **POST** | Create new data | Create reservation |
| **PUT** | Update entire data | Update restaurant info |
| **DELETE** | Delete data | Cancel reservation |

### **Running Express Server:**
```bash
cd apps/backend-api
npm run dev
# Server listens on http://localhost:5000
```

---

## 🤖 Backend AI (Python & FastAPI)

### **What is FastAPI?**

FastAPI is a modern Python web framework that:
- Is fast and easy to learn
- Automatically validates data with Pydantic
- Auto-generates API documentation
- Supports async/await for concurrent operations

### **FastAPI Route Example**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
from google.cloud import aiplatform

app = FastAPI(title="Restaurant AI Service")

# Define request/response models
class RestaurantQuery(BaseModel):
    """User query for restaurant discovery"""
    location: str
    cuisine: str | None = None
    party_size: int = 2

class AgentResponse(BaseModel):
    """Response from AI agent"""
    agent_name: str
    result: dict
    reasoning: str

# ROUTE: GET /api/v1/agents/discover
# This endpoint uses AI to discover restaurants
@app.get("/api/v1/agents/discover", response_model=AgentResponse)
async def discover_restaurants(query: RestaurantQuery):
    """
    Discovery Agent - Finds restaurants matching user criteria
    
    Args:
        query: User's search criteria
        
    Returns:
        AgentResponse with discovered restaurants
    """
    try:
        # Initialize Vertex AI
        aiplatform.init(
            project=os.getenv("GOOGLE_CLOUD_PROJECT"),
            location="us-central1"
        )
        
        # Create prompt for LLM
        prompt = f"""
        User is looking for a restaurant with these criteria:
        - Location: {query.location}
        - Cuisine: {query.cuisine or 'Any'}
        - Party Size: {query.party_size}
        
        Find 5 suitable restaurants and return recommendations.
        """
        
        # Call Vertex AI (Gemini Pro)
        response = aiplatform.Prediction.predict(
            model="gemini-1.5-pro",
            instances=[{"prompt": prompt}]
        )
        
        return {
            "agent_name": "DiscoveryAgent",
            "result": response.predictions,
            "reasoning": "Analyzed user preferences and found matching restaurants"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ROUTE: POST /api/v1/agents/recommend
# This endpoint generates personalized recommendations
@app.post("/api/v1/agents/recommend", response_model=AgentResponse)
async def get_recommendations(user_id: str):
    """
    Recommendation Agent - Provides personalized suggestions
    using user history and preferences
    """
    try:
        # Fetch user preferences from Neo4j
        # (We'll implement this later)
        
        return {
            "agent_name": "RecommendationAgent",
            "result": {
                "restaurants": [
                    {"id": 1, "name": "Restaurant A", "score": 0.95},
                    {"id": 2, "name": "Restaurant B", "score": 0.87}
                ]
            },
            "reasoning": "Based on your past visits and ratings"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    """Check if service is running"""
    return {"status": "healthy"}

# Auto-generated API docs available at:
# http://localhost:8000/docs (Swagger UI)
```

**Key Concepts:**
- `@app.get()` = handle GET requests
- `@app.post()` = handle POST requests
- `BaseModel` = validate request data automatically
- `async def` = handle multiple requests concurrently
- `/docs` = automatic API documentation

### **Running FastAPI Server:**
```bash
cd apps/backend-ai
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# Server runs on http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

## 🗄️ Databases Explained

### **1. Firebase Firestore (Real-time NoSQL)**

**What is it?**
- Cloud database that syncs in real-time
- Perfect for user data, reservations
- Easy to set up, scales automatically

**Example Document Structure:**
```json
Collections:
├── users/
│   ├── user123
│   │   ├── name: "John Doe"
│   │   ├── email: "john@example.com"
│   │   ├── preferences: ["Italian", "French"]
│   │   └── createdAt: 2024-03-05
│
├── restaurants/
│   ├── rest456
│   │   ├── name: "Pizza Palace"
│   │   ├── location: "Paris"
│   │   ├── cuisine: "Italian"
│   │   ├── rating: 4.5
│   │   └── availability: {tables: 5}
│
└── reservations/
    ├── res789
    │   ├── userId: "user123"
    │   ├── restaurantId: "rest456"
    │   ├── date: "2024-03-10"
    │   ├── partySize: 4
    │   └── status: "confirmed"
```

**Basic Operations:**
```javascript
// Read
const doc = await firestore.collection('users').doc('user123').get();

// Create
await firestore.collection('users').add({
  name: 'Jane',
  email: 'jane@example.com'
});

// Update
await firestore.collection('users').doc('user123').update({
  name: 'Jane Updated'
});

// Delete
await firestore.collection('users').doc('user123').delete();
```

### **2. Neo4j (Graph Database)**

**What is it?**
- Stores data as **nodes** (entities) and **relationships** (connections)
- Perfect for recommendations: "People who liked X also liked Y"

**Example Graph:**
```
User John ──[rated]──> Restaurant Pizza Palace
User Jane ──[rated]──> Restaurant Pizza Palace
             ↓ [both enjoyed]
         [might like] Italian Cuisine
         
User John ──[lived_in]──> Paris
Restaurant ──[located_in]──> Paris
```

**Basic Operations:**
```javascript
// Query users who rated the same restaurant
const result = await neo4j.run(`
  MATCH (u1:User)-[:RATED]->(r:Restaurant)<-[:RATED]-(u2:User)
  WHERE u1.id = $userId
  RETURN u2.name, COUNT(*) as commonRestaurants
`, { userId: 'user123' });

// Create relationship
await neo4j.run(`
  MATCH (u:User {id: $userId}), (r:Restaurant {id: $restId})
  CREATE (u)-[:RATED {score: 5}]->(r)
`, { userId: 'user123', restId: 'rest456' });
```

### **3. MongoDB (Flexible Document DB)**

**What is it?**
- Like Firestore but self-hosted or cloud
- Good for structured data, analytics

**Example Collection:**
```json
{
  "_id": ObjectId("..."),
  "userId": "user123",
  "action": "viewed_restaurant",
  "restaurantId": "rest456",
  "timestamp": ISODate("2024-03-05T10:30:00Z")
}
```

---

## 🔌 API Design Principles

### **REST (Representational State Transfer)**

REST is a standard way to design APIs. Follow these rules:

**1. Use Standard HTTP Methods**
```
GET    /api/v1/restaurants          ← Retrieve list
GET    /api/v1/restaurants/ID       ← Retrieve single
POST   /api/v1/restaurants          ← Create new
PUT    /api/v1/restaurants/ID       ← Update
DELETE /api/v1/restaurants/ID       ← Delete
```

**2. Use Consistent Response Format**
```json
{
  "success": true,
  "statusCode": 200,
  "data": { /* your data */ },
  "message": "Operation successful",
  "timestamp": "2024-03-05T10:30:00Z"
}
```

**3. Use Proper Status Codes**
```
200 OK                 ← Request succeeded
201 Created            ← Resource created
400 Bad Request        ← Invalid input
401 Unauthorized       ← Not authenticated
403 Forbidden          ← Not authorized
404 Not Found          ← Resource doesn't exist
500 Server Error       ← Something went wrong
```

---

## ⚡ Real-time Communication

### **HTTP vs WebSocket**

**HTTP (Request-Response)**
```
Client: "Give me restaurant list?"
        ↓
Server: "Here's your list"
        ↓
Connection closes
```

Perfect for: One-time data requests

**WebSocket (Two-way Stream)**
```
Client ←──────→ Server
  ↑              ↓
  Send message   Receive message
  ↓              ↑
  Receive update Send update
```

Perfect for: Real-time table availability, notifications

### **Socket.io Example**

**Frontend (React)**
```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function ReservationStatus() {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // Connect to server
    const socket = io('http://localhost:5000');

    // Listen for updates
    socket.on('reservation:updated', (data) => {
      setStatus(data.status);
    });

    return () => socket.disconnect();
  }, []);

  return <div>Status: {status}</div>;
}
```

**Backend (Express)**
```javascript
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const io = new Server(app);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // When reservation changes
  app.post('/api/v1/reservations/:id/confirm', (req, res) => {
    // ... update database ...

    // Notify all connected clients
    io.emit('reservation:updated', {
      id: req.params.id,
      status: 'confirmed'
    });
  });
});
```

---

## 🔄 Development Workflow

### **Local Development Setup**

**Step 1: Start Backend Services**
```bash
# Terminal 1: Backend API
cd apps/backend-api
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: AI Service
cd apps/backend-ai
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
# Server runs on http://localhost:8000

# Terminal 3: Frontend
cd apps/web-pwa
npm run dev
# App runs on http://localhost:3000
```

**Step 2: Test API Endpoints**
```bash
# Using curl
curl http://localhost:5000/api/v1/restaurants

# Or use Postman / Thunder Client (easier)
```

**Step 3: View AI Service Docs**
```
Open: http://localhost:8000/docs
(Swagger/OpenAPI documentation generated automatically)
```

---

## 📋 Project Structure

```
agentic-restaurant-chatbot/
├── apps/
│   ├── web-pwa/          ← React PWA (Frontend)
│   │   ├── src/
│   │   │   ├── components/       ← Reusable UI components
│   │   │   ├── pages/           ← Full pages
│   │   │   ├── hooks/           ← Custom React hooks
│   │   │   ├── services/        ← API calls
│   │   │   ├── App.tsx          ← Main app component
│   │   │   └── main.tsx         ← Entry point
│   │   └── package.json
│   │
│   ├── backend-api/      ← Express API (Node.js)
│   │   ├── src/
│   │   │   ├── routes/          ← API endpoints
│   │   │   ├── middleware/      ← Auth, logging, etc.
│   │   │   ├── services/        ← Business logic
│   │   │   ├── models/          ← Data models
│   │   │   └── main.ts          ← Entry point
│   │   └── package.json
│   │
│   └── backend-ai/       ← FastAPI (Python)
│       ├── app/
│       │   ├── agents/          ← Discovery, Recommendation, etc.
│       │   ├── llm/             ← LLM integration
│       │   ├── database/        ← DB clients
│       │   ├── api/             ← API routes
│       │   └── main.py          ← Entry point
│       └── requirements.txt
│
└── packages/             ← Shared code
    ├── shared-types/     ← TypeScript types
    ├── shared-utils/     ← Helper functions
    └── shared-schemas/   ← Validation schemas
```

---

## 🎯 Learning Path

Follow this order to understand the project:

1. **Week 1:** Understand REST APIs and Express basics
2. **Week 2:** Learn React components and state management
3. **Week 3:** Implement authentication (JWT)
4. **Week 4:** Connect frontend to backend
5. **Week 5:** Set up databases (Firestore, Neo4j)
6. **Week 6:** Implement real-time features (Socket.io)
7. **Week 7:** Add AI integration (Vertex AI, LangChain)
8. **Week 8:** Testing and deployment

---

## 🚀 Quick Commands

```bash
# Install all dependencies
npm install

# Start all services in development
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Start with Docker
npm run docker:up
npm run docker:logs
npm run docker:down
```

---

## 📚 Resources to Learn

- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Firebase**: https://firebase.google.com/docs
- **Neo4j**: https://neo4j.com/developer/
- **Socket.io**: https://socket.io/docs/

---

## 💡 Key Takeaways

1. **Frontend** = What users see (React)
2. **Backend API** = Business logic & data management (Express)
3. **AI Service** = Intelligence & recommendations (FastAPI)
4. **Databases** = Persistent data storage (Firestore, Neo4j, MongoDB)
5. **Communication** = HTTP for requests, WebSocket for real-time

---

Happy Learning! 🎓

If you have questions, ask in the code comments!

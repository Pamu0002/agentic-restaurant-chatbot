"""
ENTRY POINT FOR PYTHON FASTAPI AI SERVICE

This file initializes the FastAPI server and sets up:
- API routes (endpoints)
- Data validation with Pydantic
- AI agent orchestration
- Database connections
- Automatic API documentation
"""

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import logging
import os

# ============================================
# 1. CONFIGURE LOGGING
# ============================================

# Set up logging to track what happens in the app
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# 2. INITIALIZE FASTAPI APP
# ============================================

# Create the FastAPI application
# title, description, version show up in API documentation
app = FastAPI(
    title="Agentic Restaurant Chatbot - AI Service",
    description="AI-powered service for restaurant discovery, recommendations, and agent orchestration",
    version="1.0.0"
)

# ============================================
# 3. DEFINE DATA MODELS (PYDANTIC)
# ============================================

"""
Pydantic models define the structure of data:
- What fields are required/optional
- What data types they should be
- Validation rules

FastAPI automatically validates incoming requests against these models!
"""

class RestaurantQuery(BaseModel):
    """User's restaurant search query"""
    location: str = Field(..., min_length=2, description="City or location name")
    cuisine: Optional[str] = Field(None, description="Cuisine type (Italian, French, etc)")
    party_size: int = Field(default=2, ge=1, le=20, description="Number of people")
    budget: Optional[str] = Field(None, description="Budget level: cheap, moderate, expensive")
    
    # This part is optional but shows up in API docs
    class Config:
        json_schema_extra = {
            "example": {
                "location": "Paris",
                "cuisine": "Italian",
                "party_size": 4,
                "budget": "moderate"
            }
        }

class Restaurant(BaseModel):
    """A restaurant object"""
    id: str
    name: str
    location: str
    cuisine: str
    rating: float = Field(ge=0, le=5)
    available_tables: int
    price_level: str  # cheap, moderate, expensive

class AgentResponse(BaseModel):
    """Response from an AI agent"""
    agent_name: str
    action: str
    result: dict
    reasoning: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ReservationRequest(BaseModel):
    """Request to create a reservation"""
    user_id: str
    restaurant_id: str
    date: str  # Format: "2024-03-10"
    time: str  # Format: "19:30"
    party_size: int = Field(ge=1, le=20)
    special_requests: Optional[str] = None

# ============================================
# 4. API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """
    Welcome endpoint
    
    Try visiting: http://localhost:8000
    """
    return {
        "message": "🍽️ Welcome to Agentic Restaurant Chatbot AI Service",
        "version": "1.0.0",
        "docs": "http://localhost:8000/docs",
        "endpoints": {
            "health": "/health",
            "discover": "/api/v1/agents/discover",
            "recommend": "/api/v1/agents/recommend",
            "reserve": "/api/v1/agents/reserve"
        }
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns the status of the service
    Try: http://localhost:8000/health
    """
    return {
        "status": "healthy",
        "service": "Restaurant AI Service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/agents/discover", response_model=AgentResponse)
async def discover_restaurants(query: RestaurantQuery):
    """
    DISCOVERY AGENT
    
    Finds restaurants matching user criteria
    
    Purpose:
    - Search for restaurants by location, cuisine, budget
    - Return relevant results
    - Filter by availability
    
    Example request:
    POST /api/v1/agents/discover
    {
        "location": "Paris",
        "cuisine": "Italian",
        "party_size": 4,
        "budget": "moderate"
    }
    """
    try:
        logger.info(f"Discovery Agent: Searching for {query.cuisine} in {query.location}")
        
        # TODO: Query Neo4j or Firestore for restaurants
        # restaurants = await get_restaurants_from_db(query)
        
        # For now, return mock data
        mock_restaurants = [
            {
                "id": "rest_1",
                "name": "Pizza Palace",
                "location": query.location,
                "cuisine": query.cuisine or "Italian",
                "rating": 4.5,
                "available_tables": 5
            },
            {
                "id": "rest_2",
                "name": "Le Petit Bistro",
                "location": query.location,
                "cuisine": "French",
                "rating": 4.8,
                "available_tables": 3
            }
        ]
        
        return {
            "agent_name": "DiscoveryAgent",
            "action": "searched_restaurants",
            "result": {
                "query": query.dict(),
                "restaurants": mock_restaurants,
                "count": len(mock_restaurants)
            },
            "reasoning": f"Found {len(mock_restaurants)} restaurants matching your criteria"
        }
        
    except Exception as e:
        logger.error(f"Error in discovery agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Discovery failed: {str(e)}")

@app.post("/api/v1/agents/recommend", response_model=AgentResponse)
async def get_recommendations(user_id: str = Query(..., description="User ID")):
    """
    RECOMMENDATION AGENT
    
    Provides personalized restaurant recommendations
    
    Purpose:
    - Analyze user's past visits
    - Consider user preferences
    - Use collaborative filtering
    - Return top recommendations
    
    Example request:
    POST /api/v1/agents/recommend?user_id=user_123
    """
    try:
        logger.info(f"Recommendation Agent: Getting recommendations for user {user_id}")
        
        # TODO: Connect to Neo4j graph database
        # user_graph = await get_user_graph(user_id)
        # recommendations = await generate_recommendations(user_graph)
        
        # Mock recommendations
        mock_recommendations = [
            {
                "restaurant_id": "rest_1",
                "name": "Pizza Palace",
                "score": 0.95,
                "reason": "You loved Italian cuisine last time"
            },
            {
                "restaurant_id": "rest_3",
                "name": "Tokyo Express",
                "score": 0.87,
                "reason": "Similar to restaurants you've rated highly"
            }
        ]
        
        return {
            "agent_name": "RecommendationAgent",
            "action": "generated_recommendations",
            "result": {
                "user_id": user_id,
                "recommendations": mock_recommendations,
                "count": len(mock_recommendations)
            },
            "reasoning": "Analyzed your preferences and booking history"
        }
        
    except Exception as e:
        logger.error(f"Error in recommendation agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.post("/api/v1/agents/reserve", response_model=AgentResponse)
async def make_reservation(request: ReservationRequest):
    """
    RESERVATION AGENT
    
    Creates a restaurant reservation
    
    Purpose:
    - Check table availability
    - Create booking
    - Send confirmation
    
    Example request:
    POST /api/v1/agents/reserve
    {
        "user_id": "user_123",
        "restaurant_id": "rest_1",
        "date": "2024-03-10",
        "time": "19:30",
        "party_size": 4
    }
    """
    try:
        logger.info(f"Reservation Agent: Making reservation for user {request.user_id}")
        
        # TODO: Check availability in Firestore
        # availability = await check_table_availability(
        #     request.restaurant_id,
        #     request.date,
        #     request.time,
        #     request.party_size
        # )
        
        # TODO: Create reservation in database
        # reservation = await create_reservation_db(request)
        
        # Mock response
        mock_reservation = {
            "id": f"res_{int(datetime.now().timestamp())}",
            "user_id": request.user_id,
            "restaurant_id": request.restaurant_id,
            "date": request.date,
            "time": request.time,
            "party_size": request.party_size,
            "status": "confirmed",
            "confirmation_code": "REST-2024-0001"
        }
        
        return {
            "agent_name": "ReservationAgent",
            "action": "created_reservation",
            "result": mock_reservation,
            "reasoning": "Successfully reserved table for your party"
        }
        
    except Exception as e:
        logger.error(f"Error in reservation agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Reservation failed: {str(e)}")

@app.post("/api/v1/agents/chat")
async def chat_with_agent(message: str = Query(..., description="User message")):
    """
    MAIN CHAT ENDPOINT
    
    This is where the magic happens!
    
    Purpose:
    - Accept natural language input from user
    - Route to appropriate agent based on intent
    - Return AI-generated response
    
    Example:
    POST /api/v1/agents/chat?message=Find+me+Italian+restaurants+in+Paris
    
    The system should:
    1. Understand user intent (discovery, recommendation, reservation)
    2. Extract relevant information
    3. Call appropriate agent
    4. Generate natural language response
    """
    try:
        logger.info(f"Chat Agent: Processing message: {message}")
        
        # TODO: Use Vertex AI to understand user intent
        # intent = await analyze_intent(message)
        #
        # if intent == "discovery":
        #     return await discover_restaurants(...)
        # elif intent == "recommendation":
        #     return await get_recommendations(...)
        # elif intent == "reservation":
        #     return await make_reservation(...)
        
        return {
            "agent_name": "ChatAgent",
            "response": "I understood your request! How can I help you?",
            "intent": "unknown",
            "confidence": 0.5
        }
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# ============================================
# 5. STARTUP/SHUTDOWN EVENTS
# ============================================

@app.on_event("startup")
async def startup_event():
    """
    Called when the server starts
    Good place to initialize databases, load models, etc.
    """
    logger.info("🚀 Starting up AI Service...")
    
    # TODO: Initialize database connections
    # TODO: Load pre-trained models
    # TODO: Initialize Vertex AI client
    
    logger.info("✅ AI Service ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """
    Called when the server shuts down
    Good place for cleanup
    """
    logger.info("🛑 Shutting down AI Service...")
    
    # TODO: Close database connections
    # TODO: Clean up resources
    
    logger.info("✅ AI Service stopped!")

# ============================================
# 6. CUSTOM EXCEPTION HANDLING
# ============================================

from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Catch all exceptions and return proper error response
    """
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# ============================================
# 7. MAIN ENTRY POINT
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    print("\n")
    print("═══════════════════════════════════════════════════════")
    print("🚀 FastAPI AI Service Starting")
    print("📡 Listening on http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("═══════════════════════════════════════════════════════\n")
    
    # Start the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


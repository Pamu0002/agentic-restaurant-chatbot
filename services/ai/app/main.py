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
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import orchestrator and agents
from app.api.orchestrator import AgentOrchestrator
from app.llm.gemini_service import GeminiService

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
# 2.5. ADD CORS MIDDLEWARE
# ============================================

# Allow frontend to call this service from different ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# 2.6. INITIALIZE ORCHESTRATOR AND AGENTS
# ============================================

# Initialize the main orchestrator (this will init all agents)
orchestrator = AgentOrchestrator()
gemini_service = GeminiService()
logger.info("✅ Agent Orchestrator initialized with all agents!")

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

class ChatMessage(BaseModel):
    """Chat message from user"""
    message: str = Field(..., min_length=1, description="User's message")
    user_id: Optional[str] = Field(None, description="Optional user ID for personalization")

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
    - Use AI to understand search intent
    - Return relevant results filtered by availability
    
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
        logger.info(f"Discovery Agent: Searching for restaurants")
        
        # Use orchestrator to handle discovery
        intent_data = {
            "intent": "discover",
            "location": query.location,
            "cuisine": query.cuisine,
            "party_size": query.party_size,
            "budget": query.budget,
        }
        
        result = await orchestrator._handle_discovery(intent_data, f"Find {query.cuisine} {query.location}")
        
        return result
        
    except Exception as e:
        logger.error(f"Error in discovery agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Discovery failed: {str(e)}")

@app.post("/api/v1/agents/recommend", response_model=AgentResponse)
async def get_recommendations(user_id: str = Query(..., description="User ID")):
    """
    RECOMMENDATION AGENT
    
    Provides personalized restaurant recommendations
    
    Purpose:
    - Analyze user's past visits and preferences
    - Use collaborative filtering
    - Use content-based recommendations
    - Return personalized suggestions with explanations
    
    Example request:
    POST /api/v1/agents/recommend?user_id=user_123
    """
    try:
        logger.info(f"Recommendation Agent: Getting recommendations for user {user_id}")
        
        # Use orchestrator to handle recommendations
        intent_data = {
            "intent": "recommend",
        }
        
        result = await orchestrator._handle_recommendation(intent_data, user_id, "Give me recommendations")
        
        return result
        
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

@app.post("/api/v1/chat", response_model=AgentResponse)
async def chat_with_restaurant_bot(message_data: ChatMessage):
    """
    MAIN CHAT ENDPOINT - Natural Language Processing
    
    This is the main entry point for all user interactions.
    
    Process:
    1. Accept natural language message from user
    2. Detect intent (discover, recommend, reserve, pay, or general)
    3. Extract relevant entities (location, cuisine, date, time, etc)
    4. Route to appropriate agent
    5. Generate and return response
    
    Example request:
    POST /api/v1/chat
    {
        "message": "Find me Italian restaurants in Paris for 4 people next Friday at 8pm",
        "user_id": "user_123"  # optional
    }
    
    Response will automatically:
    - Understand it's a discovery request
    - Extract: cuisine=Italian, location=Paris, party_size=4, date=2024-03-15, time=20:00
    - Call Discovery Agent
    - Return matching restaurants
    """
    try:
        logger.info(f"Chat: Processing message from user {message_data.user_id or 'anonymous'}")
        
        # Use orchestrator to process user message
        response = await orchestrator.process_user_message(
            message_data.message, 
            user_id=message_data.user_id
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")
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


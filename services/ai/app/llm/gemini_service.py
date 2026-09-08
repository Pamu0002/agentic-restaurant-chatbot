"""
GOOGLE VERTEX AI GEMINI SERVICE

Handles:
- LLM interaction with Gemini Pro
- Intent detection from user messages
- Entity extraction
- Conversation management
"""

import vertexai
from vertexai.generative_models import GenerativeModel
import os
import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)


class GeminiService:
    """Service to handle all Gemini LLM operations"""

    def __init__(self):
        """Initialize Vertex AI and Gemini model"""
        try:
            # Get configuration
            self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
            self.region = os.getenv("VERTEX_AI_REGION", "us-central1")
            self.model_name = os.getenv("VERTEX_AI_MODEL", "gemini-1.5-pro")

            # Initialize Vertex AI
            vertexai.init(project=self.project_id, location=self.region)

            # Load model
            self.model = GenerativeModel(self.model_name)
            self.chat = self.model.start_chat()

            logger.info(
                f"Gemini Service initialized - Model: {self.model_name}, Region: {self.region}"
            )
        except Exception as e:
            logger.error(f"Error initializing Gemini: {e}")
            raise

        self.conversation_history: List[Dict[str, str]] = []

    async def get_response(self, user_message: str) -> str:
        """Get response from Gemini for user message"""
        try:
            logger.info(f"Getting Gemini response for: {user_message}")

            # Add context for restaurant chatbot
            system_prompt = """You are a helpful restaurant chatbot assistant. 
            You help users find restaurants, make reservations, get recommendations, 
            and process orders. Be friendly, concise, and helpful.
            
            When a user asks about restaurants, provide relevant information about 
            cuisine type, location, availability, and help them make decisions.
            """

            # Send message to Gemini
            response = self.chat.send_message(f"{system_prompt}\n\nUser: {user_message}")

            # Extract response text
            response_text = response.text

            # Store in conversation history
            self.conversation_history.append(
                {"role": "user", "content": user_message, "timestamp": datetime.now()}
            )
            self.conversation_history.append(
                {"role": "assistant", "content": response_text, "timestamp": datetime.now()}
            )

            logger.info(f"Gemini response: {response_text[:100]}...")
            return response_text

        except Exception as e:
            logger.error(f"Error getting Gemini response: {e}")
            return "Sorry, I couldn't process that. Please try again."

    async def detect_intent(self, user_message: str) -> Dict[str, Any]:
        """
        Detect user intent and extract entities from message.
        
        Intent types: 'discover', 'reserve', 'recommend', 'pay', 'other'
        Entities: location, cuisine, date, time, party_size
        """
        try:
            logger.info(f"Detecting intent for: {user_message}")

            # Prompt to extract intent and entities
            intent_prompt = f"""Analyze this restaurant chatbot message and extract:

1. **Intent**: Classify as ONE of:
   - "discover" (user wants to find/search restaurants)
   - "reserve" (user wants to make a reservation)
   - "recommend" (user wants recommendations)
   - "pay" (user wants to pay/process payment)
   - "other" (doesn't fit above categories)

2. **Entities**: Extract these if present:
   - location: city/area (e.g., "Colombo 7", "Kandy")
   - cuisine: food type (e.g., "Italian", "Asian")
   - date: in format YYYY-MM-DD
   - time: in format HH:MM (24-hour)
   - party_size: number of people

3. **Confidence**: 0.0 to 1.0 confidence in your classification

Return ONLY valid JSON, no extra text:
{{
  "intent": "discover|reserve|recommend|pay|other",
  "location": "...",
  "cuisine": "...",
  "date": "...",
  "time": "...",
  "party_size": null,
  "confidence": 0.95
}}

Message: "{user_message}"
"""

            # Get intent detection response
            response = await self.get_response(intent_prompt)

            # Try to parse JSON from response
            try:
                # Find JSON in response
                start_idx = response.find("{")
                end_idx = response.rfind("}") + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = response[start_idx:end_idx]
                    result = json.loads(json_str)
                    logger.info(f"Intent detected: {result}")
                    return result
            except json.JSONDecodeError:
                logger.warning(f"Could not parse JSON from intent response: {response}")

            # Fallback if JSON parsing fails
            return {
                "intent": "other",
                "location": None,
                "cuisine": None,
                "date": None,
                "time": None,
                "party_size": None,
                "confidence": 0.5,
            }

        except Exception as e:
            logger.error(f"Error detecting intent: {e}")
            return {
                "intent": "other",
                "location": None,
                "cuisine": None,
                "date": None,
                "time": None,
                "party_size": None,
                "confidence": 0.0,
            }

    async def extract_entities(self, user_message: str) -> Dict[str, Any]:
        """Extract structured entities from user message"""
        intent_data = await self.detect_intent(user_message)
        return {
            "location": intent_data.get("location"),
            "cuisine": intent_data.get("cuisine"),
            "date": intent_data.get("date"),
            "time": intent_data.get("time"),
            "party_size": intent_data.get("party_size"),
        }

    async def generate_recommendation(
        self,
        user_preferences: Optional[Dict[str, Any]] = None,
        available_restaurants: Optional[List[Dict[str, Any]]] = None,
    ) -> str:
        """Generate personalized restaurant recommendation"""
        try:
            restaurants_text = (
                json.dumps(available_restaurants[:5], indent=2)
                if available_restaurants
                else "No restaurants available"
            )
            preferences_text = json.dumps(user_preferences) if user_preferences else "No preferences"

            prompt = f"""Based on the user's preferences and available restaurants, 
            provide a personalized recommendation.
            
            User Preferences: {preferences_text}
            
            Available Restaurants: {restaurants_text}
            
            Provide a friendly recommendation with explanation."""

            recommendation = await self.get_response(prompt)
            return recommendation

        except Exception as e:
            logger.error(f"Error generating recommendation: {e}")
            return "I couldn't generate a recommendation at this time."

    def clear_conversation_history(self):
        """Clear conversation history (start fresh chat)"""
        self.conversation_history = []
        self.chat = self.model.start_chat()
        logger.info("Conversation history cleared")

    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Get conversation history"""
        return self.conversation_history


# Create singleton instance
gemini_service = GeminiService()

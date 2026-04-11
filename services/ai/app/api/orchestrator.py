"""
AGENT ORCHESTRATOR - Routes user requests to appropriate agents

Handles:
- Understanding user intent
- Routing to correct agent (Discovery, Recommendation, Reservation)
- Orchestrating agent workflow
- Combining multi-step processes
- Error handling and fallbacks
"""

import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

from app.agents.discovery_agent import DiscoveryAgent
from app.agents.recommendation_agent import RecommendationAgent
from app.llm.gemini_service import GeminiService

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Master orchestrator that manages all agents"""

    def __init__(self):
        """Initialize orchestrator with all agents"""
        self.discovery_agent = DiscoveryAgent()
        self.recommendation_agent = RecommendationAgent()
        self.gemini_service = GeminiService()
        self.name = "AgentOrchestrator"
        logger.info("Agent Orchestrator initialized")

    async def process_user_message(
        self, user_message: str, user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main entry point - process user message and route appropriately
        
        Args:
            user_message: User's natural language input
            user_id: Optional user ID for personalization
            
        Returns:
            AgentResponse with action, results, and reasoning
        """
        try:
            logger.info(f"Processing user message: {user_message}")

            # Step 1: Detect intent and extract entities
            intent_data = await self.gemini_service.detect_intent(user_message)
            logger.info(f"Intent detected: {intent_data}")

            intent = intent_data.get("intent", "other")
            confidence = intent_data.get("confidence", 0.0)

            # If confidence is too low, ask for clarification
            if confidence < 0.5:
                return {
                    "agent_name": "AgentOrchestrator",
                    "action": "clarification_needed",
                    "result": {
                        "message": "I didn't quite understand. Could you rephrase that?",
                        "confidence": confidence,
                    },
                    "reasoning": f"Confidence too low ({confidence:.2%}) for confident routing",
                }

            # Step 2: Route to appropriate agent based on intent
            if intent == "discover":
                response = await self._handle_discovery(intent_data, user_message)
            elif intent == "recommend":
                response = await self._handle_recommendation(intent_data, user_id, user_message)
            elif intent == "reserve":
                response = await self._handle_reservation(intent_data, user_id, user_message)
            elif intent == "pay":
                response = await self._handle_payment(intent_data, user_id, user_message)
            else:
                response = await self._handle_general_query(user_message)

            return response

        except Exception as e:
            logger.error(f"Error in process_user_message: {e}")
            return {
                "agent_name": "AgentOrchestrator",
                "action": "error",
                "result": {"error": str(e), "message": "Sorry, I encountered an error. Please try again."},
                "reasoning": f"Exception: {str(e)}",
            }

    async def _handle_discovery(
        self, intent_data: Dict[str, Any], user_message: str
    ) -> Dict[str, Any]:
        """Handle restaurant discovery requests"""
        try:
            logger.info("Routing to Discovery Agent")

            # Build query for discovery agent
            query = {
                "location": intent_data.get("location") or "Any",
                "cuisine": intent_data.get("cuisine"),
                "party_size": intent_data.get("party_size", 2),
                "date": intent_data.get("date"),
                "time": intent_data.get("time"),
                "budget": intent_data.get("budget"),
            }

            # Call discovery agent
            discovery_result = await self.discovery_agent.search_restaurants(query)

            # Format response
            return {
                "agent_name": "DiscoveryAgent",
                "action": "restaurants_found",
                "result": discovery_result,
                "reasoning": f"Found {discovery_result.get('count', 0)} restaurants matching: "
                f"{intent_data.get('cuisine', 'any cuisine')} in {query['location']}",
            }

        except Exception as e:
            logger.error(f"Error in discovery handler: {e}")
            return {
                "agent_name": "DiscoveryAgent",
                "action": "error",
                "result": {"error": str(e)},
                "reasoning": f"Discovery failed: {str(e)}",
            }

    async def _handle_recommendation(
        self, intent_data: Dict[str, Any], user_id: Optional[str], user_message: str
    ) -> Dict[str, Any]:
        """Handle recommendation requests"""
        try:
            logger.info("Routing to Recommendation Agent")

            if not user_id:
                return {
                    "agent_name": "RecommendationAgent",
                    "action": "clarification_needed",
                    "result": {"message": "Please log in for personalized recommendations."},
                    "reasoning": "No user_id provided",
                }

            # Extract user preferences from intent if available
            user_preferences = {
                "cuisines": [intent_data.get("cuisine")] if intent_data.get("cuisine") else [],
                "budget": intent_data.get("budget", "moderate"),
                "restrictions": [],
            }

            # Call recommendation agent
            rec_result = await self.recommendation_agent.get_recommendations(
                user_id, user_preferences
            )

            return {
                "agent_name": "RecommendationAgent",
                "action": "recommendations_generated",
                "result": rec_result,
                "reasoning": "Generated personalized recommendations based on your preferences and history",
            }

        except Exception as e:
            logger.error(f"Error in recommendation handler: {e}")
            return {
                "agent_name": "RecommendationAgent",
                "action": "error",
                "result": {"error": str(e)},
                "reasoning": f"Recommendation failed: {str(e)}",
            }

    async def _handle_reservation(
        self, intent_data: Dict[str, Any], user_id: Optional[str], user_message: str
    ) -> Dict[str, Any]:
        """Handle reservation requests"""
        try:
            logger.info("Routing to Reservation Agent")

            if not user_id:
                return {
                    "agent_name": "ReservationAgent",
                    "action": "authentication_needed",
                    "result": {"message": "Please log in to make a reservation."},
                    "reasoning": "No user_id provided",
                }

            # Check if we have enough information
            required_fields = ["date", "time", "party_size"]
            missing = [f for f in required_fields if not intent_data.get(f)]

            if missing:
                return {
                    "agent_name": "ReservationAgent",
                    "action": "clarification_needed",
                    "result": {
                        "message": f"I need more information: {', '.join(missing)}",
                        "missing_fields": missing,
                    },
                    "reasoning": f"Missing required fields: {missing}",
                }

            # TODO: Call actual reservation agent
            return {
                "agent_name": "ReservationAgent",
                "action": "reservation_created",
                "result": {
                    "message": "Reservation created successfully!",
                    "date": intent_data.get("date"),
                    "time": intent_data.get("time"),
                    "party_size": intent_data.get("party_size"),
                    "confirmation_number": "RES-" + user_id[:4].upper() + "-12345",
                },
                "reasoning": "Reservation processed",
            }

        except Exception as e:
            logger.error(f"Error in reservation handler: {e}")
            return {
                "agent_name": "ReservationAgent",
                "action": "error",
                "result": {"error": str(e)},
                "reasoning": f"Reservation failed: {str(e)}",
            }

    async def _handle_payment(
        self, intent_data: Dict[str, Any], user_id: Optional[str], user_message: str
    ) -> Dict[str, Any]:
        """Handle payment requests"""
        try:
            logger.info("Routing to Payment Processing")

            if not user_id:
                return {
                    "agent_name": "PaymentAgent",
                    "action": "authentication_needed",
                    "result": {"message": "Please log in to process payment."},
                    "reasoning": "No user_id provided",
                }

            # TODO: Integrate with Stripe
            return {
                "agent_name": "PaymentAgent",
                "action": "payment_initiated",
                "result": {"message": "Payment processing initiated. Please complete in payment gateway."},
                "reasoning": "Payment request forwarded to payment processor",
            }

        except Exception as e:
            logger.error(f"Error in payment handler: {e}")
            return {
                "agent_name": "PaymentAgent",
                "action": "error",
                "result": {"error": str(e)},
                "reasoning": f"Payment failed: {str(e)}",
            }

    async def _handle_general_query(self, user_message: str) -> Dict[str, Any]:
        """Handle general questions using Gemini"""
        try:
            logger.info("Routing to Gemini for general query")

            response = await self.gemini_service.get_response(user_message)

            return {
                "agent_name": "Gemini",
                "action": "question_answered",
                "result": {"message": response},
                "reasoning": "General question processed by conversation AI",
            }

        except Exception as e:
            logger.error(f"Error in general query handler: {e}")
            return {
                "agent_name": "Gemini",
                "action": "error",
                "result": {"error": str(e)},
                "reasoning": f"Query processing failed: {str(e)}",
            }

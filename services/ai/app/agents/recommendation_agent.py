"""
RECOMMENDATION AGENT - Generates personalized restaurant recommendations

Handles:
- User preference analysis
- Collaborative filtering
- Content-based recommendations
- Rating predictions
- Explanation generation
"""

import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class RecommendationAgent:
    """Agent responsible for generating personalized recommendations"""

    def __init__(self):
        """Initialize recommendation agent"""
        self.name = "RecommendationAgent"
        logger.info("Recommendation Agent initialized")

    async def get_recommendations(
        self, user_id: str, user_preferences: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate personalized recommendations for user
        
        Args:
            user_id: User identifier
            user_preferences: User's stored preferences (cuisines, budget, etc)
            
        Returns:
            Dictionary with recommended restaurants and reasoning
        """
        try:
            logger.info(f"Generating recommendations for user {user_id}")

            # Get user's history and preferences
            user_data = await self._get_user_profile(user_id, user_preferences)

            # Get candidate restaurants
            candidates = await self._get_candidate_restaurants()

            # Score restaurants using multiple methods
            collaborative_scores = self._collaborative_filtering(user_data, candidates)
            content_scores = self._content_based_filtering(user_data, candidates)

            # Combine scores
            combined_scores = self._combine_scores(
                collaborative_scores, content_scores, weight_collaborative=0.4
            )

            # Get top recommendations
            top_recommendations = sorted(
                combined_scores, key=lambda x: x["score"], reverse=True
            )[:5]

            return {
                "success": True,
                "user_id": user_id,
                "recommendations": top_recommendations,
                "count": len(top_recommendations),
                "reasoning": self._generate_reasoning(user_data, top_recommendations),
                "timestamp": datetime.utcnow().isoformat(),
            }

        except Exception as e:
            logger.error(f"Error in get_recommendations: {e}")
            return {
                "success": False,
                "error": str(e),
                "recommendations": [],
                "count": 0,
            }

    async def _get_user_profile(
        self, user_id: str, preferences: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Get user's complete profile including:
        - Past visits
        - Ratings history
        - Preferences
        - Spending habits
        
        TODO: Query from Firestore/Neo4j
        """
        # Mock user profile
        return {
            "user_id": user_id,
            "favorite_cuisines": preferences.get("cuisines", [])
            if preferences
            else ["Italian", "Japanese"],
            "budget_level": preferences.get("budget", "moderate") if preferences else "moderate",
            "diet_restrictions": preferences.get("restrictions", [])
            if preferences
            else [],
            "past_visits": [
                {
                    "restaurant_id": "rest_001",
                    "rating": 4.5,
                    "review": "Great pasta!",
                    "date": "2024-03-01",
                },
                {
                    "restaurant_id": "rest_002",
                    "rating": 4.8,
                    "review": "Amazing sushi",
                    "date": "2024-03-10",
                },
                {
                    "restaurant_id": "rest_003",
                    "rating": 3.5,
                    "review": "Good burgers, crowded",
                    "date": "2024-02-15",
                },
            ],
            "average_rating_given": 4.3,
            "total_visits": 15,
        }

    async def _get_candidate_restaurants(self) -> List[Dict[str, Any]]:
        """
        Get list of candidate restaurants for recommendation
        TODO: Query from database
        """
        return [
            {
                "id": "rest_001",
                "name": "La Bella Italia",
                "cuisine": "Italian",
                "rating": 4.7,
                "price_level": "moderate",
                "reviews": 342,
                "rating_distribution": {
                    "5": 150,
                    "4": 120,
                    "3": 50,
                    "2": 15,
                    "1": 7,
                },
            },
            {
                "id": "rest_002",
                "name": "Tokyo Express",
                "cuisine": "Japanese",
                "rating": 4.5,
                "price_level": "moderate",
                "reviews": 287,
                "rating_distribution": {"5": 120, "4": 110, "3": 40, "2": 12, "1": 5},
            },
            {
                "id": "rest_003",
                "name": "Burger Palace",
                "cuisine": "American",
                "rating": 4.2,
                "price_level": "cheap",
                "reviews": 512,
                "rating_distribution": {"5": 180, "4": 180, "3": 100, "2": 40, "1": 12},
            },
            {
                "id": "rest_004",
                "name": "Le Petit Bistro",
                "cuisine": "French",
                "rating": 4.8,
                "price_level": "expensive",
                "reviews": 198,
                "rating_distribution": {"5": 140, "4": 45, "3": 10, "2": 2, "1": 1},
            },
            {
                "id": "rest_005",
                "name": "Spice Route",
                "cuisine": "Indian",
                "rating": 4.4,
                "price_level": "moderate",
                "reviews": 276,
                "rating_distribution": {"5": 110, "4": 105, "3": 40, "2": 15, "1": 6},
            },
            {
                "id": "rest_006",
                "name": "Taco Fiesta",
                "cuisine": "Mexican",
                "rating": 4.3,
                "price_level": "cheap",
                "reviews": 401,
                "rating_distribution": {"5": 130, "4": 140, "3": 90, "2": 30, "1": 11},
            },
        ]

    def _collaborative_filtering(
        self, user_data: Dict[str, Any], candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Score restaurants using collaborative filtering
        
        Logic: Users who rated similar restaurants similarly will like same restaurants
        """
        scored = []

        for restaurant in candidates:
            # Base score from restaurant rating
            score = restaurant["rating"] / 5.0 * 100

            # Boost if cuisine matches user's favorites
            if restaurant["cuisine"] in user_data.get("favorite_cuisines", []):
                score += 30

            # Boost if price matches user's budget
            if restaurant["price_level"] == user_data.get("budget_level"):
                score += 20

            scored.append({**restaurant, "score": score})

        return scored

    def _content_based_filtering(
        self, user_data: Dict[str, Any], candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Score restaurants using content-based filtering
        
        Logic: Recommend restaurants similar to ones user rated highly
        """
        scored = []

        for restaurant in candidates:
            score = 0

            # Check against user's past visits
            for past_visit in user_data.get("past_visits", []):
                if (
                    past_visit["rating"] >= 4
                ):  # User liked this restaurant
                    # Find similarity with candidate
                    similarity = self._calculate_similarity(
                        candidates, restaurant, past_visit
                    )
                    score += similarity * past_visit["rating"]

            # Average with restaurant's own rating
            score = (score + restaurant["rating"] * 10) / 2

            scored.append({**restaurant, "score": score})

        return scored

    def _calculate_similarity(
        self, all_restaurants, candidate, past_visit
    ) -> float:
        """Calculate similarity between candidate and restaurant user liked"""
        # Find the restaurant user visited
        visited = None
        for r in all_restaurants:
            if r["id"] == past_visit["restaurant_id"]:
                visited = r
                break

        if not visited:
            return 0.5  # Default similarity

        # Similarity factors
        similarity = 0

        # Cuisine match (0-50)
        if candidate["cuisine"] == visited["cuisine"]:
            similarity += 50

        # Price level match (0-30)
        if candidate["price_level"] == visited["price_level"]:
            similarity += 30
        elif abs(
            ["cheap", "moderate", "expensive"].index(candidate["price_level"])
            - ["cheap", "moderate", "expensive"].index(visited["price_level"])
        ) == 1:
            similarity += 15

        # Rating match (0-20)
        if abs(candidate["rating"] - visited["rating"]) < 0.5:
            similarity += 20

        return min(similarity / 100.0, 1.0)  # Normalize to 0-1

    def _combine_scores(
        self,
        collaborative: List[Dict[str, Any]],
        content_based: List[Dict[str, Any]],
        weight_collaborative: float = 0.4,
    ) -> List[Dict[str, Any]]:
        """Combine collaborative and content-based scores"""
        # Create lookup by ID
        collab_map = {r["id"]: r["score"] for r in collaborative}
        content_map = {r["id"]: r["score"] for r in content_based}

        combined = []
        for restaurant in collaborative:
            collab_score = collab_map.get(restaurant["id"], 0)
            content_score = content_map.get(restaurant["id"], 0)

            combined_score = (
                collab_score * weight_collaborative
                + content_score * (1 - weight_collaborative)
            )

            combined.append({**restaurant, "score": combined_score})

        return combined

    def _generate_reasoning(
        self, user_data: Dict[str, Any], recommendations: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate human-readable reasons for recommendations"""
        reasons = []

        for i, rec in enumerate(recommendations[:3]):
            reason = f"✨ {rec['name']}: "

            # Add reasoning based on matching
            if rec["cuisine"] in user_data.get("favorite_cuisines", []):
                reason += f"You love {rec['cuisine']} cuisine. "

            if rec["price_level"] == user_data.get("budget_level"):
                reason += f"Matches your {rec['price_level']} budget. "

            reason += f"Highly rated (⭐ {rec['rating']}/5 from {rec['reviews']} reviews)"

            reasons.append(reason)

        return reasons

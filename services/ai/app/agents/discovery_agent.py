"""
DISCOVERY AGENT - Finds restaurants matching user criteria

Handles:
- Restaurant search by location, cuisine, budget
- Database queries to Neo4j and Firestore
- Filtering and ranking results
- Availability checking
"""

import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class DiscoveryAgent:
    """Agent responsible for discovering restaurants"""

    def __init__(self):
        """Initialize discovery agent"""
        self.name = "DiscoveryAgent"
        logger.info("Discovery Agent initialized")

    async def search_restaurants(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """
        Search for restaurants matching user criteria
        
        Args:
            query: Contains location, cuisine, party_size, budget, date, time
            
        Returns:
            Dictionary with results and metadata
        """
        try:
            location = query.get("location", "")
            cuisine = query.get("cuisine", "")
            party_size = query.get("party_size", 2)
            budget = query.get("budget", "")
            date = query.get("date", "")
            time = query.get("time", "")

            logger.info(
                f"Searching: location={location}, cuisine={cuisine}, "
                f"party_size={party_size}, budget={budget}"
            )

            # TODO: Replace with real Firestore queries
            # For now, return mock results
            restaurants = await self._get_mock_restaurants(
                location, cuisine, party_size, budget
            )

            # Filter by availability if date/time provided
            if date and time:
                restaurants = await self._filter_by_availability(
                    restaurants, date, time, party_size
                )

            # Rank by relevance
            restaurants = self._rank_restaurants(restaurants, query)

            return {
                "success": True,
                "restaurants": restaurants,
                "count": len(restaurants),
                "query": query,
                "timestamp": datetime.utcnow().isoformat(),
            }

        except Exception as e:
            logger.error(f"Error in search_restaurants: {e}")
            return {
                "success": False,
                "error": str(e),
                "restaurants": [],
                "count": 0,
            }

    async def _get_mock_restaurants(
        self, location: str, cuisine: str, party_size: int, budget: str
    ) -> List[Dict[str, Any]]:
        """Return mock restaurant data - TODO: Replace with DB queries"""
        mock_data = [
            {
                "id": "rest_001",
                "name": "La Bella Italia",
                "cuisine": "Italian",
                "location": location,
                "rating": 4.7,
                "reviews": 342,
                "price_level": "moderate",
                "available_tables": {"breakfast": 5, "lunch": 2, "dinner": 0},
                "hours": {"open": "11:00", "close": "23:00"},
                "address": f"123 Main St, {location}",
                "phone": "+1-555-0101",
                "image_url": "https://via.placeholder.com/300x200?text=Italian",
            },
            {
                "id": "rest_002",
                "name": "Tokyo Express",
                "cuisine": "Japanese",
                "location": location,
                "rating": 4.5,
                "reviews": 287,
                "price_level": "moderate",
                "available_tables": {"breakfast": 3, "lunch": 4, "dinner": 2},
                "hours": {"open": "12:00", "close": "22:00"},
                "address": f"456 Oak Ave, {location}",
                "phone": "+1-555-0102",
                "image_url": "https://via.placeholder.com/300x200?text=Japanese",
            },
            {
                "id": "rest_003",
                "name": "Burger Palace",
                "cuisine": "American",
                "location": location,
                "rating": 4.2,
                "reviews": 512,
                "price_level": "cheap",
                "available_tables": {"breakfast": 8, "lunch": 6, "dinner": 4},
                "hours": {"open": "09:00", "close": "23:30"},
                "address": f"789 Pine Rd, {location}",
                "phone": "+1-555-0103",
                "image_url": "https://via.placeholder.com/300x200?text=Burgers",
            },
            {
                "id": "rest_004",
                "name": "Le Petit Bistro",
                "cuisine": "French",
                "location": location,
                "rating": 4.8,
                "reviews": 198,
                "price_level": "expensive",
                "available_tables": {"breakfast": 0, "lunch": 1, "dinner": 0},
                "hours": {"open": "12:00", "close": "23:00"},
                "address": f"321 Elm St, {location}",
                "phone": "+1-555-0104",
                "image_url": "https://via.placeholder.com/300x200?text=French",
            },
            {
                "id": "rest_005",
                "name": "Spice Route",
                "cuisine": "Indian",
                "location": location,
                "rating": 4.4,
                "reviews": 276,
                "price_level": "moderate",
                "available_tables": {"breakfast": 0, "lunch": 3, "dinner": 5},
                "hours": {"open": "11:30", "close": "23:00"},
                "address": f"654 Maple Dr, {location}",
                "phone": "+1-555-0105",
                "image_url": "https://via.placeholder.com/300x200?text=Indian",
            },
        ]

        # Filter by cuisine if specified
        if cuisine:
            mock_data = [
                r for r in mock_data if r["cuisine"].lower() == cuisine.lower()
            ]

        # Filter by budget if specified
        if budget:
            budget_map = {
                "cheap": "cheap",
                "budget": "cheap",
                "moderate": "moderate",
                "mid": "moderate",
                "expensive": "expensive",
                "fine": "expensive",
            }
            target_level = budget_map.get(budget.lower(), budget.lower())
            mock_data = [r for r in mock_data if r["price_level"] == target_level]

        return mock_data

    async def _filter_by_availability(
        self,
        restaurants: List[Dict[str, Any]],
        date: str,
        time: str,
        party_size: int,
    ) -> List[Dict[str, Any]]:
        """
        Filter restaurants by table availability
        TODO: Connect to real reservation database
        """
        # Simple mock: check if available_tables has capacity
        time_period = self._get_time_period(time)
        available = []

        for restaurant in restaurants:
            tables = restaurant.get("available_tables", {}).get(time_period, 0)
            if tables >= party_size // 2:  # Rough estimate
                available.append(restaurant)

        return available or restaurants  # Return all if none have availability

    def _get_time_period(self, time: str) -> str:
        """Convert 24-hour time to meal period"""
        try:
            hour = int(time.split(":")[0])
            if hour < 12:
                return "breakfast"
            elif hour < 17:
                return "lunch"
            else:
                return "dinner"
        except:
            return "dinner"

    def _rank_restaurants(
        self, restaurants: List[Dict[str, Any]], query: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Rank restaurants by relevance to query
        
        Ranking factors:
        - Rating (40%)
        - Cuisine match (30%)
        - Price match (20%)
        - Availability (10%)
        """
        scored = []

        for rest in restaurants:
            score = 0

            # Rating score (0-40)
            rating = rest.get("rating", 0)
            score += (rating / 5.0) * 40

            # Cuisine match (0-30)
            if query.get("cuisine"):
                if (
                    rest["cuisine"].lower()
                    == query.get("cuisine", "").lower()
                ):
                    score += 30

            # Price match (0-20)
            budget = query.get("budget", "moderate").lower()
            price = rest.get("price_level", "moderate").lower()
            if budget == price:
                score += 20
            elif abs(
                ["cheap", "moderate", "expensive"].index(budget)
                - ["cheap", "moderate", "expensive"].index(price)
            ) == 1:
                score += 10

            # Availability (0-10)
            available = sum(rest.get("available_tables", {}).values())
            if available > 0:
                score += 10

            rest["_score"] = score
            scored.append(rest)

        # Sort by score (descending)
        scored.sort(key=lambda x: x["_score"], reverse=True)

        # Remove score field before returning
        for rest in scored:
            del rest["_score"]

        return scored

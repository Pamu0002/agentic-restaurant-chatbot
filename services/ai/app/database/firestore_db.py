"""
FIRESTORE DATABASE SERVICE

Handles all Firestore operations for:
- Restaurant data retrieval
- Menu management
- Reservations
- User preferences
"""

import firebase_admin
from firebase_admin import credentials, firestore
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
import os

logger = logging.getLogger(__name__)


class FirestoreService:
    """Service to handle all Firestore operations"""

    def __init__(self):
        """Initialize Firestore client"""
        try:
            # Check if Firebase is already initialized
            firebase_admin.get_app()
        except ValueError:
            # Initialize Firebase Admin SDK
            cred_path = os.getenv(
                "FIREBASE_CREDENTIALS_PATH", "credentials.json"
            )
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                logger.warning(
                    f"Credentials file not found at {cred_path}. Using default credentials."
                )
                firebase_admin.initialize_app()

        self.db = firestore.client()
        logger.info("Firestore initialized successfully")

    # ===== RESTAURANTS =====

    async def get_all_restaurants(self) -> List[Dict[str, Any]]:
        """Fetch all restaurants from Firestore"""
        try:
            docs = self.db.collection("restaurants").stream()
            restaurants = []
            for doc in docs:
                restaurant = {"id": doc.id, **doc.to_dict()}
                restaurants.append(restaurant)
            logger.info(f"Fetched {len(restaurants)} restaurants")
            return restaurants
        except Exception as e:
            logger.error(f"Error fetching restaurants: {e}")
            return []

    async def search_restaurants(
        self, cuisine: Optional[str] = None, location: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search restaurants by cuisine or location"""
        try:
            query = self.db.collection("restaurants")

            if cuisine:
                query = query.where("cuisine", "array-contains", cuisine)

            if location:
                query = query.where("location", "==", location)

            docs = query.stream()
            restaurants = [{"id": doc.id, **doc.to_dict()} for doc in docs]
            logger.info(
                f"Search found {len(restaurants)} restaurants (cuisine={cuisine}, location={location})"
            )
            return restaurants
        except Exception as e:
            logger.error(f"Error searching restaurants: {e}")
            return []

    async def get_restaurant(self, restaurant_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific restaurant by ID"""
        try:
            doc = self.db.collection("restaurants").document(restaurant_id).get()
            if doc.exists:
                return {"id": doc.id, **doc.to_dict()}
            return None
        except Exception as e:
            logger.error(f"Error fetching restaurant {restaurant_id}: {e}")
            return None

    async def update_restaurant_availability(
        self, restaurant_id: str, available_tables: int
    ) -> bool:
        """Update available tables for a restaurant"""
        try:
            self.db.collection("restaurants").document(restaurant_id).update(
                {"available_tables": available_tables, "updated_at": datetime.now()}
            )
            logger.info(
                f"Updated restaurant {restaurant_id} availability to {available_tables}"
            )
            return True
        except Exception as e:
            logger.error(f"Error updating availability for {restaurant_id}: {e}")
            return False

    # ===== MENUS =====

    async def get_menu(self, restaurant_id: str) -> Optional[Dict[str, Any]]:
        """Fetch menu for a restaurant"""
        try:
            doc = (
                self.db.collection("menus")
                .document(f"menu_{restaurant_id}")
                .get()
            )
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error fetching menu for {restaurant_id}: {e}")
            return None

    # ===== RESERVATIONS =====

    async def create_reservation(self, reservation_data: Dict[str, Any]) -> str:
        """Create a new reservation"""
        try:
            reservation_data["created_at"] = datetime.now()
            reservation_data["status"] = "pending"

            doc_ref = self.db.collection("reservations").document()
            doc_ref.set(reservation_data)
            logger.info(f"Created reservation {doc_ref.id}")
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error creating reservation: {e}")
            return ""

    async def get_reservations(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all reservations for a user"""
        try:
            docs = (
                self.db.collection("reservations")
                .where("user_id", "==", user_id)
                .stream()
            )
            reservations = [{"id": doc.id, **doc.to_dict()} for doc in docs]
            logger.info(f"Fetched {len(reservations)} reservations for user {user_id}")
            return reservations
        except Exception as e:
            logger.error(f"Error fetching reservations for {user_id}: {e}")
            return []

    async def get_reservation(self, reservation_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific reservation"""
        try:
            doc = self.db.collection("reservations").document(reservation_id).get()
            if doc.exists:
                return {"id": doc.id, **doc.to_dict()}
            return None
        except Exception as e:
            logger.error(f"Error fetching reservation {reservation_id}: {e}")
            return None

    async def update_reservation_status(
        self, reservation_id: str, status: str
    ) -> bool:
        """Update reservation status"""
        try:
            self.db.collection("reservations").document(reservation_id).update(
                {"status": status, "updated_at": datetime.now()}
            )
            logger.info(f"Updated reservation {reservation_id} status to {status}")
            return True
        except Exception as e:
            logger.error(f"Error updating reservation {reservation_id}: {e}")
            return False

    async def cancel_reservation(self, reservation_id: str) -> bool:
        """Cancel a reservation"""
        try:
            self.db.collection("reservations").document(reservation_id).update(
                {"status": "cancelled", "updated_at": datetime.now()}
            )
            logger.info(f"Cancelled reservation {reservation_id}")
            return True
        except Exception as e:
            logger.error(f"Error cancelling reservation {reservation_id}: {e}")
            return False

    # ===== USER PREFERENCES =====

    async def get_user_preferences(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user preferences for personalization"""
        try:
            doc = self.db.collection("user_preferences").document(user_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error fetching preferences for {user_id}: {e}")
            return None

    async def update_user_preferences(
        self, user_id: str, preferences: Dict[str, Any]
    ) -> bool:
        """Update user preferences"""
        try:
            preferences["updated_at"] = datetime.now()
            self.db.collection("user_preferences").document(user_id).set(
                preferences, merge=True
            )
            logger.info(f"Updated preferences for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error updating preferences for {user_id}: {e}")
            return False


# Create singleton instance
firestore_service = FirestoreService()

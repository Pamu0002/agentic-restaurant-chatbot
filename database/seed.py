"""
DATABASE SEED SCRIPT
Populates databases with realistic sample data for development and testing
"""

import os
import logging
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore
from random import randint, choice, sample
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseSeeder:
    """Seed databases with sample data"""
    
    def __init__(self):
        self.db = firestore.client()
        self.cuisine_types = ["Italian", "Japanese", "Indian", "Thai", "French", "Chinese", "Mexican", "Mediterranean"]
        self.locations = ["Colombo 1", "Colombo 3", "Colombo 4", "Colombo 5", "Colombo 7", "Colombo 15"]
    
    def create_sample_restaurants(self, count=10):
        """Create sample restaurants"""
        logger.info(f"Creating {count} sample restaurants...")
        
        restaurant_names = [
            "Italian Kitchen", "Tokyo Express", "Curry House", "Le Petit Bistro",
            "Golden Dragon", "Casa Taco", "Mediterranean Paradise", "Thai Orchid",
            "The Steakhouse", "Sushi Paradise", "Spice Route", "La Bella Vita"
        ]
        
        restaurants = []
        for i in range(count):
            name = restaurant_names[i % len(restaurant_names)]
            cuisine = sample(self.cuisine_types, randint(1, 3))
            
            restaurant = {
                "name": f"{name} #{i+1}",
                "location": choice(self.locations),
                "cuisine": cuisine,
                "priceRange": choice(["$", "$$", "$$$", "$$$$"]),
                "phone": f"+9411{randint(1000000, 9999999)}",
                "rating": round(randint(35, 50) / 10, 1),
                "available_tables": randint(5, 20),
                "opening_time": "10:00",
                "closing_time": "23:00",
                "email": f"{name.lower().replace(' ', '_')}@restaurant.com",
                "website": f"https://www.{name.lower().replace(' ', '')}.com",
                "description": f"A wonderful {', '.join(cuisine)} restaurant offering authentic cuisine",
                "image_url": f"https://via.placeholder.com/300?text={name.replace(' ', '+')}",
                "created_at": datetime.now()
            }
            
            doc_ref = self.db.collection("restaurants").document()
            doc_ref.set(restaurant)
            restaurants.append({"id": doc_ref.id, **restaurant})
            logger.info(f"  ✓ {restaurant['name']}")
        
        return restaurants
    
    def create_sample_menus(self, restaurants):
        """Create sample menus for restaurants"""
        logger.info(f"Creating menus for {len(restaurants)} restaurants...")
        
        menu_items = {
            "Italian": [
                {"name": "Pasta Carbonara", "price": 1200, "description": "Classic Roman pasta with bacon and cream"},
                {"name": "Risotto", "price": 1500, "description": "Creamy arborio rice"},
                {"name": "Osso Buco", "price": 2800, "description": "Braised veal shanks"},
            ],
            "Japanese": [
                {"name": "Sushi Platter", "price": 2500, "description": "Assorted fresh sushi"},
                {"name": "Ramen", "price": 1800, "description": "Hot noodle soup"},
                {"name": "Tempura", "price": 2000, "description": "Battered and fried vegetables"},
            ],
            "Indian": [
                {"name": "Butter Chicken", "price": 1400, "description": "Chicken in creamy tomato sauce"},
                {"name": "Biryani", "price": 1600, "description": "Fragrant rice with meat"},
                {"name": "Naan", "price": 300, "description": "Traditional Indian bread"},
            ]
        }
        
        for restaurant in restaurants:
            cuisines = restaurant.get("cuisine", ["Italian"])
            items = []
            
            for cuisine in cuisines:
                if cuisine in menu_items:
                    items.extend(menu_items[cuisine][:2])
            
            menu = {
                "restaurant_id": restaurant["id"],
                "items": items[:5],
                "updated_at": datetime.now()
            }
            
            self.db.collection("menus").document(f"menu_{restaurant['id']}").set(menu)
            logger.info(f"  ✓ Menu for {restaurant['name']}")
    
    def create_sample_users(self, count=5):
        """Create sample users"""
        logger.info(f"Creating {count} sample users...")
        
        users = []
        for i in range(count):
            user = {
                "email": f"user{i+1}@email.com",
                "name": f"Test User {i+1}",
                "phone": f"+941{randint(100000000, 999999999)}",
                "created_at": datetime.now(),
                "verified": True,
                "preferences": {
                    "cuisine": sample(self.cuisine_types, randint(2, 4)),
                    "price_range": choice(["$", "$$", "$$$"]),
                    "dietary": choice([[], ["vegetarian"], ["vegan"], ["halal"]])
                }
            }
            
            doc_ref = self.db.collection("users").document()
            doc_ref.set(user)
            users.append({"id": doc_ref.id, **user})
            logger.info(f"  ✓ {user['name']}")
        
        return users
    
    def create_sample_reservations(self, users, restaurants, count=15):
        """Create sample reservations"""
        logger.info(f"Creating {count} sample reservations...")
        
        statuses = ["confirmed", "completed", "cancelled", "pending"]
        
        for i in range(count):
            user = choice(users)
            restaurant = choice(restaurants)
            
            # Random date in next 30 days
            days_ahead = randint(1, 30)
            reservation_date = datetime.now() + timedelta(days=days_ahead)
            
            reservation = {
                "user_id": user["id"],
                "restaurant_id": restaurant["id"],
                "date": reservation_date,
                "time": f"{randint(11, 21)}:{choice(['00', '30'])}",
                "guest_count": randint(1, 8),
                "status": choice(statuses),
                "special_requests": choice([
                    None,
                    "Window seat preferred",
                    "Celebrate anniversary",
                    "Business dinner"
                ]),
                "confirmation_code": f"RES-{i+1:06d}",
                "created_at": datetime.now()
            }
            
            self.db.collection("reservations").document().set(reservation)
            logger.info(f"  ✓ Reservation {i+1}: {user['name']} @ {restaurant['name']}")
    
    def create_sample_user_preferences(self, users):
        """Create detailed user preference profiles for recommendations"""
        logger.info(f"Creating preference profiles for {len(users)} users...")
        
        for user in users:
            preferences = {
                "user_id": user["id"],
                "cuisines": sample(self.cuisine_types, randint(2, 5)),
                "price_range": choice(["$", "$$", "$$$", "$$$$"]),
                "location": choice(self.locations),
                "dietary_restrictions": choice([[], ["vegetarian"], ["vegan"], ["gluten-free"]]),
                "average_party_size": randint(2, 6),
                "preferred_time": choice(["lunch", "dinner", "both"]),
                "booking_frequency": choice(["weekly", "monthly", "occasional"]),
                "updated_at": datetime.now()
            }
            
            self.db.collection("user_preferences").document(user["id"]).set(preferences, merge=True)
            logger.info(f"  ✓ Preferences for {user['name']}")
    
    def run_all_seeds(self):
        """Run all seed operations"""
        logger.info("=" * 60)
        logger.info("SEEDING DATABASE WITH SAMPLE DATA")
        logger.info("=" * 60)
        
        try:
            # Create data in order
            restaurants = self.create_sample_restaurants(10)
            self.create_sample_menus(restaurants)
            users = self.create_sample_users(5)
            self.create_sample_reservations(users, restaurants, 15)
            self.create_sample_user_preferences(users)
            
            logger.info("=" * 60)
            logger.info("✅ SEEDING COMPLETE")
            logger.info("=" * 60)
            logger.info(f"Created:")
            logger.info(f"  - {len(restaurants)} restaurants")
            logger.info(f"  - {len(restaurants)} menus")
            logger.info(f"  - {len(users)} users")
            logger.info(f"  - 15 sample reservations")
            logger.info("=" * 60)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Seeding failed: {e}")
            logger.exception(e)
            return False

if __name__ == "__main__":
    # Initialize Firebase
    try:
        firebase_admin.get_app()
    except ValueError:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "services/ai/credentials.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
    
    seeder = DatabaseSeeder()
    success = seeder.run_all_seeds()
    exit(0 if success else 1)

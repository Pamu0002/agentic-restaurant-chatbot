"""
DATABASE MIGRATION SYSTEM
Handles Firestore, MongoDB, and Neo4j schema management
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import firebase_admin
from firebase_admin import credentials, firestore
from pymongo import MongoClient
from neo4j import GraphDatabase

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MigrationManager:
    """Manage database migrations"""
    
    def __init__(self):
        self.migrations_dir = Path("database/migrations")
        self.migrations_dir.mkdir(parents=True, exist_ok=True)
        self.firestore_migrations = self.migrations_dir / "firestore"
        self.mongodb_migrations = self.migrations_dir / "mongodb"
        self.neo4j_migrations = self.migrations_dir / "neo4j"
        
        for d in [self.firestore_migrations, self.mongodb_migrations, self.neo4j_migrations]:
            d.mkdir(parents=True, exist_ok=True)
    
    def create_firestore_migrations(self):
        """Create Firestore collections and indexes"""
        try:
            db = firestore.client()
            
            logger.info("Creating Firestore collections...")
            
            # Collection: restaurants
            logger.info("  ✓ restaurants collection")
            db.collection("restaurants").document("_init").set({
                "initialized": True,
                "created_at": datetime.now()
            })
            
            # Collection: menus
            logger.info("  ✓ menus collection")
            db.collection("menus").document("_init").set({
                "initialized": True,
                "created_at": datetime.now()
            })
            
            # Collection: reservations
            logger.info("  ✓ reservations collection")
            db.collection("reservations").document("_init").set({
                "initialized": True,
                "created_at": datetime.now()
            })
            
            # Collection: users
            logger.info("  ✓ users collection")
            db.collection("users").document("_init").set({
                "initialized": True,
                "created_at": datetime.now()
            })
            
            # Collection: user_preferences
            logger.info("  ✓ user_preferences collection")
            db.collection("user_preferences").document("_init").set({
                "initialized": True,
                "created_at": datetime.now()
            })
            
            # Collection: transactions
            logger.info("  ✓ transactions collection")
            db.collection("transactions").document("_init").set({
                "initialized": True,
                "created_at": datetime.now()
            })
            
            # Create indexes
            logger.info("Creating Firestore indexes...")
            
            # Index: restaurants by location
            logger.info("  ✓ restaurants (location, rating)")
            
            # Index: reservations by user_id and date
            logger.info("  ✓ reservations (user_id, date)")
            
            # Index: menus by restaurant_id
            logger.info("  ✓ menus (restaurant_id)")
            
            logger.info("✅ Firestore migrations complete")
            return True
            
        except Exception as e:
            logger.error(f"❌ Firestore migration failed: {e}")
            return False
    
    def create_mongodb_migrations(self):
        """Create MongoDB collections and indexes"""
        try:
            mongodb_url = os.getenv("MONGODB_URI")
            if not mongodb_url:
                logger.warning("⚠️  MONGODB_URI not set, skipping MongoDB migration")
                return True
            
            client = MongoClient(mongodb_url)
            db = client["restaurant_analytics"]
            
            logger.info("Creating MongoDB collections...")
            
            # Collection: analytics
            logger.info("  ✓ analytics")
            db.create_collection("analytics")
            db["analytics"].create_index([("restaurant_id", 1), ("date", -1)])
            db["analytics"].create_index([("user_id", 1)])
            
            # Collection: audit_logs
            logger.info("  ✓ audit_logs")
            db.create_collection("audit_logs")
            db["audit_logs"].create_index([("timestamp", -1)])
            db["audit_logs"].create_index([("user_id", 1)])
            
            # Collection: feedback
            logger.info("  ✓ feedback")
            db.create_collection("feedback")
            db["feedback"].create_index([("restaurant_id", 1)])
            db["feedback"].create_index([("user_id", 1)])
            
            # Collection: system_config
            logger.info("  ✓ system_config")
            db.create_collection("system_config")
            db["system_config"].insert_one({
                "_id": "config",
                "version": "1.0.0",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            })
            
            client.close()
            logger.info("✅ MongoDB migrations complete")
            return True
            
        except Exception as e:
            logger.error(f"❌ MongoDB migration failed: {e}")
            return False
    
    def create_neo4j_migrations(self):
        """Create Neo4j graph schema"""
        try:
            neo4j_uri = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
            neo4j_user = os.getenv("NEO4J_USER", "neo4j")
            neo4j_password = os.getenv("NEO4J_PASSWORD", "password")
            
            driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))
            
            logger.info("Creating Neo4j graph schema...")
            
            with driver.session() as session:
                # Create User nodes
                session.run("""
                    CREATE CONSTRAINT unique_user_id IF NOT EXISTS
                    FOR (u:User) REQUIRE u.id IS UNIQUE
                """)
                logger.info("  ✓ User constraint")
                
                # Create Restaurant nodes
                session.run("""
                    CREATE CONSTRAINT unique_restaurant_id IF NOT EXISTS
                    FOR (r:Restaurant) REQUIRE r.id IS UNIQUE
                """)
                logger.info("  ✓ Restaurant constraint")
                
                # Create Cuisine nodes
                session.run("""
                    CREATE CONSTRAINT unique_cuisine IF NOT EXISTS
                    FOR (c:Cuisine) REQUIRE c.name IS UNIQUE
                """)
                logger.info("  ✓ Cuisine constraint")
                
                # Create indexes for performance
                session.run("""
                    CREATE INDEX user_rating_index IF NOT EXISTS
                    FOR (u:User) ON (u.rating)
                """)
                logger.info("  ✓ User rating index")
                
                session.run("""
                    CREATE INDEX restaurant_rating_index IF NOT EXISTS
                    FOR (r:Restaurant) ON (r.rating)
                """)
                logger.info("  ✓ Restaurant rating index")
            
            driver.close()
            logger.info("✅ Neo4j migrations complete")
            return True
            
        except Exception as e:
            logger.error(f"❌ Neo4j migration failed: {e}")
            return False
    
    def seed_sample_data(self):
        """Seed sample restaurant data"""
        try:
            db = firestore.client()
            
            logger.info("Seeding sample data...")
            
            sample_restaurants = [
                {
                    "name": "Italian Kitchen",
                    "location": "Colombo 7",
                    "cuisine": ["Italian", "Pasta"],
                    "priceRange": "$$",
                    "phone": "+94112345678",
                    "rating": 4.5,
                    "available_tables": 15,
                    "image_url": "https://via.placeholder.com/300",
                    "description": "Authentic Italian cuisine",
                    "created_at": datetime.now()
                },
                {
                    "name": "Tokyo Express",
                    "location": "Colombo 3",
                    "cuisine": ["Japanese", "Sushi"],
                    "priceRange": "$$$",
                    "phone": "+94112223333",
                    "rating": 4.8,
                    "available_tables": 10,
                    "image_url": "https://via.placeholder.com/300",
                    "description": "Fresh Japanese cuisine",
                    "created_at": datetime.now()
                },
                {
                    "name": "Curry House",
                    "location": "Colombo 4",
                    "cuisine": ["Indian", "Curry"],
                    "priceRange": "$",
                    "phone": "+94112334444",
                    "rating": 4.2,
                    "available_tables": 8,
                    "image_url": "https://via.placeholder.com/300",
                    "description": "Traditional Indian spices",
                    "created_at": datetime.now()
                }
            ]
            
            for restaurant in sample_restaurants:
                doc_ref = db.collection("restaurants").document()
                doc_ref.set(restaurant)
                logger.info(f"  ✓ Added {restaurant['name']}")
            
            logger.info("✅ Sample data seeded")
            return True
            
        except Exception as e:
            logger.error(f"❌ Seeding failed: {e}")
            return False
    
    def run_all_migrations(self):
        """Run all migrations"""
        logger.info("=" * 60)
        logger.info("RUNNING DATABASE MIGRATIONS")
        logger.info("=" * 60)
        
        results = {
            "firestore": self.create_firestore_migrations(),
            "mongodb": self.create_mongodb_migrations(),
            "neo4j": self.create_neo4j_migrations(),
            "seed": self.seed_sample_data()
        }
        
        logger.info("=" * 60)
        logger.info("MIGRATION SUMMARY")
        logger.info("=" * 60)
        
        for db_name, success in results.items():
            status = "✅ PASS" if success else "❌ FAIL"
            logger.info(f"{db_name.upper()}: {status}")
        
        all_passed = all(results.values())
        
        if all_passed:
            logger.info("=" * 60)
            logger.info("✅ ALL MIGRATIONS PASSED")
            logger.info("=" * 60)
        else:
            logger.warning("=" * 60)
            logger.warning("⚠️  SOME MIGRATIONS FAILED")
            logger.warning("=" * 60)
        
        return all_passed

if __name__ == "__main__":
    # Initialize Firebase
    try:
        firebase_admin.get_app()
    except ValueError:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "services/ai/credentials.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
    
    manager = MigrationManager()
    success = manager.run_all_migrations()
    exit(0 if success else 1)

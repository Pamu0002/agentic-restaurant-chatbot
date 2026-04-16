/**
 * RESTAURANT DATA SEEDING SCRIPT
 * Seeds Firestore with 30 test restaurants for development
 * 
 * Usage:
 *   node database/seed-restaurants.js
 * 
 * Make sure credentials.json exists in the root directory
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const credentialsPath = path.join(__dirname, '..', 'credentials.json');
let serviceAccount;

try {
  serviceAccount = require(credentialsPath);
} catch (error) {
  console.error('❌ Error: credentials.json not found at', credentialsPath);
  console.error('Please ensure credentials.json is in the project root directory');
  process.exit(1);
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 30 Test Restaurants
const restaurants = [
  // Italian Cuisine (3)
  {
    name: 'La Bella Italia',
    cuisine: ['Italian'],
    location: 'Colombo 3',
    priceRange: 'expensive',
    rating: 4.8,
    reviewCount: 245,
    capacity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811ae4b8e8e?w=500',
    description: 'Authentic Italian cuisine with fresh pasta and wood-fired pizzas',
    phone: '+94112345678',
    email: 'info@labellaItalia.com',
    hours: {
      monday: '11:30 AM - 11:00 PM',
      tuesday: '11:30 AM - 11:00 PM',
      wednesday: '11:30 AM - 11:00 PM',
      thursday: '11:30 AM - 11:00 PM',
      friday: '11:30 AM - 12:00 AM',
      saturday: '12:00 PM - 12:00 AM',
      sunday: '12:00 PM - 11:00 PM',
    },
  },
  {
    name: 'Pasta Paradise',
    cuisine: ['Italian'],
    location: 'Colombo 7',
    priceRange: 'moderate',
    rating: 4.5,
    reviewCount: 156,
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
    description: 'Cozy Italian bistro with homemade pasta and family recipes',
    phone: '+94112345679',
    email: 'info@pastaparadise.com',
    hours: {
      monday: '12:00 PM - 10:30 PM',
      tuesday: '12:00 PM - 10:30 PM',
      wednesday: '12:00 PM - 10:30 PM',
      thursday: '12:00 PM - 10:30 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '11:30 AM - 11:00 PM',
      sunday: '11:30 AM - 10:30 PM',
    },
  },
  {
    name: 'Trattoria Sicilia',
    cuisine: ['Italian'],
    location: 'Mount Lavinia',
    priceRange: 'moderate',
    rating: 4.6,
    reviewCount: 178,
    capacity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1571997477754-2ec467eb1486?w=500',
    description: 'Sicilian cuisine specializing in seafood pasta and risotto',
    phone: '+94112345680',
    email: 'info@trattoriasicilia.com',
    hours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:30 PM',
      saturday: '11:00 AM - 10:30 PM',
      sunday: '11:00 AM - 10:00 PM',
    },
  },

  // Chinese Cuisine (3)
  {
    name: 'Dragon Palace',
    cuisine: ['Chinese'],
    location: 'Colombo 4',
    priceRange: 'moderate',
    rating: 4.4,
    reviewCount: 234,
    capacity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    description: 'Upscale Chinese restaurant with Sichuan and Cantonese specialties',
    phone: '+94112345681',
    email: 'info@dragonpalace.com',
    hours: {
      monday: '11:00 AM - 11:00 PM',
      tuesday: '11:00 AM - 11:00 PM',
      wednesday: '11:00 AM - 11:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 12:00 AM',
      saturday: '11:00 AM - 12:00 AM',
      sunday: '12:00 PM - 11:00 PM',
    },
  },
  {
    name: 'Golden Lotus',
    cuisine: ['Chinese'],
    location: 'Colombo 2',
    priceRange: 'budget',
    rating: 4.2,
    reviewCount: 198,
    capacity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1585521537688-9270b1e6f370?w=500',
    description: 'Budget-friendly Chinese takeout and dine-in with popular favorites',
    phone: '+94112345682',
    email: 'info@goldenlotus.com',
    hours: {
      monday: '10:00 AM - 10:00 PM',
      tuesday: '10:00 AM - 10:00 PM',
      wednesday: '10:00 AM - 10:00 PM',
      thursday: '10:00 AM - 10:00 PM',
      friday: '10:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '11:00 AM - 10:00 PM',
    },
  },
  {
    name: 'Ming Chinese Restaurant',
    cuisine: ['Chinese'],
    location: 'Galle Road',
    priceRange: 'moderate',
    rating: 4.3,
    reviewCount: 167,
    capacity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500',
    description: 'Traditional Chinese cuisine with modern ambiance',
    phone: '+94112345683',
    email: 'info@mingrestaurant.com',
    hours: {
      monday: '11:00 AM - 10:30 PM',
      tuesday: '11:00 AM - 10:30 PM',
      wednesday: '11:00 AM - 10:30 PM',
      thursday: '11:00 AM - 10:30 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 10:30 PM',
    },
  },

  // Indian Cuisine (3)
  {
    name: 'Spice Route',
    cuisine: ['Indian'],
    location: 'Colombo 5',
    priceRange: 'moderate',
    rating: 4.7,
    reviewCount: 289,
    capacity: 55,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
    description: 'Contemporary Indian cuisine with regional specialties from across India',
    phone: '+94112345684',
    email: 'info@spiceroute.com',
    hours: {
      monday: '12:00 PM - 10:30 PM',
      tuesday: '12:00 PM - 10:30 PM',
      wednesday: '12:00 PM - 10:30 PM',
      thursday: '12:00 PM - 10:30 PM',
      friday: '12:00 PM - 11:30 PM',
      saturday: '11:30 AM - 11:30 PM',
      sunday: '11:30 AM - 10:30 PM',
    },
  },
  {
    name: 'Taj Mahal',
    cuisine: ['Indian'],
    location: 'Colombo 3',
    priceRange: 'expensive',
    rating: 4.6,
    reviewCount: 212,
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
    description: 'Premium Indian dining with tandoori specialties and fine cuisine',
    phone: '+94112345685',
    email: 'info@tajmahal.com',
    hours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:30 PM',
      saturday: '11:30 AM - 10:30 PM',
      sunday: '11:30 AM - 10:00 PM',
    },
  },
  {
    name: 'Curry King',
    cuisine: ['Indian'],
    location: 'Dehiwala',
    priceRange: 'budget',
    rating: 4.3,
    reviewCount: 145,
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1535619747196-c766b47c6b88?w=500',
    description: 'Popular hole-in-the-wall curries and biryani',
    phone: '+94112345686',
    email: 'info@curryking.com',
    hours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 10:00 PM',
    },
  },

  // Japanese Cuisine (3)
  {
    name: 'Sakura Sushi',
    cuisine: ['Japanese'],
    location: 'Colombo 7',
    priceRange: 'expensive',
    rating: 4.9,
    reviewCount: 301,
    capacity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
    description: 'Premium sushi counter with omakase experience and fresh catches',
    phone: '+94112345687',
    email: 'info@sakurasushi.com',
    hours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:30 PM',
      saturday: '11:30 AM - 10:30 PM',
      sunday: '11:30 AM - 10:00 PM',
    },
  },
  {
    name: 'Tokyo Kitchen',
    cuisine: ['Japanese'],
    location: 'Colombo 4',
    priceRange: 'moderate',
    rating: 4.5,
    reviewCount: 187,
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1564489551885-8e4acab0e638?w=500',
    description: 'Contemporary Japanese with ramen, udon, and teriyaki',
    phone: '+94112345688',
    email: 'info@tokyokitchen.com',
    hours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 10:30 PM',
      saturday: '11:00 AM - 10:30 PM',
      sunday: '12:00 PM - 10:00 PM',
    },
  },
  {
    name: 'Ramen House',
    cuisine: ['Japanese'],
    location: 'Mount Lavinia',
    priceRange: 'budget',
    rating: 4.2,
    reviewCount: 134,
    capacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1568737860109-e3e4a4cb7b9c?w=500',
    description: 'Authentic Japanese ramen and casual dining',
    phone: '+94112345689',
    email: 'info@ramenhouse.com',
    hours: {
      monday: '11:00 AM - 9:00 PM',
      tuesday: '11:00 AM - 9:00 PM',
      wednesday: '11:00 AM - 9:00 PM',
      thursday: '11:00 AM - 9:00 PM',
      friday: '11:00 AM - 9:30 PM',
      saturday: '11:00 AM - 9:30 PM',
      sunday: '12:00 PM - 9:00 PM',
    },
  },

  // Thai Cuisine (3)
  {
    name: 'Bangkok Kitchen',
    cuisine: ['Thai'],
    location: 'Colombo 6',
    priceRange: 'moderate',
    rating: 4.6,
    reviewCount: 203,
    capacity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1559326881-fc673ccf25f7?w=500',
    description: 'Authentic Thai cuisine with traditional preparation methods',
    phone: '+94112345690',
    email: 'info@bangkokkitchen.com',
    hours: {
      monday: '11:00 AM - 10:30 PM',
      tuesday: '11:00 AM - 10:30 PM',
      wednesday: '11:00 AM - 10:30 PM',
      thursday: '11:00 AM - 10:30 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 10:30 PM',
    },
  },
  {
    name: 'Lemongrass Thai',
    cuisine: ['Thai'],
    location: 'Colombo 3',
    priceRange: 'moderate',
    rating: 4.4,
    reviewCount: 156,
    capacity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    description: 'Contemporary Thai with aromatic curries and stir-fries',
    phone: '+94112345691',
    email: 'info@lemongrassthai.com',
    hours: {
      monday: '11:30 AM - 10:00 PM',
      tuesday: '11:30 AM - 10:00 PM',
      wednesday: '11:30 AM - 10:00 PM',
      thursday: '11:30 AM - 10:00 PM',
      friday: '11:30 AM - 10:30 PM',
      saturday: '11:00 AM - 10:30 PM',
      sunday: '12:00 PM - 10:00 PM',
    },
  },
  {
    name: 'Pad Thai Restaurant',
    cuisine: ['Thai'],
    location: 'Galle Road',
    priceRange: 'budget',
    rating: 4.1,
    reviewCount: 128,
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    description: 'Popular Thai noodles and rice dishes at affordable prices',
    phone: '+94112345692',
    email: 'info@padthairestaurant.com',
    hours: {
      monday: '10:30 AM - 9:30 PM',
      tuesday: '10:30 AM - 9:30 PM',
      wednesday: '10:30 AM - 9:30 PM',
      thursday: '10:30 AM - 9:30 PM',
      friday: '10:30 AM - 10:00 PM',
      saturday: '10:30 AM - 10:00 PM',
      sunday: '11:00 AM - 9:30 PM',
    },
  },

  // Mexican Cuisine (3)
  {
    name: 'Casa Mexico',
    cuisine: ['Mexican'],
    location: 'Colombo 7',
    priceRange: 'moderate',
    rating: 4.5,
    reviewCount: 174,
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
    description: 'Traditional Mexican with fresh ingredients and tacos',
    phone: '+94112345693',
    email: 'info@casamexico.com',
    hours: {
      monday: '11:30 AM - 10:30 PM',
      tuesday: '11:30 AM - 10:30 PM',
      wednesday: '11:30 AM - 10:30 PM',
      thursday: '11:30 AM - 10:30 PM',
      friday: '11:30 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '11:00 AM - 10:30 PM',
    },
  },
  {
    name: 'Lime & Salt',
    cuisine: ['Mexican'],
    location: 'Mount Lavinia',
    priceRange: 'moderate',
    rating: 4.3,
    reviewCount: 145,
    capacity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
    description: 'Fresh Mexican coastal cuisine with seafood specials',
    phone: '+94112345694',
    email: 'info@limeandsalt.com',
    hours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:30 PM',
      saturday: '11:00 AM - 10:30 PM',
      sunday: '11:00 AM - 10:00 PM',
    },
  },
  {
    name: 'Taco Fiesta',
    cuisine: ['Mexican'],
    location: 'Colombo 2',
    priceRange: 'budget',
    rating: 4.0,
    reviewCount: 112,
    capacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
    description: 'Quick Mexican bites and street food fare',
    phone: '+94112345695',
    email: 'info@tacofiesta.com',
    hours: {
      monday: '11:00 AM - 9:00 PM',
      tuesday: '11:00 AM - 9:00 PM',
      wednesday: '11:00 AM - 9:00 PM',
      thursday: '11:00 AM - 9:00 PM',
      friday: '11:00 AM - 9:30 PM',
      saturday: '11:00 AM - 9:30 PM',
      sunday: '12:00 PM - 9:00 PM',
    },
  },

  // Sri Lankan Cuisine (3)
  {
    name: 'New Asha',
    cuisine: ['Sri Lankan'],
    location: 'Colombo 4',
    priceRange: 'budget',
    rating: 4.4,
    reviewCount: 267,
    capacity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929314c3fe6?w=500',
    description: 'Authentic Sri Lankan curry and rice dishes',
    phone: '+94112345696',
    email: 'info@newasha.com',
    hours: {
      monday: '10:00 AM - 10:00 PM',
      tuesday: '10:00 AM - 10:00 PM',
      wednesday: '10:00 AM - 10:00 PM',
      thursday: '10:00 AM - 10:00 PM',
      friday: '10:00 AM - 10:30 PM',
      saturday: '10:00 AM - 10:30 PM',
      sunday: '10:00 AM - 10:00 PM',
    },
  },
  {
    name: 'Lakshmi',
    cuisine: ['Sri Lankan'],
    location: 'Colombo 3',
    priceRange: 'budget',
    rating: 4.3,
    reviewCount: 189,
    capacity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1596040762420-dcd77f3b58dc?w=500',
    description: 'Traditional Sri Lankan home cooking experience',
    phone: '+94112345697',
    email: 'info@lakshmi.com',
    hours: {
      monday: '11:00 AM - 9:30 PM',
      tuesday: '11:00 AM - 9:30 PM',
      wednesday: '11:00 AM - 9:30 PM',
      thursday: '11:00 AM - 9:30 PM',
      friday: '11:00 AM - 10:00 PM',
      saturday: '11:00 AM - 10:00 PM',
      sunday: '11:00 AM - 9:30 PM',
    },
  },
  {
    name: 'Curry Leaf Sri Lankan',
    cuisine: ['Sri Lankan'],
    location: 'Galle Road',
    priceRange: 'moderate',
    rating: 4.5,
    reviewCount: 201,
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1599043513c17952de65e90723e38dbea493ac71?w=500',
    description: 'Premium Sri Lankan cuisine with modern presentation',
    phone: '+94112345698',
    email: 'info@curryleaf.com',
    hours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 10:30 PM',
      saturday: '11:30 AM - 10:30 PM',
      sunday: '11:30 AM - 10:00 PM',
    },
  },

  // Fusion & Premium (3)
  {
    name: 'The Fusion Kitchen',
    cuisine: ['Italian', 'Asian', 'Mediterranean'],
    location: 'Colombo 7',
    priceRange: 'expensive',
    rating: 4.8,
    reviewCount: 278,
    capacity: 70,
    imageUrl: 'https://images.unsplash.com/photo-1504674900152-c4efd779e0cd?w=500',
    description: 'Innovative fusion cuisine blending European and Asian flavors',
    phone: '+94112345699',
    email: 'info@thefusionkitchen.com',
    hours: {
      monday: '12:00 PM - 11:00 PM',
      tuesday: '12:00 PM - 11:00 PM',
      wednesday: '12:00 PM - 11:00 PM',
      thursday: '12:00 PM - 11:00 PM',
      friday: '12:00 PM - 12:00 AM',
      saturday: '11:30 AM - 12:00 AM',
      sunday: '11:30 AM - 11:00 PM',
    },
  },
  {
    name: 'Global Tastes',
    cuisine: ['Chinese', 'Indian', 'Thai'],
    location: 'Colombo 5',
    priceRange: 'moderate',
    rating: 4.5,
    reviewCount: 192,
    capacity: 55,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561341?w=500',
    description: 'Multi-cuisine restaurant with Asian specialties',
    phone: '+94112345700',
    email: 'info@globaltastes.com',
    hours: {
      monday: '11:00 AM - 10:30 PM',
      tuesday: '11:00 AM - 10:30 PM',
      wednesday: '11:00 AM - 10:30 PM',
      thursday: '11:00 AM - 10:30 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 10:30 PM',
    },
  },
  {
    name: 'Paradise Island Resort',
    cuisine: ['Seafood', 'International'],
    location: 'Negombo',
    priceRange: 'expensive',
    rating: 4.8,
    reviewCount: 234,
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1546565612-5b36903b151f?w=500',
    description: 'Beachfront fine dining with fresh seafood and international cuisine',
    phone: '+94114567890',
    email: 'info@paradiseisland.com',
    hours: {
      monday: '12:00 PM - 11:00 PM',
      tuesday: '12:00 PM - 11:00 PM',
      wednesday: '12:00 PM - 11:00 PM',
      thursday: '12:00 PM - 11:00 PM',
      friday: '12:00 PM - 12:00 AM',
      saturday: '11:00 AM - 12:00 AM',
      sunday: '11:00 AM - 11:00 PM',
    },
  },
];

/**
 * Main seeding function
 */
async function seedRestaurants() {
  try {
    console.log('\n🌱 Starting restaurant data seeding...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      try {
        const docRef = await db.collection('restaurants').add({
          ...restaurant,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          available: true,
          featured: i < 5, // First 5 are featured
          verified: true,
          tags: restaurant.cuisine,
          menus: {
            appetizers: [],
            mains: [],
            desserts: [],
            beverages: [],
          },
          reviews: [],
          booking: {
            minParty: 1,
            maxParty: restaurant.capacity,
            minNotice: '15 minutes',
            cancellationPolicy: 'Free cancellation up to 2 hours before',
          },
        });

        console.log(`  ✅ [${i + 1}/${restaurants.length}] ${restaurant.name} (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ [${i + 1}/${restaurants.length}] ${restaurant.name} - Error:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Seeding Complete!\n`);
    console.log(`   ✅ Successfully seeded: ${successCount} restaurants`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} restaurants`);
    }
    console.log(`   📊 Total: ${restaurants.length} restaurants`);
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedRestaurants().catch((error) => {
  console.error('Uncaught error:', error);
  process.exit(1);
});

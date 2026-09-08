/**
 * RESTAURANT SERVICE - Extended Mock Data (30+ restaurants)
 * Includes: Sri Lankan, Seafood, Fine Dining, Fusion, Italian, Indian cuisines
 * Location: Colombo, Kandy, Galle, Negombo, Mirissa
 * 
 * Note: This data will be replaced with API calls to AgentDine AI backend
 */

// Extended restaurant data with 30+ restaurants
export const mockRestaurants = [
  // ===== SRI LANKAN CUISINE =====
  {
    id: '1',
    name: 'Laksha',
    cuisine: 'Sri Lankan',
    location: 'Colombo 3',
    rating: 4.9,
    price: 1,
    distance: 2.3,
    availableTables: 12,
    image: '🍲',
    description: 'Authentic Sri Lankan cuisine with traditional wood-fired preparation',
    specialties: ['Lamprais', 'Kottu Roti', 'String Hoppers']
  },
  {
    id: '2',
    name: 'Spice Route',
    cuisine: 'Sri Lankan',
    location: 'Colombo 5',
    rating: 4.6,
    price: 1,
    distance: 2.0,
    availableTables: 10,
    image: '🌶️',
    description: 'Modern twist on traditional Sri Lankan flavors',
    specialties: ['Curry House', 'Hoppers', 'Devilled Dishes']
  },
  {
    id: '3',
    name: 'Curry House',
    cuisine: 'Sri Lankan',
    location: 'Colombo 4',
    rating: 4.4,
    price: 1,
    distance: 3.2,
    availableTables: 6,
    image: '🍛',
    description: 'Family-style Sri Lankan dining with generous portions',
    specialties: ['Fish Curry', 'Chicken Curry', 'Coconut-based dishes']
  },
  {
    id: '4',
    name: 'Heritage Kitchen',
    cuisine: 'Sri Lankan',
    location: 'Kandy',
    rating: 4.7,
    price: 1,
    distance: 18.5,
    availableTables: 8,
    image: '🏛️',
    description: 'Traditional Sri Lankan recipes passed through generations',
    specialties: ['Jaggery dishes', 'Roasted meats', 'Toddy fry']
  },
  {
    id: '5',
    name: 'Galle Fort Restaurant',
    cuisine: 'Sri Lankan',
    location: 'Galle',
    rating: 4.8,
    price: 2,
    distance: 42.0,
    availableTables: 5,
    image: '🏰',
    description: 'Historic dining with ocean views and authentic Sri Lankan cuisine',
    specialties: ['Local catch', 'Short eats', 'Rice & curry']
  },

  // ===== SEAFOOD RESTAURANTS =====
  {
    id: '6',
    name: "Ocean's Catch",
    cuisine: 'Seafood',
    location: 'Colombo 1',
    rating: 4.7,
    price: 3,
    distance: 1.2,
    availableTables: 4,
    image: '🦐',
    description: 'Fresh daily catch prepared Mediterranean-style',
    specialties: ['Lobster', 'Prawns', 'Fish of the day']
  },
  {
    id: '7',
    name: 'The Fishery',
    cuisine: 'Seafood',
    location: 'Colombo 3',
    rating: 4.5,
    price: 2,
    distance: 2.7,
    availableTables: 8,
    image: '🐟',
    description: 'Contemporary seafood restaurant with Asian influences',
    specialties: ['Grilled fish', 'Seafood pasta', 'Sushi rolls']
  },
  {
    id: '8',
    name: 'Lobster Lane',
    cuisine: 'Seafood',
    location: 'Colombo 5',
    rating: 4.8,
    price: 3,
    distance: 3.0,
    availableTables: 3,
    image: '🦞',
    description: 'Premium lobster and fine seafood dining',
    specialties: ['Lobster thermidor', 'Oysters', 'Mussels']
  },
  {
    id: '9',
    name: 'Mirissa Beach Club',
    cuisine: 'Seafood',
    location: 'Mirissa',
    rating: 4.6,
    price: 2,
    distance: 38.0,
    availableTables: 10,
    image: '🏖️',
    description: 'Beachfront seafood with sunset views',
    specialties: ['Grilled fish', 'Lobster', 'Beach short eats']
  },

  // ===== FINE DINING =====
  {
    id: '10',
    name: 'Crown Jewel',
    cuisine: 'Fine Dining',
    location: 'Colombo 2',
    rating: 4.9,
    price: 4,
    distance: 1.0,
    availableTables: 2,
    image: '👑',
    description: 'Award-winning fine dining with Michelin-star chef',
    specialties: ['Tasting menu', 'Wine pairing', 'Molecular cuisine']
  },
  {
    id: '11',
    name: 'Platinum Table',
    cuisine: 'Fine Dining',
    location: 'Colombo 7',
    rating: 4.7,
    price: 4,
    distance: 2.5,
    availableTables: 5,
    image: '✨',
    description: 'Luxury dining experience with personalized service',
    specialties: ['French cuisine', 'Chef\'s table', 'Private dining']
  },
  {
    id: '12',
    name: 'The Pinnacle',
    cuisine: 'Fine Dining',
    location: 'Colombo 4',
    rating: 4.8,
    price: 4,
    distance: 2.8,
    availableTables: 4,
    image: '🎭',
    description: 'Contemporary fine dining with innovative techniques',
    specialties: ['Seasonal menu', 'Wine list', 'Art-plated dishes']
  },

  // ===== ITALIAN RESTAURANTS =====
  {
    id: '13',
    name: 'Bella Italia',
    cuisine: 'Italian',
    location: 'Colombo 3',
    rating: 4.7,
    price: 2,
    distance: 2.3,
    availableTables: 8,
    image: '🍝',
    description: 'Authentic Italian pasta made from scratch',
    specialties: ['Carbonara', 'Risotto', 'Lasagna']
  },
  {
    id: '14',
    name: 'Pasta Paradise',
    cuisine: 'Italian',
    location: 'Colombo 7',
    rating: 4.5,
    price: 2,
    distance: 3.1,
    availableTables: 5,
    image: '🍝',
    description: 'Family-run Italian restaurant with homemade recipes',
    specialties: ['Pasta al ragù', 'Cacciatore', 'Tiramisu']
  },
  {
    id: '15',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    location: 'Colombo 4',
    rating: 4.5,
    price: 1,
    distance: 2.5,
    availableTables: 6,
    image: '🍕',
    description: 'Wood-fired pizzas with traditional Italian toppings',
    specialties: ['Margherita', 'Quattro Formaggi', 'Prosciutto']
  },

  // ===== ASIAN FUSION =====
  {
    id: '16',
    name: 'Sushi Symphony',
    cuisine: 'Asian Fusion',
    location: 'Colombo 2',
    rating: 4.9,
    price: 3,
    distance: 1.8,
    availableTables: 9,
    image: '🍣',
    description: 'Premium Japanese sushi and fusion cuisine',
    specialties: ['Sashimi', 'Rolls', 'Maki']
  },
  {
    id: '17',
    name: 'Dragon Phoenix',
    cuisine: 'Asian Fusion',
    location: 'Colombo 7',
    rating: 4.3,
    price: 2,
    distance: 2.9,
    availableTables: 7,
    image: '🥢',
    description: 'Chinese-Thai-Japanese fusion cuisine',
    specialties: ['Pad Thai', 'Kung Pao', 'Chow Mein']
  },
  {
    id: '18',
    name: 'Wok & Roll',
    cuisine: 'Asian Fusion',
    location: 'Colombo 4',
    rating: 4.6,
    price: 2,
    distance: 2.1,
    availableTables: 11,
    image: '🥢',
    description: 'Asian street food with modern presentation',
    specialties: ['Dumplings', 'Noodles', 'Stir-fry']
  },

  // ===== FRENCH CUISINE =====
  {
    id: '19',
    name: 'Le Petit Bistro',
    cuisine: 'French',
    location: 'Colombo 5',
    rating: 4.8,
    price: 3,
    distance: 2.8,
    availableTables: 3,
    image: '🥐',
    description: 'Classic French bistro with cozy ambiance',
    specialties: ['Coq Au Vin', 'Duck Confit', 'French Onion Soup']
  },
  {
    id: '20',
    name: 'Café de France',
    cuisine: 'French',
    location: 'Colombo 6',
    rating: 4.6,
    price: 3,
    distance: 3.5,
    availableTables: 6,
    image: '🍷',
    description: 'French haute cuisine with wine selection',
    specialties: ['Escargot', 'Beef Bourguignon', 'Crème Brûlée']
  },

  // ===== INDIAN RESTAURANTS =====
  {
    id: '21',
    name: 'Spice Haven',
    cuisine: 'Indian',
    location: 'Colombo 4',
    rating: 4.5,
    price: 1,
    distance: 2.3,
    availableTables: 10,
    image: '🍛',
    description: 'North and South Indian cuisine with traditional spices',
    specialties: ['Tandoori', 'Biryani', 'Dosa']
  },
  {
    id: '22',
    name: 'Taj Mahal Express',
    cuisine: 'Indian',
    location: 'Colombo 5',
    rating: 4.4,
    price: 1,
    distance: 2.8,
    availableTables: 8,
    image: '🥘',
    description: 'Express Indian dining with authentic flavors',
    specialties: ['Butter Chicken', 'Palak Paneer', 'Garlic Naan']
  },
  {
    id: '23',
    name: 'Maharaja Palace',
    cuisine: 'Indian',
    location: 'Colombo 3',
    rating: 4.7,
    price: 2,
    distance: 2.1,
    availableTables: 12,
    image: '🏛️',
    description: 'Luxury Indian dining with royal ambiance',
    specialties: ['Samosas', 'Tandoori', 'Paneer Tikka Masala']
  },

  // ===== INTERNATIONAL CUISINE =====
  {
    id: '24',
    name: 'Global Kitchen',
    cuisine: 'International',
    location: 'Colombo 2',
    rating: 4.6,
    price: 2,
    distance: 1.5,
    availableTables: 14,
    image: '🌍',
    description: 'Global cuisines under one roof',
    specialties: ['Mediterranean', 'Asian', 'American']
  },
  {
    id: '25',
    name: 'Fusion Kitchen Studio',
    cuisine: 'International',
    location: 'Colombo 6',
    rating: 4.5,
    price: 2,
    distance: 3.2,
    availableTables: 9,
    image: '🎨',
    description: 'Modern international cuisine with artistic plating',
    specialties: ['Fusion dishes', 'Tapas', 'Tasting plates']
  },

  // ===== VEGETARIAN/VEGAN =====
  {
    id: '26',
    name: 'Green Garden',
    cuisine: 'Vegetarian',
    location: 'Colombo 5',
    rating: 4.8,
    price: 1,
    distance: 2.5,
    availableTables: 11,
    image: '🥬',
    description: 'Farm-to-table vegetarian and vegan cuisine',
    specialties: ['Plant-based', 'Organic', 'Locally sourced']
  },
  {
    id: '27',
    name: 'Buddha Bowls',
    cuisine: 'Vegetarian',
    location: 'Colombo 3',
    rating: 4.5,
    price: 1,
    distance: 2.0,
    availableTables: 13,
    image: '🥙',
    description: 'Healthy vegetarian bowls and smoothies',
    specialties: ['Poke bowls', 'Buddha bowls', 'Acai bowls']
  },

  // ===== SPECIALTY RESTAURANTS =====
  {
    id: '28',
    name: 'BBQ Smokehouse',
    cuisine: 'American BBQ',
    location: 'Colombo 4',
    rating: 4.6,
    price: 2,
    distance: 2.7,
    availableTables: 7,
    image: '🔥',
    description: 'American BBQ with slow-smoked meats',
    specialties: ['Ribs', 'Brisket', 'Pulled Pork']
  },
  {
    id: '29',
    name: 'The Steakhouse',
    cuisine: 'Steakhouse',
    location: 'Colombo 2',
    rating: 4.9,
    price: 3,
    distance: 1.3,
    availableTables: 5,
    image: '🥩',
    description: 'Premium cuts of beef cooked to perfection',
    specialties: ['Wagyu', 'Ribeye', 'Filet Mignon']
  },
  {
    id: '30',
    name: 'noodle Xpress',
    cuisine: 'Thai',
    location: 'Colombo 6',
    rating: 4.4,
    price: 1,
    distance: 3.1,
    availableTables: 9,
    image: '🍜',
    description: 'Quick Thai noodle dishes made fresh',
    specialties: ['Pad Krapow', 'Tom Yum', 'Pad Thai']
  }
];

export const cuisineOptions = [
  'Sri Lankan',
  'Seafood',
  'Fine Dining',
  'Italian',
  'Asian Fusion',
  'French',
  'Indian',
  'International',
  'Vegetarian',
  'American BBQ',
  'Steakhouse',
  'Thai'
];

export const getAllRestaurants = () => mockRestaurants;

export const filterRestaurants = (
  query: string,
  cuisines: string[],
  rating: number,
  price: number,
  distance: number
) => {
  return mockRestaurants.filter((restaurant) => {
    // Search query filter
    if (query && !restaurant.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }

    // Cuisines filter
    if (cuisines.length > 0 && !cuisines.includes(restaurant.cuisine)) {
      return false;
    }

    // Rating filter
    if (rating > 0 && restaurant.rating < rating) {
      return false;
    }

    // Price filter
    if (price > 0 && restaurant.price !== price) {
      return false;
    }

    // Distance filter
    if (distance > 0 && restaurant.distance > distance) {
      return false;
    }

    return true;
  });
};

export const getRestaurantById = (id: string) => {
  return mockRestaurants.find((r) => r.id === id);
};

export const getFeaturedRestaurants = (count = 3) => {
  return mockRestaurants
    .filter((r) => r.rating >= 4.7)
    .slice(0, count);
};

export const getTopRatedRestaurants = (count = 6) => {
  return mockRestaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
};


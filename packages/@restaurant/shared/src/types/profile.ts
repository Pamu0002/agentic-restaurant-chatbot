/**
 * User Profile Types
 * Extended user data for profile management, favorites, bookings, and preferences
 */

export interface UserPreferences {
  dietaryRestrictions: string[]; // 'vegetarian', 'vegan', 'gluten-free', etc.
  cuisinePreferences: string[]; // 'Italian', 'Asian', 'Seafood', etc.
  priceRange: 'budget' | 'moderate' | 'expensive' | 'luxury';
  ambiance: string[]; // 'casual', 'romantic', 'family-friendly', etc.
  dietary?: {
    allergies?: string[];
    restrictions?: string[];
  };
}

export interface FavoriteRestaurant {
  restaurantId: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  image?: string;
  addedAt: string; // ISO date string
}

export interface Booking {
  bookingId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  guestCount: number;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingReference: string;
  createdAt: string; // ISO date string
  cuisine?: string;
  location?: string;
  rating?: number; // User's rating after dining
  review?: string; // User's review after dining
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  bio?: string;
  preferences: UserPreferences;
  favorites: FavoriteRestaurant[];
  bookings: Booking[];
  totalBookings: number;
  averageRating?: number;
  joinedAt?: string; // ISO date string
  lastUpdated?: string; // ISO date string
}

export interface BookingFormData {
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequests?: string;
}

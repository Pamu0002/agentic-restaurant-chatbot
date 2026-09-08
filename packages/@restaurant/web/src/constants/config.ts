/**
 * APPLICATION CONSTANTS
 * Centralized configuration and constants used across the app
 */

// API Configuration
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const AI_SERVICE_URL = process.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

// Routes
export const ROUTES = {
  HOME: '/',
  LANDING: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAIL: (id: string) => `/restaurants/${id}`,
  BOOKING: {
    STEP1: '/booking/step1',
    STEP2: '/booking/step2',
    STEP3: '/booking/step3'
  },
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  SETTINGS: '/settings'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  GUEST_ID: 'guest_id',
  CHAT_HISTORY: 'chat_history'
};

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  MAX_PAGES: 10
};

// Chat
export const CHAT = {
  MAX_GUEST_MESSAGES: 3,
  MESSAGE_RETRY_ATTEMPTS: 3,
  MESSAGE_TIMEOUT_MS: 30000
};

// Restaurant Ratings
export const RATING_RANGES = {
  EXCELLENT: 4.5,
  GOOD: 3.5,
  AVERAGE: 2.5,
  POOR: 1.0
};

// Cuisine Types
export const CUISINES = [
  'Italian',
  'Seafood',
  'Sri Lankan',
  'Asian',
  'American',
  'Mediterranean',
  'Indian',
  'Thai',
  'Chinese'
];

// Price Ranges
export const PRICE_RANGES = [
  { label: '$', value: 1 },
  { label: '$$', value: 2 },
  { label: '$$$', value: 3 },
  { label: '$$$$', value: 4 }
];

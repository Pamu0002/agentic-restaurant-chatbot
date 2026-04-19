/**
 * TYPESCRIPT TYPES & INTERFACES
 * Shared types used across the application
 */

// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestUser {
  id: string;
  sessionId: string;
  messageCount: number;
  createdAt: Date;
  expiresAt: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'warning';
  content: string;
  timestamp: Date;
  userId?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  location: string;
  rating: number;
  price: number;
  image?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}

export interface RestaurantDetail extends Restaurant {
  reviews?: Review[];
  menu?: MenuItem[];
  amenities?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  restaurantId: string;
  date: Date;
  time: string;
  guestCount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

// Filter Types
export interface FilterOptions {
  cuisines: string[];
  rating: number;
  price: number;
  distance: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

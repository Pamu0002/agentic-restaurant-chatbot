/**
 * User Authentication Types
 * Shared across web, mobile, and backend
 * Uses custom Node.js backend with Google OAuth (no Firebase)
 */

export interface User {
  uid: string;
  userId?: string; // alias for uid
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  lastLogin?: string;
  preferences?: {
    cuisines?: string[];
    priceRange?: string;
    location?: string;
    notifications?: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  sessionToken: string;
  user: User;
  error?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

export type AuthStateListener = (user: User | null) => void;

/**
 * User Authentication Types
 * Shared across web, mobile, and backend
 * Uses custom Node.js backend with Google OAuth (no Firebase)
 */

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  lastLogin?: string;
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

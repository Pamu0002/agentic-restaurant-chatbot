/**
 * USER MODEL & INTERFACES
 * Production-grade user data structure and authentication types
 */

import { Timestamp } from 'firebase-admin/firestore';

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  ADMIN = 'admin',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  UNKNOWN = 'UNKNOWN',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * User Document (Firestore)
 */
export interface User {
  // Identity
  id: string; // Firebase UID
  email: string;
  displayName: string;
  photoURL?: string;

  // Authentication
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  isActive: boolean;

  // Contact
  phone?: string;
  address?: string;

  // Profile
  preferences?: {
    cuisine?: string[];
    priceRange?: string;
    location?: string;
    notifications?: boolean;
  };

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;

  // OAuth
  googleId?: string;
}

/**
 * Sign Up Request
 */
export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  role?: UserRole;
  preferences?: {
    cuisine?: string[];
    priceRange?: string;
    location?: string;
    notifications?: boolean;
  };
}

/**
 * Sign In Request
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Google OAuth Request
 */
export interface GoogleOAuthRequest {
  googleId: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  message?: string;
}

/**
 * Token Payload
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Session Data
 */
export interface Session {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Update User Request
 */
export interface UpdateUserRequest {
  displayName?: string;
  phone?: string;
  address?: string;
  bio?: string;
  photoURL?: string;
  preferences?: {
    cuisine?: string[];
    priceRange?: string;
    location?: string;
    notifications?: boolean;
  };
}

// ============================================================================
// ERRORS
// ============================================================================

export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    public statusCode: number = 400,
    message: string = type,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ============================================================================
// In-memory storage (for development only)
// ============================================================================

let users: Map<string, User> = new Map();

export function createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): User {
  const now = Timestamp.now();
  const user: User = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  };
  users.set(user.email, user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.get(email);
}

export function findUserById(id: string): User | undefined {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return undefined;
}

export function updateUser(userId: string, updates: Partial<User>): User | undefined {
  const user = findUserById(userId);
  if (!user) return undefined;
  
  const updated: User = {
    ...user,
    ...updates,
    updatedAt: Timestamp.now(),
  };
  users.set(updated.email, updated);
  return updated;
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}

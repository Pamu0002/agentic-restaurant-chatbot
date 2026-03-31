/**
 * GOOGLE AUTH SERVICE (NO FIREBASE)
 * 
 * This service handles authentication without Firebase.
 * Uses the custom Node.js API backend to verify Google tokens
 * and manage user sessions.
 */

import axios from 'axios';
import { User, AuthStateListener } from '../types/auth';

// API configuration
const API_URL = typeof window !== 'undefined' 
  ? `${window.location.origin}/api`
  : (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

let currentUser: User | null = null;
let sessionToken: string | null = typeof localStorage !== 'undefined' 
  ? localStorage.getItem('sessionToken') 
  : null;
let authUnsubscribers: Array<AuthStateListener> = [];

/**
 * Sign in with Google ID Token
 * Sends token to backend which verifies it with Google
 */
export const signInWithGoogle = async (googleIdToken: string): Promise<User> => {
  try {
    console.log('🔐 Sending token to backend for verification...');
    
    // Send token to our backend for verification
    const response = await axios.post(`${API_URL}/auth/google`, {
      idToken: googleIdToken,
    }, {
      withCredentials: true, // Include cookies
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Sign-in failed');
    }

    console.log('✅ Backend verified token, received session');
    
    const { sessionToken: token, user } = response.data;

    // Store session token
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sessionToken', token);
    }
    sessionToken = token;

    // Update current user
    const fullUser: User = {
      uid: user.id,
      email: user.email,
      displayName: user.name,
      photoURL: user.picture,
    };

    currentUser = fullUser;
    notifyAuthStateChange(fullUser);

    console.log('✅ Google sign-in successful!');
    return fullUser;

  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Google sign-in failed';
    console.error('❌ Error:', msg);
    throw new Error(msg);
  }
};

/**
 * Initialize Google OAuth
 * Generate Google OAuth URL
 */
export const initializeGoogleAuth = (): string => {
  const googleClientId = (typeof import !== 'undefined' && import.meta?.env?.VITE_GOOGLE_CLIENT_ID) as string || '';
  
  if (!googleClientId) {
    throw new Error('Google Client ID is not configured. Check VITE_GOOGLE_CLIENT_ID in .env.local');
  }
  
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/google-callback`;
  
  console.log(`🔐 Google OAuth URL Generator:
  Client ID: ${googleClientId}
  Redirect URI: ${redirectUri}
  `);
  
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'id_token token',
    scope: 'openid email profile',
    nonce: generateNonce(),
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('Generated Auth URL:', authUrl);
  return authUrl;
};

/**
 * Generate nonce for OAuth security
 */
const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  return sessionToken;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: AuthStateListener): (() => void) => {
  // Check if user is already logged in
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sessionToken') : null;
  
  if (token) {
    verifyToken(token)
      .then((user) => {
        if (user) {
          currentUser = user;
          callback(user);
        } else {
          callback(null);
        }
      })
      .catch(() => {
        currentUser = null;
        callback(null);
      });
  } else {
    callback(null);
  }

  // Add callback to subscribers
  authUnsubscribers.push(callback);

  // Return unsubscribe function
  return () => {
    authUnsubscribers = authUnsubscribers.filter((cb) => cb !== callback);
  };
};

/**
 * Notify all subscribers of auth state change
 */
const notifyAuthStateChange = (user: User | null): void => {
  authUnsubscribers.forEach((callback) => {
    callback(user);
  });
};

/**
 * Verify session token with backend
 */
export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify`, {
      sessionToken: token,
    }, {
      withCredentials: true,
    });

    if (!response.data.valid) {
      return null;
    }

    // Return minimal user info from verification
    const user: User = {
      uid: response.data.userId,
      email: response.data.email,
    };

    return user;
  } catch (error) {
    console.warn('Token verification failed:', error);
    return null;
  }
};

/**
 * Sign out user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    // Clear local storage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('sessionToken');
    }

    sessionToken = null;
    currentUser = null;

    // Notify subscribers
    notifyAuthStateChange(null);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return currentUser;
};

/**
 * Sign in with email and password (optional)
 * Not implemented yet - use Google sign-in instead
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  throw new Error('Email authentication not yet implemented. Use Google sign-in instead.');
};

/**
 * Sign up with email and password (optional)
 * Not implemented yet - use Google sign-in instead
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  throw new Error('Email registration not yet implemented. Use Google sign-in instead.');
};

/**
 * Update user profile
 * TODO: Add backend endpoint for profile updates
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<User>
): Promise<void> => {
  console.warn('Profile updates not yet implemented');
  // Would need to add backend endpoint
};

/**
 * Update user preferences
 * TODO: Add backend endpoint for preference updates
 */
export const updateUserPreferences = async (
  uid: string,
  preferences: Record<string, any>
): Promise<void> => {
  console.warn('Preference updates not yet implemented');
  // Would need to add backend endpoint
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid: string): Promise<User> => {
  return currentUser || { uid, email: '' };
};

/**
 * Refresh auth token
 */
export const refreshAuthToken = async (): Promise<string | null> => {
  if (!sessionToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      { sessionToken },
      { withCredentials: true }
    );

    if (!response.data.success) {
      throw new Error('Token refresh failed');
    }

    sessionToken = response.data.sessionToken;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sessionToken', sessionToken);
    }

    return sessionToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await signOutUser();
    return null;
  }
};

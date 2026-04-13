/**
 * GOOGLE AUTH SERVICE (NO FIREBASE)
 * 
 * This service handles authentication without Firebase.
 * Uses the custom Node.js API backend to verify Google tokens
 * and manage user sessions.
 */

import axios from 'axios';
import { AuthStateListener, User } from '../types/auth';

// API configuration - Use relative path for Vite proxy
const API_URL = '/api';

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
    console.log('🔐 [signInWithGoogle] Starting Google sign-in');
    console.log('API URL:', API_URL);
    console.log('Token length:', googleIdToken.length);
    
    // Send token to our backend for verification
    console.log('📤 POSTing to /auth/google endpoint...');
    const response = await axios.post(`${API_URL}/auth/google`, {
      idToken: googleIdToken,
    }, {
      withCredentials: true, // Include cookies
      timeout: 10000, // 10 second timeout
    });

    console.log('✅ Got response from backend');
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));

    if (!response.data.success) {
      const errorMsg = response.data.message || response.data.error || 'Backend said: not success';
      console.error('❌ Backend returned success: false -', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('✅ Backend confirmed success: true');
    
    // Extract token and user data from response
    // Backend returns: { success: true, sessionToken, data: { accessToken, user } }
    const sessionTokenFromResponse = response.data.sessionToken;
    const dataFromResponse = response.data.data;
    
    console.log('sessionToken from response:', !!sessionTokenFromResponse);
    console.log('data from response:', !!dataFromResponse);
    
    if (!dataFromResponse || !dataFromResponse.user) {
      console.error('❌ Response missing data or user:', dataFromResponse);
      throw new Error('Backend response missing user data');
    }
    
    const userFromResponse = dataFromResponse.user;
    console.log('✅ User from backend:', { id: userFromResponse.id, email: userFromResponse.email });

    // Store session token
    console.log('💾 Storing session token in localStorage...');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sessionToken', sessionTokenFromResponse);
      console.log('✅ Session token stored');
    }
    sessionToken = sessionTokenFromResponse;

    // Update current user
    const fullUser: User = {
      uid: userFromResponse.id || userFromResponse.uid,
      email: userFromResponse.email,
      displayName: userFromResponse.displayName || userFromResponse.name || 'User',
      photoURL: userFromResponse.photoURL || userFromResponse.picture,
    };

    console.log('📝 Setting current user and notifying listeners...');
    currentUser = fullUser;
    notifyAuthStateChange(fullUser);

    console.log('✅ Google sign-in COMPLETE!');
    return fullUser;

  } catch (error: any) {
    console.error('❌ [signInWithGoogle] FAILED:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Request:', error.request);
    } else {
      console.error('Error:', error);
    }
    
    const msg = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'Google sign-in failed';
    
    throw new Error(msg);
  }
};

/**
 * Initialize Google OAuth
 * Generate Google OAuth URL
 */
export const initializeGoogleAuth = (): string => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string || '';
  
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
  
  console.log('🔍 onAuthChange called, token exists:', !!token);
  
  if (token) {
    console.log('🔐 Token found, verifying...');
    verifyToken(token)
      .then((user) => {
        console.log('✅ Verification result:', user);
        if (user) {
          currentUser = user;
          console.log('📝 Calling callback with user:', user);
          callback(user);
        } else {
          console.warn('⚠️  Verification returned null user');
          callback(null);
        }
      })
      .catch((err) => {
        console.error('❌ Verification error:', err);
        currentUser = null;
        callback(null);
      });
  } else {
    console.log('⚠️  No token found, calling callback(null)');
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
    console.log('🔍 Verifying token with backend...');
    console.log('Token length:', token.length, 'chars');
    
    const response = await axios.post(`${API_URL}/auth/verify`, {
      sessionToken: token,
    }, {
      withCredentials: true,
      timeout: 5000,
    });

    console.log('✅ Token verification response:', response.status);
    console.log('Response data:', { valid: response.data.valid, userId: response.data.userId });

    if (!response.data.valid) {
      console.warn('❌ Backend says token is invalid');
      return null;
    }

    // Return minimal user info from verification
    const user: User = {
      uid: response.data.userId || response.data.data?.userId,
      email: response.data.email || response.data.data?.email,
    };

    console.log('✅ User from token verification:', user);
    return user;
  } catch (error: any) {
    console.error('❌ Token verification failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return null;
  }
};

/**
 * Sign out user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    console.log('🚪 Signing out user...');
    
    // Clear all authentication related data from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('rememberEmail');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('✅ Cleared all auth tokens from localStorage');
    }

    sessionToken = null;
    currentUser = null;

    // Notify subscribers
    notifyAuthStateChange(null);
    console.log('✅ User signed out successfully');
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
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    console.log('🔐 [signInWithEmail] Starting email sign-in');
    
    const API_URL = typeof window !== 'undefined' ? 'http://localhost:5000/api' : (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
    
    const response = await axios.post(
      `${API_URL}/auth/signin`,
      {
        email: email.toLowerCase(),
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    console.log('✅ Email sign-in successful');
    
    if (response.data.success && response.data.data) {
      const userData: User = {
        uid: response.data.data.user.id || response.data.data.user.uid,
        email: response.data.data.user.email,
        displayName: response.data.data.user.displayName,
        photoURL: response.data.data.user.photoURL,
      };

      // Store token
      if (response.data.data.accessToken) {
        localStorage.setItem('sessionToken', response.data.data.accessToken);
      }

      return userData;
    }

    throw new Error(response.data.message || 'Email sign-in failed');
  } catch (error: any) {
    console.error('❌ Email sign-in failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'Email sign-in failed');
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    console.log('📝 [signUpWithEmail] Starting email sign-up');
    
    const API_URL = typeof window !== 'undefined' ? 'http://localhost:5000/api' : (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
    
    const response = await axios.post(
      `${API_URL}/auth/signup`,
      {
        email: email.toLowerCase(),
        password,
        displayName: name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    console.log('✅ Email sign-up successful');
    
    if (response.data.success && response.data.data) {
      const userData: User = {
        uid: response.data.data.user.id || response.data.data.user.uid,
        email: response.data.data.user.email,
        displayName: response.data.data.user.displayName,
        photoURL: response.data.data.user.photoURL,
      };

      // Store token
      if (response.data.data.accessToken) {
        localStorage.setItem('sessionToken', response.data.data.accessToken);
      }

      return userData;
    }

    throw new Error(response.data.message || 'Email sign-up failed');
  } catch (error: any) {
    console.error('❌ Email sign-up failed:', error);
    throw new Error(error.response?.data?.message || error.message || 'Email sign-up failed');
  }
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

    if (typeof localStorage !== 'undefined' && sessionToken) {
      localStorage.setItem('sessionToken', sessionToken);
    }

    return sessionToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await signOutUser();
    return null;
  }
};

/**
 * AUTH CONTEXT
 * Shared across web and mobile apps
 * 
 * Manages user authentication state
 * Uses custom Node.js backend (no Firebase)
 */

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  onAuthChange,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  updateUserPreferences,
  updateUserProfile,
} from '../services/firebaseService';
import { User } from '../types/auth';

// Extended User type for local context with preferences
export interface AuthUser extends User {
  preferences?: {
    cuisines?: string[];
    priceRange?: string;
    location?: string;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  signup: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: Partial<AuthUser>) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser: User | null) => {
      try {
        if (authUser) {
          // User is logged in
          setUser({
            ...authUser,
            preferences: {
              cuisines: [],
              priceRange: 'moderate',
              location: '',
            },
          });
        } else {
          // User is logged out
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Attempting login for', email);
      const result = await signInWithEmail(email, password);
      console.log('AuthContext: Login successful');
      
      setUser({
        ...result,
        preferences: {
          cuisines: [],
          priceRange: 'moderate',
          location: '',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      console.error('AuthContext: Login error:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('AuthContext: loginWithGoogle called');
      const result = await signInWithGoogle(token);
      console.log('AuthContext: Google login successful');
      
      setUser({
        ...result,
        preferences: {
          cuisines: [],
          priceRange: 'moderate',
          location: '',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      console.error('AuthContext: Google login error:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (displayName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Attempting signup for', email);
      const result = await signUpWithEmail(email, password, displayName);
      console.log('AuthContext: Signup successful');
      
      setUser({
        ...result,
        preferences: {
          cuisines: [],
          priceRange: 'moderate',
          location: '',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      console.error('AuthContext: Signup error:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOutUser();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedUser: Partial<AuthUser>) => {
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      
      await updateUserProfile(user.uid, {
        displayName: updatedUser.displayName,
      });
      
      setUser((prev) => prev ? { ...prev, ...updatedUser } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      throw err;
    }
  };

  const updatePreferences = async (preferences: any) => {
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      
      await updateUserPreferences(user.uid, preferences);
      
      setUser((prev) => prev ? {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences,
        },
      } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Preferences update failed';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: Boolean(user),
        login,
        loginWithGoogle,
        signup,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

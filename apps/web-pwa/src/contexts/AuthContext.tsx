/**
 * AUTH CONTEXT
 * 
 * Manages user authentication state across the entire app
 * Connected to Firebase for real authentication
 */

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  onAuthChange,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  updateUserPreferences,
  updateUserProfile,
} from '../services/firebaseService';

export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: {
    cuisines: string[];
    priceRange: string;
    location: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: User) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is logged in - convert Firebase User to our User format
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
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
      const result = await signInWithEmail(email, password);
      
      // Convert Firebase User to our User format
      setUser({
        id: result.uid,
        name: result.displayName || email.split('@')[0],
        email: result.email,
        preferences: {
          cuisines: [],
          priceRange: 'moderate',
          location: '',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signUpWithEmail(email, password, name);
      
      // User profile is created automatically in signUpWithEmail
      setUser({
        id: result.uid,
        name: name,
        email: email,
        preferences: {
          cuisines: [],
          priceRange: 'moderate',
          location: '',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
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

  const updateProfile = async (updatedUser: User) => {
    setError(null);
    try {
      await updateUserProfile(updatedUser.id, {
        name: updatedUser.name,
      });
      
      setUser(updatedUser);
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
      
      await updateUserPreferences(user.id, preferences);
      
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
        },
      });
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

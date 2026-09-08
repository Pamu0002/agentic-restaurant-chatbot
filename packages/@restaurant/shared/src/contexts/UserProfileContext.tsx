/**
 * User Profile Context
 * Manages user profile state, favorites, bookings, and preferences
 * Provides hooks for accessing and updating profile data
 */

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { userProfileService } from '../services/userProfileService';
import { Booking, FavoriteRestaurant, UserPreferences, UserProfile } from '../types/profile';
import { useAuth } from './AuthContext';

export interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Profile operations
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  
  // Favorite operations
  favorites: FavoriteRestaurant[];
  addFavorite: (restaurant: FavoriteRestaurant) => Promise<boolean>;
  removeFavorite: (restaurantId: string) => Promise<boolean>;
  isFavorite: (restaurantId: string) => boolean;
  
  // Booking operations
  bookings: Booking[];
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  createBooking: (booking: Booking) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => Promise<boolean>;
  addReview: (bookingId: string, rating: number, review: string) => Promise<boolean>;
  
  // Utility
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile when user changes
  useEffect(() => {
    if (user?.uid) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user?.uid]);

  const refreshProfile = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      let userProfile = await userProfileService.getUserProfile(user.uid);
      
      // If profile doesn't exist, create a default one
      if (!userProfile) {
        userProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || null,
          phone: '',
          bio: '',
          joinedAt: new Date().toISOString(),
          totalBookings: 0,
          averageRating: 0,
          favorites: [],
          bookings: [],
          preferences: {
            dietaryRestrictions: [],
            cuisinePreferences: [],
            priceRange: 'moderate',
            ambiance: [],
          },
        };
      }
      
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      console.error('Profile error:', err);
      // Create a default profile on error
      if (user?.uid) {
        setProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || null,
          phone: '',
          bio: '',
          joinedAt: new Date().toISOString(),
          totalBookings: 0,
          averageRating: 0,
          favorites: [],
          bookings: [],
          preferences: {
            dietaryRestrictions: [],
            cuisinePreferences: [],
            priceRange: 'moderate',
            ambiance: [],
          },
        });
        setError(null);
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.uid) return false;
    try {
      const success = await userProfileService.updateProfile(user.uid, updates);
      if (success) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }
      return success;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user?.uid || !profile) return false;
    try {
      const success = await userProfileService.updatePreferences(user.uid, preferences);
      if (success) {
        setProfile({
          ...profile,
          preferences: { ...profile.preferences, ...preferences },
        });
      }
      return success;
    } catch (err) {
      console.error('Error updating preferences:', err);
      return false;
    }
  };

  const addFavorite = async (restaurant: FavoriteRestaurant) => {
    if (!user?.uid) return false;
    try {
      const success = await userProfileService.addFavorite(user.uid, restaurant);
      if (success && profile) {
        setProfile({
          ...profile,
          favorites: [...profile.favorites, restaurant],
        });
      }
      return success;
    } catch (err) {
      console.error('Error adding favorite:', err);
      return false;
    }
  };

  const removeFavorite = async (restaurantId: string) => {
    if (!user?.uid) return false;
    try {
      const success = await userProfileService.removeFavorite(user.uid, restaurantId);
      if (success && profile) {
        setProfile({
          ...profile,
          favorites: profile.favorites.filter(f => f.restaurantId !== restaurantId),
        });
      }
      return success;
    } catch (err) {
      console.error('Error removing favorite:', err);
      return false;
    }
  };

  const isFavorite = (restaurantId: string) => {
    return profile?.favorites.some(f => f.restaurantId === restaurantId) ?? false;
  };

  const createBooking = async (booking: Booking) => {
    if (!user?.uid) return false;
    try {
      const newBooking = await userProfileService.createBooking(user.uid, booking);
      if (newBooking && profile) {
        setProfile({
          ...profile,
          bookings: [...profile.bookings, newBooking],
          totalBookings: profile.totalBookings + 1,
        });
      }
      return !!newBooking;
    } catch (err) {
      console.error('Error creating booking:', err);
      return false;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!user?.uid) return false;
    try {
      const success = await userProfileService.cancelBooking(user.uid, bookingId);
      if (success && profile) {
        setProfile({
          ...profile,
          bookings: profile.bookings.map(b =>
            b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b
          ),
        });
      }
      return success;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      return false;
    }
  };

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    if (!user?.uid) return false;
    try {
      const success = await userProfileService.updateBooking(user.uid, bookingId, updates);
      if (success && profile) {
        setProfile({
          ...profile,
          bookings: profile.bookings.map(b =>
            b.bookingId === bookingId ? { ...b, ...updates } : b
          ),
        });
      }
      return success;
    } catch (err) {
      console.error('Error updating booking:', err);
      return false;
    }
  };

  const addReview = async (bookingId: string, rating: number, review: string) => {
    if (!user?.uid) return false;
    try {
      const success = await userProfileService.addReview(user.uid, bookingId, rating, review);
      if (success && profile) {
        setProfile({
          ...profile,
          bookings: profile.bookings.map(b =>
            b.bookingId === bookingId ? { ...b, rating, review } : b
          ),
        });
      }
      return success;
    } catch (err) {
      console.error('Error adding review:', err);
      return false;
    }
  };

  // Sort bookings by date
  const upcomingBookings = profile?.bookings.filter(b => 
    new Date(b.date) > new Date() && b.status === 'confirmed'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) ?? [];

  const pastBookings = profile?.bookings.filter(b => 
    new Date(b.date) <= new Date() || b.status === 'completed'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ?? [];

  const value: UserProfileContextType = {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    favorites: profile?.favorites ?? [],
    addFavorite,
    removeFavorite,
    isFavorite,
    bookings: profile?.bookings ?? [],
    upcomingBookings,
    pastBookings,
    createBooking,
    cancelBooking,
    updateBooking,
    addReview,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}

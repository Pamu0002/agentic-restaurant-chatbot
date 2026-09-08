/**
 * User Profile Service
 * Handles all user profile data operations
 * Interfaces with Firebase Firestore for data persistence
 */

import { Booking, FavoriteRestaurant, UserPreferences, UserProfile } from '../types/profile';

class UserProfileService {
  private baseUrl = '/api/auth';

  /**
   * Get access token from localStorage
   */
  private getAccessToken(): string {
    const token = typeof localStorage !== 'undefined' 
      ? localStorage.getItem('sessionToken')
      : null;
    if (!token) {
      console.error('❌ No access token found in localStorage');
      console.log('Available keys:', Object.keys(localStorage || {}));
      throw new Error('No access token found');
    }
    console.log(`✅ Token retrieved (length: ${token.length})`);
    console.log(`📝 Token starts with: ${token.substring(0, 30)}...`);
    return token;
  }

  /**
   * Fetch user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const accessToken = this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to fetch profile:', response.status);
        return null;
      }
      const data = await response.json();
      console.log('Profile fetched:', data);
      return data.data || data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      console.log('💾 Starting preference update...');
      const accessToken = this.getAccessToken();
      console.log(`🔐 Authorization: Bearer ${accessToken.substring(0, 20)}...`);
      
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ preferences }),
      });

      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error updating preferences:', response.status, errorData);
        throw new Error(`Failed to update preferences: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Preferences updated successfully:', data);
      return true;
    } catch (error) {
      console.error('❌ Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const accessToken = this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating profile:', response.status, errorData);
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  /**
   * Add restaurant to favorites
   */
  async addFavorite(userId: string, restaurant: FavoriteRestaurant): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant),
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  }

  /**
   * Remove restaurant from favorites
   */
  async removeFavorite(userId: string, restaurantId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/favorites/${restaurantId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }

  /**
   * Get user's favorite restaurants
   */
  async getFavorites(userId: string): Promise<FavoriteRestaurant[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/favorites`);
      if (!response.ok) throw new Error('Failed to fetch favorites');
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  /**
   * Create a booking
   */
  async createBooking(userId: string, booking: Booking): Promise<Booking | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }

  /**
   * Get user's bookings history
   */
  async getBookings(userId: string, filter?: 'upcoming' | 'past' | 'cancelled'): Promise<Booking[]> {
    try {
      const url = filter ? `${this.baseUrl}/${userId}/bookings?status=${filter}` : `${this.baseUrl}/${userId}/bookings`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(userId: string, bookingId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
  }

  /**
   * Update booking (reschedule)
   */
  async updateBooking(userId: string, bookingId: string, updates: Partial<Booking>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating booking:', error);
      return false;
    }
  }

  /**
   * Add review to a booking
   */
  async addReview(userId: string, bookingId: string, rating: number, review: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const accessToken = this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          displayName: updates.displayName,
          phone: updates.phone,
          bio: updates.bio,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }
}

export const userProfileService = new UserProfileService();

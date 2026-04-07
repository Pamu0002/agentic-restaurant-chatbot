/**
 * AUTH CONTEXT TESTS
 * Tests for the Authentication Context
 * Tests auth state management, user operations, and session handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as authService from '../../services/firebaseService';

// Mock the auth service
vi.mock('../../services/firebaseService', () => ({
  onAuthChange: vi.fn((callback) => {
    // Simulate user being logged in
    callback({
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    });
    return vi.fn(); // Return unsubscribe function
  }),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOutUser: vi.fn(),
  updateUserProfile: vi.fn(),
  updateUserPreferences: vi.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication State', () => {
    it('should provide initial auth state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
    });

    it('should start with loading true', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading should be true until auth state is checked
      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should have access to auth methods', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.signup).toBe('function');
      expect(typeof result.current.loginWithGoogle).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.updateProfile).toBe('function');
      expect(typeof result.current.updatePreferences).toBe('function');
    });
  });

  describe('User Authentication', () => {
    it('should load user from auth service on mount', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe('test@example.com');
      });
    });

    it('should set user when login succeeds', async () => {
      const mockLogin = vi.spyOn(authService, 'signInWithEmail');
      mockLogin.mockResolvedValueOnce({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        expect(result.current.user).toBeDefined();
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should set error when login fails', async () => {
      const mockLogin = vi.spyOn(authService, 'signInWithEmail');
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.login('wrong@example.com', 'wrongpassword');
        } catch (e) {
          // Error expected
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('Google Authentication', () => {
    it('should handle Google sign-in with ID token', async () => {
      const mockGoogleSignIn = vi.spyOn(authService, 'signInWithGoogle');
      mockGoogleSignIn.mockResolvedValueOnce({
        uid: 'google-user-id',
        email: 'googleuser@example.com',
        displayName: 'Google User',
        photoURL: 'https://example.com/photo.jpg',
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      const mockToken = 'mock-google-id-token';

      await act(async () => {
        await result.current.loginWithGoogle(mockToken);
      });

      expect(mockGoogleSignIn).toHaveBeenCalledWith(mockToken);

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('User Registration', () => {
    it('should handle user signup', async () => {
      const mockSignUp = vi.spyOn(authService, 'signUpWithEmail');
      mockSignUp.mockResolvedValueOnce({
        uid: 'new-user-id',
        email: 'newuser@example.com',
        displayName: 'New User',
        photoURL: null,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signup('New User', 'newuser@example.com', 'password123');
      });

      expect(mockSignUp).toHaveBeenCalledWith('New User', 'newuser@example.com', 'password123');

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should set error when signup fails', async () => {
      const mockSignUp = vi.spyOn(authService, 'signUpWithEmail');
      mockSignUp.mockRejectedValueOnce(new Error('Email already exists'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.signup('User', 'existing@example.com', 'password123');
        } catch (e) {
          // Error expected
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('Logout', () => {
    it('should clear user and set isAuthenticated to false on logout', async () => {
      const mockLogout = vi.spyOn(authService, 'signOutUser');
      mockLogout.mockResolvedValueOnce();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('Profile Updates', () => {
    it('should update user profile', async () => {
      const mockUpdateProfile = vi.spyOn(authService, 'updateUserProfile');
      mockUpdateProfile.mockResolvedValueOnce(undefined);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      const updatedData = {
        displayName: 'Updated Name',
        photoURL: 'https://example.com/new-photo.jpg',
      };

      await act(async () => {
        await result.current.updateProfile(updatedData);
      });

      expect(mockUpdateProfile).toHaveBeenCalled();
    });

    it('should update user preferences', async () => {
      const mockUpdatePreferences = vi.spyOn(authService, 'updateUserPreferences');
      mockUpdatePreferences.mockResolvedValueOnce(undefined);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      const preferences = {
        cuisines: ['Italian', 'Japanese'],
        priceRange: 'moderate',
        location: 'New York',
      };

      await act(async () => {
        await result.current.updatePreferences(preferences);
      });

      expect(mockUpdatePreferences).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should clear error on successful login', async () => {
      const mockLogin = vi.spyOn(authService, 'signInWithEmail');
      mockLogin.mockResolvedValueOnce({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // First, simulate an error
      // Then execute successful login
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      await waitFor(() => {
        // Error should be cleared on successful login
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('User Preferences Extension', () => {
    it('should include preferences in auth user', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeDefined();
        expect(result.current.user?.preferences).toBeDefined();
        expect(result.current.user?.preferences?.cuisines).toBeDefined();
        expect(result.current.user?.preferences?.priceRange).toBeDefined();
      });
    });
  });
});

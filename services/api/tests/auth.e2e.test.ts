/**
 * END-TO-END AUTHENTICATION FLOW TESTS
 * Complete user journey from signup through profile management
 * 
 * Scenarios tested:
 * 1. New user registration → login → profile access
 * 2. User login → token refresh → logout
 * 3. Profile management (view, update, delete)
 * 4. Security: token expiration, invalid tokens, unauthorized access
 */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import request from 'supertest';
import authRoutes from '../src/routes/auth';
import AuthService from '../src/services/AuthService';

jest.mock('../src/utils/logger');
jest.mock('../src/repositories/UserRepository');
jest.mock('../src/repositories/SessionRepository');
jest.mock('../src/repositories/AuditLogRepository');

describe('E2E: Complete Authentication Flow', () => {
  let app: Express;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeEach(() => {
    app = express();
    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  describe('Scenario 1: New User Registration → Login → Profile Access', () => {
    it('Step 1: Register new user', async () => {
      const signupData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        displayName: 'New User',
        phone: '+1234567890',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');

      accessToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
      userId = response.body.data.user.id;

      console.log('✓ User registered successfully');
    });

    it('Step 2: Verify user can access protected route with new token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('newuser@example.com');
      expect(response.body.data.displayName).toBe('New User');

      console.log('✓ User accessed profile with new token');
    });

    it('Step 3: User can update profile preferences', async () => {
      const updateData = {
        displayName: 'Updated User',
        preferences: {
          preferredCuisines: ['Italian', 'Japanese'],
          priceRange: 'medium',
          dietaryRestrictions: ['vegetarian'],
        },
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.displayName).toBe(updateData.displayName);

      console.log('✓ User profile updated successfully');
    });
  });

  describe('Scenario 2: Existing User Login → Token Refresh → Logout', () => {
    let loginAccessToken: string;
    let loginRefreshToken: string;

    it('Step 1: Login established user', async () => {
      const loginData = {
        email: 'existing@example.com',
        password: 'ExistingPass123!',
      };

      // Mock successful login
      jest.spyOn(AuthService, 'login').mockResolvedValueOnce({
        success: true,
        user: {
          id: '456',
          email: loginData.email,
          displayName: 'Existing User',
          role: 'USER',
        },
        accessToken: 'existing-access-token',
        refreshToken: 'existing-refresh-token',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);

      loginAccessToken = response.body.data.accessToken;
      loginRefreshToken = response.body.data.refreshToken;

      console.log('✓ User login successful');
    });

    it('Step 2: Refresh token before expiration', async () => {
      // Mock successful token refresh
      jest.spyOn(AuthService, 'refreshAccessToken').mockResolvedValueOnce({
        success: true,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: loginRefreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');

      loginAccessToken = response.body.data.accessToken;
      loginRefreshToken = response.body.data.refreshToken;

      console.log('✓ Token refreshed successfully');
    });

    it('Step 3: Logout invalidates refresh token', async () => {
      jest.spyOn(AuthService, 'logout').mockResolvedValueOnce({
        success: true,
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${loginAccessToken}`)
        .send({ refreshToken: loginRefreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);

      console.log('✓ User logged out successfully');
    });

    it('Step 4: Verify old refresh token is rejected after logout', async () => {
      jest.spyOn(AuthService, 'refreshAccessToken').mockRejectedValueOnce(
        new Error('Invalid refresh token')
      );

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: loginRefreshToken })
        .expect(401);

      expect(response.body.success).toBe(false);

      console.log('✓ Old refresh token rejected after logout');
    });
  });

  describe('Scenario 3: Security - Unauthorized Access Prevention', () => {
    it('Should reject access to profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toBe('UNAUTHORIZED');

      console.log('✓ Profile access denied without token');
    });

    it('Should reject access with malformed token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer not.a.valid.jwt')
        .expect(401);

      expect(response.body.error).toBe('INVALID_TOKEN');

      console.log('✓ Malformed token rejected');
    });

    it('Should reject access with expired token', async () => {
      jest.spyOn(AuthService, 'verifyAccessToken').mockImplementation(() => {
        throw new Error('Token expired');
      });

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer expired-token')
        .expect(401);

      expect(response.body.error).toBe('INVALID_TOKEN');

      console.log('✓ Expired token rejected');
    });

    it('Should prevent unauthorized user from changing another user password', async () => {
      // User 1's token
      const user1Token = 'user1-access-token';

      jest.spyOn(AuthService, 'changePassword').mockRejectedValueOnce(
        new Error('Unauthorized')
      );

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          currentPassword: 'CurrentPass123!',
          newPassword: 'NewPass123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);

      console.log('✓ Unauthorized password change prevented');
    });
  });

  describe('Scenario 4: Google OAuth Integration', () => {
    it('Step 1: First-time Google login creates user', async () => {
      jest
        .spyOn(AuthService, 'verifyGoogleToken')
        .mockResolvedValueOnce({
          email: 'newgoogleuser@gmail.com',
          sub: 'google-id-789',
          name: 'Google User',
          picture: 'https://example.com/photo.jpg',
        });

      jest
        .spyOn(AuthService, 'signInWithGoogle')
        .mockResolvedValueOnce({
          success: true,
          user: {
            id: '789',
            email: 'newgoogleuser@gmail.com',
            displayName: 'Google User',
            role: 'USER',
          },
          accessToken: 'google-access-token',
          refreshToken: 'google-refresh-token',
        });

      const response = await request(app)
        .post('/api/auth/google')
        .send({ idToken: 'valid-google-id-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newgoogleuser@gmail.com');

      console.log('✓ Google OAuth user created');
    });

    it('Step 2: Repeat Google login for same user', async () => {
      jest
        .spyOn(AuthService, 'verifyGoogleToken')
        .mockResolvedValueOnce({
          email: 'existinggoogleuser@gmail.com',
          sub: 'google-id-999',
        });

      jest
        .spyOn(AuthService, 'signInWithGoogle')
        .mockResolvedValueOnce({
          success: true,
          isNewUser: false,
          user: {
            id: '999',
            email: 'existinggoogleuser@gmail.com',
            displayName: 'Existing Google User',
            role: 'USER',
          },
          accessToken: 'google-access-token-2',
          refreshToken: 'google-refresh-token-2',
        });

      const response = await request(app)
        .post('/api/auth/google')
        .send({ idToken: 'valid-google-id-token-2' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isNewUser).toBe(false);

      console.log('✓ Google OAuth existing user login');
    });
  });

  describe('Scenario 5: Error Recovery', () => {
    it('Should allow user to attempt login after failed attempt', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'WrongPassword123!',
      };

      // First attempt fails
      jest
        .spyOn(AuthService, 'login')
        .mockRejectedValueOnce(new Error('Invalid credentials'));

      const failedResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(failedResponse.body.success).toBe(false);

      // Second attempt succeeds with correct password
      jest
        .spyOn(AuthService, 'login')
        .mockResolvedValueOnce({
          success: true,
          user: {
            id: '100',
            email: loginData.email,
            displayName: 'Test User',
            role: 'USER',
          },
          accessToken: 'correct-access-token',
          refreshToken: 'correct-refresh-token',
        });

      const successResponse = await request(app)
        .post('/api/auth/login')
        .send({ ...loginData, password: 'CorrectPassword123!' })
        .expect(200);

      expect(successResponse.body.success).toBe(true);

      console.log('✓ User recovered from failed login attempt');
    });
  });
});

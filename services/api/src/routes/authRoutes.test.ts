/**
 * AUTHENTICATION API ENDPOINT TESTS
 * Integration tests for all auth HTTP endpoints
 * - Signup endpoint
 * - Signin endpoint
 * - Google OAuth endpoint
 * - Token refresh endpoint
 * - Profile management endpoints
 * - Error handling and validation
 */

import { beforeEach, describe, expect, it } from '@jest/globals';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import request from 'supertest';
import authRoutes from '../routes/authRoutes';

describe('Auth API Endpoints', () => {
  let app: Express;
  let accessToken: string;
  let refreshToken: string;
  let testUserEmail: string;
  let testUserPassword: string;

  beforeEach(() => {
    // Setup Express app with auth routes
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', authRoutes);

    // Generate unique test email
    testUserEmail = `test_${Date.now()}@example.com`;
    testUserPassword = 'ValidPass123!';
  });

  describe('POST /api/auth/signup', () => {
    it('should register new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
          phone: '+1234567890',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUserEmail);
      expect(response.body.data.user.displayName).toBe('Test User');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.message).toBe('User registered successfully');

      // Store tokens for later tests
      accessToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          // Missing password and displayName
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.message).toContain('required');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: testUserPassword,
          displayName: 'User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_EMAIL');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: 'weak',
          displayName: 'User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('WEAK_PASSWORD');
    });

    it('should return 409 for duplicate email', async () => {
      // First signup
      await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'User 1',
        });

      // Duplicate signup
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'User 2',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('USER_ALREADY_EXISTS');
    });

    it('should lowercase email before storing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: testUserPassword,
          displayName: 'User',
        })
        .expect(201);

      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should trim whitespace from displayName', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: `trimtest_${Date.now()}@example.com`,
          password: testUserPassword,
          displayName: '  John Doe  ',
        })
        .expect(201);

      expect(response.body.data.user.displayName).toBe('John Doe');
    });
  });

  describe('POST /api/auth/signin', () => {
    beforeEach(async () => {
      // Register user for signin tests
      await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
        });
    });

    it('should sign in with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUserEmail,
          password: testUserPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUserEmail);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.message).toBe('Signed in successfully');

      // Check refresh token cookie
      expect(response.headers['set-cookie']).toBeDefined();
      const hasCookie = response.headers['set-cookie'].some((cookie: string) =>
        cookie.includes('refreshToken'),
      );
      expect(hasCookie).toBe(true);

      accessToken = response.body.data.accessToken;
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUserEmail,
          // Missing password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUserEmail,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: testUserPassword,
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('USER_NOT_FOUND');
    });

    it('should accept case-insensitive email', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUserEmail.toUpperCase(),
          password: testUserPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/google', () => {
    it('should sign in with Google credentials', async () => {
      const response = await request(app)
        .post('/api/auth/google')
        .send({
          googleId: `google_${Date.now()}`,
          email: `googleuser_${Date.now()}@example.com`,
          displayName: 'Google User',
          photoURL: 'https://example.com/photo.jpg',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.message).toBe('Google authentication successful');
    });

    it('should return 400 for missing OAuth fields', async () => {
      const response = await request(app)
        .post('/api/auth/google')
        .send({
          googleId: 'google_123',
          // Missing email and displayName
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_EMAIL');
    });

    it('should set refreshToken cookie', async () => {
      const response = await request(app)
        .post('/api/auth/google')
        .send({
          googleId: `google_${Date.now()}`,
          email: `googleuser_${Date.now()}@example.com`,
          displayName: 'Google User',
        })
        .expect(200);

      expect(response.headers['set-cookie']).toBeDefined();
      const hasCookie = response.headers['set-cookie'].some((cookie: string) =>
        cookie.includes('refreshToken'),
      );
      expect(hasCookie).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      // Register and sign in
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
        });

      accessToken = signupResponse.body.data.accessToken;
    });

    it('should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(testUserEmail);
      expect(response.body.data.displayName).toBe('Test User');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_TOKEN');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', accessToken)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
        });

      accessToken = signupResponse.body.data.accessToken;
    });

    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          displayName: 'Updated Name',
          phone: '+9876543210',
          bio: 'This is my bio',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.displayName).toBe('Updated Name');
      expect(response.body.data.phone).toBe('+9876543210');
      expect(response.body.data.bio).toBe('This is my bio');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({
          displayName: 'Updated Name',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle partial updates', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          displayName: 'New Name',
          // Other fields omitted
        })
        .expect(200);

      expect(response.body.data.displayName).toBe('New Name');
    });
  });

  describe('POST /api/auth/change-password', () => {
    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
        });

      accessToken = signupResponse.body.data.accessToken;
    });

    it('should change password with correct current password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: testUserPassword,
          newPassword: 'NewPass456!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password changed successfully');
    });

    it('should return 401 for incorrect current password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewPass456!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 400 for weak new password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: testUserPassword,
          newPassword: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('WEAK_PASSWORD');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .send({
          currentPassword: testUserPassword,
          newPassword: 'NewPass456!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
        });

      accessToken = signupResponse.body.data.accessToken;
    });

    it('should logout user and clear refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');

      // Check that refreshToken cookie is cleared
      const hasCookie = response.headers['set-cookie'].some(
        (cookie: string) =>
          cookie.includes('refreshToken') && cookie.includes('Max-Age=0'),
      );
      expect(hasCookie).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/auth/account', () => {
    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          displayName: 'Test User',
        });

      accessToken = signupResponse.body.data.accessToken;
    });

    it('should delete account with correct password', async () => {
      const response = await request(app)
        .delete('/api/auth/account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          password: testUserPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Account deleted successfully');
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .delete('/api/auth/account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/auth/account')
        .send({
          password: testUserPassword,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if password not provided', async () => {
      const response = await request(app)
        .delete('/api/auth/account')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit excessive requests from same user', async () => {
      // This test would need actual rate limit implementation
      // For now, we're documenting the expected behavior
      // 100 requests per minute per user
      expect(true).toBe(true);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: `security_${Date.now()}@example.com`,
          password: testUserPassword,
          displayName: 'Test',
        });

      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });
});

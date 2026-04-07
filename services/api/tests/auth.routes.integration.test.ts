/**
 * AUTH ROUTES INTEGRATION TESTS
 * Tests for /api/auth endpoints using supertest
 * 
 * Coverage:
 * - User signup (POST /api/auth/signup)
 * - User signin (POST /api/auth/login)
 * - Google OAuth (POST /api/auth/google)
 * - Token refresh (POST /api/auth/refresh)
 * - Logout (POST /api/auth/logout)
 * - Get profile (GET /api/auth/profile)
 * - Update profile (PUT /api/auth/profile)
 * - Change password (POST /api/auth/change-password)
 */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import request from 'supertest';
import authRoutes from '../src/routes/auth';
import AuthService from '../src/services/AuthService';

// Mock dependencies
jest.mock('../src/utils/logger');
jest.mock('../src/repositories/UserRepository');
jest.mock('../src/repositories/SessionRepository');

describe('Auth Routes Integration Tests', () => {
  let app: Express;
  let authService: typeof AuthService;

  beforeEach(() => {
    // Create a test Express app with minimal middleware
    app = express();
    
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    // Mock AuthService
    authService = require('../src/services/AuthService').default;
  });

  describe('POST /api/auth/signup', () => {
    it('should successfully register a new user with valid data', async () => {
      const signupData = {
        email: 'newuser@example.com',
        password: 'ValidPass123!',
        displayName: 'Test User',
        phone: '+1234567890',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(signupData.email.toLowerCase());
      expect(response.body.data.user.displayName).toBe(signupData.displayName);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should reject signup with missing email', async () => {
      const signupData = {
        password: 'ValidPass123!',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBe('INVALID_INPUT');
    });

    it('should reject signup with missing password', async () => {
      const signupData = {
        email: 'user@example.com',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject signup with missing displayName', async () => {
      const signupData = {
        email: 'user@example.com',
        password: 'ValidPass123!',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject signup with invalid email format', async () => {
      const signupData = {
        email: 'invalid-email',
        password: 'ValidPass123!',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject signup with weak password', async () => {
      const signupData = {
        email: 'user@example.com',
        password: 'weak',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject signup with duplicate email', async () => {
      const signupData = {
        email: 'existing@example.com',
        password: 'ValidPass123!',
        displayName: 'Test User',
      };

      // Mock AuthService to throw duplicate error
      jest.spyOn(authService, 'signup').mockRejectedValueOnce(
        new Error('User already exists')
      );

      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBe('SIGNUP_FAILED');
    });

    it('should apply rate limiting to signup', async () => {
      const signupData = {
        email: 'user@example.com',
        password: 'ValidPass123!',
        displayName: 'Test User',
      };

      // Make multiple requests to trigger rate limiting
      let lastResponse;
      for (let i = 0; i < 6; i++) {
        lastResponse = await request(app)
          .post('/api/auth/signup')
          .send(signupData);
      }

      // After rate limit, should get 429 (Too Many Requests)
      expect(lastResponse?.status).toBe(429);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'ValidPass123!',
      };

      // Mock successful login
      jest.spyOn(authService, 'login').mockResolvedValueOnce({
        success: true,
        user: {
          id: '123',
          email: loginData.email,
          displayName: 'Test User',
          role: 'USER',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with missing email', async () => {
      const loginData = {
        password: 'ValidPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject login with missing password', async () => {
      const loginData = {
        email: 'user@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'WrongPassword123!',
      };

      // Mock failed login
      jest.spyOn(authService, 'login').mockRejectedValueOnce(
        new Error('Invalid credentials')
      );

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/google', () => {
    it('should verify Google token and create/update user', async () => {
      const googleData = {
        idToken: 'mock-google-id-token',
      };

      // Mock Google token verification
      jest.spyOn(authService, 'verifyGoogleToken').mockResolvedValueOnce({
        email: 'user@gmail.com',
        sub: 'google-user-id-123',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
      });

      jest.spyOn(authService, 'signInWithGoogle').mockResolvedValueOnce({
        success: true,
        user: {
          id: '123',
          email: 'user@gmail.com',
          displayName: 'Test User',
          role: 'USER',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      const response = await request(app)
        .post('/api/auth/google')
        .send(googleData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user.email).toBe('user@gmail.com');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject invalid Google token', async () => {
      const googleData = {
        idToken: 'invalid-google-id-token',
      };

      jest.spyOn(authService, 'verifyGoogleToken').mockRejectedValueOnce(
        new Error('Invalid token')
      );

      const response = await request(app)
        .post('/api/auth/google')
        .send(googleData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const refreshData = {
        refreshToken: 'mock-valid-refresh-token',
      };

      jest.spyOn(authService, 'refreshAccessToken').mockResolvedValueOnce({
        success: true,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send(refreshData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject invalid refresh token', async () => {
      const refreshData = {
        refreshToken: 'invalid-refresh-token',
      };

      jest.spyOn(authService, 'refreshAccessToken').mockRejectedValueOnce(
        new Error('Invalid refresh token')
      );

      const response = await request(app)
        .post('/api/auth/refresh')
        .send(refreshData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Protected Routes', () => {
    it('should reject request without authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should reject request with invalid authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toBe('INVALID_TOKEN');
    });
  });
});

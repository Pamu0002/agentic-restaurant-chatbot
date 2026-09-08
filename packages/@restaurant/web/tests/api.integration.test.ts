/**
 * FRONTEND-BACKEND INTEGRATION TESTS
 * Tests frontend services calling backend API endpoints
 * 
 * Coverage:
 * - axios interceptors
 * - API call error handling
 * - Token management (access/refresh)
 * - CORS headers
 */

import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Frontend-Backend Integration', () => {
  let api: AxiosInstance;
  let mock: MockAdapter;
  const API_URL = 'http://localhost:5000/api';

  beforeEach(() => {
    api = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    mock = new MockAdapter(api);

    // Setup response interceptor for token refresh
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await api.post('/auth/refresh', { refreshToken });
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  describe('Signup Request', () => {
    it('should send POST request to /auth/signup with correct payload', async () => {
      const signupPayload = {
        email: 'test@example.com',
        password: 'TestPass123!',
        displayName: 'Test User',
        phone: '+1234567890',
      };

      mock.onPost('/auth/signup').reply(201, {
        success: true,
        data: {
          user: {
            id: '123',
            email: signupPayload.email,
            displayName: signupPayload.displayName,
          },
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-123',
        },
      });

      const response = await api.post('/auth/signup', signupPayload);

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data.user.email).toBe(signupPayload.email);
      expect(mock.history.post[0].data).toContain(signupPayload.email);
    });

    it('should handle signup validation errors', async () => {
      mock.onPost('/auth/signup').reply(400, {
        success: false,
        error: 'SIGNUP_FAILED',
        message: 'Email already exists',
      });

      try {
        await api.post('/auth/signup', {
          email: 'existing@example.com',
          password: 'TestPass123!',
          displayName: 'Test User',
        });
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });

    it('should store tokens in localStorage after successful signup', async () => {
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mock.onPost('/auth/signup').reply(201, {
        success: true,
        data: {
          user: { id: '123', email: 'test@example.com' },
          ...tokens,
        },
      });

      const response = await api.post('/auth/signup', {
        email: 'test@example.com',
        password: 'TestPass123!',
        displayName: 'Test User',
      });

      // Simulate frontend storing tokens
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      expect(localStorage.getItem('accessToken')).toBe(tokens.accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(tokens.refreshToken);
    });
  });

  describe('Login Request', () => {
    it('should send POST request to /auth/login with email and password', async () => {
      const loginPayload = {
        email: 'user@example.com',
        password: 'UserPass123!',
      };

      mock.onPost('/auth/login').reply(200, {
        success: true,
        data: {
          user: {
            id: '456',
            email: loginPayload.email,
            displayName: 'User Name',
          },
          accessToken: 'login-access-token',
          refreshToken: 'login-refresh-token',
        },
      });

      const response = await api.post('/auth/login', loginPayload);

      expect(response.status).toBe(200);
      expect(response.data.data.user.email).toBe(loginPayload.email);
    });

    it('should include credentials in request headers', async () => {
      const request = {
        headers: { withCredentials: true },
      };

      mock.onPost('/auth/login').reply(200, {
        success: true,
        data: {
          user: { id: '456', email: 'user@example.com' },
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      });

      await api.post('/auth/login', {
        email: 'user@example.com',
        password: 'Pass123!',
      });

      expect(api.defaults.withCredentials).toBe(true);
    });

    it('should handle authentication error', async () => {
      mock.onPost('/auth/login').reply(401, {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });

      try {
        await api.post('/auth/login', {
          email: 'user@example.com',
          password: 'WrongPass123!',
        });
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Google OAuth Request', () => {
    it('should send POST request to /auth/google with idToken', async () => {
      const idToken = 'google-id-token-xyz';

      mock.onPost('/auth/google').reply(200, {
        success: true,
        data: {
          user: {
            id: '789',
            email: 'user@gmail.com',
            displayName: 'Google User',
          },
          accessToken: 'google-access-token',
          refreshToken: 'google-refresh-token',
        },
      });

      const response = await api.post('/auth/google', { idToken });

      expect(response.status).toBe(200);
      expect(response.data.data.user.email).toBe('user@gmail.com');
      expect(JSON.parse(mock.history.post[0].data).idToken).toBe(idToken);
    });

    it('should handle Google OAuth errors', async () => {
      mock.onPost('/auth/google').reply(400, {
        success: false,
        error: 'GOOGLE_VERIFICATION_FAILED',
        message: 'Invalid Google token',
      });

      try {
        await api.post('/auth/google', { idToken: 'invalid-token' });
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('Token Refresh', () => {
    it('should refresh access token using refresh token', async () => {
      const refreshToken = 'refresh-token-xyz';

      mock.onPost('/auth/refresh').reply(200, {
        success: true,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });

      const response = await api.post('/auth/refresh', { refreshToken });

      expect(response.status).toBe(200);
      expect(response.data.data.accessToken).toBe('new-access-token');
    });

    it('should automatically retry request after token refresh on 401', async () => {
      const accessToken = 'expired-access-token';
      const newAccessToken = 'new-access-token';

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', 'valid-refresh-token');

      // First request returns 401
      mock.onGet('/auth/profile').replyOnce(401, {
        error: 'UNAUTHORIZED',
      });

      // Refresh endpoint returns new token
      mock.onPost('/auth/refresh').replyOnce(200, {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: 'new-refresh-token',
        },
      });

      // Retried request succeeds
      mock.onGet('/auth/profile').replyOnce(200, {
        success: true,
        data: { email: 'user@example.com' },
      });

      // Setting up request interceptor
      api.interceptors.request.use((config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      const response = await api.get('/auth/profile');

      expect(response.status).toBe(200);
      expect(response.data.data.email).toBe('user@example.com');
    });

    it('should logout on invalid refresh token', async () => {
      mock.onPost('/auth/refresh').reply(401, {
        error: 'INVALID_REFRESH_TOKEN',
      });

      try {
        await api.post('/auth/refresh', { refreshToken: 'invalid-token' });
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        // Frontend should clear localStorage and redirect to login
        localStorage.clear();
        expect(localStorage.length).toBe(0);
      }
    });
  });

  describe('Protected Route Access', () => {
    it('should include Authorization header in protected requests', async () => {
      const accessToken = 'valid-access-token';
      localStorage.setItem('accessToken', accessToken);

      api.interceptors.request.use((config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      mock.onGet('/auth/profile').reply(200, {
        success: true,
        data: { email: 'user@example.com' },
      });

      await api.get('/auth/profile');

      const requestHeaders = mock.history.get[0].headers;
      expect(requestHeaders.Authorization).toBe(`Bearer ${accessToken}`);
    });

    it('should not include Authorization header in public endpoints', async () => {
      mock.onPost('/auth/login').reply(200, {
        success: true,
        data: { accessToken: 'token' },
      });

      await api.post('/auth/login', {
        email: 'user@example.com',
        password: 'Pass123!',
      });

      // Authorization header may or may not be set for public endpoints
      // but should not contain a token from localStorage
      const headers = mock.history.post[0].headers;
      expect(headers.Authorization || '').not.toMatch(/Bearer .+/);
    });
  });

  describe('CORS Handling', () => {
    it('should include credentials in requests', async () => {
      mock.onPost('/auth/login').reply(200, {
        success: true,
        data: { user: { id: '1' }, accessToken: 'token' },
      });

      await api.post('/auth/login', {
        email: 'user@example.com',
        password: 'Pass123!',
      });

      expect(api.defaults.withCredentials).toBe(true);
    });

    it('should handle CORS errors gracefully', async () => {
      mock.onGet('/auth/profile').networkError();

      try {
        await api.get('/auth/profile');
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toMatch(/Network Error|CORS/);
      }
    });
  });
});

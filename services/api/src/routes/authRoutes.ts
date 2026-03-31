/**
 * AUTHENTICATION ROUTES
 * Express router for all authentication endpoints
 * - User registration and login
 * - OAuth2 handling
 * - Token management
 * - Profile management
 */

import { Router } from 'express';
import {
    changePassword,
    deleteAccount,
    getCurrentUser,
    googleSignIn,
    logout,
    refreshToken,
    signin,
    signup,
    updateProfile,
    verifyEmail,
} from '../controllers/authController';
import {
    authenticateToken,
    rateLimitByUser,
    securityHeaders
} from '../middleware/authMiddleware';
import logger from '../utils/logger';

const router = Router();

// Apply security headers to all auth routes
router.use(securityHeaders);

// Apply rate limiting to all auth routes
router.use(rateLimitByUser);

/**
 * POST /api/auth/signup
 * Register a new user
 *
 * Body:
 * {
 *   email: string,
 *   password: string,
 *   displayName: string,
 *   phone?: string,
 *   preferences?: object
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     user: User,
 *     accessToken: string,
 *     refreshToken: string
 *   },
 *   message: string
 * }
 */
router.post('/signup', async (req, res) => {
  logger.info('POST /api/auth/signup');
  await signup(req, res);
});

/**
 * POST /api/auth/signin
 * Authenticate user with email and password
 *
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     user: User,
 *     accessToken: string
 *   },
 *   message: string
 * }
 *
 * Cookies:
 * - refreshToken: string (httpOnly, secure)
 */
router.post('/signin', async (req, res) => {
  logger.info('POST /api/auth/signin');
  await signin(req, res);
});

/**
 * POST /api/auth/google
 * OAuth2 authentication with Google
 *
 * Body:
 * {
 *   googleId: string,
 *   email: string,
 *   displayName: string,
 *   photoURL?: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     user: User,
 *     accessToken: string
 *   },
 *   message: string
 * }
 *
 * Cookies:
 * - refreshToken: string (httpOnly, secure)
 */
router.post('/google', async (req, res) => {
  logger.info('POST /api/auth/google');
  await googleSignIn(req, res);
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 *
 * Body or Cookie:
 * {
 *   refreshToken?: string (if not in cookie)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     accessToken: string
 *   },
 *   message: string
 * }
 */
router.post('/refresh', async (req, res) => {
  logger.info('POST /api/auth/refresh');
  await refreshToken(req, res);
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 *
 * Headers:
 * - Authorization: Bearer <accessToken>
 *
 * Response:
 * {
 *   success: boolean,
 *   data: User,
 *   message: string
 * }
 */
router.get('/me', authenticateToken, async (req, res) => {
  logger.info('GET /api/auth/me');
  await getCurrentUser(req, res);
});

/**
 * PUT /api/auth/profile
 * Update user profile (requires authentication)
 *
 * Headers:
 * - Authorization: Bearer <accessToken>
 *
 * Body:
 * {
 *   displayName?: string,
 *   phone?: string,
 *   bio?: string,
 *   photoURL?: string,
 *   preferences?: object
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data: User,
 *   message: string
 * }
 */
router.put('/profile', authenticateToken, async (req, res) => {
  logger.info('PUT /api/auth/profile');
  await updateProfile(req, res);
});

/**
 * POST /api/auth/change-password
 * Change user password (requires authentication)
 *
 * Headers:
 * - Authorization: Bearer <accessToken>
 *
 * Body:
 * {
 *   currentPassword: string,
 *   newPassword: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  logger.info('POST /api/auth/change-password');
  await changePassword(req, res);
});

/**
 * POST /api/auth/verify-email
 * Verify user email address
 *
 * Body:
 * {
 *   email: string,
 *   verificationCode: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data: User,
 *   message: string
 * }
 */
router.post('/verify-email', async (req, res) => {
  logger.info('POST /api/auth/verify-email');
  await verifyEmail(req, res);
});

/**
 * POST /api/auth/logout
 * Logout user (requires authentication)
 * Clears refresh token cookie
 *
 * Headers:
 * - Authorization: Bearer <accessToken>
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
router.post('/logout', authenticateToken, (req, res) => {
  logger.info('POST /api/auth/logout');
  logout(req, res);
});

/**
 * DELETE /api/auth/account
 * Permanently delete user account (requires authentication)
 *
 * Headers:
 * - Authorization: Bearer <accessToken>
 *
 * Body:
 * {
 *   password: string (required for confirmation)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
router.delete('/account', authenticateToken, async (req, res) => {
  logger.info('DELETE /api/auth/account');
  await deleteAccount(req, res);
});

export default router;

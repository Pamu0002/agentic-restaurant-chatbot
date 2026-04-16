/**
 * AUTHENTICATION ROUTES
 * Complete auth endpoints: signup, login, logout, refresh, google oauth, profile
 */

import { Request, Response, Router } from 'express';
import { verifyAccessToken } from '../controllers/middleware/authMiddleware';
import { authLimiter, passwordResetLimiter } from '../controllers/middleware/rateLimiter';
import AuthService from '../services/AuthService';
import logger from '../utils/logger';

const router = Router();

// ============================================
// AUTH ENDPOINTS (PUBLIC)
// ============================================

/**
 * POST /api/auth/signup
 * Register new user with email/password
 */
router.post('/signup', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, phone } = req.body;

    // Validate input
    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Email, password, and displayName are required',
      });
    }

    // Signup
    const result = await AuthService.signup({
      email,
      password,
      displayName,
      phone,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Signup error:', error);
    res.status(400).json({
      success: false,
      error: 'SIGNUP_FAILED',
      message: error.message || 'Signup failed',
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email/password
 */
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Email and password are required',
      });
    }

    const result = await AuthService.login({
      email,
      password,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Set refresh token in secure HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: 'LOGIN_FAILED',
      message: error.message || 'Login failed',
    });
  }
});

/**
 * POST /api/auth/google
 * Register/Login with Google OAuth
 */
router.post('/google', authLimiter, async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'idToken is required',
      });
    }

    const result = await AuthService.verifyGoogleToken(idToken, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Set refresh token in secure HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      // Return both formats for compatibility
      sessionToken: result.accessToken,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error: any) {
    logger.error('Google OAuth error:', error);
    res.status(401).json({
      success: false,
      error: 'GOOGLE_AUTH_FAILED',
      message: error.message || 'Google authentication failed',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Refresh token is required',
      });
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: 'TOKEN_REFRESH_FAILED',
      message: error.message || 'Token refresh failed',
    });
  }
});

// ============================================
// AUTH ENDPOINTS (PROTECTED)
// ============================================

/**
 * POST /api/auth/logout
 * Logout (revoke refresh token)
 */
router.post('/logout', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'LOGOUT_FAILED',
      message: error.message || 'Logout failed',
    });
  }
});

/**
 * POST /api/auth/logout-all
 * Logout from all devices
 */
router.post('/logout-all', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    await AuthService.logoutAll(user.userId);

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (error: any) {
    logger.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      error: 'LOGOUT_FAILED',
      message: error.message || 'Logout failed',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (alias for /profile)
 */
router.get('/me', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const profile = await AuthService.getUserProfile(user.userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'GET_PROFILE_FAILED',
      message: error.message || 'Failed to get profile',
    });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const profile = await AuthService.getUserProfile(user.userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'GET_PROFILE_FAILED',
      message: error.message || 'Failed to get profile',
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const updates = {
      displayName: req.body.displayName,
      phone: req.body.phone,
      preferences: req.body.preferences,
    };

    const result = await AuthService.updateUserProfile(user.userId, updates);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'UPDATE_PROFILE_FAILED',
      message: error.message || 'Failed to update profile',
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', passwordResetLimiter, verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'oldPassword and newPassword are required',
      });
    }

    await AuthService.changePassword(user.userId, oldPassword, newPassword);

    // Clear refresh token since password changed
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error: any) {
    logger.error('Change password error:', error);
    res.status(400).json({
      success: false,
      error: 'PASSWORD_CHANGE_FAILED',
      message: error.message || 'Failed to change password',
    });
  }
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get('/status', verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    res.json({
      success: true,
      data: {
        authenticated: true,
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Not authenticated',
    });
  }
});

/**
 * POST /api/auth/verify
 * Verify if session token is valid
 * 
 * Request: { sessionToken: string }
 * Response: { valid: boolean, userId?: string, email?: string }
 */
router.post('/verify', (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        valid: false,
        error: 'sessionToken is required',
      });
    }

    const verified = AuthService.verifyAccessToken(sessionToken);

    if (!verified) {
      return res.status(401).json({
        valid: false,
        error: 'Invalid or expired token',
      });
    }

    res.json({
      valid: true,
      userId: verified.userId,
      email: verified.email,
    });
  } catch (error: any) {
    res.status(500).json({
      valid: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh an expired session token
 * 
 * Request: { sessionToken: string }
 * Response: { success: boolean, sessionToken?: string }
 */
router.post('/refresh-session', (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        error: 'sessionToken is required',
      });
    }

    // Note: Session token refresh not directly supported. Use refresh endpoint instead.
    // For now, verify the token is still valid
    const newToken = AuthService.verifyAccessToken(sessionToken) ? sessionToken : null;

    if (!newToken) {
      return res.status(401).json({
        success: false,
        error: 'Cannot refresh expired token',
      });
    }

    res.json({
      success: true,
      sessionToken: newToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/status
 * Get current auth status
 */
router.get('/auth/status', (req: Request, res: Response) => {
  const token = req.cookies?.sessionToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.json({
      authenticated: false,
    });
  }

  const verified = AuthService.verifyAccessToken(token);

  res.json({
    authenticated: !!verified,
    user: verified,
  });
});

export default router;

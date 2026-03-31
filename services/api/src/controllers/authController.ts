/**
 * AUTHENTICATION CONTROLLER
 * HTTP request handlers for all auth endpoints
 * - User registration
 * - User login
 * - OAuth2 handling
 * - Token refresh
 * - User profile management
 */

import { Request, Response } from 'express';
import {
    AuthError,
    AuthErrorType,
    GoogleOAuthRequest,
    SignInRequest,
    SignUpRequest,
    UpdateUserRequest,
} from '../models/User';
import { AuthenticationService } from '../services/AuthService';
import logger from '../utils/logger';

const authService = new AuthenticationService();

/**
 * POST /api/auth/signup
 * Register a new user account
 *
 * Body:
 * - email: string (required, must be valid email)
 * - password: string (required, must be strong)
 * - displayName: string (required)
 * - phone?: string (optional)
 * - preferences?: object (optional)
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName, phone, preferences } = req.body;

    // Validate required fields
    if (!email || !password || !displayName) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_EMAIL,
        message: 'Email, password, and display name are required',
      });
      return;
    }

    const signUpRequest: SignUpRequest = {
      email: email.trim().toLowerCase(),
      password,
      displayName: displayName.trim(),
      phone,
      preferences,
    };

    logger.info(`Signup attempt for email: ${signUpRequest.email}`);

    const response = await authService.signUp(signUpRequest);

    logger.info(`User registered: ${response.user.id}`);

    res.status(201).json({
      success: true,
      data: response,
      message: 'User registered successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Signup failed: ${error.type} - ${error.message}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Signup error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Registration failed. Please try again.',
    });
  }
};

/**
 * POST /api/auth/signin
 * Authenticate user and return tokens
 *
 * Body:
 * - email: string (required)
 * - password: string (required)
 */
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Email and password are required',
      });
      return;
    }

    const signInRequest: SignInRequest = {
      email: email.trim().toLowerCase(),
      password,
    };

    logger.info(`Signin attempt for email: ${signInRequest.email}`);

    const response = await authService.signIn(signInRequest);

    logger.info(`User signed in: ${response.user.id}`);

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      success: true,
      data: {
        user: response.user,
        accessToken: response.accessToken,
      },
      message: 'Signed in successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Signin failed: ${error.type} - ${error.message}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Signin error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Login failed. Please try again.',
    });
  }
};

/**
 * POST /api/auth/google
 * Authenticate user via Google OAuth2
 *
 * Body:
 * - googleId: string (required)
 * - email: string (required)
 * - displayName: string (required)
 * - photoURL?: string (optional)
 */
export const googleSignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { googleId, email, displayName, photoURL } = req.body;

    // Validate required fields
    if (!googleId || !email || !displayName) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_EMAIL,
        message: 'googleId, email, and displayName are required',
      });
      return;
    }

    const oauthRequest: GoogleOAuthRequest = {
      googleId,
      email: email.trim().toLowerCase(),
      displayName: displayName.trim(),
      photoURL,
    };

    logger.info(`Google signin attempt for email: ${oauthRequest.email}`);

    const response = await authService.signInWithGoogle(oauthRequest);

    logger.info(`Google user signed in: ${response.user.id}`);

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      success: true,
      data: {
        user: response.user,
        accessToken: response.accessToken,
      },
      message: 'Google authentication successful',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Google signin failed: ${error.type} - ${error.message}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Google signin error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Google authentication failed. Please try again.',
    });
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 *
 * Body or Cookie:
 * - refreshToken: string (from cookie or body)
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: AuthErrorType.INVALID_TOKEN,
        message: 'Refresh token not provided',
      });
      return;
    }

    logger.debug('Token refresh attempt');

    // Verify refresh token
    const payload = authService.verifyToken(refreshToken);

    if (!payload) {
      throw new AuthError(
        AuthErrorType.TOKEN_EXPIRED,
        401,
        'Refresh token is invalid or expired',
      );
    }

    // Get fresh user data
    const user = await authService.getUserById(payload.userId);

    if (!user) {
      throw new AuthError(AuthErrorType.USER_NOT_FOUND, 404, 'User not found');
    }

    // Generate new access token (private method call workaround)
    // In production, expose this as a helper or store in AuthService
    const accessToken = (authService as any).generateAccessToken(user);

    logger.info(`Token refreshed for user: ${payload.userId}`);

    res.json({
      success: true,
      data: {
        accessToken,
      },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Token refresh failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Token refresh error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Token refresh failed. Please try again.',
    });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: AuthErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await authService.getUserById(req.userId);

    if (!user) {
      throw new AuthError(AuthErrorType.USER_NOT_FOUND, 404, 'User not found');
    }

    res.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Get current user error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Failed to retrieve user profile',
    });
  }
};

/**
 * PUT /api/auth/profile
 * Update user profile
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Body:
 * - displayName?: string
 * - phone?: string
 * - bio?: string
 * - photoURL?: string
 * - preferences?: object
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: AuthErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const updateRequest: UpdateUserRequest = {
      displayName: req.body.displayName,
      phone: req.body.phone,
      bio: req.body.bio,
      photoURL: req.body.photoURL,
      preferences: req.body.preferences,
    };

    logger.info(`Profile update attempt for user: ${req.userId}`);

    const updatedUser = await authService.updateProfile(req.userId, updateRequest);

    logger.info(`Profile updated for user: ${req.userId}`);

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Profile update failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Profile update error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Failed to update profile',
    });
  }
};

/**
 * POST /api/auth/change-password
 * Change user password
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Body:
 * - currentPassword: string (required)
 * - newPassword: string (required)
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: AuthErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Current password and new password are required',
      });
      return;
    }

    logger.info(`Password change attempt for user: ${req.userId}`);

    await authService.changePassword(req.userId, currentPassword, newPassword);

    logger.info(`Password changed for user: ${req.userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Password change failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Change password error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Failed to change password',
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout user (clear refresh token)
 */
export const logout = (req: Request, res: Response): void => {
  try {
    logger.info(`Logout for user: ${req.userId}`);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Logout failed',
    });
  }
};

/**
 * POST /api/auth/verify-email
 * Verify user email address
 *
 * Body:
 * - email: string (required)
 * - verificationCode: string (required)
 */
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_EMAIL,
        message: 'Email and verification code are required',
      });
      return;
    }

    logger.info(`Email verification attempt for: ${email}`);

    const user = await authService.verifyEmail(email.toLowerCase(), verificationCode);

    logger.info(`Email verified for user: ${user.id}`);

    res.json({
      success: true,
      data: user,
      message: 'Email verified successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Email verification failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Email verification error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Email verification failed',
    });
  }
};

/**
 * DELETE /api/auth/account
 * Delete user account permanently
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Body:
 * - password: string (required - for confirmation)
 */
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: AuthErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Password is required for account deletion',
      });
      return;
    }

    logger.warn(`Account deletion attempt for user: ${req.userId}`);

    await authService.deleteUser(req.userId, password);

    logger.warn(`Account deleted for user: ${req.userId}`);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Account deletion failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Account deletion error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Failed to delete account',
    });
  }
};

/**
 * Handle Google OAuth Sign-In with ID Token Verification
 * This function validates the Google ID token and signs in the user
 * Called from auth routes when client sends idToken
 */
export const handleGoogleSignIn = async (idToken: string): Promise<{
  sessionToken: string;
  user: { id: string; email: string; displayName: string; role: string };
}> => {
  try {
    // Verify Google ID token with Google's public keys
    const googlePayload = await authService.verifyGoogleToken(idToken);

    if (!googlePayload) {
      throw new AuthError(
        AuthErrorType.INVALID_TOKEN,
        401,
        'Google token verification failed',
      );
    }

    // Sign in or create user
    const response = await authService.signInWithGoogle({
      googleId: googlePayload.sub,
      email: googlePayload.email,
      displayName: googlePayload.name,
      photoURL: googlePayload.picture,
    });

    logger.info(`Google OAuth success for: ${googlePayload.email}`);

    return {
      sessionToken: response.tokens.accessToken,
      user: response.user,
    };
  } catch (error) {
    logger.error('Google sign-in error', error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      AuthErrorType.UNKNOWN,
      500,
      'Google authentication failed',
    );
  }
};

/**
 * Verify Session Token
 * Validates and returns the payload of a session token
 */
export const verifySessionToken = (token: string): TokenPayload | null => {
  try {
    const payload = authService.verifyToken(token);
    if (payload) {
      logger.debug(`Token verified for user: ${payload.userId}`);
    }
    return payload;
  } catch (error) {
    logger.error('Session token verification error', error);
    return null;
  }
};

/**
 * Refresh Session Token
 * Generates a new access token from a valid refresh token
 */
export const refreshSessionToken = async (
  refreshToken: string,
): Promise<string | null> => {
  try {
    const payload = authService.verifyToken(refreshToken);

    if (!payload) {
      logger.warn('Cannot refresh: invalid token');
      return null;
    }

    // Get user for fresh context
    const user = await authService.getUserById(payload.userId);

    if (!user) {
      logger.warn(`Cannot refresh: user not found (${payload.userId})`);
      return null;
    }

    // Generate new access token
    // Note: generateAccessToken is private, so we use a workaround
    const newAccessToken = (authService as any).generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info(`Token refreshed for user: ${payload.userId}`);
    return newAccessToken;
  } catch (error) {
    logger.error('Session token refresh error', error);
    return null;
  }
};

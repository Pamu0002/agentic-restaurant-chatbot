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
    TokenPayload,
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

    const response = await authService.signup(signUpRequest);

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

    const response = await authService.login(signInRequest);

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
  } catch (error: any) {
    if (error instanceof AuthError) {
      logger.warn(`Signup failed: ${error.type} - ${error.message}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    // Handle generic errors
    logger.error('Signup error:', error);
    let errorMessage = 'Signup failed. Please try again.';
    let statusCode = 500;

    if (error.message.includes('Invalid email')) {
      errorMessage = 'Invalid email format';
      statusCode = 400;
    } else if (error.message.includes('Weak password')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Email already registered')) {
      errorMessage = 'Email already registered';
      statusCode = 409;
    }

    res.status(statusCode).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: errorMessage,
    });
  }
};

/**
 * POST /api/auth/google
 * Authenticate user via Google OAuth2
 *
 * Body (OPTION 1 - With ID Token):
 * - idToken: string (raw JWT from Google, will be verified and decoded)
 *
 * Body (OPTION 2 - Pre-decoded):
 * - googleId: string 
 * - email: string
 * - displayName: string
 * - photoURL?: string
 */
export const googleSignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, googleId, email, displayName, photoURL } = req.body;

    logger.info('Google signin request received');
    logger.info(`Has idToken: ${!!idToken}, Has googleId: ${!!googleId}`);

    let response;

    // Process based on what was sent
    if (idToken) {
      // Frontend sent raw JWT token - verify it first
      logger.info('Processing with ID token verification');
      response = await authService.verifyGoogleToken(idToken, {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    } else if (googleId && email && displayName) {
      // Pre-decoded data - use directly
      logger.info('Processing with pre-decoded data');
      const oauthRequest: GoogleOAuthRequest = {
        googleId,
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        photoURL,
      };

      logger.info(`Google signin attempt for email: ${oauthRequest.email}`);
      response = await authService.loginWithGoogle(oauthRequest, {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    } else {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_EMAIL,
        message: 'Either idToken or (googleId, email, displayName) are required',
      });
      return;
    }

    logger.info(`Google user authenticated: ${response.user.id}`);

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      success: true,
      sessionToken: response.accessToken,
      data: {
        user: response.user,
        accessToken: response.accessToken,
      },
      message: 'Google authentication successful',
    });
  } catch (error: any) {
    logger.error('Google signin catch block - error details:', {
      type: error.constructor.name,
      message: error.message,
      statusCode: error.statusCode,
      isAuthError: error instanceof AuthError,
    });

    if (error instanceof AuthError) {
      logger.warn(`Google signin failed: ${error.type} - ${error.message}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    // Handle unexpected errors
    logger.error('Unexpected Google signin error:', error);
    res.status(401).json({
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
    const user = await authService.getUserProfile(payload.userId);

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

    const user = await authService.getUserProfile(req.userId);

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

    const updatedUser = await authService.updateUserProfile(req.userId, updateRequest);

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
 * POST /api/auth/verify
 * Verify authentication token
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Accept token from either Authorization header or request body
    let token = req.headers.authorization?.split(' ')[1];
    
    logger.info('🔍 Token verify endpoint called');
    
    if (!token) {
      // Try to get from body (sent by frontend firebaseService)
      token = req.body.sessionToken;
      logger.info('Token from body:', !!token);
    } else {
      logger.info('Token from header:', !!token);
    }

    if (!token) {
      logger.warn('❌ No token provided in verify request');
      res.status(401).json({
        success: false,
        error: AuthErrorType.UNAUTHORIZED,
        message: 'No token provided',
      });
      return;
    }

    logger.info('🔐 Verifying token...');
    const payload = (authService as any).verifyAccessToken(token);
    
    logger.info('Verification result:', !!payload);
    
    if (!payload) {
      logger.warn('❌ Token verification failed - invalid payload');
      res.status(401).json({
        success: false,
        error: AuthErrorType.UNAUTHORIZED,
        message: 'Invalid token',
      });
      return;
    }

    logger.info('✅ Token verified successfully:', { userId: payload.userId, email: payload.email });
    
    res.json({
      success: true,
      valid: true,
      userId: payload.userId,
      email: payload.email,
      data: {
        valid: true,
        userId: payload.userId,
        email: payload.email,
      },
      message: 'Token is valid',
    });
  } catch (error: any) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: AuthErrorType.UNAUTHORIZED,
      message: 'Token verification failed',
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

    // TODO: Sign in or create user with googlePayload
    // This function is not currently used in production
    // Sign in or create user
    /*
    const response = await authService.loginWithGoogle({
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
    */
    // TODO: Implement proper Google OAuth handling
    return {
      sessionToken: '',
      user: { id: '', email: '', displayName: '', role: '' },
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
      // Convert to TokenPayload type
      return {
        userId: payload.userId,
        email: '',
        role: 'customer' as any,
      };
    }
    return null;
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
    const user = await authService.getUserProfile(payload.userId);

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

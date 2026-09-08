/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies JWT tokens and protects routes
 * Supports both auth user tokens and guest tokens
 */

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthService from '../../services/AuthService';
import logger from '../../utils/logger';

/**
 * Verify guest token
 * Used when AuthService.verifyAccessToken fails
 */
function verifyGuestToken(token: string): any {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Check if it's a guest token
    if (decoded.isGuest && decoded.guestId) {
      logger.info(`✅ Guest token verified: ${decoded.guestId}`);
      return {
        ...decoded,
        userId: decoded.guestId,
        isGuest: true,
      };
    }
    
    return null;
  } catch (error) {
    logger.debug('Guest token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Verify access token in Authorization header
 * Expected format: "Bearer <accessToken>"
 * Supports both auth users and guest users
 */
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    logger.debug(`🔐 Auth Header Check: ${authHeader ? 'Present' : 'Missing'}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`⚠️  Missing or invalid Bearer token in header`);
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    logger.debug(`📝 Token received (length: ${token.length})`);

    // Try to verify as auth user token
    logger.debug(`🔍 Attempting to verify as auth user token...`);
    let payload = AuthService.verifyAccessToken(token);

    // If auth token fails, try as guest token
    if (!payload) {
      logger.debug(`❌ Auth token failed, trying guest token...`);
      payload = verifyGuestToken(token);
    }

    if (!payload) {
      logger.warn(`⚠️  Token verification failed - both auth and guest tokens invalid`);
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    // Attach payload to request for use in route handlers
    (req as any).user = payload;
    (req as any).userId = payload.userId; // Set userId for access in route handlers
    (req as any).isGuest = (payload as any).isGuest || false; // Flag for guest users
    
    logger.info(`✅ User authenticated: ${payload.userId} (${(payload as any).isGuest ? 'guest' : 'authenticated'})`);
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Internal server error',
    });
  }
};

/**
 * Optional auth middleware
 * If token is present, verify it; otherwise allow anonymous
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = AuthService.verifyAccessToken(token);

      if (payload) {
        (req as any).user = payload;
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Require specific role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const requestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Middleware: Apply rate limiting per user/IP
 */
export const applyRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const userId = user?.id || req.ip || 'anonymous';
  const now = Date.now();

  let record = requestCounts.get(userId);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    requestCounts.set(userId, record);
  }

  record.count++;

  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: 'RATE_LIMITED',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    });
    return;
  }

  // Add rate limit info to response headers
  res.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  res.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - record.count).toString());
  res.set('X-RateLimit-Reset', record.resetTime.toString());

  next();
};

/**
 * Middleware: Verify CORS credentials
 */
export const verifyCorsCredentials = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');

  if (allowedOrigins.includes(origin || '')) {
    res.set('Access-Control-Allow-Credentials', 'true');
  }

  next();
};

/**
 * Middleware: Add security headers
 */
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Prevent clickjacking
  res.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  res.set('Content-Security-Policy', "default-src 'self'");

  next();
};

// Aliases for backward compatibility
export const authenticateToken = verifyAccessToken;
export const rateLimitByUser = applyRateLimit;


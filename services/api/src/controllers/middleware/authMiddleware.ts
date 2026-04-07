/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies JWT tokens and protects routes
 */

import { NextFunction, Request, Response } from 'express';
import AuthService from '../../services/AuthService';
import logger from '../../utils/logger';

/**
 * Verify access token in Authorization header
 * Expected format: "Bearer <accessToken>"
 */
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const payload = AuthService.verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    // Attach payload to request for use in route handlers
    (req as any).user = payload;
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


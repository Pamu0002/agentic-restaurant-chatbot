/**
 * RATE LIMITING MIDDLEWARE
 * Prevents brute force attacks and abuse
 */

import rateLimit from 'express-rate-limit';

// Strict rate limiter for auth endpoints (5 attempts per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// General API rate limiter (100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for password reset (3 attempts per hour)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset attempts, please try again later',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  authLimiter,
  apiLimiter,
  passwordResetLimiter,
};

/**
 * GUEST ROUTES
 * Express router for all guest session endpoints
 * - Create guest session
 * - Get guest session info
 * - Extend guest session
 * - End guest session
 */

import { Router } from 'express';
import {
    createGuestSession,
    endGuestSession,
    extendGuestSession,
    getGuestSession,
} from '../controllers/guestController';
import { securityHeaders } from '../controllers/middleware/authMiddleware';

const router = Router();

// Apply security headers to all guest routes
router.use(securityHeaders);

/**
 * POST /api/guests/create-session
 * Create a new guest session
 * 
 * No authentication required
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     sessionId: string,
 *     guestId: string,
 *     token: string,
 *     createdAt: string,
 *     expiresAt: string
 *   },
 *   message: string
 * }
 */
router.post('/create-session', createGuestSession);

/**
 * GET /api/guests/:sessionId
 * Get guest session information
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     guestId: string,
 *     sessionId: string,
 *     createdAt: string,
 *     expiresAt: string,
 *     status: 'active' | 'ended'
 *   }
 * }
 */
router.get('/:sessionId', getGuestSession);

/**
 * POST /api/guests/:sessionId/extend
 * Extend guest session by 24 hours
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     expiresAt: string
 *   },
 *   message: string
 * }
 */
router.post('/:sessionId/extend', extendGuestSession);

/**
 * POST /api/guests/:sessionId/end
 * End guest session
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
router.post('/:sessionId/end', endGuestSession);

export default router;

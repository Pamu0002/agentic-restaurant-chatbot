/**
 * CHAT ROUTES
 * Express router for all chat endpoints
 */

import { Router } from 'express';
import {
    archiveConversation,
    createConversation,
    deleteConversation,
    deleteMessage,
    getConversation,
    getConversations,
    sendMessage,
} from '../controllers/chatController';
import { authenticateToken, rateLimitByUser } from '../controllers/middleware/authMiddleware';
import logger from '../utils/logger';

const router = Router();

// Apply authentication to all chat routes
router.use(authenticateToken);
router.use(rateLimitByUser);

// ============================================================================
// MESSAGE ENDPOINTS
// ============================================================================

/**
 * POST /api/chat/send
 * Send a message and get AI response
 */
router.post('/send', async (req, res) => {
  logger.info('POST /api/chat/send');
  await sendMessage(req, res);
});

// ============================================================================
// CONVERSATION ENDPOINTS
// ============================================================================

/**
 * GET /api/chat/conversations
 * Get all conversations for authenticated user
 */
router.get('/conversations', async (req, res) => {
  logger.info('GET /api/chat/conversations');
  await getConversations(req, res);
});

/**
 * POST /api/chat/conversations
 * Create a new conversation
 */
router.post('/conversations', async (req, res) => {
  logger.info('POST /api/chat/conversations');
  await createConversation(req, res);
});

/**
 * GET /api/chat/conversations/:conversationId
 * Get a specific conversation with full history
 */
router.get('/conversations/:conversationId', async (req, res) => {
  logger.info(`GET /api/chat/conversations/${req.params.conversationId}`);
  await getConversation(req, res);
});

/**
 * DELETE /api/chat/conversations/:conversationId
 * Delete a conversation
 */
router.delete('/conversations/:conversationId', async (req, res) => {
  logger.info(`DELETE /api/chat/conversations/${req.params.conversationId}`);
  await deleteConversation(req, res);
});

/**
 * POST /api/chat/conversations/:conversationId/archive
 * Archive a conversation
 */
router.post('/conversations/:conversationId/archive', async (req, res) => {
  logger.info(`POST /api/chat/conversations/${req.params.conversationId}/archive`);
  await archiveConversation(req, res);
});

// ============================================================================
// MESSAGE ENDPOINTS (NESTED UNDER CONVERSATIONS)
// ============================================================================

/**
 * DELETE /api/chat/conversations/:conversationId/messages/:messageId
 * Delete a specific message
 */
router.delete('/conversations/:conversationId/messages/:messageId', async (req, res) => {
  logger.info(`DELETE /api/chat/conversations/${req.params.conversationId}/messages/${req.params.messageId}`);
  await deleteMessage(req, res);
});

export default router;

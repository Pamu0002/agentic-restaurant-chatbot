/**
 * CHAT CONTROLLER
 * HTTP request handlers for chat endpoints
 */

import { Request, Response } from 'express';
import { ChatError, ChatErrorType, SendMessageRequest } from '../models/Chat';
import { chatService } from '../services/ChatService';
import logger from '../utils/logger';

/**
 * POST /api/chat/send
 * Send a message and get AI response
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Body:
 * - conversationId?: string (omit to create new conversation)
 * - message: string (required, user message)
 * - metadata?: object (optional, user context)
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { conversationId, message, metadata } = req.body;

    // Validate required fields
    if (!message) {
      res.status(400).json({
        success: false,
        error: ChatErrorType.INVALID_MESSAGE,
        message: 'Message is required',
      });
      return;
    }

    const request: SendMessageRequest = {
      conversationId,
      message,
      metadata,
    };

    logger.info(`💬 Processing message for user: ${userId}`);

    // Send message and get response
    const assistantMessage = await chatService.sendMessage(userId, request);

    res.json({
      success: true,
      data: {
        message: assistantMessage,
        conversationId: assistantMessage.conversationId,
      },
      message: 'Message processed successfully',
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      logger.warn(`Chat error: ${error.code} - ${error.message}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Send message error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to process message',
    });
  }
};

/**
 * GET /api/chat/conversations
 * Get all conversations for authenticated user
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Query:
 * - limit?: number (default: 20)
 */
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    logger.info(`📋 Fetching conversations for user: ${userId}`);

    const conversations = await chatService.getConversations(userId, limit);

    res.json({
      success: true,
      data: conversations,
      count: conversations.length,
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Get conversations error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to fetch conversations',
    });
  }
};

/**
 * GET /api/chat/conversations/:conversationId
 * Get a specific conversation with full history
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Query:
 * - limit?: number (default: 50)
 * - offset?: number (default: 0)
 */
export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { conversationId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    logger.info(`📖 Fetching conversation: ${conversationId}`);

    // Get conversation metadata
    const conversation = await chatService.getConversation(userId, conversationId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: ChatErrorType.CONVERSATION_NOT_FOUND,
        message: 'Conversation not found',
      });
      return;
    }

    // Get message history
    const messages = await chatService.getConversationHistory(userId, {
      conversationId,
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        conversation,
        messages,
        messageCount: messages.length,
      },
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Get conversation error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to fetch conversation',
    });
  }
};

/**
 * POST /api/chat/conversations
 * Create a new conversation
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export const createConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    logger.info(`✨ Creating new conversation for user: ${userId}`);

    const conversation = await chatService.createConversation(userId);

    res.status(201).json({
      success: true,
      data: conversation,
      message: 'Conversation created successfully',
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Create conversation error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to create conversation',
    });
  }
};

/**
 * DELETE /api/chat/conversations/:conversationId
 * Delete a conversation
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export const deleteConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { conversationId } = req.params;

    logger.info(`🗑️  Deleting conversation: ${conversationId}`);

    await chatService.deleteConversation(userId, conversationId);

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Delete conversation error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to delete conversation',
    });
  }
};

/**
 * DELETE /api/chat/conversations/:conversationId/messages/:messageId
 * Delete a specific message
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { conversationId, messageId } = req.params;

    logger.info(`🗑️  Deleting message: ${messageId}`);

    await chatService.deleteMessage(userId, conversationId, messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Delete message error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to delete message',
    });
  }
};

/**
 * POST /api/chat/conversations/:conversationId/archive
 * Archive a conversation
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export const archiveConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: ChatErrorType.UNAUTHORIZED,
        message: 'Not authenticated',
      });
      return;
    }

    const { conversationId } = req.params;

    logger.info(`📦 Archiving conversation: ${conversationId}`);

    await chatService.archiveConversation(userId, conversationId);

    res.json({
      success: true,
      message: 'Conversation archived successfully',
    });
  } catch (error: any) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    logger.error('Archive conversation error', error);
    res.status(500).json({
      success: false,
      error: ChatErrorType.UNKNOWN,
      message: 'Failed to archive conversation',
    });
  }
};

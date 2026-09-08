/**
 * CHAT SERVICE
 * Core business logic for handling conversations and messages
 * Orchestrates between frontend, database, and AI service
 */

import axios from 'axios';
import {
    AIServiceRequest,
    AIServiceResponse,
    ChatError,
    ChatErrorType,
    Conversation,
    IChatService,
    IntentType,
    Message,
    MessageRole,
    SendMessageRequest,
} from '../models/Chat';
import { messageRepository } from '../repositories/MessageRepository';
import logger from '../utils/logger';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class ChatService implements IChatService {
  /**
   * Send a message and get AI response
   */
  async sendMessage(userId: string, request: SendMessageRequest): Promise<Message> {
    try {
      // Validate input
      if (!request.message || request.message.trim().length === 0) {
        throw new ChatError(
          ChatErrorType.INVALID_MESSAGE,
          400,
          'Message cannot be empty'
        );
      }

      // Get or create conversation
      let conversationId = request.conversationId;
      if (!conversationId) {
        const conversation = await messageRepository.createConversation(userId);
        conversationId = conversation.id;
        logger.info(`📝 New conversation created: ${conversationId}`);
      }

      // Verify conversation exists and belongs to user
      const conversation = await messageRepository.getConversation(conversationId);
      if (!conversation) {
        throw new ChatError(
          ChatErrorType.CONVERSATION_NOT_FOUND,
          404,
          'Conversation not found'
        );
      }

      if (conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to access this conversation'
        );
      }

      // Save user message to database
      const userMessage = await messageRepository.createMessage(conversationId, {
        userId,
        role: MessageRole.USER,
        content: request.message,
      });

      logger.info(`💬 User message saved: ${userMessage.id}`);

      // Get conversation history for context
      const history = await messageRepository.getMessages(conversationId, 10, 0);

      // Call AI service to get response
      try {
        const aiResponse = await this.callAIService(
          userId,
          conversationId,
          request.message,
          history,
          request.metadata?.userPreferences
        );

        logger.info(`🤖 AI response received for intent: ${aiResponse.data?.intent}`);

        // Save AI response to database
        const assistantMessage = await messageRepository.createMessage(conversationId, {
          userId,
          role: MessageRole.ASSISTANT,
          content: aiResponse.data?.response || 'Sorry, I had trouble processing that.',
          intent: aiResponse.data?.intent,
          entities: aiResponse.data?.entities,
          confidence: aiResponse.data?.confidence,
          model: aiResponse.data?.metadata?.model,
          temperature: aiResponse.data?.metadata?.temperature,
          processingTime: aiResponse.data?.metadata?.processingTime,
        });

        // Update conversation stats
        await messageRepository.updateConversation(conversationId, {
          messageCount: (conversation.messageCount || 0) + 2,
          userMessageCount: (conversation.userMessageCount || 0) + 1,
          assistantMessageCount: (conversation.assistantMessageCount || 0) + 1,
          lastMessagePreview: aiResponse.data?.response?.substring(0, 100),
          lastActivityAt: new Date() as any,
        });

        logger.info(`✅ Message exchange completed`);

        // Return the assistant message (frontend will display this)
        return assistantMessage;
      } catch (aiError: any) {
        logger.error(`❌ AI Service error: ${aiError.message}`);

        // Create error response from assistant
        const errorMessage = await messageRepository.createMessage(conversationId, {
          userId,
          role: MessageRole.ASSISTANT,
          content: 'I apologize, but I encountered an issue processing your request. Please try again.',
          intent: IntentType.UNCLEAR,
        });

        throw new ChatError(
          ChatErrorType.AI_SERVICE_ERROR,
          500,
          'Failed to get AI response'
        );
      }
    } catch (error: any) {
      if (error instanceof ChatError) {
        logger.warn(`Chat error: ${error.code} - ${error.message}`);
        throw error;
      }

      logger.error('Unexpected error in sendMessage', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'An unexpected error occurred'
      );
    }
  }

  /**
   * Get conversation message history
   */
  async getConversationHistory(
    userId: string,
    request: { conversationId: string; limit?: number; offset?: number }
  ): Promise<Message[]> {
    try {
      // Verify conversation exists and belongs to user
      const conversation = await messageRepository.getConversation(request.conversationId);
      if (!conversation) {
        throw new ChatError(
          ChatErrorType.CONVERSATION_NOT_FOUND,
          404,
          'Conversation not found'
        );
      }

      if (conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to access this conversation'
        );
      }

      const messages = await messageRepository.getMessages(
        request.conversationId,
        request.limit || 50,
        request.offset || 0
      );

      logger.info(`📚 Retrieved ${messages.length} messages from conversation`);
      return messages;
    } catch (error: any) {
      if (error instanceof ChatError) throw error;

      logger.error('Error fetching conversation history', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to fetch conversation history'
      );
    }
  }

  /**
   * Delete a specific message
   */
  async deleteMessage(
    userId: string,
    conversationId: string,
    messageId: string
  ): Promise<void> {
    try {
      // Verify conversation exists and belongs to user
      const conversation = await messageRepository.getConversation(conversationId);
      if (!conversation || conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to delete message'
        );
      }

      // Verify message exists
      const message = await messageRepository.getMessage(conversationId, messageId);
      if (!message) {
        throw new ChatError(
          ChatErrorType.MESSAGE_NOT_FOUND,
          404,
          'Message not found'
        );
      }

      await messageRepository.deleteMessage(conversationId, messageId);
      logger.info(`🗑️  Message deleted: ${messageId}`);
    } catch (error: any) {
      if (error instanceof ChatError) throw error;

      logger.error('Error deleting message', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to delete message'
      );
    }
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string, limit?: number): Promise<Conversation[]> {
    try {
      const conversations = await messageRepository.getUserConversations(userId, limit);
      logger.info(`📋 Retrieved ${conversations.length} conversations for user`);
      return conversations;
    } catch (error: any) {
      logger.error('Error fetching conversations', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to fetch conversations'
      );
    }
  }

  /**
   * Get a single conversation
   */
  async getConversation(userId: string, conversationId: string): Promise<Conversation | null> {
    try {
      const conversation = await messageRepository.getConversation(conversationId);
      
      if (conversation && conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to access this conversation'
        );
      }

      return conversation;
    } catch (error: any) {
      if (error instanceof ChatError) throw error;

      logger.error('Error fetching conversation', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to fetch conversation'
      );
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(userId: string): Promise<Conversation> {
    try {
      const conversation = await messageRepository.createConversation(userId);
      logger.info(`✅ Conversation created: ${conversation.id}`);
      return conversation;
    } catch (error: any) {
      logger.error('Error creating conversation', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to create conversation'
      );
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    try {
      // Verify conversation belongs to user
      const conversation = await messageRepository.getConversation(conversationId);
      if (!conversation || conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to delete conversation'
        );
      }

      await messageRepository.deleteConversation(conversationId);
      logger.info(`🗑️  Conversation deleted: ${conversationId}`);
    } catch (error: any) {
      if (error instanceof ChatError) throw error;

      logger.error('Error deleting conversation', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to delete conversation'
      );
    }
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(userId: string, conversationId: string): Promise<void> {
    try {
      // Verify conversation belongs to user
      const conversation = await messageRepository.getConversation(conversationId);
      if (!conversation || conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to archive conversation'
        );
      }

      await messageRepository.updateConversation(conversationId, {
        status: 'archived' as any,
      });

      logger.info(`📦 Conversation archived: ${conversationId}`);
    } catch (error: any) {
      if (error instanceof ChatError) throw error;

      logger.error('Error archiving conversation', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to archive conversation'
      );
    }
  }

  /**
   * Search conversations (basic implementation)
   */
  async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    try {
      const conversations = await messageRepository.getUserConversations(userId);
      
      // Filter by title and tags (basic implementation)
      return conversations.filter(
        (conv) =>
          (conv.title?.toLowerCase().includes(query.toLowerCase())) ||
          (conv.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))
      );
    } catch (error: any) {
      logger.error('Error searching conversations', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to search conversations'
      );
    }
  }

  /**
   * Search messages (basic implementation)
   */
  async searchMessages(
    userId: string,
    conversationId: string,
    query: string
  ): Promise<Message[]> {
    try {
      // Verify conversation belongs to user
      const conversation = await messageRepository.getConversation(conversationId);
      if (!conversation || conversation.userId !== userId) {
        throw new ChatError(
          ChatErrorType.UNAUTHORIZED,
          403,
          'Unauthorized to search in this conversation'
        );
      }

      const messages = await messageRepository.getMessages(conversationId, 1000, 0);
      
      // Filter by content (basic implementation)
      return messages.filter((msg) =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error: any) {
      if (error instanceof ChatError) throw error;

      logger.error('Error searching messages', error);
      throw new ChatError(
        ChatErrorType.UNKNOWN,
        500,
        'Failed to search messages'
      );
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Map AI service action to IntentType
   */
  private extractIntentFromAction(action: string): string {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('restaurant') || actionLower.includes('discover') || actionLower.includes('search')) {
      return IntentType.RESTAURANT_SEARCH;
    } else if (actionLower.includes('recommend')) {
      return IntentType.RECOMMENDATION;
    } else if (actionLower.includes('reserve') || actionLower.includes('book') || actionLower.includes('reservation')) {
      return IntentType.RESERVATION;
    } else if (actionLower.includes('menu')) {
      return IntentType.MENU_INQUIRY;
    } else if (actionLower.includes('price') || actionLower.includes('cost')) {
      return IntentType.PRICING_INQUIRY;
    } else if (actionLower.includes('hour') || actionLower.includes('time')) {
      return IntentType.HOURS_INQUIRY;
    } else {
      return IntentType.SMALL_TALK;
    }
  }

  /**
   * Call Python AI service to process message and get response
   */
  private async callAIService(
    userId: string,
    conversationId: string,
    userMessage: string,
    history: Message[],
    userPreferences?: Record<string, any>
  ): Promise<AIServiceResponse> {
    try {
      // Format conversation history for AI service
      const conversationHistory: Array<{
        role: 'user' | 'assistant';
        content: string;
      }> = history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // Add current message
      conversationHistory.push({
        role: 'user' as const,
        content: userMessage,
      });

      const aiRequest: AIServiceRequest = {
        userId,
        conversationId,
        message: userMessage,
        conversationHistory,
        userPreferences,
      };

      logger.info(`📤 Sending request to AI service: ${AI_SERVICE_URL}/api/v1/chat`);

      const response = await axios.post(
        `${AI_SERVICE_URL}/api/v1/chat`,
        aiRequest,
        {
          timeout: 30000, // 30 second timeout
        }
      );

      // Handle AI service response format
      // AI service returns: { agent_name, action, result, reasoning, timestamp }
      // We need to map it to our expected format
      const aiData = response.data;
      
      // Extract response content from AI service result
      const responseContent = aiData.result?.message || 
                             aiData.result?.response || 
                             'I processed your request but couldn\'t generate a response.';
      
      // Map AI response to our format
      const intent = this.extractIntentFromAction(aiData.action);
      
      const mappedResponse: AIServiceResponse = {
        success: true,
        data: {
          intent: intent as IntentType,
          confidence: 0.8, // Default confidence
          response: responseContent,
          metadata: {
            model: 'gemini-1.5-pro',
            temperature: 0.7,
            processingTime: 0
          }
        }
      };

      logger.info(`✅ AI service response received`);
      return mappedResponse;
    } catch (error: any) {
      logger.error(`❌ AI service call failed: ${error.message}`);

      // Provide fallback response if AI service is unavailable
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        logger.warn('AI service unreachable, providing fallback response');
        
        return {
          success: true,
          data: {
            intent: IntentType.SMALL_TALK,
            confidence: 0.5,
            response:
              "I'm currently having trouble connecting to my AI brain, but I'm still here to help! Could you tell me more about what you're looking for?",
            metadata: {
              model: 'fallback',
              temperature: 0.7,
              processingTime: 0,
            },
          },
        };
      }

      throw error;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();

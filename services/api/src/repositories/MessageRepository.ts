/**
 * MESSAGE REPOSITORY
 * Data access layer for message and conversation operations - Firestore with fallback
 */

import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';
import {
    Conversation,
    ConversationStatus,
    IntentType,
    Message,
    MessageRole
} from '../models/Chat';
import logger from '../utils/logger';

// In-memory fallback stores
const fallbackMessageStore = new Map<string, Map<string, Message>>();
const fallbackConversationStore = new Map<string, Conversation>();

export class MessageRepository {
  private conversationsCollection = 'conversations';
  private messagesSubcollection = 'messages';

  // ============================================================================
  // MESSAGE OPERATIONS
  // ============================================================================

  /**
   * Create a new message in a conversation
   */
  async createMessage(conversationId: string, data: {
    userId: string;
    role: MessageRole;
    content: string;
    intent?: string;
    entities?: any[];
    confidence?: number;
    model?: string;
    temperature?: number;
    processingTime?: number;
  }): Promise<Message> {
    try {
      const db = getDb();
      const messageId = uuidv4();
      const now = Timestamp.now();

      const messageDoc: any = {
        userId: data.userId,
        role: data.role,
        content: data.content,
        intent: data.intent || null,
        entities: data.entities || [],
        confidence: data.confidence || null,
        model: data.model || null,
        temperature: data.temperature || null,
        processingTime: data.processingTime || null,
        isRead: data.role === MessageRole.USER, // User messages are always "read"
        createdAt: now,
        updatedAt: now,
      };

      await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .collection(this.messagesSubcollection)
        .doc(messageId)
        .set(messageDoc);

      logger.info(`✅ Message created: ${messageId} in conversation ${conversationId}`);

      return this.mapDocToMessage(messageId, conversationId, messageDoc);
    } catch (error: any) {
      logger.warn(`⚠️  Database error creating message, using fallback: ${error.message}`);
      
      // Fallback: store in memory
      const messageId = uuidv4();
      const message: Message = {
        id: messageId,
        conversationId,
        userId: data.userId,
        role: data.role,
        content: data.content,
        intent: data.intent && data.intent !== '' ? (data.intent as IntentType) : undefined,
        entities: data.entities,
        confidence: data.confidence,
        model: data.model,
        temperature: data.temperature,
        processingTime: data.processingTime,
        isRead: data.role === MessageRole.USER,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (!fallbackMessageStore.has(conversationId)) {
        fallbackMessageStore.set(conversationId, new Map());
      }
      fallbackMessageStore.get(conversationId)!.set(messageId, message);
      
      logger.info(`💾 Message created in fallback store: ${messageId}`);
      return message;
    }
  }

  /**
   * Get messages from a conversation
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    try {
      const db = getDb();
      const snapshot = await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .collection(this.messagesSubcollection)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs
        .reverse() // Reverse to get chronological order
        .map((doc: any) => this.mapDocToMessage(doc.id, conversationId, doc.data()));
    } catch (error: any) {
      logger.warn(`⚠️  Database error fetching messages, checking fallback: ${error.message}`);
      
      // Fallback: retrieve from memory
      const messages = Array.from(
        fallbackMessageStore.get(conversationId)?.values() || []
      );
      return messages.slice(offset, offset + limit);
    }
  }

  /**
   * Get a single message by ID
   */
  async getMessage(conversationId: string, messageId: string): Promise<Message | null> {
    try {
      const db = getDb();
      const doc = await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .collection(this.messagesSubcollection)
        .doc(messageId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocToMessage(doc.id, conversationId, doc.data());
    } catch (error: any) {
      logger.warn(`⚠️  Database error fetching message, checking fallback: ${error.message}`);
      
      // Fallback: retrieve from memory
      return fallbackMessageStore.get(conversationId)?.get(messageId) || null;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
      const db = getDb();
      await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .collection(this.messagesSubcollection)
        .doc(messageId)
        .delete();

      logger.info(`✅ Message deleted: ${messageId}`);
    } catch (error: any) {
      logger.warn(`⚠️  Database error deleting message, using fallback: ${error.message}`);
      
      // Fallback: remove from memory
      fallbackMessageStore.get(conversationId)?.delete(messageId);
    }
  }

  // ============================================================================
  // CONVERSATION OPERATIONS
  // ============================================================================

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title?: string): Promise<Conversation> {
    try {
      const db = getDb();
      const conversationId = uuidv4();
      const now = Timestamp.now();

      const conversationDoc: any = {
        userId,
        title: title || `Conversation ${new Date().toLocaleDateString()}`,
        status: ConversationStatus.ACTIVE,
        summary: null,
        lastMessagePreview: null,
        messageCount: 0,
        userMessageCount: 0,
        assistantMessageCount: 0,
        tags: [],
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
      };

      await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .set(conversationDoc);

      logger.info(`✅ Conversation created: ${conversationId}`);

      return this.mapDocToConversation(conversationId, conversationDoc);
    } catch (error: any) {
      logger.warn(`⚠️  Database error creating conversation, using fallback: ${error.message}`);
      
      // Fallback: store in memory
      const conversationId = uuidv4();
      const now = Timestamp.now();
      const conversation: Conversation = {
        id: conversationId,
        userId,
        title: title || `Conversation ${new Date().toLocaleDateString()}`,
        status: ConversationStatus.ACTIVE,
        messageCount: 0,
        userMessageCount: 0,
        assistantMessageCount: 0,
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
      };

      fallbackConversationStore.set(conversationId, conversation);
      logger.info(`💾 Conversation created in fallback store: ${conversationId}`);
      return conversation;
    }
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const db = getDb();
      const doc = await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocToConversation(doc.id, doc.data());
    } catch (error: any) {
      logger.warn(`⚠️  Database error fetching conversation, checking fallback: ${error.message}`);
      
      // Fallback: retrieve from memory
      return fallbackConversationStore.get(conversationId) || null;
    }
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string, limit: number = 20): Promise<Conversation[]> {
    try {
      const db = getDb();
      const snapshot = await db
        .collection(this.conversationsCollection)
        .where('userId', '==', userId)
        .orderBy('lastActivityAt', 'desc')
        .limit(limit)
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: any) => this.mapDocToConversation(doc.id, doc.data()));
    } catch (error: any) {
      logger.warn(`⚠️  Database error fetching conversations, checking fallback: ${error.message}`);
      
      // Fallback: filter from memory
      const conversations = Array.from(fallbackConversationStore.values()).filter(
        (conv) => conv.userId === userId
      );
      return conversations.slice(0, limit);
    }
  }

  /**
   * Update conversation metadata
   */
  async updateConversation(
    conversationId: string,
    updates: Partial<Conversation>
  ): Promise<Conversation> {
    try {
      const db = getDb();
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.summary !== undefined) updateData.summary = updates.summary;
      if (updates.lastMessagePreview !== undefined) updateData.lastMessagePreview = updates.lastMessagePreview;
      if (updates.messageCount !== undefined) updateData.messageCount = updates.messageCount;
      if (updates.userMessageCount !== undefined) updateData.userMessageCount = updates.userMessageCount;
      if (updates.assistantMessageCount !== undefined) updateData.assistantMessageCount = updates.assistantMessageCount;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.lastActivityAt !== undefined) updateData.lastActivityAt = updates.lastActivityAt;

      await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .update(updateData);

      logger.info(`✅ Conversation updated: ${conversationId}`);

      const updated = await this.getConversation(conversationId);
      return updated!;
    } catch (error: any) {
      logger.warn(`⚠️  Database error updating conversation, using fallback: ${error.message}`);
      
      // Fallback: update in memory
      const conv = fallbackConversationStore.get(conversationId);
      if (conv) {
        Object.assign(conv, updates, { updatedAt: Timestamp.now() });
        fallbackConversationStore.set(conversationId, conv);
        return conv;
      }
      throw error;
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const db = getDb();
      
      // Delete all messages in the conversation
      const messagesSnapshot = await db
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .collection(this.messagesSubcollection)
        .get();

      const batch = db.batch();
      messagesSnapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      // Delete the conversation itself
      batch.delete(db.collection(this.conversationsCollection).doc(conversationId));
      await batch.commit();

      logger.info(`✅ Conversation deleted: ${conversationId}`);
    } catch (error: any) {
      logger.warn(`⚠️  Database error deleting conversation, using fallback: ${error.message}`);
      
      // Fallback: remove from memory
      fallbackMessageStore.delete(conversationId);
      fallbackConversationStore.delete(conversationId);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private mapDocToMessage(
    messageId: string,
    conversationId: string,
    data: any
  ): Message {
    return {
      id: messageId,
      conversationId,
      userId: data.userId,
      role: data.role,
      content: data.content,
      intent: data.intent && data.intent !== '' ? (data.intent as IntentType) : undefined,
      entities: data.entities,
      confidence: data.confidence,
      model: data.model,
      temperature: data.temperature,
      processingTime: data.processingTime,
      isRead: data.isRead,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapDocToConversation(conversationId: string, data: any): Conversation {
    return {
      id: conversationId,
      userId: data.userId,
      title: data.title,
      status: data.status,
      summary: data.summary,
      lastMessagePreview: data.lastMessagePreview,
      messageCount: data.messageCount,
      userMessageCount: data.userMessageCount,
      assistantMessageCount: data.assistantMessageCount,
      tags: data.tags,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastActivityAt: data.lastActivityAt,
    };
  }
}

// Export singleton instance
export const messageRepository = new MessageRepository();

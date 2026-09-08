/**
 * CHAT MODELS & INTERFACES
 * Production-grade chat data structures and types
 */

import { Timestamp } from 'firebase-admin/firestore';

// ============================================================================
// ENUMS
// ============================================================================

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum IntentType {
  GREETING = 'GREETING',
  RESTAURANT_SEARCH = 'RESTAURANT_SEARCH',
  RESERVATION = 'RESERVATION',
  RECOMMENDATION = 'RECOMMENDATION',
  MENU_INQUIRY = 'MENU_INQUIRY',
  PRICING_INQUIRY = 'PRICING_INQUIRY',
  HOURS_INQUIRY = 'HOURS_INQUIRY',
  SMALL_TALK = 'SMALL_TALK',
  FEEDBACK = 'FEEDBACK',
  UNCLEAR = 'UNCLEAR',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ABANDONED = 'abandoned',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Message Document (Firestore collection: "conversations/{conversationId}/messages")
 */
export interface Message {
  id: string; // Document ID
  conversationId: string; // Parent conversation
  userId: string; // User who sent/received
  role: MessageRole; // 'user' or 'assistant'
  content: string; // Message text
  
  // Context & Metadata
  intent?: IntentType; // Detected user intent (for user messages)
  entities?: Entity[]; // Extracted entities
  confidence?: number; // Intent confidence (0-1)
  
  // AI Metadata
  model?: string; // Which model generated response (for assistant messages)
  temperature?: number; // LLM temperature setting
  processingTime?: number; // ms to generate response
  
  // Status
  isRead: boolean; // User read the message
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Entity: Extracted data from user messages
 */
export interface Entity {
  type: 'CUISINE' | 'LOCATION' | 'PARTY_SIZE' | 'DATE' | 'TIME' | 'PRICE_RANGE' | 'RESTAURANT_NAME' | 'OTHER';
  value: string;
  confidence: number;
}

/**
 * Conversation Document (Firestore collection: "conversations")
 */
export interface Conversation {
  id: string; // Document ID
  userId: string; // Participant
  status: ConversationStatus;
  
  // Metadata
  title?: string; // User-friendly title
  summary?: string; // AI-generated summary
  lastMessagePreview?: string; // Last message text
  
  // Statistics
  messageCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt: Timestamp;
  
  // Tags for search/organization
  tags?: string[];
}

/**
 * Chat Response (API response structure)
 */
export interface ChatResponse {
  success: boolean;
  data?: {
    message: Message;
    conversationId: string;
    suggestedActions?: SuggestedAction[];
  };
  error?: {
    type: string;
    message: string;
  };
}

/**
 * Suggested Action: UI hint for what user can do next
 */
export interface SuggestedAction {
  id: string;
  type: 'SHOW_RESTAURANTS' | 'MAKE_RESERVATION' | 'VIEW_MENU' | 'ASK_CLARIFICATION' | 'SHOW_RECOMMENDATIONS' | 'OTHER';
  label: string; // Display text
  description?: string;
  payload?: Record<string, any>; // Data needed for action
}

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  conversationId?: string; // Omit to create new conversation
  message: string; // User message
  metadata?: {
    userPreferences?: Record<string, any>;
    location?: string;
  };
}

/**
 * Get Conversation History Request
 */
export interface GetHistoryRequest {
  conversationId: string;
  limit?: number; // Default: 50
  offset?: number; // Default: 0
}

/**
 * AI Service Request (to Python backend)
 */
export interface AIServiceRequest {
  userId: string;
  conversationId: string;
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userPreferences?: {
    cuisines?: string[];
    priceRange?: string;
    location?: string;
  };
}

/**
 * AI Service Response (from Python backend)
 */
export interface AIServiceResponse {
  success: boolean;
  data?: {
    intent: IntentType;
    confidence: number;
    response: string;
    entities?: Entity[];
    metadata?: {
      model: string;
      temperature: number;
      processingTime: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Chat Service Interface (Dependency injection contract)
 */
export interface IChatService {
  // Message operations
  sendMessage(userId: string, request: SendMessageRequest): Promise<Message>;
  getConversationHistory(userId: string, request: GetHistoryRequest): Promise<Message[]>;
  deleteMessage(userId: string, conversationId: string, messageId: string): Promise<void>;

  // Conversation operations
  getConversations(userId: string, limit?: number): Promise<Conversation[]>;
  getConversation(userId: string, conversationId: string): Promise<Conversation | null>;
  createConversation(userId: string): Promise<Conversation>;
  deleteConversation(userId: string, conversationId: string): Promise<void>;
  archiveConversation(userId: string, conversationId: string): Promise<void>;

  // Search operations
  searchConversations(userId: string, query: string): Promise<Conversation[]>;
  searchMessages(userId: string, conversationId: string, query: string): Promise<Message[]>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class ChatError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export enum ChatErrorType {
  CONVERSATION_NOT_FOUND = 'CONVERSATION_NOT_FOUND',
  MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  INVALID_MESSAGE = 'INVALID_MESSAGE',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNKNOWN = 'UNKNOWN',
}

/**
 * USE CONVERSATION HOOK
 * Handles loading and managing messages for a conversation
 * Provides automatic loading, error handling, and persistence
 */

import { useCallback, useEffect, useState } from 'react';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  entities?: any[];
  confidence?: number;
  model?: string;
  temperature?: number;
  processingTime?: number;
  data?: any;
  suggestedReplies?: Array<{ id: string; text: string; icon?: string }>;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  messageCount: number;
  createdAt: Date;
  lastActivityAt?: Date;
}

interface UseConversationResponse {
  messages: Message[];
  conversation: Conversation | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  reloadMessages: (limit?: number, offset?: number) => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Load messages from backend API
 * Called on mount and when conversation changes
 */
const fetchConversationMessages = async (
  token: string,
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ conversation: Conversation; messages: Message[] }> => {
  const url = new URL(`${API_BASE_URL}/api/chat/conversations/${conversationId}`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    conversation: data.data.conversation,
    messages: (data.data.messages || []).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.createdAt || new Date()),
    })),
  };
};



/**
 * Custom hook to manage conversation messages
 * 
 * @param conversationId - The conversation ID to load
 * @param token - Firebase ID token for authentication
 * @param autoLoad - Whether to automatically load messages on mount
 * @returns Object with messages, loading state, and functions
 */
export const useConversation = (
  conversationId: string | undefined,
  token: string | undefined,
  autoLoad: boolean = true
): UseConversationResponse => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Reload messages from backend
   */
  const reloadMessages = useCallback(
    async (limit: number = 50, offset: number = 0) => {
      if (!conversationId || !token) {
        setError('Missing required parameters (conversationId or token)');
        setIsError(true);
        return;
      }

      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const data = await fetchConversationMessages(token, conversationId, limit, offset);
        setConversation(data.conversation);
        setMessages(data.messages);
      } catch (err: any) {
        console.error('❌ Error loading messages:', err);
        setError(err.message || 'Failed to load messages');
        setIsError(true);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, token]
  );

  /**
   * Auto-load messages when component mounts or conversationId changes
   */
  useEffect(() => {
    if (autoLoad && conversationId && token) {
      reloadMessages();
    }
  }, [conversationId, autoLoad, token, reloadMessages]);

  return {
    messages,
    conversation,
    isLoading,
    isError,
    error,
    reloadMessages,
  };
};

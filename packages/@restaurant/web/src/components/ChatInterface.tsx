/**
 * CHAT INTERFACE COMPONENT
 * 
 * This is the main chatbot conversation area where users interact with the AI.
 * It displays messages and handles the chat flow.
 * 
 * Features:
 * - Loads message history from backend on mount
 * - Persists messages to Firestore
 * - Real-time message display
 * - Handles user input and AI responses
 * - Supports both authenticated and guest users
 */

import { useAuth } from '@restaurant/shared';
import { useEffect, useRef, useState } from 'react';
import { useConversation } from '../hooks/useConversation';
import {
    discoverRestaurants,
    extractRestaurantQuery,
    sendChatMessage,
    shouldCallAgent,
} from '../services/chatService';
import { getGuestUser, getSessionToken, isGuestUser } from '../services/guestService';
import ChatInput from './ChatInput';
import ConversationHeader from './ConversationHeader';
import EmptyChatState from './EmptyChatState';
import MessageBubble from './MessageBubble';
import QuickReplyChips from './QuickReplyChips';
import RestaurantCard from './RestaurantCard';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
  suggestedReplies?: Array<{ id: string; text: string; icon?: string }>;
}

interface ChatInterfaceProps {
  conversationId?: string;
  userName?: string;
  showHeader?: boolean;
  onConversationIdChange?: (id: string) => void;
}

export default function ChatInterface({ 
  conversationId: initialConversationId,
  userName = 'Friend',
  showHeader = true,
  onConversationIdChange,
}: ChatInterfaceProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const { user } = useAuth();
  const guestUser = getGuestUser();
  const isGuest = isGuestUser();

  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  // Get auth token from backend session or guest session
  useEffect(() => {
    const getToken = async () => {
      try {
        // Get session token (works for both auth users and guests)
        const token = getSessionToken();
        if (token) {
          console.log(`✅ ${isGuest ? 'Guest' : 'Auth'} token found in localStorage`);
          setAuthToken(token);
        } else {
          console.warn('⚠️  No session token found in localStorage');
        }
      } catch (error) {
        console.warn('Could not retrieve auth token:', error);
      }
    };
    
    // Call getToken for both authenticated users and guests
    if (user || isGuest) {
      getToken();
    }
  }, [user, isGuest]);

  // Load messages from backend using custom hook
  const { 
    messages: loadedMessages, 
    isLoading: isLoadingMessages, 
    error: loadError,
    reloadMessages 
  } = useConversation(conversationId, authToken, true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ============================================
  // SYNC LOADED MESSAGES FROM BACKEND
  // ============================================

  useEffect(() => {
    if (loadedMessages && loadedMessages.length > 0) {
      // Convert backend message format to UI format
      const convertedMessages: Message[] = loadedMessages.map((msg: any) => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'bot',
        content: msg.content,
        timestamp: new Date(msg.timestamp || msg.createdAt),
        data: msg.data,
        suggestedReplies: msg.suggestedReplies,
      }));

      setMessages(convertedMessages);
      console.log(`✅ Loaded ${convertedMessages.length} messages from history`);
    }
  }, [loadedMessages]);

  // ============================================
  // NOTIFY PARENT OF CONVERSATION ID CHANGE
  // ============================================

  useEffect(() => {
    if (conversationId && onConversationIdChange) {
      onConversationIdChange(conversationId);
    }
  }, [conversationId, onConversationIdChange]);

  // ============================================
  // AUTO-SCROLL TO LATEST MESSAGE
  // ============================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ============================================
  // RESPONSIVE HANDLING
  // ============================================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============================================
  // SEND MESSAGE HANDLER
  // ============================================

  const handleSendMessage = async (messageText: string) => {
    // Check if user is authenticated or guest
    const currentUser = user || guestUser;
    
    if (!messageText.trim() || !currentUser || !authToken) {
      console.warn('Cannot send message: missing user/guest, authToken, or message text');
      return;
    }

    // Add user message to UI immediately (optimistic update)
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Step 1: Save user message to backend (creates conversation if needed)
      console.log(`💬 Sending message to backend (conversationId: ${conversationId})`);
      const userId = isGuest 
        ? (guestUser?.id || 'unknown-guest')
        : (user?.uid || user?.email || 'unknown-user');
      
      const sendResponse = await sendChatMessage(
        userId,
        {
          conversationId,
          message: messageText,
        },
        authToken
      );

      // Step 2: Update conversationId if this was a new conversation
      const newConversationId = sendResponse.data?.conversationId;
      if (newConversationId && !conversationId) {
        console.log(`✅ New conversation created: ${newConversationId}`);
        setConversationId(newConversationId);
      }

      // Step 3: Get AI response based on agent type
      const agentType = shouldCallAgent(messageText);

      if (agentType === 'discovery') {
        // Extract restaurant query from user message
        const query = extractRestaurantQuery(messageText);
        
        if (query) {
          // Call Discovery Agent from Python AI service
          const agentResponse = await discoverRestaurants(query);
          
          const botMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: agentResponse.result?.reasoning || 
                     'I found some great restaurants for you! Here are my top recommendations:',
            timestamp: new Date(),
            data: {
              type: 'restaurants',
              restaurants: agentResponse.result?.restaurants || [],
            },
            suggestedReplies: [
              { id: '1', text: 'Show more options', icon: '📊' },
              { id: '2', text: 'Filter by cuisine', icon: '🍽️' },
              { id: '3', text: 'Book this restaurant', icon: '📅' },
              { id: '4', text: 'Save for later', icon: '❤️' }
            ]
          };

          setMessages((prev) => [...prev, botMessage]);
        } else {
          // Fallback if query extraction fails
          const botMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: "I'd love to help you find a restaurant! Could you tell me more about what you're looking for? For example, mention a cuisine type, location, or party size.",
            timestamp: new Date(),
            suggestedReplies: [
              { id: '1', text: 'Find Italian restaurants', icon: '🍝' },
              { id: '2', text: 'Restaurants for 4 people', icon: '👥' },
              { id: '3', text: 'Vegan options', icon: '🥗' }
            ]
          };

          setMessages((prev) => [...prev, botMessage]);
        }
      } else if (agentType === 'reservation') {
        // Booking flow - ask for more details
        const botMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Great! I can help you make a reservation. Please provide:' +
                   '\n• Restaurant name or ID' +
                   '\n• Date (YYYY-MM-DD)' +
                   '\n• Time (HH:MM)' +
                   '\n• Party size',
          timestamp: new Date(),
          suggestedReplies: [
            { id: '1', text: 'View available times', icon: '⏰' },
            { id: '2', text: 'Change date', icon: '📆' },
            { id: '3', text: 'Add special requests', icon: '✏️' }
          ]
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        // General conversation
        const botMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: "That sounds interesting! Would you like me to search for restaurants? Just tell me what you're looking for - cuisine type, location, or party size!",
          timestamp: new Date(),
          suggestedReplies: [
            { id: '1', text: 'Search restaurants', icon: '🔍' },
            { id: '2', text: 'Get help', icon: '❓' }
          ]
        };

        setMessages((prev) => [...prev, botMessage]);
      }

      setIsLoading(false);

      // Step 4: Reload messages to ensure sync with backend
      if (newConversationId) {
        await reloadMessages();
      }
    } catch (error) {
      console.error('❌ Error in chat handler:', error);

      // Fallback error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again or check that the API service is running.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="chat-container">
      {/* CONVERSATION HEADER */}
      {showHeader && (
        <ConversationHeader
          title="Chef Assistant"
          isOnline={true}
          showBack={isMobile}
          onMenu={() => setShowMenuOptions(!showMenuOptions)}
        />
      )}

      {/* MESSAGES AREA */}
      <div className="chat-messages">
        {/* LOADING STATE */}
        {isLoadingMessages && messages.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <div className="typing-indicator" style={{ marginBottom: '10px' }}>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
            <p>Loading message history...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {loadError && (
          <div style={{ padding: '20px', color: '#d32f2f', textAlign: 'center' }}>
            <p>⚠️ {loadError}</p>
            <button 
              onClick={() => reloadMessages()}
              style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {messages.length === 0 && !isLoadingMessages && !loadError && (
          <EmptyChatState 
            userName={userName}
            onQuickStart={handleSendMessage}
          />
        )}

        {/* MESSAGES LIST */}
        {messages.length > 0 && (
          <>
            {messages.map((message, index) => (
              <div key={message.id}>
                <MessageBubble message={message} />

                {/* RESTAURANT CARDS */}
                {message.data?.type === 'restaurants' && (
                  <div className="restaurant-cards-container">
                    {message.data.restaurants.map((restaurant: any) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                )}

                {/* QUICK REPLY CHIPS */}
                {message.suggestedReplies && message.suggestedReplies.length > 0 && (
                  <QuickReplyChips
                    chips={message.suggestedReplies}
                    onChipClick={handleSendMessage}
                    isVisible={index === messages.length - 1}
                  />
                )}
              </div>
            ))}
            </>
        )}

        {/* TYPING INDICATOR */}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <span className="typing-text">Chef Assistant is typing...</span>
          </div>
        )}

        {/* SCROLL ANCHOR */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

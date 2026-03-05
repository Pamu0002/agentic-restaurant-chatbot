/**
 * CHAT INTERFACE COMPONENT
 * 
 * This is the main chatbot conversation area where users interact with the AI.
 * It displays messages and handles the chat flow.
 */

import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import RestaurantCard from './RestaurantCard';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
}

export default function ChatInterface() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! 👋 Welcome to Restaurant Chatbot. I can help you find restaurants, make reservations, and more. What would you like to do today?',
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  // SEND MESSAGE HANDLER
  // ============================================

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call to backend AI service
    setTimeout(() => {
      // Mock bot response based on keywords
      let botResponse = '';
      let responseData = null;

      if (messageText.toLowerCase().includes('restaurant') || messageText.toLowerCase().includes('recommend')) {
        botResponse = 'I found some great restaurants for you! Here are my top recommendations:';
        responseData = {
          type: 'restaurants',
          restaurants: [
            {
              id: '1',
              name: 'The Italian Place',
              cuisine: 'Italian',
              rating: 4.8,
              address: '123 Main St',
              image: '🍝',
            },
            {
              id: '2',
              name: 'Sushi Paradise',
              cuisine: 'Japanese',
              rating: 4.9,
              address: '456 Oak Ave',
              image: '🍣',
            },
            {
              id: '3',
              name: 'Burger Barn',
              cuisine: 'American',
              rating: 4.5,
              address: '789 Pine Rd',
              image: '🍔',
            },
          ],
        };
      } else if (messageText.toLowerCase().includes('book') || messageText.toLowerCase().includes('reserve')) {
        botResponse = 'I can help you book a reservation! Which restaurant would you like to book?';
      } else if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
        botResponse = 'Hi there! How can I help you find the perfect restaurant today? 😊';
      } else {
        botResponse = "That sounds interesting! Would you like me to search for restaurants? Just tell me what you're looking for!";
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        data: responseData,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="chat-container">
      {/* MESSAGES AREA */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />

            {/* RESTAURANT CARDS */}
            {message.data?.type === 'restaurants' && (
              <div style={{ marginTop: '1rem' }}>
                {message.data.restaurants.map((restaurant: any) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* TYPING INDICATOR */}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
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

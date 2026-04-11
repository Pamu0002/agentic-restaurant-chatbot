/**
 * CHAT INPUT COMPONENT
 * 
 * Handles user input and sending messages
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/src/contexts/AuthContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  // ============================================
  // HOOKS
  // ============================================
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================

  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ============================================
  // LOGOUT HANDLER
  // ============================================

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ============================================
  // AUTO-RESIZE TEXTAREA
  // ============================================

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // ============================================
  // SEND MESSAGE HANDLER
  // ============================================

  const handleSend = () => {
    onSendMessage(message);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // ============================================
  // KEYBOARD SHORTCUT: ENTER TO SEND
  // ============================================

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="chat-input-area">
      {/* QUICK ACTIONS (Optional) */}
      <div className="quick-actions" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className="quick-action-btn"
          onClick={() => onSendMessage('Find me a restaurant')}
          disabled={isLoading}
        >
          🍽️ Find Restaurant
        </button>
        <button
          className="quick-action-btn"
          onClick={() => onSendMessage('Make a reservation')}
          disabled={isLoading}
        >
          📅 Book Table
        </button>
        <button
          className="quick-action-btn"
          onClick={() => onSendMessage('Get recommendations')}
          disabled={isLoading}
        >
          ⭐ Recommend
        </button>
        <button
          className="quick-action-btn"
          onClick={() => onSendMessage('My bookings')}
          disabled={isLoading}
        >
          📋 My Bookings
        </button>
        <button
          className="quick-action-btn"
          onClick={handleLogout}
          disabled={isLoading}
          style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: 'white' }}
        >
          🚪 Logout
        </button>
      </div>

      {/* INPUT WRAPPER */}
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="input-field"
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

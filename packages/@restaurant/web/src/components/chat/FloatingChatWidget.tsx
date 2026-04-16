/**
 * FLOATING CHAT WIDGET
 * 
 * Industry-standard floating chat bubble in bottom-right corner
 * Can be collapsed/expanded for both web and mobile
 */

import { useEffect, useState } from 'react';
import ChatInterface from './ChatInterface';
import './FloatingChatWidget.css';

interface FloatingChatWidgetProps {
  userName?: string;
  showHeader?: boolean;
  initialIsOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function FloatingChatWidget({ 
  userName = 'Friend',
  showHeader = true,
  initialIsOpen = false,
  onOpenChange,
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Sync isOpen with parent when initialIsOpen changes
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  // Toggle based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close widget on mobile by default
      if (mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className="floating-chat-widget">
      {/* CHAT WINDOW - Only show if open */}
      {isOpen && (
        <div className={`chat-window ${isMobile ? 'mobile' : 'desktop'}`}>
          <ChatInterface 
            userName={userName}
            showHeader={showHeader}
          />
        </div>
      )}

      {/* CHAT TOGGLE BUTTON */}
      <button
        className={`chat-toggle-button ${isOpen ? 'open' : 'closed'}`}
        onClick={handleToggle}
        title={isOpen ? 'Close chat' : 'Open chat'}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <span className="chat-icon">💬</span>
        )}
      </button>
    </div>
  );
}

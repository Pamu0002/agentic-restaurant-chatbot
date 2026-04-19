/**
 * FLOATING CHAT WIDGET COMPONENT
 * 
 * Industry-standard floating chat widget in bottom-right corner
 * Features:
 * - Minimized button state with chat icon
 * - Expandable chat panel on click
 * - Persistent across all pages
 * - Smooth animations
 * - Responsive design
 */

import { AlertCircle, MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import colors from '../../theme/colors';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'warning';
  text: string;
  timestamp: Date;
}

interface FloatingChatWidgetProps {
  userName?: string;
  showHeader?: boolean;
  initialIsOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function FloatingChatWidget({ 
  userName = 'Guest', 
  showHeader = true,
  initialIsOpen = false,
  onOpenChange 
}: FloatingChatWidgetProps) {
  const navigate = useNavigate();
  const { isOpen: contextIsOpen, openChat: contextOpenChat, closeChat: contextCloseChat } = useChat();
  
  // Use props if provided, otherwise use context
  const [localIsOpen, setLocalIsOpen] = useState(initialIsOpen);
  const isOpen = onOpenChange ? localIsOpen : contextIsOpen;
  
  const openChat = () => {
    if (onOpenChange) {
      setLocalIsOpen(true);
      onOpenChange(true);
    } else {
      contextOpenChat();
    }
  };
  
  const closeChat = () => {
    if (onOpenChange) {
      setLocalIsOpen(false);
      onOpenChange(false);
    } else {
      contextCloseChat();
    }
  };
  
  const [isGuest, setIsGuest] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const [guestLimitReached, setGuestLimitReached] = useState(false);
  const [warningAdded, setWarningAdded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevAuthStateRef = useRef<boolean | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: '👋 Hi! I\'m Chef, your AgentDine assistant. How can I help you find the perfect restaurant today?',
      timestamp: new Date()
    }
  ]);
  
  // Check guest status on component mount - treat unauthenticated users as guests
  useEffect(() => {
    const checkAndHandleAuth = () => {
      // Check multiple possible token storage keys
      const authToken = localStorage.getItem('firebaseAuthToken') || 
                        localStorage.getItem('sessionToken') || 
                        localStorage.getItem('accessToken');
      const isAuthenticated = !!authToken;
      
      console.log('🔍 FloatingChatWidget - Checking all auth keys:');
      console.log('  - firebaseAuthToken:', localStorage.getItem('firebaseAuthToken'));
      console.log('  - sessionToken:', localStorage.getItem('sessionToken'));
      console.log('  - accessToken:', localStorage.getItem('accessToken'));
      console.log('🔍 FloatingChatWidget - Using authToken:', !!authToken);
      console.log('🔍 FloatingChatWidget - Is authenticated:', isAuthenticated); // Debug
      console.log('🔍 FloatingChatWidget - Previous auth state:', prevAuthStateRef.current); // Debug
      console.log('🔍 FloatingChatWidget - Current isGuest state BEFORE update:', isGuest); // Debug
      
      // If authenticated (either on first mount or after signin)
      if (isAuthenticated) {
        console.log('✅ User is AUTHENTICATED - Removing all limitations and warnings');
        
        // Load any saved guest messages only if transitioning from guest to authenticated
        if (prevAuthStateRef.current === false) {
          const savedGuestMessages = localStorage.getItem('guestChatMessages');
          if (savedGuestMessages) {
            try {
              const parsedMessages = JSON.parse(savedGuestMessages);
              console.log('📨 Loading saved guest chat messages:', parsedMessages.length);
              
              setMessages(prev => {
                const filtered = prev.filter(msg => msg.id === '1');
                return [...parsedMessages, ...filtered];
              });
              
              localStorage.removeItem('guestChatMessages');
              localStorage.removeItem('guestMessageCount');
            } catch (error) {
              console.error('Error loading guest messages:', error);
            }
          }
        }
        
        // Remove ALL limitations - this applies to ALL authenticated users
        setIsGuest(false);
        setGuestLimitReached(false);
        setShowGuestWarning(false);
        setWarningAdded(false);
        setGuestMessageCount(0);
        
        // Remove ANY warning messages from state
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.type !== 'warning');
          console.log('🗑️ Filtered messages - BEFORE:', prev.length, 'AFTER:', filtered.length);
          return filtered;
        });
        
        console.log('✅ ALL LIMITATIONS REMOVED - User has FULL UNLIMITED ACCESS!');
        console.log('✅ setIsGuest(false) called - should now be false');
      } else {
        // User is a guest
        console.log('✅ Guest detected (unauthenticated user)');
        setIsGuest(true);
      }
      
      // Update previous auth state
      prevAuthStateRef.current = isAuthenticated;
    };
    
    checkAndHandleAuth();
  }, []);
  
  // Listen for auth state changes - detect when user signs in OR logs out while component is mounted
  useEffect(() => {
    // Check every 500ms for auth token changes (catches same-tab signin/logout)
    const interval = setInterval(() => {
      const authToken = localStorage.getItem('firebaseAuthToken') || 
                        localStorage.getItem('sessionToken') || 
                        localStorage.getItem('accessToken');
      const isAuthenticated = !!authToken;
      
      console.log('🔄 Auth Check - Current:', isAuthenticated, 'Previous:', prevAuthStateRef.current, 'isGuest:', isGuest);
      
      // DETECT: was guest → now authenticated (SIGN IN)
      if (prevAuthStateRef.current === false && isAuthenticated && isGuest) {
        console.log('🔔 DETECTED: User just SIGNED IN! Granting unlimited access...');
        
        // Load saved guest messages
        const savedGuestMessages = localStorage.getItem('guestChatMessages');
        if (savedGuestMessages) {
          try {
            const parsedMessages = JSON.parse(savedGuestMessages);
            console.log('📨 Loading saved guest messages after sign-in:', parsedMessages.length);
            
            // Set messages with only user/bot messages (remove warnings)
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id === '1' || (msg.type === 'user' || msg.type === 'bot'));
              return [...parsedMessages, ...filtered];
            });
            
            localStorage.removeItem('guestChatMessages');
            localStorage.removeItem('guestMessageCount');
          } catch (error) {
            console.error('Error loading guest messages:', error);
          }
        }
        
        // Remove ALL limitations and clear warning messages
        setIsGuest(false);
        setGuestLimitReached(false);
        setShowGuestWarning(false);
        setWarningAdded(false);
        setGuestMessageCount(0);
        
        // Remove any warning messages from state
        setMessages(prev => prev.filter(msg => msg.type !== 'warning'));
        
        console.log('✅ ALL LIMITATIONS REMOVED - User now has FULL UNLIMITED ACCESS!');
        prevAuthStateRef.current = true;
      }
      
      // DETECT: was authenticated → now guest (SIGN OUT / LOGOUT)
      if (prevAuthStateRef.current === true && !isAuthenticated && !isGuest) {
        console.log('🔔 DETECTED: User just LOGGED OUT! Restoring guest limitations...');
        
        // Save current chat messages (both user and bot, no warnings)
        const currentMessages = messages.filter(msg => msg.type === 'user' || msg.type === 'bot');
        if (currentMessages.length > 0) {
          localStorage.setItem('guestChatMessages', JSON.stringify(currentMessages));
          localStorage.setItem('guestMessageCount', '0');
          console.log('💾 Saved messages for guest session:', currentMessages.length);
        }
        
        // Restore GUEST limitations
        setIsGuest(true);
        setGuestLimitReached(false);
        setShowGuestWarning(false);
        setWarningAdded(false);
        setGuestMessageCount(0);
        
        // Add warning message to show guest is back
        const warningMessage: Message = {
          id: 'guest-warning-logout-' + Date.now(),
          type: 'warning',
          text: '⏱️ You\'ve been logged out. As a guest user, you can enjoy a maximum of 3 chat interactions. Sign in to chat unlimitedly!',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, warningMessage]);
        
        console.log('✅ GUEST MODE RESTORED - User has 3 message limit again!');
        prevAuthStateRef.current = false;
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [isGuest, messages]);
  
  // Save guest messages to localStorage whenever messages change (for guests only)
  useEffect(() => {
    if (isGuest && messages.length > 1) {
      try {
        // Only save user and bot messages (no warnings, no initial message)
        const messagesToSave = messages.filter(
          msg => (msg.type === 'user' || msg.type === 'bot') && msg.id !== '1'
        );
        
        if (messagesToSave.length > 0) {
          localStorage.setItem('guestChatMessages', JSON.stringify(messagesToSave));
          localStorage.setItem('guestMessageCount', guestMessageCount.toString());
          console.log('💾 Saved guest messages to localStorage:', messagesToSave.length);
        }
      } catch (error) {
        console.error('Error saving guest messages:', error);
      }
    }
  }, [messages, isGuest, guestMessageCount]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add guest warning when chat opens (if user is guest) - BUT NOT for authenticated users
  useEffect(() => {
    if (isOpen && isGuest && !warningAdded && !guestLimitReached) {
      console.log('Adding guest warning message'); // Debug
      const warningMessage: Message = {
        id: 'guest-warning-initial',
        type: 'warning',
        text: '⏱️ As a guest user, you can enjoy a maximum of 3 chat interactions. Sign up to chat unlimitedly!',
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // Only add if not already there
        if (!prev.some(msg => msg.id === 'guest-warning-initial')) {
          return [warningMessage, ...prev];
        }
        return prev;
      });
      setWarningAdded(true);
    }
  }, [isOpen, isGuest, warningAdded, guestLimitReached]);

  // Sync initialIsOpen prop with local state
  useEffect(() => {
    if (onOpenChange) {
      setLocalIsOpen(initialIsOpen);
    }
  }, [initialIsOpen, onOpenChange]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Authenticated users have unlimited access - no limits!
    if (!isGuest) {
      // User is authenticated - send without any restrictions
    } else {
      // Only guests have limitations
      if (guestMessageCount >= 3) {
        console.log('⛔ Guest reached 3 message limit');
        return;
      }
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    
    // Only increment count for guests
    if (isGuest) {
      const newCount = guestMessageCount + 1;
      setGuestMessageCount(newCount);

      // Check if this is the 3rd message for guest
      if (newCount >= 3) {
        setGuestLimitReached(true);
      }
    }

    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: generateBotResponse(userInput),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);

      // Add limit reached message ONLY for guests after 3rd interaction
      if (isGuest && guestMessageCount >= 2) { // 2 because we already incremented
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: 'limit-reached-' + Date.now(),
              type: 'warning',
              text: '🔒 You\'ve reached your 3 guest chat interactions limit! Sign up or log in to enjoy unlimited conversations and make reservations.',
              timestamp: new Date()
            }
          ]);
        }, 500);
      }

      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (
      input.includes('pizza') ||
      input.includes('italian') ||
      input.includes('pasta')
    ) {
      return '🍕 I found some amazing Italian restaurants! Would you like me to show you:\n- Pizza Palace (⭐ 4.7)\n- Bella Italia (⭐ 4.8)\n- Spaghetti Heaven (⭐ 4.6)';
    }

    if (
      input.includes('seafood') ||
      input.includes('fish') ||
      input.includes('crab')
    ) {
      return '🦞 Great choice! Here are top seafood restaurants:\n- The Lagoon (⭐ 4.8)\n- Ministry of Crab (⭐ 4.9)\n- Fish Delight (⭐ 4.7)';
    }

    if (
      input.includes('sri lankan') ||
      input.includes('srilankan') ||
      input.includes('curry')
    ) {
      return '🍲 Sri Lankan cuisine is amazing! Check these out:\n- Laksha Restaurant (⭐ 4.9)\n- Curry House (⭐ 4.6)\n- Local Flavours (⭐ 4.7)';
    }

    if (input.includes('book') || input.includes('reservation')) {
      return '📅 I can help you make a reservation! When would you like to book?\n- Today\n- Tomorrow\n- This weekend\n- Pick a date';
    }

    if (input.includes('recommend')) {
      return "🎯 To give you the best recommendation, tell me:\n- What cuisine do you like?\n- What's your budget?\n- What time do you want to dine?";
    }

    return "🤔 I can help you find the perfect restaurant, make a reservation, or explore cuisines. What would you like to do?\n\n- 🍽️ Discover restaurants\n- 🗺️ Search by location\n- 📅 Make a reservation";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* Floating Button (Minimized) */}
        {!isOpen && (
          <button
            onClick={openChat}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: colors.gradient.primary,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px rgba(255, 107, 53, 0.4)`,
              transition: 'all 0.3s ease',
              animation: 'pulse 2s infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = `0 6px 28px rgba(255, 107, 53, 0.6)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(255, 107, 53, 0.4)`;
            }}
            title="Chat with AgentDine"
          >
            <MessageCircle size={28} />
          </button>
        )}

        {/* Chat Panel (Expanded) */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '380px',
              maxWidth: '90vw',
              height: '600px',
              background: colors.background.card,
              borderRadius: '12px',
              border: `1px solid ${colors.border.default}`,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px',
                background: colors.gradient.primary,
                color: 'white',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${colors.border.default}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle size={20} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>
                    AgentDine Assistant
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Online now</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: colors.background.main,
                borderRadius: '0 0 0 12px',
                scrollBehavior: 'smooth'
              }}
            >
              {(() => {
                const filtered = messages.filter(msg => isGuest || msg.type !== 'warning');
                console.log('📊 RENDER - isGuest:', isGuest, '| Total messages:', messages.length, '| Filtered messages:', filtered.length);
                console.log('📊 RENDER - Messages before filter:', messages.map(m => ({ id: m.id, type: m.type })));
                console.log('📊 RENDER - Messages after filter:', filtered.map(m => ({ id: m.id, type: m.type })));
                return filtered;
              })()
                .map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent:
                      message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {message.type === 'warning' ? (
                    // Warning message styling
                    <div
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: message.id.includes('limit-reached') ? '#fee2e2' : '#fef3c7',
                        border: `1px solid ${message.id.includes('limit-reached') ? '#fca5a5' : '#fbbf24'}`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <AlertCircle size={18} style={{ color: message.id.includes('limit-reached') ? '#dc2626' : '#d97706', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{
                          margin: 0,
                          color: message.id.includes('limit-reached') ? '#7f1d1d' : '#92400e',
                          fontSize: '13px',
                          fontWeight: '500',
                          lineHeight: '1.4',
                        }}>
                          {message.text}
                        </p>
                      </div>
                      {message.id.includes('limit-reached') && (
                        <button
                          onClick={() => navigate('/signin')}
                          style={{
                            marginLeft: '28px',
                            padding: '8px 16px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#b91c1c';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#dc2626';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          Sign In Now
                        </button>
                      )}
                    </div>
                  ) : (
                    // Regular message styling
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background:
                          message.type === 'user'
                            ? colors.primary.base
                            : colors.background.card,
                        color:
                          message.type === 'user'
                            ? 'white'
                            : colors.text.primary,
                        fontSize: '14px',
                        lineHeight: '1.4',
                        wordWrap: 'break-word',
                        boxShadow:
                          message.type === 'user'
                            ? `0 2px 8px rgba(255, 107, 53, 0.2)`
                            : `0 2px 8px rgba(0, 0, 0, 0.1)`
                      }}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: colors.text.secondary,
                      animation: 'bounce 1.4s infinite'
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: colors.text.secondary,
                      animation: 'bounce 1.4s infinite 0.2s'
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: colors.text.secondary,
                      animation: 'bounce 1.4s infinite 0.4s'
                    }}
                  />
                </div>
              )}

              {/* Quick Replies - Show when only bot messages (no user messages yet) */}
              {messages.filter(msg => msg.type === 'user').length === 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: colors.text.secondary, fontWeight: '500' }}>Quick replies:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['🍽️ Find me a restaurant', '🍕 Italian restaurants', '🦞 Seafood places', '📅 Make reservation', '🍲 Sri Lankan'].map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputValue(reply);
                          setTimeout(
                            () =>
                              handleSendMessage(),
                            100
                          );
                        }}
                        style={{
                          padding: '8px 12px',
                          background: colors.background.card,
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: '8px',
                          color: colors.text.primary,
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = colors.primary.base;
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = colors.primary.base;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = colors.background.card;
                          e.currentTarget.style.color = colors.text.primary;
                          e.currentTarget.style.borderColor = colors.border.default;
                        }}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: '12px',
                borderTop: `1px solid ${colors.border.default}`,
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
                backgroundColor: colors.background.card,
                borderRadius: '0 0 12px 12px',
                opacity: (isGuest && guestLimitReached) ? 0.6 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isGuest && guestLimitReached ? "Chat limit reached. Sign up to continue!" : "Ask me anything..."}
                disabled={isGuest && guestLimitReached}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: `1px solid ${isGuest && guestLimitReached ? '#dc2626' : colors.border.default}`,
                  borderRadius: '8px',
                  background: isGuest && guestLimitReached ? '#fee2e2' : colors.background.main,
                  color: colors.text.primary,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  maxHeight: '80px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  cursor: isGuest && guestLimitReached ? 'not-allowed' : 'text'
                }}
                onFocus={(e) => {
                  if (!(isGuest && guestLimitReached)) {
                    e.currentTarget.style.borderColor = colors.primary.base;
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = isGuest && guestLimitReached ? '#dc2626' : colors.border.default;
                }}
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping || (isGuest && guestLimitReached)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: isGuest && guestLimitReached ? '#9ca3af' : colors.gradient.primary,
                  border: 'none',
                  color: 'white',
                  cursor: !inputValue.trim() || isTyping || (isGuest && guestLimitReached) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: !inputValue.trim() || isTyping || (isGuest && guestLimitReached) ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: `0 2px 8px rgba(255, 107, 53, 0.2)`
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim() && !isTyping && !(isGuest && guestLimitReached)) {
                    e.currentTarget.style.boxShadow = `0 4px 12px rgba(255, 107, 53, 0.4)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 2px 8px rgba(255, 107, 53, 0.2)`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title={isGuest && guestLimitReached ? "Chat limit reached for guest users" : "Send message"}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          40% {
            transform: translateY(-8px);
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
}

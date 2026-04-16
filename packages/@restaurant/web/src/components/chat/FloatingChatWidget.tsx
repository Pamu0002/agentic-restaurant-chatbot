import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import styles from './FloatingChatWidget.module.css';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function FloatingChatWidget() {
  const { isOpen, openChat, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: '👋 Welcome to AgentDine! How can I help you find the perfect restaurant today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: `I'm an AI assistant. I received your message: "${inputValue}". How else can I help you?`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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
      <div className={styles.widgetContainer}>
        {/* Floating Button (Minimized) */}
        {!isOpen && (
          <button
            onClick={openChat}
            className={styles.floatingButton}
            title="Chat with AgentDine"
          >
            <MessageCircle size={28} />
          </button>
        )}

        {/* Chat Panel (Expanded) */}
        {isOpen && (
          <div className={styles.chatPanel}>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <MessageCircle size={20} />
                <div>
                  <h3 className={styles.headerTitle}>AgentDine Assistant</h3>
                  <p className={styles.headerStatus}>Online now</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className={styles.closeButton}
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageWrapper} ${
                    message.type === 'user' ? styles.messageWrapperUser : styles.messageWrapperBot
                  }`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.type === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className={styles.inputField}
              />
              <button
                onClick={handleSendMessage}
                className={styles.sendButton}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * MESSAGE BUBBLE COMPONENT
 * 
 * Displays individual chat messages with different styles for user vs bot
 * Includes timestamps, read receipts, and smooth animations
 */

interface MessageBubbleProps {
  message: {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  };
  showTimestamp?: boolean;
  isRead?: boolean;
}

export default function MessageBubble({ 
  message, 
  showTimestamp = true,
  isRead = true 
}: MessageBubbleProps) {
  const isUser = message.type === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-group ${isUser ? 'user' : 'bot'}`}>
      <div className={`message-bubble ${message.type}`}>
        <p className="message-content">{message.content}</p>
        
        {showTimestamp && (
          <div className="message-footer">
            <span className="message-timestamp">
              {formatTime(message.timestamp)}
            </span>
            {isUser && (
              <span className="message-read-receipt" title={isRead ? 'Read' : 'Sent'}>
                {isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

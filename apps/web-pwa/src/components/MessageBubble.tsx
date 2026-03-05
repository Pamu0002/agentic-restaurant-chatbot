/**
 * MESSAGE BUBBLE COMPONENT
 * 
 * Displays individual chat messages with different styles for user vs bot
 */


interface MessageBubbleProps {
  message: {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`message-group ${isUser ? 'user' : 'bot'}`}>
      <div className={`message-bubble ${message.type}`}>
        <p>{message.content}</p>
        <div className="message-timestamp">
          {/* Using simple time format since date-fns might not be installed */}
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

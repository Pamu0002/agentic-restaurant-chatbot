/**
 * CONVERSATION HISTORY COMPONENT
 * 
 * Displays list of past conversations with search and management options
 */

interface Conversation {
  id: string;
  title?: string;
  lastMessage: string;
  lastMessageTime: string;
  timestamp: Date;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}

export default function ConversationHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  isLoading = false
}: ConversationHistoryProps) {
  const groupedConversations = groupByTime(conversations);

  function groupByTime(convs: Conversation[]) {
    const now = new Date();
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: []
    };

    convs.forEach((conv) => {
      const daysDiff = Math.floor((now.getTime() - conv.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) groups['Today'].push(conv);
      else if (daysDiff === 1) groups['Yesterday'].push(conv);
      else if (daysDiff <= 7) groups['This Week'].push(conv);
      else groups['Older'].push(conv);
    });

    return Object.entries(groups).filter(([_, convs]) => convs.length > 0);
  }

  return (
    <div className="conversation-history">
      {/* HEADER */}
      <div className="history-header">
        <h2 className="history-title">Conversations</h2>
        <button className="new-chat-btn" onClick={onNewChat} aria-label="Start new chat">
          ➕ New Chat
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="history-search-container">
        <input
          type="text"
          className="history-search"
          placeholder="Search conversations..."
          aria-label="Search conversations"
        />
      </div>

      {/* CONVERSATIONS LIST */}
      {isLoading ? (
        <div className="history-loading">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">💬</div>
          <p>No conversations yet</p>
          <p className="empty-hint">Start chatting to see your history</p>
          <button className="empty-new-chat-btn" onClick={onNewChat}>
            Start Chatting
          </button>
        </div>
      ) : (
        <div className="history-list">
          {groupedConversations.map(([timeGroup, convs]) => (
            <div key={timeGroup} className="history-group">
              <h3 className="history-group-title">{timeGroup}</h3>
              {convs.map((conv) => (
                <div
                  key={conv.id}
                  className="history-item"
                  onMouseEnter={(e) => {
                    const deleteBtn = e.currentTarget.querySelector('.history-delete-btn');
                    if (deleteBtn) deleteBtn.classList.add('visible');
                  }}
                  onMouseLeave={(e) => {
                    const deleteBtn = e.currentTarget.querySelector('.history-delete-btn');
                    if (deleteBtn) deleteBtn.classList.remove('visible');
                  }}
                >
                  <button
                    className="history-item-content"
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <div className="history-item-title">
                      {conv.title || conv.lastMessage.substring(0, 40) + '...'}
                    </div>
                    <div className="history-item-time">{conv.lastMessageTime}</div>
                  </button>
                  <button
                    className="history-delete-btn"
                    onClick={() => {
                      if (confirm('Delete this conversation?')) {
                        onDeleteConversation(conv.id);
                      }
                    }}
                    aria-label="Delete conversation"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

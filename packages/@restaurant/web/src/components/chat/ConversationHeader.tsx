/**
 * CONVERSATION HEADER COMPONENT
 * 
 * Top bar with conversation title, online status, menu options, and user profile
 */

import UserProfileMenu from '../common/UserProfileMenu';

interface ConversationHeaderProps {
  title?: string;
  onBack?: () => void;
  onMenu?: () => void;
  onLogout?: () => void;
  isOnline?: boolean;
  showBack?: boolean;
}

export default function ConversationHeader({
  title = 'Chef Assistant',
  onBack,
  onMenu,
  onLogout,
  isOnline = true,
  showBack = false
}: ConversationHeaderProps) {
  return (
    <div className="conversation-header">
      <div className="conversation-header-left">
        {showBack && (
          <button 
            className="back-button" 
            onClick={onBack}
            aria-label="Go back"
          >
            ← Back
          </button>
        )}
        
        <div className="conversation-info">
          <h2 className="conversation-title">{title}</h2>
          <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="conversation-header-right">
        {onMenu && (
          <button 
            className="menu-button" 
            onClick={onMenu}
            aria-label="Menu"
          >
            ⋮
          </button>
        )}
        
        <UserProfileMenu onLogout={onLogout} />
      </div>
    </div>
  );
}

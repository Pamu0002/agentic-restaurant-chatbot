/**
 * USER SIDEBAR COMPONENT
 * 
 * Displays user profile and menu options
 */

interface UserSidebarProps {
  onClose: () => void;
}

export default function UserSidebar({ onClose }: UserSidebarProps) {
  // ============================================
  // MOCK USER DATA
  // ============================================

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👤',
  };

  const menuItems = [
    { icon: '📋', label: 'My Reservations', action: () => alert('Showing your reservations...') },
    { icon: '❤️', label: 'Favorites', action: () => alert('Showing your favorite restaurants...') },
    { icon: '⭐', label: 'Reviews', action: () => alert('Showing your reviews...') },
    { icon: '⚙️', label: 'Settings', action: () => alert('Opening settings...') },
    { icon: '📞', label: 'Support', action: () => alert('Opening support...') },
    { icon: '🚪', label: 'Logout', action: () => alert('Logging out...') },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div>
      {/* HEADER */}
      <div className="sidebar-header">
        <h3 className="sidebar-title">Menu</h3>
        <button className="sidebar-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* USER PROFILE */}
      <div className="user-profile">
        <div className="user-avatar">{user.avatar}</div>
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
      </div>

      {/* MENU ITEMS */}
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="menu-item"
            onClick={item.action}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

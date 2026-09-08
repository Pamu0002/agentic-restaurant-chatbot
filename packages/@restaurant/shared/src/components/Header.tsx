/**
 * HEADER COMPONENT
 * 
 * Top navigation bar for all portals (web, admin, support, provider)
 * Includes logo, portal name, user menu, and navigation
 */

import { Logo } from './Logo';

interface HeaderProps {
  portalType?: 'web' | 'admin' | 'support' | 'provider' | 'analytics';
  onLogoClick?: () => void;
  title?: string;
  rightContent?: React.ReactNode;
}

type PortalType = 'web' | 'admin' | 'support' | 'provider' | 'analytics';

const portalConfig: Record<PortalType, { name: string; color: string }> = {
  web: { name: '🍽️ DineBot', color: '#00d4ff' },
  admin: { name: '🛡️ Admin Panel', color: '#ff6b6b' },
  support: { name: '💬 Support', color: '#51cf66' },
  provider: { name: '🏢 Provider Portal', color: '#ffd43b' },
  analytics: { name: '📊 Analytics', color: '#845ef7' },
};

export function Header({
  portalType = 'web',
  onLogoClick,
  title,
  rightContent,
}: HeaderProps) {
  const config = portalConfig[portalType as PortalType] || portalConfig.web;
  const displayTitle = title || config?.name || 'DineBot';

  return (
    <header
      style={{
        width: '100%',
        height: '70px',
        background: 'linear-gradient(90deg, rgba(15, 20, 25, 0.95), rgba(26, 40, 56, 0.9))',
        borderBottom: `2px solid ${config?.color || '#00d4ff'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: `0 2px 8px rgba(0, 212, 255, 0.1)`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LEFT - LOGO AND TITLE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: onLogoClick ? 'pointer' : 'default',
        }}
        onClick={onLogoClick}
      >
        <Logo size="small" showText={false} />
        <div
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: config?.color || '#00d4ff',
            letterSpacing: '0.5px',
          }}
        >
          {displayTitle}
        </div>
      </div>

      {/* RIGHT - CUSTOM CONTENT OR USER MENU PLACEHOLDER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {rightContent || (
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: config?.color || '#00d4ff',
              color: '#0f1419',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Menu
          </button>
        )}
      </div>
    </header>
  );
}

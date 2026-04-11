/**
 * LOGO COMPONENT
 * 
 * Displays the agentdine-logo.svg
 * Used in welcome screen and various portals
 */

type SizeType = 'small' | 'medium' | 'large';

interface LogoProps {
  size?: SizeType;
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ size = 'medium', showText = true, onClick }: LogoProps) {
  const sizeMap: Record<SizeType, { img: string; gap: string; text: string }> = {
    small: { img: '40px', gap: '8px', text: '14px' },
    medium: { img: '60px', gap: '12px', text: '18px' },
    large: { img: '100px', gap: '16px', text: '24px' },
  };

  const config = sizeMap[size as SizeType] || sizeMap.medium;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: config.gap,
        cursor: onClick ? 'pointer' : 'default',
        padding: '8px 12px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* LOGO IMAGE */}
      <img
        src="/assets/logos/agentdine-logo.svg"
        alt="AgentDine Logo"
        style={{
          width: config.img,
          height: config.img,
          objectFit: 'contain',
          borderRadius: '8px',
        }}
      />

      {/* LOGO TEXT */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div
            style={{
              fontSize: config.text,
              fontWeight: '700',
              background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}
          >
            AgentDine
          </div>
        </div>
      )}
    </div>
  );
}

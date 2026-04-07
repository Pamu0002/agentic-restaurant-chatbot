/**
 * WELCOME SCREEN COMPONENT
 * 
 * USER STORIES:
 * 1. Display Welcome Screen on App Launch for new Users
 * 2. Display system logo and chatbot introduction
 * 
 * This is the first screen users see when they launch the app
 * Shows the system logo and introduction to the chatbot
 */

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function WelcomeScreen({ onSignIn, onSignUp }: WelcomeScreenProps) {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(rgba(15, 20, 25, 0.7), rgba(26, 40, 56, 0.7)), url(/background-food.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    }}>
      {/* CARD CONTAINER */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(15, 20, 25, 0.95)',
        border: '2px solid',
        borderImage: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%) 1',
        borderRadius: '20px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1), 0 0 60px rgba(0, 153, 204, 0.05)',
        position: 'relative',
        margin: '20px',
      }}>
        {/* BLUE CORNER ACCENTS */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #00d4ff',
          borderLeft: '2px solid #00d4ff',
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #00d4ff',
          borderRight: '2px solid #00d4ff',
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #00d4ff',
          borderLeft: '2px solid #00d4ff',
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #00d4ff',
          borderRight: '2px solid #00d4ff',
          borderRadius: '2px',
        }} />

        {/* LOGO */}
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
        }}>
          🍽️
        </div>

        {/* BRAND NAME */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 20px 0',
          letterSpacing: '2px',
        }}>
          DineBot
        </h1>

        {/* MAIN TAGLINE */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#ffffff',
          margin: '0 0 20px 0',
          lineHeight: '1.4',
        }}>
          Discover Your<br />
          Perfect<br />
          Restaurant,<br />
          Instantly
        </h2>

        {/* SUBTITLE */}
        <p style={{
          fontSize: '14px',
          color: '#b0b8c1',
          margin: '0 0 40px 0',
          lineHeight: '1.5',
        }}>
          Tell our chatbot what you're craving and find<br />
          the best spots in seconds.
        </p>

        {/* BUTTONS */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '30px',
        }}>
          {/* SIGN UP BUTTON */}
          <button
            onClick={onSignUp}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#E64A19',
              color: '#FDFCFB',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(230, 74, 25, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 74, 25, 0.4)';
              e.currentTarget.style.background = '#C62828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(230, 74, 25, 0.3)';
              e.currentTarget.style.background = '#E64A19';
            }}
          >
            Sign Up
          </button>

          {/* LOG IN BUTTON */}
          <button
            onClick={onSignIn}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'rgba(80, 90, 105, 0.5)',
              color: '#ffffff',
              border: '1px solid rgba(100, 110, 130, 0.5)',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(100, 110, 130, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(150, 160, 180, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(80, 90, 105, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(100, 110, 130, 0.5)';
            }}
          >
            Log In
          </button>
        </div>

        {/* DIVIDER */}
        <div style={{
          textAlign: 'center',
          color: '#505a6a',
          margin: '30px 0',
          fontSize: '12px',
        }}>
          — Or —
        </div>

        {/* SOCIAL PROOF - AVATARS & TEXT */}
        <div style={{
          textAlign: 'center',
        }}>
          {/* AVATAR CIRCLES */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '-8px',
            marginBottom: '12px',
            position: 'relative',
            height: '40px',
          }}>
            {[
              { bg: '#FF6B6B', initial: '👨' },
              { bg: '#4ECDC4', initial: '👩' },
              { bg: '#FFE66D', initial: '👨' },
              { bg: '#95E1D3', initial: '👩' },
            ].map((avatar, idx) => (
              <div
                key={idx}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: avatar.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  border: '2px solid #0f1419',
                  marginLeft: idx > 0 ? '-12px' : '0',
                  zIndex: 4 - idx,
                }}
              >
                {avatar.initial}
              </div>
            ))}
          </div>

          {/* TEXT */}
          <p style={{
            fontSize: '12px',
            color: '#b0b8c1',
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '600',
          }}>
            JOIN 10,000+ FOOD LOVERS
          </p>
        </div>
      </div>
    </div>
  );
}

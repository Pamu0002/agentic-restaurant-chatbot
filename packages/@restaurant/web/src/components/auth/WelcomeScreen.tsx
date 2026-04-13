/**
 * WELCOME SCREEN COMPONENT
 * 
 * USER STORIES:
 * 1. Display Welcome Screen on App Launch for new Users
 * 2. Display system logo and chatbot introduction
 * 3. Allow guests to browse without authentication
 * 
 * This is the first screen users see when they launch the app
 * Shows the system logo and introduction to the chatbot
 */

import { useState, useEffect } from 'react';
import { createGuestSession } from '../../services/guestService';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onGuestContinue?: (guestId: string) => void;
}

export default function WelcomeScreen({ onSignIn, onSignUp, onGuestContinue }: WelcomeScreenProps) {
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContinueAsGuest = async () => {
    try {
      setIsCreatingGuest(true);
      setError(null);
      console.log('🎯 Starting guest session creation...');
      const session = await createGuestSession();
      console.log('✅ Guest session created successfully, navigating to chat...');
      onGuestContinue?.(session.guestId);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create guest session';
      console.error('❌ Guest session error:', errorMessage);
      setError(errorMessage);
      setIsCreatingGuest(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, rgba(20, 15, 25, 0.8), rgba(40, 25, 35, 0.8)), url(/background-food.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      flexDirection: isMobile ? 'column' : 'row',
    }}>
      {/* LEFT HERO SECTION */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        minHeight: isMobile ? '50vh' : '100vh',
      }}>
        {/* LOGO */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'fadeInDown 0.8s ease',
        }}>
          <img 
            src="/chatbot_logo.png" 
            alt="AgentDine Chatbot Logo"
            style={{
              height: '100px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 25px rgba(255, 107, 53, 0.5))',
            }}
          />
        </div>

        {/* BRAND NAME */}
        <h1 style={{
          fontSize: isMobile ? '36px' : '52px',
          fontWeight: '800',
          color: '#FF8C42',
          margin: '0 0 15px 0',
          letterSpacing: '3px',
          textShadow: '0 0 30px rgba(255, 107, 53, 0.4)',
        }}>
          AgentDine
        </h1>

        {/* MAIN TAGLINE */}
        <h2 style={{
          fontSize: isMobile ? '24px' : '38px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 20px 0',
          lineHeight: '1.3',
          maxWidth: '500px',
        }}>
          Discover Your Perfect Restaurant,<br />
          <span style={{ background: 'linear-gradient(135deg, #FF6B35, #FFD700)', 
                         WebkitBackgroundClip: 'text', 
                         WebkitTextFillColor: 'transparent',
                         backgroundClip: 'text' }}>
            Instantly
          </span>
        </h2>

        {/* SUBTITLE */}
        <p style={{
          fontSize: isMobile ? '13px' : '16px',
          color: '#b0b8c1',
          margin: '0 0 40px 0',
          lineHeight: '1.6',
          maxWidth: '500px',
        }}>
          Chat with our AI assistant to find restaurants tailored to your taste, <br />
          get personalized recommendations, and book instantly.
        </p>

        {/* FEATURES - DESKTOP ONLY */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '600px',
          }}>
            {[
              { icon: '🤖', label: 'AI-Powered', desc: 'Smart recommendations' },
              { icon: '⚡', label: 'Instant Booking', desc: 'Reserve in seconds' },
              { icon: '❤️', label: 'Personalized', desc: 'Just for you' },
            ].map((feature, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#FF8C42' }}>{feature.label}</div>
                <div style={{ fontSize: '11px', color: '#b0b8c1' }}>{feature.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT ACTION PANEL */}
      <div style={{
        flex: '0 0 auto',
        width: isMobile ? '100%' : '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: isMobile ? '50vh' : '100vh',
      }}>
        {/* CARD CONTAINER */}
        <div style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '380px',
          background: 'rgba(15, 20, 25, 0.95)',
          border: '2px solid',
          borderImage: 'linear-gradient(135deg, #FF8C42 0%, #FFB84D 100%) 1',
          borderRadius: '20px',
          padding: '40px 30px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.15), 0 0 60px rgba(255, 140, 66, 0.08)',
          position: 'relative',
        }}>
        {/* CORNER ACCENTS */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #FF8C42',
          borderLeft: '2px solid #FF8C42',
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #FF8C42',
          borderRight: '2px solid #FF8C42',
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #FF8C42',
          borderLeft: '2px solid #FF8C42',
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #FF8C42',
          borderRight: '2px solid #FF8C42',
          borderRadius: '2px',
        }} />

        {/* TITLE - FOR ACTION PANEL */}
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 10px 0',
          letterSpacing: '1px',
        }}>
          Welcome Back
        </h3>

        <p style={{
          fontSize: '13px',
          color: '#b0b8c1',
          margin: '0 0 30px 0',
          lineHeight: '1.5',
        }}>
          Sign in to your account or create a new one to get started.
        </p>

        {/* BUTTONS */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '30px',
        }}>
          {/* GUEST BUTTON - PRIMARY CTA */}
          <button
            onClick={handleContinueAsGuest}
            disabled={isCreatingGuest}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
              color: '#FDFCFB',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isCreatingGuest ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: isCreatingGuest ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isCreatingGuest) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.4)';
            }}
          >
            {isCreatingGuest ? '⏳ Starting...' : '👋 Continue as Guest'}
          </button>

          {/* SIGN UP BUTTON */}
          <button
            onClick={onSignUp}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#E63946',
              color: '#FDFCFB',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(230, 57, 70, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.5)';
              e.currentTarget.style.background = '#D62828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(230, 57, 70, 0.4)';
              e.currentTarget.style.background = '#E63946';
            }}
          >
            Create Account
          </button>

          {/* LOG IN BUTTON */}
          <button
            onClick={onSignIn}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'rgba(100, 80, 85, 0.4)',
              color: '#ffffff',
              border: '1px solid rgba(255, 140, 66, 0.4)',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 140, 66, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(100, 80, 85, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.4)';
            }}
          >
            Sign In
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{
            background: 'rgba(230, 57, 70, 0.15)',
            border: '1px solid rgba(230, 57, 70, 0.6)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#FF8C7A',
            fontSize: '13px',
            lineHeight: '1.5',
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '600' }}>⚠️ Error:</div>
            <div style={{ marginBottom: '8px' }}>{error}</div>
            <div style={{ fontSize: '12px', color: '#ffab91' }}>
              ℹ️ Make sure backend API is running on http://localhost:5000
            </div>
          </div>
        )}

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
              { bg: '#FF8C42', initial: '👨' },
              { bg: '#FFB84D', initial: '👩' },
              { bg: '#E63946', initial: '👨' },
              { bg: '#F4A460', initial: '👩' },
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
                  border: '2px solid #1a1218',
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
    </div>
  );
}

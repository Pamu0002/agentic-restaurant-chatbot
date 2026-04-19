import { useAuth } from '@restaurant/shared';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import colors from '../../theme/colors';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/restaurants' },
    { label: 'How it Works', path: '/how-it-works' },
    { label: 'About', path: '/about' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: colors.background.main,
        borderBottom: `1px solid ${colors.border.default}`,
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: '900',
              background: colors.gradient.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-1px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            Agent
            <span
              style={{
                background: colors.gradient.primaryReverse,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Dine
            </span>
          </span>
          <div
            style={{
              width: '3px',
              height: '24px',
              background: colors.gradient.primary,
              borderRadius: '2px',
              marginLeft: '6px'
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? colors.primary.base : colors.text.primary,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease',
                borderBottom: isActive(link.path) ? `3px solid ${colors.primary.base}` : 'none',
                paddingBottom: isActive(link.path) ? '8px' : '0px'
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.color = colors.primary.base;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.color = colors.text.primary;
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / Profile Section */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {user ? (
            // Profile Dropdown
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  padding: '8px 16px',
                  background: colors.gradient.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px rgba(255, 107, 53, 0.3)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 6px 16px rgba(255, 107, 53, 0.5)`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(255, 107, 53, 0.3)`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                👤 {user.name || user.email?.split('@')[0] || 'Profile'}
              </button>

              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: colors.background.card,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    zIndex: 1001,
                    minWidth: '200px',
                    overflow: 'hidden'
                  }}
                >
                  <Link
                    to="/profile"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: colors.text.primary,
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      borderBottom: `1px solid ${colors.border.default}`
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.background.hover;
                      e.currentTarget.style.color = colors.primary.base;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.text.primary;
                    }}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/bookings"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: colors.text.primary,
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      borderBottom: `1px solid ${colors.border.default}`
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.background.hover;
                      e.currentTarget.style.color = colors.primary.base;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.text.primary;
                    }}
                  >
                    📅 My Bookings
                  </Link>
                  <Link
                    to="/settings"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: colors.text.primary,
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      borderBottom: `1px solid ${colors.border.default}`
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.background.hover;
                      e.currentTarget.style.color = colors.primary.base;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.text.primary;
                    }}
                  >
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                      navigate('/');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      color: '#EF4444',
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.background.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Auth Buttons
            <>
              <Link
                to="/signin"
                style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: `2px solid ${colors.text.primary}`,
                  color: colors.text.primary,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary.base;
                  e.currentTarget.style.color = colors.primary.base;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.text.primary;
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                style={{
                  padding: '10px 24px',
                  background: colors.gradient.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px rgba(255, 107, 53, 0.3)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 6px 16px rgba(255, 107, 53, 0.5)`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(255, 107, 53, 0.3)`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: colors.text.primary,
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            background: colors.background.main,
            borderBottom: `1px solid ${colors.border.default}`,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? colors.primary.base : colors.text.primary,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.background.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {link.label}
            </Link>
          ))}
          <hr style={{ borderColor: colors.border.default, margin: '8px 0' }} />
          <Link
            to="/signin"
            style={{
              color: colors.text.primary,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            style={{
              background: colors.gradient.primary,
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              padding: '10px 12px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}

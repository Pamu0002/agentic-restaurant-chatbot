/**
 * HEADER COMPONENT - Professional Navigation
 * Persistent header on all pages with:
 * - AgentDine logo
 * - Navigation links (Home, Browse, How it Works, About)
 * - Auth buttons (Sign In / Sign Up) or User profile dropdown
 * - Responsive mobile menu
 */

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import colors from '../../theme/colors';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
            gap: '8px',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background: colors.gradient.primary,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            🍽️
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: colors.text.primary,
              letterSpacing: '-0.5px'
            }}
          >
            AgentDine
          </span>
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

        {/* Desktop Auth Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}
        >
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
        </div>

        {/* Mobile Menu Button */}
        <button
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: colors.text.primary,
            cursor: 'pointer'
          >
            <span className="logo-text">AgentDine</span>
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="header-nav">
          <button 
            className="nav-link"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          
          <button 
            className={`nav-link ${!isAuthenticated ? 'disabled' : ''}`}
            onClick={() => isAuthenticated ? navigate('/restaurants') : navigate('/signin')}
            title={!isAuthenticated ? 'Sign in to browse restaurants' : ''}
          >
            Browse
          </button>
          
          <button 
            className={`nav-link ${!isAuthenticated ? 'disabled' : ''}`}
            onClick={() => isAuthenticated ? navigate('/how-it-works') : navigate('/signin')}
            title={!isAuthenticated ? 'Sign in to view how it works' : ''}
          >
            How it Works
          </button>

          {/* Profile Link (Authenticated Users) */}
          {isAuthenticated && (
            <button 
              className="nav-link nav-profile"
              onClick={() => navigate('/profile')}
              title="Go to your account"
            >
              Account
            </button>
          )}
        </nav>

        {/* RIGHT SIDE: AUTH BUTTONS OR PROFILE MENU */}
        <div className="header-right">
          {!isAuthenticated ? (
            // Unauthenticated: Show Sign In/Sign Up buttons
            <div className="auth-buttons">
              <button 
                className="btn btn-signin"
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-signup"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          ) : (
            // Authenticated: Show Profile dropdown menu
            <div className="profile-menu" ref={dropdownRef}>
              <button
                className="profile-button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="menu"
                title={`Profile: ${user?.displayName || user?.email}`}
              >
                <span className="profile-avatar">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '👤'}
                </span>
                <span className={`dropdown-icon ${isProfileDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{user?.displayName || 'User'}</div>
                    <div className="dropdown-user-email">{user?.email}</div>
                  </div>

                  <hr className="dropdown-divider" />

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileDropdownOpen(false);
                    }}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/bookings');
                      setIsProfileDropdownOpen(false);
                    }}
                  >
                    <span className="dropdown-icon">📅</span>
                    My Bookings
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/settings');
                      setIsProfileDropdownOpen(false);
                    }}
                  >
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </button>

                  <hr className="dropdown-divider" />

                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

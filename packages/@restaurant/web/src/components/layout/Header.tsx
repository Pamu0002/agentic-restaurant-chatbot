/**
 * HEADER COMPONENT
 * Persistent navigation bar on all pages
 * - Logo + nav links (Home, Browse, How it Works)
 * - Sign In/Sign Up buttons OR User profile dropdown
 * - Responsive design
 */

import { useAuth } from '@restaurant/shared';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="header-logo">
          <button 
            className="logo-button"
            onClick={() => navigate('/')}
            aria-label="AgentDine Home"
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

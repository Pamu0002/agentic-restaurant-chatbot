import { useAuth } from '@restaurant/shared';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

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
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logoText}>
            <span className={styles.logoTextAgent}>Agent</span>
            <span className={styles.logoTextDine}>Dine</span>
          </span>
          <div className={styles.logoBar} />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / Profile Section */}
        <div className={styles.authSection}>
          {user ? (
            // Profile Dropdown
            <div className={styles.profileDropdown}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={styles.profileButton}
              >
                👤 {user.name || user.email?.split('@')[0] || 'Profile'}
              </button>

              {profileMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/bookings"
                    className={styles.dropdownItem}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    📅 My Bookings
                  </Link>
                  <Link
                    to="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                      navigate('/');
                    }}
                    className={styles.logoutButton}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Auth Buttons
            <div className={styles.authButtons}>
              <Link to="/signin" className={styles.signInButton}>
                Sign In
              </Link>
              <Link to="/signup" className={styles.signUpButton}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className={styles.mobileMenuButton}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

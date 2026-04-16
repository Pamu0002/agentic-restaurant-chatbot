/**
 * USER PROFILE MENU COMPONENT
 * 
 * Displays user profile menu in header with:
 * - View profile information
 * - Edit profile information
 * - User preferences
 * - Logout
 */

import { useAuth } from '@restaurant/shared';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuestUser, isGuestUser } from '../../services/guestService';
import './UserProfileMenu.css';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    cuisines: string[];
    dietaryRestrictions: string[];
    priceRange: 'budget' | 'moderate' | 'upscale';
    notificationsEnabled: boolean;
  };
  createdAt: string;
}

interface UserProfileMenuProps {
  onLogout?: () => void;
}

export default function UserProfileMenu({ onLogout }: UserProfileMenuProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const guestUser = getGuestUser();
  const isGuest = isGuestUser();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  // Load user profile from localStorage
  useEffect(() => {
    const loadProfile = () => {
      try {
        if (isGuest && guestUser) {
          setProfile({
            id: guestUser.id,
            name: 'Guest User',
            email: guestUser.email || 'guest@restaurant.local',
            preferences: {
              cuisines: [],
              dietaryRestrictions: [],
              priceRange: 'moderate',
              notificationsEnabled: true,
            },
            createdAt: new Date().toISOString(),
          });
        } else if (user) {
          const storedProfile = localStorage.getItem(`user_profile_${user.uid}`);
          if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
          } else {
            // Create default profile
            const defaultProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              avatar: user.photoURL || undefined,
              preferences: {
                cuisines: [],
                dietaryRestrictions: [],
                priceRange: 'moderate',
                notificationsEnabled: true,
              },
              createdAt: new Date().toISOString(),
            };
            setProfile(defaultProfile);
            localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(defaultProfile));
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, [user, isGuest, guestUser]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleViewProfile = () => {
    setShowProfileModal(true);
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    setEditForm({
      name: profile?.name,
      preferences: profile?.preferences,
    });
    setShowEditModal(true);
    setIsOpen(false);
  };

  const handleSaveProfile = () => {
    if (profile) {
      const updatedProfile: UserProfile = {
        ...profile,
        name: editForm.name || profile.name,
        preferences: editForm.preferences || profile.preferences,
      };

      setProfile(updatedProfile);

      // Save to localStorage
      if (user?.uid) {
        localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(updatedProfile));
      }

      setShowEditModal(false);
      alert('Profile updated successfully!');
    }
  };

  const handleLogout = async () => {
    try {
      if (isGuest) {
        // Clear guest session from localStorage
        localStorage.removeItem('guestSession');
        localStorage.removeItem('guestToken');
        console.log('✅ Guest session cleared');
      } else {
        // Logout authenticated user
        await logout();
        console.log('✅ User logged out');
      }
      
      // Call the onLogout callback if provided
      onLogout?.();
      
      // Close the menu and navigate to home
      setIsOpen(false);
      
      // Navigate to home page
      setTimeout(() => {
        navigate('/');
      }, 300);
    } catch (error) {
      console.error('❌ Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return isGuest ? 'G' : 'U';
  };

  if (!profile && !isGuest) {
    return null;
  }

  return (
    <div className="user-profile-menu" ref={menuRef}>
      {/* Profile Button */}
      <button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        title="My Account"
      >
        <div className="profile-avatar-small">{getInitials()}</div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar">{getInitials()}</div>
            <div className="profile-dropdown-info">
              <p className="profile-dropdown-name">{profile?.name || 'Guest User'}</p>
              <p className="profile-dropdown-email">{profile?.email}</p>
            </div>
          </div>

          <div className="profile-dropdown-divider"></div>

          <div className="profile-dropdown-menu">
            <button className="profile-menu-item" onClick={handleViewProfile}>
              <span className="profile-menu-icon">👤</span>
              <span className="profile-menu-text">View Profile</span>
            </button>

            {!isGuest && (
              <button className="profile-menu-item" onClick={handleEditProfile}>
                <span className="profile-menu-icon">✏️</span>
                <span className="profile-menu-text">Edit Profile</span>
              </button>
            )}

            <button className="profile-menu-item" onClick={handleEditProfile}>
              <span className="profile-menu-icon">⚙️</span>
              <span className="profile-menu-text">Preferences</span>
            </button>

            <div className="profile-dropdown-divider"></div>

            <button 
              type="button"
              className="profile-menu-item logout" 
              onClick={handleLogout}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <span className="profile-menu-icon">🚪</span>
              <span className="profile-menu-text">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && profile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>My Profile</h2>
              <button
                className="profile-modal-close"
                onClick={() => setShowProfileModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="profile-modal-content">
              <div className="profile-info-section">
                <h3>Personal Information</h3>
                <div className="profile-info-group">
                  <label>Name</label>
                  <p>{profile.name}</p>
                </div>
                <div className="profile-info-group">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
                <div className="profile-info-group">
                  <label>Member Since</label>
                  <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="profile-info-section">
                <h3>Preferences</h3>
                <div className="profile-info-group">
                  <label>Favorite Cuisines</label>
                  <div className="profile-tags">
                    {profile.preferences?.cuisines && profile.preferences.cuisines.length > 0 ? (
                      profile.preferences.cuisines.map((cuisine) => (
                        <span key={cuisine} className="profile-tag">
                          {cuisine}
                        </span>
                      ))
                    ) : (
                      <p className="profile-empty">No preferences set yet</p>
                    )}
                  </div>
                </div>

                <div className="profile-info-group">
                  <label>Dietary Restrictions</label>
                  <div className="profile-tags">
                    {profile.preferences?.dietaryRestrictions &&
                    profile.preferences.dietaryRestrictions.length > 0 ? (
                      profile.preferences.dietaryRestrictions.map((restriction) => (
                        <span key={restriction} className="profile-tag">
                          {restriction}
                        </span>
                      ))
                    ) : (
                      <p className="profile-empty">None</p>
                    )}
                  </div>
                </div>

                <div className="profile-info-group">
                  <label>Price Range Preference</label>
                  <p className="profile-preference-badge">{profile.preferences?.priceRange}</p>
                </div>

                <div className="profile-info-group">
                  <label>Notifications</label>
                  <p>{profile.preferences?.notificationsEnabled ? '✓ Enabled' : '✗ Disabled'}</p>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button className="btn-primary" onClick={() => setShowProfileModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && profile && (
        <div className="profile-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Edit Profile & Preferences</h2>
              <button
                className="profile-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="profile-modal-content">
              <div className="profile-form-section">
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="profile-input"
                  />
                </div>
              </div>

              <div className="profile-form-section">
                <h3>Dining Preferences</h3>

                <div className="form-group">
                  <label>Favorite Cuisines (comma-separated)</label>
                  <textarea
                    value={editForm.preferences?.cuisines?.join(', ') || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          cuisines: e.target.value
                            .split(',')
                            .map((c) => c.trim())
                            .filter((c) => c),
                        },
                      })
                    }
                    className="profile-input"
                    placeholder="e.g., Italian, Thai, Japanese"
                  />
                </div>

                <div className="form-group">
                  <label>Dietary Restrictions (comma-separated)</label>
                  <textarea
                    value={editForm.preferences?.dietaryRestrictions?.join(', ') || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          dietaryRestrictions: e.target.value
                            .split(',')
                            .map((d) => d.trim())
                            .filter((d) => d),
                        },
                      })
                    }
                    className="profile-input"
                    placeholder="e.g., Vegetarian, Vegan, Nut Allergy"
                  />
                </div>

                <div className="form-group">
                  <label>Price Range Preference</label>
                  <select
                    value={editForm.preferences?.priceRange || 'moderate'}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          priceRange: e.target.value as 'budget' | 'moderate' | 'upscale',
                        },
                      })
                    }
                    className="profile-input"
                  >
                    <option value="budget">Budget ($)</option>
                    <option value="moderate">Moderate ($$)</option>
                    <option value="upscale">Upscale ($$$)</option>
                  </select>
                </div>

                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={editForm.preferences?.notificationsEnabled ?? true}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          notificationsEnabled: e.target.checked,
                        },
                      })
                    }
                  />
                  <label htmlFor="notifications">Enable notifications</label>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

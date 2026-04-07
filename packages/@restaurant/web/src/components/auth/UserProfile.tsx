/**
 * USER PROFILE COMPONENT
 * 
 * USER STORIES:
 * 1. Allow Users to View Profile Information
 * 2. Allow Users to Edit Profile Information
 * 3. Store User Preferences for Personalization
 */

import { useAuth } from '@restaurant/shared';
import { useEffect, useState } from 'react';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  // ============================================
  // STATE
  // ============================================

  const { user, updateProfile, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferences: {
      cuisines: user?.preferences?.cuisines || [],
      priceRange: user?.preferences?.priceRange || 'moderate',
      location: user?.preferences?.location || '',
      notifications: user?.preferences?.notifications !== false,
    },
  });

  const cuisineOptions = [
    'Italian',
    'Chinese',
    'Japanese',
    'Mexican',
    'Indian',
    'Thai',
    'French',
    'American',
    'Mediterranean',
    'Korean',
    'Vietnamese',
    'Lebanese',
  ];

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        preferences: {
          cuisines: user.preferences?.cuisines || [],
          priceRange: user.preferences?.priceRange || 'moderate',
          location: user.preferences?.location || '',
          notifications: user.preferences?.notifications !== false,
        },
      });
    }
  }, [user, isEditing]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('preferences.')) {
        const prefKey = name.replace('preferences.', '');
        setFormData((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [prefKey]: checkbox.checked,
          },
        }));
      }
    } else if (name.startsWith('preferences.')) {
      const prefKey = name.replace('preferences.', '');
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleCuisine = (cuisine: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        cuisines: prev.preferences.cuisines.includes(cuisine)
          ? prev.preferences.cuisines.filter((c) => c !== cuisine)
          : [...prev.preferences.cuisines, cuisine],
      },
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Update displayName or phone if changed
      if (
        formData.displayName !== user.displayName ||
        formData.phone !== user.phone
      ) {
        await updateProfile({
          ...user,
          displayName: formData.displayName,
          phone: formData.phone,
        });
      }

      // Update preferences
      const preferencesChanged = 
        JSON.stringify(formData.preferences) !== 
        JSON.stringify(user.preferences);
      
      if (preferencesChanged) {
        await updatePreferences(formData.preferences);
      }

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      console.error('Failed to save profile:', error);
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (!user) {
    return (
      <div style={styles.container}>
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Your Profile</h2>
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      {successMessage && (
        <div style={styles.successMessage}>
          ✓ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={styles.errorMessage}>
          ✗ {errorMessage}
        </div>
      )}

      {/* PROFILE CONTENT */}
      {!isEditing ? (
        // VIEW MODE
        <div style={styles.viewContent}>
          {/* USER AVATAR & BASIC INFO */}
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>👤</div>
            <div style={styles.basicInfo}>
              <h3 style={styles.userName}>{user.displayName || 'User'}</h3>
              <p style={styles.userEmail}>{user.email}</p>
              {user.phone && <p style={styles.userPhone}>📞 {user.phone}</p>}
            </div>
          </div>

          {/* PREFERENCES SECTION */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Your Preferences</h4>
            
            {/* PRICE RANGE */}
            <div style={styles.preferenceItem}>
              <label style={styles.preferenceLabel}>Price Range:</label>
              <span style={styles.preferenceValue}>
                {user.preferences?.priceRange === 'budget'
                  ? '💰 Budget'
                  : user.preferences?.priceRange === 'moderate'
                  ? '💰💰 Moderate'
                  : '💰💰💰 Expensive'}
              </span>
            </div>

            {/* LOCATION */}
            <div style={styles.preferenceItem}>
              <label style={styles.preferenceLabel}>Location:</label>
              <span style={styles.preferenceValue}>
                📍 {user.preferences?.location || 'Not set'}
              </span>
            </div>

            {/* CUISINES */}
            <div style={styles.preferenceItem}>
              <label style={styles.preferenceLabel}>Favorite Cuisines:</label>
              <div style={styles.cuisineTags}>
                {user.preferences?.cuisines && user.preferences.cuisines.length > 0 ? (
                  user.preferences.cuisines.map((cuisine) => (
                    <span key={cuisine} style={styles.cuisineTag}>
                      {cuisine}
                    </span>
                  ))
                ) : (
                  <p style={styles.noPreferences}>No cuisines selected yet</p>
                )}
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div style={styles.preferenceItem}>
              <label style={styles.preferenceLabel}>Notifications:</label>
              <span style={styles.preferenceValue}>
                {user.preferences?.notifications !== false ? '🔔 Enabled' : '🔕 Disabled'}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={styles.actions}>
            <button
              style={styles.btnPrimary}
              onClick={() => setIsEditing(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c62828';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E64A19';
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form
          style={styles.editForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* DISPLAY NAME FIELD */}
          <div style={styles.formGroup}>
            <label htmlFor="displayName" style={styles.formLabel}>Full Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>

          {/* EMAIL FIELD */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.formInput, backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              disabled
            />
          </div>

          {/* PHONE FIELD */}
          <div style={styles.formGroup}>
            <label htmlFor="phone" style={styles.formLabel}>Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., +1 (555) 123-4567"
              style={styles.formInput}
            />
          </div>

          {/* LOCATION FIELD */}
          <div style={styles.formGroup}>
            <label htmlFor="location" style={styles.formLabel}>Preferred Location</label>
            <input
              type="text"
              id="location"
              name="preferences.location"
              value={formData.preferences.location}
              onChange={handleChange}
              placeholder="e.g., New York, Downtown"
              style={styles.formInput}
            />
          </div>

          {/* PRICE RANGE FIELD */}
          <div style={styles.formGroup}>
            <label htmlFor="priceRange" style={styles.formLabel}>Price Range</label>
            <select
              id="priceRange"
              name="preferences.priceRange"
              value={formData.preferences.priceRange}
              onChange={handleChange}
              style={styles.formInput}
            >
              <option value="budget">💰 Budget</option>
              <option value="moderate">💰💰 Moderate</option>
              <option value="expensive">💰💰💰 Expensive</option>
            </select>
          </div>

          {/* CUISINES SELECTION */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Favorite Cuisines</label>
            <div style={styles.cuisinesGrid}>
              {cuisineOptions.map((cuisine) => (
                <label key={cuisine} style={styles.cuisineCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.preferences.cuisines.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                    style={styles.checkbox}
                  />
                  <span>{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NOTIFICATIONS TOGGLE */}
          <div style={styles.formGroup}>
            <label style={styles.notificationCheckbox}>
              <input
                type="checkbox"
                name="preferences.notifications"
                checked={formData.preferences.notifications}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>Enable notifications for restaurant recommendations</span>
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              onMouseEnter={(e) => {
                if (!isSaving) e.currentTarget.style.background = 'rgba(100, 110, 130, 0.7)';
              }}
              onMouseLeave={(e) => {
                if (!isSaving) e.currentTarget.style.background = 'rgba(80, 90, 105, 0.5)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.btnPrimary}
              disabled={isSaving}
              onMouseEnter={(e) => {
                if (!isSaving) e.currentTarget.style.background = '#c62828';
              }}
              onMouseLeave={(e) => {
                if (!isSaving) e.currentTarget.style.background = '#E64A19';
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  successMessage: {
    padding: '12px 16px',
    marginBottom: '16px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorMessage: {
    padding: '12px 16px',
    marginBottom: '16px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  viewContent: {
    marginBottom: '20px',
  },
  avatarSection: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  avatar: {
    fontSize: '48px',
    width: '60px',
    height: '60px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#e8eef7',
    borderRadius: '50%',
  },
  basicInfo: {
    flex: 1,
  },
  userName: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userEmail: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    color: '#666',
  },
  userPhone: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  preferenceItem: {
    marginBottom: '16px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  preferenceLabel: {
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
  },
  preferenceValue: {
    fontSize: '14px',
    color: '#666',
  },
  cuisineTags: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px',
  },
  cuisineTag: {
    display: 'inline-block' as const,
    padding: '6px 12px',
    backgroundColor: '#E64A19',
    color: '#ffffff',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  noPreferences: {
    margin: 0,
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic' as const,
  },
  editForm: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block' as const,
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
  },
  formInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  },
  cuisinesGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
    marginTop: '12px',
  },
  cuisineCheckbox: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  notificationCheckbox: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px',
  },
  checkbox: {
    cursor: 'pointer',
    width: '18px',
    height: '18px',
  },
  actions: {
    display: 'flex' as const,
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end' as const,
  },
  btnPrimary: {
    padding: '12px 24px',
    background: '#E64A19',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnSecondary: {
    padding: '12px 24px',
    background: 'rgba(80, 90, 105, 0.5)',
    color: '#ffffff',
    border: '1px solid rgba(100, 110, 130, 0.5)',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

/**
 * USER PROFILE COMPONENT
 * 
 * USER STORIES:
 * 11. Allow Users to View Profile Information
 * 12. Allow Users to Edit Profile Information
 * 13. Store User Preferences for Personalization
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  // ============================================
  // STATE
  // ============================================

  const { user, updateProfile, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: {
      cuisines: user?.preferences?.cuisines || [],
      priceRange: user?.preferences?.priceRange || 'moderate',
      location: user?.preferences?.location || '',
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
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
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
    if (user) {
      try {
        // Update name if changed
        if (formData.name !== user.name) {
          await updateProfile({
            ...user,
            name: formData.name,
          });
        }

        // Update preferences
        if (JSON.stringify(formData.preferences) !== JSON.stringify(user.preferences)) {
          await updatePreferences(formData.preferences);
        }

        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save profile:', error);
        alert('Failed to save profile. Please try again.');
      }
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (!user) {
    return (
      <div className="profile-container">
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <h2>Your Profile</h2>
        <button className="profile-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* PROFILE CONTENT */}
      {!isEditing ? (
        // VIEW MODE
        <div className="profile-view">
          {/* USER AVATAR & BASIC INFO */}
          <div className="profile-avatar-section">
            <div className="profile-avatar">👤</div>
            <div className="profile-basic-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          {/* PREFERENCES SECTION */}
          <div className="profile-section">
            <h4>Your Preferences</h4>
            
            {/* PRICE RANGE */}
            <div className="preference-item">
              <label>Price Range:</label>
              <span className="preference-value">
                {user.preferences?.priceRange === 'budget'
                  ? '💰 Budget'
                  : user.preferences?.priceRange === 'moderate'
                  ? '💰💰 Moderate'
                  : '💰💰💰 Expensive'}
              </span>
            </div>

            {/* LOCATION */}
            <div className="preference-item">
              <label>Location:</label>
              <span className="preference-value">📍 {user.preferences?.location}</span>
            </div>

            {/* CUISINES */}
            <div className="preference-item">
              <label>Favorite Cuisines:</label>
              <div className="cuisine-tags">
                {user.preferences?.cuisines && user.preferences.cuisines.length > 0 ? (
                  user.preferences.cuisines.map((cuisine) => (
                    <span key={cuisine} className="cuisine-tag">
                      {cuisine}
                    </span>
                  ))
                ) : (
                  <p className="no-preferences">No cuisines selected yet</p>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form className="profile-edit" onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}>
          {/* NAME FIELD */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* EMAIL FIELD */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              disabled
            />
          </div>

          {/* LOCATION FIELD */}
          <div className="form-group">
            <label htmlFor="location">Preferred Location</label>
            <input
              type="text"
              id="location"
              name="preferences.location"
              value={formData.preferences.location}
              onChange={handleChange}
              placeholder="e.g., New York"
              className="form-input"
            />
          </div>

          {/* PRICE RANGE FIELD */}
          <div className="form-group">
            <label htmlFor="priceRange">Price Range</label>
            <select
              id="priceRange"
              name="preferences.priceRange"
              value={formData.preferences.priceRange}
              onChange={handleChange}
              className="form-input"
            >
              <option value="budget">💰 Budget</option>
              <option value="moderate">💰💰 Moderate</option>
              <option value="expensive">💰💰💰 Expensive</option>
            </select>
          </div>

          {/* CUISINES SELECTION */}
          <div className="form-group">
            <label>Favorite Cuisines</label>
            <div className="cuisines-grid">
              {cuisineOptions.map((cuisine) => (
                <label key={cuisine} className="cuisine-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.preferences.cuisines.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                  />
                  <span>{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="profile-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

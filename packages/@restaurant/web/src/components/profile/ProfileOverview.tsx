/**
 * PROFILE OVERVIEW
 * Displays user information and allows editing
 */

import { UserProfile, useUserProfile } from '@restaurant/shared';
import { useState } from 'react';
import './ProfileOverview.css';

interface ProfileOverviewProps {
  profile: UserProfile;
}

export default function ProfileOverview({ profile }: ProfileOverviewProps) {
  const { updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile.displayName || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-overview">
      <div className="overview-container">
        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="header-title-section">
              <h2>Personal Information</h2>
              <p className="account-tier">🏅 Premium Member</p>
            </div>
            {!isEditing && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <div className="profile-info">
            {/* Profile Picture */}
            <div className="info-section profile-picture-section">
              <label>Profile Picture</label>
              <div className="profile-picture-container">
                {profile.photoURL ? (
                  <div className="profile-pic-wrapper">
                    <img src={profile.photoURL} alt={profile.displayName} className="profile-pic" />
                    <span className="verified-badge">✓</span>
                  </div>
                ) : (
                  <div className="profile-pic-placeholder">👤</div>
                )}
              </div>
              <p className="info-hint">Upload from account settings</p>
            </div>

            {/* Name */}
            <div className="info-section">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="info-value">{profile.displayName || 'Not provided'}</p>
              )}
            </div>

            {/* Email */}
            <div className="info-section">
              <label>Email</label>
              <div className="email-section">
                <p className="info-value">{profile.email}</p>
                <span className="verified-status">✓ Verified</span>
              </div>
              <p className="info-hint">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="info-section">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="info-value">{profile.phone || 'Not provided'}</p>
              )}
            </div>

            {/* Bio */}
            <div className="info-section">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="textarea-field"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              ) : (
                <p className="info-value">{profile.bio || 'Not provided'}</p>
              )}
            </div>

            {/* Member Since */}
            <div className="info-section">
              <label>Member Since</label>
              <p className="info-value">
                {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Not available'}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {isEditing && (
            <div className="action-buttons">
              <button
                className="button button-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                className="button button-secondary"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* STATS & ACHIEVEMENTS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <h3>Total Bookings</h3>
            <p className="stat-value">{profile.totalBookings}</p>
            <p className="stat-details">Restaurant reservations</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <h3>Favorite Restaurants</h3>
            <p className="stat-value">{profile.favorites.length}</p>
            <p className="stat-details">Saved favorites</p>
          </div>
          {profile.averageRating && (
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <h3>Average Rating</h3>
              <p className="stat-value">{profile.averageRating.toFixed(1)}</p>
              <p className="stat-details">Out of 5 stars</p>
            </div>
          )}
          <div className="stat-card premium-badge">
            <div className="stat-icon">🏅</div>
            <h3>Member Status</h3>
            <p className="stat-value">Premium</p>
            <p className="stat-details">Full access member</p>
          </div>
        </div>

        {/* DINING PREFERENCES SECTION */}
        {profile.preferences && (
          <div className="preferences-section">
            <div className="preferences-header">
              <h2>🍽️ Dining Preferences</h2>
              <p className="preferences-subtitle">Your personalized dining preferences</p>
            </div>
            
            <div className="preferences-grid">
              {/* Dietary Restrictions */}
              {profile.preferences.dietaryRestrictions && profile.preferences.dietaryRestrictions.length > 0 && (
                <div className="preference-card">
                  <div className="preference-label">Dietary Restrictions</div>
                  <div className="preference-tags">
                    {profile.preferences.dietaryRestrictions.map((dietary) => (
                      <span key={dietary} className="preference-tag dietary">
                        {dietary}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cuisine Preferences */}
              {profile.preferences.cuisinePreferences && profile.preferences.cuisinePreferences.length > 0 && (
                <div className="preference-card">
                  <div className="preference-label">Cuisine Preferences</div>
                  <div className="preference-tags">
                    {profile.preferences.cuisinePreferences.map((cuisine) => (
                      <span key={cuisine} className="preference-tag cuisine">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              {profile.preferences.priceRange && (
                <div className="preference-card">
                  <div className="preference-label">Price Range</div>
                  <div className="price-range-display">
                    <span className="price-tag">
                      {profile.preferences.priceRange.charAt(0).toUpperCase() + profile.preferences.priceRange.slice(1)}
                    </span>
                    <span className="price-icon">
                      {profile.preferences.priceRange === 'budget' && '$'}
                      {profile.preferences.priceRange === 'moderate' && '$$'}
                      {profile.preferences.priceRange === 'expensive' && '$$$'}
                      {profile.preferences.priceRange === 'luxury' && '$$$$'}
                    </span>
                  </div>
                </div>
              )}

              {/* Ambiance Preferences */}
              {profile.preferences.ambiance && profile.preferences.ambiance.length > 0 && (
                <div className="preference-card">
                  <div className="preference-label">Dining Ambiance</div>
                  <div className="preference-tags">
                    {profile.preferences.ambiance.map((ambiance) => (
                      <span key={ambiance} className="preference-tag ambiance">
                        {ambiance === 'casual' && '🎉 Casual & Fun'}
                        {ambiance === 'romantic' && '💕 Romantic'}
                        {ambiance === 'business' && '💼 Business'}
                        {ambiance === 'family' && '👨‍👩‍👧‍👦 Family-Friendly'}
                        {ambiance === 'fine_dining' && '✨ Fine Dining'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="preferences-hint">💡 Update your preferences in the Preferences tab to customize your dining experience</p>
          </div>
        )}
      </div>
    </div>
  );
}

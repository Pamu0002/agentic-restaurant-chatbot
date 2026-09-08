/**
 * USER PROFILE PAGE
 * 
 * Industry-standard user profile with tabs:
 * - Profile Overview
 * - Favorites/Wishlist
 * - Bookings History
 * - Preferences & Settings
 * 
 * Desktop-first responsive design
 */

import { useUserProfile } from '@restaurant/shared';
import { useState } from 'react';
import BookingsHistory from '../profile/BookingsHistory';
import Favorites from '../profile/Favorites';
import PreferencesSettings from '../profile/PreferencesSettings';
import ProfileOverview from '../profile/ProfileOverview';
import './UserProfile.css';

interface UserProfileProps {
  onBack?: () => void;
}

type TabType = 'overview' | 'favorites' | 'bookings' | 'preferences';

export default function UserProfile({ onBack }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="user-profile-page">
        <div className="profile-error">
          <p>❌ {error || 'Failed to load profile'}</p>
          {onBack && <button onClick={onBack}>← Go Back</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* PROFILE HEADER */}
      <header className="profile-header">
        <div className="profile-header-content">
          <div className="profile-back">
            {onBack && (
              <button className="back-button" onClick={onBack}>
                ← Back
              </button>
            )}
          </div>

          <h1 className="profile-title">My Profile</h1>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{profile.totalBookings}</span>
              <span className="stat-label">Bookings</span>
            </div>
            <div className="stat">
              <span className="stat-number">{profile.favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
            {profile.averageRating && (
              <div className="stat">
                <span className="stat-number">⭐ {profile.averageRating.toFixed(1)}</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PROFILE TABS */}
      <div className="profile-tabs-container">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            👤 Overview
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ❤️ Favorites ({profile.favorites.length})
          </button>
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📅 Bookings ({profile.bookings.length})
          </button>
          <button
            className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🍽️ Preferences
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="profile-content">
        {activeTab === 'overview' && <ProfileOverview profile={profile} />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'bookings' && <BookingsHistory />}
        {activeTab === 'preferences' && <PreferencesSettings />}
      </div>
    </div>
  );
}

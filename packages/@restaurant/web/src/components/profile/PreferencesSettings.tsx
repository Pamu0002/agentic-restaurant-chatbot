/**
 * PREFERENCES & SETTINGS
 * Manage dietary restrictions, cuisine preferences, and dining preferences
 */

import { useUserProfile } from '@restaurant/shared';
import { useEffect, useState } from 'react';
import './PreferencesSettings.css';

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'glutenFree', label: 'Gluten-Free' },
  { id: 'dairyFree', label: 'Dairy-Free' },
  { id: 'nutFree', label: 'Nut-Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'lowSodium', label: 'Low Sodium' },
];

const CUISINE_OPTIONS = [
  'Italian',
  'Chinese',
  'Indian',
  'Japanese',
  'Thai',
  'Mexican',
  'French',
  'Mediterranean',
  'Korean',
  'Spanish',
  'Vietnamese',
  'Middle Eastern',
];

const PRICE_RANGES = [
  { id: 'budget', label: 'Budget', icon: '$' },
  { id: 'moderate', label: 'Moderate', icon: '$$' },
  { id: 'expensive', label: 'Expensive', icon: '$$$' },
  { id: 'luxury', label: 'Luxury', icon: '$$$$' },
];

const AMBIANCE_OPTIONS = [
  { id: 'casual', label: 'Casual & Fun' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'business', label: 'Business' },
  { id: 'family', label: 'Family-Friendly' },
  { id: 'fine_dining', label: 'Fine Dining' },
];

export default function PreferencesSettings() {
  const { profile, updatePreferences } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: profile?.preferences?.dietaryRestrictions || [],
    cuisinePreferences: profile?.preferences?.cuisinePreferences || [],
    priceRange: profile?.preferences?.priceRange || 'moderate',
    ambiance: profile?.preferences?.ambiance || [],
  });

  useEffect(() => {
    if (profile?.preferences) {
      setPreferences({
        dietaryRestrictions: profile.preferences.dietaryRestrictions || [],
        cuisinePreferences: profile.preferences.cuisinePreferences || [],
        priceRange: profile.preferences.priceRange || 'moderate',
        ambiance: profile.preferences.ambiance || [],
      });
    }
  }, [profile]);

  const toggleDietaryRestriction = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(id)
        ? prev.dietaryRestrictions.filter((item) => item !== id)
        : [...prev.dietaryRestrictions, id],
    }));
  };

  const toggleCuisinePreference = (cuisine: string) => {
    setPreferences((prev) => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(cuisine)
        ? prev.cuisinePreferences.filter((item) => item !== cuisine)
        : [...prev.cuisinePreferences, cuisine],
    }));
  };

  const toggleAmbiance = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      ambiance: prev.ambiance.includes(id)
        ? prev.ambiance.filter((item) => item !== id)
        : [...prev.ambiance, id],
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await updatePreferences(preferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="preferences-section">
      <div className="preferences-header">
        <h2>Preferences & Settings</h2>
        <p className="header-subtitle">
          Customize your dining preferences to get personalized recommendations
        </p>
      </div>

      {saveSuccess && (
        <div className="success-message">
          ✅ Preferences saved successfully!
        </div>
      )}

      <div className="preferences-content">
        {/* DIETARY RESTRICTIONS */}
        <div className="preference-group">
          <h3 className="group-title">Dietary Restrictions</h3>
          <p className="group-subtitle">
            Select any dietary restrictions or preferences
          </p>
          <div className="options-grid dietary">
            {DIETARY_OPTIONS.map((option) => (
              <div
                key={option.id}
                className={`dietary-option ${
                  preferences.dietaryRestrictions.includes(option.id) ? 'selected' : ''
                }`}
                onClick={() => toggleDietaryRestriction(option.id)}
              >
                <input
                  type="checkbox"
                  id={`dietary-${option.id}`}
                  checked={preferences.dietaryRestrictions.includes(option.id)}
                  onChange={() => toggleDietaryRestriction(option.id)}
                />
                <label htmlFor={`dietary-${option.id}`}>{option.label}</label>
                {preferences.dietaryRestrictions.includes(option.id) && (
                  <span className="check-icon">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CUISINE PREFERENCES */}
        <div className="preference-group">
          <h3 className="group-title">Favorite Cuisines</h3>
          <p className="group-subtitle">
            Select cuisines you love (select at least 1)
          </p>
          <div className="options-grid cuisine">
            {CUISINE_OPTIONS.map((cuisine) => (
              <div
                key={cuisine}
                className={`cuisine-tag ${
                  preferences.cuisinePreferences.includes(cuisine) ? 'selected' : ''
                }`}
                onClick={() => toggleCuisinePreference(cuisine)}
              >
                <input
                  type="checkbox"
                  id={`cuisine-${cuisine}`}
                  checked={preferences.cuisinePreferences.includes(cuisine)}
                  onChange={() => toggleCuisinePreference(cuisine)}
                />
                <label htmlFor={`cuisine-${cuisine}`}>{cuisine}</label>
              </div>
            ))}
          </div>
        </div>

        {/* PRICE RANGE */}
        <div className="preference-group">
          <h3 className="group-title">Preferred Price Range</h3>
          <p className="group-subtitle">
            Select your typical dining budget
          </p>
          <div className="price-range-options">
            {PRICE_RANGES.map((range) => (
              <label key={range.id} className="price-option">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.id}
                  checked={preferences.priceRange === range.id}
                  onChange={(e) =>
                    setPreferences({ ...preferences, priceRange: e.target.value })
                  }
                />
                <span className="radio-custom"></span>
                <span className="price-label">{range.label}</span>
                <span className="price-icon">{range.icon}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AMBIANCE PREFERENCES */}
        <div className="preference-group">
          <h3 className="group-title">Preferred Ambiance</h3>
          <p className="group-subtitle">
            Choose the type of dining atmosphere you prefer
          </p>
          <div className="ambiance-options">
            {AMBIANCE_OPTIONS.map((option) => (
              <div
                key={option.id}
                className={`ambiance-option ${
                  preferences.ambiance.includes(option.id) ? 'selected' : ''
                }`}
                onClick={() => toggleAmbiance(option.id)}
              >
                <input
                  type="checkbox"
                  id={`ambiance-${option.id}`}
                  checked={preferences.ambiance.includes(option.id)}
                  onChange={() => toggleAmbiance(option.id)}
                />
                <label htmlFor={`ambiance-${option.id}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="preferences-actions">
          <button
            className={`btn save-btn ${saveSuccess ? 'success' : ''} ${isSaving ? 'saving' : ''}`}
            onClick={handleSavePreferences}
            disabled={isSaving}
          >
            {saveSuccess ? (
              <>
                <span className="check-icon">✓</span>
                Saved Successfully!
              </>
            ) : isSaving ? (
              <>
                <span className="spinner-icon"></span>
                Saving...
              </>
            ) : (
              <>
                <span className="save-icon">💾</span>
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * HOME PAGE COMPONENT
 * 
 * This is the landing page users see when they visit the app
 * It includes:
 * - Welcome message
 * - Quick search box
 * - Featured restaurants
 * - Call-to-action buttons
 */

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * HomePage Component
 * 
 * React concepts demonstrated:
 * - useState: Manage component state (data that changes)
 * - useNavigate: Navigate to different pages
 * - Event handlers: Handle user clicks
 * - API calls: Fetch data from backend
 */
export default function HomePage() {
  // ============================================
  // 1. STATE MANAGEMENT
  // ============================================

  // searchQuery: stores what user types
  // setSearchQuery: function to update searchQuery
  const [searchQuery, setSearchQuery] = useState('');

  // isLoading: shows loading spinner while fetching
  const isLoading = false;

  // error: displays error messages
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // 2. HOOKS
  // ============================================

  // Navigate to different pages
  const navigate = useNavigate();

  // ============================================
  // 3. EVENT HANDLERS
  // ============================================

  /**
   * Handle search button click
   * 
   * Flow:
   * 1. Validate input (not empty)
   * 2. Call backend API to search
   * 3. Navigate to search results page
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // Validate input
    if (!searchQuery.trim()) {
      setError('Please enter a location');
      return;
    }

    try {
      // Clear previous error
      setError(null);

      // Call backend API
      // GET /api/v1/restaurants?location=searchQuery
      const response = await axios.get('/api/v1/restaurants', {
        params: {
          location: searchQuery,
          limit: 10
        }
      });

      // If successful, navigate to search page with results
      if (response.data.success) {
        navigate(`/search?location=${searchQuery}`);
      }
    } catch (err) {
      // Handle error
      setError('Failed to search restaurants. Please try again.');
      console.error('Search error:', err);
    }
  };

  // ============================================
  // 4. RENDER (What the user sees)
  // ============================================

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Sri Lankan Perfect Restaurant</h1>
          <p>Search, discover, and reserve tables at the best restaurants</p>

          {/* SEARCH BOX */}
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter city or restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find restaurants by location, cuisine, or rating</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Smart Recommendations</h3>
            <p>Get personalized suggestions based on your taste!</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Quick Booking</h3>
            <p>Reserve a table in just a few clicks</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>AI Assistant</h3>
            <p>Chat with our AI to find exactly what you want</p>
          </div>
        </div>
      </section>

      {/* POPULAR RESTAURANTS SECTION */}
      <section className="popular-restaurants">
        <h2>Popular Restaurants</h2>
        <div className="restaurants-grid">
          {/* Map through restaurants and display each one */}
          {/* We'll add real data here */}
          <div className="restaurant-card">
            <img src="https://via.placeholder.com/300" alt="Restaurant" />
            <h3>Pizza Palace</h3>
            <p>Italian • Paris</p>
            <div className="rating">⭐ 4.5</div>
          </div>

          <div className="restaurant-card">
            <img src="https://via.placeholder.com/300" alt="Restaurant" />
            <h3>Le Petit Bistro</h3>
            <p>French • Paris</p>
            <div className="rating">⭐ 4.8</div>
          </div>

          <div className="restaurant-card">
            <img src="https://via.placeholder.com/300" alt="Restaurant" />
            <h3>Tokyo Express</h3>
            <p>Japanese • Paris</p>
            <div className="rating">⭐ 4.3</div>
          </div>
        </div>
      </section>

      {/* CALL-TO-ACTION SECTION */}
      <section className="cta">
        <h2>Ready to reserve?</h2>
        <button
          onClick={() => navigate('/search')}
          className="cta-button"
        >
          Start Exploring
        </button>
      </section>
    </div>
  );
}

/**
 * CHAT DASHBOARD WITH SIDEBAR
 * 
 * Industry-standard layout with main content area (left)
 * and integrated chat sidebar (right)
 * Following Zendesk, Intercom, Drift patterns
 */

import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import './ChatDashboard.css';

interface ChatDashboardProps {
  userName?: string;
  isGuest?: boolean;
}

export default function ChatDashboard({ 
  userName = 'Friend',
  isGuest = true,
}: ChatDashboardProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default (both desktop and mobile)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Close sidebar on mobile by default
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="chat-dashboard">
      {/* HEADER - Fixed at top */}
      <header className="dashboard-header">
        <div className="header-content">
          {/* Logo/Brand */}
          <div className="header-brand">
            <span className="brand-logo">🍽️</span>
            <span className="brand-name">AgentDine</span>
          </div>

          {/* Search bar (center) */}
          <div className="header-search">
            <input
              type="text"
              placeholder="Search restaurants, cuisines, locations..."
              className="search-input"
            />
            <button className="search-button" aria-label="Search">
              🔍
            </button>
          </div>

          {/* Right actions */}
          <div className="header-actions">
            <button className="assist-button" title="Help">
              ❓
            </button>
            <button className="settings-button" title="Settings">
              ⚙️
            </button>
            {/* Toggle sidebar button (visible on mobile) */}
            {isMobile && (
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? 'Close chat' : 'Open chat'}
                aria-label={sidebarOpen ? 'Close chat' : 'Open chat'}
              >
                💬
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <div className="dashboard-container">
        {/* MAIN CONTENT (Left) */}
        <main className="main-content">
          <div className="content-wrapper">
            {/* WELCOME SECTION */}
            <section className="welcome-section">
              <h1 className="welcome-heading">Welcome to AgentDine 👋</h1>
              <p className="welcome-subtitle">
                {isGuest 
                  ? "Browse restaurants and chat with Chef Assistant for recommendations"
                  : `Welcome back, ${userName}! Discover your next favorite restaurant`
                }
              </p>
            </section>

            {/* FEATURED SECTION */}
            <section className="featured-section">
              <div className="section-header">
                <h2 className="section-title">Trending in Colombo 🔥</h2>
                <a href="#" className="view-all-link">View All →</a>
              </div>

              <div className="restaurants-grid">
                {/* Restaurant Card 1 */}
                <div className="restaurant-card">
                  <div className="card-image">
                    <img 
                      src="https://via.placeholder.com/300x200?text=The+Lagoon" 
                      alt="The Lagoon"
                    />
                    <span className="rating-badge">⭐ 4.8</span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">The Lagoon</h3>
                    <p className="card-cuisine">🦐 Seafood • Colombo 1</p>
                    <button className="card-button">View Details</button>
                  </div>
                </div>

                {/* Restaurant Card 2 */}
                <div className="restaurant-card">
                  <div className="card-image">
                    <img 
                      src="https://via.placeholder.com/300x200?text=Laksha" 
                      alt="Laksha"
                    />
                    <span className="rating-badge">⭐ 4.9</span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Laksha</h3>
                    <p className="card-cuisine">🍲 Sri Lankan • Colombo 3</p>
                    <button className="card-button">View Details</button>
                  </div>
                </div>

                {/* Restaurant Card 3 */}
                <div className="restaurant-card">
                  <div className="card-image">
                    <img 
                      src="https://via.placeholder.com/300x200?text=Ministry+of+Crab" 
                      alt="Ministry of Crab"
                    />
                    <span className="rating-badge">⭐ 4.8</span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Ministry of Crab</h3>
                    <p className="card-cuisine">🦐 Seafood • Colombo 3</p>
                    <button className="card-button">View Details</button>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK FILTERS SECTION */}
            <section className="quick-filters-section">
              <h3 className="section-title">Filter by Cuisine</h3>
              <div className="filter-chips">
                <button className="filter-chip">🍜 Sri Lankan</button>
                <button className="filter-chip">🦐 Seafood</button>
                <button className="filter-chip">🍕 Italian</button>
                <button className="filter-chip">🥬 Vegetarian</button>
                <button className="filter-chip">🌮 Fusion</button>
              </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="how-it-works-section">
              <h2 className="section-title">How AgentDine Works</h2>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h4 className="step-title">Search & Discover</h4>
                  <p className="step-description">Browse 1,250+ restaurants or chat with Chef for recommendations</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h4 className="step-title">View Details</h4>
                  <p className="step-description">Check menus, ratings, hours, and availability</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h4 className="step-title">Book Table</h4>
                  <p className="step-description">Reserve your table in seconds with instant confirmation</p>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h4 className="step-title">Enjoy & Review</h4>
                  <p className="step-description">Dine and share your experience with the community</p>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* CHAT SIDEBAR (Right) - Fixed */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : 'desktop'}`}>
          {/* Close button (top-right of sidebar) */}
          <button
            className="sidebar-close-button"
            onClick={() => setSidebarOpen(false)}
            title={isMobile ? 'Close chat' : 'Minimize chat'}
            aria-label={isMobile ? 'Close chat' : 'Minimize chat'}
          >
            ✕
          </button>

          <ChatInterface 
            userName={userName}
            showHeader={true}
          />
        </aside>

        {/* MOBILE SIDEBAR TOGGLE BUTTON (floating) */}
        {/* Show on mobile when sidebar is closed, or on desktop when sidebar is closed */}
        {(!sidebarOpen) && (
          <button
            className={`floating-chat-toggle ${isMobile ? 'mobile' : 'desktop'}`}
            onClick={() => setSidebarOpen(true)}
            title="Open chat"
            aria-label="Open chat"
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
}

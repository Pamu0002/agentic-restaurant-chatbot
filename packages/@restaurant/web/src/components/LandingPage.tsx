/**
 * LANDING PAGE COMPONENT
 * 
 * Industry-standard landing page with:
 * - Hero section (split screen)
 * - Trust/stats section
 * - Featured restaurants grid
 * - Quick cuisine filters
 * - How it works section
 * - Auth options card
 * 
 * Desktop-first responsive design (1440px+)
 */

import { useEffect, useState } from 'react';
import FloatingChatWidget from './FloatingChatWidget';
import './LandingPage.css';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onDiscoverRestaurants?: () => void;
}

export default function LandingPage({ onSignIn, onSignUp, onDiscoverRestaurants }: LandingPageProps) {
  const [activeFilterChip, setActiveFilterChip] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrollY, setScrollY] = useState(0);
  const [chatbotIsOpen, setChatbotIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Featured restaurants data (mock)
  const featuredRestaurants = [
    {
      id: 1,
      name: 'The Lagoon',
      cuisine: '🦐 Seafood',
      location: 'Colombo 1',
      rating: 4.8,
      reviews: 234,
      image: 'https://via.placeholder.com/300x200?text=The+Lagoon',
    },
    {
      id: 2,
      name: 'Laksha',
      cuisine: '🍲 Sri Lankan',
      location: 'Colombo 3',
      rating: 4.9,
      reviews: 156,
      image: 'https://via.placeholder.com/300x200?text=Laksha',
    },
    {
      id: 3,
      name: 'Ministry of Crab',
      cuisine: '🦀 Seafood',
      location: 'Colombo 3',
      rating: 4.8,
      reviews: 189,
      image: 'https://via.placeholder.com/300x200?text=Ministry+of+Crab',
    },
  ];

  const cuisineFilters = [
    '🍜 Sri Lankan',
    '🦐 Seafood',
    '🍕 Italian',
    '🥬 Vegetarian',
    '🌮 Fusion',
  ];

  // Food images for hero carousel - easy to swap with real images
  const heroFoodImages = [
    {
      id: 1,
      src: 'https://via.placeholder.com/350x250/FF6B6B/FFFFFF?text=Seafood+Delights',
      alt: 'Seafood dish',
      label: 'Premium Seafood',
      position: 'main'
    },
    {
      id: 2,
      src: 'https://via.placeholder.com/280x220/FFA500/FFFFFF?text=Curry+Feast',
      alt: 'Sri Lankan curry',
      label: 'Sri Lankan Curry',
      position: 'top'
    },
    {
      id: 3,
      src: 'https://via.placeholder.com/260x200/4ECDC4/FFFFFF?text=Wine+Pairing',
      alt: 'Wine and appetizer',
      label: 'Wine Pairings',
      position: 'bottom'
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Search & Discover',
      description: 'Browse 1,250+ restaurants or chat with Chef for recommendations',
    },
    {
      step: 2,
      title: 'View Details',
      description: 'Check menus, ratings, hours, and availability',
    },
    {
      step: 3,
      title: 'Book Table',
      description: 'Reserve your table in seconds with instant confirmation',
    },
    {
      step: 4,
      title: 'Enjoy & Review',
      description: 'Dine and share your experience with the community',
    },
  ];

  return (
    <div className="landing-page">
      {/* FIXED HEADER */}
      <header className="landing-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">AgentDine</span>
          </div>
          <div className="header-cta">
            <button className="header-btn-secondary" onClick={onSignIn}>
              Sign In
            </button>
            <button className="header-btn-primary" onClick={onSignUp}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          {/* LEFT HERO CONTENT */}
          <div className="hero-left">
            <h1 className="hero-title">
              Discover Your Perfect <span className="highlight-text">Restaurant</span>
            </h1>
            <p className="hero-subtitle">
              Experience the future of dining. Our AI-powered Chef Assistant provides personalized recommendations, 
              instant table availability, and seamless bookings—all tailored to your unique taste.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <div>
                  <div className="feature-label">Smart AI Recommendations</div>
                  <div className="feature-desc">Personalized to your preferences</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <div className="feature-label">Instant Reservations</div>
                  <div className="feature-desc">Book in seconds with live availability</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">❤️</span>
                <div>
                  <div className="feature-label">Curated Experiences</div>
                  <div className="feature-desc">Handpicked restaurants just for you</div>
                </div>
              </div>
            </div>
            <div className="hero-cta-group">
              <button className="hero-cta-primary" onClick={() => setChatbotIsOpen(true)}>
                👉 Chat with Chef Assistant
              </button>
              <button className="hero-cta-secondary" onClick={onSignUp}>
                Create Free Account
              </button>
            </div>
          </div>

          {/* RIGHT HERO FOOD IMAGE CAROUSEL */}
          <div className="hero-right">
            <div className="food-carousel-container">
              {/* Main Feature Image */}
              <div className="food-image food-image-main">
                <img
                  src={heroFoodImages[0].src}
                  alt={heroFoodImages[0].alt}
                  className="food-img"
                />
                <div className="food-label">{heroFoodImages[0].label}</div>
              </div>

              {/* Top Side Image */}
              <div className="food-image food-image-top">
                <img
                  src={heroFoodImages[1].src}
                  alt={heroFoodImages[1].alt}
                  className="food-img"
                />
                <div className="food-label">{heroFoodImages[1].label}</div>
              </div>

              {/* Bottom Side Image */}
              <div className="food-image food-image-bottom">
                <img
                  src={heroFoodImages[2].src}
                  alt={heroFoodImages[2].alt}
                  className="food-img"
                />
                <div className="food-label">{heroFoodImages[2].label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SOCIAL PROOF SECTION */}
      <section className="trust-section">
        <div className="trust-container">
          <div className="trust-stat">
            <div className="stat-number">1,250+</div>
            <div className="stat-label">Premium Restaurants</div>
          </div>
          <div className="trust-stat">
            <div className="stat-number">42k+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="trust-stat">
            <div className="stat-number">15</div>
            <div className="stat-label">Major Cities</div>
          </div>
          <div className="trust-stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Support</div>
          </div>
        </div>
      </section>

      {/* FEATURED RESTAURANTS SECTION */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Trending in Colombo 🔥</h2>
          <button 
            className="view-all-link"
            onClick={() => onDiscoverRestaurants?.()}
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            View All →
          </button>
        </div>
        <div className="restaurants-grid">
          {featuredRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="restaurant-card"
              onClick={() => onDiscoverRestaurants?.()}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-image-wrapper">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="card-image"
                />
                <span className="rating-badge">⭐ {restaurant.rating}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{restaurant.name}</h3>
                <p className="card-cuisine">
                  {restaurant.cuisine} • {restaurant.location}
                </p>
                <p className="card-meta">
                  ({restaurant.reviews} reviews)
                </p>
                <button 
                  className="card-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDiscoverRestaurants?.();
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK FILTERS SECTION */}
      <section className="filters-section">
        <h3 className="section-title">Filter by Cuisine</h3>
        <div className="filter-chips">
          {cuisineFilters.map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${activeFilterChip === filter ? 'active' : ''}`}
              onClick={() => setActiveFilterChip(activeFilterChip === filter ? null : filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works-section">
        <h2 className="section-title">How AgentDine Works</h2>
        <div className="steps-grid">
          {howItWorks.map((item) => (
            <div key={item.step} className="step-card">
              <div className="step-number">{item.step}</div>
              <h4 className="step-title">{item.title}</h4>
              <p className="step-description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to find your next favorite restaurant?</h2>
          <p className="cta-subtitle">Chat with Chef Assistant or browse restaurants now</p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => onDiscoverRestaurants?.()}>
              Start Exploring
            </button>
            <button className="cta-secondary" onClick={onSignUp}>
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About AgentDine</h4>
            <p>AI-powered restaurant discovery and booking platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Browse Restaurants</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 AgentDine. All rights reserved. | AI-Powered Restaurant Discovery</p>
        </div>
      </footer>

      {/* FLOATING CHATBOT WIDGET - Bottom Right */}
      <FloatingChatWidget 
        userName="Guest" 
        showHeader={true}
        initialIsOpen={chatbotIsOpen}
        onOpenChange={setChatbotIsOpen}
      />
    </div>
  );
}

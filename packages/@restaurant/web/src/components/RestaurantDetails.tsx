/**
 * RESTAURANT DETAILS PAGE
 * 
 * Features:
 * - Hero image section
 * - Tab navigation (Overview, Menu, Reviews, Photos)
 * - Restaurant info, amenities, ratings
 * - Sticky booking widget (desktop) / mobile collapsible
 * - Reviews section with breakdown
 * - Photo gallery
 * 
 * Route: /restaurants/:id
 */

import { useState, useEffect } from 'react';
import './RestaurantDetails.css';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  price: string;
  hours: string;
  image: string;
  description: string;
  amenities: string[];
  cuisine_types: string[];
  dietary_options: string[];
}

interface RestaurantDetailsProps {
  restaurantId?: string;
  onBackClick?: () => void;
  onBookingStart?: (restaurantId: string) => void;
}

type TabType = 'overview' | 'menu' | 'reviews' | 'photos';

export default function RestaurantDetails({ 
  restaurantId = '1', 
  onBackClick, 
  onBookingStart 
}: RestaurantDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [bookingOpen, setBookingOpen] = useState(!isMobile);

  // Mock restaurant data (would come from API with restaurantId)
  const restaurant: Restaurant = {
    id: restaurantId,
    name: 'The Lagoon',
    cuisine: '🦐 Seafood',
    location: 'Colombo 1',
    address: '123 Galle Road, Colombo 1, Sri Lanka',
    phone: '+94 11 234 5678',
    rating: 4.8,
    reviews: 234,
    price: '$$$',
    hours: 'Open now • 11:00 AM - 11:00 PM',
    image: 'https://via.placeholder.com/1200x400?text=The+Lagoon+Restaurant',
    description: 'Award-winning seafood restaurant offering the finest catch of the day with stunning ocean views. Our expert chefs prepare dishes using traditional Sri Lankan cooking methods with modern innovation.',
    amenities: ['🅿️ Parking', '🍽️ Private Dining', '🌳 Outdoor Seating', '🎵 Live Music', '📱 WiFi', '♿ Wheelchair Accessible'],
    cuisine_types: ['Seafood', 'Sri Lankan', 'Asian Fusion'],
    dietary_options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],
  };

  const mockReviews = [
    {
      author: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Absolutely amazing seafood! The fish curry was perfectly spiced. Will definitely come back.',
      avatar: '👩',
    },
    {
      author: 'John D.',
      rating: 4,
      date: '1 month ago',
      text: 'Great atmosphere and friendly staff. Food was delicious though a bit pricey.',
      avatar: '👨',
    },
    {
      author: 'Lisa P.',
      rating: 5,
      date: '1 month ago',
      text: 'Best dinner date spot in Colombo! The sunset views are incredible.',
      avatar: '👩',
    },
  ];

  const mockPhotos = [
    'https://via.placeholder.com/300x200?text=Photo+1',
    'https://via.placeholder.com/300x200?text=Photo+2',
    'https://via.placeholder.com/300x200?text=Photo+3',
    'https://via.placeholder.com/300x200?text=Photo+4',
    'https://via.placeholder.com/300x200?text=Photo+5',
    'https://via.placeholder.com/300x200?text=Photo+6',
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ratingDistribution = [
    { stars: 5, count: 150, percentage: 64 },
    { stars: 4, count: 60, percentage: 26 },
    { stars: 3, count: 15, percentage: 6 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 4, percentage: 2 },
  ];

  return (
    <div className="restaurant-details">
      {/* HEADER */}
      <header className="details-header">
        <button className="back-btn" onClick={onBackClick}>← Back to Restaurants</button>
        <h1 className="header-title">{restaurant.name}</h1>
        <button className="favorite-btn">❤️ Save</button>
      </header>

      {/* HERO IMAGE SECTION */}
      <section className="hero-image-section">
        <img src={restaurant.image} alt={restaurant.name} className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-info">
            <h1 className="hero-title">{restaurant.name}</h1>
            <div className="hero-stats">
              <span className="rating-display">⭐ {restaurant.rating}</span>
              <span className="reviews-count">({restaurant.reviews} reviews)</span>
              <span className="cuisine-tag">{restaurant.cuisine}</span>
              <span className="price-tag">{restaurant.price}</span>
              <span className="status open">🟢 Open Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="details-container">
        {/* LEFT CONTENT */}
        <main className="main-content">
          {/* TAB NAVIGATION */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="tab-pane overview-tab">
                <h2 className="section-header">About {restaurant.name}</h2>
                <p className="description">{restaurant.description}</p>

                {/* RESTAURANT INFO GRID */}
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div>
                      <div className="info-label">Location</div>
                      <div className="info-value">{restaurant.address}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div>
                      <div className="info-label">Phone</div>
                      <div className="info-value">{restaurant.phone}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🕐</span>
                    <div>
                      <div className="info-label">Hours</div>
                      <div className="info-value">{restaurant.hours}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">💳</span>
                    <div>
                      <div className="info-label">Price Range</div>
                      <div className="info-value">{restaurant.price}</div>
                    </div>
                  </div>
                </div>

                {/* AMENITIES */}
                <div className="amenities-section">
                  <h3 className="amenities-title">Amenities & Features</h3>
                  <div className="amenities-grid">
                    {restaurant.amenities.map((amenity, idx) => (
                      <div key={idx} className="amenity-badge">
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CUISINE & DIETARY */}
                <div className="details-row">
                  <div className="detail-box">
                    <h3 className="detail-title">Cuisines</h3>
                    <div className="tag-group">
                      {restaurant.cuisine_types.map((cuisine, idx) => (
                        <span key={idx} className="tag">{cuisine}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-box">
                    <h3 className="detail-title">Dietary Options</h3>
                    <div className="tag-group">
                      {restaurant.dietary_options.map((option, idx) => (
                        <span key={idx} className="tag">{option}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MENU TAB */}
            {activeTab === 'menu' && (
              <div className="tab-pane menu-tab">
                <h2 className="section-header">Menu</h2>
                <div className="menu-placeholder">
                  <p className="icon">📋</p>
                  <p className="text">View the full menu</p>
                  <button className="btn-primary">Download PDF Menu</button>
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="tab-pane reviews-tab">
                <h2 className="section-header">Reviews & Ratings</h2>

                {/* RATING SUMMARY */}
                <div className="rating-summary">
                  <div className="rating-score">
                    <div className="big-rating">⭐ {restaurant.rating}</div>
                    <div className="rating-subtitle">Based on {restaurant.reviews} reviews</div>
                  </div>
                  <div className="rating-distribution">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="rating-row">
                        <span className="star-label">{'⭐'.repeat(item.stars)}</span>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="count">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INDIVIDUAL REVIEWS */}
                <div className="reviews-list">
                  {mockReviews.map((review, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="avatar">{review.avatar}</span>
                          <div>
                            <div className="reviewer-name">{review.author}</div>
                            <div className="review-date">{review.date}</div>
                          </div>
                        </div>
                        <div className="review-stars">{'⭐'.repeat(review.rating)}</div>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHOTOS TAB */}
            {activeTab === 'photos' && (
              <div className="tab-pane photos-tab">
                <h2 className="section-header">Photo Gallery</h2>
                <div className="photos-grid">
                  {mockPhotos.map((photo, idx) => (
                    <div key={idx} className="photo-item">
                      <img src={photo} alt={`Restaurant photo ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR - BOOKING WIDGET */}
        {(bookingOpen || !isMobile) && (
          <aside className={`booking-sidebar ${bookingOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
            {isMobile && (
              <div className="sidebar-header">
                <h3>Reserve a Table</h3>
                <button className="close-btn" onClick={() => setBookingOpen(false)}>✕</button>
              </div>
            )}

            <div className="booking-widget">
              <h3 className="widget-title">Reserve a Table</h3>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" defaultValue="2024-01-20" />
              </div>

              <div className="form-group">
                <label className="form-label">Time</label>
                <select className="form-select">
                  <option>Select time...</option>
                  <option>11:00 AM</option>
                  <option>12:30 PM</option>
                  <option>1:00 PM</option>
                  <option>6:00 PM</option>
                  <option>7:00 PM</option>
                  <option>8:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Guests</label>
                <div className="guest-selector">
                  <button className="qty-btn">−</button>
                  <input type="number" className="qty-input" value="2" readOnly />
                  <button className="qty-btn">+</button>
                </div>
              </div>

              <div className="booking-summary">
                <div className="summary-row">
                  <span>Table for 2</span>
                  <span className="highlight">Jan 20, 7:00 PM</span>
                </div>
              </div>

              <button 
                className="btn-book-now"
                onClick={() => onBookingStart?.(restaurant.id)}
              >
                Book Now
              </button>

              <button className="btn-call">
                📞 Call Restaurant
              </button>

              <div className="widget-footer">
                <p className="cancellation-note">
                  ✓ Free cancellation up to 24 hours before reservation
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* MOBILE BOOKING BUTTON */}
        {isMobile && !bookingOpen && (
          <div className="mobile-booking-btn-container">
            <button 
              className="mobile-booking-btn"
              onClick={() => setBookingOpen(true)}
            >
              Reserve Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

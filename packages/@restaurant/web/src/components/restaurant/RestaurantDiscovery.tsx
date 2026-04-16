/**
 * RESTAURANT DISCOVERY PAGE
 * 
 * Features:
 * - 2-column layout (left filters, right results)
 * - Location, Cuisine, Price, Rating, Dietary filters
 * - Sort options (Relevance, Rating, Distance, Newest)
 * - Search bar in header
 * - Responsive (toggles sidebar on mobile)
 * 
 * Route: /restaurants
 */

import { useState, useEffect } from 'react';
import './RestaurantDiscovery.css';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  status: string;
  image: string;
  distance?: string;
  isOpen?: boolean;
}

interface RestaurantDiscoveryProps {
  onRestaurantSelect?: (restaurantId: string) => void;
  onBack?: () => void;
}

export default function RestaurantDiscovery({ onRestaurantSelect, onBack }: RestaurantDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Filters state
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(4);
  const [minRating, setMinRating] = useState(3);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  // Mock data
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'The Lagoon',
      cuisine: '🦐 Seafood',
      location: 'Colombo 1',
      rating: 4.8,
      reviews: 234,
      price: '$$',
      status: 'Open now ✓',
      image: 'https://via.placeholder.com/160x120?text=Lagoon',
      distance: '2.3km',
      isOpen: true,
    },
    {
      id: '2',
      name: 'Laksha',
      cuisine: '🍲 Sri Lankan',
      location: 'Colombo 3',
      rating: 4.9,
      reviews: 156,
      price: '$$$',
      status: 'Open now ✓',
      image: 'https://via.placeholder.com/160x120?text=Laksha',
      distance: '1.5km',
      isOpen: true,
    },
    {
      id: '3',
      name: 'Ministry of Crab',
      cuisine: '🦀 Seafood',
      location: 'Colombo 3',
      rating: 4.8,
      reviews: 189,
      price: '$$$',
      status: 'Open now ✓',
      image: 'https://via.placeholder.com/160x120?text=Crab',
      distance: '1.2km',
      isOpen: true,
    },
    {
      id: '4',
      name: 'Ottos',
      cuisine: '🍝 Italian',
      location: 'Colombo 7',
      rating: 4.7,
      reviews: 98,
      price: '$$$',
      status: 'Open now ✓',
      image: 'https://via.placeholder.com/160x120?text=Ottos',
      distance: '3.1km',
      isOpen: true,
    },
    {
      id: '5',
      name: 'Bagatelle',
      cuisine: '🥗 Vegetarian',
      location: 'Colombo 5',
      rating: 4.6,
      reviews: 76,
      price: '$$',
      status: 'Open now ✓',
      image: 'https://via.placeholder.com/160x120?text=Bagatelle',
      distance: '2.8km',
      isOpen: true,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const toggleDietary = (dietary: string) => {
    setSelectedDietary((prev) =>
      prev.includes(dietary) ? prev.filter((d) => d !== dietary) : [...prev, dietary]
    );
  };

  const filteredRestaurants = mockRestaurants.filter((rest) => {
    const matchesSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(rest.location);
    const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.some((c) => rest.cuisine.includes(c));
    const matchesRating = rest.rating >= minRating;

    return matchesSearch && matchesLocation && matchesCuisine && matchesRating;
  });

  return (
    <div className="restaurant-discovery">
      {/* HEADER */}
      <header className="discovery-header">
        <div className="header-content">
          <button className="back-button" onClick={onBack} title="Go back">
            ← Back
          </button>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search restaurants, cuisines, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰ Filters
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="discovery-container">
        {/* LEFT SIDEBAR - FILTERS */}
        {(sidebarOpen || !isMobile) && (
          <aside className={`filter-sidebar ${sidebarOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
            {isMobile && (
              <div className="sidebar-header">
                <h3>Filters</h3>
                <button className="close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
              </div>
            )}

            {/* LOCATION FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Location</h4>
              <div className="filter-options">
                {['Colombo 1', 'Colombo 3', 'Colombo 5', 'Colombo 7', 'Kandy', 'Galle']
                  .map((location) => (
                    <label key={location} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleLocation(location)}
                      />
                      <span>{location}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* CUISINE FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Cuisine</h4>
              <div className="filter-options">
                {['Sri Lankan', 'Seafood', 'Italian', 'Vegetarian', 'Fusion', 'Asian']
                  .map((cuisine) => (
                    <label key={cuisine} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCuisines.includes(cuisine)}
                        onChange={() => toggleCuisine(cuisine)}
                      />
                      <span>{cuisine}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* PRICE FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-slider">
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="price-display">
                  {'$'.repeat(priceRange)} - {'$'.repeat(4)}
                </div>
              </div>
            </div>

            {/* RATING FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Rating</h4>
              <div className="rating-options">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="rating-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === star}
                      onChange={() => setMinRating(star)}
                    />
                    <span>{'⭐'.repeat(star)} {star}.0 & above</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DIETARY FILTER */}
            <div className="filter-section">
              <h4 className="filter-title">Dietary</h4>
              <div className="filter-options">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal']
                  .map((dietary) => (
                    <label key={dietary} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedDietary.includes(dietary)}
                        onChange={() => toggleDietary(dietary)}
                      />
                      <span>{dietary}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="filter-actions">
              <button className="btn-apply">Apply</button>
              <button
                className="btn-clear"
                onClick={() => {
                  setSelectedLocations([]);
                  setSelectedCuisines([]);
                  setPriceRange(4);
                  setMinRating(3);
                  setSelectedDietary([]);
                }}
              >
                Clear All
              </button>
            </div>
          </aside>
        )}

        {/* RIGHT MAIN CONTENT */}
        <main className="main-content">
          {/* RESULTS HEADER */}
          <div className="results-header">
            <div className="results-info">
              <h2 className="results-count">{filteredRestaurants.length} restaurants</h2>
            </div>
            <div className="results-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
                <option value="newest">Newest</option>
              </select>
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  ≡
                </button>
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  ▦
                </button>
              </div>
            </div>
          </div>

          {/* RESTAURANTS LIST */}
          <div className={`restaurants-container ${viewMode}`}>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="restaurant-result-card"
                  onClick={() => onRestaurantSelect?.(restaurant.id)}
                >
                  <div className="result-image-wrapper">
                    <img src={restaurant.image} alt={restaurant.name} className="result-image" />
                    <span className="rating-badge-small">⭐ {restaurant.rating}</span>
                  </div>
                  <div className="result-content">
                    <h3 className="result-name">{restaurant.name}</h3>
                    <p className="result-cuisine">{restaurant.cuisine}</p>
                    <p className="result-meta">
                      {restaurant.location}
                      {restaurant.distance && ` • ${restaurant.distance}`}
                    </p>
                    <p className="result-status">
                      {restaurant.status}
                      {restaurant.isOpen && ' 🟢'}
                    </p>
                    <p className="result-price">{restaurant.price}</p>
                    <div className="result-buttons">
                      <button className="btn-details">View Details</button>
                      <button className="btn-favorite">❤️</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>⊙ No restaurants found</p>
                <p>Try adjusting your filters or search query</p>
                <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* LOAD MORE */}
          {filteredRestaurants.length > 0 && (
            <button className="btn-load-more">Load More Restaurants</button>
          )}
        </main>
      </div>
    </div>
  );
}

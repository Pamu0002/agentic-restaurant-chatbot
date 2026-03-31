/**
 * SEARCH PAGE COMPONENT
 * 
 * This page displays restaurant search results
 * Users can:
 * - See filtering options
 * - View restaurant cards
 * - Make reservations
 */

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search location from URL parameters
  const location = searchParams.get('location') || '';

  // Fetch restaurants when component loads
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/restaurants', {
          params: { location, limit: 20 }
        });

        if (response.data.success) {
          setRestaurants(response.data.data);
        }
      } catch (err) {
        setError('Failed to load restaurants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location]);

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="search-page">
      <h1>Restaurants in {location}</h1>
      <p>Found {restaurants.length} restaurants</p>

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisine} • {restaurant.location}</p>
            <div className="rating">⭐ {restaurant.rating}</div>
            <p>Available tables: {restaurant.availableTables}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

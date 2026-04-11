/**
 * RECOMMENDATIONS PAGE COMPONENT
 * 
 * Shows personalized restaurant recommendations based on:
 * - User preferences
 * - Booking history
 * - Restaurant ratings
 * - Cuisine preferences
 */

import { useAuth } from '@restaurant/shared';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import './RecommendationsPage.css';

interface Recommendation {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  image: string;
  reason: string;
  price_level?: string;
  distance?: string;
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Call Python AI service for recommendations
        const response = await axios.post(
          'http://localhost:8000/api/v1/agents/recommend',
          { user_id: user?.userId || 'guest' },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data?.result?.restaurants) {
          setRecommendations(response.data.result.restaurants);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchRecommendations();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Finding personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h1>✨ Personalized for You</h1>
        <p>Based on your favorite cuisines and booking history</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <p>No recommendations yet. Make some reservations to get personalized suggestions!</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="recommendation-item">
              <RestaurantCard 
                restaurant={rec}
                onBook={() => {
                  // Navigate to booking page or open booking modal
                  console.log('Booking:', rec.name);
                }}
              />
              <div className="recommendation-reason">
                <p>💡 {rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

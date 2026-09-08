/**
 * FAVORITES/WISHLIST
 * Display and manage user's favorite restaurants
 */

import { useUserProfile } from '@restaurant/shared';
import './Favorites.css';

export default function Favorites() {
  const { favorites, removeFavorite } = useUserProfile();

  const handleRemove = async (restaurantId: string) => {
    if (window.confirm('Remove from favorites?')) {
      await removeFavorite(restaurantId);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-section">
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3>No Favorites Yet</h3>
          <p>Start adding restaurants to your favorites to access them quickly!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h2>My Favorite Restaurants ({favorites.length})</h2>
        <p className="header-subtitle">Quickly access your favorite spots</p>
      </div>

      <div className="favorites-grid">
        {favorites.map(favorite => (
          <div key={favorite.restaurantId} className="favorite-card">
            {/* Favorite Image */}
            {favorite.image && (
              <div className="favorite-image">
                <img src={favorite.image} alt={favorite.name} />
                <div className="favorite-badge">❤️</div>
              </div>
            )}

            {/* Favorite Info */}
            <div className="favorite-info">
              <div className="favorite-header-info">
                <h3 className="favorite-name">{favorite.name}</h3>
                <span className="favorite-rating">⭐ {favorite.rating.toFixed(1)}</span>
              </div>

              <p className="favorite-cuisine">{favorite.cuisine}</p>
              <p className="favorite-location">📍 {favorite.location}</p>

              <div className="favorite-date">
                <span className="date-label">Added:</span>
                <span className="date-value">
                  {new Date(favorite.addedAt).toLocaleDateString()}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="favorite-actions">
                <button className="action-button view">
                  👁️ View Restaurant
                </button>
                <button
                  className="action-button remove"
                  onClick={() => handleRemove(favorite.restaurantId)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

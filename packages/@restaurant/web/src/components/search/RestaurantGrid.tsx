import { MapPin, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './RestaurantGrid.module.css';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  price: number;
  distance: number;
  availableTables: number;
  image: string;
}

interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}

export default function RestaurantGrid({ restaurants, isLoading = false }: RestaurantGridProps) {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonCard} />
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>No restaurants found</p>
        <p className={styles.emptyStateSubtitle}>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className={styles.card}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            {restaurant.image}
          </div>

          {/* Content Section */}
          <div className={styles.cardContent}>
            {/* Header */}
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleSection}>
                <h3 className={styles.cardTitle}>{restaurant.name}</h3>
                <p className={styles.cardCuisine}>{restaurant.cuisine}</p>
              </div>
              <div className={styles.ratingBadge}>
                <Star size={14} className={styles.starIcon} fill="currentColor" />
                <span className={styles.ratingText}>{restaurant.rating}</span>
              </div>
            </div>

            {/* Details */}
            <div className={styles.cardDetails}>
              <div className={styles.detailItem}>
                <MapPin size={14} />
                <span>{restaurant.distance} km away</span>
              </div>
              <div className={styles.detailItem}>
                <Users size={14} />
                <span>{restaurant.availableTables} tables available</span>
              </div>
            </div>

            {/* Footer - Action */}
            <div className={styles.cardFooter}>
              <button
                className={styles.reserveButton}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              >
                Reserve Table
              </button>
              <button className={styles.favoriteButton} title="Save to favorites">
                ❤️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * RESTAURANT CARD COMPONENT
 * 
 * Displays a restaurant recommendation with details and action buttons
 */

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    address: string;
    image: string;
  };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const handleBook = () => {
    alert(`Booking a table at ${restaurant.name}...`);
    // TODO: Navigate to booking page with restaurant details
  };

  const handleMoreInfo = () => {
    alert(`Loading details for ${restaurant.name}...`);
    // TODO: Show detailed restaurant page
  };

  return (
    <div className="restaurant-card">
      {/* HEADER WITH IMAGE AND NAME */}
      <div className="restaurant-header">
        <div className="restaurant-image">{restaurant.image}</div>
        <div className="restaurant-info">
          <div className="restaurant-name">{restaurant.name}</div>
          <div className="restaurant-details">
            <span>{restaurant.cuisine}</span>
            <span className="rating">⭐ {restaurant.rating}</span>
            <span>📍 {restaurant.address}</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="restaurant-actions">
        <button className="action-button primary" onClick={handleBook}>
          Book Table
        </button>
        <button className="action-button secondary" onClick={handleMoreInfo}>
          More Info
        </button>
      </div>
    </div>
  );
}

import { MapPin, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import colors from '../../theme/colors';

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              background: 'linear-gradient(180deg, rgba(30,41,59,0.8), rgba(15,23,42,0.6))',
              borderRadius: '12px',
              height: '320px',
              animate: 'pulse'
            }}
          />
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: colors.text.secondary
        }}
      >
        <p style={{ fontSize: '16px', marginBottom: '8px' }}>No restaurants found</p>
        <p style={{ fontSize: '14px', color: colors.text.muted }}>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          style={{
            background: `linear-gradient(180deg, ${colors.background.overlay}, ${colors.background.card})`,
            border: `1px solid ${colors.border.default}`,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.border.hover;
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(255, 107, 53, 0.3)`;
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border.default;
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Image Section */}
          <div
            style={{
              background: `linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 140, 66, 0.15))`,
              padding: '24px',
              textAlign: 'center',
              fontSize: '48px',
              borderBottom: `1px solid ${colors.border.default}`
            }}
          >
            {restaurant.image}
          </div>

          {/* Content Section */}
          <div style={{ padding: '20px' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'space-between',
                marginBottom: '12px',
                gap: '8px'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#fff',
                    lineHeight: '1.3'
                  }}
                >
                  {restaurant.name}
                </h3>
                <p
                  style={{
                    margin: '0',
                    fontSize: '13px',
                    color: '#94A3B8'
                  }}
                >
                  {restaurant.cuisine}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(6,182,212,0.2))',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Star size={14} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#E2E8F0' }}>
                  {restaurant.rating}
                </span>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#CBD5E1'
                }}
              >
                <MapPin size={14} style={{ color: colors.primary.base, flexShrink: 0 }} />
                <span>{restaurant.location}</span>
                <span style={{ color: '#64748B' }}>• {restaurant.distance} km</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#CBD5E1'
                }}
              >
                <Users size={14} style={{ color: colors.primary.base, flexShrink: 0 }} />
                <span>{restaurant.availableTables} tables available</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px'
                }}
              >
                <span style={{ color: '#64748B' }}>Price:</span>
                <span
                  style={{
                    color: '#14B8A6',
                    fontWeight: '600',
                    letterSpacing: '1px'
                  }}
                >
                  {'$'.repeat(restaurant.price)}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: `linear-gradient(135deg, ${colors.primary.base}, ${colors.primary.light})`,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Reserve Table
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

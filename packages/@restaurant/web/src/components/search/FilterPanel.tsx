import { ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { cuisineOptions } from '../../services/restaurantService';
import colors from '../../theme/colors';

interface FilterPanelProps {
  onFilterChange: (filters: {
    cuisines: string[];
    rating: number;
    price: number;
    distance: number;
  }) => void;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('cuisines');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedDistance, setSelectedDistance] = useState<number>(0);

  const handleCuisineChange = (cuisine: string) => {
    const updated = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines, cuisine];
    setSelectedCuisines(updated);
    onFilterChange({
      cuisines: updated,
      rating: selectedRating,
      price: selectedPrice,
      distance: selectedDistance
    });
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    onFilterChange({
      cuisines: selectedCuisines,
      rating,
      price: selectedPrice,
      distance: selectedDistance
    });
  };

  const handlePriceChange = (price: number) => {
    setSelectedPrice(price);
    onFilterChange({
      cuisines: selectedCuisines,
      rating: selectedRating,
      price,
      distance: selectedDistance
    });
  };

  const handleDistanceChange = (distance: number) => {
    setSelectedDistance(distance);
    onFilterChange({
      cuisines: selectedCuisines,
      rating: selectedRating,
      price: selectedPrice,
      distance
    });
  };

  const handleClearAll = () => {
    setSelectedCuisines([]);
    setSelectedRating(0);
    setSelectedPrice(0);
    setSelectedDistance(0);
    onFilterChange({
      cuisines: [],
      rating: 0,
      price: 0,
      distance: 0
    });
  };

  const activeFilters = [selectedCuisines.length, selectedRating, selectedPrice, selectedDistance].filter(
    (f) => f > 0
  ).length;

  return (
    <div
      style={{
        position: 'sticky',
        top: '120px',
        width: '280px',
        background: `linear-gradient(180deg, ${colors.background.overlay}, ${colors.background.card})`,
        border: `1px solid ${colors.border.default}`,
        borderRadius: '12px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        zIndex: 30,
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} style={{ color: colors.primary.base }} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>Filters</h3>
          {activeFilters > 0 && (
            <span
              style={{
                background: colors.gradient.primary,
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {activeFilters}
            </span>
          )}
        </div>
        {activeFilters > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              background: 'none',
              border: 'none',
              color: colors.text.secondary,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.primary.light;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cuisines */}
      <div style={{ marginBottom: '16px', borderBottom: `1px solid ${colors.border.default}`, paddingBottom: '16px' }}>
        <button
          onClick={() => setExpandedSection(expandedSection === 'cuisines' ? null : 'cuisines')}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: colors.text.primary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.primary.base;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.primary;
          }}
        >
          Cuisines
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.2s ease',
              transform: expandedSection === 'cuisines' ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {expandedSection === 'cuisines' && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cuisineOptions.map((cuisine) => (
              <label
                key={cuisine}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#CBD5E1',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#14B8A6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCuisines.includes(cuisine)}
                  onChange={() => handleCuisineChange(cuisine)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: colors.primary.base
                  }}
                />
                {cuisine}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '16px', borderBottom: `1px solid ${colors.border.default}`, paddingBottom: '16px' }}>
        <button
          onClick={() => setExpandedSection(expandedSection === 'rating' ? null : 'rating')}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: colors.text.primary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.primary.base;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.primary;
          }}
        >
          Minimum Rating
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.2s ease',
              transform: expandedSection === 'rating' ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {expandedSection === 'rating' && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[0, 3, 3.5, 4, 4.5].map((rating) => (
              <label
                key={rating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#CBD5E1',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#14B8A6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: colors.primary.base
                  }}
                />
                {rating === 0 ? 'Any Rating' : `${rating}+ ⭐`}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '16px', borderBottom: `1px solid ${colors.border.default}`, paddingBottom: '16px' }}>
        <button
          onClick={() => setExpandedSection(expandedSection === 'price' ? null : 'price')}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#E2E8F0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#14B8A6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#E2E8F0';
          }}
        >
          Price Range
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.2s ease',
              transform: expandedSection === 'price' ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {expandedSection === 'price' && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: 0, label: 'Any Price' },
              { value: 1, label: '$ - Budget Friendly' },
              { value: 2, label: '$$ - Moderate' },
              { value: 3, label: '$$$ - Expensive' },
              { value: 4, label: '$$$$ - Ultra Premium' }
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#CBD5E1',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#14B8A6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === option.value}
                  onChange={() => handlePriceChange(option.value)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#14B8A6'
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Distance */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'distance' ? null : 'distance')}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#E2E8F0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#14B8A6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#E2E8F0';
          }}
        >
          Distance
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.2s ease',
              transform: expandedSection === 'distance' ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {expandedSection === 'distance' && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: 0, label: 'Any Distance' },
              { value: 2, label: 'Within 2 km' },
              { value: 5, label: 'Within 5 km' },
              { value: 10, label: 'Within 10 km' },
              { value: 20, label: 'Within 20 km' }
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#CBD5E1',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#14B8A6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <input
                  type="radio"
                  name="distance"
                  checked={selectedDistance === option.value}
                  onChange={() => handleDistanceChange(option.value)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#14B8A6'
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

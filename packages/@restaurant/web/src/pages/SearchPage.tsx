/**
 * SEARCH PAGE COMPONENT
 * 
 * This page displays restaurant search results with advanced filtering
 * Users can:
 * - Search by restaurant name
 * - Filter by cushines, rating, price, distance
 * - View paginated results
 * - Make reservations
 */

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header_new';
import FilterPanel from '../components/search/FilterPanel';
import Pagination from '../components/search/Pagination';
import RestaurantGrid from '../components/search/RestaurantGrid';
import SearchHeader from '../components/search/SearchHeader';
import { filterRestaurants, getAllRestaurants } from '../services/restaurantService';
import colors from '../theme/colors';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allRestaurants] = useState(getAllRestaurants());
  const [filteredRestaurants, setFilteredRestaurants] = useState(allRestaurants);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    cuisines: [],
    rating: 0,
    price: 0,
    distance: 0
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  // Update URL and apply filters
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    }

    const filtered = filterRestaurants(searchQuery, filters.cuisines, filters.rating, filters.price, filters.distance);
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, setSearchParams]);

  // Handle scroll to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.gradient.background,
        paddingBottom: '40px',
        position: 'relative'
      }}
    >
      {/* Header */}
      <Header />

      {/* Fixed Search Header */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          zIndex: 40,
          padding: '16px 24px',
          background: colors.background.overlay,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${colors.border.default}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SearchHeader onSearch={handleSearch} initialQuery={searchQuery} />
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px',
          paddingTop: '120px'
        }}
      >
        {/* Results Header */}
        <div style={{ marginBottom: '24px' }}>
          {searchQuery && (
            <h2 style={{ color: colors.text.primary, margin: '0 0 8px 0', fontSize: '20px' }}>
              Search results for "<span style={{ color: colors.primary.base }}>{searchQuery}</span>"
            </h2>
          )}
          <p style={{ color: colors.text.secondary, margin: 0, fontSize: '14px' }}>
            Found <span style={{ color: colors.primary.base, fontWeight: '600' }}>{filteredRestaurants.length}</span> restaurants
          </p>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* Sidebar Filters */}
          <FilterPanel onFilterChange={handleFilterChange} />

          {/* Restaurant Grid */}
          <div>
            <RestaurantGrid restaurants={currentRestaurants} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredRestaurants.length}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: colors.gradient.primary,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px rgba(255, 107, 53, 0.4)`,
            transition: 'all 0.3s ease',
            zIndex: 50
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 12px 32px rgba(255, 107, 53, 0.6)`;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(255, 107, 53, 0.4)`;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}

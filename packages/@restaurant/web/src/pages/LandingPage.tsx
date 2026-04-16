import { ArrowRight, ChefHat, Clock, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header_new';
import { useChat } from '../context/ChatContext';
import { getFeaturedRestaurants, getTopRatedRestaurants } from '../services/restaurantService';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const { openChat } = useChat();

  useEffect(() => {
    setFeatured(getFeaturedRestaurants(3));
    setTopRated(getTopRatedRestaurants(6));
  }, []);

  return (
    <div className={styles.page}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Left: Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover Sri Lanka's Best Restaurants</h1>
          <p className={styles.heroSubtitle}>
            AI-powered recommendations, instant reservations, Sri Lankan flavors at your fingertips
          </p>

          {/* Feature Bullets */}
          <div className={styles.featureBullets}>
            <div className={styles.featureBullet}>
              <ChefHat className={styles.bulletIcon} size={24} />
              <div className={styles.bulletContent}>
                <div className={styles.bulletTitle}>🤖 AI Chef Assistant</div>
                <div className={styles.bulletDescription}>Get personalized recommendations instantly</div>
              </div>
            </div>

            <div className={styles.featureBullet}>
              <Clock className={styles.bulletIcon} size={24} />
              <div className={styles.bulletContent}>
                <div className={styles.bulletTitle}>⚡ One-Click Booking</div>
                <div className={styles.bulletDescription}>Reserve your table in seconds</div>
              </div>
            </div>

            <div className={styles.featureBullet}>
              <MessageCircle className={styles.bulletIcon} size={24} />
              <div className={styles.bulletContent}>
                <div className={styles.bulletTitle}>❤️ Saved Favorites</div>
                <div className={styles.bulletDescription}>Never forget a great restaurant</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <Link to="/restaurants" className={styles.ctaButtonPrimary}>
              Explore Restaurants <ArrowRight size={20} />
            </Link>
            <button onClick={openChat} className={styles.ctaButtonSecondary}>
              Chat with Chef 💬
            </button>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className={styles.heroImage}>
          <img
            src="/Right Side_ Imagery.png"
            alt="AgentDine Hero"
            className={styles.heroImageFile}
          />
        </div>
      </section>

      {/* Trust Section - Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statItem}>
          <div className={`${styles.statNumber} ${styles.statNumberPrimary}`}>1,250+</div>
          <div className={styles.statLabel}>Restaurants Listed</div>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.statNumber} ${styles.statNumberWarning}`}>42,000+</div>
          <div className={styles.statLabel}>Happy Diners</div>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.statNumber} ${styles.statNumberSuccess}`}>10+</div>
          <div className={styles.statLabel}>Cuisines</div>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.statNumber} ${styles.statNumberLight}`}>24/7</div>
          <div className={styles.statLabel}>Support</div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending in Colombo 🔥</h2>
          <Link to="/restaurants" className={styles.viewAllLink}>
            View All Restaurants →
          </Link>
        </div>

        <div className={styles.restaurantGridContainer}>
          {featured.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-default)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-base)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 107, 53, 0.3)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 140, 66, 0.15))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '100px'
                }}
              >
                {restaurant.image}
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                  {restaurant.name}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                  {restaurant.cuisine}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--secondary-warning)', fontSize: '18px' }}>⭐</span>
                    <span style={{ fontWeight: '700' }}>{restaurant.rating}</span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {restaurant.availableTables} tables
                  </span>
                </div>

                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '2px solid var(--primary-base)',
                    color: 'var(--primary-base)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-base)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-base)';
                  }}
                >
                  View Details
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Rated Section */}
        <div style={{ marginTop: '80px' }}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '40px' }}>
            Top Rated Restaurants ⭐
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '20px'
            }}
          >
            {topRated.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  padding: '16px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--background-hover)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{restaurant.image}</div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {restaurant.name}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>
                  {restaurant.cuisine}
                </div>
                <div style={{ color: 'var(--secondary-warning)', fontWeight: '700' }}>
                  ⭐ {restaurant.rating}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Concierge Marketing Section */}
      <section
        style={{
          padding: '80px 60px',
          maxWidth: '1440px',
          margin: '80px auto 0 auto',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 140, 66, 0.05))',
          borderRadius: '16px',
          border: '1px solid var(--border-default)',
          textAlign: 'center'
        }}
      >
        <h2
          style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '20px',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Your Digital Concierge Awaits
        </h2>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          Join thousands of food enthusiasts who have discovered their favorite restaurants and made unforgettable
          dining memories with AgentDine's AI-powered platform.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/restaurants" className={styles.ctaButtonPrimary}>
            Start Exploring Now →
          </Link>
          <button onClick={openChat} className={styles.ctaButtonSecondary}>
            Chat with Our AI Chef
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2024 AgentDine. All rights reserved. | Discover Sri Lanka's finest dining experiences.</p>
      </footer>
    </div>
  );
}

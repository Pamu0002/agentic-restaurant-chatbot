/**
 * LANDING PAGE - AgentDine Home
 * - Hero section with CTA buttons
 * - Trust indicators (stats)
 * - Featured restaurants
 * - Industry-standard layout
 */

import { ArrowRight, ChefHat, Clock, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { getFeaturedRestaurants, getTopRatedRestaurants } from '../../services/restaurantService';
import colors from '../../theme/colors';
import Header from '../layout/Header_new';

export default function LandingPage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const { openChat } = useChat();

  useEffect(() => {
    setFeatured(getFeaturedRestaurants(3));
    setTopRated(getTopRatedRestaurants(6));
  }, []);

  return (
    <div style={{ background: colors.background.main, color: colors.text.primary }}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section
        style={{
          marginTop: '80px',
          minHeight: '100vh',
          background: colors.gradient.background,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '60px',
          padding: '80px 60px',
          maxWidth: '1440px',
          margin: '80px auto 0 auto'
        }}
      >
        {/* Left: Content */}
        <div>
          <h1
            style={{
              fontSize: '52px',
              fontWeight: '700',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}
          >
            Discover Sri Lanka's Best Restaurants
          </h1>

          <p
            style={{
              fontSize: '20px',
              color: colors.text.secondary,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}
          >
            AI-powered recommendations, instant reservations, Sri Lankan flavors at your fingertips
          </p>

          {/* Feature Bullets */}
          <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ChefHat size={24} style={{ color: colors.primary.base, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>🤖 AI Chef Assistant</div>
                <div style={{ fontSize: '14px', color: colors.text.secondary }}>
                  Get personalized recommendations instantly
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Clock size={24} style={{ color: colors.primary.base, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>⚡ One-Click Booking</div>
                <div style={{ fontSize: '14px', color: colors.text.secondary }}>
                  Reserve your table in seconds
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MessageCircle size={24} style={{ color: colors.primary.base, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>❤️ Saved Favorites</div>
                <div style={{ fontSize: '14px', color: colors.text.secondary }}>
                  Never forget a great restaurant
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link
              to="/restaurants"
              style={{
                padding: '16px 40px',
                background: colors.gradient.primary,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: `0 8px 24px rgba(255, 107, 53, 0.3)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(255, 107, 53, 0.5)`;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(255, 107, 53, 0.3)`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Restaurants <ArrowRight size={20} />
            </Link>

            <button
              onClick={openChat}
              style={{
                padding: '16px 40px',
                background: 'transparent',
                border: `2px solid ${colors.primary.base}`,
                color: colors.primary.base,
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.primary.base;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = colors.primary.base;
              }}
            >
              Chat with Chef 💬
            </button>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <img
            src="/Right Side_ Imagery.png"
            alt="AgentDine Hero"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'contain'
            }}
          />
        </div>
      </section>

      {/* Trust Section - Stats */}
      <section
        style={{
          padding: '80px 60px',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '60px',
          textAlign: 'center'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: colors.primary.base,
              marginBottom: '8px'
            }}
          >
            1,250+
          </div>
          <div style={{ color: colors.text.secondary, fontSize: '16px' }}>
            Restaurants Listed
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: colors.secondary.warning,
              marginBottom: '8px'
            }}
          >
            42,000+
          </div>
          <div style={{ color: colors.text.secondary, fontSize: '16px' }}>
            Happy Diners
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: colors.secondary.success,
              marginBottom: '8px'
            }}
          >
            10+
          </div>
          <div style={{ color: colors.text.secondary, fontSize: '16px' }}>
            Cuisines
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: colors.primary.light,
              marginBottom: '8px'
            }}
          >
            24/7
          </div>
          <div style={{ color: colors.text.secondary, fontSize: '16px' }}>
            Support
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section
        style={{
          padding: '80px 60px',
          maxWidth: '1440px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '60px'
          }}
        >
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '700'
            }}
          >
            Trending in Colombo 🔥
          </h2>
          <Link
            to="/restaurants"
            style={{
              color: colors.primary.base,
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.primary.light;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.primary.base;
            }}
          >
            View All Restaurants →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            marginBottom: '60px'
          }}
        >
          {featured.map((restaurant) => (
            <div
              key={restaurant.id}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${colors.border.default}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary.base;
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(255, 107, 53, 0.3)`;
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border.default;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: '200px',
                  background: colors.gradient.backgroundCard,
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

                <p style={{ color: colors.text.secondary, fontSize: '14px', marginBottom: '12px' }}>
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
                    <span style={{ color: colors.secondary.warning, fontSize: '18px' }}>⭐</span>
                    <span style={{ fontWeight: '700' }}>{restaurant.rating}</span>
                  </div>
                  <span style={{ color: colors.text.secondary, fontSize: '12px' }}>
                    {restaurant.availableTables} tables
                  </span>
                </div>

                <Link
                  to={`/restaurants/${restaurant.id}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: `2px solid ${colors.primary.base}`,
                    color: colors.primary.base,
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.primary.base;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colors.primary.base;
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Top Rated Section */}
        <h2
          style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '40px',
            marginTop: '80px'
          }}
        >
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
                color: colors.text.primary,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                padding: '16px',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.background.hover;
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
              <div style={{ color: colors.text.secondary, fontSize: '12px', marginBottom: '8px' }}>
                {restaurant.cuisine}
              </div>
              <div style={{ color: colors.secondary.warning, fontWeight: '700' }}>
                ⭐ {restaurant.rating}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Digital Concierge Marketing Section */}
      <section
        style={{
          padding: '80px 60px',
          maxWidth: '1440px',
          margin: '80px auto 0 auto',
          background: `linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 140, 66, 0.05))`,
          borderRadius: '16px',
          border: `1px solid ${colors.border.default}`,
          textAlign: 'center'
        }}
      >
        <h2
          style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '20px',
            background: colors.gradient.primary,
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
            color: colors.text.secondary,
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}
        >
          Join thousands of food enthusiasts who have discovered their favorite restaurants and made unforgettable dining memories with AgentDine's AI-powered platform.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            style={{
              padding: '16px 40px',
              background: colors.gradient.primary,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: `0 8px 24px rgba(255, 107, 53, 0.3)`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 32px rgba(255, 107, 53, 0.5)`;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(255, 107, 53, 0.3)`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Started Free
          </Link>

          <a
            href="#"
            style={{
              padding: '16px 40px',
              background: 'transparent',
              border: `2px solid ${colors.primary.base}`,
              color: colors.primary.base,
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary.base;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.primary.base;
            }}
          >
            Download the App
          </a>
        </div>
      </section>
      <footer
        style={{
          background: colors.background.card,
          borderTop: `1px solid ${colors.border.default}`,
          padding: '60px',
          marginTop: '80px'
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '40px'
          }}
        >
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Features</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Pricing</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>API</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>About</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Blog</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Help</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Community</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Status</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Privacy</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Terms</a></li>
              <li><a href="#" style={{ color: colors.text.secondary, textDecoration: 'none' }}>Cookies</a></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${colors.border.default}`,
            paddingTop: '20px',
            textAlign: 'center',
            color: colors.text.secondary,
            fontSize: '14px'
          }}
        >
          © 2026 AgentDine. All rights reserved. 🍽️
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

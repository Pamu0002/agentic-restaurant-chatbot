/**
 * RESERVATIONS PAGE COMPONENT
 * 
 * Shows user's booking history and allows:
 * - Viewing past reservations
 * - Cancelling reservations
 * - Modifying reservations
 * - Making new reservations
 */

import { useAuth } from '@restaurant/shared';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './ReservationPage.css';

interface Reservation {
  id: string;
  restaurantName: string;
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  confirmationCode: string;
  specialRequests?: string;
  cuisine?: string;
  image?: string;
}

export default function ReservationPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  // Fetch reservations from backend
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `http://localhost:5000/api/reservations`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.data) {
          setReservations(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchReservations();
    }
  }, [user]);

  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/reservations/${reservationId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      // Update local state
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: 'cancelled' } : res
        )
      );
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert('Failed to cancel reservation');
    }
  };

  // Filter reservations by date
  const now = new Date();
  const upcomingReservations = reservations.filter(
    (res) => new Date(res.date) >= now && res.status !== 'cancelled'
  );
  const pastReservations = reservations.filter(
    (res) => new Date(res.date) < now || res.status === 'cancelled'
  );

  const displayReservations = selectedTab === 'upcoming' ? upcomingReservations : pastReservations;

  if (loading) {
    return (
      <div className="reservation-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <h1>📅 My Reservations</h1>
        <p>Manage your restaurant bookings</p>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* TAB BUTTONS */}
      <div className="reservation-tabs">
        <button
          className={`tab-button ${selectedTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setSelectedTab('upcoming')}
        >
          📆 Upcoming ({upcomingReservations.length})
        </button>
        <button
          className={`tab-button ${selectedTab === 'past' ? 'active' : ''}`}
          onClick={() => setSelectedTab('past')}
        >
          ✅ Past ({pastReservations.length})
        </button>
      </div>

      {/* RESERVATIONS LIST */}
      {displayReservations.length === 0 ? (
        <div className="no-reservations">
          <p>
            {selectedTab === 'upcoming'
              ? "You don't have any upcoming reservations yet."
              : 'No past reservations.'}
          </p>
          <p>Search for restaurants and book a table!</p>
          <a href="/">← Back to Chat</a>
        </div>
      ) : (
        <div className="reservations-list">
          {displayReservations.map((res) => (
            <div key={res.id} className={`reservation-card status-${res.status}`}>
              <div className="reservation-image">
                <div className="restaurant-emoji">{res.image || '🍽️'}</div>
              </div>

              <div className="reservation-content">
                <div className="reservation-header-row">
                  <h3>{res.restaurantName}</h3>
                  <span className={`status-badge status-${res.status}`}>
                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                  </span>
                </div>

                {res.cuisine && <p className="cuisine">🍽️ {res.cuisine}</p>}

                <div className="reservation-details">
                  <div className="detail">
                    <span className="label">📅 Date:</span>
                    <span className="value">{new Date(res.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail">
                    <span className="label">🕐 Time:</span>
                    <span className="value">{res.time}</span>
                  </div>
                  <div className="detail">
                    <span className="label">👥 Party:</span>
                    <span className="value">{res.partySize} people</span>
                  </div>
                  <div className="detail">
                    <span className="label">🎫 Code:</span>
                    <span className="value">{res.confirmationCode}</span>
                  </div>
                </div>

                {res.specialRequests && (
                  <p className="special-requests">📝 {res.specialRequests}</p>
                )}

                {/* ACTIONS */}
                <div className="reservation-actions">
                  {res.status === 'confirmed' && (
                    <>
                      <button className="action-button primary">📞 Contact Restaurant</button>
                      <button 
                        className="action-button danger"
                        onClick={() => handleCancelReservation(res.id)}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}
                  {res.status === 'completed' && (
                    <button className="action-button primary">⭐ Leave Review</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

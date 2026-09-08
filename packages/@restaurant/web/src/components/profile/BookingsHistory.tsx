/**
 * BOOKINGS HISTORY
 * Display and manage user's restaurant bookings (upcoming and past)
 */

import React, { useState } from 'react';
import { useUserProfile } from '@restaurant/shared';
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import './BookingsHistory.css';

export default function BookingsHistory() {
  const { upcomingBookings, pastBookings, cancelBooking, addReview } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reviewingBooking, setReviewingBooking] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Cancel this booking? This action cannot be undone.')) {
      await cancelBooking(bookingId);
    }
  };

  const handleSubmitReview = async (bookingId: string) => {
    if (reviewData.review.trim().length === 0) {
      alert('Please write a review');
      return;
    }
    await addReview(bookingId, reviewData.rating, reviewData.review);
    setReviewingBooking(null);
    setReviewData({ rating: 5, review: '' });
  };

  const renderBookingStatus = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      confirmed: { class: 'status-confirmed', label: 'Confirmed' },
      completed: { class: 'status-completed', label: 'Completed' },
      cancelled: { class: 'status-cancelled', label: 'Cancelled' },
      pending: { class: 'status-pending', label: 'Pending' },
    };

    const info = statusMap[status] || { class: 'status-default', label: status };
    return <span className={`status-badge ${info.class}`}>{info.label}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderBookingCard = (booking: any) => (
    <div key={booking.bookingId} className="booking-card">
      <div className="booking-header">
        <h3 className="booking-restaurant">{booking.restaurantName}</h3>
        {renderBookingStatus(booking.status)}
      </div>

      <div className="booking-details">
        <div className="detail-item">
          <FaCalendarAlt className="detail-icon" />
          <div>
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(booking.date)}</span>
          </div>
        </div>

        <div className="detail-item">
          <FaClock className="detail-icon" />
          <div>
            <span className="detail-label">Time</span>
            <span className="detail-value">{booking.time}</span>
          </div>
        </div>

        <div className="detail-item">
          <FaUsers className="detail-icon" />
          <div>
            <span className="detail-label">Guests</span>
            <span className="detail-value">{booking.guestCount} people</span>
          </div>
        </div>
      </div>

      {booking.specialRequests && (
        <div className="special-requests">
          <strong>Special Requests:</strong>
          <p>{booking.specialRequests}</p>
        </div>
      )}

      <div className="booking-actions">
        {activeTab === 'upcoming' && booking.status === 'confirmed' && (
          <button
            className="action-btn danger"
            onClick={() => handleCancelBooking(booking.bookingId)}
          >
            Cancel Booking
          </button>
        )}

        {activeTab === 'past' && booking.status === 'completed' && !booking.review && (
          <button
            className="action-btn primary"
            onClick={() => {
              setReviewingBooking(booking.bookingId);
              setReviewData({ rating: 5, review: '' });
            }}
          >
            Leave a Review
          </button>
        )}

        {booking.review && (
          <div className="review-info">
            <div className="review-header">
              <strong>Your Review</strong>
              <span className="review-rating">⭐ {booking.rating}/5</span>
            </div>
            <p className="review-text">{booking.review}</p>
          </div>
        )}
      </div>

      {reviewingBooking === booking.bookingId && (
        <div className="review-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= reviewData.rating ? 'active' : ''}`}
                  onClick={() =>
                    setReviewData({ ...reviewData, rating: star })
                  }
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-text">Review</label>
            <textarea
              id="review-text"
              className="review-textarea"
              placeholder="Share your dining experience..."
              value={reviewData.review}
              onChange={(e) =>
                setReviewData({ ...reviewData, review: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              className="form-btn submit"
              onClick={() => handleSubmitReview(booking.bookingId)}
            >
              Submit Review
            </button>
            <button
              className="form-btn cancel"
              onClick={() => setReviewingBooking(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bookings-section">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <p className="header-subtitle">
          {activeTab === 'upcoming'
            ? `${upcomingBookings.length} upcoming booking${upcomingBookings.length !== 1 ? 's' : ''}`
            : `${pastBookings.length} past booking${pastBookings.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="bookings-tabs">
        <button
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past ({pastBookings.length})
        </button>
      </div>

      <div className="bookings-list">
        {activeTab === 'upcoming' ? (
          upcomingBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No Upcoming Bookings</h3>
              <p>Explore restaurants and make a reservation!</p>
            </div>
          ) : (
            upcomingBookings.map(renderBookingCard)
          )
        ) : pastBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No Past Bookings</h3>
            <p>Your completed bookings will appear here.</p>
          </div>
        ) : (
          pastBookings.map(renderBookingCard)
        )}
      </div>
    </div>
  );
}

/**
 * BOOKING STEP 3: CONFIRMATION & REVIEW
 * 
 * Features:
 * - Full reservation summary
 * - Cancellation policy info
 * - Terms & conditions checkbox
 * - Confirm button to finalize booking
 * - Progress bar (100% complete)
 * 
 * Route: /booking/step3
 */

import { useState, useEffect } from 'react';
import './BookingFlow.css';

interface BookingStep3Props {
  restaurantId?: string;
  restaurantName?: string;
  restaurantRating?: number;
  selectedDate?: string;
  selectedTime?: string;
  guestCount?: number;
  notes?: string;
  onConfirm?: () => void;
  onBack?: () => void;
}

export default function BookingStep3({
  restaurantId = '1',
  restaurantName = 'Laksha',
  restaurantRating = 4.9,
  selectedDate = '',
  selectedTime = '',
  guestCount = 2,
  notes = '',
  onConfirm,
  onBack,
}: BookingStep3Props) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const generateConfirmationCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'REST-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2) code += '-';
    }
    return code;
  };

  const confirmationCode = generateConfirmationCode();

  const handleConfirm = async () => {
    if (!termsAccepted) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onConfirm?.();
  };

  return (
    <div className="booking-container">
      {/* HEADER */}
      <header className="booking-header">
        <button className="back-btn" onClick={onBack} disabled={loading}>
          ← Back
        </button>
        <h1 className="booking-title">Confirm Reservation</h1>
        <div className="step-indicator">Step 3 of 3</div>
      </header>

      {/* PROGRESS BAR */}
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* STEP INDICATORS */}
      <div className="step-indicators">
        <div className="step completed">✓</div>
        <div className="step-connector"></div>
        <div className="step completed">✓</div>
        <div className="step-connector"></div>
        <div className="step active">3</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="booking-main">
        {/* LEFT CONTENT - Confirmation Summary */}
        <div className="booking-content">
          {/* BOOKING SUMMARY CARD */}
          <div className="confirmation-card">
            <h2 className="section-title">Confirm Your Reservation</h2>

            {/* RESTAURANT DETAILS */}
            <div className="confirmation-section">
              <h3 className="section-label">Restaurant</h3>
              <div className="detail-row">
                <span className="detail-icon">🍽️</span>
                <div>
                  <div className="detail-value">{restaurantName}</div>
                  <div className="detail-meta">Sri Lankan Cuisine • ⭐ {restaurantRating}</div>
                </div>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="confirmation-section">
              <h3 className="section-label">Reservation Details</h3>
              <div className="detail-row">
                <span className="detail-icon">📅</span>
                <div>
                  <div className="detail-value">{formatDateDisplay(selectedDate)}</div>
                  <div className="detail-meta">{selectedDate}</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">⏰</span>
                <div>
                  <div className="detail-value">{selectedTime} - {selectedTime}</div>
                  <div className="detail-meta">Estimated 2-hour dining</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">👥</span>
                <div>
                  <div className="detail-value">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</div>
                  <div className="detail-meta">Party size</div>
                </div>
              </div>
            </div>

            {/* SPECIAL REQUESTS */}
            {notes && (
              <div className="confirmation-section">
                <h3 className="section-label">Special Requests</h3>
                <div className="notes-display">
                  <p>"{notes}"</p>
                </div>
              </div>
            )}

            {/* PRICING */}
            <div className="confirmation-section pricing-section">
              <h3 className="section-label">Pricing</h3>
              <div className="price-row">
                <span>Booking Fee:</span>
                <span className="price-highlight">FREE! 🎉</span>
              </div>
              <div className="price-row">
                <span>No deposit required</span>
                <span className="price-note">Pay at restaurant</span>
              </div>
            </div>

            {/* CANCELLATION POLICY */}
            <div className="confirmation-section policy-section">
              <h3 className="section-label">Cancellation Policy</h3>
              <div className="policy-item">
                <span className="policy-check">✓</span>
                <span className="policy-text">Free cancellation up to 24 hours before reservation</span>
              </div>
              <div className="policy-item">
                <span className="policy-check">✓</span>
                <span className="policy-text">Edit or modify your booking anytime</span>
              </div>
              <div className="policy-item">
                <span className="policy-check">✓</span>
                <span className="policy-text">Confirmation email sent immediately</span>
              </div>
            </div>

            {/* TERMS AGREEMENT */}
            <div className="confirmation-section terms-section">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={loading}
                />
                <span>
                  I agree to the <a href="#terms">Terms and Conditions</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* ACTION BUTTONS */}
            <div className="confirmation-actions">
              <button
                className={`btn-confirm ${loading ? 'loading' : ''}`}
                onClick={handleConfirm}
                disabled={!termsAccepted || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  '✓ Confirm Reservation'
                )}
              </button>
              <button className="btn-cancel" onClick={onBack} disabled={loading}>
                ← Edit Reservation
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - SUMMARY */}
        <aside className="booking-summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Booking Summary</h3>

            {/* RESTAURANT INFO */}
            <div className="summary-section">
              <div className="restaurant-info">
                <div className="restaurant-name">{restaurantName}</div>
                <div className="restaurant-rating">⭐ {restaurantRating}</div>
              </div>
            </div>

            {/* ALL DETAILS */}
            <div className="summary-section">
              <div className="summary-item">
                <span className="label">📅 Date:</span>
                <span className="value">{formatDateDisplay(selectedDate)}</span>
              </div>
              <div className="summary-item">
                <span className="label">⏰ Time:</span>
                <span className="value">{selectedTime}</span>
              </div>
              <div className="summary-item">
                <span className="label">👥 Guests:</span>
                <span className="value">{guestCount}</span>
              </div>
            </div>

            {/* CONFIRMATION CODE PREVIEW */}
            <div className="summary-section">
              <div className="confirmation-code-display">
                <div className="code-label">Confirmation Code:</div>
                <div className="code-box">{confirmationCode}</div>
                <button className="btn-copy">📋 Copy Code</button>
              </div>
            </div>

            {/* FINAL STATUS */}
            <div className="summary-status">
              <div className="status-complete">
                ✓ Ready to Confirm
              </div>
            </div>

            {/* TERMS REMINDER */}
            <div className="terms-reminder">
              <p className="reminder-text">
                Please check the agreement and
                <strong> click Confirm</strong> to finish booking
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

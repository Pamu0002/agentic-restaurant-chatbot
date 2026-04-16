/**
 * BOOKING STEP 2: PARTY SIZE & SPECIAL REQUESTS
 * 
 * Features:
 * - Party size selector (1-6+ guests)
 * - Special requests textarea
 * - Quick chips (Birthday, Window seat, High chair, etc.)
 * - Progress bar (66% complete)
 * 
 * Route: /booking/step2
 */

import { useState, useEffect } from 'react';
import './BookingFlow.css';

interface BookingStep2Props {
  restaurantId?: string;
  restaurantName?: string;
  restaurantRating?: number;
  selectedDate?: string;
  selectedTime?: string;
  onNext?: (guestCount: number, notes: string, specialRequests: string[]) => void;
  onBack?: () => void;
}

export default function BookingStep2({
  restaurantId = '1',
  restaurantName = 'Laksha',
  restaurantRating = 4.9,
  selectedDate = '',
  selectedTime = '',
  onNext,
  onBack,
}: BookingStep2Props) {
  const [guestCount, setGuestCount] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const quickChips = [
    { id: 'birthday', label: '🎂 Birthday', icon: '🎂' },
    { id: 'window', label: '🪟 Window Seat', icon: '🪟' },
    { id: 'highchair', label: '👼 High Chair', icon: '👼' },
    { id: 'quiet', label: '🤫 Quiet Area', icon: '🤫' },
    { id: 'romantic', label: '💕 Romantic', icon: '💕' },
  ];

  const toggleChip = (chipId: string) => {
    setSelectedChips((prev) =>
      prev.includes(chipId) ? prev.filter((id) => id !== chipId) : [...prev, chipId]
    );
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleNext = () => {
    const specialRequestsText = selectedChips
      .map((id) => quickChips.find((c) => c.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const fullNotes = [specialNotes, specialRequestsText].filter(Boolean).join('. ');
    onNext?.(guestCount, fullNotes, selectedChips);
  };

  return (
    <div className="booking-container">
      {/* HEADER */}
      <header className="booking-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="booking-title">Reservation Details</h1>
        <div className="step-indicator">Step 2 of 3</div>
      </header>

      {/* PROGRESS BAR */}
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '66%' }}></div>
        </div>
      </div>

      {/* STEP INDICATORS */}
      <div className="step-indicators">
        <div className="step completed">✓</div>
        <div className="step-connector"></div>
        <div className="step active">2</div>
        <div className="step-connector"></div>
        <div className="step">3</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="booking-main">
        {/* LEFT CONTENT - Form */}
        <div className="booking-content">
          {/* PARTY SIZE SELECTOR */}
          <div className="section-card">
            <h2 className="section-title">Party Size</h2>
            <p className="section-subtitle">How many guests will be dining?</p>
            <div className="party-size-selector">
              {[1, 2, 3, 4, 5, 6].map((size) => (
                <button
                  key={size}
                  className={`party-btn ${guestCount === size ? 'selected' : ''}`}
                  onClick={() => setGuestCount(size)}
                >
                  {size}
                  <span className="party-label">
                    {size === 1 ? 'Guest' : 'Guests'}
                  </span>
                </button>
              ))}
              <button
                className={`party-btn ${guestCount > 6 ? 'selected' : ''}`}
                onClick={() => setGuestCount(7)}
              >
                6+
                <span className="party-label">Guests</span>
              </button>
            </div>
          </div>

          {/* QUICK CHIPS */}
          <div className="section-card">
            <h2 className="section-title">Special Occasions</h2>
            <p className="section-subtitle">Is this a special occasion?</p>
            <div className="quick-chips">
              {quickChips.map((chip) => (
                <button
                  key={chip.id}
                  className={`chip ${selectedChips.includes(chip.id) ? 'selected' : ''}`}
                  onClick={() => toggleChip(chip.id)}
                >
                  {chip.icon} {chip.label.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* SPECIAL REQUESTS */}
          <div className="section-card">
            <h2 className="section-title">Special Requests</h2>
            <p className="section-subtitle">Any dietary restrictions or special needs?</p>
            <textarea
              className="special-requests-input"
              placeholder="E.g., Window seat if available, celebrating engagement..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              maxLength={250}
            ></textarea>
            <div className="char-count">{specialNotes.length}/250</div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - SUMMARY */}
        <aside className="booking-summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Reservation Summary</h3>

            {/* RESTAURANT INFO */}
            <div className="summary-section">
              <div className="restaurant-info">
                <div className="restaurant-name">{restaurantName}</div>
                <div className="restaurant-rating">⭐ {restaurantRating}</div>
              </div>
            </div>

            {/* SELECTIONS */}
            <div className="summary-section">
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">
                  {selectedDate ? formatDateDisplay(selectedDate) : 'Not set'}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Time:</span>
                <span className="value">
                  {selectedTime || 'Not set'}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Guests:</span>
                <span className="value highlight">
                  👥 {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
            </div>

            {/* SPECIAL REQUESTS DISPLAY */}
            {(specialNotes || selectedChips.length > 0) && (
              <div className="summary-section">
                <div className="summary-label">Special Requests:</div>
                <div className="summary-requests">
                  {selectedChips.map((chipId) => {
                    const chip = quickChips.find((c) => c.id === chipId);
                    return (
                      <span key={chipId} className="request-tag">
                        {chip?.icon}
                      </span>
                    );
                  })}
                  {specialNotes && (
                    <div className="request-text">"{specialNotes}"</div>
                  )}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="summary-actions">
              <button className="btn-next" onClick={handleNext}>
                Continue to Step 3
              </button>
              <button className="btn-cancel" onClick={onBack}>
                ← Back to Step 1
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

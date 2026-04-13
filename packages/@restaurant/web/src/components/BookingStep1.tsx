/**
 * BOOKING STEP 1: DATE & TIME SELECTION
 * 
 * Features:
 * - Calendar date selector (next 30 days available)
 * - Time slot selection grid
 * - Progress bar (33% complete)
 * - Summary sidebar showing selections
 * 
 * Route: /booking/step1
 */

import { useState, useEffect } from 'react';
import './BookingFlow.css';

interface BookingStep1Props {
  restaurantId?: string;
  restaurantName?: string;
  restaurantRating?: number;
  onNext?: (date: string, time: string) => void;
  onBack?: () => void;
}

export default function BookingStep1({ 
  restaurantId = '1',
  restaurantName = 'Laksha',
  restaurantRating = 4.9,
  onNext,
  onBack 
}: BookingStep1Props) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate next 30 days available dates
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Time slots (working hours: 11:00 to 22:00)
  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  // Simulated booked slots (some times are unavailable)
  const bookedSlots = ['11:00', '12:00', '12:30', '19:00', '19:30', '20:00'];

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const availableDates = getAvailableDates();

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext?.(selectedDate, selectedTime);
    }
  };

  return (
    <div className="booking-container">
      {/* HEADER */}
      <header className="booking-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="booking-title">Reserve a Table</h1>
        <div className="step-indicator">Step 1 of 3</div>
      </header>

      {/* PROGRESS BAR */}
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* STEP INDICATORS */}
      <div className="step-indicators">
        <div className="step active">1</div>
        <div className="step-connector"></div>
        <div className="step">2</div>
        <div className="step-connector"></div>
        <div className="step">3</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="booking-main">
        {/* LEFT CONTENT - Calendar & Time Selection */}
        <div className="booking-content">
          <div className="section-card">
            <h2 className="section-title">Select Date</h2>
            <div className="calendar-grid">
              {availableDates.slice(0, 14).map((date, idx) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();

                return (
                  <button
                    key={idx}
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div className="day-name">{dayName}</div>
                    <div className="day-number">{dayNum}</div>
                  </button>
                );
              })}
            </div>
            <p className="calendar-note">Showing next 14 days. More dates available on scroll.</p>
          </div>

          {/* TIME SLOTS */}
          <div className="section-card">
            <h2 className="section-title">Select Time</h2>
            <div className="time-slots-grid">
              {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    className={`time-slot ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    title={isBooked ? 'Time not available' : 'Click to select'}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <p className="time-note">
              <span className="available-dot"></span> Available |
              <span className="booked-dot"></span> Not Available
            </p>
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
                  {selectedDate ? formatDateDisplay(selectedDate) : 'Not selected'}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Time:</span>
                <span className="value">
                  {selectedTime || 'Not selected'}
                </span>
              </div>
            </div>

            {/* SELECTION STATUS */}
            <div className="summary-status">
              {selectedDate && selectedTime ? (
                <div className="status-complete">
                  ✓ Both date and time selected
                </div>
              ) : (
                <div className="status-incomplete">
                  ⊙ Please select date and time
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="summary-actions">
              <button
                className="btn-next"
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
              >
                Continue to Step 2
              </button>
              <button className="btn-cancel" onClick={onBack}>
                ← Back to Restaurant
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

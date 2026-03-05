/**
 * WELCOME SCREEN COMPONENT
 * 
 * USER STORIES:
 * 1. Display Welcome Screen on App Launch for new Users
 * 2. Display system logo and chatbot introduction
 * 
 * This is the first screen users see when they launch the app
 * Shows the system logo and introduction to the chatbot
 */

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function WelcomeScreen({ onSignIn, onSignUp }: WelcomeScreenProps) {
  return (
    <div className="auth-container">
      <div className="auth-card welcome-card">
        {/* LOGO & TITLE */}
        <div className="welcome-header">
          <div className="welcome-logo">🍽️</div>
          <h1 className="welcome-title">Restaurant Chatbot</h1>
          <p className="welcome-subtitle">Discover, Book & Enjoy Amazing Restaurants</p>
        </div>

        {/* FEATURES LIST */}
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <div>
              <h3>AI-Powered Discovery</h3>
              <p>Chat with our intelligent assistant to find perfect restaurants</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📅</span>
            <div>
              <h3>Easy Reservations</h3>
              <p>Book tables instantly with real-time availability tracking</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⭐</span>
            <div>
              <h3>Personalized Recommendations</h3>
              <p>Get suggestions tailored to your preferences and history</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💳</span>
            <div>
              <h3>Secure Payments</h3>
              <p>Process payments safely with multiple payment options</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="auth-buttons">
          <button className="btn btn-primary" onClick={onSignIn}>
            Sign In
          </button>
          <button className="btn btn-secondary" onClick={onSignUp}>
            Create Account
          </button>
        </div>

        {/* FOOTER */}
        <div className="auth-footer">
          <p>© 2024 Restaurant Chatbot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

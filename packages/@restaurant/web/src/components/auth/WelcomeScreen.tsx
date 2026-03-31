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
    <div className="auth-container welcome-screen">
      <div className="auth-card welcome-card">
        {/* LOGO & TITLE */}
        <div className="welcome-header">
          <div className="welcome-logo-wrapper">
            <div className="welcome-logo">🍽️</div>
            <div className="logo-badge">📦</div>
          </div>
          <h1 className="welcome-title">DineBot</h1>
          <p className="welcome-subtitle">Your AI-powered restaurant discovery and booking assistant</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="auth-buttons welcome-buttons">
          <button className="btn btn-primary btn-large" onClick={onSignUp}>
            Get Started
          </button>
          <button className="btn btn-outline" onClick={onSignIn}>
            Sign In
          </button>
        </div>

        {/* FEATURES LIST */}
        <div className="features-list welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <p>AI-powered chatbot assistance</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🥄</span>
            <p>Personalized recommendations</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <p>Easy reservation & payment</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="auth-footer">
          <p>© 2024 DineBot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 * 
 * Handles authentication routing and main app layout
 * Routes between Welcome Screen, SignUp, SignIn, and Chat Interface
 */

import { AuthProvider, useAuth } from '@restaurant/shared';
import { useEffect, useState } from 'react';
import ChatInterface from './components/ChatInterface';
import UserSidebar from './components/UserSidebar';
import GoogleCallback from './components/auth/GoogleCallback';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import UserProfile from './components/auth/UserProfile';
import WelcomeScreen from './components/auth/WelcomeScreen';
import './index.css';

type AuthScreen = 'welcome' | 'signin' | 'signup' | 'google-callback';

function AppContent() {
  // ============================================
  // STATE & CONTEXT
  // ============================================

  const { isAuthenticated, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ============================================
  // INIT: CHECK IF USER IS LOGGED IN & HANDLE OAUTH REDIRECT
  // ============================================

  useEffect(() => {
    // Check if this is a Google OAuth callback - runs once on mount
    console.log('📍 AppContent mounted, checking for OAuth hash...');
    
    const hash = window.location.hash.substring(1);
    console.log('🔍 Hash value:', hash.substring(0, 100) + (hash.length > 100 ? '...' : ''));
    
    if (hash && (hash.includes('id_token') || hash.includes('access_token'))) {
      console.log('✅ OAuth callback detected! Showing GoogleCallback component');
      setAuthScreen('google-callback');
      return;
    }

    console.log('ℹ️ No OAuth hash detected');
    console.log('isAuthenticated at mount:', isAuthenticated);
  }, [isAuthenticated]);

  // Monitor authentication changes
  useEffect(() => {
    console.log('🔄 isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated && authScreen === 'google-callback') {
      console.log('✅ User authenticated! Clearing google-callback screen');
      // Don't change authScreen - let the main render handle it
    }
  }, [isAuthenticated]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleLogout = () => {
    logout();
    setAuthScreen('welcome');
    setSidebarOpen(false);
    setProfileOpen(false);
  };

  // ============================================
  // RENDER: HANDLE GOOGLE CALLBACK FIRST
  // ============================================

  // Always show GoogleCallback component when processing OAuth
  if (authScreen === 'google-callback' && !isAuthenticated) {
    return (
      <GoogleCallback 
        onSuccess={() => {
          console.log('✅ GoogleCallback onSuccess called');
          console.log('Current isAuthenticated:', isAuthenticated);
          // Don't set authScreen - wait for isAuthenticated to update
          // The useEffect will trigger when auth state changes
        }}
        onError={() => {
          console.error('❌ GoogleCallback onError called');
          setAuthScreen('signin');
        }}
      />
    );
  }

  // ============================================
  // RENDER: AUTHENTICATION SCREENS
  // ============================================

  if (!isAuthenticated) {
    return (
      <>
        {authScreen === 'welcome' && (
          <WelcomeScreen
            onSignIn={() => setAuthScreen('signin')}
            onSignUp={() => setAuthScreen('signup')}
          />
        )}

        {authScreen === 'signin' && (
          <SignIn
            onBack={() => setAuthScreen('welcome')}
            onSignInSuccess={() => {
              setAuthScreen('welcome');
              // User will be authenticated after this
            }}
            onSignUpClick={() => setAuthScreen('signup')}
          />
        )}

        {authScreen === 'signup' && (
          <SignUp
            onBack={() => setAuthScreen('signin')}
            onSignUpSuccess={() => {
              setAuthScreen('welcome');
              // User will be authenticated after this
            }}
          />
        )}
      </>
    );
  }

  // ============================================
  // RENDER: AUTHENTICATED APP
  // ============================================

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-content">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h1 className="app-title">🍽️ DineBot</h1>
          <div className="header-actions">
            <button
              className="header-icon-btn"
              onClick={() => setProfileOpen(true)}
              title="Profile"
            >
              👤
            </button>
            <button
              className="header-icon-btn logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <div className="app-layout">
        {/* SIDEBAR - User Menu & History */}
        {sidebarOpen && (
          <aside className="app-sidebar">
            <UserSidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        )}

        {/* MAIN CHAT AREA */}
        <main className="app-main">
          <ChatInterface />
        </main>
      </div>

      {/* USER PROFILE MODAL */}
      {profileOpen && (
        <div className="modal-overlay" onClick={() => setProfileOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UserProfile onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

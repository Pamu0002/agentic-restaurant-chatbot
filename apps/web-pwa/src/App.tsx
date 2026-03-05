/**
 * MAIN APP COMPONENT
 * 
 * Handles authentication routing and main app layout
 * Routes between Welcome Screen, SignUp, SignIn, and Chat Interface
 */

import { useEffect, useState } from 'react';
import ChatInterface from './components/ChatInterface';
import UserSidebar from './components/UserSidebar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import UserProfile from './components/auth/UserProfile';
import WelcomeScreen from './components/auth/WelcomeScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

type AuthScreen = 'welcome' | 'signin' | 'signup';

function AppContent() {
  // ============================================
  // STATE & CONTEXT
  // ============================================

  const { isAuthenticated, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ============================================
  // INIT: CHECK IF USER IS LOGGED IN
  // ============================================

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && isAuthenticated) {
      setAuthScreen('welcome'); // Skip auth screens if already authenticated
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
          <h1 className="app-title">🍽️ Restaurant Chatbot</h1>
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

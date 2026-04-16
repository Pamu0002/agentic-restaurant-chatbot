import { AuthProvider, UserProfileProvider } from '@restaurant/shared'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import GoogleCallback from './components/auth/GoogleCallback'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import BookingStep1 from './components/booking/BookingStep1'
import BookingStep2 from './components/booking/BookingStep2'
import BookingStep3 from './components/booking/BookingStep3'
import FloatingChatWidget from './components/chat/FloatingChatWidget'
import UserProfile from './components/common/UserProfile'
import Header from './components/layout/Header_new'
import ProtectedRoute from './components/layout/ProtectedRoute'
import BookingsHistory from './components/profile/BookingsHistory'
import PreferencesSettings from './components/profile/PreferencesSettings'
import RestaurantDetails from './components/restaurant/RestaurantDetails'
import { ChatProvider } from './context/ChatContext'
import './index.css'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'

function AppRoutes() {
  const navigate = useNavigate()

  return (
    <Routes>
      {/* Landing Page - Public */}
      <Route 
        path="/" 
        element={<LandingPage />}
      />

      {/* Home Page - Authenticated */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Auth Pages - No header */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/google-callback" element={<GoogleCallback />} />
      
      {/* Public: Restaurant Search & Discovery */}
      <Route 
        path="/restaurants" 
        element={<SearchPage />}
      />

      {/* Public: Restaurant Details */}
      <Route 
        path="/restaurants/:id" 
        element={<RestaurantDetails />}
      />

      {/* Protected: Booking Flow */}
      <Route 
        path="/booking/step1" 
        element={
          <ProtectedRoute>
            <BookingStep1 
              onNext={(date, time) => navigate('/booking/step2', { state: { date, time } })}
              onBack={() => navigate('/restaurants')}
            />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/booking/step2" 
        element={
          <ProtectedRoute>
            <BookingStep2 
              onNext={(guestCount, notes) => navigate('/booking/step3', { state: { guestCount, notes } })}
              onBack={() => navigate('/booking/step1')}
            />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/booking/step3" 
        element={
          <ProtectedRoute>
            <BookingStep3 
              onConfirm={() => navigate('/bookings')}
              onBack={() => navigate('/booking/step2')}
            />
          </ProtectedRoute>
        }
      />
      
      {/* Protected: User Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile onBack={() => navigate('/')} />
          </ProtectedRoute>
        }
      />

      {/* Placeholder: How it Works (Public) */}
      <Route
        path="/how-it-works"
        element={
          <div style={{ padding: '40px', textAlign: 'center', marginTop: '80px' }}>
            <h1>How it Works</h1>
            <p>Coming soon...</p>
          </div>
        }
      />

      {/* Placeholder: About (Public) */}
      <Route
        path="/about"
        element={
          <div style={{ padding: '40px', textAlign: 'center', marginTop: '80px' }}>
            <h1>About AgentDine</h1>
            <p>Coming soon...</p>
          </div>
        }
      />

      {/* Connected: Bookings History (Protected) */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <div className="bookings-page" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 50%, #16213e 100%)', paddingTop: '110px' }}>
              <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '2px solid rgba(255, 140, 66, 0.1)' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: 0, background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>My Bookings</h1>
                </div>
                <BookingsHistory />
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Connected: Preferences Settings (Protected) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="settings-page" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 50%, #16213e 100%)', paddingTop: '110px' }}>
              <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '2px solid rgba(255, 140, 66, 0.1)' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: 0, background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Preferences & Settings</h1>
                </div>
                <PreferencesSettings />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <ChatProvider>
          <BrowserRouter>
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white font-sans selection:bg-orange-500/30">
              <Header />
              <AppRoutes />
              <FloatingChatWidget />
            </div>
          </BrowserRouter>
        </ChatProvider>
      </UserProfileProvider>
    </AuthProvider>
  )
}

export default App

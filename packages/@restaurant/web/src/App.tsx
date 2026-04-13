import { AuthProvider } from '@restaurant/shared'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import GoogleCallback from './components/auth/GoogleCallback'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import LandingPage from './components/LandingPage'
import RestaurantDiscovery from './components/RestaurantDiscovery'
import RestaurantDetails from './components/RestaurantDetails'
import BookingStep1 from './components/BookingStep1'
import BookingStep2 from './components/BookingStep2'
import BookingStep3 from './components/BookingStep3'
import './index.css'

function AppRoutes() {
  const navigate = useNavigate()

  return (
    <Routes>
      {/* Landing Page - Industry-standard entry point with hero, trust, featured, how-it-works, and floating chatbot */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            onSignIn={() => navigate('/signin')}
            onSignUp={() => navigate('/signup')}
            onDiscoverRestaurants={() => navigate('/restaurants')}
          />
        } 
      />
      
      {/* Sign In */}
      <Route path="/signin" element={<SignIn />} />
      
      {/* Sign Up */}
      <Route path="/signup" element={<SignUp />} />

      {/* Google OAuth Callback */}
      <Route path="/auth/google-callback" element={<GoogleCallback />} />
      
      {/* Restaurant Discovery - Search and filter restaurants */}
      <Route 
        path="/restaurants" 
        element={
          <RestaurantDiscovery 
            onRestaurantSelect={(id) => navigate(`/restaurants/${id}`)}
            onBack={() => navigate('/')}
          />
        }
      />

      {/* Restaurant Details - View specific restaurant with tabs and booking widget */}
      <Route 
        path="/restaurants/:id" 
        element={
          <RestaurantDetails 
            onBackClick={() => navigate('/restaurants')}
            onBookingStart={(id) => navigate(`/booking/step1`, { state: { restaurantId: id } })}
          />
        }
      />

      {/* Booking Flow - 3-step reservation process */}
      <Route 
        path="/booking/step1" 
        element={
          <BookingStep1 
            onNext={(date, time) => navigate('/booking/step2', { state: { date, time } })}
            onBack={() => navigate('/restaurants')}
          />
        }
      />
      <Route 
        path="/booking/step2" 
        element={
          <BookingStep2 
            onNext={(guestCount, notes) => navigate('/booking/step3', { state: { guestCount, notes } })}
            onBack={() => navigate('/booking/step1')}
          />
        }
      />
      <Route 
        path="/booking/step3" 
        element={
          <BookingStep3 
            onConfirm={() => navigate('/bookings')}
            onBack={() => navigate('/booking/step2')}
          />
        }
      />
      
      {/* Fallback - Redirect unknown routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white font-sans selection:bg-teal-500/30">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { AuthProvider } from '@restaurant/shared'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import GoogleCallback from './components/auth/GoogleCallback'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import WelcomeScreen from './components/auth/WelcomeScreen'
import ChatInterface from './components/ChatInterface'
import './index.css'

function AppRoutes() {
  const navigate = useNavigate()

  const handleGuestContinue = (guestId: string) => {
    console.log('🟢 Guest session created, navigating to chat:', guestId);
    navigate('/chat');
  };

  return (
    <Routes>
      {/* Welcome/Landing - Loads first */}
      <Route 
        path="/" 
        element={
          <WelcomeScreen 
            onSignIn={() => navigate('/signin')}
            onSignUp={() => navigate('/signup')}
            onGuestContinue={handleGuestContinue}
          />
        } 
      />
      
      {/* Sign In */}
      <Route path="/signin" element={<SignIn />} />
      
      {/* Sign Up */}
      <Route path="/signup" element={<SignUp />} />

      {/* Google OAuth Callback */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      
      {/* Chat Interface - Works for both authenticated and guest users */}
      <Route path="/chat" element={<ChatInterface />} />
      
      {/* Fallback */}
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

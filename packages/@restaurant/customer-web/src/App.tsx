import { useAuth } from '@restaurant/shared';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages - Will be implemented
// import HomePage from './pages/HomePage';
// import ReservationPage from './pages/ReservationPage';
// import SearchPage from './pages/SearchPage';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <div>
                <h1>🍽️ Restaurant Reservation App</h1>
                <p>Welcome to the Customer Portal</p>
                {user && <p>Hello, {user.displayName}!</p>}
                {!isAuthenticated && <p>Please sign in to continue</p>}
                <h2>Features (Coming Soon):</h2>
                <ul>
                  <li>Search Restaurants</li>
                  <li>Make Reservations</li>
                  <li>Chat with AI Assistant</li>
                  <li>View Your Bookings</li>
                </ul>
              </div>
            } 
          />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route 
                path="/search" 
                element={
                  <div>
                    <h1>🔍 Search Restaurants</h1>
                    <p>Search Restaurants (TODO)</p>
                  </div>
                } 
              />
              <Route 
                path="/reservations" 
                element={
                  <div>
                    <h1>📅 My Reservations</h1>
                    <p>My Reservations (TODO)</p>
                  </div>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <div>
                    <h1>💬 AI Dining Assistant</h1>
                    <p>Chat with AI (TODO)</p>
                  </div>
                } 
              />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

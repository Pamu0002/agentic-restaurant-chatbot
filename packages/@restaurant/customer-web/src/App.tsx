import { useAuth } from '@restaurant/shared';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages - Will be implemented
// import HomePage from './pages/HomePage';
// import ReservationPage from './pages/ReservationPage';
// import SearchPage from './pages/SearchPage';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<div>Customer Home (TODO)</div>} />

        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route path="/search" element={<div>Search Restaurants (TODO)</div>} />
            <Route path="/reservations" element={<div>My Reservations (TODO)</div>} />
            <Route path="/chat" element={<div>Chat with AI (TODO)</div>} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

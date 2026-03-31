import { useAuth } from '@restaurant/shared';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages - Will be implemented
// import DashboardPage from './pages/DashboardPage';
// import ReservationManagement from './pages/ReservationManagement';
// import MenuManagement from './pages/MenuManagement';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  // Verify user is a provider
  const isProvider = user?.role === 'owner';

  if (!isProvider) {
    return <Navigate to="/" replace />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Provider Dashboard (TODO)</div>} />
        <Route path="/reservations" element={<div>Reservation Management (TODO)</div>} />
        <Route path="/menu" element={<div>Menu Management (TODO)</div>} />
        <Route path="/table-settings" element={<div>Table Settings (TODO)</div>} />
        <Route path="/settings" element={<div>Restaurant Settings (TODO)</div>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

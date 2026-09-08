import { Header, useAuth } from '@restaurant/shared';
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

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header portalType="provider" onLogoClick={handleLogoClick} />
        
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<div style={{ padding: '20px' }}><h1>🏪 Restaurant Dashboard</h1><p>Your restaurant management hub (TODO)</p></div>} />
            <Route path="/reservations" element={<div style={{ padding: '20px' }}><h1>📅 Reservation Management</h1><p>Manage reservations (TODO)</p></div>} />
            <Route path="/menu" element={<div style={{ padding: '20px' }}><h1>🍽️ Menu Management</h1><p>Manage menu items (TODO)</p></div>} />
            <Route path="/table-settings" element={<div style={{ padding: '20px' }}><h1>🪑 Table Settings</h1><p>Configure tables (TODO)</p></div>} />
            <Route path="/settings" element={<div style={{ padding: '20px' }}><h1>⚙️ Restaurant Settings</h1><p>Settings (TODO)</p></div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

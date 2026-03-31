import { useAuth } from '@restaurant/shared';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages - Will be implemented
// import AdminDashboard from './pages/AdminDashboard';
// import UserManagement from './pages/UserManagement';
// import RestaurantManagement from './pages/RestaurantManagement';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  // Verify user is an admin
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Admin Dashboard (TODO)</div>} />
        <Route path="/users" element={<div>User Management (TODO)</div>} />
        <Route path="/restaurants" element={<div>Restaurant Management (TODO)</div>} />
        <Route path="/approvals" element={<div>Pending Approvals (TODO)</div>} />
        <Route path="/system-settings" element={<div>System Settings (TODO)</div>} />
        <Route path="/audit-logs" element={<div>Audit Logs (TODO)</div>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

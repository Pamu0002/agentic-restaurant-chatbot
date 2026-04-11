import { Header, useAuth } from '@restaurant/shared';
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

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header portalType="admin" onLogoClick={handleLogoClick} />
        
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<div style={{ padding: '20px' }}><h1>🛡️ Admin Dashboard</h1><p>System overview and management (TODO)</p></div>} />
            <Route path="/users" element={<div style={{ padding: '20px' }}><h1>👥 User Management</h1><p>Manage users and accounts (TODO)</p></div>} />
            <Route path="/restaurants" element={<div style={{ padding: '20px' }}><h1>🏢 Restaurant Management</h1><p>Manage restaurants (TODO)</p></div>} />
            <Route path="/approvals" element={<div style={{ padding: '20px' }}><h1>✅ Pending Approvals</h1><p>Review pending requests (TODO)</p></div>} />
            <Route path="/system-settings" element={<div style={{ padding: '20px' }}><h1>⚙️ System Settings</h1><p>Configure system (TODO)</p></div>} />
            <Route path="/audit-logs" element={<div style={{ padding: '20px' }}><h1>📋 Audit Logs</h1><p>System activity logs (TODO)</p></div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

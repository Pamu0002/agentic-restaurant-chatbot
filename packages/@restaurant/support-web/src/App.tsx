import { useAuth } from '@restaurant/shared';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages - Will be implemented in Phase 2
// import SupportDashboard from './pages/SupportDashboard';
// import TicketManagement from './pages/TicketManagement';
// import Moderation from './pages/Moderation';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  // Verify user is support staff
  const isSupport = user?.role === 'admin'; // or separate 'support' role

  if (!isSupport) {
    return <Navigate to="/" replace />;
  }

  return (
    <Router>
      <Routes>
        {/* Phase 2 Features */}
        <Route path="/" element={<div>Support Dashboard (Phase 2 - Coming Soon)</div>} />
        <Route path="/tickets" element={<div>Ticket Management (Phase 2 - Coming Soon)</div>} />
        <Route path="/moderation" element={<div>Content Moderation (Phase 2 - Coming Soon)</div>} />
        <Route path="/messages" element={<div>Customer Communication (Phase 2 - Coming Soon)</div>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

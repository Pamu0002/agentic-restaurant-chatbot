import { useAuth } from '@restaurant/shared';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Pages - Will be implemented
// import Dashboard from './pages/Dashboard';
// import RevenueAnalytics from './pages/RevenueAnalytics';
// import CustomerInsights from './pages/CustomerInsights';

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
        <Route path="/" element={<div>Analytics Dashboard (TODO)</div>} />
        <Route path="/revenue" element={<div>Revenue Analytics (TODO)</div>} />
        <Route path="/customers" element={<div>Customer Insights (TODO)</div>} />
        <Route path="/performance" element={<div>Performance Metrics (TODO)</div>} />
        <Route path="/reports" element={<div>Reports & Export (TODO)</div>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

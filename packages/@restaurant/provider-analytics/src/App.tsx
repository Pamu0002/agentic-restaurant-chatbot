import { Header, useAuth } from '@restaurant/shared';
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

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header portalType="analytics" title="Analytics & Insights" onLogoClick={handleLogoClick} />
        
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<div style={{ padding: '20px' }}><h1>📊 Analytics Dashboard</h1><p>Your restaurant performance overview (TODO)</p></div>} />
            <Route path="/revenue" element={<div style={{ padding: '20px' }}><h1>💰 Revenue Analytics</h1><p>Revenue trends and insights (TODO)</p></div>} />
            <Route path="/customers" element={<div style={{ padding: '20px' }}><h1>👤 Customer Insights</h1><p>Understand your customers (TODO)</p></div>} />
            <Route path="/performance" element={<div style={{ padding: '20px' }}><h1>⚡ Performance Metrics</h1><p>Key performance indicators (TODO)</p></div>} />
            <Route path="/reports" element={<div style={{ padding: '20px' }}><h1>📄 Reports & Export</h1><p>Generate and export reports (TODO)</p></div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

/**
 * PROTECTED ROUTE COMPONENT
 * Wrapper to guard routes that require authentication
 * Redirects unauthenticated users to /signin with return URL
 */

import { useAuth } from '@restaurant/shared';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="protected-route-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin with return URL
    return <Navigate to={`/signin?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

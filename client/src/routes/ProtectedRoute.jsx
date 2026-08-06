/**
 * ProtectedRoute.jsx
 *
 * Renders children only if the user is authenticated.
 * - While auth is loading → show a centered spinner
 * - If no user       → redirect to /login (preserves intended destination)
 * - If authenticated → render <Outlet />
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Preserve the intended path so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

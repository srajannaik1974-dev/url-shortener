/**
 * PublicRoute.jsx
 *
 * Renders children only if the user is NOT authenticated.
 * - While auth is loading → show a centered spinner
 * - If authenticated     → redirect to /dashboard
 * - If not authenticated → render <Outlet />
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

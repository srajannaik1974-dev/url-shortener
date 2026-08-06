/**
 * AppRoutes.jsx — Central route tree
 *
 * Route structure:
 *
 *  /                         → GlobalLayout  → LandingPage      (public)
 *  /login                    → GlobalLayout  → PublicRoute → LoginPage
 *  /register                 → GlobalLayout  → PublicRoute → RegisterPage
 *
 *  /dashboard                → DashboardLayout → ProtectedRoute
 *    (index)                   → DashboardPage
 *    /urls                     → UrlsPage
 *    /analytics                → AnalyticsPage
 *    /profile                  → ProfilePage
 *    /settings                 → SettingsPage
 *
 *  *                         → NotFoundPage
 */

import { Routes, Route } from 'react-router-dom';

// Layouts
import GlobalLayout    from '../layouts/GlobalLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute    from './PublicRoute';

// Pages — public / auth
import LandingPage  from '../pages/landing/LandingPage';
import LoginPage    from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Pages — dashboard (protected)
import DashboardPage  from '../pages/dashboard/DashboardPage';
import UrlsPage       from '../pages/dashboard/UrlsPage';
import AnalyticsPage  from '../pages/analytics/AnalyticsPage';
import ProfilePage    from '../pages/profile/ProfilePage';
import SettingsPage   from '../pages/settings/SettingsPage';

// Fallback
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes (global layout: navbar + footer) ──────────────── */}
      <Route element={<GlobalLayout />}>
        <Route index element={<LandingPage />} />

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="login"    element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* ── Protected dashboard routes ───────────────────────────────────── */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index            element={<DashboardPage />} />
          <Route path="urls"      element={<UrlsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile"   element={<ProfilePage />} />
          <Route path="settings"  element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ── 404 fallback ─────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

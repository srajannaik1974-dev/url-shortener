/**
 * App.jsx — Root application component
 *
 * Provider order (outer → inner):
 *  ThemeProvider  — dark/light mode state
 *  BrowserRouter  — React Router context (lives in main.jsx)
 *  AuthProvider   — authentication state
 *  Toaster        — React Hot Toast notifications
 *  AppRoutes      — route tree
 */

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* ── Global toast notifications ─────────────────────────────── */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-page)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-lg)',
              fontSize: '13px',
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: 'var(--color-success)', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' },
            },
          }}
        />

        {/* ── Route tree ────────────────────────────────────────────── */}
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

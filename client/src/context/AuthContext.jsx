/**
 * AuthContext.jsx — Global authentication state
 *
 * Provides:
 *  - user        : authenticated user object | null
 *  - loading     : boolean — true while initial auth check runs
 *  - login()     : persists token + user, sets state
 *  - logout()    : clears storage, resets state
 *  - refreshUser(): re-fetches /me from the API
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMe } from '../services/auth.service';
import { TOKEN_KEY } from '../services/api';

const USER_KEY = 'auth_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until initial check completes

  // ── Hydrate user from JWT on app mount ─────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => setUser(res.data?.data ?? res.data))
      .catch(() => {
        // Token invalid or expired — clean up silently
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Call after a successful login/register response.
   * @param {{ token: string, user: object }} payload
   */
  const login = useCallback(({ token, user: userData }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  /**
   * Clear all auth state and local storage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  /**
   * Re-fetch the current user from the API (e.g., after profile update).
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      const updated = res.data?.data ?? res.data;
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      logout();
    }
  }, [logout]);

  const value = { user, loading, login, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook — access auth context.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export default AuthContext;

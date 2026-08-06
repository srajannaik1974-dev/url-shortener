/**
 * api.js — Axios instance (central HTTP client)
 *
 * Responsibilities:
 *  1. Read base URL from Vite env (VITE_API_BASE_URL)
 *  2. Attach JWT token from localStorage on every request
 *  3. Handle 401 responses → clear auth state → redirect to /login
 */

import axios from 'axios';

const TOKEN_KEY = 'auth_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the Bearer token to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401: clear localStorage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('auth_user');

      // Redirect to login (avoid infinite loop on the login page itself)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default api;

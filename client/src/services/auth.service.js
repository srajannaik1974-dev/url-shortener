/**
 * auth.service.js — Authentication API calls
 *
 * Endpoints consumed:
 *  POST /api/auth/register
 *  POST /api/auth/login
 *  GET  /api/auth/me
 *  PATCH /api/auth/me
 *  PATCH /api/auth/change-password
 */

import api from './api';

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = (data) => api.post('/auth/register', data);

/**
 * Login with email and password.
 * @param {{ email: string, password: string }} data
 * @returns Promise with { token, user }
 */
export const login = (data) => api.post('/auth/login', data);

/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid JWT (injected automatically by Axios interceptor).
 */
export const getMe = () => api.get('/auth/me');

/**
 * Update the current user's profile (name and/or email).
 * @param {{ name?: string, email?: string }} data
 */
export const updateMe = (data) => api.patch('/auth/me', data);

/**
 * Change the current user's password.
 * @param {{ currentPassword: string, newPassword: string }} data
 */
export const changePassword = (data) => api.patch('/auth/change-password', data);

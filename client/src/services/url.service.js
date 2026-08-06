/**
 * url.service.js — URL management API calls
 *
 * Endpoints consumed:
 *  POST   /api/urls
 *  GET    /api/urls
 *  GET    /api/urls/:id/analytics
 *  PATCH  /api/urls/:id/status
 *  PATCH  /api/urls/:id/expiration
 *  DELETE /api/urls/:id
 */

import api from './api';

/**
 * Create a new shortened URL.
 * @param {{ originalUrl: string, customAlias?: string, expiresAt?: string }} data
 */
export const createUrl = (data) => api.post('/urls', data);

/**
 * Fetch the paginated list of URLs for the current user.
 * @param {{ page?: number, limit?: number, status?: 'active'|'inactive' }} params
 */
export const listUrls = (params = {}) => api.get('/urls', { params });

/**
 * Get analytics data for a specific URL.
 * @param {string} id — URL record ID
 */
export const getAnalytics = (id) => api.get(`/urls/${id}/analytics`);

/**
 * Activate or deactivate a URL.
 * @param {string} id — URL record ID
 * @param {{ status: 'active'|'inactive' }} data
 */
export const updateStatus = (id, data) => api.patch(`/urls/${id}/status`, data);

/**
 * Update or remove the expiration date for a URL.
 * @param {string} id — URL record ID
 * @param {{ expiresAt: string|null }} data
 */
export const updateExpiration = (id, data) => api.patch(`/urls/${id}/expiration`, data);

/**
 * Permanently delete a URL.
 * @param {string} id — URL record ID
 */
export const deleteUrl = (id) => api.delete(`/urls/${id}`);

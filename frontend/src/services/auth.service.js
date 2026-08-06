import api from './api';

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = (data) => api.post('/auth/register', data);

/**
 * Login user
 * @param {{ email: string, password: string }} data
 */
export const login = (data) => api.post('/auth/login', data);

/**
 * Fetch current user profile
 */
export const getMe = () => api.get('/auth/me');

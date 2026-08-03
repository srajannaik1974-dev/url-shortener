'use strict';

const express = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/auth/register — 5 registrations per IP per hour
router.post('/register', registerLimiter, validate(registerSchema), register);

// POST /api/auth/login — 5 attempts per IP per 15 minutes (brute-force protection)
router.post('/login', loginLimiter, validate(loginSchema), login);

// GET /api/auth/me  — requires a valid JWT
router.get('/me', protect, me);

module.exports = router;

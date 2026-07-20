'use strict';

const express = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login  — strict rate-limiting for brute-force protection
router.post('/login', authLimiter, validate(loginSchema), login);

// GET /api/auth/me  — requires a valid JWT
router.get('/me', protect, me);

module.exports = router;

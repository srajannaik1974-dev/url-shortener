'use strict';

const express = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

// ── Feature 5: User Profile Management ───────────────────────────────────────
const { updateMe, changePasswordHandler } = require('../controllers/profile.controller');
const { updateProfileSchema, changePasswordSchema } = require('../validations/profile.validation');

const router = express.Router();

// ── Existing auth routes (unchanged) ─────────────────────────────────────────

// POST /api/auth/register — 5 registrations per IP per hour
router.post('/register', registerLimiter, validate(registerSchema), register);

// POST /api/auth/login — 5 attempts per IP per 15 minutes (brute-force protection)
router.post('/login', loginLimiter, validate(loginSchema), login);

// GET /api/auth/me — requires a valid JWT
// NOTE: this route was previously defined here and now also lives in the
// profile controller; the existing `me` handler is kept as-is to avoid
// breaking the original import.  The profile controller's `getMe` is an
// alias that re-fetches from the DB for freshness — both do the same thing.
router.get('/me', protect, me);

// ── Feature 5: Profile Management routes ─────────────────────────────────────

// PATCH /api/auth/me — update name and/or email
router.patch('/me', protect, validate(updateProfileSchema), updateMe);

// PATCH /api/auth/change-password — change password (requires current password)
router.patch('/change-password', protect, validate(changePasswordSchema), changePasswordHandler);

module.exports = router;

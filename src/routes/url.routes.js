'use strict';

const express = require('express');
const {
    create,
    list,
    deleteUrl,
    getAnalytics,
    updateStatus,
    updateExpiration,
} = require('../controllers/url.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
    createUrlSchema,
    updateStatusSchema,
    updateExpirationSchema,
} = require('../validations/url.validation');
const { urlCreateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply protect middleware to all /api/urls routes
router.use(protect);

// POST /api/urls - Create a shortened URL (100 per user per hour)
router.post('/', urlCreateLimiter, validate(createUrlSchema), create);

// GET /api/urls - List paginated URLs for user
router.get('/', list);

// GET /api/urls/:id/analytics - Get analytics for a URL
router.get('/:id/analytics', getAnalytics);

// PATCH /api/urls/:id/status - Activate or deactivate a URL
// (registered before /:id to avoid routing conflicts)
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);

// PATCH /api/urls/:id/expiration - Update or remove expiration date
router.patch('/:id/expiration', validate(updateExpirationSchema), updateExpiration);

// DELETE /api/urls/:id - Delete a shortened URL
router.delete('/:id', deleteUrl);

module.exports = router;

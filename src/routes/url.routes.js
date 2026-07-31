'use strict';

const express = require('express');
const { create, list, deleteUrl, getAnalytics } = require('../controllers/url.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createUrlSchema } = require('../validations/url.validation');

const router = express.Router();

// Apply protect middleware to all /api/urls routes
router.use(protect);

// POST /api/urls - Create a shortened URL
router.post('/', validate(createUrlSchema), create);

// GET /api/urls - List paginated URLs for user
router.get('/', list);

// GET /api/urls/:id/analytics - Get analytics for a URL
router.get('/:id/analytics', getAnalytics);

// DELETE /api/urls/:id - Delete a shortened URL
router.delete('/:id', deleteUrl);

module.exports = router;

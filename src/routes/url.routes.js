'use strict';

const express = require('express');
const { create, list, deleteUrl } = require('../controllers/url.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createUrlSchema } = require('../validations/url.validation');

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

// POST /api/urls - Create a shortened URL
router.post('/', validate(createUrlSchema), create);

// GET /api/urls - List paginated URLs for user
router.get('/', list);

// DELETE /api/urls/:id - Delete a shortened URL
router.delete('/:id', deleteUrl);

module.exports = router;

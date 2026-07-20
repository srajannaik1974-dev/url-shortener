'use strict';

const express = require('express');
const prisma = require('../config/database');
const { catchAsync, sendSuccess } = require('../utils/response');

const router = express.Router();

/**
 * GET /api/health
 * Returns server and database health status.
 */
router.get(
    '/health',
    catchAsync(async (req, res) => {
        // Check database connectivity
        await prisma.$queryRaw`SELECT 1`;

        sendSuccess(res, {
            status: 'healthy',
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
        });
    })
);

module.exports = router;

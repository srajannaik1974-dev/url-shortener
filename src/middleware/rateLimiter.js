'use strict';

const rateLimit = require('express-rate-limit');
const { AppError } = require('../utils/errors');

const createRateLimiter = (windowMs, max, message) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next) => {
            next(new AppError(message || 'Too many requests, please try again later.', 429));
        },
    });

// General API limiter
const apiLimiter = createRateLimiter(
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    Number(process.env.RATE_LIMIT_MAX) || 100,
    'Too many requests from this IP, please try again after 15 minutes.'
);

// Strict limiter for auth routes
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 min
    10,
    'Too many authentication attempts. Please try again after 15 minutes.'
);

module.exports = { apiLimiter, authLimiter };

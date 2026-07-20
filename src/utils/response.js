'use strict';

/**
 * Wraps an async route handler to catch rejected promises and forward to next().
 * Eliminates the need for try/catch in every controller.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Send a standardized success JSON response.
 */
const sendSuccess = (res, data, statusCode = 200, meta = {}) => {
    const response = { status: 'success', data };
    if (Object.keys(meta).length > 0) response.meta = meta;
    res.status(statusCode).json(response);
};

/**
 * Send a standardized paginated response.
 */
const sendPaginated = (res, data, page, limit, total) => {
    res.status(200).json({
        status: 'success',
        data,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    });
};

module.exports = { catchAsync, sendSuccess, sendPaginated };

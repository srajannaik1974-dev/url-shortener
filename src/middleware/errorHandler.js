'use strict';

const logger = require('../config/logger');
const { AppError } = require('../utils/errors');

/**
 * Handle Prisma specific database errors
 */
const handlePrismaError = (err) => {
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'field';
        return new AppError(`${field} already exists`, 409);
    }
    // P2025: Record not found
    if (err.code === 'P2025') {
        return new AppError('Record not found', 404);
    }
    // P2003: Foreign key constraint failed
    if (err.code === 'P2003') {
        return new AppError('Related record not found', 400);
    }
    return new AppError('Database error', 500);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

/**
 * Send detailed error response in development
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

/**
 * Send sanitized error response in production
 */
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        logger.error('Unexpected error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please try again later.',
        });
    }
};

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);

    let error = { ...err, message: err.message, stack: err.stack };

    // Handle specific error types
    if (err.name === 'PrismaClientKnownRequestError') error = handlePrismaError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.name === 'ValidationError') error.statusCode = 400;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else {
        sendErrorProd(error, res);
    }
};

/**
 * 404 handler - for routes not found
 */
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
};

module.exports = { errorHandler, notFoundHandler };
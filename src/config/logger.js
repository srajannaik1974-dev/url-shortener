'use strict';

const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, errors, json, colorize, printf } = format;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
    ),
    transports: [
        new transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 5,
        }),
        new transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'HH:mm:ss' }),
                errors({ stack: true }),
                consoleFormat
            ),
        })
    );
}

module.exports = logger;

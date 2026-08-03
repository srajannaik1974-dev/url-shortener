'use strict';

const Redis = require('ioredis');
const logger = require('./logger');

/**
 * Redis client singleton.
 *
 * Design decisions:
 * - lazyConnect: true  → ioredis does NOT auto-connect on import; we call
 *   client.connect() explicitly in server.js so startup order is predictable.
 * - enableOfflineQueue: false → commands issued while Redis is down are
 *   immediately rejected instead of queuing forever, letting callers fall back
 *   to PostgreSQL without blocking.
 * - maxRetriesPerRequest: null is default for pub/sub; for regular commands we
 *   keep retries low so a dead Redis doesn't stall requests.
 * - The client is exported as a singleton; every module that requires this
 *   file gets the same instance.
 */

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;
const REDIS_TTL  = parseInt(process.env.REDIS_TTL,  10) || 3600; // seconds

const redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    lazyConnect: true,           // connect explicitly; prevents crash on import
    enableOfflineQueue: false,   // reject immediately when not connected
    maxRetriesPerRequest: 1,     // one retry per command, then throw
    retryStrategy(times) {
        // Exponential back-off capped at 30 s; stops after 10 failed attempts
        if (times > 10) {
            logger.error('Redis: exceeded maximum reconnect attempts. Giving up.');
            return null; // stop retrying
        }
        const delay = Math.min(times * 200, 30_000);
        logger.warn(`Redis: reconnecting in ${delay}ms (attempt #${times})`);
        return delay;
    },
});

// ─── Connection lifecycle events ─────────────────────────────────────────────
redisClient.on('connect', () => {
    logger.info('Redis: connection established');
});

redisClient.on('ready', () => {
    logger.info('Redis: client ready');
});

redisClient.on('error', (err) => {
    // Logged here so callers don't need to repeat error logging.
    // The cache service catches thrown errors and falls back to PostgreSQL.
    logger.error(`Redis: client error → ${err.message}`);
});

redisClient.on('close', () => {
    logger.warn('Redis: connection closed');
});

redisClient.on('reconnecting', (ms) => {
    logger.warn(`Redis: reconnecting in ${ms}ms`);
});

redisClient.on('end', () => {
    logger.warn('Redis: connection ended (no more retries)');
});

module.exports = { redisClient, REDIS_TTL };

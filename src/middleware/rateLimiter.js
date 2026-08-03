'use strict';

/**
 * rateLimiter.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Advanced rate limiting middleware backed by Redis (ioredis).
 *
 * ── Design ───────────────────────────────────────────────────────────────────
 * • Custom RedisRateLimitStore wired to the existing redisClient singleton from
 *   src/config/redis.js — zero new npm packages required.
 * • Graceful degradation: if Redis is unavailable, every limiter fails open
 *   (request passes through) and a warning is logged. The server never crashes.
 * • Standard IETF headers on every response:
 *     RateLimit-Limit       — configured maximum
 *     RateLimit-Remaining   — requests left in window
 *     RateLimit-Reset       — when the window resets (epoch seconds)
 *     Retry-After           — seconds to wait after being blocked (429 only)
 * • Every blocked request is logged with IP, route, reason, and timestamp.
 *
 * ── Exported limiters ────────────────────────────────────────────────────────
 *   loginLimiter     POST /api/auth/login       5   / IP   / 15 min
 *   registerLimiter  POST /api/auth/register    5   / IP   / 1 hour
 *   urlCreateLimiter POST /api/urls             100 / user / 1 hour
 *   redirectLimiter  GET  /:shortCode           1000/ IP   / 1 min
 *   apiLimiter       All  /api/*                general guard
 */

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { redisClient } = require('../config/redis');
const logger = require('../config/logger');
const { AppError } = require('../utils/errors');

// ─── Redis-backed store ───────────────────────────────────────────────────────

/**
 * Custom express-rate-limit store (v7/v8 interface) backed by ioredis.
 *
 * Counter keys are stored in Redis with an automatic TTL equal to the window
 * duration, so expired counters are cleaned up by Redis without any cron job.
 *
 * Graceful degradation
 * ────────────────────
 * Any Redis error (connection refused, timeout, etc.) is caught, logged as a
 * warning, and treated as a "0 hits" response.  This means:
 *   • The limiter never blocks requests when Redis is down.
 *   • The server continues serving traffic normally.
 *   • Operators are alerted via the warning log.
 */
class RedisRateLimitStore {
    /**
     * @param {Object} opts
     * @param {string} opts.prefix    Unique key prefix, e.g. 'rl:login:'
     * @param {number} opts.windowMs  Window duration in milliseconds
     */
    constructor({ prefix, windowMs }) {
        this.prefix = prefix || 'rl:';
        this.windowMs = windowMs;
    }

    /**
     * Called by express-rate-limit after construction with the merged options.
     * Allows the store to receive the final windowMs value.
     */
    init(options) {
        this.windowMs = options.windowMs;
    }

    _buildKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Increment the counter for the given key and return the new count
     * together with the time at which the window resets.
     *
     * Uses two sequential commands (INCR + EXPIRE) instead of a Lua script
     * to stay compatible with all Redis versions. The EXPIRE is only issued
     * on the very first increment (totalHits === 1) to avoid pushing the
     * window forward on subsequent requests.
     *
     * @param {string} key  Rate-limit key (IP, user ID, etc.)
     * @returns {Promise<{ totalHits: number, resetTime: Date }>}
     */
    async increment(key) {
        const rKey = this._buildKey(key);
        const ttlSeconds = Math.ceil(this.windowMs / 1000);

        try {
            const totalHits = await redisClient.incr(rKey);

            if (totalHits === 1) {
                // First request in this window — attach the expiry so Redis
                // automatically removes the key when the window closes.
                await redisClient.expire(rKey, ttlSeconds);
            }

            // Use the actual remaining TTL for the reset time so it accurately
            // reflects when the *current* window opened, not when we checked.
            const remainingTtl = await redisClient.ttl(rKey);
            const resetTime = new Date(
                Date.now() + (remainingTtl > 0 ? remainingTtl : ttlSeconds) * 1000
            );

            return { totalHits, resetTime };
        } catch (err) {
            // Redis unavailable — fail open so the app never blocks requests
            // due to an infrastructure outage.
            logger.warn(
                `[RateLimiter] Redis unavailable — failing open for key="${rKey}": ${err.message}`
            );
            return { totalHits: 0, resetTime: new Date(Date.now() + this.windowMs) };
        }
    }

    async decrement(key) {
        try {
            await redisClient.decr(this._buildKey(key));
        } catch (err) {
            logger.warn(
                `[RateLimiter] Redis decrement error for key="${this._buildKey(key)}": ${err.message}`
            );
        }
    }

    async resetKey(key) {
        try {
            await redisClient.del(this._buildKey(key));
        } catch (err) {
            logger.warn(
                `[RateLimiter] Redis resetKey error for key="${this._buildKey(key)}": ${err.message}`
            );
        }
    }
}

// ─── Limiter factory ──────────────────────────────────────────────────────────

/**
 * Create a named rate limiter backed by Redis.
 *
 * @param {Object}    opts
 * @param {string}    opts.prefix          Unique Redis key prefix (e.g. 'rl:login:')
 * @param {number}    opts.windowMs        Window duration in milliseconds
 * @param {number}    opts.max             Maximum requests per window
 * @param {string}    opts.message         Human-readable 429 response message
 * @param {Function}  [opts.keyGenerator]  Returns the rate-limit key for a request.
 *                                         Default: req.ip
 * @returns {import('express').RequestHandler}
 */
function createLimiter({ prefix, windowMs, max, message, keyGenerator }) {
    const store = new RedisRateLimitStore({ prefix, windowMs });

    return rateLimit({
        windowMs,
        max,
        store,
        // ── Headers ──────────────────────────────────────────────────────────
        // standardHeaders: true emits the IETF draft-6 headers:
        //   RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
        standardHeaders: true,
        legacyHeaders: false,   // disable deprecated X-RateLimit-* headers

        // ipKeyGenerator(ip, subnet?) takes a STRING IP address, not a req object.
        // It normalises IPv4-mapped IPv6 addresses (::ffff:x.x.x.x → x.x.x.x) and
        // collapses IPv6 addresses into their /56 subnet to group mobile users.
        keyGenerator: keyGenerator || ((req) => ipKeyGenerator(req.ip)),

        // ── Blocked-request handler ───────────────────────────────────────────
        handler: (req, res, next) => {
            // Log every blocked request with all relevant context.
            logger.warn(
                '[RateLimiter] Request blocked — ' +
                `ip=${req.ip} ` +
                `route="${req.method} ${req.originalUrl}" ` +
                `reason="${message}" ` +
                `timestamp=${new Date().toISOString()}`
            );

            // Retry-After: how many seconds the client should wait.
            res.setHeader('Retry-After', Math.ceil(windowMs / 1000));

            // Forward to the global error handler for consistent JSON formatting.
            next(new AppError(message, 429));
        },
    });
}

// ─── Named limiters ───────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * 5 attempts per IP per 15 minutes — brute-force protection.
 * Override with LOGIN_RATE_LIMIT and LOGIN_WINDOW_MS env vars.
 */
const loginLimiter = createLimiter({
    prefix: 'rl:login:',
    windowMs: Number(process.env.LOGIN_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.LOGIN_RATE_LIMIT) || 5,
    message:
        'Too many login attempts from this IP. ' +
        'Please try again after 15 minutes.',
});

/**
 * POST /api/auth/register
 * 5 registrations per IP per hour — account creation abuse protection.
 * Override with REGISTER_RATE_LIMIT and REGISTER_WINDOW_MS env vars.
 */
const registerLimiter = createLimiter({
    prefix: 'rl:register:',
    windowMs: Number(process.env.REGISTER_WINDOW_MS) || 60 * 60 * 1000,
    max: Number(process.env.REGISTER_RATE_LIMIT) || 5,
    message:
        'Too many accounts created from this IP. ' +
        'Please try again after 1 hour.',
});

/**
 * POST /api/urls
 * 100 URL creations per authenticated user per hour.
 * Keys by user ID (set by the `protect` middleware) rather than IP, so
 * shared IPs (NAT, corporate VPN) do not throttle other users unfairly.
 * Override with URL_RATE_LIMIT and URL_WINDOW_MS env vars.
 */
const urlCreateLimiter = createLimiter({
    prefix: 'rl:url-create:',
    windowMs: Number(process.env.URL_WINDOW_MS) || 60 * 60 * 1000,
    max: Number(process.env.URL_RATE_LIMIT) || 100,
    message:
        'URL creation limit reached. ' +
        'You may create up to 100 shortened URLs per hour.',
    // req.user is populated by the `protect` middleware that runs via
    // router.use(protect) before any route-specific handlers in url.routes.js.
    keyGenerator: (req) =>
        req.user?.id
            ? `user:${req.user.id}`
            : `ip:${ipKeyGenerator(req.ip)}`,
});

/**
 * GET /:shortCode
 * 1000 requests per IP per minute — redirect scraping / bot protection.
 * Override with REDIRECT_RATE_LIMIT and REDIRECT_WINDOW_MS env vars.
 */
const redirectLimiter = createLimiter({
    prefix: 'rl:redirect:',
    windowMs: Number(process.env.REDIRECT_WINDOW_MS) || 60 * 1000,
    max: Number(process.env.REDIRECT_RATE_LIMIT) || 1000,
    message:
        'Too many redirect requests from this IP. ' +
        'Please slow down and try again shortly.',
});

/**
 * All /api/* routes — broad general guard.
 * Applied in app.js as a baseline before route-specific limiters take effect.
 * Override with RATE_LIMIT_MAX and RATE_LIMIT_WINDOW_MS env vars.
 */
const apiLimiter = createLimiter({
    prefix: 'rl:api:',
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message:
        'Too many requests from this IP. Please try again after 15 minutes.',
});

/**
 * @deprecated Replaced by loginLimiter and registerLimiter.
 * Retained for backward compatibility with any code that imports authLimiter.
 */
const authLimiter = createLimiter({
    prefix: 'rl:auth:',
    windowMs: 15 * 60 * 1000,
    max: 10,
    message:
        'Too many authentication attempts. Please try again after 15 minutes.',
});

module.exports = {
    createLimiter,
    loginLimiter,
    registerLimiter,
    urlCreateLimiter,
    redirectLimiter,
    apiLimiter,
    authLimiter,
};

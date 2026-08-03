'use strict';

/**
 * cache.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Dedicated Redis cache layer that implements the Cache-Aside (Lazy Loading)
 * pattern for short-URL lookups.
 *
 * Responsibilities:
 *  • getUrlCache(shortCode)       – Read from Redis
 *  • setUrlCache(shortCode, data) – Write to Redis with TTL
 *  • deleteUrlCache(shortCode)    – Invalidate a cache entry
 *
 * All public functions catch Redis errors internally, log them, and return
 * safe fallback values.  This guarantees the application continues to serve
 * requests via PostgreSQL even when Redis is completely unavailable.
 *
 * Cache key format:  shortCode   (e.g. "abc123")
 * Cache value:       JSON string of { originalUrl, urlId, isActive, expiresAt }
 */

const { redisClient, REDIS_TTL } = require('../config/redis');
const logger = require('../config/logger');

// ─── Key helper ──────────────────────────────────────────────────────────────
// Centralising the key format here means changing the scheme is a one-liner.
const buildKey = (shortCode) => shortCode;

/**
 * Attempt to read a URL payload from Redis.
 *
 * @param {string} shortCode  Short code or custom alias used as the cache key
 * @returns {Promise<Object|null>}
 *   - Parsed cache object on a cache hit
 *   - null on a cache miss OR any Redis error (so callers always fall back to DB)
 */
async function getUrlCache(shortCode) {
    try {
        const raw = await redisClient.get(buildKey(shortCode));
        if (!raw) {
            return null; // cache miss
        }
        return JSON.parse(raw); // cache hit
    } catch (err) {
        // Redis unavailable or command failed – log and signal "miss" to caller
        logger.error(`[CacheService] getUrlCache error for "${shortCode}": ${err.message}`);
        return null;
    }
}

/**
 * Store a URL payload in Redis with the configured TTL.
 *
 * Only call this function with active, non-expired URLs.
 * Inactive / expired URLs must NEVER be cached (requirement #7).
 *
 * @param {string} shortCode  Cache key
 * @param {Object} data       { originalUrl, urlId, isActive, expiresAt }
 * @returns {Promise<void>}
 */
async function setUrlCache(shortCode, data) {
    try {
        const key   = buildKey(shortCode);
        const value = JSON.stringify(data);

        // EX sets the TTL in seconds; entry is automatically evicted after REDIS_TTL seconds.
        await redisClient.set(key, value, 'EX', REDIS_TTL);

        logger.debug(`[CacheService] setUrlCache: cached "${shortCode}" (TTL=${REDIS_TTL}s)`);
    } catch (err) {
        // Non-fatal – the redirect still succeeds via PostgreSQL; just warn.
        logger.error(`[CacheService] setUrlCache error for "${shortCode}": ${err.message}`);
    }
}

/**
 * Remove a URL's cache entry.
 *
 * Must be called whenever:
 *  - A URL is deleted  (requirement #6a)
 *  - A URL expires     (handled naturally: we never cache expired URLs, and
 *                        the entry will be evicted by TTL anyway; explicit
 *                        invalidation is still called here for safety)
 *  - URL status changes (future: requirement #6c)
 *
 * @param {string} shortCode  Cache key to invalidate
 * @returns {Promise<void>}
 */
async function deleteUrlCache(shortCode) {
    try {
        await redisClient.del(buildKey(shortCode));
        logger.debug(`[CacheService] deleteUrlCache: invalidated "${shortCode}"`);
    } catch (err) {
        // Non-fatal – a stale entry will eventually be evicted by TTL.
        logger.error(`[CacheService] deleteUrlCache error for "${shortCode}": ${err.message}`);
    }
}

module.exports = {
    getUrlCache,
    setUrlCache,
    deleteUrlCache,
};

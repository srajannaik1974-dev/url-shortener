'use strict';

/**
 * cleanupExpired.job.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Background task that periodically finds URLs whose expiresAt has passed and
 * marks them isActive=false.  Redis cache entries for those URLs are also
 * invalidated (handled inside cleanupExpiredUrls in url.service.js).
 *
 * Design decisions:
 *  - Uses native setInterval; no external scheduler dependency needed.
 *  - Interval is configurable via CLEANUP_INTERVAL_MS env var (default: 60 s).
 *  - The first run is intentionally delayed by one full interval so startup
 *    is not slowed down by an immediate DB query.
 *  - Errors inside a single run are caught and logged; the job continues
 *    running so one DB hiccup doesn't stop future cleanup cycles.
 *  - start() returns the interval handle so it can be cleared in tests or on
 *    graceful shutdown.
 */

const logger = require('../config/logger');
const { cleanupExpiredUrls } = require('../services/url.service');

const DEFAULT_INTERVAL_MS = 60_000; // 60 seconds

/**
 * Start the cleanup background job.
 *
 * @returns {NodeJS.Timeout} The interval handle (pass to clearInterval() to stop)
 */
function start() {
    const intervalMs =
        parseInt(process.env.CLEANUP_INTERVAL_MS, 10) || DEFAULT_INTERVAL_MS;

    logger.info(
        `[CleanupJob] Started — will run every ${intervalMs / 1000}s`
    );

    const handle = setInterval(async () => {
        const cycleTime = new Date().toISOString();
        logger.debug(`[CleanupJob] Running expired URL cleanup — current server time (UTC): ${cycleTime}`);
        try {
            const count = await cleanupExpiredUrls();
            if (count > 0) {
                logger.info(`[CleanupJob] Deactivated ${count} expired URL(s)`);
            } else {
                logger.debug('[CleanupJob] No expired URLs found this cycle');
            }
        } catch (err) {
            // Log but do NOT re-throw — keeps the job alive for future cycles
            logger.error(`[CleanupJob] Error during cleanup run: ${err.message}`);
        }
    }, intervalMs);

    // Prevent the interval from keeping the Node.js process alive on its own
    // when everything else has shut down.
    if (handle.unref) {
        handle.unref();
    }

    return handle;
}

module.exports = { start };

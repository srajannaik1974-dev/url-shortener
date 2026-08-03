'use strict';

const prisma = require('../config/database');
const { generateUniqueShortCode } = require('../utils/shortCode');
const { ConflictError, NotFoundError, ForbiddenError, AppError } = require('../utils/errors');
const cacheService = require('./cache.service');
const logger = require('../config/logger');

/**
 * Creates a shortened URL for a user.
 * @param {Object} urlData Data including originalUrl, customAlias, and expiresAt
 * @param {string} userId Owner's UUID
 * @returns {Promise<Object>} Created URL record
 */
async function createShortUrl(urlData, userId) {
    const { originalUrl, customAlias, expiresAt } = urlData;

    // 1. If custom alias is provided, check if it's already in use
    if (customAlias) {
        const existingAlias = await prisma.url.findFirst({
            where: {
                OR: [
                    { customAlias: customAlias },
                    { shortCode: customAlias }
                ]
            }
        });

        if (existingAlias) {
            throw new ConflictError('Custom alias is already in use');
        }
    }

    // 2. Generate a unique short code
    const shortCode = await generateUniqueShortCode();

    // 3. Form input variables to insert
    const data = {
        originalUrl,
        shortCode,
        userId,
        customAlias: customAlias || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
    };

    // 4. Create the URL record in the database
    return await prisma.url.create({
        data,
    });
}

/**
 * Lists paginated URLs for a specific user.
 * @param {string} userId User UUID
 * @param {number} page Page number
 * @param {number} limit Items per page
 * @returns {Promise<Object>} Object containing urls, page, limit, total, dynamic pages
 */
async function listUrlsForUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [urls, total] = await prisma.$transaction([
        prisma.url.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.url.count({
            where: { userId }
        })
    ]);

    return {
        urls,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    };
}

/**
 * Deletes a URL by ID, verifying user's ownership.
 * @param {string} urlId URL UUID
 * @param {string} userId Owner UUID
 * @returns {Promise<Object>} Deleted URL record
 */
async function deleteUrl(urlId, userId) {
    const url = await prisma.url.findUnique({
        where: { id: urlId },
    });

    if (!url) {
        throw new NotFoundError('URL');
    }

    if (url.userId !== userId) {
        throw new ForbiddenError('You do not have permission to delete this URL');
    }

    const deleted = await prisma.url.delete({
        where: { id: urlId },
    });

    // ── Cache Invalidation ───────────────────────────────────────────────────
    // Remove both possible cache keys (shortCode and customAlias, if set)
    // so that no stale entry remains after deletion.
    await cacheService.deleteUrlCache(url.shortCode);
    if (url.customAlias) {
        await cacheService.deleteUrlCache(url.customAlias);
    }
    logger.debug(`[UrlService] Cache invalidated for deleted URL id=${urlId}`);

    return deleted;
}

/**
 * Processes redirection for a short code or custom alias.
 *
 * Implements the Cache-Aside (Lazy Loading) pattern:
 *
 *  1. Check Redis for a cached URL payload (CACHE HIT → skip DB query).
 *  2. On a cache miss, query PostgreSQL, validate the URL, then populate Redis.
 *  3. Analytics (click counter + Analytics row) always run against PostgreSQL
 *     regardless of whether the URL was served from cache or DB.
 *
 * If Redis is unavailable at any point the function transparently falls back
 * to PostgreSQL – the application never fails because of a Redis outage.
 *
 * @param {string} shortCode Short code or custom alias
 * @param {Object} reqInfo   Request details (ipAddress, userAgent, referer)
 * @returns {Promise<string>} Original URL to redirect to
 */
async function redirectShortCode(shortCode, reqInfo = {}) {
    // ── Step 1: Cache-Aside lookup ───────────────────────────────────────────
    const cached = await cacheService.getUrlCache(shortCode);

    if (cached) {
        // ── CACHE HIT ────────────────────────────────────────────────────────
        // The cached payload already passed all validations when it was stored
        // (active, not expired).  We still run analytics so click counts and
        // the Analytics table remain accurate.
        logger.debug(`[UrlService] Cache HIT for shortCode="${shortCode}"`);

        await prisma.$transaction([
            prisma.url.update({
                where: { id: cached.urlId },
                data: { clicks: { increment: 1 } },
            }),
            prisma.analytics.create({
                data: {
                    urlId:     cached.urlId,
                    ipAddress: reqInfo.ipAddress || null,
                    userAgent: reqInfo.userAgent || null,
                    referer:   reqInfo.referer   || null,
                }
            })
        ]);

        return cached.originalUrl;
    }

    // ── CACHE MISS ───────────────────────────────────────────────────────────
    logger.debug(`[UrlService] Cache MISS for shortCode="${shortCode}" – querying PostgreSQL`);

    // ── Step 2: Query PostgreSQL ─────────────────────────────────────────────
    const url = await prisma.url.findFirst({
        where: {
            OR: [
                { shortCode: shortCode },
                { customAlias: shortCode }
            ]
        }
    });

    if (!url) {
        throw new NotFoundError('URL');
    }

    if (!url.isActive) {
        // Do NOT cache inactive URLs (requirement #7)
        throw new AppError('This URL is inactive', 400);
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
        // Do NOT cache expired URLs (requirement #7); 410 Gone
        throw new AppError('This URL has expired', 410);
    }

    // ── Step 3: Populate Redis (only active, non-expired URLs) ───────────────
    // Store the cache entry keyed by the lookup token (shortCode or alias).
    // Storing it under the lookup key means the next identical request gets a
    // hit immediately, regardless of whether shortCode or customAlias was used.
    await cacheService.setUrlCache(shortCode, {
        originalUrl: url.originalUrl,
        urlId:       url.id,
        isActive:    url.isActive,
        expiresAt:   url.expiresAt,
    });

    // ── Step 4: Analytics (click counter + Analytics row) ───────────────────
    // Identical to the original implementation; runs after every redirect
    // regardless of cache hit/miss so counts are always accurate.
    await prisma.$transaction([
        prisma.url.update({
            where: { id: url.id },
            data: { clicks: { increment: 1 } },
        }),
        prisma.analytics.create({
            data: {
                urlId:     url.id,
                ipAddress: reqInfo.ipAddress || null,
                userAgent: reqInfo.userAgent || null,
                referer:   reqInfo.referer   || null,
            }
        })
    ]);

    return url.originalUrl;
}

/**
 * Retrieves analytics metrics for a specific URL owned by the user.
 * @param {string} urlId URL UUID
 * @param {string} userId Owner UUID
 * @returns {Promise<Object>} URL analytics data
 */
async function getUrlAnalytics(urlId, userId) {
    // 1. Verify URL existence
    const url = await prisma.url.findUnique({
        where: { id: urlId },
    });

    if (!url) {
        throw new NotFoundError('URL');
    }

    // 2. Verify ownership
    if (url.userId !== userId) {
        throw new ForbiddenError('You do not have permission to view analytics for this URL');
    }

    // 3. Fetch recent analytics click records
    const recentClicks = await prisma.analytics.findMany({
        where: { urlId },
        orderBy: { clickedAt: 'desc' },
        take: 100,
    });

    // 4. Compute Referer breakdown
    const refererMap = {};
    const userAgentMap = {};

    recentClicks.forEach((record) => {
        const ref = record.referer || 'Direct / Unknown';
        refererMap[ref] = (refererMap[ref] || 0) + 1;

        const ua = record.userAgent || 'Unknown';
        userAgentMap[ua] = (userAgentMap[ua] || 0) + 1;
    });

    const refererBreakdown = Object.entries(refererMap).map(([referer, count]) => ({ referer, count }));
    const userAgentBreakdown = Object.entries(userAgentMap).map(([userAgent, count]) => ({ userAgent, count }));

    return {
        url: {
            id: url.id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            customAlias: url.customAlias,
            clicks: url.clicks,
            isActive: url.isActive,
            expiresAt: url.expiresAt,
            createdAt: url.createdAt,
        },
        summary: {
            totalClicks: url.clicks,
            trackedClicksCount: recentClicks.length,
        },
        referers: refererBreakdown,
        userAgents: userAgentBreakdown,
        recentClicks,
    };
}

module.exports = {
    createShortUrl,
    listUrlsForUser,
    deleteUrl,
    redirectShortCode,
    getUrlAnalytics,
};

'use strict';

const prisma = require('../config/database');
const { generateUniqueShortCode } = require('../utils/shortCode');
const { ConflictError, NotFoundError, ForbiddenError, AppError } = require('../utils/errors');

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

    return await prisma.url.delete({
        where: { id: urlId },
    });
}

/**
 * Processes redirection for a short code or custom alias.
 * Increments click count and creates an analytics entry.
 * @param {string} shortCode Short code or custom alias
 * @param {Object} reqInfo Request details (ipAddress, userAgent, referer)
 * @returns {Promise<string>} Original URL
 */
async function redirectShortCode(shortCode, reqInfo = {}) {
    // Find URL by shortCode or customAlias
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
        throw new AppError('This URL is inactive', 400);
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
        throw new AppError('This URL has expired', 410); // 410 Gone
    }

    // Modern transaction to update counts and write analytics log
    await prisma.$transaction([
        prisma.url.update({
            where: { id: url.id },
            data: { clicks: { increment: 1 } },
        }),
        prisma.analytics.create({
            data: {
                urlId: url.id,
                ipAddress: reqInfo.ipAddress || null,
                userAgent: reqInfo.userAgent || null,
                referer: reqInfo.referer || null,
            }
        })
    ]);

    return url.originalUrl;
}

module.exports = {
    createShortUrl,
    listUrlsForUser,
    deleteUrl,
    redirectShortCode,
};

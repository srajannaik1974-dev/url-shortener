'use strict';

const urlService = require('../services/url.service');
const { catchAsync, sendSuccess, sendPaginated } = require('../utils/response');

/**
 * POST /api/urls
 * Create a shortened URL
 */
const create = catchAsync(async (req, res) => {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const url = await urlService.createShortUrl(
        { originalUrl, customAlias, expiresAt },
        req.user.id
    );

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const data = {
        ...url,
        shortenedUrl: `${baseUrl}/${url.customAlias || url.shortCode}`
    };

    sendSuccess(res, data, 201, { message: 'URL shortened successfully' });
});

/**
 * GET /api/urls
 * List paginated URLs for current user
 */
const list = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { urls, total } = await urlService.listUrlsForUser(
        req.user.id,
        page,
        limit
    );

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const data = urls.map(url => ({
        ...url,
        shortenedUrl: `${baseUrl}/${url.customAlias || url.shortCode}`
    }));

    sendPaginated(res, data, page, limit, total);
});

/**
 * DELETE /api/urls/:id
 * Delete a shortened URL
 */
const deleteUrl = catchAsync(async (req, res) => {
    const { id } = req.params;
    await urlService.deleteUrl(id, req.user.id);

    sendSuccess(res, null, 200, { message: 'URL deleted successfully' });
});

/**
 * GET /:shortCode
 * Public redirect route
 */
const redirect = catchAsync(async (req, res) => {
    const { shortCode } = req.params;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    const referer = req.get('referer');

    const originalUrl = await urlService.redirectShortCode(shortCode, {
        ipAddress,
        userAgent,
        referer
    });

    res.redirect(302, originalUrl);
});

/**
 * GET /api/urls/:id/analytics
 * Get analytics summary for a specific shortened URL
 */
const getAnalytics = catchAsync(async (req, res) => {
    const { id } = req.params;
    const analytics = await urlService.getUrlAnalytics(id, req.user.id);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const data = {
        ...analytics,
        url: {
            ...analytics.url,
            shortenedUrl: `${baseUrl}/${analytics.url.customAlias || analytics.url.shortCode}`
        }
    };

    sendSuccess(res, data, 200, { message: 'Analytics retrieved successfully' });
});

/**
 * PATCH /api/urls/:id/status
 * Update the active status of a shortened URL
 */
const updateStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const url = await urlService.updateUrlStatus(id, req.user.id, isActive);

    sendSuccess(res, url, 200, {
        message: `URL ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
});

/**
 * PATCH /api/urls/:id/expiration
 * Update or remove the expiration date of a shortened URL
 */
const updateExpiration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { expiresAt } = req.body;

    const url = await urlService.updateUrlExpiration(id, req.user.id, expiresAt);

    sendSuccess(res, url, 200, {
        message: expiresAt
            ? 'URL expiration updated successfully'
            : 'URL expiration removed successfully',
    });
});

module.exports = {
    create,
    list,
    deleteUrl,
    redirect,
    getAnalytics,
    updateStatus,
    updateExpiration,
};

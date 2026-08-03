'use strict';

const { getProfile, updateProfile, changePassword } = require('../services/profile.service');
const { catchAsync, sendSuccess } = require('../utils/response');

/**
 * GET /api/auth/me
 *
 * Returns the authenticated user's profile.
 * `req.user` is already populated by the `protect` middleware, but we re-fetch
 * from the DB via the service to ensure the response always reflects the
 * latest persisted state (e.g. after a concurrent profile update).
 */
const getMe = catchAsync(async (req, res) => {
    const user = await getProfile(req.user.id);
    sendSuccess(res, { user }, 200, { message: 'Profile fetched successfully' });
});

/**
 * PATCH /api/auth/me
 *
 * Partially updates the authenticated user's name and/or email.
 * Validated body arrives via the Zod `validate` middleware before this runs.
 */
const updateMe = catchAsync(async (req, res) => {
    const { name, email } = req.body;
    const user = await updateProfile(req.user.id, { name, email });
    sendSuccess(res, { user }, 200, { message: 'Profile updated successfully' });
});

/**
 * PATCH /api/auth/change-password
 *
 * Changes the authenticated user's password after verifying the current one.
 * Validated body arrives via the Zod `validate` middleware before this runs.
 */
const changePasswordHandler = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await changePassword(req.user.id, { currentPassword, newPassword });
    sendSuccess(res, null, 200, { message: 'Password changed successfully' });
});

module.exports = { getMe, updateMe, changePasswordHandler };

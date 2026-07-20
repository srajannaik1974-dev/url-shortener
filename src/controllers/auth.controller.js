'use strict';

const { registerUser, loginUser, getMe } = require('../services/auth.service');
const { catchAsync, sendSuccess } = require('../utils/response');

/**
 * POST /api/auth/register
 */
const register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, token } = await registerUser({ name, email, password });

    sendSuccess(
        res,
        { user, token },
        201,
        { message: 'User registered successfully' }
    );
});

/**
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    sendSuccess(
        res,
        { user, token },
        200,
        { message: 'Logged in successfully' }
    );
});

/**
 * GET /api/auth/me  (protected)
 */
const me = catchAsync(async (req, res) => {
    const user = await getMe(req.user.id);

    sendSuccess(res, { user }, 200, { message: 'User fetched successfully' });
});

module.exports = { register, login, me };

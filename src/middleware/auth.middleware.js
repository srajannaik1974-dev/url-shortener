'use strict';

const prisma = require('../config/database');
const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');
const { catchAsync } = require('../utils/response');

/**
 * Protect middleware — verifies JWT and attaches the authenticated user to req.user.
 * Reads the token from the Authorization header: "Bearer <token>"
 */
const protect = catchAsync(async (req, res, next) => {
    // 1. Extract Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError(
            'You are not logged in. Please log in to access this resource.'
        );
    }

    // 2. Extract Token
    const token = authHeader.split(' ')[1];

    // 3. Verify Token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
        throw new UnauthorizedError(
            'The token payload is invalid. Please log in again.'
        );
    }

    // 4. Find User
    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new UnauthorizedError(
            'The user belonging to this token no longer exists.'
        );
    }

    // Attach user to request
    req.user = user;
    next();
});

module.exports = {
    protect,
};
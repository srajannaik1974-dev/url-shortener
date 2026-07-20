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
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('You are not logged in. Please log in to access this resource.');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token (throws UnauthorizedError if invalid/expired)
    const decoded = verifyToken(token);

    // 3. Check user still exists
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
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
        throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    // 4. Attach user to request
    req.user = user;
    next();
});

module.exports = { protect };

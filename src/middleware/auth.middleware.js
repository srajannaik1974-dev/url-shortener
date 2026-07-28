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

    // ==========================
    // DEBUG LOGS
    // ==========================
    console.log("\n========== AUTH DEBUG ==========");
    console.log("Authorization Header:", req.headers.authorization);
    console.log("All Headers:", req.headers);

    // 1. Extract Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("❌ Authorization header is missing");
        throw new UnauthorizedError(
            'You are not logged in. Please log in to access this resource.'
        );
    }

    if (!authHeader.startsWith('Bearer ')) {
        console.log("❌ Authorization header does not start with 'Bearer '");
        throw new UnauthorizedError(
            'You are not logged in. Please log in to access this resource.'
        );
    }

    // 2. Extract Token
    const token = authHeader.split(' ')[1];

    console.log("Extracted Token:");
    console.log(token);

    // 3. Verify Token
    let decoded;

    try {
        decoded = verifyToken(token);

        console.log("✅ Token Verified Successfully");
        console.log("Decoded Payload:", decoded);
    } catch (err) {
        console.log("❌ Token Verification Failed");
        console.log(err);
        throw err;
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

    console.log("Database User:");
    console.log(user);

    if (!user) {
        console.log("❌ User not found in database");

        throw new UnauthorizedError(
            'The user belonging to this token no longer exists.'
        );
    }

    console.log("✅ Authentication Successful");
    console.log("================================\n");

    // Attach user
    req.user = user;

    next();
});

module.exports = {
    protect,
};
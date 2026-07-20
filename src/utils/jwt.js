'use strict';

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT token with the given payload.
 * @param {object} payload - Data to encode (e.g. { id, role })
 * @returns {string} Signed JWT string
 */
const signToken = (payload) => {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment variables');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token.
 * Throws UnauthorizedError for any invalid/expired token.
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment variables');
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedError('Your token has expired. Please log in again.');
        }
        throw new UnauthorizedError('Invalid token. Please log in again.');
    }
};

module.exports = { signToken, verifyToken };

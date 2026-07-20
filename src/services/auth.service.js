'use strict';

const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { signToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors');

const SALT_ROUNDS = 12;

/**
 * Selects all user fields EXCEPT passwordHash.
 * Reused across service functions to avoid exposing the hash.
 */
const userPublicSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
const registerUser = async ({ name, email, password }) => {
    // Ensure email is not already taken
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError('Email already exists');

    // Hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user in the database
    const user = await prisma.user.create({
        data: { name, email, passwordHash },
        select: userPublicSelect,
    });

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
};

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
const loginUser = async ({ email, password }) => {
    // Find user including passwordHash for comparison
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedError('Invalid email or password');

    const token = signToken({ id: user.id, role: user.role });

    // Return user without passwordHash
    const { passwordHash: _omit, ...publicUser } = user;
    return { user: publicUser, token };
};

/**
 * Fetch a single user by ID (for /me endpoint).
 * @param {string} userId
 * @returns {object} User without passwordHash
 */
const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userPublicSelect,
    });
    if (!user) throw new NotFoundError('User');
    return user;
};

module.exports = { registerUser, loginUser, getMe };

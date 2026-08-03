'use strict';

const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors');

const SALT_ROUNDS = 12;

/**
 * Selects all public user fields (no passwordHash).
 * Mirrors the same projection used in auth.service.js so the shape is consistent
 * across every endpoint that returns a user object.
 */
const userPublicSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile by ID.
 *
 * The `protect` middleware already performs this lookup and attaches the user
 * to `req.user`.  This service function exists so the controller can delegate
 * to the service layer consistently and re-fetch fresh data from the database
 * (handles the edge case where the JWT is still valid but the user's profile
 * was updated mid-session).
 *
 * @param {string} userId
 * @returns {Promise<object>} User without passwordHash
 */
const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userPublicSelect,
    });
    if (!user) throw new NotFoundError('User');
    return user;
};

// ─── PATCH /api/auth/me ──────────────────────────────────────────────────────

/**
 * Update the authenticated user's name and/or email.
 *
 * Business rules enforced here:
 *  • If a new email is provided and it already belongs to a different account,
 *    a 409 ConflictError is thrown before attempting the DB write.
 *  • Only fields present in `data` are written (partial update).
 *
 * @param {string} userId          - ID of the user performing the update
 * @param {{ name?: string, email?: string }} data - Validated, sanitized payload
 * @returns {Promise<object>} Updated user without passwordHash
 */
const updateProfile = async (userId, data) => {
    // If the client supplied a new email, verify it is not already taken
    // by a DIFFERENT user (same user keeping the same email is fine).
    if (data.email) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
            select: { id: true },
        });
        if (existing && existing.id !== userId) {
            throw new ConflictError('Email is already in use by another account');
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,                     // only fields present in the validated body
        select: userPublicSelect,
    });

    return updatedUser;
};

// ─── PATCH /api/auth/change-password ────────────────────────────────────────

/**
 * Change the authenticated user's password after verifying the current one.
 *
 * Business rules:
 *  • Current password must match the stored hash (401 if not).
 *  • New password must differ from the current one (enforced in the Zod schema).
 *  • New password is hashed with bcrypt before being written to the database.
 *  • The updated user object (without passwordHash) is returned so the
 *    controller can confirm the operation to the client.
 *
 * @param {string} userId
 * @param {{ currentPassword: string, newPassword: string }} data
 * @returns {Promise<object>} Updated user without passwordHash
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
    // Fetch the full record including the hash (not in userPublicSelect)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, passwordHash: true },
    });
    if (!user) throw new NotFoundError('User');

    // Verify current password against the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
        throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash and persist the new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
        select: userPublicSelect,
    });

    return updatedUser;
};

module.exports = { getProfile, updateProfile, changePassword };

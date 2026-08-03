'use strict';

const { z } = require('zod');

/**
 * Zod schema for PATCH /api/auth/me
 *
 * Both fields are optional so the client may update name, email, or both.
 * At least one field must be provided (enforced via .refine).
 */
const updateProfileSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters')
            .optional(),

        email: z
            .string()
            .trim()
            .email('Please provide a valid email address')
            .toLowerCase()
            .optional(),
    })
    .refine((data) => data.name !== undefined || data.email !== undefined, {
        message: 'At least one field (name or email) must be provided',
    });

/**
 * Zod schema for PATCH /api/auth/change-password
 *
 * Requires the current password for verification, plus a matching
 * new password / confirmNewPassword pair.
 */
const changePasswordSchema = z
    .object({
        currentPassword: z
            .string({ required_error: 'Current password is required' })
            .min(1, 'Current password is required'),

        newPassword: z
            .string({ required_error: 'New password is required' })
            .min(8, 'New password must be at least 8 characters'),

        confirmNewPassword: z.string({
            required_error: 'Please confirm your new password',
        }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'New passwords do not match',
        path: ['confirmNewPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must be different from the current password',
        path: ['newPassword'],
    });

module.exports = { updateProfileSchema, changePasswordSchema };

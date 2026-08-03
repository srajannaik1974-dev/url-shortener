'use strict';

const { z } = require('zod');

/**
 * Zod schema for POST /api/urls (creating a shortened URL)
 */
const createUrlSchema = z.object({
    originalUrl: z
        .string({ required_error: 'Original URL is required' })
        .trim()
        .url('Please provide a valid HTTP/HTTPS URL')
        .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
            message: 'URL must start with http:// or https://',
        }),

    customAlias: z
        .string()
        .trim()
        .min(3, 'Custom alias must be at least 3 characters')
        .max(30, 'Custom alias cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Custom alias must contain only alphanumeric characters, hyphens, and underscores')
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),

    // Accepts any ISO 8601 datetime with an explicit timezone offset:
    //   UTC:  "2026-08-04T06:30:00Z"
    //   IST:  "2026-08-04T12:00:00+05:30"
    // Bare strings without an offset (e.g. "2026-08-04T12:00:00") are rejected
    // to prevent silent UTC-vs-local misinterpretation on the server.
    expiresAt: z
        .string()
        .datetime({
            offset: true,
            message:
                'Expiry date must be a valid ISO-8601 string with a timezone offset ' +
                '(e.g. "2026-08-04T12:00:00+05:30" for IST, or "2026-08-04T06:30:00Z" for UTC)',
        })
        .refine((val) => new Date(val) > new Date(), {
            message: 'Expiry date must be in the future',
        })
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
});

/**
 * Zod schema for PATCH /api/urls/:id/status
 * Validates isActive as a strict boolean (true or false).
 */
const updateStatusSchema = z.object({
    isActive: z.boolean({
        required_error: 'isActive is required',
        invalid_type_error: 'isActive must be a boolean (true or false)',
    }),
});

/**
 * Zod schema for PATCH /api/urls/:id/expiration
 * Validates expiresAt as:
 *  - A valid ISO-8601 date string that is in the future, OR
 *  - null / empty string to REMOVE expiration
 */
const updateExpirationSchema = z.object({
    // Accepts ISO 8601 with any timezone offset (Z or +HH:MM).
    // Pass null or omit the field to REMOVE expiration entirely.
    expiresAt: z
        .string()
        .datetime({
            offset: true,
            message:
                'expiresAt must be a valid ISO-8601 string with a timezone offset ' +
                '(e.g. "2026-08-04T12:00:00+05:30" for IST, or "2026-08-04T06:30:00Z" for UTC)',
        })
        .refine((val) => new Date(val) > new Date(), {
            message: 'expiresAt must be in the future',
        })
        .nullable()          // allow null to remove expiration
        .or(z.literal(''))   // allow empty string
        .transform((val) => (val === '' ? null : val))
        .optional()
        .transform((val) => (val === undefined ? null : val)),
});

module.exports = { createUrlSchema, updateStatusSchema, updateExpirationSchema };

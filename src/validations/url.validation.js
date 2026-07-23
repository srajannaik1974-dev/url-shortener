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

    expiresAt: z
        .string()
        .datetime({ message: 'Expiry date must be a valid ISO-8601 date string' })
        .refine((val) => new Date(val) > new Date(), {
            message: 'Expiry date must be in the future',
        })
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
});

module.exports = { createUrlSchema };

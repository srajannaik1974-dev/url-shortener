'use strict';

const { z } = require('zod');

/**
 * Zod schema for POST /api/auth/register
 */
const registerSchema = z
    .object({
        name: z
            .string({ required_error: 'Name is required' })
            .trim()
            .min(2, 'Name must be at least 2 characters'),

        email: z
            .string({ required_error: 'Email is required' })
            .trim()
            .email('Please provide a valid email address')
            .toLowerCase(),

        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters'),

        confirmPassword: z.string({ required_error: 'Please confirm your password' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

/**
 * Zod schema for POST /api/auth/login
 */
const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please provide a valid email address')
        .toLowerCase(),

    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };

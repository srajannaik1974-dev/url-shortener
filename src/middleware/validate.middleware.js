'use strict';

const { ValidationError } = require('../utils/errors');

/**
 * Generic Zod validation middleware factory.
 * Validates req.body against the provided Zod schema.
 * On failure, throws a ValidationError with a joined message string.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const issues = result.error.issues || result.error.errors || [];
        const messages = issues.map((e) => e.message).join('; ');
        return next(new ValidationError(messages));
    }

    // Replace req.body with sanitised/coerced Zod output
    req.body = result.data;
    next();
};

module.exports = { validate };

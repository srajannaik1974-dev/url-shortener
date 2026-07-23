'use strict';

const crypto = require('crypto');
const prisma = require('../config/database');

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random alphanumeric code of specified length.
 * @param {number} length Length of code
 * @returns {string} Code
 */
function generateRandomCode(length) {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += ALPHANUMERIC[bytes[i] % ALPHANUMERIC.length];
    }
    return result;
}

/**
 * Generates a unique short code by checking its availability in the database.
 * Retries if a collision occurs.
 * @param {number} minLength Minimum length of the short code (default: 6)
 * @param {number} maxLength Maximum length of the short code (default: 8)
 * @returns {Promise<string>} Unique short code
 */
async function generateUniqueShortCode(minLength = 6, maxLength = 8) {
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
        // Randomly choose length between minLength and maxLength
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        const code = generateRandomCode(length);

        // Check if the shortCode already exists in db
        const existingUrl = await prisma.url.findUnique({
            where: { shortCode: code },
            select: { id: true }
        });

        if (!existingUrl) {
            return code;
        }

        retries++;
    }

    throw new Error('Failed to generate a unique short code after maximum retries');
}

module.exports = {
    generateRandomCode,
    generateUniqueShortCode
};

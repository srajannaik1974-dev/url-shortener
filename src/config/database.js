'use strict';

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const logger = require('./logger');

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
    log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
});

if (process.env.NODE_ENV === 'development') {
    // Note: query events are not supported with driver adapters in Prisma 7
    // Use pg connection logging or your own middleware instead
}

prisma.$on('error', (e) => {
    logger.error('Prisma error:', e);
});

module.exports = prisma;

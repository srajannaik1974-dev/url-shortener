'use strict';

require('dotenv').config();

const app = require('./app');
const prisma = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Verify database connection
        await prisma.$connect();
        logger.info('✅ Database connection established');

        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        // ─── Graceful Shutdown ────────────────────────────────────────────────────────
        const shutdown = async (signal) => {
            logger.info(`${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                logger.info('Database disconnected. Process exiting.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason) => {
            logger.error('Unhandled Rejection:', reason);
            shutdown('unhandledRejection');
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            logger.error('Uncaught Exception:', err);
            process.exit(1);
        });
    } catch (err) {
        logger.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();

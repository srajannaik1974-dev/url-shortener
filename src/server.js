'use strict';

require('dotenv').config();

// Diagnostic: wrap process.exit to trace where exits originate
const _origProcessExit = process.exit.bind(process);
process.exit = (code) => {
    try {
        console.error(`process.exit called with code: ${code}`);
        console.trace('process.exit trace');
    } catch (e) {
        console.error('Error tracing process.exit', e);
    }
    return _origProcessExit(code);
};

const app = require('./app');
const logger = require('./config/logger');
const prisma = require('./config/database');

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connection established');

        const server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
        // Expose server for diagnostics and confirm it's listening
        try {
            global.__server = server;
            logger.debug(`server.listening=${server.listening}`);
            console.log(`server.listening=${server.listening}`);
            try {
                console.log('server.address=', server.address());
            } catch (e) {
                console.log('server.address() unavailable', e.message);
            }
        } catch (e) {
            console.log('Error exposing server globally', e.message);
        }

        // Diagnostic: trace process lifecycle events
        process.on('beforeExit', (code) => {
            try {
                const handles = process._getActiveHandles ? process._getActiveHandles() : [];
                const requests = process._getActiveRequests ? process._getActiveRequests() : [];
                const handleNames = handles.map(h => h && h.constructor ? h.constructor.name : String(h));
                logger.debug(`process beforeExit with code: ${code} - handles:${handles.length} requests:${requests.length} - ${handleNames.join(',')}`);
                console.log(`process beforeExit with code: ${code} - handles:${handles.length} requests:${requests.length} - ${handleNames.join(',')}`);
                console.trace('beforeExit trace');
            } catch (e) {
                console.log('Error in beforeExit handler', e);
            }
        });
        process.on('exit', (code) => {
            try {
                logger.debug(`process exit with code: ${code}`);
                console.log(`process exit with code: ${code}`);
                console.trace('exit trace');
            } catch (e) {
                console.log('Error in exit handler', e);
            }
        });

        const shutdown = async (signal) => {
            logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(async (err) => {
                if (err) {
                    logger.error('Error closing server', err);
                    process.exit(1);
                }
                await prisma.$disconnect();
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection:', { reason, promise });
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });
    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();
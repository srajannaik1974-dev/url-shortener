'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const morganMiddleware = require('./middleware/morgan');
const { apiLimiter } = require('./middleware/rateLimiter');
const healthRouter = require('./routes/health.routes');
const authRouter = require('./routes/auth.routes');

const urlRouter = require('./routes/url.routes');
const { redirect } = require('./controllers/url.controller');

const app = express();

// ─── Security Headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── HTTP Request Logging ──────────────────────────────────────────────────────
app.use(morganMiddleware);

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/urls', urlRouter);

// Public route for URL redirection
app.get('/:shortCode', redirect);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;

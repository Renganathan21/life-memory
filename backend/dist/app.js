"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const env_js_1 = require("./config/env.js");
const auth_js_1 = __importDefault(require("./plugins/auth.js"));
const error_handler_js_1 = require("./plugins/error-handler.js");
const health_js_1 = require("./routes/health.js");
const auth_js_2 = require("./routes/auth.js");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: {
            level: env_js_1.env.NODE_ENV === 'test' ? 'silent' : 'info',
            transport: env_js_1.env.NODE_ENV === 'development'
                ? {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'HH:MM:ss Z',
                        ignore: 'pid,hostname',
                    },
                }
                : undefined,
        },
    });
    // Security headers
    await app.register(helmet_1.default, {
        contentSecurityPolicy: false,
    });
    // CORS configuration
    await app.register(cors_1.default, {
        origin: env_js_1.env.CORS_ORIGIN === '*' ? true : env_js_1.env.CORS_ORIGIN.split(','),
        credentials: true,
    });
    // Rate Limiter
    await app.register(rate_limit_1.default, {
        max: env_js_1.env.RATE_LIMIT_MAX,
        timeWindow: env_js_1.env.RATE_LIMIT_WINDOW_MS,
    });
    // JWT plugin
    await app.register(jwt_1.default, {
        secret: env_js_1.env.JWT_SECRET,
    });
    // Authentication Decorator Plugin
    await app.register(auth_js_1.default);
    // Setup Global Error Handler
    (0, error_handler_js_1.setupErrorHandler)(app);
    // Register Routes
    await app.register(health_js_1.healthRoutes);
    await app.register(auth_js_2.authRoutes);
    return app;
}

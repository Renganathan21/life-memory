import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { env } from './config/env.js';
import authPlugin from './plugins/auth.js';
import { setupErrorHandler } from './plugins/error-handler.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'test' ? 'silent' : 'info',
      transport:
        env.NODE_ENV === 'development'
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
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // CORS configuration
  await app.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  });

  // Rate Limiter
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  });

  // JWT plugin
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Authentication Decorator Plugin
  await app.register(authPlugin);

  // Setup Global Error Handler
  setupErrorHandler(app);

  // Register Routes
  await app.register(healthRoutes);
  await app.register(authRoutes);

  return app;
}

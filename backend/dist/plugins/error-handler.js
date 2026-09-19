"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandler = setupErrorHandler;
const zod_1 = require("zod");
function setupErrorHandler(fastify) {
    fastify.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        // Zod validation error (instanceof or by shape/name)
        if (error instanceof zod_1.ZodError || error.name === 'ZodError' || 'issues' in error) {
            const issues = error.flatten ? error.flatten().fieldErrors : error.issues;
            const response = {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input data',
                    details: issues,
                },
            };
            return reply.status(400).send(response);
        }
        // Fastify schema validation error
        if ('validation' in error && error.validation) {
            const response = {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.message,
                    details: error.validation,
                },
            };
            return reply.status(400).send(response);
        }
        // Fastify HTTP error with statusCode
        if ('statusCode' in error && typeof error.statusCode === 'number') {
            const response = {
                success: false,
                error: {
                    code: error.code || 'HTTP_ERROR',
                    message: error.message,
                },
            };
            return reply.status(error.statusCode).send(response);
        }
        // Internal Server Error
        const isProd = process.env.NODE_ENV === 'production';
        const response = {
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: isProd ? 'An unexpected server error occurred' : error.message,
            },
        };
        return reply.status(500).send(response);
    });
}

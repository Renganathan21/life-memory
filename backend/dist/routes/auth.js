"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const shared_1 = require("@life-memory/shared");
const auth_service_js_1 = require("../services/auth.service.js");
async function authRoutes(fastify) {
    const authService = new auth_service_js_1.AuthService(fastify);
    // Register
    fastify.post('/api/v1/auth/register', async (request, reply) => {
        const body = shared_1.RegisterSchema.parse(request.body);
        const result = await authService.register(body.name, body.email, body.password);
        const response = {
            success: true,
            data: result,
        };
        return reply.status(201).send(response);
    });
    // Login (with specific brute-force protection rate limit)
    fastify.post('/api/v1/auth/login', {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute',
            },
        },
    }, async (request, reply) => {
        const body = shared_1.LoginSchema.parse(request.body);
        const result = await authService.login(body.email, body.password);
        const response = {
            success: true,
            data: result,
        };
        return reply.status(200).send(response);
    });
    // Refresh Token
    fastify.post('/api/v1/auth/refresh', async (request, reply) => {
        const body = shared_1.RefreshTokenSchema.parse(request.body);
        const tokens = await authService.refresh(body.refreshToken);
        const response = {
            success: true,
            data: tokens,
        };
        return reply.status(200).send(response);
    });
    // Logout (Protected)
    fastify.post('/api/v1/auth/logout', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const userId = request.user.id;
        await authService.logout(userId);
        const response = {
            success: true,
            data: { message: 'Logged out successfully' },
        };
        return reply.status(200).send(response);
    });
    // Get Current User Profile (Protected)
    fastify.get('/api/v1/auth/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const userId = request.user.id;
        const user = await authService.getMe(userId);
        const response = {
            success: true,
            data: user,
        };
        return reply.status(200).send(response);
    });
    // Update Profile (Protected)
    fastify.put('/api/v1/auth/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const userId = request.user.id;
        const body = shared_1.UpdateProfileSchema.parse(request.body);
        const updatedUser = await authService.updateProfile(userId, body);
        const response = {
            success: true,
            data: updatedUser,
        };
        return reply.status(200).send(response);
    });
    // Change Password (Protected)
    fastify.put('/api/v1/auth/change-password', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const userId = request.user.id;
        const body = shared_1.ChangePasswordSchema.parse(request.body);
        await authService.changePassword(userId, body.currentPassword, body.newPassword);
        const response = {
            success: true,
            data: { message: 'Password changed successfully' },
        };
        return reply.status(200).send(response);
    });
}

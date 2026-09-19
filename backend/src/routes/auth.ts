import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  ApiResponse,
  AuthResponse,
  AuthTokens,
  User,
} from '@life-memory/shared';
import { AuthService } from '../services/auth.service.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);

  // Register
  fastify.post('/api/v1/auth/register', async (request, reply) => {
    const body = RegisterSchema.parse(request.body);
    const result = await authService.register(body.name, body.email, body.password);

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: result,
    };
    return reply.status(201).send(response);
  });

  // Login (with specific brute-force protection rate limit)
  fastify.post(
    '/api/v1/auth/login',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const body = LoginSchema.parse(request.body);
      const result = await authService.login(body.email, body.password);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: result,
      };
      return reply.status(200).send(response);
    }
  );

  // Refresh Token
  fastify.post('/api/v1/auth/refresh', async (request, reply) => {
    const body = RefreshTokenSchema.parse(request.body);
    const tokens = await authService.refresh(body.refreshToken);

    const response: ApiResponse<AuthTokens> = {
      success: true,
      data: tokens,
    };
    return reply.status(200).send(response);
  });

  // Logout (Protected)
  fastify.post(
    '/api/v1/auth/logout',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userId = (request.user as any).id;
      await authService.logout(userId);

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Logged out successfully' },
      };
      return reply.status(200).send(response);
    }
  );

  // Get Current User Profile (Protected)
  fastify.get(
    '/api/v1/auth/me',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userId = (request.user as any).id;
      const user = await authService.getMe(userId);

      const response: ApiResponse<User> = {
        success: true,
        data: user,
      };
      return reply.status(200).send(response);
    }
  );

  // Update Profile (Protected)
  fastify.put(
    '/api/v1/auth/me',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userId = (request.user as any).id;
      const body = UpdateProfileSchema.parse(request.body);
      const updatedUser = await authService.updateProfile(userId, body);

      const response: ApiResponse<User> = {
        success: true,
        data: updatedUser,
      };
      return reply.status(200).send(response);
    }
  );

  // Change Password (Protected)
  fastify.put(
    '/api/v1/auth/change-password',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userId = (request.user as any).id;
      const body = ChangePasswordSchema.parse(request.body);
      await authService.changePassword(userId, body.currentPassword, body.newPassword);

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Password changed successfully' },
      };
      return reply.status(200).send(response);
    }
  );
}

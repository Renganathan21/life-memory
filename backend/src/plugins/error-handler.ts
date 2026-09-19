import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { ApiResponse } from '@life-memory/shared';

export function setupErrorHandler(fastify: any) {
  fastify.setErrorHandler((error: FastifyError | ZodError | Error, request: FastifyRequest, reply: FastifyReply) => {
    request.log.error(error);

    // Zod validation error (instanceof or by shape/name)
    if (error instanceof ZodError || (error as any).name === 'ZodError' || 'issues' in error) {
      const issues = (error as any).flatten ? (error as any).flatten().fieldErrors : (error as any).issues;
      const response: ApiResponse = {
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
      const response: ApiResponse = {
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
      const response: ApiResponse = {
        success: false,
        error: {
          code: (error as any).code || 'HTTP_ERROR',
          message: error.message,
        },
      };
      return reply.status(error.statusCode).send(response);
    }

    // Internal Server Error
    const isProd = process.env.NODE_ENV === 'production';
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: isProd ? 'An unexpected server error occurred' : error.message,
      },
    };
    return reply.status(500).send(response);
  });
}

import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { ApiResponse } from '@life-memory/shared';

export async function healthRoutes(fastify: FastifyInstance) {
  const handler = async () => {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const response: ApiResponse<{
      status: string;
      uptimeSeconds: number;
      timestamp: string;
      database: string;
      version: string;
    }> = {
      success: true,
      data: {
        status: 'ok',
        uptimeSeconds: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatusMap[dbState] || 'unknown',
        version: '1.0.0',
      },
    };

    return response;
  };

  fastify.get('/health', handler);
  fastify.get('/api/v1/health', handler);
}

import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface AuthUser {
  id: string;
  email?: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email?: string;
      type?: string;
    };
    user: {
      id: string;
      email?: string;
      type?: string;
    };
  }
}

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required. Invalid or missing token.',
          },
        });
      }
    }
  );
};

export default fp(authPlugin);

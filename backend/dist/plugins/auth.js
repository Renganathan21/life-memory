"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const authPlugin = async (fastify) => {
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            return reply.status(401).send({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required. Invalid or missing token.',
                },
            });
        }
    });
};
exports.default = (0, fastify_plugin_1.default)(authPlugin);

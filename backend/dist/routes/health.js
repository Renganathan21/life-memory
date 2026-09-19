"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
const mongoose_1 = __importDefault(require("mongoose"));
async function healthRoutes(fastify) {
    const handler = async () => {
        const dbState = mongoose_1.default.connection.readyState;
        const dbStatusMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };
        const response = {
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

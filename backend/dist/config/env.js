"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(4000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    MONGODB_URI: zod_1.z.string().default('mongodb://127.0.0.1:27017/lifememory'),
    JWT_SECRET: zod_1.z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters long'),
    CORS_ORIGIN: zod_1.z.string().default('*'),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(100),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(60000),
});
const parseResult = envSchema.safeParse(process.env);
if (!parseResult.success) {
    console.error('❌ Invalid environment variables:', parseResult.error.format());
    process.exit(1);
}
exports.env = parseResult.data;

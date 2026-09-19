"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const db_js_1 = require("./config/db.js");
const env_js_1 = require("./config/env.js");
async function start() {
    try {
        // Attempt DB connection (non-fatal in dev mode if local MongoDB is not running yet)
        try {
            await (0, db_js_1.connectDB)();
        }
        catch (dbErr) {
            console.warn('⚠️ Warning: Could not connect to MongoDB on startup. Will continue in dev mode.');
        }
        const app = await (0, app_js_1.buildApp)();
        await app.listen({
            port: env_js_1.env.PORT,
            host: '0.0.0.0',
        });
        console.log(`🚀 Life Memory API Server running at http://localhost:${env_js_1.env.PORT}`);
        console.log(`🩺 Health check available at http://localhost:${env_js_1.env.PORT}/health`);
    }
    catch (err) {
        console.error('Fatal error starting server:', err);
        process.exit(1);
    }
}
start();

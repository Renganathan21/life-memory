import { buildApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    // Attempt DB connection (non-fatal in dev mode if local MongoDB is not running yet)
    try {
      await connectDB();
    } catch (dbErr) {
      console.warn('⚠️ Warning: Could not connect to MongoDB on startup. Will continue in dev mode.');
    }

    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    console.log(`🚀 Life Memory API Server running at http://localhost:${env.PORT}`);
    console.log(`🩺 Health check available at http://localhost:${env.PORT}/health`);
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

start();

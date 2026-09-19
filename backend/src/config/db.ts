import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(): Promise<typeof mongoose> {
  try {
    mongoose.connection.on('connected', () => {
      console.log('📦 MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    return conn;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

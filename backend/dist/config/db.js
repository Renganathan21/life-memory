"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
async function connectDB() {
    try {
        mongoose_1.default.connection.on('connected', () => {
            console.log('📦 MongoDB connection established successfully');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
        const conn = await mongoose_1.default.connect(env_js_1.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        return conn;
    }
    catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        if (env_js_1.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        throw error;
    }
}
async function disconnectDB() {
    await mongoose_1.default.disconnect();
}

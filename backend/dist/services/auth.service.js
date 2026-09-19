"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const User_js_1 = require("../models/User.js");
class AuthService {
    fastify;
    constructor(fastify) {
        this.fastify = fastify;
    }
    async hashPassword(password) {
        return argon2_1.default.hash(password, {
            type: argon2_1.default.argon2id,
            memoryCost: 2 ** 16, // 64 MB
            timeCost: 3,
            parallelism: 1,
        });
    }
    async verifyPassword(hash, plain) {
        try {
            return await argon2_1.default.verify(hash, plain);
        }
        catch {
            return false;
        }
    }
    generateTokens(user) {
        const userId = user._id.toString();
        // Access Token: 15 minutes
        const accessToken = this.fastify.jwt.sign({ id: userId, email: user.email }, { expiresIn: '15m' });
        // Refresh Token: 30 days
        const refreshToken = this.fastify.jwt.sign({ id: userId, email: user.email, type: 'refresh' }, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }
    async saveRefreshTokenHash(userId, refreshToken) {
        const refreshTokenHash = await argon2_1.default.hash(refreshToken);
        await User_js_1.UserModel.findByIdAndUpdate(userId, { refreshTokenHash });
    }
    formatUser(user) {
        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
    async register(name, email, password) {
        const existing = await User_js_1.UserModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            const error = new Error('A user with this email address already exists');
            error.statusCode = 409;
            error.code = 'EMAIL_ALREADY_EXISTS';
            throw error;
        }
        const passwordHash = await this.hashPassword(password);
        const user = await User_js_1.UserModel.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
        });
        const tokens = this.generateTokens(user);
        await this.saveRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    async login(email, password) {
        const user = await User_js_1.UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            error.code = 'INVALID_CREDENTIALS';
            throw error;
        }
        const isValid = await this.verifyPassword(user.passwordHash, password);
        if (!isValid) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            error.code = 'INVALID_CREDENTIALS';
            throw error;
        }
        const tokens = this.generateTokens(user);
        await this.saveRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    async refresh(refreshToken) {
        try {
            const decoded = this.fastify.jwt.verify(refreshToken);
            if (!decoded || decoded.type !== 'refresh' || !decoded.id) {
                const error = new Error('Invalid refresh token');
                error.statusCode = 401;
                error.code = 'INVALID_REFRESH_TOKEN';
                throw error;
            }
            const user = await User_js_1.UserModel.findById(decoded.id).select('+refreshTokenHash');
            if (!user || !user.refreshTokenHash) {
                const error = new Error('Session expired or revoked');
                error.statusCode = 401;
                error.code = 'REFRESH_TOKEN_EXPIRED';
                throw error;
            }
            const isValid = await argon2_1.default.verify(user.refreshTokenHash, refreshToken);
            if (!isValid) {
                const error = new Error('Invalid refresh token');
                error.statusCode = 401;
                error.code = 'INVALID_REFRESH_TOKEN';
                throw error;
            }
            // Rotate tokens
            const tokens = this.generateTokens(user);
            await this.saveRefreshTokenHash(user._id.toString(), tokens.refreshToken);
            return tokens;
        }
        catch (err) {
            if (err.statusCode)
                throw err;
            const error = new Error('Invalid or expired refresh token');
            error.statusCode = 401;
            error.code = 'INVALID_REFRESH_TOKEN';
            throw error;
        }
    }
    async logout(userId) {
        await User_js_1.UserModel.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
    }
    async getMe(userId) {
        const user = await User_js_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            error.code = 'USER_NOT_FOUND';
            throw error;
        }
        return this.formatUser(user);
    }
    async updateProfile(userId, input) {
        const updateData = {};
        if (input.name !== undefined)
            updateData.name = input.name;
        if (input.avatarUrl !== undefined)
            updateData.avatarUrl = input.avatarUrl || null;
        const user = await User_js_1.UserModel.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            error.code = 'USER_NOT_FOUND';
            throw error;
        }
        return this.formatUser(user);
    }
    async changePassword(userId, currentPass, newPass) {
        const user = await User_js_1.UserModel.findById(userId).select('+passwordHash');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            error.code = 'USER_NOT_FOUND';
            throw error;
        }
        const isValid = await this.verifyPassword(user.passwordHash, currentPass);
        if (!isValid) {
            const error = new Error('Current password is incorrect');
            error.statusCode = 400;
            error.code = 'INVALID_CURRENT_PASSWORD';
            throw error;
        }
        const newHash = await this.hashPassword(newPass);
        user.passwordHash = newHash;
        // Invalidate old refresh session on password change for security
        user.refreshTokenHash = undefined;
        await user.save();
    }
}
exports.AuthService = AuthService;

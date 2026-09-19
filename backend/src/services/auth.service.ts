import argon2 from 'argon2';
import { FastifyInstance } from 'fastify';
import { AuthResponse, AuthTokens, User, UpdateProfileInput } from '@life-memory/shared';
import { UserModel, IUserDocument } from '../models/User.js';
import { env } from '../config/env.js';

export class AuthService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  generateTokens(user: IUserDocument): AuthTokens {
    const userId = user._id.toString();

    // Access Token: 15 minutes
    const accessToken = this.fastify.jwt.sign(
      { id: userId, email: user.email },
      { expiresIn: '15m' }
    );

    // Refresh Token: 30 days
    const refreshToken = this.fastify.jwt.sign(
      { id: userId, email: user.email, type: 'refresh' },
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = await argon2.hash(refreshToken);
    await UserModel.findByIdAndUpdate(userId, { refreshTokenHash });
  }

  formatUser(user: IUserDocument): User {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      const error: any = new Error('A user with this email address already exists');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await this.hashPassword(password);
    const user = await UserModel.create({
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

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isValid = await this.verifyPassword(user.passwordHash, password);
    if (!isValid) {
      const error: any = new Error('Invalid email or password');
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

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded: any = this.fastify.jwt.verify(refreshToken);
      if (!decoded || decoded.type !== 'refresh' || !decoded.id) {
        const error: any = new Error('Invalid refresh token');
        error.statusCode = 401;
        error.code = 'INVALID_REFRESH_TOKEN';
        throw error;
      }

      const user = await UserModel.findById(decoded.id).select('+refreshTokenHash');
      if (!user || !user.refreshTokenHash) {
        const error: any = new Error('Session expired or revoked');
        error.statusCode = 401;
        error.code = 'REFRESH_TOKEN_EXPIRED';
        throw error;
      }

      const isValid = await argon2.verify(user.refreshTokenHash, refreshToken);
      if (!isValid) {
        const error: any = new Error('Invalid refresh token');
        error.statusCode = 401;
        error.code = 'INVALID_REFRESH_TOKEN';
        throw error;
      }

      // Rotate tokens
      const tokens = this.generateTokens(user);
      await this.saveRefreshTokenHash(user._id.toString(), tokens.refreshToken);

      return tokens;
    } catch (err: any) {
      if (err.statusCode) throw err;
      const error: any = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  }

  async getMe(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return this.formatUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl || null;

    const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return this.formatUser(user);
  }

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<void> {
    const user = await UserModel.findById(userId).select('+passwordHash');
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const isValid = await this.verifyPassword(user.passwordHash, currentPass);
    if (!isValid) {
      const error: any = new Error('Current password is incorrect');
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

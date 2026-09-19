import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { buildApp } from '../src/app.js';
import { UserModel } from '../src/models/User.js';

describe('Authentication & User Isolation API', () => {
  let app: FastifyInstance;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const testUser = {
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    password: 'Password123!',
  };

  let activeAccessToken = '';
  let activeRefreshToken = '';

  it('POST /api/v1/auth/register creates user and returns auth tokens', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: testUser,
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.user.name).toBe(testUser.name);
    expect(body.data.user.email).toBe(testUser.email);
    expect(body.data.user.id).toBeDefined();
    expect(body.data.tokens.accessToken).toBeDefined();
    expect(body.data.tokens.refreshToken).toBeDefined();

    activeAccessToken = body.data.tokens.accessToken;
    activeRefreshToken = body.data.tokens.refreshToken;

    // Verify DB state
    const dbUser = await UserModel.findOne({ email: testUser.email }).select('+passwordHash');
    expect(dbUser).toBeDefined();
    expect(dbUser?.passwordHash).not.toBe(testUser.password); // Must be Argon2 hashed
  });

  it('POST /api/v1/auth/register rejects duplicate email with 409', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: testUser,
    });

    expect(res.statusCode).toBe(409);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('POST /api/v1/auth/register validates input with Zod schema', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'A',
        email: 'not-an-email',
        password: 'short',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login succeeds with correct credentials and updates tokens', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe(testUser.email);
    expect(body.data.tokens.accessToken).toBeDefined();
    expect(body.data.tokens.refreshToken).toBeDefined();

    activeAccessToken = body.data.tokens.accessToken;
    activeRefreshToken = body.data.tokens.refreshToken;
  });

  it('POST /api/v1/auth/login rejects incorrect password with 401', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testUser.email,
        password: 'WrongPassword!',
      },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('GET /api/v1/auth/me rejects unauthenticated requests with 401', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me returns current user profile with valid Bearer token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: {
        authorization: `Bearer ${activeAccessToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe(testUser.email);
    expect(body.data.name).toBe(testUser.name);
  });

  it('PUT /api/v1/auth/me updates user profile name', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/auth/me',
      headers: {
        authorization: `Bearer ${activeAccessToken}`,
      },
      payload: {
        name: 'Sarah Connor Reese',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Sarah Connor Reese');
  });

  it('PUT /api/v1/auth/change-password validates current password and updates hash', async () => {
    // 1. Wrong current password fails
    const wrongRes = await app.inject({
      method: 'PUT',
      url: '/api/v1/auth/change-password',
      headers: {
        authorization: `Bearer ${activeAccessToken}`,
      },
      payload: {
        currentPassword: 'IncorrectPassword',
        newPassword: 'BrandNewPassword123!',
      },
    });

    expect(wrongRes.statusCode).toBe(400);

    // 2. Correct current password succeeds
    const correctRes = await app.inject({
      method: 'PUT',
      url: '/api/v1/auth/change-password',
      headers: {
        authorization: `Bearer ${activeAccessToken}`,
      },
      payload: {
        currentPassword: testUser.password,
        newPassword: 'BrandNewPassword123!',
      },
    });

    expect(correctRes.statusCode).toBe(200);

    // 3. Login with new password succeeds
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testUser.email,
        password: 'BrandNewPassword123!',
      },
    });

    expect(loginRes.statusCode).toBe(200);
    const loginBody = JSON.parse(loginRes.body);
    activeAccessToken = loginBody.data.tokens.accessToken;
    activeRefreshToken = loginBody.data.tokens.refreshToken;
  });

  it('POST /api/v1/auth/refresh rotates tokens with valid active refresh token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: {
        refreshToken: activeRefreshToken,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.refreshToken).toBeDefined();

    // Update active tokens
    activeAccessToken = body.data.accessToken;
    activeRefreshToken = body.data.refreshToken;
  });

  it('POST /api/v1/auth/logout clears refresh token session', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
      headers: {
        authorization: `Bearer ${activeAccessToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);

    // Refreshing now should fail with 401
    const refreshRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: {
        refreshToken: activeRefreshToken,
      },
    });

    expect(refreshRes.statusCode).toBe(401);
  });
});

import {
  ApiResponse,
  AuthResponse,
  AuthTokens,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
  User,
} from '@life-memory/shared';
import { apiClient } from './api';

export const AuthService = {
  async register(input: RegisterInput): Promise<ApiResponse<AuthResponse>> {
    return apiClient<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async login(input: LoginInput): Promise<ApiResponse<AuthResponse>> {
    return apiClient<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async refresh(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return apiClient<AuthTokens>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient<{ message: string }>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  async getMe(): Promise<ApiResponse<User>> {
    return apiClient<User>('/api/v1/auth/me', {
      method: 'GET',
    });
  },

  async updateProfile(input: UpdateProfileInput): Promise<ApiResponse<User>> {
    return apiClient<User>('/api/v1/auth/me', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  async changePassword(input: ChangePasswordInput): Promise<ApiResponse<{ message: string }>> {
    return apiClient<{ message: string }>('/api/v1/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
};

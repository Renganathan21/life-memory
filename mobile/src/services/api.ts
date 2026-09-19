import { ApiResponse } from '@life-memory/shared';
import { Storage } from './storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getBaseUrl(): string {
  // Configurable or dynamically resolved from Expo debugger host
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  if (Platform.OS === 'android') {
    // Android emulator alias for 127.0.0.1
    return 'http://10.0.2.2:4000';
  }

  return 'http://localhost:4000';
}

export const API_BASE_URL = getBaseUrl();

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const accessToken = await Storage.getAccessToken();
  if (accessToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle Token Expiry & Automatic Refresh on 401
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (isRefreshing) {
        // Queue this request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: async (newToken) => {
              if (newToken) {
                headers['Authorization'] = `Bearer ${newToken}`;
                try {
                  const retryRes = await fetch(url, { ...options, headers });
                  const data = await retryRes.json();
                  resolve(data);
                } catch (retryErr) {
                  reject(retryErr);
                }
              } else {
                reject(new Error('Session expired'));
              }
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;
      const refreshToken = await Storage.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        await Storage.clearAllAuth();
        throw new Error('Unauthorized');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData: ApiResponse<{ accessToken: string; refreshToken: string }> =
          await refreshResponse.json();

        if (refreshData.success && refreshData.data) {
          await Storage.setAccessToken(refreshData.data.accessToken);
          await Storage.setRefreshToken(refreshData.data.refreshToken);

          processQueue(null, refreshData.data.accessToken);

          // Retry the initial request
          headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
          const retryRes = await fetch(url, { ...options, headers });
          return await retryRes.json();
        } else {
          processQueue(new Error('Failed to refresh session'), null);
          await Storage.clearAllAuth();
          throw new Error('Session expired');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await Storage.clearAllAuth();
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      },
    };
  }
}

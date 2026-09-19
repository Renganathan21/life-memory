import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'lm_access_token';
const REFRESH_TOKEN_KEY = 'lm_refresh_token';
const USER_KEY = 'lm_user_profile';

// In-memory fallback for web / unsupported environments
const memoryStorage: Record<string, string> = {};

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {
      memoryStorage[key] = value;
    }
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch (error) {
    console.warn(`SecureStore write error for key ${key}:`, error);
    memoryStorage[key] = value;
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStorage[key] || null;
    }
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`SecureStore read error for key ${key}:`, error);
    return memoryStorage[key] || null;
  }
}

export async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {
      delete memoryStorage[key];
    }
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`SecureStore delete error for key ${key}:`, error);
    delete memoryStorage[key];
  }
}

export const Storage = {
  getAccessToken: () => getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => setItem(ACCESS_TOKEN_KEY, token),
  deleteAccessToken: () => deleteItem(ACCESS_TOKEN_KEY),

  getRefreshToken: () => getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => setItem(REFRESH_TOKEN_KEY, token),
  deleteRefreshToken: () => deleteItem(REFRESH_TOKEN_KEY),

  getUser: async () => {
    const data = await getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: any) => setItem(USER_KEY, JSON.stringify(user)),
  deleteUser: () => deleteItem(USER_KEY),

  clearAllAuth: async () => {
    await Promise.all([
      deleteItem(ACCESS_TOKEN_KEY),
      deleteItem(REFRESH_TOKEN_KEY),
      deleteItem(USER_KEY),
    ]);
  },
};

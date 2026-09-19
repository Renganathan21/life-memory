import { create } from 'zustand';
import { User, LoginInput, RegisterInput, UpdateProfileInput, ChangePasswordInput } from '@life-memory/shared';
import { Storage } from '../services/storage';
import { AuthService } from '../services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initAuth: () => Promise<void>;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
  changePassword: (input: ChangePasswordInput) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = await Storage.getAccessToken();
      const savedUser = await Storage.getUser();

      if (accessToken && savedUser) {
        set({ user: savedUser, isAuthenticated: true });

        // Fetch latest user profile in background
        const res = await AuthService.getMe();
        if (res.success && res.data) {
          set({ user: res.data });
          await Storage.setUser(res.data);
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.warn('Error during auth initialization:', err);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (input: LoginInput) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.login(input);
      if (res.success && res.data) {
        const { user, tokens } = res.data;
        await Storage.setAccessToken(tokens.accessToken);
        await Storage.setRefreshToken(tokens.refreshToken);
        await Storage.setUser(user);

        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return { success: true };
      } else {
        const errorMessage = res.error?.message || 'Login failed. Please check your credentials.';
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during login';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  register: async (input: RegisterInput) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.register(input);
      if (res.success && res.data) {
        const { user, tokens } = res.data;
        await Storage.setAccessToken(tokens.accessToken);
        await Storage.setRefreshToken(tokens.refreshToken);
        await Storage.setUser(user);

        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return { success: true };
      } else {
        const errorMessage = res.error?.message || 'Registration failed. Please try again.';
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during registration';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  updateProfile: async (input: UpdateProfileInput) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.updateProfile(input);
      if (res.success && res.data) {
        set({ user: res.data, isLoading: false, error: null });
        await Storage.setUser(res.data);
        return { success: true };
      } else {
        const msg = res.error?.message || 'Failed to update profile.';
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }
    } catch (err: any) {
      const msg = err.message || 'Error updating profile';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  changePassword: async (input: ChangePasswordInput) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.changePassword(input);
      if (res.success) {
        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        const msg = res.error?.message || 'Failed to change password.';
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }
    } catch (err: any) {
      const msg = err.message || 'Error changing password';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.warn('Logout API failed or server unreachable:', err);
    } finally {
      await Storage.clearAllAuth();
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearError: () => set({ error: null }),
}));

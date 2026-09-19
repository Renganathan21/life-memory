import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (val: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: true, // Default to sleek dark mode
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (val) => set({ isDarkMode: val }),
}));

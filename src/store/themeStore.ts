import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeType = 'light' | 'dark' | 'love';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      isDark: false,
      setTheme: (theme) => {
        document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
        set({ theme, isDark: theme === 'dark' });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
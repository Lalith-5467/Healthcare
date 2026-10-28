import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeProviderContext = createContext<ThemeProviderContextType>({
  theme: 'light',
  setTheme: () => null,
  toggleTheme: () => null,
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode, storageKey?: string }> = ({ children, storageKey = 'medicare-theme' }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem('medicare-theme') || localStorage.getItem('theme-landing');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
        return 'dark';
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback if localStorage or window is unavailable
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
      if (storageKey !== 'medicare-theme') {
        localStorage.setItem('medicare-theme', theme);
      }
    } catch (e) {
      console.warn('Could not persist theme to localStorage:', e);
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme, storageKey]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if ((e.key === storageKey || e.key === 'medicare-theme') && (e.newValue === 'dark' || e.newValue === 'light')) {
        setThemeState(e.newValue as Theme);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      <div className={isDark ? 'dark' : 'light'} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeProviderContext);


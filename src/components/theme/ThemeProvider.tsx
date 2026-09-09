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
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    // Clean up any stale global classes from previous implementations
    document.documentElement.classList.remove('dark', 'light');
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

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


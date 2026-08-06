/**
 * ThemeContext.jsx — Dark / Light mode state
 *
 * Provides:
 *  - theme        : 'dark' | 'light'
 *  - toggleTheme(): flip between dark and light
 *  - isDark       : boolean shorthand
 *
 * Strategy:
 *  1. Read saved preference from localStorage
 *  2. Fall back to OS preference (prefers-color-scheme)
 *  3. Apply/remove `dark` class on <html> element
 */

import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'app_theme';

const ThemeContext = createContext(null);

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  // Fall back to OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook — access theme context.
 * Must be used inside <ThemeProvider>.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return context;
}

export default ThemeContext;

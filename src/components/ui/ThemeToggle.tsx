import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`w-10 h-10 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer select-none ${
        isDark
          ? 'bg-slate-800/90 border-slate-700/80 text-[#00a896] hover:bg-slate-800 shadow-sm hover:scale-105'
          : 'bg-slate-100 border-slate-200/80 text-amber-500 hover:bg-slate-200/80 shadow-xs hover:scale-105'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};





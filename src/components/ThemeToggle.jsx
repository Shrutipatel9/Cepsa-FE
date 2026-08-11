import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-md bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-cepsa-gold hover:scale-110 transition-all duration-300 shadow-md group overflow-hidden"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle light or dark theme"
    >
      <div className="relative z-10 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow group-hover:rotate-90 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform" />
        )}
      </div>

      {/* Ripple hover effect */}
      <span className="absolute inset-0 bg-cepsa-gold/10 scale-0 group-hover:scale-100 rounded-md transition-transform duration-300" />
    </button>
  );
}

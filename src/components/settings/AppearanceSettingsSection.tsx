import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { AppearanceSettingsState } from './settingsData';
import { useTheme } from '../theme/ThemeProvider';

interface AppearanceSettingsSectionProps {
  appearance: AppearanceSettingsState;
  onUpdateAppearance: (updated: AppearanceSettingsState) => void;
  onShowToast: (msg: string) => void;
}

export const AppearanceSettingsSection: React.FC<AppearanceSettingsSectionProps> = ({
  appearance,
  onUpdateAppearance,
  onShowToast,
}) => {
  const { theme: currentTheme, setTheme } = useTheme();

  const handleThemeChange = (mode: AppearanceSettingsState['theme']) => {
    onUpdateAppearance({ ...appearance, theme: mode });
    if (mode === 'Dark') {
      setTheme('dark');
    } else if (mode === 'Light') {
      setTheme('light');
    } else {
      // System default
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    onShowToast(`✓ Theme set to ${mode} mode`);
  };

  const handleAccentChange = (accentColor: AppearanceSettingsState['accentColor']) => {
    onUpdateAppearance({ ...appearance, accentColor });
    onShowToast(`✓ Accent color updated to ${accentColor}`);
  };

  const handleFontSizeChange = (fontSize: AppearanceSettingsState['fontSize']) => {
    onUpdateAppearance({ ...appearance, fontSize });
    onShowToast(`✓ Text size set to ${fontSize}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Appearance & Display</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Customize theme mode, accent colors, typography size, and motion</p>
        </div>
      </div>

      {/* THEME SELECTOR */}
      <div className="space-y-3 font-mono">
        <label className="block text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider font-sans">Theme Mode</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { mode: 'Dark' as const, icon: Moon, label: 'Dark Mode' },
            { mode: 'Light' as const, icon: Sun, label: 'Light Mode' },
            { mode: 'System' as const, icon: Monitor, label: 'System Default' }
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = (t.mode === 'Dark' && currentTheme === 'dark') || (t.mode === 'Light' && currentTheme === 'light') || appearance.theme === t.mode;
            return (
              <button
                key={t.mode}
                onClick={() => handleThemeChange(t.mode)}
                className={`p-4 rounded-2xl border font-extrabold text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-teal-500/10 dark:bg-purple-500/20 text-[#00a896] dark:text-purple-300 border-[#00a896] dark:border-purple-500/40 shadow-md ring-2 ring-teal-500/30'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-sans text-xs">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACCENT COLOR PICKER */}
      <div className="space-y-3 font-mono border-t border-slate-200 dark:border-slate-800 pt-4">
        <label className="block text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider font-sans">Accent Color</label>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {[
            { name: 'Teal' as const, bg: 'bg-[#00a896]' },
            { name: 'Blue' as const, bg: 'bg-indigo-600' },
            { name: 'Cyan' as const, bg: 'bg-cyan-500' },
            { name: 'Violet' as const, bg: 'bg-purple-600' },
            { name: 'Rose' as const, bg: 'bg-rose-500' }
          ].map((c) => {
            const active = appearance.accentColor === c.name;
            return (
              <button
                key={c.name}
                onClick={() => handleAccentChange(c.name)}
                className={`px-4 py-2.5 rounded-xl font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white border-[#00a896] dark:border-purple-400 shadow'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`} />
                <span className="font-sans text-xs">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FONT SIZE SCALER */}
      <div className="space-y-3 font-mono border-t border-slate-200 dark:border-slate-800 pt-4">
        <label className="block text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider font-sans">Text Size</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Small', 'Medium', 'Large', 'Extra Large'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => handleFontSizeChange(sz)}
              className={`py-2.5 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center font-sans ${
                appearance.fontSize === sz
                  ? 'bg-teal-500/10 dark:bg-purple-500/20 text-[#00a896] dark:text-purple-300 border-[#00a896] dark:border-purple-500/40'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* REDUCED MOTION */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs font-sans">Reduce Motion</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans">Minimize animations and UI transitions throughout the app</p>
        </div>
        <button
          onClick={() => {
            const updated = !appearance.reducedMotion;
            onUpdateAppearance({ ...appearance, reducedMotion: updated });
            onShowToast(updated ? '✓ Reduced Motion enabled' : '✓ Reduced Motion disabled');
          }}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            appearance.reducedMotion ? 'bg-[#00a896] dark:bg-purple-600' : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
            appearance.reducedMotion ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>
    </div>
  );
};

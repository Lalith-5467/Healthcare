import React from 'react';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import type { AppearanceSettingsState } from './settingsData';

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
  const handleThemeChange = (theme: AppearanceSettingsState['theme']) => {
    onUpdateAppearance({ ...appearance, theme });
    onShowToast(`✓ Theme set to ${theme}`);
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Appearance & Display</h3>
          <p className="text-xs text-slate-400">Customize theme mode, accent colors, typography size, and motion</p>
        </div>
      </div>

      {/* THEME SELECTOR */}
      <div className="space-y-3 font-mono">
        <label className="block text-slate-300 font-bold uppercase tracking-wider font-sans">Theme Mode</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { mode: 'Dark' as const, icon: Moon, label: 'Dark Mode' },
            { mode: 'Light' as const, icon: Sun, label: 'Light Mode' },
            { mode: 'System' as const, icon: Monitor, label: 'System Default' }
          ].map((t) => {
            const Icon = t.icon;
            const active = appearance.theme === t.mode;
            return (
              <button
                key={t.mode}
                onClick={() => handleThemeChange(t.mode)}
                className={`p-4 rounded-2xl border font-bold text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
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
      <div className="space-y-3 font-mono border-t border-slate-800 pt-4">
        <label className="block text-slate-300 font-bold uppercase tracking-wider font-sans">Accent Color</label>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {[
            { name: 'Violet' as const, bg: 'bg-purple-600' },
            { name: 'Blue' as const, bg: 'bg-indigo-600' },
            { name: 'Cyan' as const, bg: 'bg-cyan-500' },
            { name: 'Green' as const, bg: 'bg-teal-500' },
            { name: 'Rose' as const, bg: 'bg-rose-500' }
          ].map((c) => {
            const active = appearance.accentColor === c.name;
            return (
              <button
                key={c.name}
                onClick={() => handleAccentChange(c.name)}
                className={`px-4 py-2.5 rounded-xl font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-slate-950 text-white border-purple-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
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
      <div className="space-y-3 font-mono border-t border-slate-800 pt-4">
        <label className="block text-slate-300 font-bold uppercase tracking-wider font-sans">Text Size</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Small', 'Medium', 'Large', 'Extra Large'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => handleFontSizeChange(sz)}
              className={`py-2.5 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center font-sans ${
                appearance.fontSize === sz
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* REDUCED MOTION */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
        <div>
          <h4 className="font-extrabold text-white text-xs font-sans">Reduce Motion</h4>
          <p className="text-[10px] text-slate-400 font-sans">Minimize animations and UI transitions throughout the app</p>
        </div>
        <button
          onClick={() => {
            const updated = !appearance.reducedMotion;
            onUpdateAppearance({ ...appearance, reducedMotion: updated });
            onShowToast(updated ? '✓ Reduced Motion enabled' : '✓ Reduced Motion disabled');
          }}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            appearance.reducedMotion ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'
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

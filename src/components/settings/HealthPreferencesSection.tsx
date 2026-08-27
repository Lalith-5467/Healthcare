import React from 'react';
import type { HealthPreferencesSettingsState } from './settingsData';

interface HealthPreferencesSectionProps {
  preferences: HealthPreferencesSettingsState;
  onUpdatePreferences: (updated: HealthPreferencesSettingsState) => void;
  onShowToast: (msg: string) => void;
}

export const HealthPreferencesSection: React.FC<HealthPreferencesSectionProps> = ({
  preferences,
  onUpdatePreferences,
  onShowToast,
}) => {
  const toggleReminder = (key: keyof HealthPreferencesSettingsState) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    onUpdatePreferences(updated);
    onShowToast('✓ Health Reminder preference updated');
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Health Preferences</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Language, measurement units, healthcare focus, and reminder sync</p>
        </div>
      </div>

      {/* HEALTHCARE TYPE & LANGUAGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Preferred Healthcare Focus</label>
          <select
            value={preferences.healthcareType}
            onChange={(e) => {
              onUpdatePreferences({ ...preferences, healthcareType: e.target.value as any });
              onShowToast('✓ Healthcare type saved');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans font-medium focus:outline-none"
          >
            <option value="General Care">General Care</option>
            <option value="Specialist Care">Specialist Care</option>
            <option value="Preventive Care">Preventive Care</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">App Language</label>
          <select
            value={preferences.language}
            onChange={(e) => {
              onUpdatePreferences({ ...preferences, language: e.target.value as any });
              onShowToast(`Language preference saved to ${e.target.value}`);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans font-medium focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
          </select>
        </div>
      </div>

      {/* MEASUREMENT UNITS */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono">
        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider font-sans">Measurement Units</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onUpdatePreferences({ ...preferences, units: 'Metric' as const });
              onShowToast('✓ Units set to Metric (kg, cm)');
            }}
            className={`p-3.5 rounded-2xl border font-bold text-center font-sans transition-all cursor-pointer ${
              preferences.units === 'Metric'
                ? 'bg-[#00a896] text-white border-[#00a896] shadow-md'
                : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            Metric (kg, cm, °C)
          </button>

          <button
            onClick={() => {
              onUpdatePreferences({ ...preferences, units: 'Imperial' as const });
              onShowToast('✓ Units set to Imperial (lbs, ft)');
            }}
            className={`p-3.5 rounded-2xl border font-bold text-center font-sans transition-all cursor-pointer ${
              preferences.units === 'Imperial'
                ? 'bg-[#00a896] text-white border-[#00a896] shadow-md'
                : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            Imperial (lbs, ft, °F)
          </button>
        </div>
      </div>

      {/* HEALTH REMINDER SYNC */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">Automated Health Reminders</h4>
        <div className="space-y-2">
          {[
            { key: 'remindersHydration' as const, title: 'Hydration & Water Intake Reminders', desc: 'Alerts to log daily water consumption' },
            { key: 'remindersCheckUp' as const, title: 'Weekly Vital Sign Logging', desc: 'Prompts to record BP, SPO2 & body weight' },
            { key: 'remindersMedication' as const, title: 'Immunization & Vaccine Alerts', desc: 'Preventive vaccine due date notifications' }
          ].map((rem) => {
            const active = preferences[rem.key];
            return (
              <div key={rem.key} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs">{rem.title}</h5>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">{rem.desc}</p>
                </div>
                <button
                  onClick={() => toggleReminder(rem.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    active ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    active ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

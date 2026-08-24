import React from 'react';
import { Heart, Globe, Clock, Calendar, Check } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Health Preferences</h3>
          <p className="text-xs text-slate-400">Language, measurement units, healthcare focus, and reminder sync</p>
        </div>
      </div>

      {/* HEALTHCARE TYPE & LANGUAGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
        <div>
          <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Preferred Healthcare Focus</label>
          <select
            value={preferences.healthcareType}
            onChange={(e) => {
              onUpdatePreferences({ ...preferences, healthcareType: e.target.value as any });
              onShowToast('✓ Healthcare type saved');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans focus:outline-none"
          >
            <option value="General Care">General Care</option>
            <option value="Specialist Care">Specialist Care</option>
            <option value="Preventive Care">Preventive Care</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">App Language</label>
          <select
            value={preferences.language}
            onChange={(e) => {
              onUpdatePreferences({ ...preferences, language: e.target.value as any });
              onShowToast(`Language preference saved to ${e.target.value}`);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Measurement Units</label>
          <div className="grid grid-cols-2 gap-2">
            {(['Metric', 'Imperial'] as const).map((u) => (
              <button
                key={u}
                onClick={() => {
                  onUpdatePreferences({ ...preferences, units: u });
                  onShowToast(`✓ Units set to ${u}`);
                }}
                className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center font-sans ${
                  preferences.units === u ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Time Format</label>
          <div className="grid grid-cols-2 gap-2">
            {(['12 Hour', '24 Hour'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  onUpdatePreferences({ ...preferences, timeFormat: tf });
                  onShowToast(`✓ Time format set to ${tf}`);
                }}
                className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center font-sans ${
                  preferences.timeFormat === tf ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HEALTH REMINDER CONNECTIONS */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Health Reminder Connections</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {[
            { key: 'remindersMedication' as const, label: 'Medication Reminders', desc: 'Syncs with Medicines module' },
            { key: 'remindersAppointment' as const, label: 'Appointment Reminders', desc: 'Syncs with Appointments module' },
            { key: 'remindersCheckUp' as const, label: 'Check-Up Reminders', desc: 'Syncs with Health Check-Up' },
            { key: 'remindersInsurance' as const, label: 'Insurance Expiry Alerts', desc: 'Syncs with Insurance module' }
          ].map((item) => {
            const active = preferences[item.key];
            return (
              <div key={item.key} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white font-sans text-xs">{item.label}</h5>
                  <p className="text-[10px] text-slate-400 font-sans">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleReminder(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    active ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'
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

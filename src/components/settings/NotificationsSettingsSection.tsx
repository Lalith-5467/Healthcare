import React from 'react';
import { Bell, Moon, Mail, MessageSquare, Smartphone, Check } from 'lucide-react';
import type { NotificationSettingsState } from './settingsData';

interface NotificationsSettingsSectionProps {
  settings: NotificationSettingsState;
  onUpdateSettings: (updated: NotificationSettingsState) => void;
}

export const NotificationsSettingsSection: React.FC<NotificationsSettingsSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const toggleKey = (key: keyof NotificationSettingsState) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Notification Preferences</h3>
          <p className="text-xs text-slate-400">Configure alert categories, delivery channels, and quiet hours</p>
        </div>
      </div>

      {/* CATEGORY TOGGLES */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Alert Categories</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {[
            { key: 'appointments' as const, label: 'Appointment Reminders', desc: 'Alerts before upcoming specialist visits' },
            { key: 'medications' as const, label: 'Medication Schedules', desc: 'Daily dosage alarms & refill warnings' },
            { key: 'checkUp' as const, label: 'Health Check-Ups', desc: 'Preventive checkup due date reminders' },
            { key: 'insurance' as const, label: 'Insurance & Claims', desc: 'Policy renewal & claim status updates' },
            { key: 'family' as const, label: 'Family Connect', desc: 'Updates from shared dependent accounts' },
            { key: 'emergency' as const, label: 'Emergency & SOS', desc: 'Critical responder & safety alerts' }
          ].map((cat) => {
            const active = settings[cat.key];
            return (
              <div key={cat.key} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white font-sans text-xs">{cat.label}</h5>
                  <p className="text-[10px] text-slate-400 font-sans">{cat.desc}</p>
                </div>
                <button
                  onClick={() => toggleKey(cat.key)}
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

      {/* CHANNELS */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Delivery Channels</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {[
            { key: 'channelInApp' as const, label: 'In-App Alerts' },
            { key: 'channelEmail' as const, label: 'Email Notices' },
            { key: 'channelSMS' as const, label: 'SMS Messages' },
            { key: 'channelPush' as const, label: 'Push Notifications' }
          ].map((ch) => {
            const active = settings[ch.key];
            return (
              <button
                key={ch.key}
                onClick={() => toggleKey(ch.key)}
                className={`p-3 rounded-2xl border font-bold text-left transition-all cursor-pointer ${
                  active ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <span>{ch.label}</span>
                <span className="block text-[10px] text-slate-400 mt-1">{active ? '✓ Enabled' : 'Disabled'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUIET HOURS */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Moon className="w-5 h-5 text-purple-400" />
            <div>
              <h4 className="font-extrabold text-white text-sm font-sans">Quiet Hours</h4>
              <p className="text-[10px] text-slate-400 font-sans">Mute non-emergency notifications during sleep hours</p>
            </div>
          </div>
          <button
            onClick={() => toggleKey('quietHoursEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.quietHoursEnabled ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'
            }`}
          >
            <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              settings.quietHoursEnabled ? 'right-1' : 'left-1'
            }`} />
          </button>
        </div>

        {settings.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Start Time</label>
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => onUpdateSettings({ ...settings, quietHoursStart: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase mb-1">End Time</label>
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => onUpdateSettings({ ...settings, quietHoursEnd: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

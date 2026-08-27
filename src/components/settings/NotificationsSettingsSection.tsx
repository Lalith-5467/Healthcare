import React from 'react';
import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import type { NotificationSettingsState } from './settingsData';

interface NotificationsSettingsSectionProps {
  settings: NotificationSettingsState;
  onUpdateSettings: (updated: NotificationSettingsState) => void;
}

export const NotificationsSettingsSection: React.FC<NotificationsSettingsSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  // Auto-convert existing 24h formats to AM/PM format for display
  React.useEffect(() => {
    let updated = false;
    let newStart = settings.quietHoursStart;
    let newEnd = settings.quietHoursEnd;

    if (newStart === '22:00') { newStart = '10:00 PM'; updated = true; }
    if (newEnd === '07:00') { newEnd = '07:00 AM'; updated = true; }

    if (updated) {
      onUpdateSettings({ ...settings, quietHoursStart: newStart, quietHoursEnd: newEnd });
    }
  }, [settings.quietHoursStart, settings.quietHoursEnd, settings, onUpdateSettings]);

  const toggleKey = (key: keyof NotificationSettingsState) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Notification Preferences</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Configure alert categories, delivery channels, and quiet hours</p>
        </div>
      </div>

      {/* CATEGORY TOGGLES */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">Alert Categories</h4>
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
              <div key={cat.key} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs">{cat.label}</h5>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">{cat.desc}</p>
                </div>
                <button
                  onClick={() => toggleKey(cat.key)}
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

      {/* DELIVERY CHANNELS */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">Delivery Channels</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          {[
            { key: 'channelEmail' as const, label: 'Email Notifications', icon: Mail },
            { key: 'channelSMS' as const, label: 'SMS Alerts', icon: MessageSquare },
            { key: 'channelPush' as const, label: 'App Push Alerts', icon: Smartphone }
          ].map((ch) => {
            const Icon = ch.icon;
            const active = settings[ch.key];
            return (
              <div key={ch.key} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-sans font-bold text-slate-900 dark:text-white text-xs">
                  <Icon className="w-4 h-4 text-[#00a896]" />
                  <span>{ch.label}</span>
                </div>
                <button
                  onClick={() => toggleKey(ch.key)}
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

      {/* QUIET HOURS */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-medium">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Quiet Hours (Do Not Disturb)</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Mute non-critical health notifications during sleep hours</p>
          </div>
          <button
            onClick={() => toggleKey('quietHoursEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.quietHoursEnabled ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
            }`}
          >
            <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              settings.quietHoursEnabled ? 'right-1' : 'left-1'
            }`} />
          </button>
        </div>

        {settings.quietHoursEnabled && (
          <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-bold font-sans">Start Time</label>
              <input
                type="text"
                value={settings.quietHoursStart}
                onChange={(e) => onUpdateSettings({ ...settings, quietHoursStart: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-bold font-sans">End Time</label>
              <input
                type="text"
                value={settings.quietHoursEnd}
                onChange={(e) => onUpdateSettings({ ...settings, quietHoursEnd: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

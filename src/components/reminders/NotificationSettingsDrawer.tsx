import React from 'react';
import { X, Settings, Moon, Volume2, Bell, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import type { NotificationSettingsState } from './remindersData';

interface NotificationSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettingsState;
  onUpdateSettings: (newSettings: NotificationSettingsState) => void;
  onShowToast: (msg: string) => void;
}

export const NotificationSettingsDrawer: React.FC<NotificationSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const toggleCategory = (key: keyof NotificationSettingsState) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
    onShowToast('Notification preferences updated');
  };

  const handleRequestBrowserPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        const updatedPermission = permission === 'granted' ? 'Granted' : permission === 'denied' ? 'Denied' : 'Default';
        onUpdateSettings({ ...settings, browserPermission: updatedPermission as any });
        if (permission === 'granted') {
          onShowToast('✓ Browser notifications enabled');
        } else {
          onShowToast('Browser notifications disabled');
        }
      });
    } else {
      onShowToast('Browser notifications simulation active');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Notification Settings</h3>
              <p className="text-xs text-slate-400">Configure notification alerts, quiet hours & sounds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          {/* BROWSER NOTIFICATION PERMISSION */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">Browser Notifications</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                settings.browserPermission === 'Granted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {settings.browserPermission}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Receive desktop push notifications when medication doses or appointments are due.
            </p>
            <button
              type="button"
              onClick={handleRequestBrowserPermission}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition-colors border border-slate-700 cursor-pointer"
            >
              Request Browser Permission
            </button>
          </div>

          {/* CATEGORY TOGGLES */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Notification Channels
            </label>

            {[
              { key: 'medicationReminders', label: 'Medication Reminders', desc: 'Pill schedules & refill alerts' },
              { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Doctor visit notifications' },
              { key: 'pharmacyUpdates', label: 'Pharmacy Updates', desc: 'Order tracking & delivery alerts' },
              { key: 'consultationAlerts', label: 'Consultation Alerts', desc: 'Video consultation room reminders' },
              { key: 'generalNotifications', label: 'General Health Alerts', desc: 'Vitals & wellness notifications' }
            ].map((ch) => {
              const active = (settings as any)[ch.key];
              return (
                <div key={ch.key} className="bg-slate-800/30 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white">{ch.label}</h4>
                    <p className="text-[10px] text-slate-400">{ch.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCategory(ch.key as any)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      active ? 'bg-[#00a896]' : 'bg-slate-800 border border-slate-700'
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

          {/* QUIET HOURS */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">Quiet Hours (Do Not Disturb)</span>
              </div>
              <button
                type="button"
                onClick={() => toggleCategory('quietHoursEnabled')}
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
              <p className="text-[11px] text-purple-300 bg-purple-500/10 border border-purple-500/20 p-2 rounded-xl">
                Notifications are muted between <strong>10:00 PM</strong> and <strong>07:00 AM</strong>.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

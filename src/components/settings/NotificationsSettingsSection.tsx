import React from 'react';
import { Mail, MessageSquare, Smartphone, Volume2 } from 'lucide-react';
import type { NotificationSettingsState } from './settingsData';
import { notificationVoiceService } from '../../services/notificationVoiceService';

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

      {/* VOICE ANNOUNCEMENTS SETTINGS */}
      <VoiceSettingsControl />
    </div>
  );
};

const VoiceSettingsControl: React.FC = () => {
  const [voiceState, setVoiceState] = React.useState(() => notificationVoiceService.getSettings());
  const [voiceStatus, setVoiceStatus] = React.useState(() => notificationVoiceService.getVoiceStatus());

  React.useEffect(() => {
    const handleSettingsSync = (e: any) => {
      if (e?.detail) {
        setVoiceState(e.detail);
      } else {
        setVoiceState(notificationVoiceService.getSettings());
      }
      setVoiceStatus(notificationVoiceService.getVoiceStatus());
    };

    const handleLangSync = (e: any) => {
      const newLang = e?.detail?.language;
      if (newLang === 'en' || newLang === 'ta') {
        setVoiceState(prev => ({ ...prev, language: newLang }));
      }
      setVoiceStatus(notificationVoiceService.getVoiceStatus());
    };

    window.addEventListener('medicare_voice_settings_changed', handleSettingsSync);
    window.addEventListener('medicare_language_changed', handleLangSync);

    return () => {
      window.removeEventListener('medicare_voice_settings_changed', handleSettingsSync);
      window.removeEventListener('medicare_language_changed', handleLangSync);
    };
  }, []);

  const handleToggleVoice = () => {
    const updated = !voiceState.enabled;
    const newSettings = { ...voiceState, enabled: updated };
    setVoiceState(newSettings);
    notificationVoiceService.saveSettings({ enabled: updated });
  };

  const handleChangeLanguage = (lang: 'en' | 'ta') => {
    const newSettings = { ...voiceState, language: lang };
    setVoiceState(newSettings);
    notificationVoiceService.setLanguage(lang, true);
    setVoiceStatus(notificationVoiceService.getVoiceStatus());
  };

  const handleChangeRate = (rate: number) => {
    const newSettings = { ...voiceState, rate };
    setVoiceState(newSettings);
    notificationVoiceService.saveSettings({ rate });
  };

  const handleTestVoice = () => {
    if (voiceState.language === 'ta') {
      notificationVoiceService.speakNotification('வணக்கம்! இது உங்கள் மருத்துவ குரல் அறிவிப்பு சோதனை.', 'ta');
    } else {
      notificationVoiceService.speakNotification('Hello! This is a test voice notification for MediCare.', 'en');
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-slate-950 dark:to-cyan-950/20 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Voice Announcements</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Read incoming appointments, vitals & booking alerts aloud</p>
          </div>
        </div>
        <button
          onClick={handleToggleVoice}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            voiceState.enabled ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
            voiceState.enabled ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>

      {voiceState.enabled && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">Voice Language</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleChangeLanguage('en')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center font-bold text-xs transition ${
                    voiceState.language === 'en'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeLanguage('ta')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center font-bold text-xs transition ${
                    voiceState.language === 'ta'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">Speech Speed</label>
              <div className="flex gap-1">
                {[
                  { label: '0.8x', val: 0.8 },
                  { label: '1.0x', val: 1.0 },
                  { label: '1.2x', val: 1.2 }
                ].map(r => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => handleChangeRate(r.val)}
                    className={`flex-1 py-1.5 rounded-xl text-center font-bold text-xs transition ${
                      voiceState.rate === r.val
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTestVoice}
                className="w-full py-2 px-3 bg-slate-900 dark:bg-slate-800 text-teal-400 font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice ({voiceState.language === 'ta' ? 'தமிழ்' : 'EN'})</span>
              </button>
            </div>
          </div>

          {/* Helpful device voice engine status hint */}
          {voiceState.language === 'ta' && (
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-800 dark:text-teal-300 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold">Tamil Voice Status: </span>
                {voiceStatus.tamilSupported ? (
                  <span>Native device voice detected ({voiceStatus.tamilVoiceName}).</span>
                ) : (
                  <span>High-fidelity online audio stream ready. For offline Tamil voice synthesis, install Tamil in Windows Settings &gt; Time &amp; Language &gt; Speech &gt; Add voices.</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

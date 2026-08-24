import React, { useState } from 'react';
import { Lock, Eye, ShieldAlert, Users, QrCode } from 'lucide-react';

interface PrivacyControlsCardProps {
  onToast: (msg: string) => void;
}

export const PrivacyControlsCard: React.FC<PrivacyControlsCardProps> = ({ onToast }) => {
  const [toggles, setToggles] = useState({
    profileVisibility: true,
    emergencyAccess: true,
    familyAccess: false,
    qrSharing: false
  });

  const handleToggle = (key: keyof typeof toggles, label: string) => {
    const nextState = !toggles[key];
    const updated = { ...toggles, [key]: nextState };
    setToggles(updated);
    localStorage.setItem('health_privacy_settings', JSON.stringify(updated));
    onToast(`Privacy setting "${label}" turned ${nextState ? 'ON' : 'OFF'}`);
  };

  const privacyItems = [
    { key: 'profileVisibility' as const, label: 'Health Profile Visibility', desc: 'Allow ABDM verified doctors to search profile', icon: Eye },
    { key: 'emergencyAccess' as const, label: 'Emergency SOS Access', desc: 'Allow first responders to scan emergency QR', icon: ShieldAlert },
    { key: 'familyAccess' as const, label: 'Family Health Access', desc: 'Share vitals with linked family members', icon: Users },
    { key: 'qrSharing' as const, label: 'QR Health Sharing', desc: 'Enable instant QR record transmission', icon: QrCode }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Health Data Privacy & Consent Controls
            </h3>
            <span className="text-[11px] text-slate-400">ABDM Consent Engine Architecture</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {privacyItems.map((item) => {
          const Icon = item.icon;
          const isOn = toggles[item.key];
          return (
            <div
              key={item.key}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* ELEGANT TOGGLE SWITCH */}
              <button
                onClick={() => handleToggle(item.key, item.label)}
                aria-label={`Toggle ${item.label}`}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  isOn ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    isOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

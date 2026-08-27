import React from 'react';
import type { PrivacySettingsState } from './settingsData';

interface PrivacySettingsSectionProps {
  privacy: PrivacySettingsState;
  onUpdatePrivacy: (updated: PrivacySettingsState) => void;
  onShowToast: (msg: string) => void;
}

export const PrivacySettingsSection: React.FC<PrivacySettingsSectionProps> = ({
  privacy,
  onUpdatePrivacy,
  onShowToast,
}) => {
  const toggleKey = (key: keyof PrivacySettingsState) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    onUpdatePrivacy(updated);
    onShowToast(`✓ Updated ${String(key)} setting`);
  };

  const handleLocationToggle = () => {
    if (!privacy.locationAccess && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onUpdatePrivacy({ ...privacy, locationAccess: true });
          onShowToast('✓ Location access granted');
        },
        () => {
          onShowToast('⚠️ Location permission denied by browser');
        }
      );
    } else {
      onUpdatePrivacy({ ...privacy, locationAccess: !privacy.locationAccess });
      onShowToast('✓ Location access updated');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Privacy Controls</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Manage data sharing permissions, profile visibility, and location access</p>
        </div>
      </div>

      {/* PROFILE VISIBILITY */}
      <div className="space-y-2 font-mono">
        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider font-sans">Profile Visibility</label>
        <div className="grid grid-cols-3 gap-2 font-sans">
          {(['Private', 'Family Only', 'Public'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                onUpdatePrivacy({ ...privacy, profileVisibility: v });
                onShowToast(`✓ Profile visibility set to ${v}`);
              }}
              className={`py-2.5 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                privacy.profileVisibility === v
                  ? 'bg-[#00a896] text-white border-[#00a896] shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* LOCATION ACCESS TOGGLE */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 font-medium">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Location Access</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Allows emergency services to locate you during SOS alerts</p>
        </div>

        <button
          onClick={handleLocationToggle}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            privacy.locationAccess ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
            privacy.locationAccess ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>

      {/* PERMISSION TOGGLES */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">Data Sharing Permissions</h4>
        <div className="space-y-2">
          {[
            { key: 'healthDataSharing' as const, title: 'Share Health Records with Primary Doctor', desc: 'Allow assigned physicians to view your medical timeline' },
            { key: 'familyDataSharing' as const, title: 'Share Emergency Info with Family', desc: 'Give family access to allergies & emergency medical ID' },
            { key: 'activityTracking' as const, title: 'Anonymous Health Research Data', desc: 'Help improve healthcare insights with anonymized data' },
            { key: 'personalizedExperience' as const, title: 'App Performance Analytics', desc: 'Share anonymous app usage telemetry to fix bugs' }
          ].map((perm) => {
            const active = privacy[perm.key];
            return (
              <div key={perm.key} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs">{perm.title}</h5>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">{perm.desc}</p>
                </div>
                <button
                  onClick={() => toggleKey(perm.key)}
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

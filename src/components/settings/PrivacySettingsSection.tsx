import React from 'react';
import { Eye, Shield, MapPin, Check } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Privacy Controls</h3>
          <p className="text-xs text-slate-400">Manage data sharing permissions, profile visibility, and location access</p>
        </div>
      </div>

      {/* PROFILE VISIBILITY */}
      <div className="space-y-2 font-mono">
        <label className="block text-slate-300 font-bold uppercase tracking-wider font-sans">Profile Visibility</label>
        <div className="grid grid-cols-3 gap-2">
          {(['Private', 'Family Only', 'Public'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                onUpdatePrivacy({ ...privacy, profileVisibility: v });
                onShowToast(`✓ Profile visibility set to ${v}`);
              }}
              className={`py-2.5 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                privacy.profileVisibility === v
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* LOCATION PRIVACY CARD */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <h4 className="font-extrabold text-white text-sm font-sans">Location Access</h4>
            <p className="text-[11px] text-slate-400 font-sans">Used exclusively for Nearby Hospital & SOS location preview</p>
          </div>
        </div>

        <button
          onClick={handleLocationToggle}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            privacy.locationAccess ? 'bg-cyan-500' : 'bg-slate-800 border border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
            privacy.locationAccess ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>

      {/* TOGGLES GRID */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Data Sharing Toggles</h4>
        <div className="space-y-2 font-mono text-[11px]">
          {[
            { key: 'familyDataSharing' as const, label: 'Family Connect Sharing', desc: 'Allow connected family members to view emergency info & appointments' },
            { key: 'activityTracking' as const, label: 'Health Activity Logs', desc: 'Save local interaction logs for health checkup insights' },
            { key: 'personalizedExperience' as const, label: 'Personalized Healthcare Recommendations', desc: 'Tailor checkup checklists & doctor recommendations' }
          ].map((item) => {
            const active = privacy[item.key];
            return (
              <div key={item.key} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white font-sans text-xs">{item.label}</h5>
                  <p className="text-[10px] text-slate-400 font-sans">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleKey(item.key)}
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

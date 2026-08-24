import React, { useState } from 'react';
import { X, Settings, Check } from 'lucide-react';
import type { EmergencyPreferencesState } from './emergencyData';

interface EmergencyPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: EmergencyPreferencesState;
  onSavePreferences: (updated: EmergencyPreferencesState) => void;
}

export const EmergencyPreferencesModal: React.FC<EmergencyPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [countdownSeconds, setCountdownSeconds] = useState(preferences.countdownSeconds);
  const [locationSharing, setLocationSharing] = useState(preferences.locationSharing);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences({
      ...preferences,
      countdownSeconds,
      locationSharing
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Emergency Preferences</h3>
              <p className="text-xs text-slate-400 font-mono">SOS countdown timer & safety controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS */}
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">SOS Countdown Timer</label>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {[3, 5, 10].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setCountdownSeconds(sec)}
                  className={`py-2.5 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                    countdownSeconds === sec
                      ? 'bg-[#00a896] text-white border-teal-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {sec} Seconds
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Location Preview Sharing</span>
              <span className="text-[11px] text-slate-400 opacity-80 block">Include detected location in alert state</span>
            </div>

            <button
              type="button"
              onClick={() => setLocationSharing(!locationSharing)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                locationSharing ? 'bg-[#00a896]' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                locationSharing ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex justify-between gap-3 font-extrabold">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

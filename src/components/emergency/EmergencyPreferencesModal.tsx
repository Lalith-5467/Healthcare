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
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency Preferences</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">SOS countdown timer & safety controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS */}
        <div className="space-y-4 font-medium">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-2 font-mono text-[11px]">SOS Countdown Timer</label>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {[3, 5, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setCountdownSeconds(sec)}
                  className={`py-2.5 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer text-center font-sans ${
                    countdownSeconds === sec
                      ? 'bg-[#00a896] text-white border-teal-300 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {sec} Seconds
                </button>
              ))}
            </div>
          </div>

          {/* LOCATION SHARING */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-medium">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Share Live Location on SOS</h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">Sends GPS coordinates to emergency contacts</p>
            </div>
            <button
              onClick={() => setLocationSharing(!locationSharing)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                locationSharing ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                locationSharing ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 font-sans">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

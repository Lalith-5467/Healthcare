import React, { useState } from 'react';
import { X, Settings, Camera, Mic, Volume2, Check } from 'lucide-react';

interface DeviceSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSettingsDrawer: React.FC<DeviceSettingsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCamera, setSelectedCamera] = useState('Integrated HD Web Camera');
  const [selectedMic, setSelectedMic] = useState('Default Microphone Array (Realtek High Definition Audio)');
  const [selectedSpeaker, setSelectedSpeaker] = useState('Default Speakers (Realtek Audio)');

  if (!isOpen) return null;

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 p-4">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00a896]/10 border border-[#00a896]/20 flex items-center justify-center text-[#00a896] dark:text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Audio & Video Settings</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Configure your camera, mic & speaker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 py-5 flex-1 overflow-y-auto text-xs">
          {/* CAMERA */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Camera Device</span>
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] transition-all cursor-pointer"
            >
              <option value="Integrated HD Web Camera">Integrated HD Web Camera (720p)</option>
              <option value="External USB Cam">External USB 1080p Webcam</option>
              <option value="Virtual Studio Camera">Virtual Studio Camera</option>
            </select>
          </div>

          {/* MICROPHONE */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <span>Microphone Device</span>
            </label>
            <select
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] transition-all cursor-pointer"
            >
              <option value="Default Microphone Array (Realtek High Definition Audio)">Default Microphone Array (Realtek Audio)</option>
              <option value="USB Noise Cancelling Mic">USB Noise Cancelling Mic</option>
              <option value="Bluetooth Headset Microphone">Bluetooth Headset Microphone</option>
            </select>
          </div>

          {/* SPEAKER */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Speaker Device</span>
            </label>
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] transition-all cursor-pointer"
            >
              <option value="Default Speakers (Realtek Audio)">Default Speakers (Realtek Audio)</option>
              <option value="External Headphones">External Headphones / Earphones</option>
              <option value="Bluetooth Audio Receiver">Bluetooth Audio Receiver</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <button
            onClick={handleSave}
            className="w-full py-3 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Save Device Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Audio & Video Settings</h3>
              <p className="text-xs text-slate-400">Configure your camera, mic & speaker hardware</p>
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
          {/* CAMERA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Camera Device</span>
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="Integrated HD Web Camera">Integrated HD Web Camera (720p)</option>
              <option value="External USB Cam">External USB 1080p Webcam</option>
              <option value="Virtual Studio Camera">Virtual Studio Camera</option>
            </select>
          </div>

          {/* MICROPHONE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-teal-400" />
              <span>Microphone Device</span>
            </label>
            <select
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-teal-500"
            >
              <option value="Default Microphone Array (Realtek High Definition Audio)">Default Microphone Array (Realtek Audio)</option>
              <option value="USB Noise Cancelling Mic">USB Noise Cancelling Mic</option>
              <option value="Bluetooth Headset Microphone">Bluetooth Headset Microphone</option>
            </select>
          </div>

          {/* SPEAKER */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Speaker Device</span>
            </label>
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="Default Speakers (Realtek Audio)">Default Speakers (Realtek Audio)</option>
              <option value="External Headphones">External Headphones / Earphones</option>
              <option value="Bluetooth Audio Receiver">Bluetooth Audio Receiver</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="w-full py-3 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Device Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

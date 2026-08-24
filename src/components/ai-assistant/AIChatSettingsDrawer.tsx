import React from 'react';
import { X, Settings, Download } from 'lucide-react';
import type { AIAssistantSettingsState } from './aiAssistantData';

interface AIChatSettingsDrawerProps {
  settings: AIAssistantSettingsState;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: AIAssistantSettingsState) => void;
  onExportChat: (format: 'txt' | 'json' | 'pdf') => void;
  onClearAIData: () => void;
}

export const AIChatSettingsDrawer: React.FC<AIChatSettingsDrawerProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
  onExportChat,
  onClearAIData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-xs font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">AI Assistant Settings</h3>
              <p className="text-xs text-slate-400 font-mono">Response style, export, and privacy</p>
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
        <div className="space-y-6 py-4 flex-1 overflow-y-auto">
          {/* RESPONSE STYLE */}
          <div className="space-y-2 font-mono">
            <label className="block font-bold uppercase text-slate-400">AI Response Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Simple', 'Detailed', 'Professional'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateSettings({ ...settings, responseStyle: st })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center font-sans ${
                    settings.responseStyle === st ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE */}
          <div className="space-y-2 font-mono">
            <label className="block font-bold uppercase text-slate-400">AI Assistant Language</label>
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ ...settings, language: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>

          {/* EXPORT CONVERSATION */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono">
            <h4 className="font-extrabold text-white text-xs font-sans">Export Conversation Log</h4>
            <div className="flex gap-2">
              <button
                onClick={() => onExportChat('txt')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 cursor-pointer flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export TXT</span>
              </button>
              <button
                onClick={() => onExportChat('json')}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer flex items-center justify-center gap-1 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* CLEAR AI DATA */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 space-y-2 font-mono">
            <h4 className="font-extrabold text-rose-400 text-xs font-sans">Clear AI Assistant Cache</h4>
            <p className="text-[10px] text-slate-400 font-sans">Purge local chat history and saved AI notes</p>
            <button
              onClick={() => {
                onClearAIData();
                onClose();
              }}
              className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold cursor-pointer"
            >
              Clear AI Data
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer text-center"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

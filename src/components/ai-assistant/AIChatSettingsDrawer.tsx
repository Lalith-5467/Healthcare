import React from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Download, Trash2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-8 text-xs font-sans text-slate-900 dark:text-white"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AI Assistant Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Response style, export, and privacy controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-5 flex-1 overflow-y-auto pr-1">
          {/* RESPONSE STYLE */}
          <div className="space-y-2 font-mono">
            <label className="block font-extrabold uppercase text-slate-500 dark:text-slate-400">AI Response Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Simple', 'Detailed', 'Professional'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateSettings({ ...settings, responseStyle: st })}
                  className={`py-2.5 px-3 rounded-2xl font-bold border transition-colors cursor-pointer text-center font-sans ${
                    settings.responseStyle === st
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE */}
          <div className="space-y-2 font-mono">
            <label className="block font-extrabold uppercase text-slate-500 dark:text-slate-400">AI Assistant Language</label>
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ ...settings, language: e.target.value as any })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-sans font-bold focus:outline-none focus:border-[#00a896]"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>

          {/* EXPORT CONVERSATION */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-sans">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Export Conversation Log</h4>
            <div className="flex gap-2">
              <button
                onClick={() => onExportChat('txt')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-cyan-300 font-extrabold border border-slate-300 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export TXT</span>
              </button>
              <button
                onClick={() => onExportChat('json')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* CLEAR AI DATA */}
          <div className="p-4 bg-rose-50 dark:bg-slate-950 rounded-2xl border border-rose-200 dark:border-rose-500/30 space-y-2 font-sans">
            <h4 className="font-extrabold text-rose-700 dark:text-rose-400 text-xs flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              <span>Clear AI Assistant Cache</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Purge local chat history and saved AI health notes</p>
            <button
              onClick={() => {
                onClearAIData();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold cursor-pointer transition-colors shadow-sm"
            >
              Clear AI Data
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold cursor-pointer text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700"
          >
            Close Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

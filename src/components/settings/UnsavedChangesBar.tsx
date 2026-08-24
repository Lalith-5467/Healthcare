import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface UnsavedChangesBarProps {
  hasUnsaved: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const UnsavedChangesBar: React.FC<UnsavedChangesBarProps> = ({
  hasUnsaved,
  onSave,
  onDiscard,
}) => {
  if (!hasUnsaved) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border-2 border-purple-500/60 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-xs font-mono animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="font-sans font-bold">Unsaved Changes</span>
      </div>

      <div className="flex items-center gap-2 font-sans font-extrabold">
        <button
          onClick={onDiscard}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          Discard
        </button>

        <button
          onClick={onSave}
          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 transition-colors cursor-pointer shadow"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

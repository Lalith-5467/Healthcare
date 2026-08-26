import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onDiscard: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  onContinue,
  onDiscard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl text-slate-900 dark:text-white">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Leave this scan?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
            Your current document preview and unsaved information will be discarded.
          </p>
        </div>

        <div className="space-y-3 pt-2 font-sans font-extrabold">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 rounded-xl text-white bg-[#00a896] hover:bg-[#00897b] transition-colors shadow-md cursor-pointer text-sm"
          >
            Continue Scanning
          </button>
          <button
            onClick={onDiscard}
            className="w-full py-2.5 px-4 rounded-xl text-rose-700 dark:text-rose-400 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-colors cursor-pointer text-sm"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

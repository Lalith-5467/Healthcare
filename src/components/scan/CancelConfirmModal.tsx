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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Leave this scan?</h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Your current document preview and unsaved information will be discarded.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#00a896] hover:bg-teal-600 transition-colors shadow-lg cursor-pointer text-sm"
          >
            Continue Scanning
          </button>
          <button
            onClick={onDiscard}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer text-sm"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

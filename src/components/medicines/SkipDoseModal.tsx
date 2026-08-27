import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { DoseRecord } from './medicinesData';

interface SkipDoseModalProps {
  isOpen: boolean;
  dose: DoseRecord | null;
  onClose: () => void;
  onConfirmSkip: (doseId: string, reason?: string) => void;
}

export const SkipDoseModal: React.FC<SkipDoseModalProps> = ({
  isOpen,
  dose,
  onClose,
  onConfirmSkip,
}) => {
  if (!isOpen || !dose) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl text-slate-900 dark:text-white">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Mark dose as skipped?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
            Dose: <strong className="text-slate-900 dark:text-white">{dose.medicineName}</strong> scheduled at {dose.scheduledTime}.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onConfirmSkip(dose.id);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-colors text-xs cursor-pointer"
          >
            ✓ Mark as Skipped
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            Keep Dose
          </button>
        </div>
      </div>
    </div>
  );
};

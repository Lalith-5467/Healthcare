import React from 'react';
import { MapPin, Users, X, ChevronRight } from 'lucide-react';
import type { EmergencyContactItem } from './emergencyData';

interface SOSConfirmationModalProps {
  isOpen: boolean;
  contacts: EmergencyContactItem[];
  locationName: string;
  onClose: () => void;
  onConfirmContinue: () => void;
}

export const SOSConfirmationModal: React.FC<SOSConfirmationModalProps> = ({
  isOpen,
  contacts,
  locationName,
  onClose,
  onConfirmContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-400 dark:border-rose-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-extrabold text-lg">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Activate Emergency SOS?</h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold font-mono">Deliberate Safety Step</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          This will simulate an emergency alert and display your emergency response options. No real emergency dispatch will occur during this demo simulation.
        </p>

        {/* PREVIEW DETAILS */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold font-sans">Location Preview</span>
              <strong className="text-slate-900 dark:text-white text-xs">{locationName}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-2">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold font-sans">Notified Contacts</span>
              <strong className="text-slate-900 dark:text-white text-xs">{contacts.length} Emergency Contacts Configured</strong>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex items-center justify-between gap-3 font-extrabold font-sans">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmContinue}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Proceed to Countdown</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

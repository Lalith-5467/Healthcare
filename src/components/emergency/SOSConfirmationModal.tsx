import React from 'react';
import { AlertTriangle, MapPin, Users, X, ShieldAlert, ChevronRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-extrabold text-lg">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Activate Emergency SOS?</h3>
              <p className="text-xs text-rose-400 font-semibold font-mono">Deliberate Safety Step</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-300 leading-relaxed">
          This will simulate an emergency alert and display your emergency response options. No real emergency dispatch will occur during this demo simulation.
        </p>

        {/* PREVIEW DETAILS */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Location Preview</span>
              <strong className="text-white text-xs">{locationName}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300 border-t border-slate-800 pt-2">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Contacts to Notify</span>
              <strong className="text-purple-300 text-xs">{contacts.length} Emergency Contacts Selected</strong>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmContinue}
            className="flex-1 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to SOS (5s Countdown)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

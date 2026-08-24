import React from 'react';
import { X, Phone, AlertCircle, Check } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalCallModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalCallModal: React.FC<HospitalCallModalProps> = ({
  hospital,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !hospital) return null;

  const handleDial = () => {
    window.location.href = `tel:${hospital.phone.replace(/\s+/g, '')}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Call Hospital</h3>
              <p className="text-xs text-slate-400">Contact {hospital.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PHONE DETAILS HERO */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Reception Desk / Emergency Line
          </span>
          <h4 className="text-xl font-extrabold text-emerald-400 font-mono">{hospital.phone}</h4>
          <p className="text-[11px] text-slate-300">{hospital.openingHours}</p>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDial}
            className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Initiate Call Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Phone } from 'lucide-react';
import type { EmergencyServiceItem } from './emergencyData';

interface CallConfirmationModalProps {
  service: EmergencyServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCall: (serviceName: string, phone: string) => void;
}

export const CallConfirmationModal: React.FC<CallConfirmationModalProps> = ({
  service,
  isOpen,
  onClose,
  onConfirmCall,
}) => {
  if (!isOpen || !service) return null;

  const handleDial = () => {
    onConfirmCall(service.serviceName, service.phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Call Emergency Service?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{service.serviceName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HERO DETAILS */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 font-mono">Service Phone Helpline</span>
          <h4 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">{service.phone}</h4>
          <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">{service.description}</p>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-[11px] text-center font-mono font-medium">
          ℹ Demo Simulation — Confirming will log a demo call event.
        </p>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-extrabold font-sans">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDial}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Confirm Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface CancelConfirmModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmCancel: (aptId: string, reason: string) => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('Schedule conflict');

  if (!isOpen || !appointment) return null;

  const reasons = [
    'Schedule conflict',
    'Feeling better, symptom resolved',
    'Booked elsewhere',
    'Other personal reason'
  ];

  const handleConfirm = () => {
    onConfirmCancel(appointment.id, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900 dark:text-white relative">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Cancel Appointment?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Are you sure you want to cancel your consultation with{' '}
            <strong className="text-slate-900 dark:text-white">{appointment.doctorName}</strong> on {appointment.date}?
          </p>
        </div>

        {/* CANCELLATION REASON SELECTOR */}
        <div className="space-y-2 pt-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Reason for Cancellation
          </label>
          <div className="space-y-1.5">
            {reasons.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  reason === r
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-200'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-rose-600"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

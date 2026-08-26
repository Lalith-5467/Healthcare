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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Cancel Appointment?</h3>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Are you sure you want to cancel your consultation with{' '}
            <strong className="text-white">{appointment.doctorName}</strong> on {appointment.date}?
          </p>
        </div>

        {/* CANCELLATION REASON SELECTOR */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Reason for Cancellation
          </label>
          <div className="space-y-1.5">
            {reasons.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  reason === r
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-rose-500"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors text-sm cursor-pointer"
          >
            Keep Appointment
          </button>

          <button
            onClick={handleConfirm}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors text-sm cursor-pointer"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

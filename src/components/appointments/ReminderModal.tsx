import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface ReminderModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (aptId: string, offset: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSave,
}) => {
  const [selectedOffset, setSelectedOffset] = useState('15 minutes before');

  if (!isOpen || !appointment) return null;

  const options = [
    '15 minutes before',
    '30 minutes before',
    '1 hour before',
    '1 day before'
  ];

  const handleSave = () => {
    onSave(appointment.id, selectedOffset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-900 dark:text-white relative">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Appointment Reminder</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Set alert notification before your appointment with <strong className="text-slate-900 dark:text-white">{appointment.doctorName}</strong>:
        </p>

        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelectedOffset(opt)}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left flex items-center justify-between ${
                selectedOffset === opt
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{opt}</span>
              {selectedOffset === opt && <Check className="w-4 h-4 text-amber-500" />}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-2 font-sans">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Save Alert
          </button>
        </div>
      </div>
    </div>
  );
};

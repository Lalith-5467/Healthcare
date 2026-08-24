import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface ReminderModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSetReminder: (aptId: string, offset: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSetReminder,
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
    onSetReminder(appointment.id, selectedOffset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">Add Appointment Reminder</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Set alert notification before your appointment with <strong className="text-white">{appointment.doctorName}</strong>:
        </p>

        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelectedOffset(opt)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left flex items-center justify-between ${
                selectedOffset === opt
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span>{opt}</span>
              {selectedOffset === opt && <Check className="w-4 h-4 text-amber-400" />}
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Set Reminder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

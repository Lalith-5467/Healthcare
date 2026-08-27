import React from 'react';
import { Clock } from 'lucide-react';
import type { ReminderItem } from './remindersData';

interface SnoozeModalProps {
  isOpen: boolean;
  reminder: ReminderItem | null;
  onClose: () => void;
  onConfirmSnooze: (reminderId: string, durationMinutes: number) => void;
}

export const SnoozeModal: React.FC<SnoozeModalProps> = ({
  isOpen,
  reminder,
  onClose,
  onConfirmSnooze,
}) => {
  if (!isOpen || !reminder) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl text-slate-900 dark:text-white">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-400 mx-auto">
          <Clock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Snooze Reminder</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            Select snooze duration for <strong className="text-slate-900 dark:text-white">{reminder.title}</strong>:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
          {[
            { label: '10 Minutes', mins: 10 },
            { label: '30 Minutes', mins: 30 },
            { label: '1 Hour', mins: 60 },
            { label: 'Tomorrow', mins: 1440 }
          ].map((opt) => (
            <button
              key={opt.mins}
              onClick={() => {
                onConfirmSnooze(reminder.id, opt.mins);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-teal-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Pill, Clock, Calendar, User, Building2, Bell, Edit, PauseCircle, PlayCircle, ShieldAlert, FileText } from 'lucide-react';
import type { MedicineItem } from './medicinesData';

interface MedicineDetailsDrawerProps {
  medicine: MedicineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (med: MedicineItem) => void;
  onTogglePause: (medId: string) => void;
  onToggleReminder: (medId: string) => void;
}

export const MedicineDetailsDrawer: React.FC<MedicineDetailsDrawerProps> = ({
  medicine,
  isOpen,
  onClose,
  onEdit,
  onTogglePause,
  onToggleReminder,
}) => {
  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                ID: {medicine.id}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{medicine.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs font-medium">
          {/* DOSAGE BANNER */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dosage & Frequency</span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {medicine.dosage} {medicine.unit}
              </h4>
              <p className="text-xs font-semibold text-[#00a896] dark:text-cyan-400 mt-0.5">{medicine.frequency} ({medicine.route})</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              medicine.status === 'Active'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}>
              {medicine.status}
            </span>
          </div>

          {/* SCHEDULE TIMINGS */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Scheduled Intake Timings</span>
            <div className="flex flex-wrap gap-2">
              {medicine.timings.map((time, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-mono font-bold"
                >
                  <Clock className="w-3.5 h-3.5 text-[#00a896]" />
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/20 text-teal-800 dark:text-teal-200 text-xs">
            <span className="font-bold block mb-0.5">Instructions:</span>
            <span>{medicine.instructions} • {medicine.mealRelation}</span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 flex gap-2">
          <button
            onClick={() => onToggleReminder(medicine.id)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>{medicine.reminderActive ? 'Reminder ON' : 'Turn ON Reminder'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit(medicine);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Medicine</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                ID: {medicine.id}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{medicine.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto">
          {/* DOSAGE BANNER */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dosage & Frequency</span>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {medicine.dosage} {medicine.unit}
              </h4>
              <p className="text-xs font-semibold text-[#00a896] dark:text-cyan-400 mt-0.5">{medicine.frequency} ({medicine.route})</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              medicine.status === 'Active'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : medicine.status === 'Completed'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}>
              {medicine.status}
            </span>
          </div>

          {/* SCHEDULE TIMES */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">Dose Timings</h4>
            <div className="flex flex-wrap gap-2">
              {medicine.times.map((t, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Food & Usage Instructions</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {medicine.foodInstruction}: {medicine.instructions}
            </p>
          </div>

          {/* DOCTOR DETAILS */}
          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#00a896] dark:text-cyan-400" /> Prescribed By:
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{medicine.prescribedBy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400" /> Hospital/Clinic:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-300">{medicine.hospital}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#00a896] dark:text-cyan-400" /> Prescription Ref:
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-300">{medicine.prescriptionNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00a896] dark:text-cyan-400" /> Course Duration:
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-300">{medicine.startDate} — {medicine.endDate}</span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTogglePause(medicine.id)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              {medicine.status === 'Paused' ? (
                <>
                  <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Resume Medicine</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Pause Schedule</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleReminder(medicine.id)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <Bell className={`w-4 h-4 ${medicine.reminderEnabled ? 'text-amber-500 fill-amber-500/20' : 'text-slate-400'}`} />
              <span>{medicine.reminderEnabled ? 'Reminder On' : 'Reminder Off'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onEdit(medicine);
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Prescription Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

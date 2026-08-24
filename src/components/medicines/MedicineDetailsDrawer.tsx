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
  onNavigateRecords: () => void;
}

export const MedicineDetailsDrawer: React.FC<MedicineDetailsDrawerProps> = ({
  medicine,
  isOpen,
  onClose,
  onEdit,
  onTogglePause,
  onToggleReminder,
  onNavigateRecords,
}) => {
  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                ID: {medicine.id}
              </span>
              <h3 className="text-lg font-extrabold text-white">{medicine.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto">
          {/* DOSAGE BANNER */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dosage & Frequency</span>
              <h4 className="text-lg font-extrabold text-white mt-0.5">
                {medicine.dosage} {medicine.unit}
              </h4>
              <p className="text-xs font-semibold text-[#00a896] mt-0.5">{medicine.frequency} ({medicine.route})</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              medicine.status === 'Active'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : medicine.status === 'Completed'
                ? 'bg-slate-800 text-slate-400'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {medicine.status}
            </span>
          </div>

          {/* DOSE SCHEDULE TIMES */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily Dose Times</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {medicine.times.map((t, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs font-bold"
                >
                  Dose #{idx + 1}: {t}
                </div>
              ))}
            </div>
          </div>

          {/* DATES & PRESCRIBER GRID */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Duration:
              </span>
              <span className="font-semibold text-white">{medicine.startDate} — {medicine.endDate}</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" /> Prescribed By:
              </span>
              <span className="font-bold text-teal-400">{medicine.prescribedBy}</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
              <span className="text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" /> Hospital / Clinic:
              </span>
              <span className="font-semibold text-slate-200">{medicine.hospital}</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
              <span className="text-slate-400">Stock Remaining:</span>
              <span className={`font-mono font-bold ${medicine.stockRemaining < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {medicine.stockRemaining} / {medicine.totalStock} {medicine.unit}s
              </span>
            </div>
          </div>

          {/* PURPOSE & INSTRUCTIONS */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Medical Purpose</h4>
              <p className="text-xs text-slate-300 bg-slate-800/30 border border-slate-800/60 p-3 rounded-xl">
                {medicine.purpose}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Special Instructions</h4>
              <div className="bg-slate-800/30 border border-slate-800/60 p-3 rounded-xl space-y-1.5">
                <p className="text-xs text-slate-300">{medicine.instructions}</p>
                {medicine.foodInstruction && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-cyan-300 border border-teal-500/30">
                    {medicine.foodInstruction}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SAFETY DISCLAIMER */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Prescription Safety Note:</strong> Always adhere strictly to the dosage and timing prescribed by your physician. Do not alter doses without clinical guidance.
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(medicine);
              }}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onTogglePause(medicine.id)}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {medicine.status === 'Paused' ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleReminder(medicine.id)}
              className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                medicine.reminderEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{medicine.reminderEnabled ? 'Reminder ON' : 'Reminder OFF'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateRecords();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/60"
          >
            <FileText className="w-4 h-4" />
            <span>View Related Medical Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};

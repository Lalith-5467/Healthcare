import React from 'react';
import { Pill, ArrowRight } from 'lucide-react';

interface CurrentMedicinesSectionProps {
  onNavigate: (id: string) => void;
}

export const CurrentMedicinesSection: React.FC<CurrentMedicinesSectionProps> = ({ onNavigate }) => {
  const meds = [
    { id: 1, name: 'Medicine A (Amoxicillin)', dosage: '500 mg', freq: 'Twice daily after meals' },
    { id: 2, name: 'Medicine B (Metformin)', dosage: '10 mg', freq: 'Once daily after lunch' },
    { id: 3, name: 'Medicine C (Atorvastatin)', dosage: '5 mg', freq: 'Once daily before bedtime' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Current Medications
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">3 Active Prescriptions</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('medicines')}
          className="text-xs font-bold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All Medicines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {meds.map((m) => (
          <div
            key={m.id}
            onClick={() => onNavigate('medicines')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 hover:border-amber-500/30 flex items-center justify-between gap-3 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                  {m.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {m.dosage} • <span className="font-semibold text-slate-700 dark:text-slate-300">{m.freq}</span>
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full shrink-0">
              Active Prescribed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

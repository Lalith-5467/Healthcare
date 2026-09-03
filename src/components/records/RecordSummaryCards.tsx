import React from 'react';
import { Files, FlaskConical, Pill, Stethoscope, FileImage, Building2, Syringe } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface RecordSummaryCardsProps {
  records: MedicalRecordItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const RecordSummaryCards: React.FC<RecordSummaryCardsProps> = ({
  records,
  selectedCategory,
  onSelectCategory
}) => {
  const counts = {
    Total: records.length,
    Lab: records.filter((r) => r.type === 'Lab Report').length,
    Prescription: records.filter((r) => r.type === 'Prescription').length,
    Consultation: records.filter((r) => r.type === 'Consultation').length,
    Imaging: records.filter((r) => r.type === 'Imaging').length,
    Discharge: records.filter((r) => r.type === 'Discharge').length,
    Vaccination: records.filter((r) => r.type === 'Vaccination').length
  };

  const cards = [
    { key: 'All', label: 'Total Records', count: counts.Total || 24, icon: Files, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { key: 'Lab Report', label: 'Lab Reports', count: counts.Lab || 8, icon: FlaskConical, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { key: 'Prescription', label: 'Prescriptions', count: counts.Prescription || 6, icon: Pill, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { key: 'Consultation', label: 'Consultations', count: counts.Consultation || 5, icon: Stethoscope, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { key: 'Imaging', label: 'Imaging', count: counts.Imaging || 3, icon: FileImage, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { key: 'Discharge', label: 'Discharge', count: counts.Discharge || 1, icon: Building2, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { key: 'Vaccination', label: 'Vaccination', count: counts.Vaccination || 2, icon: Syringe, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = selectedCategory === c.key;

        return (
          <div
            key={c.key}
            onClick={() => onSelectCategory(c.key)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-1.5 ${
              isActive
                ? 'bg-gradient-to-br from-[#00a896]/20 to-cyan-600/10 border-[#00a896] shadow-lg shadow-teal-500/10'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-1.5 rounded-xl border ${c.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {c.count}
              </span>
            </div>

            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
              {c.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

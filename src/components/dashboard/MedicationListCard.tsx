import React, { useState } from 'react';
import { Pill, Check } from 'lucide-react';

interface MedicationListCardProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const MedicationListCard: React.FC<MedicationListCardProps> = ({ onNavigate, onToast }) => {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Medicine A (Amoxicillin)', dosage: '500 mg', time: '12:00 PM', taken: true, takenTime: '11:58 AM' },
    { id: 2, name: 'Medicine B (Metformin)', dosage: '10 mg', time: '06:00 PM', taken: false, takenTime: null },
    { id: 3, name: 'Medicine C (Atorvastatin)', dosage: '5 mg', time: '09:00 PM', taken: false, takenTime: null }
  ]);

  const handleMarkTaken = (id: number, name: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMeds(prev =>
      prev.map(m => (m.id === id ? { ...m, taken: true, takenTime: nowTimeStr } : m))
    );
    onToast(`Marked ${name} as taken at ${nowTimeStr}!`);
  };

  const takenCount = meds.filter(m => m.taken).length;
  const adherencePercent = Math.round((takenCount / meds.length) * 100);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Today's Medicines
            </h3>
            <span className="text-[11px] text-slate-400">Pill Tracker & Reminders</span>
          </div>
        </div>

        {/* ADHERENCE BADGE */}
        <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5">
          <span>Adherence: {adherencePercent}%</span>
        </div>
      </div>

      {/* MEDICATION LIST */}
      <div className="space-y-2.5">
        {meds.map((m) => (
          <div
            key={m.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-xl border ${m.taken ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent'}`}>
                <Pill className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {m.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{m.dosage}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{m.time}</span>
                </p>
              </div>
            </div>

            {m.taken ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5" />
                <span>Taken at {m.takenTime}</span>
              </span>
            ) : (
              <button
                onClick={() => handleMarkTaken(m.id, m.name)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-sm transition-all shrink-0 cursor-pointer"
              >
                Mark as Taken
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER LINK */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => onNavigate('medicines')}
          className="font-bold text-[#00a896] hover:underline cursor-pointer"
        >
          Manage All Medicines →
        </button>
        <span className="text-[11px] text-slate-400">3 Doses Scheduled</span>
      </div>
    </div>
  );
};

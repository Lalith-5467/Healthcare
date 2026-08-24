import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Check } from 'lucide-react';

interface MedicationListCardProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const MedicationListCard: React.FC<MedicationListCardProps> = ({ onNavigate, onToast }) => {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Amoxicillin 500mg', dosage: '1 Capsule after lunch', time: '12:00 PM', taken: true, takenTime: '11:58 AM' },
    { id: 2, name: 'Metformin 10mg', dosage: '1 Tablet after dinner', time: '06:00 PM', taken: false, takenTime: null },
    { id: 3, name: 'Atorvastatin 5mg', dosage: '1 Tablet before sleep', time: '09:00 PM', taken: false, takenTime: null }
  ]);

  const handleMarkTaken = (id: number, name: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMeds(prev =>
      prev.map(m => (m.id === id ? { ...m, taken: true, takenTime: nowTimeStr } : m))
    );
    onToast(`✓ Marked ${name} as taken at ${nowTimeStr}!`);
  };

  const takenCount = meds.filter(m => m.taken).length;
  const adherencePercent = Math.round((takenCount / meds.length) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Today's Medicines
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">Pill Tracker & Daily Reminders</span>
          </div>
        </div>

        {/* ADHERENCE BADGE */}
        <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold font-mono shadow-sm">
          <span>Adherence: {adherencePercent}%</span>
        </div>
      </div>

      {/* MEDICATION LIST */}
      <div className="space-y-2.5">
        {meds.map((m) => (
          <div
            key={m.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-xl border shrink-0 ${m.taken ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'}`}>
                <Pill className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {m.name}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                  <span>{m.dosage}</span>
                  <span>•</span>
                  <span className="font-bold text-amber-300 font-mono">{m.time}</span>
                </p>
              </div>
            </div>

            {m.taken ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 shrink-0 font-mono">
                <Check className="w-4 h-4" />
                <span>Taken {m.takenTime}</span>
              </span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMarkTaken(m.id, m.name)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition-all shrink-0 cursor-pointer"
              >
                Mark Taken
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER LINK */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <button
          onClick={() => onNavigate('medicines')}
          className="font-extrabold text-[#00a896] hover:underline cursor-pointer font-sans"
        >
          Manage All Medicines →
        </button>
        <span className="text-xs text-slate-300 font-bold">3 Doses Scheduled</span>
      </div>
    </motion.div>
  );
};

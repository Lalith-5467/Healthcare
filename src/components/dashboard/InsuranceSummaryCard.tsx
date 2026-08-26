import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface InsuranceSummaryCardProps {
  onNavigate: (id: string) => void;
}

export const InsuranceSummaryCard: React.FC<InsuranceSummaryCardProps> = ({ onNavigate }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Insurance Policy Summary
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">CarePlus Family Floater</span>
          </div>
        </div>

        <span className="px-3 py-1 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/30 font-mono">
          ● Active Coverage
        </span>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-sans font-bold block">Total Coverage</span>
          <strong className="text-lg font-black text-slate-900 dark:text-white font-sans">₹10,00,000</strong>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-sans font-bold block">Policy Expiry</span>
          <strong className="text-sm font-extrabold text-amber-700 dark:text-amber-300">31 Dec 2026</strong>
        </div>
      </div>

      {/* FOOTER LINK */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <button
          onClick={() => onNavigate('insurance')}
          className="inline-flex items-center gap-1.5 font-extrabold text-[#00a896] dark:text-cyan-400 hover:underline transition-colors cursor-pointer font-sans"
        >
          <span>View Insurance Module</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">100% Cashless</span>
      </div>
    </motion.div>
  );
};

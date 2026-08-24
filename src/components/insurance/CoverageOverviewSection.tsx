import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface CoverageOverviewSectionProps {
  policy: InsurancePolicy;
  onOpenDetails: () => void;
}

const DEFAULT_CATEGORIES = [
  { name: 'Inpatient Hospitalization', limit: 500000, copay: '10%' },
  { name: 'Outpatient Consultations', limit: 35000, copay: '20%' },
  { name: 'Diagnostic Imaging & Labs', limit: 25000, copay: '15%' },
  { name: 'Emergency & ICU Care', limit: 200000, copay: '0%' }
];

export const CoverageOverviewSection: React.FC<CoverageOverviewSectionProps> = ({
  policy,
  onOpenDetails,
}) => {
  const usedPercent = Math.round((policy.usedAmount / policy.coverageAmount) * 100);
  const remainingPercent = 100 - usedPercent;
  const categories = (policy as any).coverageCategories || DEFAULT_CATEGORIES;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      {/* SECTION HEADER & STATUS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Coverage Overview</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total sum insured and category usage progress</p>
        </div>

        <button
          onClick={onOpenDetails}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
        >
          <span>View Full Limits</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* METRIC PROGRESS BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL SUM INSURED */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono shadow-sm">
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-sans">Total Coverage Limit</span>
          <strong className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 block">₹{policy.coverageAmount.toLocaleString()}</strong>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full w-full" />
          </div>
        </div>

        {/* USED AMOUNT */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono shadow-sm">
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-sans">Used Coverage ({usedPercent}%)</span>
          <strong className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 block">₹{policy.usedAmount.toLocaleString()}</strong>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${usedPercent}%` }} className="h-full bg-amber-500 rounded-full" />
          </div>
        </div>

        {/* REMAINING AMOUNT */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono shadow-sm">
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-sans">Remaining Balance ({remainingPercent}%)</span>
          <strong className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 block">₹{policy.remainingAmount.toLocaleString()}</strong>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${remainingPercent}%` }} className="h-full bg-emerald-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Category Limits Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {categories.map((cat: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1">
              <span className="text-slate-600 dark:text-slate-400 font-bold block font-sans truncate">{cat.name}</span>
              <strong className="text-slate-900 dark:text-white text-sm block font-extrabold">₹{cat.limit.toLocaleString()}</strong>
              <span className="text-[10px] text-[#00a896] dark:text-cyan-400 block font-bold">Co-pay: {cat.copay}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

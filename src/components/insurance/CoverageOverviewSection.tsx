import React from 'react';
import { ShieldCheck, Activity, Eye, ChevronRight } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface CoverageOverviewSectionProps {
  policy: InsurancePolicy;
  onOpenDetails: () => void;
}

export const CoverageOverviewSection: React.FC<CoverageOverviewSectionProps> = ({
  policy,
  onOpenDetails,
}) => {
  const usedPercent = Math.round((policy.usedAmount / policy.coverageAmount) * 100);
  const remainingPercent = 100 - usedPercent;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* SECTION HEADER & STATUS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-white">Coverage Overview</h3>
          <p className="text-xs text-slate-400">Total sum insured and category usage progress</p>
        </div>

        <button
          onClick={onOpenDetails}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>View Full Limits</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* METRIC PROGRESS BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL SUM INSURED */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Coverage Limit</span>
          <strong className="text-2xl font-extrabold text-purple-300 block">₹{policy.coverageAmount.toLocaleString()}</strong>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full w-full" />
          </div>
        </div>

        {/* USED AMOUNT */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Used Coverage ({usedPercent}%)</span>
          <strong className="text-2xl font-extrabold text-amber-400 block">₹{policy.usedAmount.toLocaleString()}</strong>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${usedPercent}%` }} className="h-full bg-amber-400 rounded-full" />
          </div>
        </div>

        {/* REMAINING AMOUNT */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Balance ({remainingPercent}%)</span>
          <strong className="text-2xl font-extrabold text-emerald-400 block">₹{policy.remainingAmount.toLocaleString()}</strong>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${remainingPercent}%` }} className="h-full bg-emerald-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN PROGRESS BARS */}
      <div className="space-y-4 pt-2 border-t border-slate-800 text-xs">
        <h4 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider">Category Breakdown</h4>

        <div className="space-y-3 font-mono">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Inpatient Hospitalization</span>
              <strong className="text-teal-300">80% Covered (up to ₹5 Lakhs)</strong>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-[#00a896] rounded-full w-[80%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Outpatient Consultations</span>
              <strong className="text-cyan-300">60% Covered (up to ₹35,000)</strong>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-cyan-500 rounded-full w-[60%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Diagnostic Tests & Scans</span>
              <strong className="text-indigo-300">70% Covered</strong>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-indigo-500 rounded-full w-[70%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Prescription Medicines</span>
              <strong className="text-purple-300">50% Covered</strong>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-purple-500 rounded-full w-[50%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>24x7 Emergency Care & Ambulance</span>
              <strong className="text-emerald-400">100% Fully Covered</strong>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-400 rounded-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

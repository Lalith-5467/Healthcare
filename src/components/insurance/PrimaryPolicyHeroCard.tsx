import React from 'react';
import { ShieldCheck, QrCode, Edit, Eye, CheckCircle2 } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface PrimaryPolicyHeroCardProps {
  policy: InsurancePolicy | null | undefined;
  onOpenDigitalCard: () => void;
  onOpenEditPolicy: (policy: InsurancePolicy) => void;
  onOpenCoverageDetails: () => void;
}

export const PrimaryPolicyHeroCard: React.FC<PrimaryPolicyHeroCardProps> = ({
  policy,
  onOpenDigitalCard,
  onOpenEditPolicy,
  onOpenCoverageDetails,
}) => {
  if (!policy) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-teal-50/60 to-white dark:from-slate-900 dark:via-slate-900 dark:to-[#071329] border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden font-sans">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* CARD TOP HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-purple-400/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 font-mono">
                {policy.policyType} Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{policy.status}</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{policy.planName}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{policy.providerName}</p>
          </div>
        </div>

        {/* DIGITAL CARD TRIGGER */}
        <button
          onClick={onOpenDigitalCard}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#00a896] dark:text-cyan-300 border border-teal-300 dark:border-cyan-500/30 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md group self-stretch sm:self-auto justify-center"
        >
          <QrCode className="w-4 h-4 text-[#00a896] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>View Digital Health Card</span>
        </button>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 font-mono text-xs">
        <div className="bg-white/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Policy Holder</span>
          <strong className="text-slate-900 dark:text-white text-sm font-sans block">{policy.policyHolder}</strong>
          <span className="text-[10px] text-purple-700 dark:text-purple-300 block font-bold">ID: {policy.memberId}</span>
        </div>

        <div className="bg-white/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Policy Number</span>
          <strong className="text-[#00a896] dark:text-cyan-300 text-sm block font-extrabold">{policy.policyNumber}</strong>
          <span className="text-[10px] text-slate-500 block">Sum Insured: ₹{(policy.coverageAmount / 100000).toFixed(0)}L</span>
        </div>

        <div className="bg-white/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Policy Duration</span>
          <strong className="text-slate-900 dark:text-white text-xs block font-bold">{policy.startDate} →</strong>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">{policy.expiryDate}</span>
        </div>

        <div className="bg-white/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Premium Amount</span>
          <strong className="text-slate-900 dark:text-white text-sm block font-extrabold">₹{policy.premiumAmount}</strong>
          <span className="text-[10px] text-slate-500 block">{policy.premiumFrequency}</span>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10 font-sans text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCoverageDetails}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#00a896] dark:text-teal-300 font-bold border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
            <span>Coverage Breakdown</span>
          </button>
        </div>

        <button
          onClick={() => onOpenEditPolicy(policy)}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Edit className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Edit Policy Info</span>
        </button>
      </div>
    </div>
  );
};

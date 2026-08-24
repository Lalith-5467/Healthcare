import React from 'react';
import { ShieldCheck, Calendar, CreditCard, User, QrCode, Edit, Eye, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface PrimaryPolicyHeroCardProps {
  policy: InsurancePolicy;
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
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#071329] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* CARD TOP HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-purple-400/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 font-mono">
                {policy.policyType} Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{policy.status}</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{policy.planName}</h3>
            <p className="text-xs text-slate-400 font-medium">{policy.providerName}</p>
          </div>
        </div>

        {/* DIGITAL CARD TRIGGER */}
        <button
          onClick={onOpenDigitalCard}
          className="px-4 py-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md group self-stretch sm:self-auto justify-center"
        >
          <QrCode className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>View Digital Health Card</span>
        </button>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 font-mono text-xs">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Policy Holder</span>
          <strong className="text-white text-sm font-sans">{policy.policyHolder}</strong>
          <span className="text-[10px] text-purple-300 block">ID: {policy.memberId}</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Policy Number</span>
          <strong className="text-cyan-300 text-sm">{policy.policyNumber}</strong>
          <span className="text-[10px] text-slate-400 block">Verified Plan</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valid Until</span>
          <strong className="text-teal-300 text-sm font-sans">{policy.expiryDate}</strong>
          <span className="text-[10px] text-emerald-400 block">129 Days Remaining</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Premium</span>
          <strong className="text-amber-300 text-sm">₹{policy.premiumAmount.toLocaleString()}</strong>
          <span className="text-[10px] text-slate-400 block">{policy.premiumFrequency}</span>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 relative z-10 text-xs font-bold">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCoverageDetails}
            className="px-4 py-2.5 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Eye className="w-4 h-4" />
            <span>View Full Coverage Breakdown</span>
          </button>
        </div>

        <button
          onClick={() => onOpenEditPolicy(policy)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5 text-cyan-400" />
          <span>Edit Policy Info</span>
        </button>
      </div>
    </div>
  );
};

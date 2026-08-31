import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, QrCode, Edit, Eye, CheckCircle2, Calendar, User, Hash, CreditCard } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 rounded-3xl relative overflow-hidden font-sans text-slate-900 dark:text-white bg-gradient-to-br from-[#f0fdfa] via-[#e0f2fe] to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border-[1.5px] border-teal-500/20 dark:border-teal-500/10 shadow-[0_8px_32px_rgba(20,184,166,.08)] dark:shadow-none"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(20,184,166,.15) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(56,189,248,.12) 0%,transparent 70%)' }} />

      {/* TOP HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-teal-500/15 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shrink-0 bg-gradient-to-br from-[#00a896] to-sky-600 shadow-[0_4px_14px_rgba(0,168,150,.35)] dark:shadow-[0_4px_14px_rgba(0,168,150,.15)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-[#0d9488] dark:text-teal-400 border border-teal-500/25 dark:border-teal-500/20">
                {policy.policyType} Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 font-mono bg-emerald-500/10 text-[#059669] dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{policy.status}</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {policy.planName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{policy.providerName}</p>
          </div>
        </div>

        {/* DIGITAL CARD BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenDigitalCard}
          className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(0,168,150,.3)] dark:shadow-none group self-stretch sm:self-auto justify-center bg-gradient-to-br from-[#00a896] to-teal-600 text-slate-900 dark:text-white"
        >
          <QrCode className="w-4 h-4 text-teal-100 group-hover:scale-110 transition-transform" />
          <span>View Digital Health Card</span>
        </motion.button>
      </div>

      {/* METADATA 4-COLUMN TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5 relative z-10">
        <div className="p-3.5 rounded-2xl space-y-1 bg-white/85 dark:bg-slate-800/85 border border-teal-500/15 dark:border-teal-500/20 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Policy Holder</span>
          </div>
          <strong className="text-slate-900 dark:text-white text-sm font-extrabold block truncate">{policy.policyHolder}</strong>
          <span className="text-[10px] font-mono font-bold block truncate" style={{ color: '#0d9488' }}>ID: {policy.memberId}</span>
        </div>

        <div className="p-3.5 rounded-2xl space-y-1 bg-white/85 dark:bg-slate-800/85 border border-sky-500/15 dark:border-sky-500/20 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Hash className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Policy Number</span>
          </div>
          <strong className="text-slate-900 dark:text-white text-sm font-extrabold block font-mono truncate">{policy.policyNumber}</strong>
          <span className="text-[10px] font-mono font-bold block" style={{ color: '#0284c7' }}>Sum: ₹{(policy.coverageAmount / 100000).toFixed(0)} Lakhs</span>
        </div>

        <div className="p-3.5 rounded-2xl space-y-1 bg-white/85 dark:bg-slate-800/85 border border-emerald-500/15 dark:border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Valid Till</span>
          </div>
          <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-extrabold block font-mono truncate">{policy.expiryDate}</strong>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">Since {policy.startDate}</span>
        </div>

        <div className="p-3.5 rounded-2xl space-y-1 bg-white/85 dark:bg-slate-800/85 border border-amber-500/15 dark:border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Annual Premium</span>
          </div>
          <strong className="text-amber-700 dark:text-amber-400 text-sm font-extrabold block font-mono truncate">₹{policy.premiumAmount}</strong>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">{policy.premiumFrequency} billing</span>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-3 border-t border-teal-500/15 flex flex-wrap items-center justify-between gap-3 relative z-10 font-sans text-xs">
        <button
          onClick={onOpenCoverageDetails}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-teal-500/10 text-[#0d9488] dark:text-teal-400 border border-teal-500/25 dark:border-teal-500/20 hover:bg-teal-500/20"
        >
          <Eye className="w-4 h-4 text-teal-600" />
          <span>View Coverage Breakdown</span>
        </button>

        <button
          onClick={() => onOpenEditPolicy(policy)}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
        >
          <Edit className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit Policy Info</span>
        </button>
      </div>
    </motion.div>
  );
};

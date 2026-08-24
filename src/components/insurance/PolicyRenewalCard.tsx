import React from 'react';
import { Bell, RotateCcw } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface PolicyRenewalCardProps {
  policy: InsurancePolicy;
  onRenewClick: () => void;
  onSetReminderClick: () => void;
}

export const PolicyRenewalCard: React.FC<PolicyRenewalCardProps> = ({
  policy,
  onRenewClick,
  onSetReminderClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 border border-amber-300/80 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs font-sans">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-300 font-extrabold text-xl shrink-0">
          ⏳
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider font-mono">
            Policy Renewal Countdown
          </span>
          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Your CarePlus policy expires in 129 days</h4>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 font-mono font-medium">Renewal Due Date: {policy.expiryDate}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto font-sans">
        <button
          onClick={onSetReminderClick}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Bell className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
          <span>Set Renewal Reminder</span>
        </button>

        <button
          onClick={onRenewClick}
          className="px-5 py-2.5 rounded-xl font-extrabold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Renew Policy Now</span>
        </button>
      </div>
    </div>
  );
};

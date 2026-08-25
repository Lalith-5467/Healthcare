import React from 'react';
import { Check, AlertCircle, ChevronRight } from 'lucide-react';

interface ProfileCompletionCardProps {
  onOpenEdit: () => void;
  onOpenAllergy: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  onOpenEdit,
  onOpenAllergy
}) => {
  const completionPercentage = 82;

  return (
    <div className="p-5 h-full rounded-3xl bg-gradient-to-br from-teal-50 via-blue-50/50 to-fuchsia-100 dark:from-teal-900/30 dark:via-blue-900/20 dark:to-fuchsia-900/20 border border-slate-200/50 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 group">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#00cba9] flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile Completion
          </h3>
        </div>
        <span className="text-base font-black text-[#00cba9]">{completionPercentage}%</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-2.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden">
        <div
          style={{ width: `${completionPercentage}%` }}
          className="h-full bg-gradient-to-r from-[#00cba9] to-[#6366f1] rounded-full transition-all duration-700"
        />
      </div>

      <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
        Complete your profile to improve your health experience and emergency readiness.
      </p>

      {/* ACTION BUTTONS (STACKED) */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          onClick={onOpenEdit}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-[#d97706] dark:text-orange-400 border border-orange-200/60 dark:border-orange-500/30 text-[13px] font-bold transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Add Emergency Contact</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAllergy}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[#e11d48] dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/30 text-[13px] font-bold transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Add Allergy Info</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

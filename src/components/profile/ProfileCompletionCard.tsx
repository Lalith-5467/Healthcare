import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 text-white shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-extrabold text-white tracking-tight">
            Profile Completion
          </h3>
        </div>
        <span className="text-xs font-black text-cyan-300">{completionPercentage}%</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          style={{ width: `${completionPercentage}%` }}
          className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-700"
        />
      </div>

      <p className="text-[11px] text-slate-300 leading-tight">
        Complete your profile to improve your health experience and emergency readiness.
      </p>

      {/* MISSING ITEMS & QUICK BUTTONS */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={onOpenEdit}
          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          <AlertCircle className="w-3 h-3 text-amber-400" />
          <span>Add Emergency Contact</span>
        </button>

        <button
          onClick={onOpenAllergy}
          className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          <AlertCircle className="w-3 h-3 text-rose-400" />
          <span>Add Allergy Info</span>
        </button>
      </div>
    </div>
  );
};

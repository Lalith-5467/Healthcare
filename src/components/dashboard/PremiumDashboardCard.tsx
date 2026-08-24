import React from 'react';
import { Crown, Check } from 'lucide-react';

interface PremiumDashboardCardProps {
  onOpenPremium: () => void;
}

export const PremiumDashboardCard: React.FC<PremiumDashboardCardProps> = ({ onOpenPremium }) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-purple-950/40 to-slate-900 border border-amber-500/30 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
      {/* GLOW BACKGROUND */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              Unlock Premium Health
            </h3>
            <p className="text-xs text-slate-300">
              Get deeper insights into your complete health data.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-amber-400" />
            <span>Advanced Health Analytics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-amber-400" />
            <span>AI Health Assistant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-amber-400" />
            <span>Family Health Manager</span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenPremium}
        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 relative z-10"
      >
        <Crown className="w-4 h-4 text-amber-200" />
        <span>Explore Premium</span>
      </button>
    </div>
  );
};

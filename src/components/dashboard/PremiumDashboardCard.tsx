import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';

interface PremiumDashboardCardProps {
  onOpenPremium: () => void;
}

export const PremiumDashboardCard: React.FC<PremiumDashboardCardProps> = ({ onOpenPremium }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-purple-950/50 to-slate-900 border border-amber-500/40 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 group font-sans"
    >
      {/* GLOW BACKGROUND */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />

      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Unlock Premium Health Portal
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Get deeper insights into your complete health records, vitals & AI assistance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenPremium}
        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-purple-900/40 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer relative z-10 font-sans"
      >
        <Crown className="w-4 h-4 text-amber-200" />
        <span>Explore Premium Plans</span>
      </motion.button>
    </motion.div>
  );
};

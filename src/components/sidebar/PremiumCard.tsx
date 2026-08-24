import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

interface PremiumCardProps {
  isCollapsed: boolean;
  onOpenPremiumModal: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  isCollapsed,
  onOpenPremiumModal
}) => {
  if (isCollapsed) {
    return (
      <div className="px-2 py-2 flex justify-center relative group/tooltip shrink-0">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPremiumModal}
          aria-label="Go Premium"
          className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-teal-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 hover:scale-105 transition-all shadow-md cursor-pointer"
        >
          <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        </motion.button>

        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 text-xs font-bold shadow-2xl border border-amber-500/30 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity duration-150 z-50">
          Go Premium 👑
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="mx-3 my-2 p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-teal-500/10 dark:from-purple-950/60 dark:via-indigo-950/50 dark:to-slate-900/90 border border-purple-200 dark:border-purple-500/30 shadow-md relative overflow-hidden group shrink-0"
    >
      {/* GLOW DECORATION */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 dark:bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />

      <div className="relative z-10 space-y-2 font-sans">
        {/* CARD HEADER */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">Premium Health</h4>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight font-medium">
          Unlock your full health experience.
        </p>

        {/* GO PREMIUM BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPremiumModal}
          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-[11px] shadow-md shadow-purple-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Crown className="w-3 h-3 text-amber-200" />
          <span>Go Premium</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

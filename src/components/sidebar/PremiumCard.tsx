import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

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
          className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 border border-purple-200/50 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all shadow-sm cursor-pointer"
        >
          <Crown className="w-4 h-4 text-purple-500 dark:text-purple-400" />
        </motion.button>

        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-purple-200 text-xs font-bold shadow-2xl border border-purple-500/30 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity duration-150 z-50">
          Premium Health ✨
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="mx-3 my-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50/50 to-teal-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-purple-100/50 dark:border-slate-800 shadow-sm relative overflow-hidden group shrink-0 transition-all hover:shadow-md"
    >
      {/* GLOW DECORATION */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/15 transition-all" />

      <div className="relative z-10 space-y-2.5 font-sans">
        {/* CARD HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-purple-100/50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Premium Health</h4>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-[90%]">
          Unlock exclusive benefits and priority support.
        </p>

        {/* GO PREMIUM BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPremiumModal}
          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-200 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Upgrade Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

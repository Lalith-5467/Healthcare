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
      className="mx-3 my-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-purple-200 dark:border-purple-800 shadow-lg relative overflow-hidden group shrink-0 transition-all text-center flex flex-col items-center justify-center"
      style={{ boxShadow: '0 10px 30px -10px rgba(147, 51, 234, 0.20)' }}
    >
      {/* GLOW DECORATION */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 to-transparent dark:from-purple-900/20 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-2 font-sans w-full">
        {/* CARD HEADER (Centered, No Logo) */}
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <h4 className="text-[14px] font-serif font-extrabold text-[#2d1b69] dark:text-purple-100 tracking-tight leading-tight">
            Premium Health
          </h4>
        </div>

        <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium mx-auto px-1">
          Unlock exclusive benefits and priority support.
        </p>

        {/* GO PREMIUM BUTTON (Glossy) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPremiumModal}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-blue-600 text-white font-bold text-[11px] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden ring-1 ring-amber-200/50 dark:ring-amber-500/50 ring-offset-1 ring-offset-purple-50 dark:ring-offset-slate-900"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
        >
          {/* Inner glossy highlight */}
          <div className="absolute top-0 left-1 right-1 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></div>
          
          <Crown className="w-3 h-3 text-amber-300 drop-shadow-sm relative z-10" />
          <span className="relative z-10 tracking-wide">Upgrade Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

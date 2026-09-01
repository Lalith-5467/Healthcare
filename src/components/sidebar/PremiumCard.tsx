import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, CheckCircle2 } from 'lucide-react';

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
      className="mx-3 my-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-[1px] border-purple-200/60 dark:border-purple-800/50 shadow-lg relative overflow-hidden group shrink-0 transition-all text-left flex flex-col justify-center hover:shadow-[0_8px_30px_-5px_rgba(147,51,234,0.2)] dark:hover:shadow-[0_8px_30px_-5px_rgba(147,51,234,0.25)]"
    >
      {/* GLOW DECORATION */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/90 via-transparent to-blue-50/50 dark:from-purple-900/20 dark:via-transparent dark:to-blue-900/10 pointer-events-none transition-opacity duration-300" />
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-400/30 dark:group-hover:bg-purple-500/20 transition-colors duration-500" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/30 dark:group-hover:bg-blue-500/20 transition-colors duration-500" />

      <div className="relative z-10 font-sans w-full flex flex-col gap-2.5">
        {/* CARD HEADER */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 drop-shadow-sm" />
          <h4 className="text-[14px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-600 dark:from-purple-300 dark:to-cyan-300 tracking-tight leading-tight">
            Premium Care
          </h4>
        </div>

        <p className="text-[9px] text-slate-600 dark:text-slate-300/90 leading-snug font-medium">
          Get advanced health insights, priority support & more.
        </p>

        {/* COMPACT BENEFITS */}
        <ul className="text-[9px] text-slate-700 dark:text-slate-300 font-medium space-y-1.5 mb-1.5">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 drop-shadow-sm" /> Advanced Health Insights
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 drop-shadow-sm" /> Detailed Health Reports
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 drop-shadow-sm" /> Priority Support
          </li>
        </ul>

        {/* GO PREMIUM BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPremiumModal}
          className="w-full py-1.5 px-3 mt-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-slate-900 dark:text-white font-bold text-[10px] shadow-[0_0_15px_-3px_rgba(147,51,234,0.4)] dark:shadow-[0_0_15px_-3px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 dark:border-white/5 relative overflow-hidden"
        >
          {/* Subtle hover glow on button */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-in-out pointer-events-none" />
          
          <Crown className="w-3 h-3 text-amber-300 drop-shadow-md relative z-10" />
          <span className="tracking-wide relative z-10 drop-shadow-sm">Explore Premium</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

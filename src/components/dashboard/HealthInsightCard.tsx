import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface HealthInsightCardProps {
  onNavigate: (id: string) => void;
}

export const HealthInsightCard: React.FC<HealthInsightCardProps> = ({ onNavigate }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-indigo-50/70 to-slate-50 dark:from-purple-950/80 dark:via-indigo-950/70 dark:to-slate-900 border border-purple-200/90 dark:border-purple-500/40 text-slate-900 dark:text-white shadow-xl relative overflow-hidden flex flex-col justify-between group"
    >
      {/* GLOW DECORATION */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />

      <div className="relative z-10 space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Today's AI Health Insight
              </h3>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">Personalized Biometric Analysis</span>
            </div>
          </div>
          <span className="px-3 py-1 text-[10px] font-black uppercase bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full border border-purple-500/30 flex items-center gap-1.5 font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Tip</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-100 leading-relaxed max-w-xl font-medium">
          "You're doing great! Your sleep quality improved by <strong className="text-emerald-700 dark:text-emerald-300 font-black">8%</strong> this week, and your resting heart rate remains optimal at 72 BPM. Maintain your evening hydration routine."
        </p>
      </div>

      <div className="pt-4 border-t border-purple-200 dark:border-purple-500/30 flex items-center justify-between relative z-10 font-mono">
        <button
          onClick={() => onNavigate('analytics')}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#00a896] dark:text-cyan-300 hover:underline transition-colors cursor-pointer group/btn"
        >
          <span>View Health Analytics</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">Updated 2h ago</span>
      </div>
    </motion.div>
  );
};

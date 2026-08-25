import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface PrimarySOSCardProps {
  onTriggerSOS: () => void;
}

export const PrimarySOSCard: React.FC<PrimarySOSCardProps> = ({
  onTriggerSOS,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-gradient-to-b from-rose-50/80 via-white to-rose-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/40 border-2 border-rose-300 dark:border-rose-500/40 rounded-3xl p-6 sm:p-10 space-y-6 text-center shadow-2xl relative overflow-hidden font-sans"
    >
      {/* DECORATIVE PULSE BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* DEMO MODE DISCLAIMER BADGE */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-[11px] font-extrabold font-mono uppercase tracking-wider relative z-10">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Demo Mode — Safe Interactive Simulation</span>
      </div>

      <div className="space-y-2 max-w-md mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Emergency Assistance</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          Use this option when you need immediate emergency assistance. Requires deliberate confirmation before proceeding.
        </p>
      </div>

      {/* LARGE PROMINENT SOS BUTTON WITH PULSE RING */}
      <div className="py-4 relative z-10 flex flex-col items-center">
        <div className="relative">
          {/* PULSE RINGS */}
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping scale-110 pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-rose-600/30 scale-125 pointer-events-none" />

          <button
            onClick={onTriggerSOS}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-400 text-white font-extrabold text-3xl sm:text-4xl shadow-2xl shadow-rose-600/40 border-4 border-white/20 flex flex-col items-center justify-center gap-1 transition-all transform hover:scale-105 active:scale-95 cursor-pointer relative z-10"
          >
            <span className="tracking-widest drop-shadow-md">SOS</span>
            <span className="text-[10px] font-extrabold font-mono tracking-normal uppercase bg-slate-950/40 px-2 py-0.5 rounded-full border border-white/20">
              PRESS FOR ALERT
            </span>
          </button>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-4 font-medium">
          🔒 Safe Activation: Confirmation → 5-second countdown → Cancel option
        </p>
      </div>
    </motion.div>
  );
};

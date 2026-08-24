import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, ShieldCheck } from 'lucide-react';

export const HealthScoreCard: React.FC = () => {
  const [score, setScore] = useState(0);
  const targetScore = 85;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(interval);
      } else {
        setScore(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between group"
    >
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all" />

      {/* TOP LABEL */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-cyan-400 border border-teal-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Your Health Score
            </h3>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>● Excellent Vitals</span>
            </span>
          </div>
        </div>
        <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
          Weekly Sync
        </span>
      </div>

      {/* CIRCULAR PROGRESS & MAIN SCORE */}
      <div className="my-6 flex items-center justify-center relative z-10">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="72"
              cy="72"
              r="42"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="72"
              cy="72"
              r="42"
              className="stroke-emerald-400 transition-all duration-500 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-white tracking-tight leading-none">
              {score}
            </span>
            <span className="text-[11px] font-bold text-slate-300 mt-1 font-mono">out of 100</span>
          </div>
        </div>
      </div>

      {/* FOOTER TREND */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10 font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>+4 points from last week</span>
        </div>
        <span className="text-xs text-slate-300 font-bold">Target: 90+</span>
      </div>
    </motion.div>
  );
};

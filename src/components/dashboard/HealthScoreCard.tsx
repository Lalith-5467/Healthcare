import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity } from 'lucide-react';

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
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between group">
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

      {/* TOP LABEL */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Health Score
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ● Excellent
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Weekly Sync
        </span>
      </div>

      {/* CIRCULAR PROGRESS & MAIN SCORE */}
      <div className="my-6 flex items-center justify-center relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="64"
              cy="64"
              r="42"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="64"
              cy="64"
              r="42"
              className="stroke-emerald-500 transition-all duration-500 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {score}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5">out of 100</span>
          </div>
        </div>
      </div>

      {/* FOOTER TREND */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>+4 from last week</span>
        </div>
        <span className="text-[11px] text-slate-400">Target: 90+</span>
      </div>
    </div>
  );
};

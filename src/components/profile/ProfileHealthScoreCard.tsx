import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp } from 'lucide-react';

interface ProfileHealthScoreCardProps {
  onNavigate: (id: string) => void;
}

export const ProfileHealthScoreCard: React.FC<ProfileHealthScoreCardProps> = ({ onNavigate }) => {
  const [score, setScore] = useState(0);
  const targetScore = 85;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(interval);
      } else {
        setScore(current);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 34;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      onClick={() => onNavigate('analytics')}
      className="p-5 h-full rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-4 cursor-pointer hover:border-teal-500/30 transition-all group"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Health Score</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{score}</span>
          <span className="text-xs font-extrabold text-emerald-500">Excellent</span>
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>+4 from last week</span>
        </p>
      </div>

      {/* COMPACT CIRCULAR RING */}
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="34" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
          <circle
            cx="40"
            cy="40"
            r="34"
            className="stroke-emerald-500 transition-all duration-500 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-sm font-black text-slate-900 dark:text-white">{score}</span>
      </div>
    </div>
  );
};

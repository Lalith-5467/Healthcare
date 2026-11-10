import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProfileHealthScoreCardProps {
  onNavigate: (id: string) => void;
}

export const ProfileHealthScoreCard: React.FC<ProfileHealthScoreCardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
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

  const radius = 31;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      onClick={() => onNavigate('analytics')}
      className="p-4 sm:p-5 h-full rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:border-teal-500/30 transition-all group overflow-hidden"
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{t('profile.health_score', 'Health Score')}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{score}</span>
          <span className="text-xs font-extrabold text-emerald-500">{t('profile.excellent', 'Excellent')}</span>
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 truncate">
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span>{t('profile.from_last_week', '+4 from last week')}</span>
        </p>
      </div>

      {/* COMPACT CIRCULAR RING */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
        <svg 
          viewBox="0 0 80 80" 
          className="w-full h-full transform -rotate-90 overflow-visible"
        >
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            className="stroke-slate-100 dark:stroke-slate-800" 
            strokeWidth="6" 
            fill="transparent" 
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-emerald-500 transition-all duration-500 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-sm sm:text-base font-black text-slate-900 dark:text-white">{score}</span>
      </div>
    </div>
  );
};

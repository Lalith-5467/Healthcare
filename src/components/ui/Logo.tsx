import React from 'react';
import { Activity } from 'lucide-react';

interface LogoProps {
  className?: string;
  showBadge?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showBadge = false, variant = 'auto' }) => {
  const mediTextColor = variant === 'dark' 
    ? 'text-white' 
    : variant === 'light' 
    ? 'text-slate-900' 
    : 'text-slate-900 dark:text-white';

  const subtextColor = variant === 'dark' 
    ? 'text-slate-600 dark:text-slate-300' 
    : 'text-slate-500 dark:text-slate-400';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-[#00a896] flex items-center justify-center text-white shadow-md shrink-0">
        <Activity className="w-6 h-6 stroke-[2.5]" />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold text-xl tracking-tight leading-none ${mediTextColor}`}>
            Medi<span className="text-[#00a896]">Care</span>
          </span>
          {showBadge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-full uppercase">
              ABDM Ready
            </span>
          )}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${subtextColor}`}>
          Healthcare & Medical
        </span>
      </div>
    </div>
  );
};

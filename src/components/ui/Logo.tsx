import React from 'react';

interface LogoProps {
  className?: string;
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showBadge = false }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800 dark:border-slate-700 shadow-md group transition-transform duration-300 hover:scale-105">
        {/* Glow accent */}
        <div className="absolute inset-0 rounded-xl bg-orange-500/20 blur-md group-hover:bg-orange-500/30 transition-all" />
        
        {/* SVG Pulse Heart Icon */}
        <svg className="w-5 h-5 relative z-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 12H6.5L9 5L13.5 19L16.5 10.5L18.5 14H21" 
            stroke="#FF5B22" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="18.5" cy="14" r="1.5" fill="#FF5B22" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Pulse<span className="text-[#FF5B22]">Care</span>
          </span>
          {showBadge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase">
              ABDM Ready
            </span>
          )}
        </div>
        <span className="text-[10.5px] font-medium tracking-wide text-slate-500 dark:text-slate-400 -mt-0.5">
          Connected Health Platform
        </span>
      </div>
    </div>
  );
};

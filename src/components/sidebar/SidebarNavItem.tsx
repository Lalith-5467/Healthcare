import React from 'react';
import type { NavItemConfig } from './types';

interface SidebarNavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick
}) => {
  const Icon = item.icon;
  const isEmergency = item.isSpecial === 'sos';
  const isAI = item.isSpecial === 'ai';

  let containerClass = 'group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer select-none ';

  if (isActive) {
    containerClass += 'bg-teal-500/10 dark:bg-gradient-to-r dark:from-purple-900/50 dark:via-blue-900/40 dark:to-slate-900/80 border border-teal-500/30 dark:border-purple-500/30 text-teal-800 dark:text-white font-extrabold shadow-sm dark:shadow-md ';
  } else if (isEmergency) {
    containerClass += 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 ';
  } else if (isAI) {
    containerClass += 'bg-purple-50 dark:bg-indigo-950/30 border border-purple-200 dark:border-indigo-500/20 text-purple-700 dark:text-indigo-200 hover:bg-purple-100 dark:hover:bg-indigo-900/40 ';
  } else {
    containerClass += 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent ';
  }

  return (
    <div className="relative group/tooltip">
      <button
        onClick={onClick}
        aria-label={item.label}
        className={containerClass}
      >
        {/* LEFT GLOW INDICATOR BAR FOR ACTIVE ITEM */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-[#00a896] shadow-sm shadow-[#00a896]" />
        )}

        {/* ICON */}
        <div className={`shrink-0 transition-transform duration-150 group-hover:scale-105 group-hover:translate-x-0.5 ${
          isActive 
            ? 'text-[#00a896] dark:text-cyan-400' 
            : isEmergency 
            ? 'text-rose-600 dark:text-rose-400' 
            : isAI 
            ? 'text-purple-600 dark:text-indigo-400' 
            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
        }`}>
          <Icon className="w-4 h-4 stroke-[2]" />
        </div>

        {/* LABEL & BADGES (WHEN EXPANDED) */}
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0 transition-all duration-150">
            <span className={`truncate text-xs ${isActive ? 'font-black text-slate-900 dark:text-white' : ''}`}>
              {item.label}
            </span>

            {/* AI BADGE */}
            {isAI && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow-sm">
                AI
              </span>
            )}

            {/* SOS EMERGENCY BADGE */}
            {isEmergency && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase bg-rose-500 text-white rounded animate-pulse">
                SOS
              </span>
            )}

            {/* NOTIFICATION BADGE */}
            {item.badge && !isAI && !isEmergency && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-700 dark:text-cyan-300 border border-teal-500/30">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </button>

      {/* FLOATING TOOLTIP WHEN COLLAPSED */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity duration-150 z-50 flex items-center gap-2">
          <span>{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-teal-500/30 text-cyan-300 rounded-md">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

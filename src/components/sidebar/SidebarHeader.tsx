import React from 'react';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="p-3.5 flex items-center justify-between border-b border-slate-200/90 dark:border-slate-800/60 relative shrink-0">
      <div className="flex items-center gap-2.5 overflow-hidden select-none">
        
        {/* ECG ACTIVITY ICON WITH TEAL BACKGROUND */}
        <div className="relative shrink-0 flex items-center justify-center w-9 h-9 rounded-2xl bg-[#00a896] text-white shadow-md shadow-teal-500/20 group">
          <Activity className="w-5 h-5 text-white stroke-[2.5]" />
        </div>

        {/* BRAND NAME & SUBTITLE */}
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 transition-all duration-300">
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
              Medi<span className="text-[#00a896]">Care</span>
            </span>
            <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider leading-tight uppercase font-mono mt-0.5">
              HEALTHCARE & MEDICAL
            </span>
          </div>
        )}
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-colors shrink-0 cursor-pointer"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

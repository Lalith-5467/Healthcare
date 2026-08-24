import React from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="p-3.5 flex items-center justify-between border-b border-slate-800/60 relative shrink-0">
      <div className="flex items-center gap-2.5 overflow-hidden select-none">
        
        {/* HEART ICON WITH SOFT GLOW */}
        <div className="relative shrink-0 flex items-center justify-center w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-md shadow-rose-500/10 group">
          <div className="absolute inset-0 rounded-2xl bg-rose-500/20 blur-md pointer-events-none group-hover:bg-rose-500/40 transition-all duration-300" />
          <Heart className="w-5 h-5 relative z-10 fill-rose-500/30 text-rose-400 stroke-[2.5]" />
        </div>

        {/* BRAND NAME & SUBTITLE */}
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 transition-all duration-300">
            <span className="font-extrabold text-base tracking-tight text-white leading-tight flex items-center gap-1">
              Health<span className="text-[#00a896]">Record</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-tight leading-tight mt-0.5">
              Your Health. Your Records.
            </span>
          </div>
        )}
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0 cursor-pointer"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

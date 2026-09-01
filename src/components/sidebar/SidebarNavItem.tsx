import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { NavItemConfig } from './types';

interface SidebarNavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClick: () => void;
  activeId?: string;
  onSelectNav?: (id: string) => void;
  isNested?: boolean;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isCollapsed,
  isExpanded,
  onToggleExpand,
  onClick,
  activeId,
  onSelectNav,
  isNested = false
}) => {
  const Icon = item.icon;
  const isEmergency = item.isSpecial === 'sos';
  const isAI = item.isSpecial === 'ai';
  const hasChildren = item.children && item.children.length > 0;

  let containerClass = 'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none w-full outline-none ';

  if (isActive && !isNested) {
    containerClass += 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold shadow-sm shadow-teal-500/10 ';
  } else if (isActive && isNested) {
    containerClass += 'text-teal-600 dark:text-teal-400 font-bold bg-slate-50 dark:bg-slate-800/50 ';
  } else if (isEmergency) {
    containerClass += 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-bold ';
  } else if (isAI) {
    containerClass += 'text-purple-600 dark:text-indigo-400 hover:bg-purple-50 dark:hover:bg-indigo-900/20 ';
  } else {
    containerClass += 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white ';
  }

  // Adjust padding for nested items
  if (isNested) {
    containerClass += ' pl-9 py-2 ';
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && onToggleExpand) {
      e.preventDefault();
      onToggleExpand();
    } else {
      onClick();
    }
  };

  return (
    <div className="relative group/tooltip flex flex-col w-full">
      <motion.button
        whileHover={{ x: isCollapsed ? 0 : 2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        aria-label={item.label}
        className={containerClass}
      >
        {/* LEFT ACTIVE GLOW PILL */}
        {isActive && !isNested && (
          <motion.span
            layoutId="sidebarActiveGlow"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-teal-500 dark:bg-teal-400 shadow-sm shadow-teal-500/20"
          />
        )}

        {/* ICON */}
        <div className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          isActive 
            ? 'text-teal-600 dark:text-teal-400' 
            : isEmergency 
            ? 'text-rose-600 dark:text-rose-400' 
            : isAI 
            ? 'text-purple-500 dark:text-indigo-400' 
            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
        }`}>
          <Icon className={`${isNested ? 'w-3.5 h-3.5' : 'w-[18px] h-[18px]'} stroke-[2]`} />
        </div>

        {/* LABEL & BADGES */}
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0 transition-all duration-150">
            <span className={`truncate ${isActive ? 'font-black text-slate-900 dark:text-white' : ''}`}>
              {item.label}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* AI BADGE */}
              {isAI && (
                <span className="px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded shadow-sm">
                  AI
                </span>
              )}

              {/* SOS EMERGENCY BADGE */}
              {isEmergency && (
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase bg-rose-500 text-white rounded shadow-sm">
                  SOS
                </span>
              )}

              {/* STYLISH NOTIFICATION COUNTER BADGE */}
              {item.badge && !isAI && !isEmergency && (
                <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full flex items-center gap-1 shadow-xs border ${
                  item.badge === 'New' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/30'
                }`}>
                  <span className={`w-1 h-1 rounded-full animate-pulse ${
                    item.badge === 'New' ? 'bg-emerald-500' : 'bg-teal-500'
                  }`} />
                  <span>{item.badge}</span>
                </span>
              )}

              {/* NESTED ITEMS CHEVRON */}
              {hasChildren && (
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              )}
            </div>
          </div>
        )}
      </motion.button>

      {/* RENDER CHILDREN */}
      {!isCollapsed && hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden w-full flex flex-col gap-0.5 mt-0.5"
            >
              {item.children!.map((child) => (
                <SidebarNavItem
                  key={child.id}
                  item={child}
                  isActive={activeId === child.id}
                  isCollapsed={isCollapsed}
                  onClick={() => onSelectNav && onSelectNav(child.id)}
                  isNested={true}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* FLOATING TOOLTIP WHEN COLLAPSED */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity duration-150 z-50 flex items-center gap-2">
          <span>{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-500/30 text-cyan-300 rounded-md">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

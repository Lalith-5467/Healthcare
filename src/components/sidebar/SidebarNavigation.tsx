import React, { useState } from 'react';
import type { NavItemConfig } from './types';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarNavigationProps {
  items: NavItemConfig[];
  activeId?: string;
  isCollapsed: boolean;
  onSelectNav: (id: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  items,
  activeId,
  isCollapsed,
  onSelectNav
}) => {
  // Track expanded sections
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Group items by section
  const groupedItems = items.reduce((acc, item) => {
    const section = item.section || 'OTHER';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItemConfig[]>);

  // Define section order
  const sectionOrder = ['PRIMARY', 'HEALTH SERVICES', 'SAFETY', 'SYSTEM', 'OTHER'];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {sectionOrder.map((sectionKey) => {
        const sectionItems = groupedItems[sectionKey];
        if (!sectionItems || sectionItems.length === 0) return null;

        return (
          <div key={sectionKey} className="space-y-1">
            {!isCollapsed && sectionKey !== 'OTHER' && (
              <h4 className="px-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 tracking-wider mb-2 mt-1">
                {sectionKey}
              </h4>
            )}
            {sectionItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                isCollapsed={isCollapsed}
                isExpanded={!!expandedIds[item.id]}
                onToggleExpand={() => toggleExpand(item.id)}
                onClick={() => onSelectNav(item.id)}
                activeId={activeId}
                onSelectNav={onSelectNav}
              />
            ))}
          </div>
        );
      })}
    </nav>
  );
};

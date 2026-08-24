import React from 'react';
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
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {items.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={activeId === item.id}
          isCollapsed={isCollapsed}
          onClick={() => onSelectNav(item.id)}
        />
      ))}
    </nav>
  );
};

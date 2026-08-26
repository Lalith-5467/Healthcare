import React from 'react';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: string | number;
  badgeColor?: string;
  isSpecial?: 'ai' | 'sos';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
  avatarUrl?: string;
}

export interface SidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  user?: UserProfile;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

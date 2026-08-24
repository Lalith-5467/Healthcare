import React, { useState } from 'react';
import type { SidebarProps } from './types';
import { SIDEBAR_NAV_ITEMS } from './navData';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { PremiumCard } from './PremiumCard';
import { SidebarProfile } from './SidebarProfile';
import { PremiumModal } from './PremiumModal';

export const Sidebar: React.FC<SidebarProps> = ({
  activeId = 'dashboard',
  onSelectNav,
  user,
  onLogout,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;

  const handleToggleCollapse = () => {
    if (externalOnToggleCollapse) {
      externalOnToggleCollapse();
    } else {
      setInternalIsCollapsed(!internalIsCollapsed);
    }
  };

  const handleSelectNav = (id: string) => {
    if (onSelectNav) {
      onSelectNav(id);
    }
  };

  return (
    <>
      <aside
        aria-label="Main healthcare navigation"
        className={`h-screen sticky top-0 bg-gradient-to-b from-[#0b1329] via-[#091024] to-[#070b18] text-slate-300 border-r border-slate-800/80 shadow-2xl transition-all duration-300 ease-in-out flex flex-col justify-between z-30 select-none ${
          isCollapsed ? 'w-[76px]' : 'w-[260px] lg:w-[270px]'
        }`}
      >
        {/* HEADER BRANDING */}
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* MAIN NAVIGATION LIST (ALL 18 ITEMS) */}
        <SidebarNavigation
          items={SIDEBAR_NAV_ITEMS}
          activeId={activeId}
          isCollapsed={isCollapsed}
          onSelectNav={handleSelectNav}
        />

        {/* PREMIUM PROMOTION CARD */}
        <PremiumCard
          isCollapsed={isCollapsed}
          onOpenPremiumModal={() => setPremiumModalOpen(true)}
        />

        {/* PATIENT PROFILE CARD & POPUP */}
        <SidebarProfile
          user={user}
          isCollapsed={isCollapsed}
          onLogout={onLogout}
          onNavigate={handleSelectNav}
        />
      </aside>

      {/* FRONTEND PREMIUM MODAL */}
      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </>
  );
};

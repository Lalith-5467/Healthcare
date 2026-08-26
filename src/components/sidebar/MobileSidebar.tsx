import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { SidebarProps } from './types';
import { SIDEBAR_NAV_ITEMS } from './navData';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { PremiumCard } from './PremiumCard';
import { SidebarProfile } from './SidebarProfile';
import { PremiumModal } from './PremiumModal';

interface MobileSidebarProps extends SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activeId = 'dashboard',
  onSelectNav,
  user,
  onLogout
}) => {
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const handleSelectNav = (id: string) => {
    if (onSelectNav) onSelectNav(id);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* DARK BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md"
            />

            {/* OFF-CANVAS SIDEBAR DRAWER */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-gradient-to-b dark:from-[#0b1329] dark:via-[#091024] dark:to-[#070b18] text-slate-800 dark:text-slate-300 shadow-2xl border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between z-50 select-none"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                aria-label="Close mobile navigation"
                className="absolute top-4 right-4 p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* SIDEBAR HEADER */}
              <SidebarHeader
                isCollapsed={false}
                onToggleCollapse={onClose}
              />

              {/* NAVIGATION LIST */}
              <SidebarNavigation
                items={SIDEBAR_NAV_ITEMS}
                activeId={activeId}
                isCollapsed={false}
                onSelectNav={handleSelectNav}
              />

              {/* PREMIUM CARD */}
              <PremiumCard
                isCollapsed={false}
                onOpenPremiumModal={() => setPremiumModalOpen(true)}
              />

              {/* PROFILE */}
              <SidebarProfile
                user={user}
                isCollapsed={false}
                onLogout={onLogout}
                onNavigate={handleSelectNav}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </>
  );
};

import React from 'react';
import { LogOut } from 'lucide-react';
import type { UserProfile } from './types';

interface SidebarProfileProps {
  user?: UserProfile;
  isCollapsed: boolean;
  onLogout?: () => void;
  onNavigate?: (id: string) => void;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  isCollapsed,
  onLogout
}) => {
  return (
    <div className="p-3 border-t border-slate-200/90 dark:border-slate-800/60">
      <button
        onClick={() => {
          if (onLogout) onLogout();
        }}
        aria-label="Logout"
        className="w-full p-2.5 rounded-2xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer font-bold"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

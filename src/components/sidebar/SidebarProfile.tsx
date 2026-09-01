import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, ShieldCheck, LogOut, Sun, Moon } from 'lucide-react';
import type { UserProfile } from './types';
import { useTheme } from '../theme/ThemeProvider';

interface SidebarProfileProps {
  user?: UserProfile;
  isCollapsed: boolean;
  onLogout?: () => void;
  onNavigate?: (id: string) => void;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  user = {
    name: 'Samson L.',
    email: 'samson.l@abdm.in',
    role: 'Patient',
    abhaId: '91-8472-9104-5821@abdm',
    bloodGroup: 'O+',
    age: 32,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
  },
  isCollapsed,
  onLogout,
  onNavigate
}) => {
  return (
    <div className="p-3 border-t border-slate-200/90 dark:border-slate-800/60">
      <button
        onClick={() => {
          if (onLogout) onLogout();
        }}
        aria-label="Logout"
        className={`w-full p-2.5 rounded-2xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center gap-3 cursor-pointer font-bold ${
          isCollapsed ? 'justify-center' : 'justify-center'
        }`}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

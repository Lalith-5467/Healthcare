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
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (action: string) => {
    setMenuOpen(false);
    if (action === 'logout') {
      if (onLogout) onLogout();
    } else if (onNavigate) {
      onNavigate(action);
    } else {
      alert(`Navigating to ${action}`);
    }
  };

  return (
    <div ref={containerRef} className="p-3 border-t border-slate-800/60 relative">
      
      {/* POPUP DROPDOWN MENU */}
      {menuOpen && (
        <div className={`absolute bottom-full mb-2 ${isCollapsed ? 'left-14' : 'left-3 right-3'} rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 text-xs font-semibold space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150`}>
          <button
            onClick={() => handleOptionClick('profile')}
            className="w-full px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => handleOptionClick('settings')}
            className="w-full px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Settings</span>
          </button>

          {/* THEME TOGGLE OPTION */}
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="w-full px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between gap-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
              <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </div>
            <span className="text-[10px] font-mono text-teal-400 font-extrabold uppercase">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={() => handleOptionClick('insurance')}
            className="w-full px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Privacy & ABDM</span>
          </button>

          <div className="border-t border-slate-800 my-1" />

          <button
            onClick={() => handleOptionClick('logout')}
            className="w-full px-3 py-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/20 flex items-center gap-2 transition-colors cursor-pointer font-bold"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout (Demo)</span>
          </button>
        </div>
      )}

      {/* PROFILE TRIGGER CARD */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Patient Profile Options"
        className={`w-full p-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all flex items-center gap-3 cursor-pointer ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
            alt={user.name}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#00a896]/30 shrink-0"
          />

          {!isCollapsed && (
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-white truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{user.age} Years • {user.bloodGroup}</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${menuOpen ? 'rotate-180 text-white' : ''}`} />
        )}
      </button>

    </div>
  );
};

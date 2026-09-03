import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sparkles, User, Settings, LogOut, Home } from 'lucide-react';
import { getGreeting } from '../../utils/greeting';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationPopover } from './NotificationPopover';
import { INITIAL_NOTIFICATIONS } from '../reminders/remindersData';

interface DashboardHeaderProps {
  userName?: string;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onNavigateHome?: () => void;
  onNavigate?: (id: string) => void;
  onLogout?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Samson',
  onOpenNotifications,
  onOpenProfile,
  onNavigateHome,
  onNavigate,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const checkUnreadCount = () => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) {
      try {
        const notifs = JSON.parse(saved);
        setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
      } catch (e) {
        setUnreadCount(INITIAL_NOTIFICATIONS.filter(n => !n.isRead).length);
      }
    } else {
      setUnreadCount(INITIAL_NOTIFICATIONS.filter(n => !n.isRead).length);
    }
  };

  useEffect(() => {
    checkUnreadCount();
    const handleUpdate = () => checkUnreadCount();
    window.addEventListener('notifications_updated', handleUpdate);
    return () => window.removeEventListener('notifications_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTogglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const handleNavigateToNotifications = () => {
    setPopoverOpen(false);
    if (onOpenNotifications) {
      onOpenNotifications();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800/80 relative"
    >
      {/* LEFT GREETING */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {userName}! 👋
          </h1>
          <span className="px-3 py-1 text-xs font-black uppercase bg-gradient-to-r from-[#00a896]/20 to-cyan-500/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 flex items-center gap-1.5 shadow-sm font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
            <span>Patient Portal</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
          <span>Here's your comprehensive health overview for today.</span>
          <span className="hidden sm:inline-block text-slate-500 dark:text-slate-400 dark:text-slate-500">•</span>
          <span className="hidden sm:inline-block font-extrabold text-[#00a896] dark:text-cyan-300 font-mono">
            {todayDateStr}
          </span>
        </p>
      </div>

      {/* RIGHT SEARCH, THEME TOGGLE, NOTIFICATIONS & PROFILE */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto relative">
        {/* SEARCH BAR */}
        <div className="relative flex-1 md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00a896] dark:text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, doctors, medicines..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-500 focus:ring-1 focus:ring-teal-500/30 shadow-inner transition-all font-sans"
          />
        </div>

        {/* HOME BUTTON */}
        {onNavigateHome && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateHome}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#00a896] dark:hover:text-cyan-300 hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold shrink-0"
            title="Go to Website Home"
          >
            <Home className="w-4 h-4 text-[#00a896] dark:text-cyan-300" />
            <span className="hidden xl:inline font-sans">Home</span>
          </motion.button>
        )}

        {/* DARK / LIGHT MODE THEME TOGGLE BUTTON */}
        <ThemeToggle className="shrink-0" />

        {/* NOTIFICATION BUTTON & POPOVER */}
        <div className="relative shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTogglePopover}
            className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#00a896] dark:text-cyan-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>

          <NotificationPopover
            isOpen={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            onNavigateToNotifications={handleNavigateToNotifications}
          />
        </div>

        {/* PROFILE AVATAR */}
        <div className="relative shrink-0" ref={profileContainerRef}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center font-black text-teal-600 dark:text-teal-400 font-mono text-xs shadow-[0_0_10px_rgba(20,184,166,0.15)] ring-2 ring-teal-500/20">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{userName}</span>
              <span className="text-[10px] font-extrabold text-[#00a896] dark:text-cyan-300 leading-tight font-mono">Patient Profile</span>
            </div>
          </motion.button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 z-50 text-xs font-semibold space-y-0.5 origin-top-right"
              >
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onNavigate) onNavigate('profile');
                    else if (onOpenProfile) onOpenProfile();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onNavigate) onNavigate('settings');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer font-bold"
                >
                  <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

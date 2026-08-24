import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationsDropdown } from './NotificationsDropdown';

interface DashboardHeaderProps {
  userName?: string;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
  onShowToast?: (msg: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Samson',
  onOpenProfile,
  onNavigate = () => {},
  onShowToast = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

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
            Good Morning, {userName}! 👋
          </h1>
          <span className="px-3 py-1 text-xs font-black uppercase bg-gradient-to-r from-[#00a896]/20 to-cyan-500/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 flex items-center gap-1.5 shadow-sm font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
            <span>Patient Portal</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
          <span>Here's your comprehensive health overview for today.</span>
          <span className="hidden sm:inline-block text-slate-400 dark:text-slate-500">•</span>
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

        {/* DARK / LIGHT MODE THEME TOGGLE BUTTON */}
        <ThemeToggle className="shrink-0" />

        {/* NOTIFICATION BUTTON WITH POPPER DROPDOWN */}
        <div className="relative shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer shrink-0"
            title="Real-Time Notifications"
          >
            <Bell className="w-4 h-4 text-[#00a896] dark:text-cyan-300" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
          </motion.button>

          {/* REAL-TIME NOTIFICATIONS POPUP DROPDOWN */}
          <NotificationsDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            onNavigate={onNavigate}
            onShowToast={onShowToast}
          />
        </div>

        {/* PROFILE AVATAR */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer shrink-0"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt={userName}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-teal-500/40"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{userName}</span>
            <span className="text-[10px] font-extrabold text-[#00a896] dark:text-cyan-300 leading-tight font-mono">Patient Profile</span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  );
};

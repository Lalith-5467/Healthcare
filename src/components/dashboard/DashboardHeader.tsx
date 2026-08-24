import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Samson',
  onOpenNotifications,
  onOpenProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
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
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80"
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
          <span className="hidden sm:inline-block font-bold text-[#00a896] dark:text-cyan-300 font-mono">
            {todayDateStr}
          </span>
        </p>
      </div>

      {/* RIGHT SEARCH & NOTIFICATIONS & PROFILE */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
        {/* SEARCH BAR */}
        <div className="relative flex-1 md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, doctors, medicines..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 shadow-inner transition-all font-sans"
          />
        </div>

        {/* NOTIFICATION BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800/90 hover:border-slate-700 transition-all shadow-md cursor-pointer shrink-0"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-cyan-300" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
        </motion.button>

        {/* PROFILE AVATAR */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md cursor-pointer shrink-0"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt={userName}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-cyan-500/40"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-extrabold text-white leading-tight">{userName}</span>
            <span className="text-[10px] font-bold text-cyan-300 leading-tight font-mono">Patient Profile</span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  );
};

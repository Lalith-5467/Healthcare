import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';

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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* LEFT GREETING */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good Morning, {userName}! 👋
          </h1>
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-teal-500/10 text-[#00a896] dark:text-cyan-400 rounded-full border border-teal-500/20">
            Patient Portal
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Here's your health overview for today.</span>
          <span className="hidden sm:inline-block text-slate-400 dark:text-slate-600">•</span>
          <span className="hidden sm:inline-block font-semibold text-slate-700 dark:text-slate-300">
            {todayDateStr}
          </span>
        </p>
      </div>

      {/* RIGHT SEARCH & NOTIFICATIONS & PROFILE */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
        {/* SEARCH BAR */}
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, doctors, meds..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 shadow-sm transition-all"
          />
        </div>

        {/* NOTIFICATION BUTTON */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-sm cursor-pointer shrink-0"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        </button>

        {/* PROFILE AVATAR */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt={userName}
            className="w-7 h-7 rounded-xl object-cover ring-2 ring-[#00a896]/30"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{userName}</span>
            <span className="text-[10px] text-slate-400 leading-tight">Patient</span>
          </div>
        </button>
      </div>
    </header>
  );
};

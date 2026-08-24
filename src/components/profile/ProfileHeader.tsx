import React from 'react';
import { Edit3, ShieldCheck, Clock } from 'lucide-react';

interface ProfileHeaderProps {
  onOpenEditDrawer: () => void;
  lastUpdated?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onOpenEditDrawer,
  lastUpdated = 'Today, 10:42 AM'
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* LEFT TITLE */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            My Health Profile
          </h1>
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-[#00a896]/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Encrypted ABDM Profile</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Manage your personal and health information in one secure place.</span>
          <span className="hidden sm:inline-block text-slate-400 dark:text-slate-600">•</span>
          <span className="hidden sm:inline-block font-medium text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Last updated: {lastUpdated}</span>
          </span>
        </p>
      </div>

      {/* RIGHT EDIT BUTTON */}
      <button
        onClick={onOpenEditDrawer}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
      >
        <Edit3 className="w-4 h-4" />
        <span>Edit Profile</span>
      </button>
    </header>
  );
};

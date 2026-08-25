import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-2 font-sans relative min-h-[500px]">
      {/* TOP SLEEK ACCENT LOADING BAR */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 rounded-full animate-pulse shadow-sm" />

      {/* FLOATING HEALTH RECORD LOADING BADGE */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-400 animate-spin">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800/80 rounded-xl animate-pulse" />
            <div className="h-3.5 w-64 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg mt-1.5 animate-pulse" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-extrabold text-[#00a896] dark:text-cyan-400 bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 rounded-xl animate-pulse font-mono">
          <ShieldCheck className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
          <span>Syncing Profile Records</span>
        </div>
      </div>

      {/* IDENTITY SKELETON */}
      <div className="h-32 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200/80 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200/80 dark:bg-slate-800 rounded-lg" />
            <div className="h-3.5 w-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
          </div>
        </div>
        <div className="h-10 w-28 bg-slate-200/80 dark:bg-slate-800 rounded-xl hidden sm:block" />
      </div>

      {/* 2-COLUMN GRID SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-3 shadow-sm animate-pulse">
          <div className="h-4 w-36 bg-slate-200/80 dark:bg-slate-800 rounded-md" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        </div>
        <div className="h-48 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-3 shadow-sm animate-pulse">
          <div className="h-4 w-36 bg-slate-200/80 dark:bg-slate-800 rounded-md" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        </div>
      </div>

      {/* OVERVIEW SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 space-y-2.5 shadow-sm animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-slate-200/80 dark:bg-slate-800" />
            <div className="h-4 w-16 bg-slate-200/80 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-12 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

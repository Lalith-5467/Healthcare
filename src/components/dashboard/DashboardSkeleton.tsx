import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-2 font-sans">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-4 w-48 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
        </div>
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl hidden md:block" />
      </div>

      {/* HERO SECTION SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl" />
        <div className="h-64 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl" />
      </div>

      {/* FOCUS CARDS SKELETON */}
      <div className="space-y-3">
        <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl" />
          <div className="h-32 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl" />
          <div className="h-32 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl" />
          <div className="h-32 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl" />
        </div>
      </div>

      {/* SNAPSHOT SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

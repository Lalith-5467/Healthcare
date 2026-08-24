import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-800 rounded-2xl" />
          <div className="h-4 w-48 bg-slate-800/60 rounded-xl" />
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-2xl" />
      </div>

      {/* IDENTITY SKELETON */}
      <div className="h-32 bg-slate-800/80 rounded-3xl" />

      {/* 2-COLUMN GRID SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 bg-slate-800/80 rounded-3xl" />
        <div className="h-48 bg-slate-800/80 rounded-3xl" />
      </div>

      {/* OVERVIEW SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-800/80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

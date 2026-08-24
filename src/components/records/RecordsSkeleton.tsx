import React from 'react';

export const RecordsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-60 bg-slate-800 rounded-2xl" />
          <div className="h-4 w-80 bg-slate-800/60 rounded-xl" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-slate-800 rounded-2xl" />
          <div className="h-10 w-32 bg-slate-800 rounded-2xl" />
        </div>
      </div>

      {/* SUMMARY CARDS SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-800/80 rounded-2xl" />
        ))}
      </div>

      {/* SEARCH BAR SKELETON */}
      <div className="h-14 bg-slate-800/80 rounded-3xl" />

      {/* RECORDS LIST SKELETON */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-800/80 rounded-3xl" />
        ))}
      </div>
    </div>
  );
};

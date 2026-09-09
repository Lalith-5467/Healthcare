import React from 'react';
import { IconClock, IconHourglassHigh, IconUsers, IconCalendarEvent } from '@tabler/icons-react';

export const NurseTodayShift: React.FC = () => {
  return (
    <section className="mb-2">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1 uppercase tracking-wider">
        Today's shift
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-5 py-3.5 bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-400">
        
        <div className="flex items-center gap-2 shrink-0">
          <IconClock className="w-4 h-4 text-teal-500" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">8:00 AM – 4:00 PM</span>
        </div>
        
        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></div>
        
        <div className="flex items-center gap-2 shrink-0">
          <IconHourglassHigh className="w-4 h-4 text-orange-400" />
          <span>6h 24m remaining</span>
        </div>

        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></div>

        <div className="flex items-center gap-2 shrink-0">
          <IconUsers className="w-4 h-4 text-blue-500" />
          <span><strong className="text-slate-800 dark:text-slate-200">2</strong> active patients</span>
        </div>

        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></div>

        <div className="flex items-center gap-2 shrink-0">
          <IconCalendarEvent className="w-4 h-4 text-pink-500" />
          <span><strong className="text-slate-800 dark:text-slate-200">3</strong> visits remaining</span>
        </div>

      </div>
    </section>
  );
};

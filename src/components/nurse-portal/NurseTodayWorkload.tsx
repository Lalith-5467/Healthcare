import React from 'react';
import { IconChecklist } from '@tabler/icons-react';

export const NurseTodayWorkload: React.FC = () => {
  return (
    <section className="pt-2">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1 uppercase tracking-wider flex items-center gap-2">
        Today's workload
      </h3>

      <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-sm">
        
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <IconChecklist className="w-4 h-4 text-teal-500" />
              Overall Progress
            </span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
              8 / 12 tasks completed
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Sub-progress indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          
          <div className="flex flex-col">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Visits</span>
              <span className="text-slate-900 dark:text-white">3 / 5</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Care Requests</span>
              <span className="text-slate-900 dark:text-white">2 / 4</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Medications</span>
              <span className="text-slate-900 dark:text-white">4 / 4</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

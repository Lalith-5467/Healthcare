import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

export interface CheckupFilterState {
  checkupType: string;
  status: string;
  dateRange: string;
}

interface CheckupFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CheckupFilterState;
  onApplyFilters: (newFilters: CheckupFilterState) => void;
  onResetFilters?: () => void;
}

export const CheckupFilterDrawer: React.FC<CheckupFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<CheckupFilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      const resetState = { checkupType: 'All', status: 'All', dateRange: 'All Time' };
      setLocalFilters(resetState);
      onApplyFilters(resetState);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-teal-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Filter Check-Up History</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Filter records by assessment type & status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs font-medium">
          {/* TYPE */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-mono">
              Check-Up Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'General Wellness', 'Quick Check-Up', 'Routine Check-Up'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, checkupType: t })}
                  className={`py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                    localFilters.checkupType === t
                      ? 'bg-[#00a896] text-white border-teal-300 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-mono">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Completed', 'In Progress'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, status: st })}
                  className={`py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                    localFilters.status === st
                      ? 'bg-[#00a896] text-white border-teal-300 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-mono">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All Time', 'This Month', 'Last 3 Months', 'This Year'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, dateRange: range })}
                  className={`py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                    localFilters.dateRange === range
                      ? 'bg-[#00a896] text-white border-teal-300 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold transition-colors border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

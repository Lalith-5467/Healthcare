import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

export interface FamilyFilterState {
  memberFilter: string;
  activityType: string;
  dateRange: string;
}

interface FamilyFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FamilyFilterState;
  onApplyFilters: (newFilters: FamilyFilterState) => void;
  onResetFilters?: () => void;
}

export const FamilyFilterDrawer: React.FC<FamilyFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters = () => {},
}) => {
  const [localFilters, setLocalFilters] = useState<FamilyFilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md h-auto max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Filter Family Activities</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Filter shared items by member & activity type</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs pr-1">
          {/* MEMBER FILTER */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Family Member
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Father', 'Mother', 'Sister', 'Brother'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, memberFilter: m })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.memberFilter === m
                      ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVITY TYPE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Activity Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Appointments', 'Reminders', 'Pharmacy', 'Consultations', 'Messages'].map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, activityType: act })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.activityType === act
                      ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Time Period
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Today', 'This Week', 'This Month'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, dateRange: range })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.dateRange === range
                      ? 'bg-[#00a896] text-white border-[#00a896]'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 gap-3 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-5 rounded-xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

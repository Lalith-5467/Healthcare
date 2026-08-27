import React from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

export interface RemindersFilterState {
  category: string;
  status: string;
  sortBy: string;
}

interface RemindersFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RemindersFilterState;
  onApplyFilters: (newFilters: RemindersFilterState) => void;
  onResetFilters?: () => void;
}

export const RemindersFilterDrawer: React.FC<RemindersFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<RemindersFilterState>(filters);

  React.useEffect(() => {
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
      const resetState = { category: 'All', status: 'All', sortBy: 'Time' };
      setLocalFilters(resetState);
      onApplyFilters(resetState);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-3xl flex flex-col shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Filter Reminders</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Filter by category type, status & sort order</p>
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
          {/* CATEGORY */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-mono">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Medicine', 'Appointment', 'Video Consultation', 'General'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, category: cat })}
                  className={`py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                    localFilters.category === cat
                      ? 'bg-[#00a896] text-white border-teal-300 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
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
              {['All', 'Upcoming', 'Completed', 'Snoozed'].map((st) => (
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

          {/* SORT BY */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-mono">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Time', 'Priority', 'Category'].map((sb) => (
                <button
                  key={sb}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: sb })}
                  className={`py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                    localFilters.sortBy === sb
                      ? 'bg-[#00a896] text-white border-teal-300 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sb}
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

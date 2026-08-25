import React from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

export interface MedicineFilterState {
  status: string;
  frequency: string;
  sortBy: string;
}

interface MedicineFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MedicineFilterState;
  onApplyFilters: (newFilters: MedicineFilterState) => void;
  onResetFilters?: () => void;
}

export const MedicineFilterDrawer: React.FC<MedicineFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<MedicineFilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: MedicineFilterState = {
      status: 'All',
      frequency: 'All',
      sortBy: 'Newest'
    };
    setLocalFilters(defaultFilters);
    if (onResetFilters) onResetFilters();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-slate-900 dark:text-white my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Filter className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Filter Medicines</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Refine your active prescription list</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OPTIONS */}
        <div className="space-y-5 py-1">
          {/* STATUS FILTER */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Medicine Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Active', 'Completed', 'Paused'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, status: st })}
                  className={`p-2.5 rounded-xl text-xs font-extrabold border text-left transition-all flex items-center justify-between cursor-pointer ${
                    localFilters.status === st
                      ? 'bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border-[#00a896] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
                  }`}
                >
                  <span>{st}</span>
                  {localFilters.status === st && <Check className="w-4 h-4 text-[#00a896]" />}
                </button>
              ))}
            </div>
          </div>

          {/* FREQUENCY FILTER */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dosage Frequency
            </label>
            <div className="space-y-1.5">
              {['All', 'Once daily', 'Twice daily', 'Thrice daily', 'As needed'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, frequency: freq })}
                  className={`w-full p-2.5 rounded-xl text-xs font-extrabold border text-left transition-all flex items-center justify-between cursor-pointer ${
                    localFilters.frequency === freq
                      ? 'bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border-[#00a896] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
                  }`}
                >
                  <span>{freq}</span>
                  {localFilters.frequency === freq && <Check className="w-4 h-4 text-[#00a896]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

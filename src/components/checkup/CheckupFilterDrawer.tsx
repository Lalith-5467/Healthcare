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
  onResetFilters: () => void;
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
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Filter Check-Up History</h3>
              <p className="text-xs text-slate-400">Filter records by assessment type & status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          {/* TYPE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Check-Up Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'General Wellness', 'Quick Check-Up', 'Routine Check-Up'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, checkupType: t })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.checkupType === t
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Completed', 'In Progress'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, status: st })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.status === st
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* TIME PERIOD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Time Period
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Today', 'This Week', 'This Month', 'All Time'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, dateRange: r })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.dateRange === r
                      ? 'bg-[#00a896] text-white border-teal-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

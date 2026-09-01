import React, { useState } from 'react';
import { X, Filter, Star, RotateCcw } from 'lucide-react';

export interface PharmacyFilterState {
  distance: string;
  rating: string;
  delivery: 'All' | 'Home Delivery Only' | 'Pickup Only';
  openNow: boolean;
}

interface PharmacyFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PharmacyFilterState;
  onApplyFilters: (filters: PharmacyFilterState) => void;
  onResetFilters: () => void;
}

export const PharmacyFilterDrawer: React.FC<PharmacyFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<PharmacyFilterState>(filters);

  React.useEffect(() => {
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896] dark:text-cyan-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Filter Pharmacies</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Filter by distance, rating & delivery availability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          {/* DISTANCE */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Maximum Distance
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Any Distance', value: 'Any' },
                { label: '< 2 km', value: '2' },
                { label: '< 5 km', value: '5' },
                { label: '< 10 km', value: '10' }
              ].map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setLocalFilters((prev) => ({ ...prev, distance: d.label }))}
                  className={`p-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.distance === d.label
                      ? 'bg-teal-500/10 text-teal-700 dark:text-cyan-300 border-[#00a896]'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* RATING */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Any', '★ 4.0 & above', '★ 4.5 & above', '★ 4.8 & above'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setLocalFilters((prev) => ({ ...prev, rating: r }))}
                  className={`p-3 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    localFilters.rating === r
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DELIVERY MODE */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Delivery Options
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['All', 'Home Delivery Only', 'Pickup Only'] as const).map((dm) => (
                <button
                  key={dm}
                  type="button"
                  onClick={() => setLocalFilters((prev) => ({ ...prev, delivery: dm }))}
                  className={`p-2.5 rounded-xl font-bold border text-center transition-colors cursor-pointer ${
                    localFilters.delivery === dm
                      ? 'bg-teal-500/10 text-teal-700 dark:text-cyan-300 border-[#00a896]'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {dm === 'All' ? 'All Types' : dm.replace(' Only', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

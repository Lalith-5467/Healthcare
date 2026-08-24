import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';
import type { HospitalFilterState } from './hospitalsData';

interface HospitalFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: HospitalFilterState;
  onApplyFilters: (newFilters: HospitalFilterState) => void;
  onResetFilters: () => void;
}

export const HospitalFilterDrawer: React.FC<HospitalFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<HospitalFilterState>(filters);

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
              <h3 className="text-lg font-extrabold text-white">Filter Hospitals</h3>
              <p className="text-xs text-slate-400">Filter by distance, rating & status</p>
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
          {/* DISTANCE RANGE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Distance Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Within 1 km', 'Within 3 km', 'Within 5 km', 'Any Distance'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, distanceRange: d })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.distanceRange === d
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* MINIMUM RATING */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['4.5+', '4.0+', '3.5+', 'Any Rating'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, minRating: r })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.minRating === r
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ★ {r}
                </button>
              ))}
            </div>
          </div>

          {/* TOGGLES */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-bold text-white">Open Now Only</span>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, openNowOnly: !localFilters.openNowOnly })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  localFilters.openNowOnly ? 'bg-[#00a896]' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localFilters.openNowOnly ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-bold text-white">24x7 Emergency Care Only</span>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, emergencyOnly: !localFilters.emergencyOnly })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  localFilters.emergencyOnly ? 'bg-rose-500' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localFilters.emergencyOnly ? 'right-1' : 'left-1'
                }`} />
              </button>
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

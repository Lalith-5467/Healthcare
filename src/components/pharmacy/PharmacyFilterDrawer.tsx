import React from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

export interface PharmacyFilterState {
  distance: string;
  rating: string;
  delivery: string;
  openNow: boolean;
}

interface PharmacyFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PharmacyFilterState;
  onApplyFilters: (newFilters: PharmacyFilterState) => void;
  onResetFilters: () => void;
}

export const PharmacyFilterDrawer: React.FC<PharmacyFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<PharmacyFilterState>(filters);

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Filter Pharmacies</h3>
              <p className="text-xs text-slate-400">Filter by distance, rating & delivery availability</p>
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
        <div className="space-y-6 py-6 flex-1 overflow-y-auto">
          {/* DISTANCE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                  onClick={() => setLocalFilters({ ...localFilters, distance: d.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.distance === d.value
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* RATING */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Any', value: 'Any' },
                { label: '4.0+ ★', value: '4.0' },
                { label: '4.5+ ★', value: '4.5' }
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, rating: r.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.rating === r.value
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* DELIVERY SERVICE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Delivery Option
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'All Options', value: 'All' },
                { label: 'Home Delivery', value: 'Delivery' },
                { label: 'Self Pickup', value: 'Pickup' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, delivery: opt.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.delivery === opt.value
                      ? 'bg-[#00a896] text-white border-teal-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
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

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
  onResetFilters: () => void;
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
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Filter Medicines</h3>
              <p className="text-xs text-slate-400">Refine by status, dosage frequency & sorting</p>
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
          {/* STATUS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Medication Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Active', 'Completed', 'Paused'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, status: st })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.status === st
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* FREQUENCY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Dosage Frequency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'All Frequencies', value: 'All' },
                { label: 'Once Daily', value: 'Once daily' },
                { label: 'Twice Daily', value: 'Twice daily' },
                { label: 'As Needed', value: 'As needed' }
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, frequency: freq.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.frequency === freq.value
                      ? 'bg-[#00a896] text-white border-teal-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* SORT BY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Sort Order
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Newest', value: 'Newest' },
                { label: 'Oldest', value: 'Oldest' },
                { label: 'A – Z', value: 'A-Z' }
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: s.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.sortBy === s.value
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {s.label}
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
            className="flex-1 py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

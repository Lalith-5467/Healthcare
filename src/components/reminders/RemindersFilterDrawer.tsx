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
  onResetFilters: () => void;
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
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Filter Reminders</h3>
              <p className="text-xs text-slate-400">Filter by category type, status & sort order</p>
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
          {/* CATEGORY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Category Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Medication', 'Appointment', 'Pharmacy', 'Consultation', 'General', 'System'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, category: cat })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.category === cat
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Reminder Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Upcoming', 'Completed', 'Snoozed', 'Dismissed', 'Missed'].map((st) => (
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

          {/* SORT BY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Sort Order
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Time (Chronological)', value: 'Time' },
                { label: 'Unread First', value: 'Unread First' },
                { label: 'High Priority First', value: 'Priority' },
                { label: 'Newest Added', value: 'Newest' }
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: s.value })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.sortBy === s.value
                      ? 'bg-[#00a896] text-white border-teal-400'
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

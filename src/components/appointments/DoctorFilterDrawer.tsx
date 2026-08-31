import React from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';
import { MOCK_SPECIALITIES } from './appointmentsData';

export interface DoctorFilterState {
  speciality: string;
  gender: string;
  experience: string;
  rating: string;
  consultationType: string;
  availability: string;
}

interface DoctorFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DoctorFilterState;
  onApplyFilters: (newFilters: DoctorFilterState) => void;
  onResetFilters: () => void;
}

export const DoctorFilterDrawer: React.FC<DoctorFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<DoctorFilterState>(filters);

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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896]">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Filter Doctors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Refine search by speciality, rating & availability</p>
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
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs font-medium">
          {/* SPECIALITY */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
              Medical Speciality
            </label>
            <select
              value={localFilters.speciality}
              onChange={(e) => setLocalFilters({ ...localFilters, speciality: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Specialities</option>
              {MOCK_SPECIALITIES.map((spec) => (
                <option key={spec.id} value={spec.name}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* RATING */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
              Minimum Rating
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['All', '4.5+', '4.8+', '4.9+'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, rating: r })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                    localFilters.rating === r
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* AVAILABILITY */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
              Availability
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['All', 'Today', 'Tomorrow'].map((avail) => (
                <button
                  key={avail}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, availability: avail })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                    localFilters.availability === avail
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {avail}
                </button>
              ))}
            </div>
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
              Doctor Gender
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['All', 'Male', 'Female'].map((gen) => (
                <button
                  key={gen}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, gender: gen })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                    localFilters.gender === gen
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

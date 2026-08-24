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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Filter Doctors</h3>
              <p className="text-xs text-slate-400">Refine search by experience, rating & availability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FILTER SECTIONS */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto">
          {/* SPECIALITY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Speciality
            </label>
            <select
              value={localFilters.speciality}
              onChange={(e) => setLocalFilters({ ...localFilters, speciality: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#00a896]"
            >
              <option value="All">All Specialities</option>
              {MOCK_SPECIALITIES.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.doctorCount})
                </option>
              ))}
            </select>
          </div>

          {/* CONSULTATION TYPE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Consultation Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Video', 'In-Person'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, consultationType: mode })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.consultationType === mode
                      ? 'bg-[#00a896] text-white border-teal-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Experience Years
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'All', value: 'All' },
                { label: '0–5 years', value: '0-5' },
                { label: '5–10 years', value: '5-10' },
                { label: '10+ years', value: '10+' }
              ].map((exp) => (
                <button
                  key={exp.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, experience: exp.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.experience === exp.value
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* RATING */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Minimum Doctor Rating
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['All', '4.5+', '4.8+'].map((rat) => (
                <button
                  key={rat}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, rating: rat })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.rating === rat
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ★ {rat}
                </button>
              ))}
            </div>
          </div>

          {/* AVAILABILITY */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Availability
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Today', 'Tomorrow'].map((avail) => (
                <button
                  key={avail}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, availability: avail })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.availability === avail
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {avail}
                </button>
              ))}
            </div>
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Doctor Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Male', 'Female'].map((gen) => (
                <button
                  key={gen}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, gender: gen })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    localFilters.gender === gen
                      ? 'bg-[#00a896] text-white border-teal-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {gen}
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

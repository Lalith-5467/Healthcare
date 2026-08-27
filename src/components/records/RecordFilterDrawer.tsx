import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import type { RecordFilterState } from './recordsData';

interface RecordFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RecordFilterState;
  onApplyFilters: (filters: RecordFilterState) => void;
  onResetFilters: () => void;
}

export const RecordFilterDrawer: React.FC<RecordFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = useState<RecordFilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  const recordTypes = ['All', 'Lab Report', 'Prescription', 'Consultation', 'Imaging', 'Discharge', 'Vaccination', 'Other'];
  const years = ['All', '2026', '2025', '2024', 'Older'];
  const doctors = ['All', 'Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Arun Kumar', 'Dr. Anita Desai'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end font-sans">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* SLIDE-IN PANEL */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between z-50 select-none overflow-y-auto"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
                <Filter className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Filter Records</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FILTER OPTIONS BODY */}
          <div className="p-6 space-y-5 flex-1 text-xs">
            {/* RECORD TYPE */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Document Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {recordTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, type })}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      localFilters.type === type
                        ? 'bg-[#00a896] text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* YEAR */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Year Recorded
              </label>
              <div className="flex flex-wrap gap-1.5">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, year })}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      localFilters.year === year
                        ? 'bg-[#00a896] text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* DOCTOR */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Attending Doctor
              </label>
              <div className="space-y-1.5">
                {doctors.map((doc) => (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, doctor: doc })}
                    className={`w-full px-3 py-2 rounded-xl font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                      localFilters.doctor === doc
                        ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-[#00a896]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{doc}</span>
                    {localFilters.doctor === doc && <Check className="w-3.5 h-3.5 text-[#00a896]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* SORT BY */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Sort Order
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Date (Newest)', 'Date (Oldest)', 'Title (A-Z)', 'Doctor Name'] as const).map((sortBy) => (
                  <button
                    key={sortBy}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, sortBy })}
                    className={`p-2 rounded-xl font-bold text-center transition-all cursor-pointer ${
                      localFilters.sortBy === sortBy
                        ? 'bg-[#00a896] text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sortBy}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/90">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleApply}
              className="flex-1 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

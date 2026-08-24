import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw, Check } from 'lucide-react';

export interface FilterState {
  type: string;
  dateRange: string;
  status: string;
  doctor: string;
  hospital: string;
}

interface RecordFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const RecordFilterDrawer: React.FC<RecordFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* SLIDE-IN PANEL */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col justify-between z-50 select-none overflow-y-auto"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Filter className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-white">Filter Records</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FILTER OPTIONS BODY */}
          <div className="p-6 space-y-5 flex-1 text-xs">
            {/* RECORD TYPE */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300">Record Type</label>
              <select
                value={localFilters.type}
                onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              >
                <option value="All">All Types</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Consultation">Consultation</option>
                <option value="Imaging">Imaging</option>
                <option value="Discharge">Discharge</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DATE RANGE */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Today', 'This Week', 'This Month', 'Last 3 Months', 'This Year'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, dateRange: range })}
                    className={`py-2 px-3 rounded-xl font-bold border text-left transition-all cursor-pointer ${
                      localFilters.dateRange === range
                        ? 'bg-[#00a896] text-white border-[#00a896]'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* STATUS */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300">Record Status</label>
              <select
                value={localFilters.status}
                onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              >
                <option value="All">All Statuses</option>
                <option value="Normal">Normal (Green)</option>
                <option value="Attention">Attention (Amber)</option>
                <option value="Reviewed">Reviewed (Cyan)</option>
                <option value="Pending">Pending (Purple)</option>
              </select>
            </div>

            {/* DOCTOR */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300">Attending Doctor</label>
              <select
                value={localFilters.doctor}
                onChange={(e) => setLocalFilters({ ...localFilters, doctor: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              >
                <option value="All">All Doctors</option>
                <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
                <option value="Dr. Anita Sharma">Dr. Anita Sharma</option>
                <option value="Dr. Vikram Sethi">Dr. Vikram Sethi</option>
                <option value="Dr. Sunita Patel">Dr. Sunita Patel</option>
              </select>
            </div>

            {/* HOSPITAL */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300">Hospital / Facility</label>
              <select
                value={localFilters.hospital}
                onChange={(e) => setLocalFilters({ ...localFilters, hospital: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              >
                <option value="All">All Hospitals</option>
                <option value="Apollo Hospital">Apollo Hospital</option>
                <option value="Fortis Healthcare">Fortis Healthcare</option>
                <option value="Metropolis Diagnostics">Metropolis Diagnostics</option>
              </select>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

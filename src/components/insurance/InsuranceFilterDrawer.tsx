import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';
import type { InsuranceFilterState } from './insuranceData';

interface InsuranceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InsuranceFilterState;
  onApplyFilters: (newFilters: InsuranceFilterState) => void;
  onResetFilters?: () => void;
}

export const InsuranceFilterDrawer: React.FC<InsuranceFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<InsuranceFilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      const resetState = { policyStatus: 'All', claimStatus: 'All', docCategory: 'All' };
      setLocalFilters(resetState);
      onApplyFilters(resetState);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896]">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Filter Insurance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter policies, claims & documents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 py-4 flex-1 overflow-y-auto text-xs font-medium">
          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-2 font-mono text-[10px]">Policy Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Active', 'Expiring Soon', 'Expired'].map((s) => (
                <button
                  key={s}
                  onClick={() => setLocalFilters({ ...localFilters, policyStatus: s })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                    localFilters.policyStatus === s
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-2 font-mono text-[10px]">Claim Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Settled', 'Under Processing', 'Submitted'].map((cs) => (
                <button
                  key={cs}
                  onClick={() => setLocalFilters({ ...localFilters, claimStatus: cs })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                    localFilters.claimStatus === cs
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cs}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-600 dark:text-slate-400 mb-2 font-mono text-[10px]">Document Category</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Policy Bond', 'Tax Certificate', 'Claim Receipt'].map((dc) => (
                <button
                  key={dc}
                  onClick={() => setLocalFilters({ ...localFilters, docCategory: dc })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                    localFilters.docCategory === dc
                      ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {dc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

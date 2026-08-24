import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';
import type { InsuranceFilterState } from './insuranceData';

interface InsuranceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InsuranceFilterState;
  onApplyFilters: (newFilters: InsuranceFilterState) => void;
  onResetFilters: () => void;
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
              <h3 className="text-lg font-extrabold text-white">Filter Insurance</h3>
              <p className="text-xs text-slate-400">Filter policies, claims & documents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-400 mb-2">Policy Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Active', 'Expiring Soon', 'Expired'].map((s) => (
                <button
                  key={s}
                  onClick={() => setLocalFilters({ ...localFilters, policyStatus: s })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.policyStatus === s ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-400 mb-2">Claim Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Approved', 'Pending', 'Rejected'].map((cs) => (
                <button
                  key={cs}
                  onClick={() => setLocalFilters({ ...localFilters, claimStatus: cs })}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    localFilters.claimStatus === cs ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {cs}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button onClick={() => { onResetFilters(); onClose(); }} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button onClick={() => { onApplyFilters(localFilters); onClose(); }} className="flex-1 py-2.5 px-4 rounded-xl font-extrabold bg-[#00a896] text-white cursor-pointer flex items-center justify-center gap-1 shadow">
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

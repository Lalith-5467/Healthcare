import React from 'react';
import { X, Star, MapPin, Clock, ShieldCheck, Check } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalCompareModalProps {
  hospitals: HospitalItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
}

export const HospitalCompareModal: React.FC<HospitalCompareModalProps> = ({
  hospitals,
  isOpen,
  onClose,
  onRemoveFromCompare,
}) => {
  if (!isOpen || !hospitals.length) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-y-auto text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
              Side-by-Side Facility Comparison ({hospitals.length} Selected)
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Compare Nearby Hospitals</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPARISON GRID TABLE */}
        <div className="flex-1 overflow-x-auto overflow-y-auto py-2">
          <div className={`grid gap-3 min-w-[550px] ${
            hospitals.length === 1 ? 'grid-cols-1' : hospitals.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {hospitals.map((hosp) => (
              <div key={hosp.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative text-xs">
                <button
                  onClick={() => onRemoveFromCompare(hosp.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-900 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 font-mono uppercase">{hosp.type}</span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm pr-6">{hosp.name}</h4>
                </div>

                <div className="space-y-2 font-mono text-[11px] border-t border-slate-200 dark:border-slate-800 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Rating:</span>
                    <strong className="text-amber-500 dark:text-amber-400">★ {hosp.rating} ({hosp.reviewsCount})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Distance:</span>
                    <strong className="text-cyan-600 dark:text-cyan-300">{hosp.distance}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <strong className="text-teal-600 dark:text-teal-400">{hosp.status}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Emergency:</span>
                    <strong className={hosp.emergencyCare ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      {hosp.emergencyCare ? '24x7 Active' : 'None'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Insurance:</span>
                    <strong className="text-purple-600 dark:text-purple-300">{hosp.insuranceAccepted}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">Top Specialties</span>
                  <div className="flex flex-wrap gap-1">
                    {hosp.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md cursor-pointer text-center"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
};

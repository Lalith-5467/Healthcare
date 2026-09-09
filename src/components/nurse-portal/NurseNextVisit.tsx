import React from 'react';
import { IconArrowRight, IconMapPin, IconClock } from '@tabler/icons-react';

interface NurseNextVisitProps {
  onNavigate?: (id: string) => void;
}

export const NurseNextVisit: React.FC<NurseNextVisitProps> = ({ onNavigate }) => {
  return (
    <section className="pt-2">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1 uppercase tracking-wider">
        Next visit
      </h3>
      
      <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-teal-100 dark:border-teal-900/30 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-800">
            10:30
          </div>
          
          <div className="flex flex-col">
            <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-0.5">
              Srinivasan K, 68
            </h4>
            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 gap-1.5">
              <span className="text-teal-600 dark:text-teal-400">Physiotherapy</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <IconMapPin className="w-3 h-3" /> Velachery
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-0 dark:border-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full">
            <IconClock className="w-3.5 h-3.5" />
            Starts in 45 min
          </div>
          
          <button 
            onClick={() => onNavigate && onNavigate('schedule')}
            className="text-teal-600 dark:text-teal-400 text-sm font-bold flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            View details <IconArrowRight className="w-4 h-4" />
          </button>
        </div>
        
      </div>
    </section>
  );
};

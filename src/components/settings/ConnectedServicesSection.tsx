import React from 'react';
import type { ConnectedServiceItem } from './settingsData';

interface ConnectedServicesSectionProps {
  services: ConnectedServiceItem[];
  onToggleService: (id: string) => void;
}

export const ConnectedServicesSection: React.FC<ConnectedServicesSectionProps> = ({
  services,
  onToggleService,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Connected Patient Services</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Internal application modules and patient portal integration status</p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {services.map((serv) => (
          <div key={serv.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#00a896] font-bold uppercase block font-sans">{serv.category}</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-sans">{serv.name}</h4>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-sans">
                {serv.status}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans">
              <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Module Enabled</span>
              <button
                onClick={() => onToggleService(serv.id)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  serv.enabled ? 'bg-[#00a896]' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  serv.enabled ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

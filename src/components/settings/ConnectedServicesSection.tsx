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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Connected Patient Services</h3>
          <p className="text-xs text-slate-400">Internal application modules and patient portal integration status</p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {services.map((serv) => (
          <div key={serv.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase block font-sans">{serv.category}</span>
                <h4 className="font-extrabold text-white text-sm font-sans">{serv.name}</h4>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {serv.status}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-sans">
              <span className="text-slate-400 text-xs">Module Enabled</span>
              <button
                onClick={() => onToggleService(serv.id)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  serv.enabled ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'
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

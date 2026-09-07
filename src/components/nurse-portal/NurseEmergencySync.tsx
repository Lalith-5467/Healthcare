import React from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';

export const NurseEmergencySync: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg p-5 flex flex-col h-full relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 blur-2xl rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <IconAlertTriangle className="w-5 h-5 text-rose-500" stroke={2.5} />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Emergency Sync
          </h2>
        </div>
        
        <p className="text-xs font-medium text-slate-400 mb-4 leading-relaxed flex-1">
          Use this to instantly alert nearby paramedics and the primary care hospital if a patient's vitals become critically unstable.
        </p>

        <button className="w-full py-3 rounded-xl bg-[#e04848] hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2">
          Broadcast Emergency SOS
        </button>
      </div>
    </div>
  );
};

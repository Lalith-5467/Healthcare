import React from 'react';
import { AlertTriangle, QrCode } from 'lucide-react';

interface EmergencyQuickCardProps {
  onOpenEmergency: () => void;
}

export const EmergencyQuickCard: React.FC<EmergencyQuickCardProps> = ({ onOpenEmergency }) => {
  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-rose-900/20 to-slate-900 border border-rose-500/30 text-white shadow-xl flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-black text-white tracking-tight">
            Emergency Assistance
          </h3>
          <p className="text-[11px] text-slate-300">
            Quick access to your emergency contacts & SOS QR card.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenEmergency}
        className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
      >
        <QrCode className="w-4 h-4" />
        <span>SOS Card</span>
      </button>
    </div>
  );
};

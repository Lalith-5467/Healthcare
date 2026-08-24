import React from 'react';
import { ShieldCheck, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EmergencyHeaderStatusProps {
  onOpenSettings: () => void;
}

export const EmergencyHeaderStatus: React.FC<EmergencyHeaderStatusProps> = ({
  onOpenSettings,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg text-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-white text-sm">Emergency Assistance</h4>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Ready
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">Your emergency contacts and safety information are configured and ready.</p>
        </div>
      </div>

      <button
        onClick={onOpenSettings}
        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
      >
        <Settings className="w-4 h-4 text-cyan-400" />
        <span>Emergency Settings</span>
      </button>
    </div>
  );
};

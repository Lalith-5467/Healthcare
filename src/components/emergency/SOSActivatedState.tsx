import React from 'react';
import { AlertTriangle, MapPin, Users, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import type { EmergencyContactItem } from './emergencyData';

interface SOSActivatedStateProps {
  contacts: EmergencyContactItem[];
  locationName: string;
  onCancelSimulation: () => void;
  onOpenServices: () => void;
}

export const SOSActivatedState: React.FC<SOSActivatedStateProps> = ({
  contacts,
  locationName,
  onCancelSimulation,
  onOpenServices,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-rose-950/50 to-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl font-extrabold shadow-lg animate-pulse">
            🚨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                SOS ACTIVATED
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Simulation Mode</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">Emergency Response Sequence Active</h3>
          </div>
        </div>

        <button
          onClick={onCancelSimulation}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-rose-300 border border-rose-500/40 font-bold transition-colors cursor-pointer self-stretch sm:self-auto text-center"
        >
          Cancel Simulation
        </button>
      </div>

      {/* DEMO NOTICE BANNER */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 font-mono text-[11px] text-rose-300 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Demo Mode — No real emergency alert or ambulance dispatch has been sent.</span>
      </div>

      {/* NOTIFIED CONTACTS TIMELINE */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Simulated Emergency Contact Notifications</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {contacts.map((c) => (
            <div key={c.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-white font-sans">{c.name} ({c.relationship})</h5>
                <span className="text-[10px] text-emerald-400">✓ Alert simulated</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ))}
        </div>
      </div>

      {/* LOCATION PREVIEW */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 font-mono">
        <span className="text-[10px] text-slate-400 uppercase font-bold block">Broadcast Location</span>
        <strong className="text-cyan-300 text-xs block font-sans">📍 {locationName}</strong>
      </div>
    </div>
  );
};

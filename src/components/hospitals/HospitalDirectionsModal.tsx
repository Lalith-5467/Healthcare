import React from 'react';
import { X, Navigation, MapPin, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalDirectionsModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalDirectionsModal: React.FC<HospitalDirectionsModalProps> = ({
  hospital,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !hospital) return null;

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Route & Directions</h3>
              <p className="text-xs text-slate-400">Estimated route to {hospital.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ROUTE SUMMARY HERO */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">Distance: <strong className="text-cyan-300">{hospital.distance}</strong></span>
            <span className="text-slate-400">Drive Time: <strong className="text-teal-400">5–8 mins</strong></span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
              <span>Your Current Location (Camp Road, Selaiyur)</span>
            </div>
            <div className="w-0.5 h-4 bg-slate-700 ml-1" />
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{hospital.name} ({hospital.address})</span>
            </div>
          </div>
        </div>

        {/* DEMO TURN BY TURN STEPS */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider">Demo Route Steps</h4>
          <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">1. Head East on Camp Road Main St (800m)</div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">2. Turn Right onto Healthcare Parkway (400m)</div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">3. Hospital gate is on your left</div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleOpenGoogleMaps}
            className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Maps Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

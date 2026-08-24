import React from 'react';
import { MapPin, Navigation, RefreshCw, Building2 } from 'lucide-react';

interface EmergencyLocationSectionProps {
  locationName: string;
  onRefreshLocation: () => void;
}

export const EmergencyLocationSection: React.FC<EmergencyLocationSectionProps> = ({
  locationName,
  onRefreshLocation,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Your Current Location</h3>
            <p className="text-xs text-slate-400 font-mono">📍 {locationName}</p>
          </div>
        </div>

        <button
          onClick={onRefreshLocation}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Location</span>
        </button>
      </div>

      {/* CUSTOM CSS MAP PREVIEW */}
      <div className="bg-[#070d19] border border-slate-800 rounded-2xl h-52 sm:h-64 relative overflow-hidden flex items-center justify-center select-none shadow-inner">
        {/* ROAD GRID */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* HIGHWAY STRIPES */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/3 left-0 w-full h-1 bg-cyan-500/40 rotate-6" />
          <div className="absolute top-2/3 left-0 w-full h-1 bg-rose-500/40 -rotate-12" />
        </div>

        {/* YOU PIN */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 animate-ping absolute" />
          <div className="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-slate-950 shadow-md">
            <Navigation className="w-3 h-3 fill-slate-950" />
          </div>
          <span className="text-[9px] font-extrabold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded-full border border-cyan-500/40 mt-1 font-mono">
            📍 You
          </span>
        </div>

        {/* HOSPITAL MARKER */}
        <div className="absolute top-1/4 left-3/4 z-10 flex flex-col items-center">
          <div className="p-1 rounded-lg bg-slate-900 border border-teal-500/60 text-teal-400 text-[10px] font-bold font-mono flex items-center gap-1 shadow">
            <Building2 className="w-3 h-3" />
            <span>CityCare Hospital (1.2 km)</span>
          </div>
        </div>

        <span className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800">
          Demo Emergency Map
        </span>
      </div>
    </div>
  );
};

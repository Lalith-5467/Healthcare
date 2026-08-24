import React, { useState } from 'react';
import { MapPin, Navigation, Plus, Minus, Building2, Star, Clock, ExternalLink, ShieldCheck, Eye, Layers } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalMapSectionProps {
  hospitals: HospitalItem[];
  selectedHospital: HospitalItem | null;
  onSelectHospital: (hosp: HospitalItem) => void;
  onOpenDetails: (hosp: HospitalItem) => void;
  viewMode: 'split' | 'map' | 'list';
  onChangeViewMode: (mode: 'split' | 'map' | 'list') => void;
}

export const HospitalMapSection: React.FC<HospitalMapSectionProps> = ({
  hospitals,
  selectedHospital,
  onSelectHospital,
  onOpenDetails,
  viewMode,
  onChangeViewMode,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (viewMode === 'list') return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between h-[380px] sm:h-[450px]">
      {/* MAP CONTROLS HEADER BAR */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-xs">Interactive Hospital Finder Map</h4>
            <p className="text-[10px] text-slate-400 font-mono">Custom HTML/CSS Map • {hospitals.length} Facilities Marked</p>
          </div>
        </div>

        {/* VIEW MODE TOGGLE BUTTONS */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onChangeViewMode('split')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Map
          </button>
        </div>
      </div>

      {/* CUSTOM STYLIZED HTML/CSS MAP CANVAS */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#070d19] select-none">
        {/* ROAD GRID BACKGROUND PATTERN */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* DIAGONAL STYLED HIGHWAY LINES */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-cyan-500/40 rotate-12" />
          <div className="absolute top-2/3 left-0 w-full h-1 bg-teal-500/40 -rotate-6" />
          <div className="absolute left-1/3 top-0 h-full w-1 bg-slate-700/60" />
        </div>

        {/* PATIENT CURRENT LOCATION PULSE PIN */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 animate-ping absolute" />
          <div className="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-slate-950 font-extrabold shadow-lg">
            <Navigation className="w-3.5 h-3.5 fill-slate-950" />
          </div>
          <span className="text-[10px] font-extrabold text-cyan-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-cyan-500/40 mt-1 shadow font-mono">
            📍 You
          </span>
        </div>

        {/* HOSPITAL MARKERS */}
        {hospitals.map((hosp) => {
          const isSelected = selectedHospital?.id === hosp.id;
          return (
            <button
              key={hosp.id}
              onClick={() => onSelectHospital(hosp)}
              style={{ top: `${hosp.lat}%`, left: `${hosp.lng}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform cursor-pointer group ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl border flex items-center gap-1.5 shadow-xl transition-colors ${
                  isSelected
                    ? 'bg-teal-500 text-white border-white'
                    : hosp.emergencyCare
                    ? 'bg-slate-900 border-rose-500/60 text-rose-400 hover:border-rose-400'
                    : 'bg-slate-900 border-teal-500/60 text-teal-400 hover:border-teal-400'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-extrabold font-mono">{hosp.rating}★</span>
              </div>
            </button>
          );
        })}

        {/* POPUP PREVIEW CARD FOR SELECTED HOSPITAL */}
        {selectedHospital && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-30 max-w-sm bg-slate-900/95 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md space-y-2 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 font-mono uppercase">{selectedHospital.type}</span>
                <h4 className="font-extrabold text-white text-sm">{selectedHospital.name}</h4>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ★ {selectedHospital.rating}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
              <span>📍 {selectedHospital.distance}</span>
              <span className="text-teal-400">🕒 {selectedHospital.status}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between gap-2">
              <button
                onClick={() => onOpenDetails(selectedHospital)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* MAP ZOOM & CONTROLS */}
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-slate-300 shadow-lg">
          <button
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.8))}
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

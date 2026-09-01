import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Plus, Minus, Building2, ExternalLink } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between h-[380px] sm:h-[450px] font-sans">
      {/* MAP CONTROLS HEADER BAR */}
      <div className="p-4 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-teal-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Interactive Hospital Finder Map</h4>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">{hospitals.length} Facilities Marked</p>
          </div>
        </div>

        {/* VIEW MODE TOGGLE BUTTONS */}
        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-mono">
          <button
            onClick={() => onChangeViewMode('split')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer font-sans ${
              viewMode === 'split' ? 'bg-[#00a896] text-white shadow-sm' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer font-sans ${
              viewMode === 'map' ? 'bg-[#00a896] text-white shadow-sm' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Full Map
          </button>
        </div>
      </div>

      {/* CUSTOM STYLIZED HTML/CSS MAP CANVAS */}
      <div className="relative flex-1 w-full overflow-hidden bg-slate-100 dark:bg-[#070d19] select-none">
        {/* ROAD GRID BACKGROUND PATTERN */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* DIAGONAL STYLED HIGHWAY LINES */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-teal-500/40 rotate-12" />
          <div className="absolute top-2/3 left-0 w-full h-1 bg-cyan-500/40 -rotate-6" />
          <div className="absolute left-1/3 top-0 h-full w-1 bg-slate-300 dark:bg-slate-700/60" />
        </div>

        {/* PATIENT CURRENT LOCATION PULSE PIN */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#00a896]/20 border border-[#00a896] animate-ping absolute" />
          <div className="w-6 h-6 rounded-full bg-[#00a896] border-2 border-white flex items-center justify-center text-white font-extrabold shadow-lg">
            <Navigation className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="text-[10px] font-extrabold text-[#00a896] dark:text-cyan-300 bg-white dark:bg-slate-950/90 px-2 py-0.5 rounded-full border border-teal-500/40 mt-1 shadow font-mono">
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
                className={`p-1.5 rounded-xl border flex items-center gap-1.5 shadow-xl transition-colors font-extrabold ${
                  isSelected
                    ? 'bg-[#00a896] text-white border-white ring-2 ring-teal-300'
                    : hosp.emergencyCare
                    ? 'bg-white dark:bg-slate-900 border-rose-500/60 text-rose-700 dark:text-rose-400 hover:border-rose-500'
                    : 'bg-white dark:bg-slate-900 border-teal-500/60 text-teal-700 dark:text-teal-400 hover:border-teal-500'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold">{hosp.rating}★</span>
              </div>
            </button>
          );
        })}

        {/* POPUP PREVIEW CARD FOR SELECTED HOSPITAL */}
        {selectedHospital && (
          <motion.div 
            drag
            dragMomentum={false}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-30 max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md space-y-2 animate-in slide-in-from-bottom-4 duration-200 text-slate-900 dark:text-white cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#00a896] dark:text-teal-400 font-mono uppercase">{selectedHospital.type}</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedHospital.name}</h4>
              </div>
              <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ★ {selectedHospital.rating}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-semibold">
              <span>📍 {selectedHospital.distance}</span>
              <span className="text-[#00a896] dark:text-teal-400">🕒 {selectedHospital.status}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-2">
              <button
                onClick={() => onOpenDetails(selectedHospital)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                <span>View Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* MAP ZOOM & CONTROLS */}
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-lg">
          <button
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.8))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

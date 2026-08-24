import React from 'react';
import { Star, MapPin, Clock, Phone, Navigation, Heart, ShieldCheck, Check, Plus, Building2 } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalCardProps {
  hospital: HospitalItem;
  isSelected?: boolean;
  isSaved?: boolean;
  isCompared?: boolean;
  onSelect: (hosp: HospitalItem) => void;
  onOpenDetails: (hosp: HospitalItem) => void;
  onOpenDirections: (hosp: HospitalItem) => void;
  onOpenCall: (hosp: HospitalItem) => void;
  onToggleSave: (hosp: HospitalItem) => void;
  onToggleCompare: (hosp: HospitalItem) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  isSelected = false,
  isSaved = false,
  isCompared = false,
  onSelect,
  onOpenDetails,
  onOpenDirections,
  onOpenCall,
  onToggleSave,
  onToggleCompare,
}) => {
  return (
    <div
      onClick={() => onSelect(hospital)}
      className={`p-5 bg-slate-900/90 rounded-3xl border transition-all space-y-4 shadow-lg cursor-pointer group ${
        isSelected
          ? 'border-teal-400 bg-slate-900 shadow-teal-500/10'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* HEADER ROW */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={hospital.imageUrl}
            alt={hospital.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-700 group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
              {hospital.type}
            </span>
            <h4 className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
              {hospital.name}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(hospital);
            }}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSaved ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save hospital'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* RATING, DISTANCE, STATUS TAGS */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{hospital.rating}</span>
          <span className="text-slate-400 text-[10px]">({hospital.reviewsCount})</span>
        </span>

        <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-cyan-300 border border-slate-700 font-bold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{hospital.distance}</span>
        </span>

        <span className={`px-2.5 py-1 rounded-xl border font-bold flex items-center gap-1 ${
          hospital.status === '24 Hours' || hospital.status === 'Open Now'
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{hospital.status}</span>
        </span>

        {hospital.emergencyCare && (
          <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold">
            🚨 24x7 Emergency
          </span>
        )}
      </div>

      {/* ADDRESS & TOP SPECIALTIES */}
      <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <p className="line-clamp-1">{hospital.address}</p>

        <div className="flex flex-wrap gap-1">
          {hospital.specialties.slice(0, 3).map((spec) => (
            <span key={spec} className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
              {spec}
            </span>
          ))}
          {hospital.specialties.length > 3 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-teal-400 text-[10px] font-mono border border-slate-800">
              +{hospital.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 text-xs">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(hospital);
          }}
          className="col-span-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white font-extrabold transition-all cursor-pointer shadow-sm text-center"
        >
          View Details
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDirections(hospital);
          }}
          className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
          title="Directions"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Route</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(hospital);
          }}
          className={`py-2 px-2 rounded-xl font-bold border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            isCompared
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Compare hospital"
        >
          {isCompared ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Plus className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>
    </div>
  );
};

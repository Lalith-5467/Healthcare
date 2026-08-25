import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Phone, Navigation, Heart, ShieldCheck, Check, Building2 } from 'lucide-react';
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
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelect(hospital)}
      className={`p-5 bg-white dark:bg-slate-900/90 rounded-3xl border transition-all space-y-4 shadow-md hover:shadow-xl cursor-pointer group font-sans ${
        isSelected
          ? 'border-[#00a896] bg-slate-50 dark:bg-slate-900 shadow-teal-500/10 ring-2 ring-[#00a896]/20'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-[#00a896]/40'
      }`}
    >
      {/* HEADER ROW */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={hospital.imageUrl}
            alt={hospital.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-teal-400 font-mono block">
              {hospital.type}
            </span>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors truncate">
              {hospital.name}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(hospital);
            }}
            className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
              isSaved
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-3'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Hospital'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            {isSaved && <span className="text-[10px] font-bold tracking-wide uppercase">Saved</span>}
          </button>
        </div>
      </div>

      {/* METADATA SUMMARY */}
      <div className="space-y-1.5 text-xs font-medium">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400 shrink-0" />
          <span className="truncate">{hospital.address}</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {hospital.rating} ({hospital.reviewsCount})
          </span>
          <span>•</span>
          <span className="text-[#00a896] dark:text-cyan-300 font-extrabold">{hospital.distance} away</span>
          <span>•</span>
          <span className={hospital.status === '24 Hours' || hospital.status === 'Open Now' ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'}>
            {hospital.status}
          </span>
        </div>
      </div>

      {/* SPECIALTY BADGES */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {hospital.specialties.slice(0, 3).map((spec, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
            {spec}
          </span>
        ))}
        {hospital.specialties.length > 3 && (
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
            +{hospital.specialties.length - 3} more
          </span>
        )}
      </div>

      {/* SAVED BANNER */}
      {isSaved && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 p-2.5 text-[11px] font-bold rounded-xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Saved {hospital.name} to favorites</span>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDirections(hospital);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Get Directions"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCall(hospital);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Call Facility"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(hospital);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer ${
              isCompared
                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isCompared ? '✓ Compare' : '+ Compare'}
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(hospital);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

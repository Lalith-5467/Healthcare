import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Phone, Navigation, Heart, Share2, Calendar, ShieldCheck, Check, Building2, User } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalDetailsDrawerProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  isSaved?: boolean;
  onClose: () => void;
  onOpenDirections: (hosp: HospitalItem) => void;
  onOpenCall: (hosp: HospitalItem) => void;
  onOpenAppointment: (hosp: HospitalItem) => void;
  onOpenShareFamily: (hosp: HospitalItem) => void;
  onToggleSave: (hosp: HospitalItem) => void;
}

export const HospitalDetailsDrawer: React.FC<HospitalDetailsDrawerProps> = ({
  hospital,
  isOpen,
  isSaved = false,
  onClose,
  onOpenDirections,
  onOpenCall,
  onOpenAppointment,
  onOpenShareFamily,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'services' | 'reviews'>('overview');

  if (!isOpen || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={hospital.imageUrl}
                alt={hospital.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                  {hospital.type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{hospital.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                  <span>{hospital.address}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{hospital.rating} ({hospital.reviewsCount})</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-teal-500/15 text-[#00a896] dark:text-cyan-300 font-bold border border-teal-500/30">
                {hospital.distanceKm} km
              </span>
            </div>

            <div className="flex items-center gap-1 font-sans">
              <button
                onClick={() => onToggleSave(hospital)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={() => onOpenShareFamily(hospital)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs font-medium">
          {/* TIMINGS & CONTACT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00a896]" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Emergency & OPD</span>
                <strong className="text-slate-800 dark:text-slate-200">{hospital.timings}</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Cashless ABDM</span>
                <strong className="text-slate-800 dark:text-slate-200">{hospital.cashlessAvailable ? 'Empanelled' : 'Self-Pay'}</strong>
              </div>
            </div>
          </div>

          {/* DEPARTMENTS */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Specialized Departments
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {hospital.departments.map((dept) => (
                <span
                  key={dept}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-[11px] font-bold"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 grid grid-cols-3 gap-2">
          <button
            onClick={() => onOpenDirections(hospital)}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Map</span>
          </button>

          <button
            onClick={() => onOpenCall(hospital)}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call</span>
          </button>

          <button
            onClick={() => onOpenAppointment(hospital)}
            className="py-2.5 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};

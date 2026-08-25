import React from 'react';
import { X, Star, Award, Users, Globe, Building2, Calendar, Video, CheckCircle2 } from 'lucide-react';
import type { Doctor } from './appointmentsData';

interface DoctorProfileDrawerProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onBookDoctor: (doc: Doctor) => void;
}

export const DoctorProfileDrawer: React.FC<DoctorProfileDrawerProps> = ({
  doctor,
  isOpen,
  onClose,
  onBookDoctor,
}) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400 font-mono">
            Doctor Profile
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROFILE BODY */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs">
          {/* TOP AVATAR CARD */}
          <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl">
            <img
              src={doctor.photoUrl}
              alt={doctor.name}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-teal-500/40 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{doctor.name}</h3>
              <p className="text-xs font-bold text-[#00a896] dark:text-teal-400">{doctor.speciality}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-full">
                  {doctor.availability}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {doctor.rating} ({doctor.reviewCount})
                </span>
              </div>
            </div>
          </div>

          {/* 3 STAT TILES */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <Award className="w-4 h-4 text-teal-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 block">Experience</span>
              <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">{doctor.experienceYears} Yrs</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <Users className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 block">Patients</span>
              <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">{doctor.consultationCount}+</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <Globe className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 block">Languages</span>
              <strong className="text-slate-800 dark:text-slate-200 text-xs truncate block">{doctor.languages.join(', ')}</strong>
            </div>
          </div>

          {/* ABOUT */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">About Doctor</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {doctor.about}
            </p>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Consultation Fee</span>
            <strong className="text-base font-black text-slate-900 dark:text-white font-mono">₹{doctor.fee}</strong>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookDoctor(doctor);
            }}
            className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

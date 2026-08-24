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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Doctor Profile</span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROFILE BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto">
          {/* TOP AVATAR CARD */}
          <div className="flex items-start gap-4 bg-slate-800/60 border border-slate-700/60 p-5 rounded-3xl">
            <img
              src={doctor.photoUrl}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">{doctor.name}</h3>
              <p className="text-xs font-bold text-[#00a896]">{doctor.speciality}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  {doctor.availability}
                </span>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {doctor.rating} ({doctor.reviewCount})
                </span>
              </div>
            </div>
          </div>

          {/* KEY METRICS GRID */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-2xl space-y-1">
              <Award className="w-5 h-5 text-cyan-400 mx-auto" />
              <div className="text-xs font-bold text-white">{doctor.experienceYears}+ Years</div>
              <div className="text-[10px] text-slate-400">Experience</div>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-2xl space-y-1">
              <Users className="w-5 h-5 text-purple-400 mx-auto" />
              <div className="text-xs font-bold text-white">{doctor.consultationCount}+</div>
              <div className="text-[10px] text-slate-400">Consultations</div>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-2xl space-y-1">
              <Globe className="w-5 h-5 text-teal-400 mx-auto" />
              <div className="text-xs font-bold text-white truncate">{doctor.languages.join(', ')}</div>
              <div className="text-[10px] text-slate-400">Languages</div>
            </div>
          </div>

          {/* ABOUT BIO */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Specialist</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 border border-slate-800/60 p-4 rounded-2xl">
              {doctor.about}
            </p>
          </div>

          {/* CONSULTATION TYPES & FEES */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Consultation Options</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Video Call</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">₹{doctor.fee}</span>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">In-Person</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">₹{doctor.fee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
            <span className="text-lg font-mono font-extrabold text-white">₹{doctor.fee}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookDoctor(doctor);
            }}
            className="flex-1 py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

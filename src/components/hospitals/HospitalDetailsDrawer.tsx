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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="space-y-4 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={hospital.imageUrl}
                alt={hospital.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {hospital.type}
                </span>
                <h3 className="text-base font-extrabold text-white">{hospital.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{hospital.address}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB BAR */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['overview', 'departments', 'services', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance:</span>
                  <strong className="text-cyan-300">{hospital.distance}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Rating & Reviews:</span>
                  <strong className="text-amber-400">★ {hospital.rating} ({hospital.reviewsCount} reviews)</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Opening Hours:</span>
                  <strong className="text-teal-400">{hospital.openingHours}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Insurance Support:</span>
                  <strong className="text-purple-300">{hospital.insuranceAccepted}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-2">Hospital Facilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {hospital.facilities.map((fac) => (
                    <div key={fac} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-medium flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPARTMENTS & SPECIALTIES */}
          {activeTab === 'departments' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Available Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((spec) => (
                  <span key={spec} className="px-3 py-1.5 rounded-xl bg-slate-950 text-cyan-300 font-bold border border-slate-800">
                    🩺 {spec}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 space-y-1">
                <span className="font-bold">Total Doctors Available: {hospital.doctorsCount} Specialists</span>
                <p className="text-[11px] opacity-80">Book a consultation directly from the patient portal.</p>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & HOURS */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white">Emergency Services</h4>
                <p className="text-slate-300 text-xs">
                  {hospital.emergencyCare
                    ? '24x7 Emergency Trauma Unit active with dedicated ALS ambulances.'
                    : 'Standard outpatient services only. No 24x7 emergency bay.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                <h4 className="font-extrabold text-white font-sans">Contact Details</h4>
                <p className="text-cyan-300">Phone: {hospital.phone}</p>
                <p className="text-slate-400 text-[11px]">{hospital.address}</p>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {hospital.reviewsList.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      {rev.patientName}
                    </span>
                    <span className="font-mono text-amber-400 font-bold">★ {rev.rating}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{rev.comment}</p>
                  <span className="text-[10px] text-slate-500 block font-mono">{rev.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-800 space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenAppointment(hospital)}
              className="py-3 px-3 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => onOpenDirections(hospital)}
              className="py-3 px-3 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Get Directions</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button
              onClick={() => onOpenCall(hospital)}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call</span>
            </button>

            <button
              onClick={() => onOpenShareFamily(hospital)}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Share</span>
            </button>

            <button
              onClick={() => onToggleSave(hospital)}
              className={`py-2.5 px-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                isSaved ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

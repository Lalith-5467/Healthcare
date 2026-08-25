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
  onToggleSave: (hosp: HospitalItem, suppressToast?: boolean) => void;
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col shadow-2xl p-6 text-slate-900 dark:text-white overflow-hidden">
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
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            <button
              onClick={() => onOpenDirections(hospital)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-bold border border-slate-300 dark:border-slate-700 flex flex-col items-center gap-1 cursor-pointer font-sans"
            >
              <Navigation className="w-4 h-4" />
              <span className="text-[10px]">Directions</span>
            </button>

            <button
              onClick={() => onOpenCall(hospital)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 font-bold border border-slate-300 dark:border-slate-700 flex flex-col items-center gap-1 cursor-pointer font-sans"
            >
              <Phone className="w-4 h-4" />
              <span className="text-[10px]">Call</span>
            </button>

            <button
              onClick={() => onToggleSave(hospital, true)}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer font-sans transition-colors ${
                isSaved
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              <span className="text-[10px]">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => onOpenShareFamily(hospital)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 font-bold border border-slate-300 dark:border-slate-700 flex flex-col items-center gap-1 cursor-pointer font-sans"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[10px]">Share</span>
            </button>
          </div>

          {/* TAB BAR */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'departments', label: 'Departments' },
              { id: 'services', label: 'Services' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer font-sans ${
                  activeTab === tab.id
                    ? 'bg-[#00a896] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="py-4 overflow-y-auto space-y-5 text-xs font-medium">
          {isSaved && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 p-3 text-xs font-bold rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Saved {hospital.name} to favorites</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Facility Overview</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {hospital.name} is a top-rated {hospital.type} providing high-quality healthcare. 
                  Operating {hospital.openingHours.toLowerCase()}, the facility features {hospital.bedsAvailable} inpatient beds 
                  and a dedicated team of {hospital.doctorsCount} specialized medical professionals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block font-bold">Insurance Status</span>
                  <strong className="text-purple-700 dark:text-purple-400 text-xs font-extrabold block truncate">{hospital.insuranceAccepted}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block font-bold">Patient Rating</span>
                  <strong className="text-amber-700 dark:text-amber-400 text-sm font-extrabold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {hospital.rating} <span className="text-xs text-slate-400">({hospital.reviewsCount})</span>
                  </strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Medical Specialties</h4>
              <div className="grid grid-cols-2 gap-2">
                {hospital.specialties.map((specialty, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Available Facilities & Services</h4>
              <div className="space-y-2">
                {hospital.facilities.map((facility, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Patient Testimonials</h4>
              <div className="space-y-3">
                {hospital.reviewsList && hospital.reviewsList.length > 0 ? (
                  hospital.reviewsList.map((review) => (
                    <div key={review.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#00a896]" /> {review.patientName}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                          <Star className="w-3 h-3 fill-amber-500" /> {review.rating}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">"{review.comment}"</p>
                      <div className="text-[10px] text-slate-400 font-mono text-right">{review.date}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-slate-500 text-xs italic bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                    No reviews available yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 shrink-0">
          <button
            onClick={() => onOpenAppointment(hospital)}
            className="w-full py-3.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

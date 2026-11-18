import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Stethoscope, 
  Star, 
  Check, 
  Building2, 
  Video, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { ConsultationDoctor } from './consultationData';
import { AVAILABLE_CONSULTATION_DOCTORS } from './consultationData';

interface DoctorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDoctorId: string;
  onSelectDoctor: (doctor: ConsultationDoctor) => void;
}

export const DoctorSelectionModal: React.FC<DoctorSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedDoctorId,
  onSelectDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('all');

  if (!isOpen) return null;

  const specialities = [
    { id: 'all', label: 'All Specialities' },
    { id: 'Cardiology', label: 'Cardiology' },
    { id: 'General', label: 'General Physician' },
    { id: 'Pediatric', label: 'Pediatrics' },
  ];

  const filteredDoctors = AVAILABLE_CONSULTATION_DOCTORS.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = 
      doc.name.toLowerCase().includes(q) ||
      doc.speciality.toLowerCase().includes(q) ||
      doc.hospital.toLowerCase().includes(q);

    if (!matchQuery) return false;

    if (selectedSpeciality === 'Cardiology') {
      return doc.speciality.toLowerCase().includes('cardio');
    }
    if (selectedSpeciality === 'General') {
      return doc.speciality.toLowerCase().includes('physician') || doc.speciality.toLowerCase().includes('general');
    }
    if (selectedSpeciality === 'Pediatric') {
      return doc.speciality.toLowerCase().includes('pediatric');
    }
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-900 dark:text-white overflow-hidden"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-cyan-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Select Consultation Doctor
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono">
                    Live On-Duty
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a certified doctor to immediately connect via live tele-video
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor name, speciality, hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {specialities.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpeciality(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                    selectedSpeciality === s.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* DOCTOR LIST */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {filteredDoctors.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No doctors found matching "{searchQuery}"
              </div>
            ) : (
              filteredDoctors.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectDoctor(doc);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/5 dark:bg-teal-500/10 shadow-md ring-1 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-teal-400/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {doc.name}
                          </h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white font-black text-[10px] uppercase">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-teal-600 dark:text-cyan-400">
                          {doc.speciality}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{doc.hospital}</span>
                        </p>
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/50">
                            <Star className="w-3 h-3 fill-amber-500" /> {doc.rating}
                          </span>
                          <span className="font-medium">• {doc.experienceYears}+ yrs exp</span>
                          <span className="font-medium">• {doc.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available for Call
                      </span>

                      <button
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-teal-600 group-hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <span>Select Doctor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              ABDM Verified Medical Practitioners
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


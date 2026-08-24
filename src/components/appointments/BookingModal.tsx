import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  Star,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  HeartPulse,
  Baby,
  Activity,
  Ear,
  Brain,
  UserCheck,
  Smile,
  ShieldCheck
} from 'lucide-react';
import type { Doctor, SpecialityItem, Appointment } from './appointmentsData';
import { MOCK_SPECIALITIES, MOCK_DOCTORS } from './appointmentsData';
import { DoctorFilterDrawer } from './DoctorFilterDrawer';
import type { DoctorFilterState } from './DoctorFilterDrawer';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (newAppointment: Partial<Appointment>) => void;
  initialDoctor?: Doctor | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirmBooking,
  initialDoctor,
}) => {
  // STEPS: 1 = Speciality, 2 = Doctor, 3 = Date, 4 = Time, 5 = Mode, 6 = Summary, 7 = Success
  const [step, setStep] = useState<number>(initialDoctor ? 3 : 1);

  // SELECTIONS
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>(
    initialDoctor ? initialDoctor.speciality : 'General Physician'
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(initialDoctor || MOCK_DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState<string>('23 Aug 2026');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [consultationType, setConsultationType] = useState<'Video' | 'In-Person'>('Video');
  const [reason, setReason] = useState<string>('');

  // DOCTOR SEARCH & FILTER
  const [doctorSearch, setDoctorSearch] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [doctorFilters, setDoctorFilters] = useState<DoctorFilterState>({
    speciality: 'All',
    gender: 'All',
    experience: 'All',
    rating: 'All',
    consultationType: 'All',
    availability: 'All'
  });

  // CONFIRMATION ANIMATION STATE
  const [isConfirming, setIsConfirming] = useState(false);
  const [createdAptId, setCreatedAptId] = useState('APT-2026-00490');

  React.useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctor(initialDoctor);
      setSelectedSpeciality(initialDoctor.speciality);
      setStep(3);
    }
  }, [initialDoctor, isOpen]);

  if (!isOpen) return null;

  // Filter Doctors List based on search & filters
  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    // Speciality filter from Step 1 or Filter drawer
    if (step === 2 && selectedSpeciality && selectedSpeciality !== 'All') {
      if (doc.speciality !== selectedSpeciality) return false;
    }
    if (doctorFilters.speciality !== 'All' && doc.speciality !== doctorFilters.speciality) return false;
    if (doctorFilters.gender !== 'All' && doc.gender !== doctorFilters.gender) return false;
    if (doctorFilters.consultationType !== 'All') {
      // All mock doctors support both
    }
    if (doctorFilters.rating !== 'All') {
      const minRat = parseFloat(doctorFilters.rating);
      if (doc.rating < minRat) return false;
    }
    if (doctorFilters.experience !== 'All') {
      if (doctorFilters.experience === '0-5' && doc.experienceYears > 5) return false;
      if (doctorFilters.experience === '5-10' && (doc.experienceYears < 5 || doc.experienceYears > 10)) return false;
      if (doctorFilters.experience === '10+' && doc.experienceYears < 10) return false;
    }
    if (doctorSearch) {
      const q = doctorSearch.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.speciality.toLowerCase().includes(q);
      const matchHosp = doc.hospital.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchHosp) return false;
    }
    return true;
  });

  // Handle final booking submission
  const handleFinalConfirm = () => {
    setIsConfirming(true);
    const newId = `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setCreatedAptId(newId);

    const aptData: Partial<Appointment> = {
      id: newId,
      doctorId: selectedDoctor?.id || 'DOC-101',
      doctorName: selectedDoctor?.name || 'Dr. Rajesh Kumar',
      doctorPhoto: selectedDoctor?.photoUrl || MOCK_DOCTORS[0].photoUrl,
      speciality: selectedDoctor?.speciality || 'General Physician',
      date: selectedDate,
      time: selectedTime,
      timestamp: Date.now() + 86400000,
      type: consultationType,
      status: 'Confirmed',
      hospital: selectedDoctor?.hospital || 'Apollo Hospital',
      fee: selectedDoctor?.fee || 500,
      reason: reason || 'Routine health consultation'
    };

    setTimeout(() => {
      onConfirmBooking(aptData);
      setIsConfirming(false);
      setStep(7); // Show Success Screen
    }, 1500);
  };

  // Helper icon renderer for Speciality
  const renderSpecialityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Baby': return <Baby className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Ear': return <Ear className="w-6 h-6" />;
      case 'Brain': return <Brain className="w-6 h-6" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6" />;
      case 'Smile': return <Smile className="w-6 h-6" />;
      default: return <Stethoscope className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden my-auto">
        {/* STEP PROGRESS BAR */}
        {step < 7 && (
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Step {step} of 6
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {step === 1 && 'Choose Speciality'}
                  {step === 2 && 'Select Doctor'}
                  {step === 3 && 'Select Date'}
                  {step === 4 && 'Select Time Slot'}
                  {step === 5 && 'Consultation Mode'}
                  {step === 6 && 'Appointment Summary'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 1: CHOOSE SPECIALITY */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Select medical department or speciality to find expert healthcare specialists.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {MOCK_SPECIALITIES.map((spec) => {
                const isSelected = selectedSpeciality === spec.name;
                return (
                  <div
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpeciality(spec.name);
                      setDoctorFilters((f) => ({ ...f, speciality: spec.name }));
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#00a896]/20 border-teal-500 text-white shadow-lg scale-[1.02]'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#00a896] text-white' : 'bg-slate-700 text-cyan-400'
                    }`}>
                      {renderSpecialityIcon(spec.iconName)}
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-white">{spec.name}</h4>
                      <p className="text-[10px] text-teal-400 font-semibold mt-0.5">{spec.doctorCount} Doctors</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR */}
        {step === 2 && (
          <div className="space-y-4">
            {/* SEARCH & FILTER BAR */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor by name, speciality, hospital..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Filter className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* DOCTORS GRID */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {filteredDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-gradient-to-r from-slate-800 to-teal-950/40 border-teal-500 shadow-lg'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-teal-500/40 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <span>{doc.name}</span>
                          <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {doc.rating}
                          </span>
                        </h4>
                        <p className="text-xs font-bold text-[#00a896]">{doc.speciality}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.experienceYears} Years Exp • {doc.consultationCount}+ Consultations
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-center flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400">₹{doc.fee}</span>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00a896] text-white shadow'
                            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredDoctors.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-8">
                  No doctors match your current search or filter criteria.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDoctor}
                className="py-2.5 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Date</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-800/60 p-4 rounded-2xl flex items-center gap-3 border border-slate-700/60">
              <img
                src={selectedDoctor?.photoUrl}
                alt={selectedDoctor?.name}
                className="w-12 h-12 rounded-xl object-cover border border-teal-500/30 shrink-0"
              />
              <div>
                <h4 className="text-xs font-extrabold text-white">{selectedDoctor?.name}</h4>
                <p className="text-[11px] text-teal-400 font-semibold">{selectedDoctor?.speciality}</p>
                <p className="text-[10px] text-slate-400">{selectedDoctor?.hospital}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Select Date for Consultation
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[
                  { day: 'Today', date: '23 Aug 2026', slots: 12 },
                  { day: 'Tomorrow', date: '24 Aug 2026', slots: 16 },
                  { day: 'Wed', date: '25 Aug 2026', slots: 14 },
                  { day: 'Thu', date: '26 Aug 2026', slots: 10 },
                  { day: 'Fri', date: '27 Aug 2026', slots: 18 },
                  { day: 'Sat', date: '28 Aug 2026', slots: 8 },
                  { day: 'Mon', date: '30 Aug 2026', slots: 15 },
                ].map((item) => {
                  const isSel = selectedDate === item.date;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => setSelectedDate(item.date)}
                      className={`p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                        isSel
                          ? 'bg-[#00a896] text-white border-teal-400 shadow-md scale-105'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold text-slate-400">{item.day}</div>
                      <div className="text-xs font-extrabold text-white mt-0.5">{item.date.split(' ')[0]} Aug</div>
                      <div className="text-[9px] font-mono text-cyan-300 mt-1">{item.slots} slots</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-2.5 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT TIME SLOTS */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl">
              <span>Selected Date: <strong className="text-white">{selectedDate}</strong></span>
              <span className="text-cyan-400 font-bold">{selectedDoctor?.name}</span>
            </div>

            {/* MORNING SLOTS */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Morning Slots</span>
              <div className="grid grid-cols-4 gap-2">
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'].map((slot, i) => {
                  const isSel = selectedTime === slot;
                  const isBooked = i === 0;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                        isBooked
                          ? 'opacity-40 bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'
                          : isSel
                          ? 'bg-[#00a896] text-white border-teal-400 shadow-md'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {slot} {isBooked && '(Booked)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AFTERNOON SLOTS */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Afternoon Slots</span>
              <div className="grid grid-cols-4 gap-2">
                {['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'].map((slot) => {
                  const isSel = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-[#00a896] text-white border-teal-400 shadow-md'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EVENING SLOTS */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Evening Slots</span>
              <div className="grid grid-cols-4 gap-2">
                {['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'].map((slot) => {
                  const isSel = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-[#00a896] text-white border-teal-400 shadow-md'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="py-2.5 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SELECT CONSULTATION TYPE */}
        {step === 5 && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400">Choose how you would like to consult with your specialist.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VIDEO */}
              <div
                onClick={() => setConsultationType('Video')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  consultationType === 'Video'
                    ? 'bg-[#00a896]/20 border-teal-400 text-white shadow-lg'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Video Consultation</h4>
                  <p className="text-xs text-slate-400 mt-1">Consult securely from anywhere via HD video call.</p>
                </div>
              </div>

              {/* IN-PERSON */}
              <div
                onClick={() => setConsultationType('In-Person')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  consultationType === 'In-Person'
                    ? 'bg-[#00a896]/20 border-teal-400 text-white shadow-lg'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">In-Person Visit</h4>
                  <p className="text-xs text-slate-400 mt-1">Visit the hospital or clinic directly at scheduled time.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(4)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="py-2.5 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY & REASON */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Specialist:</span>
                <span className="font-bold text-white">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Speciality:</span>
                <span className="font-bold text-teal-400">{selectedDoctor?.speciality}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-mono font-bold text-cyan-300">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Consultation Mode:</span>
                <span className="font-bold text-white">{consultationType}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Total Consultation Fee:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">₹{selectedDoctor?.fee}</span>
              </div>
            </div>

            {/* REASON FOR VISIT */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Reason for Visit (Brief Health Concern)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your symptoms or reason for appointment..."
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00a896] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(5)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={isConfirming}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isConfirming ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Confirming Appointment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: SUCCESS CONFIRMATION MODAL STATE */}
        {step === 7 && (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                ID: {createdAptId}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-3">Your Appointment is Confirmed!</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Consultation scheduled with <strong className="text-white">{selectedDoctor?.name}</strong> for {selectedDate} at {selectedTime}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg cursor-pointer"
              >
                Back to Appointments
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FILTER DRAWER */}
      <DoctorFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={doctorFilters}
        onApplyFilters={(f) => setDoctorFilters(f)}
        onResetFilters={() => setDoctorFilters({
          speciality: 'All',
          gender: 'All',
          experience: 'All',
          rating: 'All',
          consultationType: 'All',
          availability: 'All'
        })}
      />
    </div>
  );
};

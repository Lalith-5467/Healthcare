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
    speciality: initialDoctor ? initialDoctor.speciality : 'All',
    gender: 'All',
    experience: 'All',
    rating: 'All',
    consultationType: 'All',
    availability: 'All',
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const [createdAptId, setCreatedAptId] = useState<string>('');

  if (!isOpen) return null;

  // FILTER DOCTORS LOGIC
  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    if (selectedSpeciality && selectedSpeciality !== 'All' && doc.speciality !== selectedSpeciality) {
      return false;
    }
    if (doctorFilters.speciality !== 'All' && doc.speciality !== doctorFilters.speciality) {
      return false;
    }
    if (doctorFilters.gender !== 'All' && doc.gender !== doctorFilters.gender) {
      return false;
    }
    if (doctorFilters.rating === '4.5+' && doc.rating < 4.5) return false;
    if (doctorFilters.rating === '4.8+' && doc.rating < 4.8) return false;
    if (doctorFilters.rating === '4.9+' && doc.rating < 4.9) return false;

    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.speciality.toLowerCase().includes(q);
      const matchHosp = doc.hospital.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchHosp) return false;
    }

    return true;
  });

  const handleFinalConfirm = () => {
    if (!selectedDoctor) return;
    setIsConfirming(true);

    const generatedId = `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setCreatedAptId(generatedId);

    setTimeout(() => {
      onConfirmBooking({
        id: generatedId,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorPhoto: selectedDoctor.photoUrl,
        speciality: selectedDoctor.speciality,
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        status: 'Confirmed',
        hospital: selectedDoctor.hospital,
        fee: selectedDoctor.fee,
        reason: reason.trim() || 'General Consultation Checkup',
      });
      setIsConfirming(false);
      setStep(7); // Show success step
    }, 900);
  };

  const renderSpecialityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Ear': return <Ear className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      default: return <Stethoscope className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden my-auto text-slate-900 dark:text-white">
        {/* STEP PROGRESS BAR */}
        {step < 7 && (
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400 font-mono">
                  Step {step} of 6
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
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
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 1: CHOOSE SPECIALITY */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
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
                        ? 'bg-teal-500/10 border-teal-500 text-teal-900 dark:text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#00a896] text-white' : 'bg-white dark:bg-slate-700 text-[#00a896] border border-slate-200 dark:border-slate-600'
                    }`}>
                      {renderSpecialityIcon(spec.iconName)}
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{spec.name}</h4>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">{spec.doctorCount} Doctors</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            {/* SEARCH & FILTER BAR */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor by name, speciality, hospital..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
              >
                <Filter className="w-4 h-4 text-[#00a896]" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* DOCTORS GRID */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {filteredDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover border border-teal-500/30 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{doc.name}</span>
                          <span className="text-amber-500 text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {doc.rating}
                          </span>
                        </h4>
                        <p className="text-[11px] font-bold text-[#00a896] dark:text-teal-400">{doc.speciality}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {doc.experienceYears} Yrs Exp • {doc.consultationCount}+ Consults • {doc.hospital}
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-center flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">₹{doc.fee}</span>
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00a896] text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredDoctors.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-8">
                  No doctors match your current search or filter criteria.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDoctor}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Date</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE */}
        {step === 3 && (
          <div className="space-y-5 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3 border border-slate-200 dark:border-slate-700/60">
              <img
                src={selectedDoctor?.photoUrl}
                alt={selectedDoctor?.name}
                className="w-11 h-11 rounded-xl object-cover border border-teal-500/30 shrink-0"
              />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{selectedDoctor?.name}</h4>
                <p className="text-[11px] text-[#00a896] font-semibold">{selectedDoctor?.speciality}</p>
                <p className="text-[10px] text-slate-500">{selectedDoctor?.hospital}</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 font-mono">
                Select Date for Consultation
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
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
                          ? 'bg-[#00a896] text-white border-teal-500 shadow-md scale-105'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-bold ${isSel ? 'text-teal-100' : 'text-slate-400'}`}>{item.day}</div>
                      <div className="text-xs font-black mt-0.5">{item.date.split(' ')[0]} Aug</div>
                      <div className={`text-[9px] font-mono mt-1 ${isSel ? 'text-teal-100' : 'text-[#00a896]'}`}>{item.slots} slots</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT TIME SLOTS */}
        {step === 4 && (
          <div className="space-y-5 text-xs">
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span>Selected Date: <strong className="text-slate-900 dark:text-white">{selectedDate}</strong></span>
              <span className="text-[#00a896] font-bold">{selectedDoctor?.name}</span>
            </div>

            {/* MORNING SLOTS */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Morning Slots</span>
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
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer text-center ${
                        isBooked
                          ? 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                          : isSel
                          ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AFTERNOON SLOTS */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Afternoon Slots</span>
              <div className="grid grid-cols-4 gap-2">
                {['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'].map((slot) => {
                  const isSel = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer text-center ${
                        isSel
                          ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SELECT CONSULTATION TYPE */}
        {step === 5 && (
          <div className="space-y-5 text-xs">
            <p className="text-slate-500 dark:text-slate-400 font-medium">Choose how you would like to consult with your specialist.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* VIDEO */}
              <div
                onClick={() => setConsultationType('Video')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  consultationType === 'Video'
                    ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-[#00a896] flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Video Consultation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consult securely from anywhere via HD video call.</p>
                </div>
              </div>

              {/* IN-PERSON */}
              <div
                onClick={() => setConsultationType('In-Person')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  consultationType === 'In-Person'
                    ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">In-Person Visit</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Visit the hospital or clinic directly at scheduled time.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(4)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SUMMARY & REASON */}
        {step === 6 && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Specialist:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Speciality:</span>
                <span className="font-bold text-[#00a896]">{selectedDoctor?.speciality}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-cyan-300">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Consultation Mode:</span>
                <span className="font-bold text-slate-900 dark:text-white">{consultationType}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Total Fee:</span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{selectedDoctor?.fee}</span>
              </div>
            </div>

            {/* REASON FOR VISIT */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Reason for Visit (Brief Health Concern)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your symptoms or reason for appointment..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896] resize-none font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(5)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Back
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={isConfirming}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
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
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#00a896] font-bold bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
                ID: {createdAptId}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2.5">Your Appointment is Confirmed!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Consultation scheduled with <strong className="text-slate-900 dark:text-white">{selectedDoctor?.name}</strong> for {selectedDate} at {selectedTime}.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Video, 
  MapPin, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Phone, 
  X, 
  FileText, 
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverAppointmentsView: React.FC = () => {
  const { wards, activeWard, setActiveWardId, addAppointment } = useCaregiverWorkflow();
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeCallDoctor, setActiveCallDoctor] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [doctorName, setDoctorName] = useState('Dr. Rajesh Varma');
  const [specialty, setSpecialty] = useState('Cardiology Review');
  const [hospital, setHospital] = useState('Apollo Central Health City');
  const [date, setDate] = useState('Tomorrow, 11:00 AM');
  const [time, setTime] = useState('11:00 AM');
  const [mode, setMode] = useState<'In-Clinic' | 'Video Consultation' | 'Home Visit'>('Video Consultation');
  const [notes, setNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment(activeWard.id, {
      wardId: activeWard.id,
      doctorName,
      specialty,
      hospital,
      date,
      time,
      mode,
      notes: notes || 'Caregiver consultation scheduled'
    });

    setIsBookOpen(false);
    showToast(`Appointment booked for ${activeWard.name}!`);
  };

  const handleStartCall = (docName: string) => {
    setActiveCallDoctor(docName);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & WARD SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>Doctor Appointments & Telehealth</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Schedule specialist consultations, home visits, and join live encrypted telehealth sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {wards.map((ward) => (
              <button
                key={ward.id}
                onClick={() => setActiveWardId(ward.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  ward.id === activeWard.id
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {ward.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsBookOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="space-y-4">
        {activeWard.appointments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              No Upcoming Appointments for {activeWard.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Schedule a routine review or video consultation with primary doctor {activeWard.primaryDoctor.name}.
            </p>
            <button
              onClick={() => setIsBookOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-black text-xs shadow-md"
            >
              Book Now
            </button>
          </div>
        ) : (
          activeWard.appointments.map((apt) => (
            <motion.div
              key={apt.id}
              whileHover={{ y: -2 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 ${
                  apt.mode === 'Video Consultation' ? 'bg-gradient-to-tr from-cyan-500 to-blue-600' :
                  apt.mode === 'Home Visit' ? 'bg-gradient-to-tr from-rose-500 to-pink-600' :
                  'bg-gradient-to-tr from-teal-500 to-emerald-600'
                }`}>
                  {apt.mode === 'Video Consultation' ? <Video className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {apt.doctorName}
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-cyan-300">
                      {apt.specialty}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {apt.mode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {apt.hospital} • {apt.notes}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
                    <span className="flex items-center gap-1 text-teal-600 dark:text-cyan-400">
                      <Clock className="w-3.5 h-3.5" /> {apt.date}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">
                      • Status: {apt.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                {apt.mode === 'Video Consultation' ? (
                  <button
                    onClick={() => handleStartCall(apt.doctorName)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Call</span>
                  </button>
                ) : (
                  <a
                    href="tel:+919876543210"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                    <span>Contact Clinic</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      <AnimatePresence>
        {isBookOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsBookOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Book Doctor Visit for {activeWard.name}</span>
                </h3>
                <button onClick={() => setIsBookOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleBook} className="mt-4 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Name</label>
                    <input
                      type="text"
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Medical Specialty</label>
                    <input
                      type="text"
                      required
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      required
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Consultation Mode</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      <option value="Video Consultation">Telehealth Video Call</option>
                      <option value="In-Clinic">In-Clinic Hospital Visit</option>
                      <option value="Home Visit">Doctor Home Visit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Date & Time</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. Sept 5, 03:00 PM"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chief Reason / Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Routine review & prescription renewal"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBookOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TELEHEALTH VIDEO CALL SIMULATOR MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsVideoModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-2xl bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700 text-white space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase text-teal-400">Encrypted Telehealth Stream • Active Call</span>
                </div>
                <button onClick={() => setIsVideoModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              {/* VIDEO SIMULATOR SCREEN */}
              <div className="relative h-72 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex flex-col justify-between p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-slate-900/80 px-3 py-1 rounded-full font-bold backdrop-blur-xs">
                    Doctor: {activeCallDoctor || 'Dr. Rajesh Varma'}
                  </span>
                  <span className="bg-slate-900/80 px-3 py-1 rounded-full font-bold backdrop-blur-xs text-teal-400">
                    Patient: {activeWard.name} (Caregiver Attending)
                  </span>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 text-teal-300 flex items-center justify-center text-xl font-black mx-auto">
                    Dr
                  </div>
                  <p className="text-xs font-bold text-slate-300">Live HD Audio & Video Connected</p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30"
                  >
                    End Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

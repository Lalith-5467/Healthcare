import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  RefreshCw,
  Trash2,
  Bell,
  Star,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Appointment, Doctor } from './appointmentsData';
import { INITIAL_APPOINTMENTS, MOCK_DOCTORS } from './appointmentsData';
import { BookingModal } from './BookingModal';
import { DoctorProfileDrawer } from './DoctorProfileDrawer';
import { AppointmentDetailsDrawer } from './AppointmentDetailsDrawer';
import { CalendarViewModal } from './CalendarViewModal';
import { RescheduleModal } from './RescheduleModal';
import { CancelConfirmModal } from './CancelConfirmModal';
import { ReminderModal } from './ReminderModal';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface AppointmentsViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  user,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // APPOINTMENTS STATE (Persisted in localStorage)
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // TAB & SEARCH STATES
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // MODAL & DRAWER STATES
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [doctorDrawerTarget, setDoctorDrawerTarget] = useState<Doctor | null>(null);
  const [detailDrawerTarget, setDetailDrawerTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [reminderTarget, setReminderTarget] = useState<Appointment | null>(null);

  // COUNTDOWN TIMER STATE
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 1,
    minutes: 42,
    seconds: 18
  });

  // Load from localStorage on mount & initial skeleton simulation
  useEffect(() => {
    const saved = localStorage.getItem('user_appointments');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Real-time Countdown timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to persist appointments
  const saveAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    localStorage.setItem('user_appointments', JSON.stringify(newApts));
  };

  // HANDLERS
  const handleConfirmNewBooking = (newApt: Partial<Appointment>) => {
    const created: Appointment = {
      id: newApt.id || `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      doctorId: newApt.doctorId || 'DOC-101',
      doctorName: newApt.doctorName || 'Dr. Rajesh Kumar',
      doctorPhoto: newApt.doctorPhoto || MOCK_DOCTORS[0].photoUrl,
      speciality: newApt.speciality || 'General Physician',
      date: newApt.date || '23 Aug 2026',
      time: newApt.time || '10:30 AM',
      timestamp: newApt.timestamp || Date.now() + 86400000,
      type: newApt.type || 'Video',
      status: 'Confirmed',
      hospital: newApt.hospital || 'Apollo Hospital',
      fee: newApt.fee || 500,
      reason: newApt.reason
    };

    const updated = [created, ...appointments];
    saveAppointments(updated);
    showToast(`✓ Appointment booked with ${created.doctorName}`);
  };

  const handleConfirmReschedule = (aptId: string, newDate: string, newTime: string) => {
    const updated = appointments.map((apt) => {
      if (apt.id === aptId) {
        return { ...apt, date: newDate, time: newTime, status: 'Confirmed' as const };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast('✓ Appointment rescheduled successfully');
  };

  const handleConfirmCancel = (aptId: string, reason: string) => {
    const updated = appointments.map((apt) => {
      if (apt.id === aptId) {
        return {
          ...apt,
          status: 'Cancelled' as const,
          cancellationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          cancellationReason: reason
        };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast('✓ Appointment cancelled');
  };

  const handleSetReminder = (aptId: string, offset: string) => {
    const updated = appointments.map((apt) => {
      if (apt.id === aptId) {
        return { ...apt, reminderOffset: offset };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast(`✓ Reminder set for ${offset}`);
  };

  // COUNTS FOR SUMMARY CARDS
  const upcomingCount = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Starting Soon' || a.status === 'Ready to Join').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  // FILTERED APPOINTMENTS LIST ACCORDING TO TAB & SEARCH
  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'upcoming' && apt.status === 'Cancelled') return false;
    if (activeTab === 'upcoming' && apt.status === 'Completed') return false;
    if (activeTab === 'past' && apt.status !== 'Completed') return false;
    if (activeTab === 'cancelled' && apt.status !== 'Cancelled') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDoc = apt.doctorName.toLowerCase().includes(q);
      const matchSpec = apt.speciality.toLowerCase().includes(q);
      const matchHosp = apt.hospital.toLowerCase().includes(q);
      if (!matchDoc && !matchSpec && !matchHosp) return false;
    }
    return true;
  });

  // FEATURED NEXT APPOINTMENT (First upcoming appointment)
  const nextAppointment = appointments.find((a) => a.status === 'Confirmed' || a.status === 'Starting Soon' || a.status === 'Ready to Join');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Appointments"
        subtitle="Manage doctor consultations, tele-health sessions & clinic visits."
        badgeText="Live Care"
        badgeIcon={<Calendar className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => setCalendarModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Calendar className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>View Calendar</span>
            </button>

            <button
              onClick={() => {
                setSelectedDoctorForBooking(null);
                setBookingModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        }
      />

      {/* 2. NEXT APPOINTMENT HIGHLIGHT CARD WITH LIVE COUNTDOWN TIMER */}
      {nextAppointment && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={nextAppointment.doctorPhoto}
              alt={nextAppointment.doctorName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-500/50 shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                const doc = MOCK_DOCTORS.find((d) => d.id === nextAppointment.doctorId) || MOCK_DOCTORS[0];
                setDoctorDrawerTarget(doc);
              }}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-teal-500/20 text-cyan-300 border border-teal-500/30 rounded-full">
                  Next Appointment
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {nextAppointment.type} Consultation
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white">{nextAppointment.doctorName}</h3>
              <p className="text-xs font-bold text-[#00a896]">{nextAppointment.speciality}</p>
              <div className="flex items-center gap-3 text-xs text-slate-300 pt-1 font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {nextAppointment.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-cyan-300 font-bold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {nextAppointment.time}
                </span>
              </div>
            </div>
          </div>

          {/* COUNTDOWN & ACTIONS */}
          <div className="self-stretch md:self-auto flex flex-col sm:flex-row md:flex-col items-end justify-between gap-4 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
            {/* LIVE COUNTDOWN DISPLAY */}
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-center self-stretch sm:self-auto justify-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Starts In</span>
                <div className="font-mono text-base font-extrabold text-cyan-400">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              {nextAppointment.type === 'Video' && (
                <button
                  onClick={() => onNavigate('video-consultation')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-teal-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Consultation</span>
                </button>
              )}
              <button
                onClick={() => setDetailDrawerTarget(nextAppointment)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. APPOINTMENT SUMMARY CARDS (4 COMPACT CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{upcomingCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{completedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cancelled</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{cancelledCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">This Month</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">5</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. APPOINTMENT TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-3xl">
        {/* TABS */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto">
          {[
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'past', label: 'Past', count: completedCount },
            { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00a896] to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctor or speciality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#00a896]"
          />
        </div>
      </div>

      {/* 5. APPOINTMENTS LIST CARDS */}
      <div className="space-y-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-3xl transition-all shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <img
                src={apt.doctorPhoto}
                alt={apt.doctorName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/30 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  const doc = MOCK_DOCTORS.find((d) => d.id === apt.doctorId) || MOCK_DOCTORS[0];
                  setDoctorDrawerTarget(doc);
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4
                    onClick={() => {
                      const doc = MOCK_DOCTORS.find((d) => d.id === apt.doctorId) || MOCK_DOCTORS[0];
                      setDoctorDrawerTarget(doc);
                    }}
                    className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {apt.doctorName}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    apt.status === 'Completed'
                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                      : apt.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#00a896] mt-0.5">{apt.speciality}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {apt.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-cyan-300">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {apt.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {apt.type === 'Video' ? <Video className="w-3.5 h-3.5 text-cyan-400" /> : <Building2 className="w-3.5 h-3.5 text-purple-400" />}
                    {apt.type}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS ACCORDING TO TAB */}
            <div className="self-end md:self-center flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto justify-end">
              {activeTab === 'upcoming' && (
                <>
                  {apt.type === 'Video' && (
                    <button
                      onClick={() => onNavigate('video-consultation')}
                      className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#00a896] hover:bg-teal-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join</span>
                    </button>
                  )}
                  <button
                    onClick={() => setDetailDrawerTarget(apt)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setRescheduleTarget(apt)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setCancelTarget(apt)}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}

              {activeTab === 'past' && (
                <button
                  onClick={() => setDetailDrawerTarget(apt)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Summary</span>
                </button>
              )}

              {activeTab === 'cancelled' && (
                <button
                  onClick={() => {
                    const doc = MOCK_DOCTORS.find((d) => d.id === apt.doctorId) || MOCK_DOCTORS[0];
                    setSelectedDoctorForBooking(doc);
                    setBookingModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Book Again</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* EMPTY STATES */}
        {filteredAppointments.length === 0 && (
          <div className="py-16 px-6 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {activeTab === 'upcoming' && 'No upcoming appointments.'}
                {activeTab === 'past' && 'No completed appointments yet.'}
                {activeTab === 'cancelled' && 'No cancelled appointments.'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeTab === 'upcoming'
                  ? 'Book a consultation with top specialist doctors for video or in-person visits.'
                  : 'Your past consultation records will be archived here.'}
              </p>
            </div>
            {activeTab === 'upcoming' && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedDoctorForBooking(null);
                    setBookingModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ALL MODALS & DRAWERS */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onConfirmBooking={handleConfirmNewBooking}
        initialDoctor={selectedDoctorForBooking}
      />

      <CalendarViewModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        appointments={appointments}
        onSelectAppointment={(apt) => setDetailDrawerTarget(apt)}
      />

      <DoctorProfileDrawer
        doctor={doctorDrawerTarget}
        isOpen={!!doctorDrawerTarget}
        onClose={() => setDoctorDrawerTarget(null)}
        onBookDoctor={(doc) => {
          setSelectedDoctorForBooking(doc);
          setBookingModalOpen(true);
        }}
      />

      <AppointmentDetailsDrawer
        appointment={detailDrawerTarget}
        isOpen={!!detailDrawerTarget}
        onClose={() => setDetailDrawerTarget(null)}
        onJoin={() => onNavigate('video-consultation')}
        onReschedule={(apt) => setRescheduleTarget(apt)}
        onCancel={(apt) => setCancelTarget(apt)}
        onAddReminder={(apt) => setReminderTarget(apt)}
      />

      <RescheduleModal
        isOpen={!!rescheduleTarget}
        appointment={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      <CancelConfirmModal
        isOpen={!!cancelTarget}
        appointment={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      <ReminderModal
        isOpen={!!reminderTarget}
        appointment={reminderTarget}
        onClose={() => setReminderTarget(null)}
        onSetReminder={handleSetReminder}
      />
    </div>
  );
};

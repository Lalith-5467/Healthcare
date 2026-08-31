import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Bell,
  Star,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  CalendarCheck2,
  ChevronRight,
  AlertCircle,
  X
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
import {
  getReminders as getStoredReminders,
  updateReminderFollowUpStatus
} from '../../utils/healthWorkflowStorage';

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
  user: _user,
  onNavigate,
}) => {
  const [_loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // APPOINTMENTS STATE (Persisted in localStorage)
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // TAB & SEARCH STATES
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'video' | 'in-person'>('all');
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

  // PENDING APPOINTMENT REQUESTS FROM PRESC SCAN
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [declineConfirmTarget, setDeclineConfirmTarget] = useState<any | null>(null);
  const [pendingDetailTarget, setPendingDetailTarget] = useState<any | null>(null);

  const loadRequests = () => {
    const loadedReminders = getStoredReminders();
    const pending = loadedReminders.filter((r: any) => r.followUpStatus === 'Pending');
    setPendingRequests(pending);
  };

  // COUNTDOWN TIMER STATE
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 1,
    minutes: 42,
    seconds: 18
  });

  // Load from localStorage on mount & initial skeleton simulation
  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('health_workflow_updated', handleUpdate);

    const saved = localStorage.getItem('user_appointments');
    if (saved) {
      try {
        const parsed: Appointment[] = JSON.parse(saved);
        const synced = parsed.map((apt) => {
          const matchedDoc = MOCK_DOCTORS.find((d) => d.id === apt.doctorId || d.name === apt.doctorName);
          if (matchedDoc) {
            return { ...apt, doctorPhoto: matchedDoc.photoUrl };
          }
          return apt;
        });
        setAppointments(synced);
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 200);
    return () => {
      window.removeEventListener('health_workflow_updated', handleUpdate);
      clearTimeout(timer);
    };
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

  const handleAcceptFollowUp = (id: string) => {
    const remindersList = getStoredReminders();
    const target = remindersList.find(r => r.id === id);
    if (!target) return;

    const docName = target.doctorName || 'Dr. Arun Kumar';

    // 1. Update status in workflow storage (updates followUpStatus and active reminder)
    updateReminderFollowUpStatus(id, 'Accepted');

    // 2. Create actual confirmed Appointment in Appointments list
    const newApt: Appointment = {
      id: `APT-FLW-${Date.now().toString().slice(-4)}`,
      doctorId: target.id || 'DOC-FLW',
      doctorName: docName,
      doctorPhoto: MOCK_DOCTORS[0]?.photoUrl || '',
      speciality: target.clinicName || 'General Medicine',
      date: target.date,
      time: target.time,
      timestamp: Date.now() + 86400000,
      type: 'In-Person',
      status: 'Confirmed',
      hospital: target.clinicName || 'General Medicine Clinic',
      fee: 0
    };

    const saved = localStorage.getItem('user_appointments');
    let currentApts: Appointment[] = INITIAL_APPOINTMENTS;
    if (saved) {
      try { currentApts = JSON.parse(saved); } catch (e) { console.error(e); }
    }
    const updated = [newApt, ...currentApts];
    saveAppointments(updated);

    // Reload local requests state
    loadRequests();

    // 3. Dispatch events to notify other tabs
    window.dispatchEvent(new Event('health_workflow_updated'));

    showToast(`✓ Appointment confirmed\nYour appointment with ${docName} has been confirmed and a reminder has been added.`);
  };

  const handleDeclineFollowUpConfirm = (id: string) => {
    updateReminderFollowUpStatus(id, 'Declined');
    loadRequests();
    window.dispatchEvent(new Event('health_workflow_updated'));
    showToast(`Appointment declined\nThe appointment request has been declined.`);
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
        return {
          ...apt,
          date: newDate,
          time: newTime,
          status: 'Confirmed' as const
        };
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
          cancellationDate: '24 Aug 2026',
          cancellationReason: reason
        };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast('✓ Appointment cancelled');
  };

  const handleSaveReminder = (aptId: string, offset: string) => {
    const updated = appointments.map((apt) => {
      if (apt.id === aptId) {
        return {
          ...apt,
          reminderOffset: offset
        };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast(`✓ Reminder set for ${offset}`);
  };

  // COUNTS
  const upcomingCount = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Starting Soon' || a.status === 'Ready to Join'
  ).length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  // FILTERED LIST
  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'upcoming') {
      const isUpcoming = apt.status === 'Confirmed' || apt.status === 'Starting Soon' || apt.status === 'Ready to Join';
      if (!isUpcoming) return false;
    } else if (activeTab === 'past') {
      if (apt.status !== 'Completed') return false;
    } else if (activeTab === 'cancelled') {
      if (apt.status !== 'Cancelled') return false;
    }

    if (selectedTypeFilter === 'video' && apt.type !== 'Video') return false;
    if (selectedTypeFilter === 'in-person' && apt.type !== 'In-Person') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = apt.doctorName.toLowerCase().includes(q);
      const matchSpec = apt.speciality.toLowerCase().includes(q);
      const matchHosp = apt.hospital.toLowerCase().includes(q);
      if (!matchDoc && !matchSpec && !matchHosp) return false;
    }
    return true;
  });

  // FEATURED NEXT APPOINTMENT (First upcoming appointment)
  const nextAppointment = appointments.find(
    (a) => a.status === 'Confirmed' || a.status === 'Starting Soon' || a.status === 'Ready to Join'
  );

  return (
    <div className="max-w-7xl mx-auto space-y-7 animate-in fade-in duration-300 pb-16 font-sans">
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
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={() => setCalendarModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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

      {/* 2. NEXT APPOINTMENT HIGHLIGHT HERO CARD */}
      {nextAppointment && (
        <div
          className="rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-slate-900 dark:text-white"
          style={{
            background: 'linear-gradient(135deg, #092038 0%, #005c53 50%, #00423a 100%)',
            border: '1.5px solid rgba(20,184,166,.35)'
          }}
        >
          {/* BACKGROUND AMBIENT GLOW */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="relative">
              <img
                src={nextAppointment.doctorPhoto}
                alt={nextAppointment.doctorName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-400/60 shadow-lg shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  const doc = MOCK_DOCTORS.find((d) => d.id === nextAppointment.doctorId) || MOCK_DOCTORS[0];
                  setDoctorDrawerTarget(doc);
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" title="Doctor Online" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-teal-400/20 text-teal-200 border border-teal-400/40 rounded-full font-mono">
                  Next Appointment
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-200 flex items-center gap-1">
                  {nextAppointment.type === 'Video' ? <Video className="w-3 h-3 text-cyan-300" /> : <Building2 className="w-3 h-3 text-cyan-300" />}
                  {nextAppointment.type} Consultation
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">{nextAppointment.doctorName}</h3>
              <p className="text-xs font-bold text-teal-200 flex items-center gap-1.5">
                <span>{nextAppointment.speciality}</span>
                <span>•</span>
                <span className="text-teal-300/80 font-normal">{nextAppointment.hospital}</span>
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-900 dark:text-white/90 pt-1.5 font-medium">
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-teal-300" />
                  {nextAppointment.date}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg font-mono text-cyan-200 font-bold">
                  <Clock className="w-3.5 h-3.5 text-teal-300" />
                  {nextAppointment.time}
                </span>
              </div>
            </div>
          </div>

          {/* COUNTDOWN & ACTIONS */}
          <div className="self-stretch md:self-auto flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3.5 border-t md:border-t-0 border-teal-700/40 pt-4 md:pt-0 relative z-10">
            {/* LIVE COUNTDOWN DISPLAY */}
            <div className="bg-slate-950/60 border border-teal-500/30 px-5 py-2 rounded-2xl flex items-center gap-3 text-center self-stretch sm:self-auto justify-center shadow-inner backdrop-blur-sm">
              <div>
                <span className="text-[9px] uppercase font-bold text-teal-300/80 block font-mono">Starts In</span>
                <div className="font-mono text-base font-extrabold text-cyan-300">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              {nextAppointment.type === 'Video' && (
                <button
                  onClick={() => onNavigate('video-consultation')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs text-slate-950 bg-teal-300 hover:bg-teal-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102"
                >
                  <Video className="w-4 h-4 text-slate-950" />
                  <span>Join Consultation</span>
                </button>
              )}
              <button
                onClick={() => setDetailDrawerTarget(nextAppointment)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. METRIC SUMMARY STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-xs hover:border-teal-500/30 transition-all">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Upcoming</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block font-mono">{upcomingCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896] dark:text-teal-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-xs hover:border-emerald-500/30 transition-all">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Completed</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block font-mono">{completedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-xs hover:border-rose-500/30 transition-all">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Cancelled</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block font-mono">{cancelledCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-xs hover:border-purple-500/30 transition-all">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">This Month</span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block font-mono">5</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PENDING APPOINTMENT REQUESTS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Appointment Requests</h3>
          {pendingRequests.length > 0 && (
            <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
              {pendingRequests.length}
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-slate-600 dark:text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">No pending appointment requests</h4>
            <p className="text-xs text-slate-500 dark:text-slate-450">You're all caught up. New appointment requests will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pendingRequests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 w-full min-w-0">
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 text-amber-600 dark:text-amber-400 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        Appointment Request
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        Pending Decision
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {req.doctorName || 'Dr. Arun Kumar'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-1 flex-wrap">
                      <span>{req.clinicName || 'General Medicine'}</span>
                      <span>•</span>
                      <span>{req.date} • {req.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pl-14 sm:pl-0">
                  <button
                    onClick={() => handleAcceptFollowUp(req.id)}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#00a896] hover:bg-[#00897b] shadow-md shadow-teal-500/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setDeclineConfirmTarget(req)}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setPendingDetailTarget(req)}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-750 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 4. APPOINTMENT TABS, TYPE FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        {/* STATUS TABS */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto font-mono">
          {[
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'past', label: 'Past', count: completedCount },
            { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 font-sans ${
                activeTab === tab.id
                  ? 'bg-[#00a896] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* RIGHT: TYPE FILTER & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* TYPE TOGGLE */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                selectedTypeFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedTypeFilter('video')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] flex items-center gap-1 ${
                selectedTypeFilter === 'video'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-cyan-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('in-person')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] flex items-center gap-1 ${
                selectedTypeFilter === 'in-person'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-cyan-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Clinic</span>
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
            />
          </div>
        </div>
      </div>

      {/* 5. APPOINTMENTS LIST */}
      <div className="space-y-3.5">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-[#00a896] mx-auto">
              <CalendarCheck2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">No Appointments Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no {activeTab} appointments matching your filter. Book a consultation or clear search filters.
            </p>
            <button
              onClick={() => {
                setSelectedDoctorForBooking(null);
                setBookingModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Consultation</span>
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-[#00a896]/40 p-5 rounded-3xl transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
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
                      className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {apt.doctorName}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      apt.status === 'Completed'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        : apt.status === 'Cancelled'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#00a896] dark:text-teal-400 mt-0.5">
                    {apt.speciality} • {apt.hospital}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                      {apt.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                      {apt.time}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] font-sans font-bold text-slate-600 dark:text-slate-400">
                      {apt.type} Visit
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setDetailDrawerTarget(apt)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Details</span>
                </button>

                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                  <>
                    <button
                      onClick={() => setReminderTarget(apt)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Set Reminder"
                    >
                      <Bell className="w-4 h-4 text-amber-500" />
                    </button>

                    <button
                      onClick={() => setRescheduleTarget(apt)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Reschedule"
                    >
                      <RefreshCw className="w-4 h-4 text-[#00a896]" />
                    </button>

                    <button
                      onClick={() => setCancelTarget(apt)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 cursor-pointer border border-rose-500/30 transition-colors"
                      title="Cancel"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>

                    {apt.type === 'Video' && (
                      <button
                        onClick={() => onNavigate('video-consultation')}
                        className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 6. TOP RECOMMENDED SPECIALISTS SPOTLIGHT */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-[#00a896] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Top Recommended Doctors</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified specialists available for immediate tele-consultation</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedDoctorForBooking(null);
              setBookingModalOpen(true);
            }}
            className="text-xs font-bold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Doctors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_DOCTORS.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={doctor.photoUrl}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-xl object-cover border border-teal-500/30 shrink-0 cursor-pointer"
                  onClick={() => setDoctorDrawerTarget(doctor)}
                />
                <div className="min-w-0">
                  <h4
                    onClick={() => setDoctorDrawerTarget(doctor)}
                    className="font-extrabold text-slate-900 dark:text-white text-xs truncate cursor-pointer hover:text-[#00a896]"
                  >
                    {doctor.name}
                  </h4>
                  <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 truncate">{doctor.speciality}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {doctor.rating}
                    </span>
                    <span>•</span>
                    <span>{doctor.experienceYears} yrs exp</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  ₹{doctor.fee} <span className="text-[10px] text-slate-500 font-normal font-sans">/ visit</span>
                </span>

                <button
                  onClick={() => {
                    setSelectedDoctorForBooking(doctor);
                    setBookingModalOpen(true);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-[#00a896] hover:bg-[#00897b] text-white text-[11px] font-extrabold cursor-pointer transition-all shadow-2xs"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS AND DRAWERS */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialDoctor={selectedDoctorForBooking}
        onConfirmBooking={handleConfirmNewBooking}
      />

      <DoctorProfileDrawer
        doctor={doctorDrawerTarget}
        isOpen={!!doctorDrawerTarget}
        onClose={() => setDoctorDrawerTarget(null)}
        onBookAppointment={(doc) => {
          setDoctorDrawerTarget(null);
          setSelectedDoctorForBooking(doc);
          setBookingModalOpen(true);
        }}
      />

      <AppointmentDetailsDrawer
        appointment={detailDrawerTarget}
        isOpen={!!detailDrawerTarget}
        onClose={() => setDetailDrawerTarget(null)}
        onJoin={(apt) => {
          setDetailDrawerTarget(null);
          if (apt.type === 'Video') onNavigate('video-consultation');
        }}
        onReschedule={(apt) => {
          setDetailDrawerTarget(null);
          setRescheduleTarget(apt);
        }}
        onCancel={(apt) => {
          setDetailDrawerTarget(null);
          setCancelTarget(apt);
        }}
        onAddReminder={(apt) => {
          setDetailDrawerTarget(null);
          setReminderTarget(apt);
        }}
      />

      <CalendarViewModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        appointments={appointments}
        onSelectAppointment={(apt) => {
          setCalendarModalOpen(false);
          setDetailDrawerTarget(apt);
        }}
      />

      <RescheduleModal
        appointment={rescheduleTarget}
        isOpen={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleConfirmReschedule}
      />

      <CancelConfirmModal
        appointment={cancelTarget}
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />

      <ReminderModal
        appointment={reminderTarget}
        isOpen={!!reminderTarget}
        onClose={() => setReminderTarget(null)}
        onSave={handleSaveReminder}
      />

      {/* Decline Appointment Confirmation Dialog */}
      <AnimatePresence>
        {declineConfirmTarget && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl text-slate-900 dark:text-white">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Decline appointment?</h3>
                <p className="text-xs text-slate-650 dark:text-slate-300 mt-1.5 leading-relaxed font-semibold">
                  Are you sure you want to decline this appointment request?
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    handleDeclineFollowUpConfirm(declineConfirmTarget.id);
                    setDeclineConfirmTarget(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors text-xs cursor-pointer shadow-md"
                >
                  Decline Appointment
                </button>
                <button
                  onClick={() => setDeclineConfirmTarget(null)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-250 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Pending Request Details Drawer / Modal */}
      <AnimatePresence>
        {pendingDetailTarget && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0 font-sans">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 text-amber-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                      Appointment Request
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Request Details
                    </h3>
                  </div>
                </div>
                <button onClick={() => setPendingDetailTarget(null)} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-900 dark:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs font-sans">
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                  You have received an appointment follow-up request from the doctor.
                </p>

                <div className="space-y-3.5 pt-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Doctor</div>
                      <div className="text-xs font-extrabold text-slate-950 dark:text-white">{pendingDetailTarget.doctorName || 'Dr. Arun Kumar'}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Department</div>
                      <div className="text-xs font-extrabold text-slate-955 dark:text-white">{pendingDetailTarget.clinicName || 'General Medicine'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Date</div>
                      <div className="text-xs font-extrabold text-slate-950 dark:text-white">{pendingDetailTarget.date}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Time</div>
                      <div className="text-xs font-extrabold text-slate-955 dark:text-white">{pendingDetailTarget.time}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2.5">
                <button
                  onClick={() => {
                    handleAcceptFollowUp(pendingDetailTarget.id);
                    setPendingDetailTarget(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Accept Request
                </button>
                <button
                  onClick={() => {
                    setPendingDetailTarget(null);
                    setDeclineConfirmTarget(pendingDetailTarget);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs border border-rose-250 transition-colors cursor-pointer"
                >
                  Decline Request
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

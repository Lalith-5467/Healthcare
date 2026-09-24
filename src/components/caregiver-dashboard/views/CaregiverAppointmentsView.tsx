import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Search,
  Filter,
  AlertCircle,
  CalendarDays,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  Building2,
  Info,
  CalendarCheck
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedName } from '../../../utils/caregiverDataTranslator';
import { DEMO_APPOINTMENTS_BY_WARD, type DemoAppointment } from '../../../mocks/caregiverAppointmentsMock';

export const CaregiverAppointmentsView: React.FC = () => {
  const { t } = useLanguage();
  const { wards, activeWard, setActiveWardId } = useCaregiverWorkflow();

  // In-memory appointments dataset mapped by ward ID
  const [appointmentsMap, setAppointmentsMap] = useState<Record<string, DemoAppointment[]>>(DEMO_APPOINTMENTS_BY_WARD);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'In-Person' | 'Video Consultation' | 'Follow-up' | 'General Consultation'>('All');

  // Modals & Drawers state
  const [selectedDetailAppointment, setSelectedDetailAppointment] = useState<DemoAppointment | null>(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<DemoAppointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Helper toast display
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Get current dependent's appointments
  const currentDependentAppointments = useMemo(() => {
    return appointmentsMap[activeWard.id] || [];
  }, [appointmentsMap, activeWard.id]);

  // Calculate dynamic summary stats for selected dependent
  const stats = useMemo(() => {
    const upcoming = currentDependentAppointments.filter(a => a.status === 'Upcoming').length;
    const todayCount = currentDependentAppointments.filter(a => 
      a.appointmentDate.toLowerCase().includes('today') || a.appointmentDate.toLowerCase().includes('tomorrow')
    ).length;
    const completed = currentDependentAppointments.filter(a => a.status === 'Completed').length;
    const cancelled = currentDependentAppointments.filter(a => a.status === 'Cancelled').length;

    return { upcoming, todayCount, completed, cancelled };
  }, [currentDependentAppointments]);

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return currentDependentAppointments.filter(apt => {
      // Status filter
      if (statusFilter !== 'All' && apt.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'All' && apt.appointmentType !== typeFilter) {
        return false;
      }
      // Search query filter (Doctor, Specialization, Hospital, Reason)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const docName = apt.doctorName.toLowerCase();
        const spec = apt.doctorSpecialization.toLowerCase();
        const hosp = apt.hospitalName.toLowerCase();
        const reason = apt.reason.toLowerCase();

        return docName.includes(q) || spec.includes(q) || hosp.includes(q) || reason.includes(q);
      }
      return true;
    });
  }, [currentDependentAppointments, statusFilter, typeFilter, searchQuery]);

  // Cancel Action (In-memory frontend only)
  const handleCancelAppointment = (aptId: string) => {
    setAppointmentsMap(prev => {
      const wardApts = prev[activeWard.id] || [];
      const updated = wardApts.map(a => a.id === aptId ? { ...a, status: 'Cancelled' as const } : a);
      return { ...prev, [activeWard.id]: updated };
    });
    showToast(t('caregiver.appointments.cancelled_toast', 'Appointment cancelled successfully. (Demo State Updated)'));
  };

  // Reschedule Action Submit
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppointment) return;

    const formattedDate = newDate || reschedulingAppointment.appointmentDate;
    const formattedTime = newTime || reschedulingAppointment.appointmentTime;

    setAppointmentsMap(prev => {
      const wardApts = prev[activeWard.id] || [];
      const updated = wardApts.map(a => a.id === reschedulingAppointment.id ? { 
        ...a, 
        status: 'Rescheduled' as const,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime
      } : a);
      return { ...prev, [activeWard.id]: updated };
    });

    setReschedulingAppointment(null);
    setNewDate('');
    setNewTime('');
    showToast(t('caregiver.appointments.rescheduled_toast', 'Appointment rescheduled successfully! (Demo State Updated)'));
  };

  // Helper function for status pill styles
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400';
      case 'Completed':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
      case 'Cancelled':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400';
      case 'Rescheduled':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & DEMO BADGE & DEPENDENT SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
              <span>{t('caregiver.appointments.title', 'Caregiver Appointments')}</span>
            </h1>
            {/* DEMO DATA INDICATOR */}
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 dark:text-cyan-400 text-[11px] font-black tracking-wide flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {t('caregiver.appointments.demo_badge', 'Demo Data')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('caregiver.appointments.subtitle', 'View and manage doctor appointments for your selected dependent.')}
          </p>
        </div>

        {/* DEPENDENT SWITCHER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {wards.map((ward) => (
            <button
              key={ward.id}
              onClick={() => setActiveWardId(ward.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                ward.id === activeWard.id
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/40'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <User className="w-3.5 h-3.5 opacity-80" />
              {getLocalizedName(ward.name, t)}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY CARDS (DYNAMICALLY CALCULATED) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* UPCOMING */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.appointments.upcoming', 'Upcoming Appointments')}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 mt-1">
              {stats.upcoming}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* TODAY'S */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.appointments.todays', "Today's Appointments")}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-cyan-500 dark:text-cyan-400 mt-1">
              {stats.todayCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* COMPLETED */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.appointments.completed', 'Completed')}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 mt-1">
              {stats.completed}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* CANCELLED */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.appointments.cancelled', 'Cancelled')}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-rose-400 mt-1">
              {stats.cancelled}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        
        {/* SEARCH INPUT */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('caregiver.appointments.search_placeholder', 'Search doctor, specialty, hospital or reason...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* STATUS & TYPE FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* STATUS FILTER DROPDOWN */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Filter className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-slate-500 dark:text-slate-400">{t('caregiver.appointments.filter_status', 'Status')}:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-slate-900 dark:text-white font-black text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">{t('caregiver.appointments.all_statuses', 'All Statuses')}</option>
              <option value="Upcoming" className="bg-slate-900 text-white">{t('caregiver.appointments.upcoming', 'Upcoming')}</option>
              <option value="Completed" className="bg-slate-900 text-white">{t('caregiver.appointments.completed', 'Completed')}</option>
              <option value="Cancelled" className="bg-slate-900 text-white">{t('caregiver.appointments.cancelled', 'Cancelled')}</option>
              <option value="Rescheduled" className="bg-slate-900 text-white">{t('caregiver.appointments.rescheduled', 'Rescheduled')}</option>
            </select>
          </div>

          {/* TYPE FILTER DROPDOWN */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-slate-500 dark:text-slate-400">{t('caregiver.appointments.filter_type', 'Type')}:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-transparent text-slate-900 dark:text-white font-black text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">{t('caregiver.appointments.all_types', 'All Types')}</option>
              <option value="In-Person" className="bg-slate-900 text-white">{t('caregiver.appointments.type_in_person', 'In-Person')}</option>
              <option value="Video Consultation" className="bg-slate-900 text-white">{t('caregiver.appointments.type_video', 'Video Consultation')}</option>
              <option value="Follow-up" className="bg-slate-900 text-white">{t('caregiver.appointments.type_followup', 'Follow-up')}</option>
              <option value="General Consultation" className="bg-slate-900 text-white">{t('caregiver.appointments.type_general', 'General Consultation')}</option>
            </select>
          </div>
        </div>

      </div>

      {/* APPOINTMENT LIST OR EMPTY STATE */}
      <div className="space-y-4">
        {currentDependentAppointments.length === 0 ? (
          /* EMPTY STATE - NO APPOINTMENTS FOR DEPENDENT */
          <div className="p-12 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {t('caregiver.appointments.no_appointments_found', 'No appointments found')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
              {t('caregiver.appointments.no_appointments_desc', 'There are no appointments available for this dependent yet.')}
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          /* EMPTY STATE - NO MATCHES FOR SEARCH/FILTER */
          <div className="p-12 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {t('caregiver.appointments.no_matching_search', 'No matching appointments')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
              {t('caregiver.appointments.no_matching_search_desc', 'Try adjusting your search terms or status filters.')}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); setTypeFilter('All'); }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <motion.div
              key={apt.id}
              whileHover={{ y: -2 }}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* ICON AVATAR */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md ${
                  apt.appointmentType === 'Video Consultation' ? 'bg-gradient-to-tr from-cyan-500 to-blue-600' :
                  apt.appointmentType === 'Follow-up' ? 'bg-gradient-to-tr from-teal-500 to-emerald-600' :
                  apt.appointmentType === 'In-Person' ? 'bg-gradient-to-tr from-indigo-500 to-purple-600' :
                  'bg-gradient-to-tr from-slate-600 to-slate-800'
                }`}>
                  {apt.appointmentType === 'Video Consultation' ? <Video className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                </div>

                {/* MAIN CONTENT */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {apt.doctorName}
                    </h3>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                      {apt.doctorSpecialization}
                    </span>
                    {/* STATUS BADGE */}
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(apt.status)}`}>
                      {apt.status === 'Upcoming' ? t('caregiver.appointments.upcoming', 'Upcoming') :
                       apt.status === 'Completed' ? t('caregiver.appointments.completed', 'Completed') :
                       apt.status === 'Cancelled' ? t('caregiver.appointments.cancelled', 'Cancelled') :
                       apt.status === 'Rescheduled' ? t('caregiver.appointments.rescheduled', 'Rescheduled') : apt.status}
                    </span>
                  </div>

                  {/* HOSPITAL & TYPE */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {apt.hospitalName}
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">
                      {apt.appointmentType}
                    </span>
                  </div>

                  {/* DATE & TIME */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
                    <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-black">
                      <Clock className="w-3.5 h-3.5" />
                      {apt.appointmentDate} • {apt.appointmentTime}
                    </span>
                  </div>

                  {/* REASON */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 pt-0.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{t('caregiver.appointments.reason', 'Reason')}: </span>
                    {apt.reason}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                {/* VIEW DETAILS BUTTON */}
                <button
                  onClick={() => setSelectedDetailAppointment(apt)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('caregiver.appointments.view_details', 'View Details')}</span>
                </button>

                {/* RESCHEDULE BUTTON (Available for non-cancelled appointments) */}
                {apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      setReschedulingAppointment(apt);
                      setNewDate(apt.appointmentDate);
                      setNewTime(apt.appointmentTime);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center gap-1.5 transition-all border border-purple-500/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('caregiver.appointments.reschedule', 'Reschedule')}</span>
                  </button>
                )}

                {/* CANCEL BUTTON (Available for non-cancelled appointments) */}
                {apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all border border-rose-500/20"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t('caregiver.appointments.cancel', 'Cancel')}</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedDetailAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" 
              onClick={() => setSelectedDetailAppointment(null)} 
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {t('caregiver.appointments.details_title', 'Appointment Details')}
                    </h3>
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">
                      {t('caregiver.appointments.demo_badge', 'Demo Data')}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDetailAppointment(null)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block font-semibold">{t('caregiver.appointments.dependent', 'Dependent')}:</span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {selectedDetailAppointment.dependentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">{t('caregiver.appointments.status_label', 'Status')}:</span>
                    <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getStatusBadgeStyle(selectedDetailAppointment.status)}`}>
                      {selectedDetailAppointment.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">{t('caregiver.appointments.doctor', 'Doctor')}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedDetailAppointment.doctorName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">{t('caregiver.appointments.specialization', 'Specialization')}:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{selectedDetailAppointment.doctorSpecialization}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">{t('caregiver.appointments.hospital', 'Hospital')}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedDetailAppointment.hospitalName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">{t('caregiver.appointments.date', 'Date')}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedDetailAppointment.appointmentDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">{t('caregiver.appointments.time', 'Time')}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedDetailAppointment.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-medium">{t('caregiver.appointments.filter_type', 'Appointment Type')}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedDetailAppointment.appointmentType}</span>
                  </div>
                </div>

                {/* REASON & NOTES */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                      {t('caregiver.appointments.reason', 'Reason for Visit')}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      {selectedDetailAppointment.reason}
                    </p>
                  </div>
                  {selectedDetailAppointment.notes && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                        {t('caregiver.appointments.notes', 'Notes')}:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 italic">
                        {selectedDetailAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedDetailAppointment(null)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {t('caregiver.common.close', 'Close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {reschedulingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" 
              onClick={() => setReschedulingAppointment(null)} 
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-500" />
                  <span>{t('caregiver.appointments.reschedule_title', 'Reschedule Appointment')}</span>
                </h3>
                <button onClick={() => setReschedulingAppointment(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
                <p className="text-slate-500 dark:text-slate-400 font-semibold">
                  Rescheduling consultation with <strong className="text-slate-900 dark:text-white">{reschedulingAppointment.doctorName}</strong> for {reschedulingAppointment.dependentName}.
                </p>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('caregiver.appointments.new_date', 'New Date')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. 26 Sep 2026 or Tomorrow"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('caregiver.appointments.new_time', 'New Time')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 11:30 AM or 04:00 PM"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setReschedulingAppointment(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    {t('caregiver.common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-600/20"
                  >
                    {t('caregiver.appointments.confirm_reschedule', 'Confirm Reschedule')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

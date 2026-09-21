import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, 
  Users, 
  Pill, 
  Activity, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Stethoscope, 
  ShieldCheck, 
  AlertOctagon, 
  X, 
  Heart,
  Droplets,
  Wind,
  Bell,
  ArrowRight,
  ExternalLink,
  Shield,
  FileText,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';
import { useLanguage } from '../../../context/LanguageContext';
import { DEMO_HOME_CARE_BOOKINGS_BY_WARD } from '../../../mocks/caregiverHomeCareMock';
import { 
  getLocalizedDosage, 
  getLocalizedInstructions, 
  getLocalizedTaskTitle, 
  getLocalizedTaskCategory, 
  getLocalizedLocation, 
  getLocalizedTimeAgo,
  getLocalizedName 
} from '../../../utils/caregiverDataTranslator';

interface CaregiverOverviewViewProps {
  onNavigate: (navId: string) => void;
  onOpenSOSModal?: () => void;
}

export const CaregiverOverviewView: React.FC<CaregiverOverviewViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { 
    wards, 
    activeWard, 
    setActiveWardId, 
    tasks, 
    toggleTask, 
    addVitalReading,
    triggerSOS,
    notifications,
    markNotificationRead
  } = useCaregiverWorkflow();

  const [isLogVitalOpen, setIsLogVitalOpen] = useState(false);
  const [isSOSConfirmOpen, setIsSOSConfirmOpen] = useState(false);
  const [systolic, setSystolic] = useState('126');
  const [diastolic, setDiastolic] = useState('82');
  const [bloodSugar, setBloodSugar] = useState('115');
  const [spo2, setSpo2] = useState('98');
  const [heartRate, setHeartRate] = useState('74');
  const [vitalNotes, setVitalNotes] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalReading(activeWard.id, {
      systolic: parseInt(systolic, 10) || undefined,
      diastolic: parseInt(diastolic, 10) || undefined,
      bloodSugar: parseInt(bloodSugar, 10) || undefined,
      sugarType: 'Random',
      spo2: parseInt(spo2, 10) || undefined,
      heartRate: parseInt(heartRate, 10) || undefined,
      notes: vitalNotes || 'Logged by Caregiver'
    });
    setIsLogVitalOpen(false);
    showToast(`Vitals successfully recorded for ${activeWard.name}!`);
  };

  const handleTriggerSOS = () => {
    triggerSOS(activeWard.id, 'SOS Panic Button');
    setIsSOSConfirmOpen(false);
    showToast(`🚨 Emergency SOS dispatched for ${activeWard.name}!`);
  };

  // --- DERIVED METRICS FOR ACTIVE DEPENDENT ONLY ---
  const wardAppointments = activeWard.appointments || [];
  const todaysAppointmentsCount = wardAppointments.filter(
    a => a.date === 'Today' || a.date === '21 Sep 2026' || a.status === 'Upcoming'
  ).length;
  const upcomingAppointments = wardAppointments.filter(a => a.status === 'Upcoming' || a.status === 'Rescheduled');

  const wardTasks = tasks.filter(t => t.wardId === activeWard.id);
  const pendingTasks = wardTasks.filter(t => !t.completed);
  const highPriorityTasks = wardTasks.filter(t => t.priority === 'high' && !t.completed);
  const overdueTasks = wardTasks.filter(t => t.status === 'Overdue' || (!t.completed && t.dueDate === 'Yesterday'));
  const recentlyCompletedTasks = wardTasks.filter(t => t.completed).slice(0, 3);

  const wardHomeCareBookings = DEMO_HOME_CARE_BOOKINGS_BY_WARD[activeWard.id] || [];
  const activeHomeCareBooking = wardHomeCareBookings.find(
    b => b.status !== 'Visit Completed' && b.status !== 'Cancelled'
  );
  const activeHomeCareBookingsCount = wardHomeCareBookings.filter(
    b => b.status !== 'Visit Completed' && b.status !== 'Cancelled'
  ).length;

  const latestVital = activeWard.vitals && activeWard.vitals.length > 0 ? activeWard.vitals[0] : null;

  const wardNotifications = notifications.filter(
    n => !n.dependentId || n.dependentId === activeWard.id
  );
  const unreadNotifications = wardNotifications.filter(n => !n.read);

  const handleNotificationClick = (notif: typeof wardNotifications[0]) => {
    markNotificationRead(notif.id);
    const targetRoute = notif.actionRoute || notif.relatedRoute;
    if (targetRoute) {
      onNavigate(targetRoute);
    }
  };

  return (
    <div className="space-y-6 select-none pb-16">
      
      {/* TOAST ALERT */}
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

      {/* TOP HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50/80 via-white to-cyan-50/80 dark:from-[#0b1b36] dark:via-[#092b49] dark:to-[#041a2e] p-6 sm:p-8 text-slate-900 dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl border border-transparent dark:border-slate-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-fuchsia-100/40 to-cyan-100/40 dark:from-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-400/30 text-teal-700 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {t('caregiver.overview.tag', 'Caregiver Command Center')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('caregiver.overview.title', 'Family Health & Guardian Portal')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
              {t('caregiver.overview.subtitle', 'Monitoring dependents across medication adherence, live vitals telemetry, geofence safety rings, and emergency doctor dispatch.')}
            </p>
          </div>

          {/* HERO QUICK ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLogVitalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>{t('caregiver.overview.log_vitals', 'Log Vitals')}</span>
            </button>
            <button
              onClick={() => onNavigate('medications')}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/20 transition-all flex items-center gap-2"
            >
              <Pill className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
              <span>{t('caregiver.overview.manage_pills', 'Manage Pills')}</span>
            </button>
            <button
              onClick={() => setIsSOSConfirmOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{t('caregiver.overview.emergency_sos', 'Emergency SOS')}</span>
            </button>
          </div>
        </div>

        {/* 1. TODAY'S CARE SUMMARY METRICS DECK */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/60">
          
          {/* Card 1: Today's Appointments */}
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.overview.summary_todays_appts', "Today's Appointments")}
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
              {todaysAppointmentsCount} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Scheduled</span>
            </p>
          </div>

          {/* Card 2: Pending Care Tasks */}
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.overview.summary_pending_tasks', 'Pending Care Tasks')}
            </p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-baseline gap-1">
              {pendingTasks.length} <span className="text-xs font-semibold text-amber-500/80">Pending</span>
            </p>
          </div>

          {/* Card 3: Active Home-care Bookings */}
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.overview.summary_home_care', 'Active Home-Care')}
            </p>
            <p className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1 flex items-baseline gap-1">
              {activeHomeCareBookingsCount} <span className="text-xs font-semibold text-cyan-500/80">Active</span>
            </p>
          </div>

          {/* Card 4: Latest Vitals */}
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.overview.summary_vitals', 'Latest Vitals')}
            </p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1 truncate">
              {latestVital?.systolic ? `${latestVital.systolic}/${latestVital.diastolic} BP` : latestVital?.bloodSugar ? `${latestVital.bloodSugar} mg/dL` : '--'}
            </p>
          </div>

          {/* Card 5: Unread Notifications */}
          <div className="col-span-2 sm:col-span-1 bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('caregiver.overview.summary_unread_notifs', 'Unread Notifications')}
            </p>
            <p className={`text-xl font-black mt-1 ${unreadNotifications.length > 0 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
              {unreadNotifications.length} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unread</span>
            </p>
          </div>

        </div>
      </div>

      {/* 7. DEPENDENT AWARENESS / MULTI-PATIENT SWITCHER CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
            <span>{t('caregiver.overview.wards_status_title', 'Assigned Wards & Family Health Status')}</span>
          </h2>
          <button 
            onClick={() => onNavigate('wards')} 
            className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            {t('caregiver.overview.view_all_profiles', 'View All Profiles')} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {wards.map((ward) => {
            const isSelected = ward.id === activeWard.id;
            const medCount = ward.medications.length;
            const takenCount = ward.medications.filter(m => m.takenToday).length;

            return (
              <motion.div
                key={ward.id}
                whileHover={{ y: -3 }}
                onClick={() => setActiveWardId(ward.id)}
                className={`cursor-pointer rounded-2xl p-4 transition-all relative overflow-hidden border ${
                  isSelected 
                    ? 'bg-white dark:bg-[#0f1d35] border-teal-500 dark:border-cyan-400 ring-2 ring-teal-500/20 shadow-xl'
                    : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-base shadow-md shrink-0">
                      {ward.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {getLocalizedName(ward.name, t)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        {ward.relationship.toLowerCase().includes('father') ? t('caregiver.common.father', 'Father') : ward.relationship.toLowerCase().includes('mother') ? t('caregiver.common.mother', 'Mother') : ward.relationship} • {ward.age} {t('caregiver.common.years', 'yrs')}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    ward.overallStatus === 'Alert' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse' :
                    ward.overallStatus === 'Needs Attention' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    {t(ward.overallStatus === 'Alert' ? 'caregiver.common.alert' : ward.overallStatus === 'Needs Attention' ? 'caregiver.common.needs_attention' : 'caregiver.common.stable', ward.overallStatus)}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-1">
                      <Pill className="w-3 h-3 text-teal-600 dark:text-cyan-400" /> {t('caregiver.overview.todays_meds', "Today's Meds")}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {takenCount}/{medCount}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2.5 bg-teal-50 dark:bg-cyan-950/40 text-teal-700 dark:text-cyan-300 text-[10px] font-black py-1 px-2.5 rounded-lg flex items-center justify-between">
                    <span>{t('caregiver.overview.currently_monitoring', 'Active Command')}</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 8. QUICK ACTIONS SHORTCUT BAR */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <span>{t('caregiver.overview.quick_actions_title', 'Daily Care Quick Actions')}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('appointments')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-900/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <Calendar className="w-5 h-5 text-teal-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {t('caregiver.overview.qa_appointments', 'View Appointments')}
            </span>
          </button>

          <button
            onClick={() => onNavigate('routines')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-900/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {t('caregiver.overview.qa_tasks', 'View Care Tasks')}
            </span>
          </button>

          <button
            onClick={() => onNavigate('home-care')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-900/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <Home className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {t('caregiver.overview.qa_home_care', 'Track Home Care')}
            </span>
          </button>

          <button
            onClick={() => onNavigate('records')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-900/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <FileText className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {t('caregiver.overview.qa_abha', 'View ABHA Records')}
            </span>
          </button>

          <button
            onClick={() => onNavigate('vitals')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-900/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <Activity className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {t('caregiver.overview.qa_vitals', 'View Vitals')}
            </span>
          </button>

          <button
            onClick={() => onNavigate('care-circle')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-900/60 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all flex flex-col items-center justify-center text-center gap-2 group"
          >
            <Shield className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {t('caregiver.overview.qa_privacy', 'Security & Privacy')}
            </span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CONTENT GRID FOR SELECTED WARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 7 COLS: UPCOMING APPOINTMENTS & CARE TASKS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 2. UPCOMING APPOINTMENTS SECTION */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <span>{t('caregiver.overview.upcoming_appts_title', 'Upcoming Appointments')}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {getLocalizedName(activeWard.name, t)}'s scheduled clinical consults
                </p>
              </div>

              <button
                onClick={() => onNavigate('appointments')}
                className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>{t('caregiver.overview.view_all_appts', 'View All Appointments')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* APPOINTMENT CONTENT / EMPTY STATE */}
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/10 dark:bg-cyan-500/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {getLocalizedName(appt.doctorName, t)}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {appt.specialty} • {appt.hospital}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-500" /> {appt.date} ({appt.time})
                          </span>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300">
                            {appt.mode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('caregiver.overview.no_appts', 'No upcoming appointments for this dependent.')}
                </p>
              </div>
            )}
          </div>

          {/* 3. CARE TASKS SECTION */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>{t('caregiver.overview.care_tasks_title', 'Care Tasks Summary')}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingTasks.length} pending, {highPriorityTasks.length} high-priority for {getLocalizedName(activeWard.name, t)}
                </p>
              </div>

              <button
                onClick={() => onNavigate('routines')}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>{t('caregiver.overview.view_all_tasks', 'View All Tasks')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* TASK LIST / EMPTY STATE */}
            {wardTasks.length > 0 ? (
              <div className="space-y-2">
                {/* Pending & Priority Tasks */}
                {pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-amber-400/50 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center transition-all hover:border-amber-500">
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3] text-amber-500" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          {getLocalizedTaskTitle(task.title, t)}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {getLocalizedTaskCategory(task.category, t)} • {task.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.priority === 'high' && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 uppercase">
                          High Priority
                        </span>
                      )}
                      {task.status === 'Overdue' && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 uppercase">
                          {t('caregiver.overview.task_overdue', 'Overdue')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Recently Completed Tasks */}
                {recentlyCompletedTasks.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                      {t('caregiver.overview.task_completed', 'Recently Completed')}
                    </p>
                    {recentlyCompletedTasks.map((tItem) => (
                      <div
                        key={tItem.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 flex items-center justify-between opacity-60 text-xs mb-1"
                      >
                        <span className="line-through text-slate-500 dark:text-slate-400 font-semibold">
                          {getLocalizedTaskTitle(tItem.title, t)}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('caregiver.overview.no_tasks', 'No care tasks assigned for this dependent.')}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT 5 COLS: HOME-CARE BOOKING, LATEST VITALS, UNREAD NOTIFICATIONS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 4. HOME-CARE BOOKING SECTION */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-cyan-500" />
                <span>{t('caregiver.overview.home_care_title', 'Active Home-Care Booking')}</span>
              </h3>

              <button
                onClick={() => onNavigate('home-care')}
                className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>{t('caregiver.overview.track_booking', 'Track Booking')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* BOOKING DETAILS / EMPTY STATE */}
            {activeHomeCareBooking ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider">
                      {activeHomeCareBooking.role}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {activeHomeCareBooking.careProfessionalName}
                    </h4>
                  </div>
                  <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 uppercase tracking-wider animate-pulse">
                    {activeHomeCareBooking.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-medium text-slate-600 dark:text-slate-300 border-t border-slate-200/50 dark:border-slate-800 pt-2">
                  <p className="truncate">
                    <strong className="text-slate-900 dark:text-white">{t('caregiver.overview.booking_service', 'Service')}:</strong> {activeHomeCareBooking.serviceType}
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Date/Time:</strong> {activeHomeCareBooking.bookingDate} • {activeHomeCareBooking.bookingTime} ({activeHomeCareBooking.duration})
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <Home className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('caregiver.overview.no_booking', 'No active home-care booking for this dependent.')}
                </p>
              </div>
            )}
          </div>

          {/* 5. LATEST VITALS TELEMETRY SECTION */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>{t('caregiver.overview.latest_vitals_title', 'Latest Biometrics Telemetry')}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {getLocalizedName(activeWard.name, t)}'s latest recorded vital signs
                </p>
              </div>

              <button
                onClick={() => onNavigate('vitals')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>{t('caregiver.overview.view_vitals_history', 'View Vitals History')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* VITALS GRID / EMPTY STATE */}
            {latestVital ? (
              <div className="grid grid-cols-2 gap-3">
                {/* BP */}
                <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {t('caregiver.overview.bp', 'BP')}</span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {latestVital.systolic && latestVital.diastolic ? `${latestVital.systolic}/${latestVital.diastolic}` : '--'}
                  </p>
                  <p className="text-[10px] text-slate-400">mmHg</p>
                </div>

                {/* Blood Sugar */}
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-amber-500" /> Sugar</span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {latestVital.bloodSugar ? latestVital.bloodSugar : '--'}
                  </p>
                  <p className="text-[10px] text-slate-400">mg/dL</p>
                </div>

                {/* SpO2 */}
                <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-900/30">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-sky-500" /> SpO2</span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {latestVital.spo2 ? `${latestVital.spo2}%` : '--'}
                  </p>
                  <p className="text-[10px] text-slate-400">Oxygen Saturation</p>
                </div>

                {/* Pulse */}
                <div className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/30">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-violet-500" /> Pulse</span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {latestVital.heartRate ? latestVital.heartRate : '--'}
                  </p>
                  <p className="text-[10px] text-slate-400">bpm</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <p className="text-sm font-black text-slate-400">--</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('caregiver.overview.no_vitals', '-- No vitals recorded for this dependent yet.')}
                </p>
              </div>
            )}
          </div>

          {/* 6. UNREAD NOTIFICATIONS SECTION */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                <span>{t('caregiver.overview.notifs_title', 'Unread Notifications')}</span>
              </h3>
              {unreadNotifications.length > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {unreadNotifications.length} New
                </span>
              )}
            </div>

            {/* NOTIFICATIONS LIST / EMPTY STATE */}
            {unreadNotifications.length > 0 ? (
              <div className="space-y-2.5">
                {unreadNotifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 hover:border-purple-400 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-purple-700 dark:text-purple-300 tracking-wider">
                        {notif.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.timestamp}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('caregiver.overview.no_notifs', 'No unread notifications for this dependent.')}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* LOG VITAL MODAL */}
      <AnimatePresence>
        {isLogVitalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsLogVitalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>{t('caregiver.overview.log_vitals_for', 'Log Vitals for')} {getLocalizedName(activeWard.name, t)}</span>
                </h3>
                <button onClick={() => setIsLogVitalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVital} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.overview.systolic_bp', 'Systolic BP (mmHg)')}</label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.overview.diastolic_bp', 'Diastolic BP (mmHg)')}</label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.overview.blood_sugar_label', 'Blood Sugar (mg/dL)')}</label>
                    <input
                      type="number"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      placeholder="110"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.overview.spo2_label', 'SpO2 Oxygen (%)')}</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="98"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.overview.heart_rate_label', 'Heart Rate / Pulse (bpm)')}</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="75"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.overview.notes_label', 'Caregiver Observation Notes')}</label>
                  <textarea
                    rows={2}
                    value={vitalNotes}
                    onChange={(e) => setVitalNotes(e.target.value)}
                    placeholder="Patient took medication on time..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLogVitalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    {t('caregiver.common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    {t('caregiver.overview.save_vitals', 'Save Vitals')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOS CONFIRMATION MODAL */}
      <AnimatePresence>
        {isSOSConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsSOSConfirmOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-rose-500/40 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto animate-bounce">
                <AlertOctagon className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('caregiver.overview.trigger_sos_title', 'Trigger Emergency SOS?')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('caregiver.overview.dispatch_desc', 'This will dispatch Apollo 108 Emergency Ambulance to')} <strong className="text-slate-900 dark:text-white">{getLocalizedName(activeWard.name, t)}</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-xs text-left space-y-1 border border-rose-200 dark:border-rose-900/40">
                <p className="font-bold">📍 {activeWard.currentLocation}</p>
                <p className="font-semibold text-[11px]">{t('caregiver.overview.known_allergies', 'Known Allergies:')} {activeWard.allergies.join(', ') || 'None'}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsSOSConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  {t('caregiver.common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleTriggerSOS}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30"
                >
                  {t('caregiver.overview.confirm_dispatch', 'Confirm & Dispatch SOS')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  Search 
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { DoctorSidebar } from '../components/doctor-dashboard/DoctorSidebar';
import { DoctorOverviewView } from '../components/doctor-dashboard/views/DoctorOverviewView';
import { Patient360View } from '../components/doctor-dashboard/views/Patient360View';
import { ConsultationView } from '../components/doctor-dashboard/views/ConsultationView';
import { MyPatientsDirectoryView } from '../components/doctor-dashboard/views/MyPatientsDirectoryView';
import { ConsultationDetailsView } from '../components/doctor-dashboard/views/ConsultationDetailsView';
import { ConsultationWorkspaceView } from '../components/doctor-dashboard/views/ConsultationWorkspaceView';
import { DoctorVideoConsultationView } from '../components/doctor-dashboard/views/DoctorVideoConsultationView';
import { DoctorAppointmentsScheduleView } from '../components/doctor-dashboard/views/DoctorAppointmentsScheduleView';
import { ClinicalNotesPrescriptionsView } from '../components/doctor-dashboard/views/ClinicalNotesPrescriptionsView';
import { DoctorProfileSettingsView } from '../components/doctor-dashboard/views/DoctorProfileSettingsView';
import { QRScannerView } from '../components/doctor-dashboard/views/QRScannerView';
import { NotificationPopover } from '../components/dashboard/NotificationPopover';
import { notificationApi } from '../services/dhrApis';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedName } from '../utils/caregiverDataTranslator';
import { DashboardAnnouncementBanner } from '../components/common/DashboardAnnouncementBanner';
import { IncomingCallModal } from '../components/common/IncomingCallModal';
import { socketService } from '../services/socketService';
import { getAuthToken } from '../services/apiClient';

interface DoctorDashboardPageProps {
  onLogout: () => void;
  user?: { name: string; email: string };
  initialNavId?: string;
  onNavigate?: (navId: string) => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({ onLogout, user, initialNavId, onNavigate: _onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const getInitialDoctorNav = () => {
    if (!initialNavId || initialNavId === 'dashboard') return 'overview';
    return initialNavId;
  };
  const [activeNav, setActiveNav] = useState(getInitialDoctorNav());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState<string | null>('1');
  const [scannedPatientName, setScannedPatientName] = useState<string | undefined>(undefined);
  const [patient360Tab, setPatient360Tab] = useState('summary');
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  React.useEffect(() => {
    if (initialNavId) {
      setActiveNav(initialNavId === 'dashboard' ? 'overview' : initialNavId);
    }
  }, [initialNavId]);

  const loadUnreadCount = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res && res.data) {
        setUnreadNotificationsCount(res.data.filter((n: any) => !n.isRead).length);
      }
    } catch {}
  };

  React.useEffect(() => {
    // Ensure socket connection is active on Doctor Dashboard with valid doctor auth token
    const token = getAuthToken();
    if (token) {
      socketService.connect(token);
    } else {
      socketService.connect();
    }

    loadUnreadCount();
    const handleUpdate = () => loadUnreadCount();
    window.addEventListener('notifications_updated', handleUpdate);
    return () => window.removeEventListener('notifications_updated', handleUpdate);
  }, []);

  const doctorName = user?.name ? (user.name.startsWith('Dr') ? user.name : `Dr. ${user.name}`) : 'Dr. Sarah Jenkins';

  const handleScanSuccess = (patientId: string) => {
    setScannedPatientId(patientId);
    setScannedPatientName(undefined);
    setPatient360Tab('summary');
    setActiveNav('patient-360');
  };

  const handleSelectPatient = (patientId: string, name?: string) => {
    setScannedPatientId(patientId);
    setScannedPatientName(name);
    setPatient360Tab('summary');
    setActiveNav('patient-360');
  };

  const handleViewProfile = (patientId: string, tab: string = 'summary', name?: string) => {
    setScannedPatientId(patientId);
    setScannedPatientName(name);
    setPatient360Tab(tab);
    setActiveNav('patient-360');
  };

  const handleStartConsultation = (patientId: string) => {
    setScannedPatientId(patientId);
    setActiveNav('consultation-workspace');
  };

  const handleViewConsultation = (patientId: string) => {
    setScannedPatientId(patientId);
    setActiveNav('consultation-details');
  };

  const renderActiveView = () => {
    switch (activeNav) {
      case 'overview':
        return <DoctorOverviewView onNavigate={setActiveNav} onSelectPatient={handleSelectPatient} user={user} />;
      case 'appointments':
      case 'schedule':
      case 'queue':
        return (
          <DoctorAppointmentsScheduleView 
            onStartConsultation={handleStartConsultation} 
            onViewProfile={handleViewProfile}
            onViewConsultation={handleViewConsultation}
          />
        );
      case 'patients':
      case 'directory':
        return (
          <MyPatientsDirectoryView 
            onSelectPatient={handleSelectPatient}
          />
        );
      case 'scan':
        return <QRScannerView onScanSuccess={handleScanSuccess} onNavigateToDashboard={() => setActiveNav('overview')} />;
      case 'patient-360':
      case 'vitals':
      case 'labs':
      case 'documents':
      case 'nurse-updates':
        return <Patient360View patientId={scannedPatientId || '1'} patientName={scannedPatientName} onNavigate={setActiveNav} initialTab={patient360Tab} />;
      case 'consultation-details':
        return <ConsultationDetailsView patientId={scannedPatientId || '1'} onNavigate={setActiveNav} />;
      case 'video-consultation':
      case 'teleconsult':
        return <DoctorVideoConsultationView user={user} patientId={scannedPatientId} onNavigate={setActiveNav} />;
      case 'consultation-workspace':
      case 'consultations':
        return <ConsultationWorkspaceView patientId={scannedPatientId || '1'} onNavigate={setActiveNav} />;
      case 'prescriptions':
      case 'clinical-notes':
        return <ClinicalNotesPrescriptionsView />;
      case 'settings':
      case 'profile':
        return <DoctorProfileSettingsView user={user} />;
      default:
        return <DoctorOverviewView onNavigate={setActiveNav} user={user} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs">
        {/* LEFT SECTION: BRANDING & ROLE PILL */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button 
            className="lg:hidden p-2 -ml-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-teal-700 dark:text-cyan-300 bg-teal-500/10 dark:bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-teal-500/20 flex items-center gap-1.5 whitespace-nowrap">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400 shrink-0" />
                <span>{t('doctor.portal.title', 'Doctor Portal')}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* RIGHT SECTION: ACTIONS, CONTROLS & PROFILE */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* SEARCH BAR */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 w-44 lg:w-56 xl:w-64 transition-all focus-within:border-teal-500 dark:focus-within:border-cyan-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder={t('doctor.header.search_placeholder', 'Search patients, meds...')} 
              className="bg-transparent text-xs font-semibold text-slate-900 dark:text-white w-full focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              onClick={() => setActiveNav('patients')}
            />
          </div>

          {/* LANGUAGE TOGGLE */}
          <div className="hidden lg:flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'en' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-cyan-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'ta' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-cyan-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              தமிழ்
            </button>
          </div>

          {/* THEME TOGGLE */}
          <div className="flex items-center shrink-0">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <button 
            type="button"
            onClick={() => setNotificationPopoverOpen(true)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Doctor Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Quick QR Scanner Shortcut */}
          <button
            type="button"
            onClick={() => setActiveNav('scan')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-teal-200 dark:border-teal-800/60 shadow-2xs shrink-0 active:scale-95"
          >
            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{t('doctor.sidebar.scan_qr', 'Scan Patient QR')}</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

          {/* Doctor Profile Pill */}
          <button
            type="button"
            onClick={() => setActiveNav('settings')}
            className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer shrink-0"
            title="View Profile & Settings"
          >
            <div className="w-7 h-7 rounded-lg bg-[#00a896] text-white font-extrabold text-xs flex items-center justify-center font-mono shadow-xs shrink-0">
              {doctorName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR'}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap max-w-[140px] truncate">{getLocalizedName(doctorName, t)}</span>
          </button>

          {/* Logout Button */}
          <button 
            type="button"
            onClick={onLogout}
            className="px-3 py-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs shrink-0 active:scale-95"
            title={t('doctor.header.logout', 'Logout')}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">{t('doctor.header.logout', 'Logout')}</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block shrink-0">
          <DoctorSidebar activeNav={activeNav} onNavigate={setActiveNav} user={user} />
        </div>

        {/* MOBILE SIDEBAR MODAL */}
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl flex flex-col z-10"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white">{t('doctor.sidebar.practitioner_console', 'Doctor Console')}</span>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <DoctorSidebar 
                    activeNav={activeNav} 
                    onNavigate={(id) => {
                      setActiveNav(id);
                      setIsSidebarOpen(false);
                    }} 
                    user={user} 
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN WORKBENCH VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto h-full">
            <DashboardAnnouncementBanner role="doctor" />
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* REAL-TIME INCOMING VIDEO CALL MODAL */}
      <IncomingCallModal 
        currentDoctorName={user?.name}
        onAcceptCall={(_session) => {
          setActiveNav('video-consultation');
        }}
      />

      {/* NOTIFICATIONS POPOVER */}
      <NotificationPopover
        isOpen={notificationPopoverOpen}
        onClose={() => setNotificationPopoverOpen(false)}
        role="doctor"
        onNavigateToNotifications={() => {
          setNotificationPopoverOpen(false);
          setActiveNav('appointments');
        }}
        onNavigateToPatient360={(patientId) => {
          setNotificationPopoverOpen(false);
          if (patientId) {
            handleSelectPatient(patientId);
          } else {
            setActiveNav('patient-360');
          }
        }}
      />
    </div>
  );
};


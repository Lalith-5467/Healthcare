import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, Home } from 'lucide-react';
import { Sidebar, MobileSidebar, PremiumModal } from '../components/sidebar';
import { showGlobalToast } from '../components/common/GlobalToastManager';
import { useLanguage } from '../context/LanguageContext';
import {
  DashboardHeader,
  DashboardStatsGrid,
  HealthScoreCard,
  HealthAccessCard,
  TodaysFocusGrid,
  HealthSnapshotGrid,
  HealthInsightCard,
  UpcomingAppointmentCard,
  MedicationListCard,
  RecentRecordsCard,
  HealthProgressChart,
  EmergencyQuickCard,
  QuickActionsGrid,
  PremiumDashboardCard,
  AIAssistantDashboardCard,
  InsuranceSummaryCard,
  FamilyConnectCard,
  NearbyHospitalsCard,
  RecentActivityTimeline,
  DashboardSkeleton,
  HealthShortsCard,
  HealthShortsView
} from '../components/dashboard';
import { PatientAccessRequestsModal } from '../components/dashboard/PatientAccessRequestsModal';
import { RecentPrescriptionTrackCard } from '../components/dashboard/RecentPrescriptionTrackCard';
import { socketService } from '../services/socketService';
import { DashboardAnnouncementBanner } from '../components/common/DashboardAnnouncementBanner';
import { useSiteConfig } from '../context/ConfigContext';

import { ProfileView } from '../components/profile';
import { RecordsView } from '../components/records';
import { ScanView } from '../components/scan/ScanView';
import { AppointmentsView } from '../components/appointments/AppointmentsView';
import { MedicinesView } from '../components/medicines/MedicinesView';
import { PharmacyView } from '../components/pharmacy/PharmacyView';
import { ConsultationView } from '../components/consultation/ConsultationView';
import { RemindersView } from '../components/reminders/RemindersView';
import { AnalyticsView } from '../components/analytics/AnalyticsView';
import { FamilyConnectView } from '../components/family/FamilyConnectView';
import { CheckupView } from '../components/checkup/CheckupView';
import { HospitalsView } from '../components/hospitals/HospitalsView';
import { InsuranceView } from '../components/insurance/InsuranceView';
import { EmergencyView } from '../components/emergency/EmergencyView';
import { SettingsView } from '../components/settings/SettingsView';
import { AIAssistantView } from '../components/ai-assistant/AIAssistantView';
import { MoreFeaturesView } from '../components/more-features/MoreFeaturesView';
import { LabTestView } from '../components/more-features/views/LabTestView';
import { DietPlanView } from '../components/more-features/views/DietPlanView';
import { ReportInsightsView } from '../components/more-features/views/ReportInsightsView';
import { NurseBookingView } from '../components/more-features/views/NurseBookingView';
import { CaregiverBookingView } from '../components/dashboard/CaregiverBookingView';
import { JanitorBookingView } from '../components/more-features/views/JanitorBookingView';
import { SecurityPrivacyView } from '../components/more-features/views/SecurityPrivacyView';
import { LanguageProvider } from '../context/LanguageContext';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface DashboardPageProps {
  user?: UserProfile;
  initialNavId?: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onOpenEmergencyModal: () => void;
  onOpenAbhaModal: () => void;
}

const DashboardPageInner: React.FC<DashboardPageProps> = ({
  user = {
    name: 'Patient',
    email: '',
    role: 'Patient',
    abhaId: '',
    bloodGroup: 'O+',
    age: 30
  },
  initialNavId = 'dashboard',
  onLogout,
  onNavigate: _onNavigate,
  onOpenEmergencyModal,
  onOpenAbhaModal
}) => {
  const { t } = useLanguage();
  const [activeNavId, setActiveNavId] = useState<string>(initialNavId);

  useEffect(() => {
    if (initialNavId) {
      setActiveNavId(initialNavId);
    }
  }, [initialNavId]);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [accessRequestsModalOpen, setAccessRequestsModalOpen] = useState(false);
  const [showShorts, setShowShorts] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | undefined>(undefined);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  let patientWidgets: any = {};
  try {
    const siteConfig = useSiteConfig();
    patientWidgets = siteConfig.dashboards?.patient?.widgets || {};
  } catch {}

  const sectionGridClass = showShorts 
    ? "grid grid-cols-1 gap-6" 
    : "grid grid-cols-1 lg:grid-cols-2 gap-6";

  const [livePatientProfile, setLivePatientProfile] = useState<any>(null);

  // Fetch actual patient profile from backend on mount
  useEffect(() => {
    let isMounted = true;
    import('../services/apiClient').then(({ apiClient }) => {
      apiClient.get<any>('/profile/patient').then((res) => {
        if (res && res.data && res.data.fullName && isMounted) {
          const fn = res.data.fullName.trim();
          setLivePatientProfile(res.data);
          localStorage.setItem('patient_user_name', fn);
          const currentAppUserStr = localStorage.getItem('app_user');
          let currentParsed: any = {};
          try {
            if (currentAppUserStr) currentParsed = JSON.parse(currentAppUserStr);
          } catch {}
          const merged = {
            ...currentParsed,
            ...(user || {}),
            name: fn,
            role: 'Patient',
            abhaId: res.data.abhaId || res.data.user?.abhaId || currentParsed.abhaId,
            bloodGroup: res.data.bloodGroup || currentParsed.bloodGroup,
            gender: res.data.gender || currentParsed.gender,
          };
          localStorage.setItem('patient_user', JSON.stringify(merged));
          localStorage.setItem('app_user', JSON.stringify(merged));
        }
      }).catch(() => {});
    });
    return () => { isMounted = false; };
  }, [user]);

  const effectiveUser: UserProfile = React.useMemo(() => {
    const isDoctorOrStaff = (name?: string): boolean => {
      if (!name) return false;
      const lower = name.toLowerCase().trim();
      return (
        lower === 'patient' ||
        lower === 'ananya sharma' ||
        lower === 'ananya' ||
        lower.startsWith('dr.') ||
        lower.startsWith('dr ') ||
        lower.includes('doctor') ||
        lower.includes('arjun') ||
        lower.includes('pharmacist') ||
        lower.includes('r.ph') ||
        lower.includes('suresh nair') ||
        lower.includes('nurse') ||
        lower.includes('admin') ||
        lower.includes('caregiver')
      );
    };

    let resolvedName = livePatientProfile?.fullName?.trim() || '';

    if (!resolvedName || isDoctorOrStaff(resolvedName)) {
      resolvedName = user?.name || '';
    }

    if (!resolvedName || isDoctorOrStaff(resolvedName)) {
      try {
        const custom = localStorage.getItem('patient_user_name');
        if (custom && custom.trim() && !isDoctorOrStaff(custom)) {
          resolvedName = custom.trim();
        } else {
          const patientUser = localStorage.getItem('patient_user');
          if (patientUser) {
            const parsed = JSON.parse(patientUser);
            if (parsed?.name && !isDoctorOrStaff(parsed.name)) {
              resolvedName = parsed.name.trim();
            }
          }
          if (!resolvedName || isDoctorOrStaff(resolvedName)) {
            const prof = localStorage.getItem('user_profile_data');
            if (prof) {
              const parsed = JSON.parse(prof);
              if (parsed?.name && !isDoctorOrStaff(parsed.name)) {
                resolvedName = parsed.name.trim();
              }
            }
          }
          if (!resolvedName || isDoctorOrStaff(resolvedName)) {
            const appUser = localStorage.getItem('app_user');
            if (appUser) {
              const parsed = JSON.parse(appUser);
              if (parsed?.name && !isDoctorOrStaff(parsed.name)) {
                resolvedName = parsed.name.trim();
              }
            }
          }
        }
      } catch {}
    }

    if (!resolvedName || isDoctorOrStaff(resolvedName)) {
      resolvedName = user?.email ? user.email.split('@')[0] : 'Patient';
    }

    return {
      ...(user || {}),
      name: resolvedName,
      email: user?.email || livePatientProfile?.user?.email || '',
      role: 'Patient',
      abhaId: livePatientProfile?.abhaId || user?.abhaId || '91-8472-9104-5821@abdm',
      bloodGroup: livePatientProfile?.bloodGroup || user?.bloodGroup || 'O+',
      age: user?.age || 30,
    };
  }, [user, livePatientProfile]);

  // Connect socket and listen for requests modal trigger
  useEffect(() => {
    socketService.connect();

    const handleOpenModal = () => {
      setAccessRequestsModalOpen(true);
    };
    window.addEventListener('open_access_requests_modal', handleOpenModal);

    return () => {
      window.removeEventListener('open_access_requests_modal', handleOpenModal);
    };
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    showGlobalToast(msg, type);
  };

  const handleSelectNav = (id: string) => {
    if (id === 'home') {
      if (_onNavigate) {
        _onNavigate('home');
      }
      return;
    }
    const targetId = (id === 'appointment') ? 'appointments' : (id === 'medicine') ? 'medicines' : (id === 'video-consultation') ? 'consultation' : (id === 'reminder') ? 'reminders' : (id === 'notification') ? 'notifications' : (id === 'health-analytics') ? 'analytics' : (id === 'family-connect') ? 'family' : (id === 'health-checkup') ? 'checkup' : (id === 'nearby-hospitals') ? 'hospitals' : id;

    if (targetId === 'health-shorts') {
      setShowShorts(true);
      return;
    }

    setActiveNavId(targetId);
    localStorage.setItem('app_active_nav_id', targetId);

    // Scroll only the main dashboard container to top smoothly without touching window
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }

    const urlMap: Record<string, string> = {
      'family': '/user/family-connect',
      'consultation': '/user/video-consultation',
      'analytics': '/user/health-analytics',
      'checkup': '/user/health-checkup',
      'hospitals': '/user/hospitals',
      'insurance': '/user/insurance',
      'emergency': '/user/emergency',
      'settings': '/user/settings',
      'ai-assistant': '/user/ai-assistant',
      'assistant': '/user/ai-assistant',
      'reminders': '/user/reminders',
      'appointments': '/user/appointments',
      'medicines': '/user/medicines',
      'pharmacy': '/user/pharmacy',
      'profile': '/user/profile',
      'records': '/user/records',
      'scan': '/user/scan',
      'dashboard': '/user/dashboard',
      'lab-test': '/user/lab-tests',
      'diet-plan': '/user/diet-plans',
      'report-insights': '/user/insights',
      'nurse-booking': '/user/nurse-booking',
      'caregiver-booking': '/user/caregiver-booking',
      'janitor-booking': '/user/janitor-booking',
      'security-privacy': '/user/security'
    };

    const targetUrl = urlMap[targetId] || `/user/${targetId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    if (targetId === 'emergency') {
      onOpenEmergencyModal();
    } else if (targetId === 'abha') {
      onOpenAbhaModal();
    } else if (targetId === 'doctor-access' || targetId === 'access-requests' || targetId === 'consents') {
      setAccessRequestsModalOpen(true);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 flex select-none">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0">
        <Sidebar 
          activeId={activeNavId} 
          onSelectNav={handleSelectNav} 
          user={effectiveUser} 
          onLogout={onLogout} 
        />
      </div>

      {/* MOBILE OFF-CANVAS SIDEBAR */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
        activeId={activeNavId} 
        onSelectNav={handleSelectNav} 
        user={effectiveUser} 
        onLogout={onLogout} 
      />

      {/* MAIN DASHBOARD WORKSPACE (ISOLATED FULL-APP SCROLL CONTAINER) */}
      <div 
        ref={mainScrollRef}
        className="flex-1 min-w-0 overflow-x-hidden h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 transition-all duration-300"
      >
        <div className="w-full max-w-[1600px] mx-auto pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8">

        {/* MOBILE SIDEBAR MENU TRIGGER */}
        <div className="lg:hidden mb-4 flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer border border-slate-200 dark:border-slate-700"
              aria-label={t('mobile.openSidebar', 'Open Sidebar Navigation')}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{t('mobile.healthcareMenu', 'Healthcare Menu')}</span>
          </div>
          <button
            onClick={() => handleSelectNav('home')}
            className="px-2.5 py-1 text-[10px] font-black bg-teal-500/10 dark:bg-[#00a896]/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 font-sans hover:bg-[#00a896] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title={t('goToHome', 'Go to Home')}
          >
            <Home className="w-3 h-3" />
            <span>{t('nav.home', 'Home')}</span>
          </button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : activeNavId === 'profile' ? (
          <ProfileView
            user={effectiveUser}
            onNavigate={handleSelectNav}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />
        ) : activeNavId === 'records' ? (
          <RecordsView
            user={effectiveUser}
            onNavigateScan={() => handleSelectNav('scan')}
          />
        ) : activeNavId === 'scan' ? (
          <ScanView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'appointments' || activeNavId === 'appointment') ? (
          <AppointmentsView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'medicines' || activeNavId === 'medicine') ? (
          <MedicinesView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'pharmacy' || activeNavId === 'orders') ? (
          <PharmacyView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'consultation' || activeNavId === 'video-consultation') ? (
          <ConsultationView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'reminders' || activeNavId === 'notifications') ? (
          <RemindersView
            user={effectiveUser}
            onNavigate={handleSelectNav}
            initialViewMode={activeNavId === 'notifications' ? 'timeline' : 'list'}
          />
        ) : (activeNavId === 'analytics' || activeNavId === 'health-analytics') ? (
          <AnalyticsView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'family' || activeNavId === 'family-connect') ? (
          <FamilyConnectView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'checkup' || activeNavId === 'health-checkup') ? (
          <CheckupView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'hospitals' || activeNavId === 'nearby-hospitals') ? (
          <HospitalsView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'insurance' ? (
          <InsuranceView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'more-features' || activeNavId === 'features') ? (
          <MoreFeaturesView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'emergency' || activeNavId === 'sos') ? (
          <EmergencyView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'settings' ? (
          <SettingsView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'ai-assistant' || activeNavId === 'assistant') ? (
          <AIAssistantView
            user={effectiveUser}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'lab-test' ? (
          <LabTestView />
        ) : activeNavId === 'diet-plan' ? (
          <DietPlanView patientName={effectiveUser.name.split(' ')[0]} user={effectiveUser as any} />
        ) : activeNavId === 'report-insights' ? (
          <ReportInsightsView />
        ) : activeNavId === 'nurse-booking' ? (
          <NurseBookingView user={effectiveUser} />
        ) : activeNavId === 'caregiver-booking' ? (
          <CaregiverBookingView user={effectiveUser} onNavigate={handleSelectNav} />
        ) : activeNavId === 'janitor-booking' ? (
          <JanitorBookingView />
        ) : activeNavId === 'security-privacy' ? (
          <SecurityPrivacyView />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto space-y-6 w-full overflow-x-hidden"
          >
            {/* STICKY TOP APP HEADER BAR - DISPLAYED ONLY ON DASHBOARD OVERVIEW */}
            <DashboardHeader
              userName={effectiveUser.name.split(' ')[0]}
              onOpenNotifications={() => handleSelectNav('notifications')}
              onOpenProfile={() => handleSelectNav('profile')}
              onNavigateHome={() => handleSelectNav('home')}
              onNavigate={handleSelectNav}
              onLogout={onLogout}
              isShortsOpen={showShorts}
            />

            {/* ROLE-SPECIFIC ANNOUNCEMENT BANNER */}
            <DashboardAnnouncementBanner role="patient" />

            {/* 2. PRIMARY HEALTH SCORE & ABDM ACCESS HERO CARDS */}
            <DashboardStatsGrid 
              onNavigate={handleSelectNav} 
              isShortsOpen={showShorts}
            />

            {/* 2.5 LIVE VERIFIED PRESCRIPTION & PHARMACY TRACKING CARD */}
            <RecentPrescriptionTrackCard
              onNavigate={handleSelectNav}
              onToast={showToast}
              isShortsOpen={showShorts}
            />

            {/* 3. HEALTH OVERVIEW HERO GRID (HEALTH SCORE + HEALTH ACCESS) */}
            <section className={sectionGridClass}>
              {patientWidgets.healthScore !== false && <HealthScoreCard />}
              <HealthAccessCard
                abhaId={effectiveUser.abhaId}
                userName={effectiveUser.name}
                patientId={(effectiveUser as any)?.id || (effectiveUser as any)?.profileId}
                onToast={showToast}
              />
            </section>

            {/* HEALTH SHORTS CARD */}
            {patientWidgets.healthShorts !== false && (
              <section>
                <HealthShortsCard
                  onOpenShorts={(videoId) => {
                    setSelectedShortId(videoId);
                    setShowShorts(true);
                  }}
                />
              </section>
            )}

            {/* 4. TODAY'S FOCUS & UPCOMING APPOINTMENT */}
            <section className={sectionGridClass}>
              <TodaysFocusGrid
                onNavigate={handleSelectNav}
                onToast={showToast}
              />
              <UpcomingAppointmentCard
                onNavigate={handleSelectNav}
                onToast={showToast}
              />
            </section>

            {/* 5. HEALTH SNAPSHOT & INSIGHT */}
            <section className={sectionGridClass}>
              <HealthSnapshotGrid />
              <HealthInsightCard onNavigate={handleSelectNav} />
            </section>

            {/* 6. MEDICATIONS & HEALTH PROGRESS CHART */}
            <section className={sectionGridClass}>
              <MedicationListCard
                onNavigate={handleSelectNav}
                onToast={showToast}
              />
              <HealthProgressChart />
            </section>

            {/* 7. QUICK ACTIONS */}
            <QuickActionsGrid onNavigate={handleSelectNav} />

            {/* 8. AI HEALTH ASSISTANT PREVIEW */}
            <AIAssistantDashboardCard onNavigate={handleSelectNav} />

            {/* 9. INSURANCE & FAMILY CONNECT */}
            <section className={sectionGridClass}>
              <InsuranceSummaryCard onNavigate={handleSelectNav} />
              <FamilyConnectCard onNavigate={handleSelectNav} />
            </section>

            {/* 10. NEARBY HOSPITALS & EMERGENCY SOS */}
            <section className={sectionGridClass}>
              <NearbyHospitalsCard onNavigate={handleSelectNav} />
              <EmergencyQuickCard onOpenEmergency={onOpenEmergencyModal} />
            </section>

            {/* 11. RECENT RECORDS & ACTIVITY TIMELINE */}
            <section className={sectionGridClass}>
              <RecentRecordsCard
                onNavigate={handleSelectNav}
                onToast={showToast}
              />
              <RecentActivityTimeline />
            </section>

            {/* 12. PREMIUM PROMOTION */}
            <PremiumDashboardCard onOpenPremium={() => setPremiumModalOpen(true)} />
          </motion.div>
        )}

        </div>
      </div>

      {/* PREMIUM MODAL */}
      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />

      {/* PATIENT DOCTOR ACCESS REQUESTS & CONSENT MODAL */}
      <PatientAccessRequestsModal
        isOpen={accessRequestsModalOpen}
        onClose={() => setAccessRequestsModalOpen(false)}
        onToast={showToast}
      />

      <AnimatePresence>
        {showShorts && (
          <HealthShortsView 
            onClose={() => {
              setShowShorts(false);
              setSelectedShortId(undefined);
            }} 
            initialVideoId={selectedShortId}
            patientHealthInfo={effectiveUser.name} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export const DashboardPage: React.FC<DashboardPageProps> = (props) => (
  <LanguageProvider>
    <DashboardPageInner {...props} />
  </LanguageProvider>
);

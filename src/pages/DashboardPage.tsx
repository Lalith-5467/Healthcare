import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, Home } from 'lucide-react';
import { Sidebar, MobileSidebar, PremiumModal } from '../components/sidebar';
import { showGlobalToast } from '../components/common/GlobalToastManager';
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
  DashboardSkeleton
} from '../components/dashboard';
import { RecentPrescriptionTrackCard } from '../components/dashboard/RecentPrescriptionTrackCard';

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
import { JanitorBookingView } from '../components/more-features/views/JanitorBookingView';
import { SecurityPrivacyView } from '../components/more-features/views/SecurityPrivacyView';

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

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user = {
    name: 'Samson L.',
    email: 'samson.l@abdm.in',
    role: 'Patient',
    abhaId: '91-8472-9104-5821@abdm',
    bloodGroup: 'O+',
    age: 32
  },
  initialNavId = 'dashboard',
  onLogout,
  onNavigate: _onNavigate,
  onOpenEmergencyModal,
  onOpenAbhaModal
}) => {
  const [activeNavId, setActiveNavId] = useState<string>(initialNavId);

  useEffect(() => {
    if (initialNavId) {
      setActiveNavId(initialNavId);
    }
  }, [initialNavId]);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Simulated short initial dashboard loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage(msg);
    showGlobalToast(msg, type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectNav = (id: string) => {
    if (id === 'home') {
      if (_onNavigate) {
        _onNavigate('home');
      }
      return;
    }
    const targetId = (id === 'appointment') ? 'appointments' : (id === 'medicine') ? 'medicines' : (id === 'video-consultation') ? 'consultation' : (id === 'reminder') ? 'reminders' : (id === 'notification') ? 'notifications' : (id === 'health-analytics') ? 'analytics' : (id === 'family-connect') ? 'family' : (id === 'health-checkup') ? 'checkup' : (id === 'nearby-hospitals') ? 'hospitals' : id;
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
    } else if (targetId === 'profile') {
      showToast('Switched to My Health Profile');
    } else if (targetId === 'records') {
      showToast('Switched to Medical Records');
    } else if (targetId === 'scan') {
      showToast('Switched to Scan & Upload');
    } else if (targetId === 'appointments') {
      showToast('Switched to Appointments');
    } else if (targetId === 'medicines') {
      showToast('Switched to Medicines');
    } else if (targetId === 'pharmacy') {
      showToast('Switched to Pharmacy Tracking');
    } else if (targetId === 'consultation') {
      showToast('Switched to Video Consultation');
    } else if (targetId === 'reminders' || targetId === 'notifications') {
      showToast('Switched to Reminders & Notifications');
    } else if (targetId === 'analytics' || targetId === 'health-analytics') {
      showToast('Switched to Health Analytics');
    } else if (targetId === 'family' || targetId === 'family-connect') {
      showToast('Switched to Family Connect');
    } else if (targetId === 'checkup' || targetId === 'health-checkup') {
      showToast('Switched to Health Check-Up');
    } else if (targetId === 'dashboard') {
      showToast('Switched to Dashboard Overview');
    } else if (targetId === 'lab-test') {
      showToast('Switched to Lab Test & Diagnostics');
    } else if (targetId === 'diet-plan') {
      showToast('Switched to Diet & Nutrient Plans');
    } else if (targetId === 'report-insights') {
      showToast('Switched to Report Insights & AI');
    } else if (targetId === 'nurse-booking') {
      showToast('Switched to In-Home Nurse Booking');
    } else if (targetId === 'janitor-booking') {
      showToast('Switched to Janitor Booking');
    } else if (targetId === 'security-privacy') {
      showToast('Switched to Security & Privacy');
    } else {
      showToast(`Selected ${targetId} module`);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 flex select-none">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0">
        <Sidebar 
          activeId={activeNavId} 
          onSelectNav={handleSelectNav} 
          user={user} 
          onLogout={onLogout} 
        />
      </div>

      {/* MOBILE OFF-CANVAS SIDEBAR */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
        activeId={activeNavId} 
        onSelectNav={handleSelectNav} 
        user={user} 
        onLogout={onLogout} 
      />

      {/* MAIN DASHBOARD WORKSPACE (ISOLATED FULL-APP SCROLL CONTAINER) */}
      <div 
        ref={mainScrollRef}
        className="flex-1 min-w-0 overflow-x-hidden h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800"
      >
        <div className="w-full max-w-[1600px] mx-auto pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* TOAST FEEDBACK NOTIFICATION */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#00a896] text-white font-bold text-xs shadow-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE SIDEBAR MENU TRIGGER */}
        <div className="lg:hidden mb-4 flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer border border-slate-200 dark:border-slate-700"
              aria-label="Open Sidebar Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">Healthcare Menu</span>
          </div>
          <button
            onClick={() => handleSelectNav('home')}
            className="px-2.5 py-1 text-[10px] font-black bg-teal-500/10 dark:bg-[#00a896]/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 font-sans hover:bg-[#00a896] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="Go to Home"
          >
            <Home className="w-3 h-3" />
            <span>Home</span>
          </button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : activeNavId === 'profile' ? (
          <ProfileView
            user={user}
            onNavigate={handleSelectNav}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />
        ) : activeNavId === 'records' ? (
          <RecordsView
            user={user}
            onNavigateScan={() => handleSelectNav('scan')}
          />
        ) : activeNavId === 'scan' ? (
          <ScanView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'appointments' || activeNavId === 'appointment') ? (
          <AppointmentsView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'medicines' || activeNavId === 'medicine') ? (
          <MedicinesView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'pharmacy' ? (
          <PharmacyView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'consultation' || activeNavId === 'video-consultation') ? (
          <ConsultationView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'reminders' || activeNavId === 'notifications') ? (
          <RemindersView
            user={user}
            onNavigate={handleSelectNav}
            initialViewMode={activeNavId === 'notifications' ? 'timeline' : 'list'}
          />
        ) : (activeNavId === 'analytics' || activeNavId === 'health-analytics') ? (
          <AnalyticsView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'family' || activeNavId === 'family-connect') ? (
          <FamilyConnectView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'checkup' || activeNavId === 'health-checkup') ? (
          <CheckupView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'hospitals' || activeNavId === 'nearby-hospitals') ? (
          <HospitalsView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'insurance' ? (
          <InsuranceView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'more-features' || activeNavId === 'features') ? (
          <MoreFeaturesView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'emergency' || activeNavId === 'sos') ? (
          <EmergencyView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'settings' ? (
          <SettingsView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : (activeNavId === 'ai-assistant' || activeNavId === 'assistant') ? (
          <AIAssistantView
            user={user}
            onNavigate={handleSelectNav}
          />
        ) : activeNavId === 'lab-test' ? (
          <LabTestView />
        ) : activeNavId === 'diet-plan' ? (
          <DietPlanView />
        ) : activeNavId === 'report-insights' ? (
          <ReportInsightsView />
        ) : activeNavId === 'nurse-booking' ? (
          <NurseBookingView />
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
              userName={user.name.split(' ')[0]}
              onOpenNotifications={() => handleSelectNav('notifications')}
              onOpenProfile={() => handleSelectNav('profile')}
              onNavigateHome={() => handleSelectNav('home')}
              onNavigate={handleSelectNav}
              onLogout={onLogout}
            />

            {/* 2. PRIMARY HEALTH SCORE & ABDM ACCESS HERO CARDS */}
            <DashboardStatsGrid onNavigate={handleSelectNav} />

            {/* 2.5 LIVE VERIFIED PRESCRIPTION & PHARMACY TRACKING CARD */}
            <RecentPrescriptionTrackCard
              onNavigate={handleSelectNav}
              onToast={showToast}
            />

            {/* 3. HEALTH OVERVIEW HERO GRID (HEALTH SCORE + HEALTH ACCESS) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthScoreCard />
              <HealthAccessCard
                abhaId={user.abhaId}
                userName={user.name}
                onToast={showToast}
              />
            </section>

            {/* 4. TODAY'S FOCUS & UPCOMING APPOINTMENT */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthSnapshotGrid />
              <HealthInsightCard onNavigate={handleSelectNav} />
            </section>

            {/* 6. MEDICATIONS & HEALTH PROGRESS CHART */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InsuranceSummaryCard onNavigate={handleSelectNav} />
              <FamilyConnectCard onNavigate={handleSelectNav} />
            </section>

            {/* 10. NEARBY HOSPITALS & EMERGENCY SOS */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NearbyHospitalsCard onNavigate={handleSelectNav} />
              <EmergencyQuickCard onOpenEmergency={onOpenEmergencyModal} />
            </section>

            {/* 11. RECENT RECORDS & ACTIVITY TIMELINE */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};

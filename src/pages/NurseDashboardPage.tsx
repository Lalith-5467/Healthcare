import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NurseSidebar } from '../components/nurse-portal/NurseSidebar';
import { NurseTopbar } from '../components/nurse-portal/NurseTopbar';
import { NurseHero } from '../components/nurse-portal/NurseHero';
import { NurseStatCards } from '../components/nurse-portal/NurseStatCards';
import { NursePriorityDispatch } from '../components/nurse-portal/NursePriorityDispatch';
import { NurseTodayShift } from '../components/nurse-portal/NurseTodayShift';
import { NurseNextVisit } from '../components/nurse-portal/NurseNextVisit';
import { NurseNeedsAttention } from '../components/nurse-portal/NurseNeedsAttention';
import { NurseTodayWorkload } from '../components/nurse-portal/NurseTodayWorkload';
import { NursePatientAlerts } from '../components/nurse-portal/NursePatientAlerts';
import { NurseUpcomingVisits } from '../components/nurse-portal/NurseUpcomingVisits';
import { NurseRecentActivity } from '../components/nurse-portal/NurseRecentActivity';
import { NurseFloatingActions } from '../components/nurse-portal/NurseFloatingActions';
import { CareRequestsView } from '../components/nurse-dashboard/views/CareRequestsView';
import { PatientCareView } from '../components/nurse-dashboard/views/PatientCareView';
import { NurseScheduleView } from '../components/nurse-dashboard/views/NurseScheduleView';
import { NurseInventoryView } from '../components/nurse-dashboard/views/NurseInventoryView';
import { NurseHistoryView } from '../components/nurse-dashboard/views/NurseHistoryView';
import { NurseAlertsView } from '../components/nurse-dashboard/views/NurseAlertsView';
import { NurseProfileView } from '../components/nurse-dashboard/views/NurseProfileView';
import { NurseSettingsView } from '../components/nurse-dashboard/views/NurseSettingsView';

interface NurseDashboardPageProps {
  user?: { name: string; email: string };
  onLogout: () => void;
}

export const NurseDashboardPage: React.FC<NurseDashboardPageProps> = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#f6f7f9] dark:bg-[#12141a] text-slate-900 dark:text-white font-sans flex overflow-hidden selection:bg-[#0d9488] selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <NurseSidebar activeNav={activeNav} onNavigate={setActiveNav} user={user} />
      </div>

      {/* MOBILE SIDEBAR (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <NurseSidebar 
                activeNav={activeNav} 
                onNavigate={(id) => { setActiveNav(id); setIsMobileMenuOpen(false); }} 
                user={user}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <NurseTopbar 
          onLogout={onLogout} 
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)} 
        />

        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1000px] mx-auto space-y-8 pb-10">
            
            {activeNav === 'dashboard' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-10"
              >
                <NurseHero onNavigate={setActiveNav} />
                <NurseTodayShift />
                <NurseStatCards onNavigate={setActiveNav} />
                <NursePriorityDispatch />
                <NurseNextVisit onNavigate={setActiveNav} />
                <NurseNeedsAttention />
                <NurseUpcomingVisits />
                <NurseTodayWorkload />
                <NursePatientAlerts />
                <NurseRecentActivity onNavigate={setActiveNav} />
              </motion.div>
            )}

            {activeNav === 'requests' && <CareRequestsView />}
            {activeNav === 'patients' && <PatientCareView />}
            {activeNav === 'schedule' && <NurseScheduleView />}
            {activeNav === 'inventory' && <NurseInventoryView />}
            {activeNav === 'history' && <NurseHistoryView />}
            {activeNav === 'alerts' && <NurseAlertsView />}
            {activeNav === 'profile' && <NurseProfileView />}
            {activeNav === 'settings' && <NurseSettingsView />}

            {!['dashboard', 'requests', 'patients', 'schedule', 'inventory', 'history', 'alerts', 'profile', 'settings'].includes(activeNav) && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-[#eceef1] dark:border-slate-800 rounded-2xl">
                <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-[#0d9488] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 capitalize">{activeNav.replace('-', ' ')}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  This module is currently under active development. Check back later for updates to the {activeNav.replace('-', ' ')} features.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <NurseFloatingActions />

    </div>
  );
};

export default NurseDashboardPage;

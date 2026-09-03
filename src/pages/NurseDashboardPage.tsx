import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { LogOut, HeartPulse, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { NurseSidebar } from '../components/nurse-dashboard/NurseSidebar';
import { useNurseWorkflow } from '../utils/nurseWorkflowStorage';

// Views
import { NurseOverviewView } from '../components/nurse-dashboard/views/NurseOverviewView';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, markNotificationRead } = useNurseWorkflow();
  
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const nurseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse Sarah Jenkins';

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <NurseOverviewView onNavigate={setActiveNav} user={user} />;
      case 'requests':
        return <CareRequestsView />;
      case 'tracking':
      case 'patients':
      case 'vitals':
      case 'medication':
        return <PatientCareView />;
      case 'schedule':
        return <NurseScheduleView onNavigate={setActiveNav} />;
      case 'inventory':
        return <NurseInventoryView />;
      case 'history':
        return <NurseHistoryView />;
      case 'alerts':
        return <NurseAlertsView />;
      case 'profile':
        return <NurseProfileView />;
      case 'settings':
        return <NurseSettingsView />;
      default:
<<<<<<< HEAD
        return <NurseOverviewView onNavigate={setActiveNav} user={user} />;
=======
        return (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <p className="font-bold">Module "{activeNav}" is under construction.</p>
          </div>
        );
>>>>>>> origin/main
    }
  };

  return (
<<<<<<< HEAD
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
=======
    <div className="h-screen bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
>>>>>>> origin/main
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5" /> Nurse Portal
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
<<<<<<< HEAD
          <button 
            onClick={() => setActiveNav('alerts')}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Emergency Alerts"
          >
=======
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
>>>>>>> origin/main
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
            )}
          </button>
          
          <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* Nurse Profile */}
          <div className="hidden sm:flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">Nurse Sarah</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">Senior RN</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* Quick Profile pill */}
          <button
            onClick={() => setActiveNav('profile')}
            className="hidden md:flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs">
              {nurseName.replace('Nurse ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{nurseName}</span>
          </button>

          <button 
            onClick={onLogout}
<<<<<<< HEAD
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
=======
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2"
>>>>>>> origin/main
          >
            <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
<<<<<<< HEAD
        <div className="hidden lg:block shrink-0">
          <NurseSidebar activeNav={activeNav} onNavigate={setActiveNav} user={user} />
=======
        <div className="hidden lg:block h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120]">
          <NurseSidebar activeNav={activeNav} onNavigate={setActiveNav} />
>>>>>>> origin/main
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
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-black text-rose-600">NURSE CONSOLE</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <NurseSidebar 
                  activeNav={activeNav} 
                  onNavigate={(id) => { setActiveNav(id); setIsSidebarOpen(false); }} 
                  user={user}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070c18] p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

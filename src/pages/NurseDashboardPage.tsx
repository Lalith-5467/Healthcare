import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, 
  Menu, 
  X, 
  Bell, 
  LogOut, 
  ChevronDown,
  ShieldCheck 
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { NurseSidebar } from '../components/nurse-dashboard/NurseSidebar';
import { NurseOverviewView } from '../components/nurse-dashboard/views/NurseOverviewView';
import { CareRequestsView } from '../components/nurse-dashboard/views/CareRequestsView';
import { PatientCareView } from '../components/nurse-dashboard/views/PatientCareView';
import { NurseScheduleView } from '../components/nurse-dashboard/views/NurseScheduleView';
import { NurseInventoryView } from '../components/nurse-dashboard/views/NurseInventoryView';
import { NurseHistoryView } from '../components/nurse-dashboard/views/NurseHistoryView';
import { NurseAlertsView } from '../components/nurse-dashboard/views/NurseAlertsView';
import { NurseProfileView } from '../components/nurse-dashboard/views/NurseProfileView';
import { NurseSettingsView } from '../components/nurse-dashboard/views/NurseSettingsView';
import { useNurseWorkflow } from '../utils/nurseWorkflowStorage';

interface NurseDashboardPageProps {
  onLogout: () => void;
  user?: { name: string; email: string };
}

export const NurseDashboardPage: React.FC<NurseDashboardPageProps> = ({ onLogout, user }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications } = useNurseWorkflow();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const nurseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse Sarah Jenkins, RN';

  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <NurseOverviewView onNavigate={setActiveNav} user={user} />;
      case 'requests':
        return <CareRequestsView />;
      case 'patients':
      case 'vitals':
        return <PatientCareView onNavigate={setActiveNav} />;
      case 'schedule':
        return <NurseScheduleView />;
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
        return <NurseOverviewView onNavigate={setActiveNav} user={user} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-md flex items-center gap-1 border border-rose-500/20">
                <HeartPulse className="w-3.5 h-3.5" /> Nurse Portal
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> ABDM Nurse Station
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* SEARCH BAR */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-44 xl:w-56 transition-colors focus-within:border-rose-500 dark:focus-within:border-rose-500">
            <HeartPulse className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search patients, vitals..." 
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white w-full focus:outline-none placeholder:text-slate-400"
              onClick={() => setActiveNav('patients')}
            />
          </div>

          {/* THEME TOGGLE */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <button 
            type="button"
            onClick={() => setActiveNav('alerts')}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
            title="Emergency Alerts"
          >
            <Bell className="w-5 h-5 text-rose-500" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
            )}
          </button>

          {/* Quick Rounds / Patient Care Shortcut */}
          <button
            type="button"
            onClick={() => setActiveNav('patients')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer border border-rose-200 dark:border-rose-800/60 shadow-2xs"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Active Rounds</span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* Quick Profile pill */}
          <button
            type="button"
            onClick={() => setActiveNav('profile')}
            className="hidden md:flex items-center gap-2 py-1 px-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/30 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs">
              {nurseName.replace('Nurse ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{nurseName}</span>
          </button>

          <button 
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 text-slate-500 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block shrink-0">
          <NurseSidebar activeNav={activeNav} onNavigate={setActiveNav} user={user} />
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
                  <span className="font-black text-slate-900 dark:text-white">Nurse Console</span>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <NurseSidebar 
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
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

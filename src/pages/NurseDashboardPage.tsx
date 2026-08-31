import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { LogOut, HeartPulse, Menu, X, Bell } from 'lucide-react';
import { NurseSidebar } from '../components/nurse-dashboard/NurseSidebar';
import { useNurseWorkflow } from '../utils/nurseWorkflowStorage';

// Views
import { NurseOverviewView } from '../components/nurse-dashboard/views/NurseOverviewView';
import { CareRequestsView } from '../components/nurse-dashboard/views/CareRequestsView';
import { PatientCareView } from '../components/nurse-dashboard/views/PatientCareView';

interface NurseDashboardPageProps {
  user?: { name: string; email: string };
  onLogout: () => void;
}

export const NurseDashboardPage: React.FC<NurseDashboardPageProps> = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, markNotificationRead } = useNurseWorkflow();
  
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <NurseOverviewView onNavigate={setActiveNav} />;
      case 'requests':
        return <CareRequestsView />;
      case 'tracking':
      case 'patients':
      case 'vitals':
      case 'medication':
        return <PatientCareView />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="font-bold">Module "{activeNav}" is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <HeartPulse className="w-3 h-3" /> Nurse Portal
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120]"></span>
            )}
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block">
          <NurseSidebar activeNav={activeNav} onNavigate={setActiveNav} />
        </div>

        {/* MOBILE SIDEBAR MODAL */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-black text-rose-600">MENU</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
              </div>
              <NurseSidebar 
                activeNav={activeNav} 
                onNavigate={(id) => { setActiveNav(id); setIsSidebarOpen(false); }} 
              />
            </motion.div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070c18] p-4 sm:p-6 lg:p-8">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto h-full"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

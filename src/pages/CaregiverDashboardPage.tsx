import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import {
  LogOut, 
  HeartHandshake, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  AlertOctagon, 
  ChevronDown,
  CheckCircle2,
  Search
} from 'lucide-react';
import { CaregiverSidebar } from '../components/caregiver-dashboard/CaregiverSidebar';
import { useCaregiverWorkflow } from '../utils/caregiverWorkflowStorage';

// Views
import { CaregiverOverviewView } from '../components/caregiver-dashboard/views/CaregiverOverviewView';
import { CaregiverWardsView } from '../components/caregiver-dashboard/views/CaregiverWardsView';
import { CaregiverAbhaRecordsView } from '../components/caregiver-dashboard/views/CaregiverAbhaRecordsView';
import { CaregiverMedicationsView } from '../components/caregiver-dashboard/views/CaregiverMedicationsView';
import { CaregiverVitalsView } from '../components/caregiver-dashboard/views/CaregiverVitalsView';
import { CaregiverAppointmentsView } from '../components/caregiver-dashboard/views/CaregiverAppointmentsView';
import { CaregiverEmergencyView } from '../components/caregiver-dashboard/views/CaregiverEmergencyView';
import { CaregiverDailyTasksView } from '../components/caregiver-dashboard/views/CaregiverDailyTasksView';
import { CaregiverCareCircleConsentView } from '../components/caregiver-dashboard/views/CaregiverCareCircleConsentView';
import { CaregiverProfileView } from '../components/caregiver-dashboard/views/CaregiverProfileView';
import { CaregiverPreferencesAlertsView } from '../components/caregiver-dashboard/views/CaregiverPreferencesAlertsView';

interface CaregiverDashboardPageProps {
  user?: { 
    name: string; 
    email: string; 
    role?: string;
    phone?: string;
  };
  initialNavId?: string;
  onLogout: () => void;
  onNavigate?: (id: string) => void;
}

export const CaregiverDashboardPage: React.FC<CaregiverDashboardPageProps> = ({
  user,
  initialNavId = 'dashboard',
  onLogout,
  onNavigate
}) => {
  const [activeNav, setActiveNav] = useState(initialNavId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isGlobalSOSOpen, setIsGlobalSOSOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');

  const { wards, activeWard, setActiveWardId, notifications, markNotifRead, alerts, triggerSOS } = useCaregiverWorkflow();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const activeAlerts = alerts.filter(a => a.status === 'Active').length;

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <CaregiverOverviewView onNavigate={setActiveNav} />;
      case 'wards':
        return <CaregiverWardsView />;
      case 'records':
        return <CaregiverAbhaRecordsView />;
      case 'medications':
        return <CaregiverMedicationsView />;
      case 'vitals':
        return <CaregiverVitalsView />;
      case 'appointments':
        return <CaregiverAppointmentsView />;
      case 'emergency':
        return <CaregiverEmergencyView />;
      case 'routines':
        return <CaregiverDailyTasksView />;
      case 'care-circle':
        return <CaregiverCareCircleConsentView />;
      case 'profile':
        return <CaregiverProfileView user={user} />;
      case 'settings':
        return <CaregiverPreferencesAlertsView />;
      default:
        return <CaregiverOverviewView onNavigate={setActiveNav} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
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
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-cyan-300 bg-teal-500/10 dark:bg-cyan-900/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-teal-500/20">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" /> Caregiver Portal
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> ABDM Guardian Proxy
            </div>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* SEARCH BAR */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-48 xl:w-64 transition-colors focus-within:border-teal-500 dark:focus-within:border-teal-500">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white w-full focus:outline-none placeholder:text-slate-400"
            />
          </div>
          
          {/* LANGUAGE TOGGLE */}
          <div className="hidden lg:flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'EN' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('TA')}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'TA' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              தமிழ்
            </button>
          </div>
          
          <ThemeToggle />
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* DEPENDENT SWITCHER DROPDOWN */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <span className="text-slate-400 text-[10px] uppercase">Ward:</span>
            <select
              value={activeWard.id}
              onChange={(e) => setActiveWardId(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-extrabold focus:outline-none cursor-pointer"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {w.name} ({w.relationship})
                </option>
              ))}
            </select>
          </div>

          {/* SOS SHORTCUT BUTTON */}
          <button
            onClick={() => setIsGlobalSOSOpen(true)}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAlerts > 0 
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30' 
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
            }`}
            title="Emergency SOS Center"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden md:inline font-black">SOS</span>
          </button>

          {/* NOTIFICATION BELL WITH DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120]"></span>
              )}
            </button>

            <AnimatePresence>
              {isNotifDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0b1120] rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Caregiver Alerts ({unreadNotifs} unread)
                    </span>
                    <button 
                      onClick={() => setIsNotifDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotifRead(n.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs ${
                          n.read 
                            ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/60 opacity-60'
                            : 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-black text-slate-900 dark:text-white leading-tight">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* LOGOUT BUTTON */}
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            title="Logout from Caregiver Portal"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT WITH SIDEBAR */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block">
          <CaregiverSidebar 
            activeNav={activeNav} 
            onNavigate={setActiveNav}
            user={user as any}
          />
        </div>

        {/* MOBILE SIDEBAR MODAL */}
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-black text-xs text-teal-600 dark:text-cyan-400 uppercase tracking-wider">
                    Caregiver Menu
                  </span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CaregiverSidebar 
                    activeNav={activeNav} 
                    onNavigate={(id) => { setActiveNav(id); setIsSidebarOpen(false); }}
                    user={user as any}
                  />
                </div>
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
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* GLOBAL TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-rose-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL SOS CONFIRM MODAL */}
      <AnimatePresence>
        {isGlobalSOSOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsGlobalSOSOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-rose-500/40 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                <AlertOctagon className="w-9 h-9 animate-bounce" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Confirm Emergency SOS Dispatch
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose the nature of the emergency for {activeWard.name}:
                </p>
              </div>

              <div className="space-y-2">
                {(['SOS Panic Button', 'Fall Detected', 'Abnormal Vitals', 'Geofence Breach'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      triggerSOS(activeWard.id, type as any);
                      setIsGlobalSOSOpen(false);
                      setToastMsg(`🚨 Urgent Emergency SOS dispatched for ${activeWard.name}!`);
                      setTimeout(() => setToastMsg(null), 3000);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-600 hover:text-white text-rose-700 dark:text-rose-300 font-black text-xs border border-rose-200 dark:border-rose-800/60 transition-all text-left flex items-center justify-between"
                  >
                    <span>{type}</span>
                    <AlertOctagon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsGlobalSOSOpen(false)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

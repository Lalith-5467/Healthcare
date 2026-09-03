import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { LogOut, ShieldCheck, Menu, X, Bell } from 'lucide-react';
import { InsuranceSidebar } from '../components/insurance-dashboard/InsuranceSidebar';

// Views
import { InsuranceOverviewView } from '../components/insurance-dashboard/views/InsuranceOverviewView';
import { SearchInsuranceView } from '../components/insurance-dashboard/views/SearchInsuranceView';
import { InsuranceProfileView } from '../components/insurance-dashboard/views/InsuranceProfileView';
import { NetworkHospitalsView } from '../components/insurance-dashboard/views/NetworkHospitalsView';
import { SettlementsView } from '../components/insurance-dashboard/views/SettlementsView';
import { PoliciesDirectoryView } from '../components/insurance-dashboard/views/PoliciesDirectoryView';
import { InsuranceSettingsView } from '../components/insurance-dashboard/views/InsuranceSettingsView';

interface InsuranceDashboardPageProps {
  user?: { name: string; email: string };
  onLogout: () => void;
}

export const InsuranceDashboardPage: React.FC<InsuranceDashboardPageProps> = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchedId, setSearchedId] = useState<string | null>('INS-MC-2026-10245');

  const officerName = user?.name || 'Insurance Officer';

  const handleSearchSuccess = (insuranceId: string) => {
    setSearchedId(insuranceId);
    setActiveNav('profile');
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <InsuranceOverviewView onNavigate={setActiveNav} onSelectClaim={handleSearchSuccess} />;
      case 'search':
        return <SearchInsuranceView onSearchSuccess={handleSearchSuccess} />;
      case 'claims':
      case 'preauth':
      case 'profile':
      case 'coverage':
      case 'documents':
        return <InsuranceProfileView insuranceId={searchedId || 'INS-MC-2026-10245'} onNavigate={setActiveNav} />;
      case 'policies':
      case 'policy-holders':
        return <PoliciesDirectoryView onSelectPolicy={handleSearchSuccess} />;
      case 'hospitals':
      case 'hospitalizations':
        return <NetworkHospitalsView />;
      case 'settlements':
      case 'payments':
        return <SettlementsView />;
      case 'settings':
        return <InsuranceSettingsView />;
      default:
<<<<<<< HEAD
        return <InsuranceOverviewView onNavigate={setActiveNav} onSelectClaim={handleSearchSuccess} />;
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
=======
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col">
>>>>>>> origin/main
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
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
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Insurance Portal
              </span>
            </div>
            
<<<<<<< HEAD
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> ABDM Claims Gateway
=======
            <div className="hidden md:flex items-center gap-1 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3 h-3" /> Secure Data Access
>>>>>>> origin/main
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => setActiveNav('search')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-blue-200 dark:border-blue-800/60"
          >
            <span>Search Policy</span>
          </button>

          {/* User Display Pill */}
          <div className="hidden md:flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-600 dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono">
              {officerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{officerName}</span>
          </div>

          {/* Notifications */}
<<<<<<< HEAD
          <button 
            onClick={() => setActiveNav('claims')}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Notifications"
          >
=======
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
>>>>>>> origin/main
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button 
            onClick={onLogout}
<<<<<<< HEAD
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
=======
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2"
>>>>>>> origin/main
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block shrink-0">
          <InsuranceSidebar activeNav={activeNav} onNavigate={setActiveNav} user={user} />
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
                  <span className="font-black text-blue-600">INSURANCE DESK</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <InsuranceSidebar 
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
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

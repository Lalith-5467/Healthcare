import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { LogOut, ShieldCheck, Menu, X, Bell } from 'lucide-react';
import { InsuranceSidebar } from '../components/insurance-dashboard/InsuranceSidebar';

// Views
import { InsuranceOverviewView } from '../components/insurance-dashboard/views/InsuranceOverviewView';
import { SearchInsuranceView } from '../components/insurance-dashboard/views/SearchInsuranceView';
import { InsuranceProfileView } from '../components/insurance-dashboard/views/InsuranceProfileView';

interface InsuranceDashboardPageProps {
  user?: { name: string; email: string };
  onLogout: () => void;
}

export const InsuranceDashboardPage: React.FC<InsuranceDashboardPageProps> = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchedId, setSearchedId] = useState<string | null>(null);

  const handleSearchSuccess = (insuranceId: string) => {
    setSearchedId(insuranceId);
    setActiveNav('profile');
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <InsuranceOverviewView onNavigate={setActiveNav} />;
      case 'search':
        return <SearchInsuranceView onSearchSuccess={handleSearchSuccess} />;
      case 'profile':
        return <InsuranceProfileView insuranceId={searchedId} onNavigate={setActiveNav} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <p className="font-bold">Module "{activeNav}" is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col">
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
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Insurance Portal
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3 h-3" /> Secure Data Access
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#0b1120]"></span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2"
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
          <InsuranceSidebar activeNav={activeNav} onNavigate={setActiveNav} />
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
                  <span className="font-black text-blue-600">MENU</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
                </div>
                <InsuranceSidebar 
                  activeNav={activeNav} 
                  onNavigate={(id) => { setActiveNav(id); setIsSidebarOpen(false); }} 
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

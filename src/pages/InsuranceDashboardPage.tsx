import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Bell, 
  LogOut, 
  ExternalLink,
  Search 
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { InsuranceSidebar } from '../components/insurance-dashboard/InsuranceSidebar';
import { InsuranceOverviewView } from '../components/insurance-dashboard/views/InsuranceOverviewView';
import { SearchInsuranceView } from '../components/insurance-dashboard/views/SearchInsuranceView';
import { InsuranceProfileView } from '../components/insurance-dashboard/views/InsuranceProfileView';
import { PoliciesDirectoryView } from '../components/insurance-dashboard/views/PoliciesDirectoryView';
import { NetworkHospitalsView } from '../components/insurance-dashboard/views/NetworkHospitalsView';
import { SettlementsView } from '../components/insurance-dashboard/views/SettlementsView';
import { InsuranceSettingsView } from '../components/insurance-dashboard/views/InsuranceSettingsView';
import { CashlessPreAuthView } from '../components/insurance-dashboard/views/CashlessPreAuthView';

interface InsuranceDashboardPageProps {
  onLogout: () => void;
  user?: { name: string; email: string };
}

export const InsuranceDashboardPage: React.FC<InsuranceDashboardPageProps> = ({ onLogout, user }) => {
  const [activeNav, setActiveNav] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string | null>('INS-MC-2026-10245');
  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');

  const officerName = user?.name || 'Vikas Verma, TPA Head';

  const handleSearchSuccess = (insuranceId: string) => {
    setSelectedInsuranceId(insuranceId);
    setActiveNav('profile');
  };

  const renderActiveView = () => {
    switch (activeNav) {
      case 'overview':
        return <InsuranceOverviewView onNavigate={setActiveNav} onSelectClaim={handleSearchSuccess} />;
      case 'search':
        return <SearchInsuranceView onSearchSuccess={handleSearchSuccess} />;
      case 'claims':
      case 'profile':
      case 'claim-details':
      case 'coverage':
      case 'documents':
        return <InsuranceProfileView insuranceId={selectedInsuranceId} onNavigate={setActiveNav} />;
      case 'preauth':
        return <CashlessPreAuthView />;
      case 'policies':
      case 'policy-holders':
      case 'approvals':
        return <PoliciesDirectoryView />;
      case 'hospitals':
      case 'network':
        return <NetworkHospitalsView />;
      case 'settlements':
      case 'payments':
        return <SettlementsView />;
      case 'settings':
        return <InsuranceSettingsView />;
      default:
        return <InsuranceOverviewView onNavigate={setActiveNav} onSelectClaim={handleSearchSuccess} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
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
            
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> ABDM Claims Gateway
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {/* SEARCH BAR */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-48 xl:w-64 transition-colors focus-within:border-blue-500 dark:focus-within:border-cyan-500">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search policies, claims..." 
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white w-full focus:outline-none placeholder:text-slate-400"
              onClick={() => setActiveNav('search')}
            />
          </div>

          {/* LANGUAGE TOGGLE */}
          <div className="hidden lg:flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'EN' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('TA')}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'TA' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              தமிழ்
            </button>
          </div>
          
          <ThemeToggle />
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* Quick Search Shortcut */}
          <button
            onClick={() => setActiveNav('search')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-blue-200 dark:border-blue-800/60"
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
          <button 
            onClick={() => setActiveNav('claims')}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
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
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl flex flex-col z-10"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white">Insurance Desk</span>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <InsuranceSidebar 
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

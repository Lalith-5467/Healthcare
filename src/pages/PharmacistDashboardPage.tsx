import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, Bell, ShieldCheck, ChevronDown, LogOut } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { PharmacistSidebar } from '../components/pharmacist/PharmacistSidebar';
import { PharmacistOverviewTab } from '../components/pharmacist/PharmacistOverviewTab';
import { PharmacistOrdersView } from '../components/pharmacist/PharmacistOrdersView';
import { PharmacistMedicinesTab } from '../components/pharmacist/PharmacistMedicinesTab';
import { PharmacistPatientsTab } from '../components/pharmacist/PharmacistPatientsTab';

interface PharmacistDashboardPageProps {
  user?: {
    name: string;
    email: string;
    role: string;
    abhaId?: string;
  };
  initialNavId?: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const PharmacistDashboardPage: React.FC<PharmacistDashboardPageProps> = ({
  user = {
    name: 'Registered Pharmacist',
    email: 'pharmacist@apollocentral.in',
    role: 'Pharmacist'
  },
  initialNavId = 'dashboard',
  onLogout,
  onNavigate: _onNavigate,
}) => {
  const [activeNavId, setActiveNavId] = useState<string>(initialNavId);
  const [orderFilterSubtab, setOrderFilterSubtab] = useState<string>('All');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialNavId) {
      setActiveNavId(initialNavId);
    }
  }, [initialNavId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectNav = (id: string, filterSubtab?: string) => {
    setActiveNavId(id);
    if (filterSubtab) {
      setOrderFilterSubtab(filterSubtab);
    }
    localStorage.setItem('pharmacist_active_nav_id', id);

    const targetUrl = `/pharmacist/${id}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col select-none font-sans">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-[#00a896] dark:text-cyan-400 bg-teal-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Pharmacy Operations
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-[#0b1120]"></span>
          </button>
          
          <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <div className="hidden sm:flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{user.name}</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">Registered Pharmacist</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0">
        <PharmacistSidebar
          activeId={activeNavId}
          onSelectNav={handleSelectNav}
          user={user}
          onLogout={onLogout}
        />
      </div>

      {/* MAIN PHARMACIST WORKSPACE */}
      <div className="flex-1 min-w-0 overflow-x-hidden h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="w-full max-w-[1600px] mx-auto pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8">
          {/* TOAST FEEDBACK */}
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

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden mb-4 flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">Pharmacist Portal</span>
          </div>
        </div>

        {/* TOP PHARMACIST WORKSPACE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
              Pharmacy Operations / Apollo Central
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {activeNavId === 'dashboard'
                ? 'Pharmacist Dashboard Overview'
                : activeNavId === 'orders' || activeNavId === 'prescriptions'
                ? 'Prescription Orders Queue'
                : activeNavId === 'medicines'
                ? 'Dispensary Stock & Medicines'
                : activeNavId === 'patients'
                ? 'Patient Prescription Directory'
                : 'Pharmacist Workspace'}
            </h1>
          </div>
        </div>

        {/* ACTIVE SUB-VIEW */}
        {activeNavId === 'dashboard' ? (
          <PharmacistOverviewTab
            user={user}
            onNavigateOrders={(tab) => handleSelectNav('orders', tab)}
            onNavigateMedicines={() => handleSelectNav('medicines')}
            onToast={showToast}
          />
        ) : activeNavId === 'orders' || activeNavId === 'prescriptions' ? (
          <PharmacistOrdersView
            user={user}
            initialFilter={orderFilterSubtab}
            onToast={showToast}
          />
        ) : activeNavId === 'medicines' ? (
          <PharmacistMedicinesTab />
        ) : activeNavId === 'patients' ? (
          <PharmacistPatientsTab />
        ) : (
          <PharmacistOverviewTab
            user={user}
            onNavigateOrders={(tab) => handleSelectNav('orders', tab)}
            onNavigateMedicines={() => handleSelectNav('medicines')}
            onToast={showToast}
          />
        )}
        </div>
      </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, Bell, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 flex select-none font-sans">
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
      <div className="flex-1 min-w-0 overflow-x-hidden pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
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
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/15 text-[#00a896] dark:text-cyan-300 font-mono border border-teal-500/20">
                Dispensary Operations
              </span>
              <span className="text-xs text-slate-400 font-mono">• Apollo Central</span>
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
  );
};

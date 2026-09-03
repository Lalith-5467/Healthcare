import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, Bell, ShieldCheck, LogOut, Pill, Building2 } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { PharmacistSidebar } from '../components/pharmacist/PharmacistSidebar';
import { PharmacistOverviewTab } from '../components/pharmacist/PharmacistOverviewTab';
import { PharmacistOrdersView } from '../components/pharmacist/PharmacistOrdersView';
import { PharmacistMedicinesTab } from '../components/pharmacist/PharmacistMedicinesTab';
import { PharmacistPatientsTab } from '../components/pharmacist/PharmacistPatientsTab';
import { DrugInteractionView } from '../components/pharmacist/DrugInteractionView';
import { SupplierOrdersView } from '../components/pharmacist/SupplierOrdersView';
import { ScheduleAuditView } from '../components/pharmacist/ScheduleAuditView';
import { PharmacyBillingView } from '../components/pharmacist/PharmacyBillingView';
import { PharmacySettingsView } from '../components/pharmacist/PharmacySettingsView';

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
    name: 'Suresh Nair',
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
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      
      {/* 1. FIXED APP-SHELL HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-cyan-300 bg-teal-500/10 dark:bg-cyan-900/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-teal-500/20">
                <Pill className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" /> Pharmacist Portal
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-[#00a896]" /> Apollo Central Dispensary
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Quick Orders Notification */}
          <button 
            onClick={() => handleSelectNav('orders')}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Pharmacy Orders"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* User pill */}
          <div className="hidden md:flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono">
              {(user.name || 'Pharmacist').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. BODY LAYOUT WITH FIXED SIDEBAR AND SCROLLABLE CONTENT */}
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

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl"
              >
                <PharmacistSidebar
                  activeId={activeNavId}
                  onSelectNav={(id, filter) => {
                    handleSelectNav(id, filter);
                    setMobileSidebarOpen(false);
                  }}
                  user={user}
                  onLogout={onLogout}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN PHARMACIST WORKSPACE SCROLL CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070c18] p-4 sm:p-6 lg:p-8">
          
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

          {/* TOP PHARMACIST WORKSPACE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/15 text-[#00a896] dark:text-cyan-300 font-mono border border-teal-500/20">
                  Dispensary Operations
                </span>
                <span className="text-xs text-slate-400 font-mono">• Apollo Central Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {activeNavId === 'dashboard'
                  ? 'Pharmacist Command Center'
                  : activeNavId === 'orders' || activeNavId === 'prescriptions'
                  ? 'Prescription Orders Queue'
                  : activeNavId === 'medicines'
                  ? 'Dispensary Stock & Inventory'
                  : activeNavId === 'patients'
                  ? 'Patient Prescription Directory'
                  : activeNavId === 'drug-interaction'
                  ? 'Drug Safety & Interaction Radar'
                  : activeNavId === 'supplier-orders'
                  ? 'Wholesaler POs & Restock'
                  : activeNavId === 'schedule-audit'
                  ? 'Schedule Drug Compliance Register'
                  : activeNavId === 'billing'
                  ? 'Pharmacy Billing & GST Invoices'
                  : activeNavId === 'settings'
                  ? 'Pharmacy Profile & Statutory Licenses'
                  : 'Pharmacist Workspace'}
              </h1>
            </div>
          </div>

          {/* ACTIVE SUB-VIEW */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNavId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
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
              ) : activeNavId === 'drug-interaction' ? (
                <DrugInteractionView />
              ) : activeNavId === 'supplier-orders' ? (
                <SupplierOrdersView />
              ) : activeNavId === 'schedule-audit' ? (
                <ScheduleAuditView />
              ) : activeNavId === 'billing' ? (
                <PharmacyBillingView />
              ) : activeNavId === 'settings' ? (
                <PharmacySettingsView user={user} />
              ) : (
                <PharmacistOverviewTab
                  user={user}
                  onNavigateOrders={(tab) => handleSelectNav('orders', tab)}
                  onNavigateMedicines={() => handleSelectNav('medicines')}
                  onToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};


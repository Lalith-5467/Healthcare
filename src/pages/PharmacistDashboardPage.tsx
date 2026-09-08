import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, Bell, ShieldCheck, LogOut, Pill, Building2, Search, X, ChevronRight, FileText, User, Sparkles } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
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
import { PharmacistNotificationPopover } from '../components/pharmacist/PharmacistNotificationPopover';
import { showGlobalToast } from '../components/common/GlobalToastManager';
import { getPharmacyOrders } from '../utils/healthWorkflowStorage';
import { INITIAL_MEDICINE_STOCK } from '../components/pharmacy/pharmacyData';

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
  user,
  initialNavId = 'dashboard',
  onLogout,
  onNavigate: _onNavigate,
}) => {
  const [activeNavId, setActiveNavId] = useState<string>(initialNavId);
  const [orderFilterSubtab, setOrderFilterSubtab] = useState<string>('All');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Resolve logged-in username dynamically from user prop or localStorage
  const effectiveUser = React.useMemo(() => {
    let candidateName = user?.name;
    if (!candidateName || candidateName === 'Suresh Nair') {
      try {
        const storedName = localStorage.getItem('pharmacist_user_name');
        if (storedName) {
          candidateName = storedName;
        } else {
          const savedUser = localStorage.getItem('app_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed?.name && parsed.name !== 'Suresh Nair') {
              candidateName = parsed.name;
            }
          }
        }
      } catch {}
    }

    return {
      name: candidateName || user?.name || 'Registered Pharmacist',
      email: user?.email || 'pharmacist@apollocentral.in',
      role: user?.role || 'Pharmacist',
      abhaId: user?.abhaId
    };
  }, [user]);

  useEffect(() => {
    if (initialNavId) {
      setActiveNavId(initialNavId);
    }
  }, [initialNavId]);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage(msg);
    showGlobalToast(msg, type);
    setTimeout(() => setToastMessage(null), 3500);
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

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Real-time live query results from storage and catalogs
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { orders: [], medicines: [], interactions: [], patients: [], totalCount: 0 };
    const q = searchQuery.toLowerCase().trim();

    // 1. Matched Orders
    const allOrders = getPharmacyOrders();
    const matchedOrders = allOrders.filter((o) => {
      const pName = (o.patientName || (o as any).patient?.fullName || '').toLowerCase();
      const id = (o.id || '').toLowerCase();
      const items = (o.items || []).map((i: any) => (i.name || i.medicineName || '').toLowerCase()).join(' ');
      return pName.includes(q) || id.includes(q) || items.includes(q);
    }).slice(0, 3);

    // 2. Matched Medicines
    const matchedMedicines = INITIAL_MEDICINE_STOCK.filter((m) => {
      return m.medicineName.toLowerCase().includes(q) || m.dosage.toLowerCase().includes(q);
    }).slice(0, 3);

    // 3. Matched Interactions
    const knownInteractions = [
      { name: 'Warfarin + Aspirin', hazard: 'Major Hemorrhage Hazard' },
      { name: 'Metformin + Radiocontrast', hazard: 'Lactic Acidosis Risk' },
      { name: 'Atorvastatin + Clarithromycin', hazard: 'Rhabdomyolysis Risk' },
      { name: 'Ciprofloxacin + Antacids', hazard: 'Absorption Chelation' },
      { name: 'Telmisartan + Spironolactone', hazard: 'Hyperkalemia Risk' }
    ].filter(i => i.name.toLowerCase().includes(q) || i.hazard.toLowerCase().includes(q)).slice(0, 2);

    // 4. Matched Patients
    const matchedPatients = [
      { name: 'Lalith Patel', abha: '91-8472-9104-5821', blood: 'O+' },
      { name: 'Ragul Kumar', abha: '91-4829-1094-3321', blood: 'B+' },
      { name: 'Akshara Sharma', abha: '91-3829-4401-9921', blood: 'A+' },
      { name: 'Anita Sharma', abha: 'CG-8421-9902@abdm', blood: 'AB+' }
    ].filter(p => p.name.toLowerCase().includes(q) || p.abha.toLowerCase().includes(q)).slice(0, 2);

    const total = matchedOrders.length + matchedMedicines.length + knownInteractions.length + matchedPatients.length;

    return {
      orders: matchedOrders,
      medicines: matchedMedicines,
      interactions: knownInteractions,
      patients: matchedPatients,
      totalCount: total
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchFocused(false);
    
    if (searchResults.orders.length > 0) {
      handleSelectNav('orders');
      showToast(`Showing Prescriptions matching "${searchQuery}"`);
    } else if (searchResults.medicines.length > 0) {
      handleSelectNav('medicines');
      showToast(`Showing Dispensary Stock matching "${searchQuery}"`);
    } else if (searchResults.interactions.length > 0) {
      handleSelectNav('drug-interaction');
      showToast(`Opened Drug Safety Radar for "${searchQuery}"`);
    } else if (searchResults.patients.length > 0) {
      handleSelectNav('patients');
      showToast(`Opened Patient records for "${searchQuery}"`);
    } else {
      handleSelectNav('orders');
      showToast(`Searched dispensary records for "${searchQuery}"`);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      
      {/* 1. FIXED APP-SHELL HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 gap-4">
        {/* LEFT BRANDING */}
        <div className="flex items-center gap-3 shrink-0">
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
            
            <div className="hidden 2xl:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-[#00a896]" /> Apollo Central Dispensary
            </div>
          </div>
        </div>

        {/* CENTER INTERACTIVE SEARCH BAR */}
        <div className="flex-1 max-w-xl mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Prescriptions, Medicines, Drug Interactions, Patients..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/20 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* AUTOCOMPLETE POPUP DROPDOWN */}
          <AnimatePresence>
            {searchFocused && searchQuery.trim().length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setSearchFocused(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden max-h-[420px] overflow-y-auto"
                >
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Search Suggestions</span>
                    <span className="text-[#00a896] font-mono">{searchResults.totalCount} results</span>
                  </div>

                  {searchResults.totalCount === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No matching records found for "{searchQuery}". Press Enter to view all orders.
                    </div>
                  ) : (
                    <div className="p-2 space-y-3">
                      {/* Prescriptions */}
                      {searchResults.orders.length > 0 && (
                        <div>
                          <div className="px-2 pb-1 text-[10px] font-extrabold uppercase text-[#00a896] flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Prescriptions ({searchResults.orders.length})
                          </div>
                          {searchResults.orders.map((o) => (
                            <div
                              key={o.id}
                              onClick={() => {
                                handleSelectNav('orders');
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                  {o.patientName || (o as any).patient?.fullName || 'Patient'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  ID: {o.id} • {o.items?.length || 1} Meds
                                </p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#00a896] border border-teal-500/20">
                                {o.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Stock Medicines */}
                      {searchResults.medicines.length > 0 && (
                        <div>
                          <div className="px-2 pb-1 text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Pill className="w-3 h-3" /> Medicines in Stock ({searchResults.medicines.length})
                          </div>
                          {searchResults.medicines.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => {
                                handleSelectNav('medicines');
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{m.medicineName}</p>
                                <p className="text-[10px] text-slate-400">{m.dosage} • {m.stockLevel}</p>
                              </div>
                              <span className="text-[10px] font-bold font-mono text-slate-500">
                                {m.currentQuantity} {m.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactions */}
                      {searchResults.interactions.length > 0 && (
                        <div>
                          <div className="px-2 pb-1 text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Drug Interactions ({searchResults.interactions.length})
                          </div>
                          {searchResults.interactions.map((i, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                handleSelectNav('drug-interaction');
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{i.name}</p>
                                <p className="text-[10px] text-rose-500">{i.hazard}</p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Patients */}
                      {searchResults.patients.length > 0 && (
                        <div>
                          <div className="px-2 pb-1 text-[10px] font-extrabold uppercase text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                            <User className="w-3 h-3" /> Patients ({searchResults.patients.length})
                          </div>
                          {searchResults.patients.map((p, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                handleSelectNav('patients');
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">ABHA: {p.abha}</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{p.blood}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT CONTROLS: THEME TOGGLE, NOTIFICATIONS, USER PILL, LOGOUT */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* THEME TOGGLE */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* NOTIFICATION BELL */}
          <div className="relative flex items-center">
            <button
              onClick={() => setNotificationPopoverOpen(!notificationPopoverOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title="Dispensary Alerts & Notifications"
            >
              <Bell className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
            </button>

            <PharmacistNotificationPopover
              isOpen={notificationPopoverOpen}
              onClose={() => setNotificationPopoverOpen(false)}
              onNavigate={(navId) => {
                handleSelectNav(navId);
              }}
            />
          </div>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* User pill */}
          <div className="hidden md:flex items-center gap-2 py-1 px-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono">
              {(effectiveUser.name || 'Pharmacist').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{effectiveUser.name}</span>
          </div>

          <button 
            onClick={onLogout}
            className="px-3 py-1.5 text-slate-500 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
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
            user={effectiveUser}
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
                  user={effectiveUser}
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
                  user={effectiveUser}
                  onNavigateOrders={(tab) => handleSelectNav('orders', tab)}
                  onNavigateMedicines={() => handleSelectNav('medicines')}
                  onToast={showToast}
                />
              ) : activeNavId === 'orders' || activeNavId === 'prescriptions' ? (
                <PharmacistOrdersView
                  user={effectiveUser}
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
                <PharmacySettingsView user={effectiveUser} />
              ) : (
                <PharmacistOverviewTab
                  user={effectiveUser}
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

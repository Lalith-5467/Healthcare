import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Bell, 
  LogOut, 
  ExternalLink,
  Search,
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';
import { showGlobalToast } from '../components/common/GlobalToastManager';
import { updateInsuranceClaimStatus } from '../utils/insuranceWorkflowStorage';
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
import { NotificationPopover } from '../components/dashboard/NotificationPopover';
import { DashboardAnnouncementBanner } from '../components/common/DashboardAnnouncementBanner';
import { notificationApi } from '../services/dhrApis';
import { useLanguage } from '../context/LanguageContext';

interface InsuranceDashboardPageProps {
  onLogout: () => void;
  user?: { name: string; email: string };
  initialNavId?: string;
  onNavigate?: (navId: string) => void;
}

export const InsuranceDashboardPage: React.FC<InsuranceDashboardPageProps> = ({ onLogout, user, initialNavId, onNavigate: _onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeNav, setActiveNav] = useState(initialNavId === 'dashboard' ? 'overview' : (initialNavId || 'overview'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string | null>(null);
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [incomingClaimAlert, setIncomingClaimAlert] = useState<{
    claimId: string;
    patientName: string;
    hospital: string;
    amount: number;
    insuranceId: string;
  } | null>(null);
  const [showDeclineAlertModal, setShowDeclineAlertModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('Missing itemized hospital pharmacy breakdown & prescription');

  const handleQuickApprove = async () => {
    if (!incomingClaimAlert) return;
    await updateInsuranceClaimStatus(
      incomingClaimAlert.insuranceId,
      'Approved',
      incomingClaimAlert.amount,
      'Claim ACCEPTED & Cashless Pre-Auth Approved'
    );
    showGlobalToast(`✓ Claim ${incomingClaimAlert.claimId} APPROVED for ₹${incomingClaimAlert.amount.toLocaleString('en-IN')}! Patient notified immediately.`, 'success', 'Claim Approved');
    setIncomingClaimAlert(null);
  };

  const handleQuickDecline = async (reason: string) => {
    if (!incomingClaimAlert) return;
    await updateInsuranceClaimStatus(
      incomingClaimAlert.insuranceId,
      'Rejected',
      0,
      `Claim DECLINED: ${reason}`
    );
    showGlobalToast(`Claim ${incomingClaimAlert.claimId} DECLINED. Rejection notification sent to patient.`, 'warning', 'Claim Declined');
    setIncomingClaimAlert(null);
    setShowDeclineAlertModal(false);
  };

  React.useEffect(() => {
    if (initialNavId) {
      setActiveNav(initialNavId === 'dashboard' ? 'overview' : initialNavId);
    }
  }, [initialNavId]);

  const loadUnreadCount = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res && res.data) {
        setUnreadNotificationsCount(res.data.filter((n: any) => !n.isRead).length);
      }
    } catch {}
  };

  React.useEffect(() => {
    loadUnreadCount();
    const handleUpdate = () => loadUnreadCount();
    window.addEventListener('notifications_updated', handleUpdate);
    return () => window.removeEventListener('notifications_updated', handleUpdate);
  }, []);

  // Listen for real-time claims dispatched from the patient portal
  React.useEffect(() => {
    const handleIncomingClaim = (e: any) => {
      const claim = e.detail;
      if (claim) {
        const patientName = claim.patientName || claim.patient?.fullName || (claim.patient?.user?.email ? claim.patient.user.email.split('@')[0] : 'Patient Claimant');
        const insId = claim.insuranceId || claim.policy?.insuranceId || '';
        setIncomingClaimAlert({
          claimId: claim.claimId || 'CLM-2026',
          patientName,
          hospital: claim.hospital || 'Hospital',
          amount: Number(claim.submittedAmount || 0),
          insuranceId: insId
        });
        if (insId) {
          setSelectedInsuranceId(insId);
        }
        setUnreadNotificationsCount(prev => prev + 1);
      }
    };

    window.addEventListener('insurance_claim_submitted', handleIncomingClaim);
    return () => window.removeEventListener('insurance_claim_submitted', handleIncomingClaim);
  }, []);

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
        return <SearchInsuranceView onSearchSuccess={handleSearchSuccess} initialQuery={topSearchQuery} />;
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
                <ShieldCheck className="w-3.5 h-3.5" /> {t('insurance.portal.title', 'Insurance Portal')}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> {t('insurance.portal.abdm_gateway', 'ABDM Claims Gateway')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* SEARCH BAR */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-48 xl:w-64 transition-colors focus-within:border-blue-500 dark:focus-within:border-cyan-500">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              value={topSearchQuery}
              onChange={(e) => {
                setTopSearchQuery(e.target.value);
                if (activeNav !== 'search') setActiveNav('search');
              }}
              onFocus={() => {
                if (activeNav !== 'search') setActiveNav('search');
              }}
              placeholder={t('insurance.header.search_placeholder', 'Search policies, claims...')} 
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white w-full focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* LANGUAGE TOGGLE */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${language === 'ta' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              தமிழ்
            </button>
          </div>
          
          {/* THEME TOGGLE */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <button 
            type="button"
            onClick={() => setNotificationPopoverOpen(true)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Quick Search Shortcut */}
          <button
            type="button"
            onClick={() => setActiveNav('search')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-blue-200 dark:border-blue-800/60 shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('insurance.header.search_policy', 'Search Policy')}</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          {/* User Display Pill */}
          <button
            type="button"
            onClick={() => setActiveNav('settings')}
            className="hidden md:flex items-center gap-2 py-1 px-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer transition-colors"
            title="TPA Profile Settings"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-600 dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono">
              {officerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{t(officerName)}</span>
          </button>

          <button 
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 text-slate-500 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('insurance.header.logout', 'Logout')}</span>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <AnimatePresence>
            {incomingClaimAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/25 border-2 border-amber-300 dark:border-amber-400/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                    <Zap className="w-6 h-6 text-white animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full">
                        Action Required • Process Decision
                      </span>
                      <span className="text-xs font-mono font-bold bg-white/25 px-2 py-0.5 rounded-md">
                        {incomingClaimAlert.claimId}
                      </span>
                    </div>
                    <h4 className="text-base font-black">
                      {incomingClaimAlert.patientName} • ₹{incomingClaimAlert.amount.toLocaleString('en-IN')}
                    </h4>
                    <p className="text-xs opacity-95 font-medium">
                      {incomingClaimAlert.hospital} — <span className="font-bold underline decoration-white/40">Accept or Decline Cashless Pre-Auth Request?</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto shrink-0">
                  <button
                    onClick={handleQuickApprove}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 border border-emerald-400/40"
                    title="Accept claim and grant cashless pre-authorization"
                  >
                    <Check className="w-4 h-4" />
                    <span>✓ Accept & Approve</span>
                  </button>
                  <button
                    onClick={() => setShowDeclineAlertModal(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 border border-rose-400/40"
                    title="Decline claim request"
                  >
                    <X className="w-4 h-4" />
                    <span>✕ Decline</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSearchSuccess(incomingClaimAlert.insuranceId);
                      setIncomingClaimAlert(null);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Review Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIncomingClaimAlert(null)}
                    className="p-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <DashboardAnnouncementBanner role="insurance" />
          {renderActiveView()}
        </main>
      </div>

      {showDeclineAlertModal && incomingClaimAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <X className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">Decline Cashless Claim</h3>
              </div>
              <button 
                onClick={() => setShowDeclineAlertModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              You are declining pre-authorization for claim <strong className="text-slate-900 dark:text-white">{incomingClaimAlert.claimId}</strong> submitted by <strong>{incomingClaimAlert.patientName}</strong> for ₹{incomingClaimAlert.amount.toLocaleString('en-IN')}.
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Reason for Rejection</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
              >
                <option value="Missing itemized hospital pharmacy breakdown & prescription">Missing itemized hospital pharmacy breakdown & prescription</option>
                <option value="Policy exclusion: Pre-existing condition waiting period not completed">Policy exclusion: Pre-existing condition waiting period not completed</option>
                <option value="Non-network hospital tariff discrepancy (requires manual billing audit)">Non-network hospital tariff discrepancy (requires manual billing audit)</option>
                <option value="Discharge summary certificate illegible / missing doctor signature">Discharge summary certificate illegible / missing doctor signature</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleQuickDecline(declineReason)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-colors cursor-pointer"
              >
                Confirm Decline & Notify Patient
              </button>
              <button
                type="button"
                onClick={() => setShowDeclineAlertModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationPopover
        isOpen={notificationPopoverOpen}
        onClose={() => setNotificationPopoverOpen(false)}
        role="insurance"
        onNavigateToNotifications={() => {
          setNotificationPopoverOpen(false);
          setActiveNav('claims');
        }}
      />
    </div>
  );
};

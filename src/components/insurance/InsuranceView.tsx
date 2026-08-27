import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  ShieldCheck,
  Plus,
  FileText,
  CheckCircle2,
  Users,
  CreditCard,
  Layers,
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';
import type {
  InsurancePolicy,
  InsuranceClaim,
  InsuranceDocument,
  FamilyMemberCoverage,
  PremiumPaymentRecord,
  InsuranceFilterState
} from './insuranceData';
import {
  INITIAL_POLICIES,
  INITIAL_CLAIMS,
  INITIAL_DOCUMENTS,
  INITIAL_FAMILY_COVERAGE,
  INITIAL_PAYMENTS
} from './insuranceData';
import { PrimaryPolicyHeroCard } from './PrimaryPolicyHeroCard';
import { CoverageOverviewSection } from './CoverageOverviewSection';
import { CoverageDetailsModal } from './CoverageDetailsModal';
import { AddPolicyModal } from './AddPolicyModal';
import { EditPolicyModal } from './EditPolicyModal';
import { ClaimsOverviewSection } from './ClaimsOverviewSection';
import { ClaimDetailsDrawer } from './ClaimDetailsDrawer';
import { NewClaimModal } from './NewClaimModal';
import { DigitalHealthCardModal } from './DigitalHealthCardModal';
import { FamilyCoverageSection } from './FamilyCoverageSection';
import { AddFamilyMemberModal } from './AddFamilyMemberModal';
import { PremiumPaymentsSection } from './PremiumPaymentsSection';
import { PolicyRenewalCard } from './PolicyRenewalCard';
import { PlanExplorerModal } from './PlanExplorerModal';
import { InsuranceDocumentsSection } from './InsuranceDocumentsSection';
import { InsuranceSupportModal } from './InsuranceSupportModal';
import { InsuranceFAQSection } from './InsuranceFAQSection';
import { InsuranceFilterDrawer } from './InsuranceFilterDrawer';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface InsuranceViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const InsuranceView: React.FC<InsuranceViewProps> = ({
  user: _user,
  onNavigate: _onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'family' | 'documents'>('overview');

  // MAIN STATE
  const [policies, setPolicies] = useState<InsurancePolicy[]>(INITIAL_POLICIES);
  const [claims, setClaims] = useState<InsuranceClaim[]>(INITIAL_CLAIMS);
  const [documents, setDocuments] = useState<InsuranceDocument[]>(INITIAL_DOCUMENTS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberCoverage[]>(INITIAL_FAMILY_COVERAGE);
  const [payments, setPayments] = useState<PremiumPaymentRecord[]>(INITIAL_PAYMENTS);

  // SEARCH & FILTERS
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<InsuranceFilterState>({
    policyStatus: 'All',
    claimStatus: 'All',
    docCategory: 'All'
  });

  // MODALS & DRAWERS
  const [coverageDetailsOpen, setCoverageDetailsOpen] = useState(false);
  const [addPolicyOpen, setAddPolicyOpen] = useState(false);
  const [editPolicyTarget, setEditPolicyTarget] = useState<InsurancePolicy | null>(null);
  const [claimDetailsTarget, setClaimDetailsTarget] = useState<InsuranceClaim | null>(null);
  const [newClaimOpen, setNewClaimOpen] = useState(false);
  const [digitalCardOpen, setDigitalCardOpen] = useState(false);
  const [addFamilyMemberOpen, setAddFamilyMemberOpen] = useState(false);
  const [planExplorerOpen, setPlanExplorerOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPolicies = localStorage.getItem('user_insurance_policies');
      if (savedPolicies && savedPolicies !== 'undefined') {
        const parsed = JSON.parse(savedPolicies);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPolicies(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const savedClaims = localStorage.getItem('user_insurance_claims');
      if (savedClaims && savedClaims !== 'undefined') {
        const parsed = JSON.parse(savedClaims);
        if (Array.isArray(parsed)) {
          setClaims(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const safePolicies = policies && policies.length > 0 ? policies : INITIAL_POLICIES;
  const primaryPolicy = safePolicies.find((p) => p.isPrimary) || safePolicies[0] || INITIAL_POLICIES[0];

  const handleAddPolicy = (newPol: InsurancePolicy) => {
    const updated = [newPol, ...policies];
    setPolicies(updated);
    localStorage.setItem('user_insurance_policies', JSON.stringify(updated));
    showToast(`✓ Added policy ${newPol.planName} (${newPol.providerName})`);
  };

  const handleSavePolicy = (updatedPol: InsurancePolicy) => {
    const updated = policies.map((p) => (p.id === updatedPol.id ? updatedPol : p));
    setPolicies(updated);
    localStorage.setItem('user_insurance_policies', JSON.stringify(updated));
    showToast(`✓ Updated policy details for ${updatedPol.planName}`);
  };

  const handleAddClaim = (newClaim: InsuranceClaim) => {
    const updated = [newClaim, ...claims];
    setClaims(updated);
    localStorage.setItem('user_insurance_claims', JSON.stringify(updated));
    showToast(`✓ Demo claim ${newClaim.claimNumber} submitted successfully`);
  };

  const handleAddFamilyMember = (newMem: FamilyMemberCoverage) => {
    const updated = [...familyMembers, newMem];
    setFamilyMembers(updated);
    showToast(`✓ Added ${newMem.memberName} to Family Floater Policy`);
  };

  const handlePayPremium = () => {
    setPayModalOpen(true);
  };

  const confirmPayPremium = () => {
    const newPay: PremiumPaymentRecord = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      monthYear: 'Sep 2026',
      amount: primaryPolicy ? primaryPolicy.premiumAmount : 2450,
      paymentDate: '24 Aug 2026',
      status: 'Paid',
      receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}-SEP`
    };
    setPayments([newPay, ...payments]);
    setPayModalOpen(false);
    showToast(`✓ Payment of ₹${newPay.amount} successful for Sep 2026`);
  };

  const tabList = [
    { id: 'overview', label: 'Policy & Coverage', icon: ShieldCheck, badge: `${safePolicies.length} Active` },
    { id: 'claims', label: 'Claims & History', icon: FileText, badge: `${claims.length} Claims` },
    { id: 'family', label: 'Family & Payments', icon: Users, badge: `${familyMembers.length} Members` },
    { id: 'documents', label: 'Vault & Support', icon: Layers, badge: `${documents.length} Docs` },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20 font-sans">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Insurance & Policy Portal"
        subtitle="Manage your health coverage breakdown, digital cashless cards, family floater, and claims."
        badgeText="Active Coverage"
        badgeIcon={<ShieldCheck className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSupportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Insurance Support</span>
            </button>
            <button
              onClick={() => setAddPolicyOpen(true)}
              className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Insurance</span>
            </button>
          </div>
        }
      />

      {/* 2. FOUR SUMMARY CARDS WITH ACCENT COLORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          className="p-4 rounded-2xl flex items-center gap-3.5"
          style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
            border: '1px solid rgba(20,184,166,.2)',
            boxShadow: '0 2px 10px rgba(20,184,166,.05)'
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#00a896,#0d9488)', boxShadow: '0 3px 10px rgba(0,168,150,.3)' }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Active Policies</span>
            <strong className="text-xl font-black text-slate-900 dark:text-white">{safePolicies.length}</strong>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl flex items-center gap-3.5"
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
            border: '1px solid rgba(59,130,246,.2)',
            boxShadow: '0 2px 10px rgba(59,130,246,.05)'
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow: '0 3px 10px rgba(59,130,246,.3)' }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Total Sum Insured</span>
            <strong className="text-xl font-black text-blue-700 dark:text-blue-400">
              ₹{((primaryPolicy?.coverageAmount || 1000000) / 100000).toFixed(0)} Lakhs
            </strong>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl flex items-center gap-3.5"
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '1px solid rgba(16,185,129,.2)',
            boxShadow: '0 2px 10px rgba(16,185,129,.05)'
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 3px 10px rgba(16,185,129,.3)' }}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Claims Handled</span>
            <strong className="text-xl font-black text-emerald-700 dark:text-emerald-400">{claims.length}</strong>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl flex items-center gap-3.5"
          style={{
            background: 'linear-gradient(135deg, #fdf4ff 0%, #ffffff 100%)',
            border: '1px solid rgba(192,132,252,.2)',
            boxShadow: '0 2px 10px rgba(192,132,252,.05)'
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', boxShadow: '0 3px 10px rgba(168,85,247,.3)' }}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Vault Documents</span>
            <strong className="text-xl font-black text-purple-700 dark:text-purple-400">{documents.length}</strong>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE NAVIGATION TABS */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-[#00a896] dark:text-cyan-300 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                  isActive
                    ? 'bg-teal-500/15 text-[#00a896]'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENT */}

      {/* TAB 1: OVERVIEW & POLICIES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Primary Hero Card */}
          {primaryPolicy && (
            <PrimaryPolicyHeroCard
              policy={primaryPolicy}
              onOpenDigitalCard={() => setDigitalCardOpen(true)}
              onOpenEditPolicy={(p) => setEditPolicyTarget(p)}
              onOpenCoverageDetails={() => setCoverageDetailsOpen(true)}
            />
          )}

          {/* Coverage Overview with Progress */}
          {primaryPolicy && (
            <CoverageOverviewSection
              policy={primaryPolicy}
              onOpenDetails={() => setCoverageDetailsOpen(true)}
            />
          )}

          {/* My Policies List */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                All Linked Policies ({safePolicies.length})
              </h3>
              <button
                onClick={() => setPlanExplorerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 text-[#00a896] dark:text-cyan-300 font-extrabold border border-teal-200/60 dark:border-slate-700 cursor-pointer shadow-xs"
              >
                Explore Plans Marketplace →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safePolicies.map((pol) => (
                <div
                  key={pol.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:border-teal-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 uppercase font-mono">
                        {pol.policyType}
                      </span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">{pol.planName}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{pol.providerName}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                      {pol.status}
                    </span>
                  </div>

                  <div className="flex justify-between font-mono text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Coverage: <strong className="text-slate-900 dark:text-white">₹{pol.coverageAmount.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Expires: <strong className="text-[#00a896] dark:text-teal-300">{pol.expiryDate}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal Alert Card */}
          {primaryPolicy && (
            <PolicyRenewalCard
              policy={primaryPolicy}
              onRenewClick={() => showToast('✓ Demo policy renewal request submitted')}
              onSetReminderClick={() => showToast('✓ Renewal reminder set')}
            />
          )}
        </div>
      )}

      {/* TAB 2: CLAIMS & REIMBURSEMENTS */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          <ClaimsOverviewSection
            claims={claims}
            onOpenNewClaim={() => setNewClaimOpen(true)}
            onOpenClaimDetails={(c) => setClaimDetailsTarget(c)}
          />
        </div>
      )}

      {/* TAB 3: FAMILY COVERAGE & PAYMENTS */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <FamilyCoverageSection
            members={familyMembers}
            onOpenAddMember={() => setAddFamilyMemberOpen(true)}
          />

          <PremiumPaymentsSection
            payments={payments}
            onPayNextPremium={handlePayPremium}
          />
        </div>
      )}

      {/* TAB 4: VAULT DOCUMENTS & FAQ */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <InsuranceDocumentsSection
            documents={documents}
            onUploadDocument={(doc) => {
              setDocuments([doc, ...documents]);
              showToast(`✓ Uploaded ${doc.fileName}`);
            }}
            onDeleteDocument={(id) => {
              setDocuments(documents.filter((d) => d.id !== id));
              showToast('✓ Document deleted');
            }}
          />

          <InsuranceFAQSection />
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <CoverageDetailsModal
        policy={primaryPolicy}
        isOpen={coverageDetailsOpen}
        onClose={() => setCoverageDetailsOpen(false)}
      />

      <AddPolicyModal
        isOpen={addPolicyOpen}
        onClose={() => setAddPolicyOpen(false)}
        onAddPolicy={handleAddPolicy}
      />

      <EditPolicyModal
        policy={editPolicyTarget}
        isOpen={!!editPolicyTarget}
        onClose={() => setEditPolicyTarget(null)}
        onSavePolicy={handleSavePolicy}
      />

      <ClaimDetailsDrawer
        claim={claimDetailsTarget}
        isOpen={!!claimDetailsTarget}
        onClose={() => setClaimDetailsTarget(null)}
      />

      <NewClaimModal
        isOpen={newClaimOpen}
        onClose={() => setNewClaimOpen(false)}
        onAddClaim={handleAddClaim}
      />

      <DigitalHealthCardModal
        policy={primaryPolicy}
        isOpen={digitalCardOpen}
        onClose={() => setDigitalCardOpen(false)}
        onShareCard={() => {
          showToast('✓ Shared digital health card');
          setDigitalCardOpen(false);
        }}
      />

      <AddFamilyMemberModal
        isOpen={addFamilyMemberOpen}
        onClose={() => setAddFamilyMemberOpen(false)}
        onAddMember={handleAddFamilyMember}
      />

      <PlanExplorerModal
        isOpen={planExplorerOpen}
        onClose={() => setPlanExplorerOpen(false)}
        onSelectPlan={(plan) => showToast(`Selected ${plan.name}`)}
      />

      <InsuranceSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        onSubmitSupport={(t, _m) => showToast(`✓ Support ticket submitted: ${t}`)}
      />

      <InsuranceFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(updated) => setFilters(updated)}
      />

      {/* DEMO PAY MODAL */}
      {payModalOpen && primaryPolicy && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Pay Policy Premium</h3>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Plan:</span>
                <strong className="text-slate-900 dark:text-white">{primaryPolicy.planName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Premium Due:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">₹{primaryPolicy.premiumAmount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Due Date:</span>
                <strong className="text-amber-600 dark:text-amber-300">01 Sep 2026</strong>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-sans">
              <button
                onClick={() => setPayModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayPremium}
                className="flex-1 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold cursor-pointer text-center shadow-md"
              >
                Confirm Payment (₹{primaryPolicy.premiumAmount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

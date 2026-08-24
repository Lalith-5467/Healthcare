import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  FileText,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  Users,
  Search,
  SlidersHorizontal,
  HelpCircle,
  Activity,
  Building2,
  Bell,
  Sparkles
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
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MAIN STATE
  const [policies, setPolicies] = useState<InsurancePolicy[]>(INITIAL_POLICIES);
  const [claims, setClaims] = useState<InsuranceClaim[]>(INITIAL_CLAIMS);
  const [documents, setDocuments] = useState<InsuranceDocument[]>(INITIAL_DOCUMENTS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberCoverage[]>(INITIAL_FAMILY_COVERAGE);
  const [payments, setPayments] = useState<PremiumPaymentRecord[]>(INITIAL_PAYMENTS);

  // SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
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
    const savedPolicies = localStorage.getItem('user_insurance_policies');
    if (savedPolicies) {
      try { setPolicies(JSON.parse(savedPolicies)); } catch (e) { console.error(e); }
    }
    const savedClaims = localStorage.getItem('user_insurance_claims');
    if (savedClaims) {
      try { setClaims(JSON.parse(savedClaims)); } catch (e) { console.error(e); }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const primaryPolicy = policies.find((p) => p.isPrimary) || policies[0];

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
      amount: primaryPolicy.premiumAmount,
      paymentDate: '24 Aug 2026',
      status: 'Paid',
      receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}-SEP`
    };
    setPayments([newPay, ...payments]);
    setPayModalOpen(false);
    showToast(`✓ Payment of ₹${primaryPolicy.premiumAmount} successful for Sep 2026`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Insurance</h1>
            <span className="px-3 py-1 text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-mono">
              🛡 Active Coverage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your health insurance, coverage breakdown and claims in one place.
          </p>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => setAddPolicyOpen(true)}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Insurance</span>
          </button>
        </div>
      </div>

      {/* 2. HERO PRIMARY POLICY CARD */}
      <PrimaryPolicyHeroCard
        policy={primaryPolicy}
        onOpenDigitalCard={() => setDigitalCardOpen(true)}
        onOpenEditPolicy={(p) => setEditPolicyTarget(p)}
        onOpenCoverageDetails={() => setCoverageDetailsOpen(true)}
      />

      {/* 3. FOUR SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 block font-sans">Active Policies</span>
          <strong className="text-2xl font-extrabold text-white">{policies.length}</strong>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 block font-sans">Total Coverage</span>
          <strong className="text-2xl font-extrabold text-purple-300">₹{(primaryPolicy.coverageAmount / 100000).toFixed(0)} Lakhs</strong>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 block font-sans">Claims This Year</span>
          <strong className="text-2xl font-extrabold text-teal-400">{claims.length}</strong>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 block font-sans">Documents Stored</span>
          <strong className="text-2xl font-extrabold text-cyan-300">{documents.length}</strong>
        </div>
      </div>

      {/* 4. COVERAGE OVERVIEW SECTION */}
      <CoverageOverviewSection
        policy={primaryPolicy}
        onOpenDetails={() => setCoverageDetailsOpen(true)}
      />

      {/* 5. MY POLICIES LIST */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white">My Insurance Policies ({policies.length})</h3>
          <button
            onClick={() => setPlanExplorerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold border border-slate-700 cursor-pointer"
          >
            Explore Plans Marketplace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((pol) => (
            <div key={pol.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">{pol.policyType}</span>
                  <h4 className="font-extrabold text-white text-sm">{pol.planName}</h4>
                  <p className="text-slate-400 text-xs">{pol.providerName}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                  {pol.status}
                </span>
              </div>

              <div className="flex justify-between font-mono text-[11px] pt-2 border-t border-slate-800">
                <span className="text-slate-400">Coverage: <strong className="text-white">₹{pol.coverageAmount.toLocaleString()}</strong></span>
                <span className="text-slate-400">Expires: <strong className="text-teal-300">{pol.expiryDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RENEWAL COUNTDOWN CARD */}
      <PolicyRenewalCard
        policy={primaryPolicy}
        onRenewClick={() => showToast('✓ Demo policy renewal request submitted')}
        onSetReminderClick={() => {
          showToast('Navigating to Reminders & Notifications');
          onNavigate('reminders');
        }}
      />

      {/* 7. CLAIMS OVERVIEW SECTION */}
      <ClaimsOverviewSection
        claims={claims}
        onOpenNewClaim={() => setNewClaimOpen(true)}
        onOpenClaimDetails={(c) => setClaimDetailsTarget(c)}
      />

      {/* 8. COVERED FAMILY MEMBERS */}
      <FamilyCoverageSection
        members={familyMembers}
        onOpenAddMember={() => setAddFamilyMemberOpen(true)}
      />

      {/* 9. PREMIUM PAYMENTS SECTION */}
      <PremiumPaymentsSection
        payments={payments}
        onPayNextPremium={handlePayPremium}
      />

      {/* 10. INSURANCE DOCUMENTS */}
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

      {/* 11. FAQ ACCORDION */}
      <InsuranceFAQSection />

      {/* 12. CROSS-MODULE CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <button
          onClick={() => onNavigate('records')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <FileText className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white">Medical Records</h4>
          <p className="text-[11px] text-slate-400">View linked hospital bills & lab reports →</p>
        </button>

        <button
          onClick={() => onNavigate('family')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Users className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white">Family Connect</h4>
          <p className="text-[11px] text-slate-400">Share policy cards with dependents →</p>
        </button>

        <button
          onClick={() => onNavigate('hospitals')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Building2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white">Empanelled Hospitals</h4>
          <p className="text-[11px] text-slate-400">Find 24x7 cashless network hospitals →</p>
        </button>

        <button
          onClick={() => setSupportModalOpen(true)}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <HelpCircle className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white">Insurance Support Desk</h4>
          <p className="text-[11px] text-slate-400">Submit claim & policy assistance tickets →</p>
        </button>
      </div>

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
        onSubmitSupport={(t, m) => showToast(`✓ Support ticket submitted: ${t}`)}
      />

      {/* DEMO PAY MODAL */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <h3 className="font-extrabold text-white text-base">Pay Policy Premium</h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">Plan:</span><strong className="text-white">{primaryPolicy.planName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Premium Due:</span><strong className="text-emerald-400 text-sm">₹{primaryPolicy.premiumAmount}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Due Date:</span><strong className="text-amber-300">01 Sep 2026</strong></div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between gap-3">
              <button onClick={() => setPayModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
              <button onClick={confirmPayPremium} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold cursor-pointer text-center">Confirm Demo Payment (₹2,450)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

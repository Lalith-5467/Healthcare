import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, FileText, CheckCircle2, Clock, IndianRupee, Search, ChevronRight, 
  AlertTriangle, History, Check, X, FileCheck, Building2, CreditCard 
} from 'lucide-react';
import { useInsuranceWorkflow, type InsurancePolicyRecord, type InsuranceClaim } from '../../../utils/insuranceWorkflowStorage';
import { showGlobalToast } from '../../common/GlobalToastManager';
import { CashlessGuaranteeLetterModal } from '../../insurance/CashlessGuaranteeLetterModal';
import { ClaimSettlementReceiptModal } from '../../insurance/ClaimSettlementReceiptModal';
import { useLanguage } from '../../../context/LanguageContext';

interface InsuranceProfileViewProps {
  insuranceId: string | null;
  onNavigate: (id: string) => void;
}

export const InsuranceProfileView: React.FC<InsuranceProfileViewProps> = ({ insuranceId: initialInsuranceId, onNavigate }) => {
  const { records, updateCurrentClaimStatus, updateDocumentStatus } = useInsuranceWorkflow();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'policy' | 'current' | 'past' | 'documents' | 'timeline' | 'coverage'>('current');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(initialInsuranceId);

  React.useEffect(() => {
    if (initialInsuranceId) {
      setSelectedRecordId(initialInsuranceId);
    }
  }, [initialInsuranceId]);

  const effectiveId = selectedRecordId || initialInsuranceId;
  const record = (effectiveId && records.find(r => 
    r.insuranceId === effectiveId || 
    r.patientName.toLowerCase() === effectiveId.toLowerCase() ||
    (r.currentClaim && r.currentClaim.claimId.toLowerCase() === effectiveId.toLowerCase())
  ))
    || records.find(r => r.currentClaim && (r.currentClaim.status === 'New' || r.currentClaim.status === 'Under Review'))
    || records.find(r => r.currentClaim !== null)
    || records[0];

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Search className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{t('No Record Selected')}</h2>
        <p className="text-slate-500">{t('Please search for an Insurance ID first.')}</p>
        <button 
          onClick={() => onNavigate('search')}
          className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg cursor-pointer"
        >
          {t('Go to Search')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-black text-blue-600 border-2 border-blue-100 dark:border-blue-800/50">
            {record.patientName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{t(record.patientName)}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-500">{t('Insurance ID')}: {record.insuranceId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t('Active Policy')}
              </span>
            </div>
          </div>
        </div>

        {records.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 self-stretch sm:self-auto">
            <span className="text-xs font-bold text-slate-500 pl-2">{t('Select Claim')}:</span>
            <select
              value={record.insuranceId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {records.map(r => (
                <option key={r.insuranceId} value={r.insuranceId}>
                  {r.patientName} {r.currentClaim ? `• ${r.currentClaim.claimId} (${r.currentClaim.status})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'current', label: 'Current Claim', icon: AlertTriangle, badge: record.currentClaim ? 1 : 0 },
          { id: 'policy', label: 'Policy Details', icon: ShieldCheck },
          { id: 'coverage', label: 'Coverage', icon: FileCheck },
          { id: 'documents', label: 'Documents', icon: FileText, badge: record.currentClaim?.documents.filter(d => d.status === 'Missing').length || 0 },
          { id: 'past', label: 'Past Claims', icon: History },
          { id: 'timeline', label: 'Timeline', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-600 dark:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{t(tab.label)}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'current' && <CurrentClaimTab record={record} updateCurrentClaimStatus={updateCurrentClaimStatus} />}
          {activeTab === 'policy' && <PolicyTab record={record} />}
          {activeTab === 'coverage' && <CoverageTab record={record} />}
          {activeTab === 'documents' && <DocumentsTab record={record} updateDocumentStatus={updateDocumentStatus} />}
          {activeTab === 'past' && <PastClaimsTab record={record} />}
          {activeTab === 'timeline' && <TimelineTab record={record} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// TABS COMPONENTS
// ==========================================

const CurrentClaimTab = ({ record, updateCurrentClaimStatus }: { record: InsurancePolicyRecord, updateCurrentClaimStatus: any }) => {
  const claim = record.currentClaim;
  const { t } = useLanguage();
  const [showApproval, setShowApproval] = useState(false);
  const [approveAmount, setApproveAmount] = useState(claim?.submittedAmount.toString() || '');
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showSettlementConfirm, setShowSettlementConfirm] = useState(false);
  const [settlementRemarks, setSettlementRemarks] = useState('Hospital final discharge invoice verified against IRDAI tariff ceiling. Direct RTGS transfer cleared.');

  if (!claim) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{t('No Active Claims')}</h2>
        <p className="text-slate-500">{t('All claims for this policy have been settled.')}</p>
      </div>
    );
  }

  const steps = [
    { label: 'Submitted', done: true },
    { label: 'Documents', done: claim.documents.every(d => d.status === 'Verified') },
    { label: 'Verification', done: claim.status !== 'New' },
    { label: 'Medical Review', done: claim.status === 'Approved' || claim.status === 'Partially Approved' || claim.status === 'Settled' },
    { label: 'Decision', done: claim.status === 'Approved' || claim.status === 'Partially Approved' || claim.status === 'Settled' },
    { label: 'Settlement', done: claim.status === 'Settled' }
  ];

  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState('Missing itemized pharmacy breakdown & doctor prescription note');

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(approveAmount);
    if (amt === claim.submittedAmount) {
      updateCurrentClaimStatus(record.insuranceId, 'Approved', amt, 'Claim ACCEPTED & Cashless Pre-Auth Approved for Full Amount');
      showGlobalToast(`✓ Claim ${claim.claimId} approved for ₹${amt.toLocaleString()}! Patient portal updated in real-time.`, 'success', 'Claim Approved');
    } else {
      updateCurrentClaimStatus(record.insuranceId, 'Partially Approved', amt, `Claim ACCEPTED with Partial Approval: ₹${amt.toLocaleString()}`);
      showGlobalToast(`Claim ${claim.claimId} partially approved for ₹${amt.toLocaleString()}. Patient notified.`, 'info', 'Partial Approval');
    }
    setShowApproval(false);
  };

  const handleDecline = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentClaimStatus(record.insuranceId, 'Rejected', 0, `Claim DECLINED: ${declineReason}`);
    showGlobalToast(`Claim ${claim.claimId} declined. Decision sent to Patient Portal.`, 'warning', 'Claim Declined');
    setShowDecline(false);
  };

  const handleConfirmSettle = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentClaimStatus(record.insuranceId, 'Settled', claim.approvedAmount, `Hospital Direct Settlement Disbursed: ${settlementRemarks}`);
    showGlobalToast(`Claim ${claim.claimId} settled with ${claim.hospital}! Direct hospital billing cleared.`, 'success', 'Claim Settled');
    setShowSettlementConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 dark:bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-black text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                {claim.claimId}
              </span>
              <span className="text-xs font-bold text-slate-500">{t('Patient')}: {t(record.patientName)}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{t(claim.hospital)}</h2>
            <p className="text-xs font-bold text-slate-500">
              {t(claim.treatment)} • {t('Submitted')}: {claim.timeline[0]?.date} • Patient ID: {record.patientId}
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{t('Claim Amount')}</p>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-500">₹{claim.submittedAmount.toLocaleString()}</p>
            <span className={`inline-block mt-2 px-3 py-1 font-black text-xs uppercase tracking-wider rounded-md ${
              claim.status === 'Approved'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'
                : claim.status === 'Settled'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-cyan-300'
                : claim.status === 'Rejected'
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
            }`}>
              {claim.status === 'Settled' ? `✓ ${t('Settled')}` : t(claim.status)}
            </span>
          </div>
        </div>

        {/* Workflow Tracker */}
        <div className="relative z-10 mb-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">{t('Processing Status')}</h3>
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-slate-900 transition-colors ${
                  step.done ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'
                }`}>
                  {step.done ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>}
                </div>
                <span className={`absolute top-10 text-[10px] font-bold whitespace-nowrap ${
                  step.done ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 dark:text-slate-400'
                }`}>{t(step.label)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Actions */}
        {(claim.status === 'New' || claim.status === 'Under Review') && !showApproval && !showDecline && (
          <div className="relative z-10 pt-12 flex flex-wrap gap-4">
            <button 
              onClick={() => setShowApproval(true)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer text-xs"
            >
              <Check className="w-4 h-4" /> {t('Accept & Approve Claim')}
            </button>
            <button 
              onClick={() => setShowDecline(true)}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer text-xs"
            >
              <X className="w-4 h-4" /> {t('Decline / Reject Claim')}
            </button>
          </div>
        )}

        {(claim.status === 'Approved' || claim.status === 'Partially Approved') && (
          <div className="relative z-10 pt-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-slate-100 dark:border-slate-800 mt-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{t('Approved Cashless Amount')}</p>
              <p className="text-2xl font-black text-emerald-600">₹{claim.approvedAmount.toLocaleString()}</p>
              <p className="text-xs text-slate-500 font-mono">
                {t('Pre-Auth Token:')} <strong className="text-slate-800 dark:text-slate-200">{claim.preAuthCode || 'AUTH-84920-APOLLO'}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button 
                type="button"
                onClick={() => setShowLetterModal(true)}
                className="px-5 py-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 font-black rounded-xl transition-colors flex items-center gap-2 cursor-pointer text-xs border border-blue-200 dark:border-blue-800"
              >
                <FileText className="w-4 h-4" /> {t('View Pre-Auth Guarantee Letter')}
              </button>
              <button 
                type="button"
                onClick={() => setShowSettlementConfirm(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-colors flex items-center gap-2 cursor-pointer text-xs shadow-md shadow-emerald-500/20"
              >
                <CreditCard className="w-4 h-4" /> {t('Process Direct Hospital Settlement')}
              </button>
            </div>
          </div>
        )}

        {claim.status === 'Settled' && (
          <div className="relative z-10 pt-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-slate-100 dark:border-slate-800 mt-8">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('Direct Hospital Settlement Disbursed')}
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(claim.approvedAmount || claim.submittedAmount).toLocaleString()}</p>
              <p className="text-xs text-slate-500 font-mono">
                {t('Txn Ref:')} <strong className="text-slate-800 dark:text-slate-200">{claim.settlementTxnId || 'TXN-IRDAI-984210'}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button 
                type="button"
                onClick={() => setShowLetterModal(true)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <FileText className="w-4 h-4" /> {t('Pre-Auth Letter')}
              </button>
              <button 
                type="button"
                onClick={() => setShowSettlementModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer text-xs shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> {t('View Settlement Voucher')}
              </button>
            </div>
          </div>
        )}

        {/* Approval Form */}
        {showApproval && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="relative z-10 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 space-y-4"
            onSubmit={handleApprove}
          >
            <h3 className="text-sm font-black text-emerald-600 uppercase flex items-center gap-2">
              <Check className="w-4 h-4" /> {t('Accept Claim & Grant Cashless Pre-Auth')}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-2 block">{t('Approved Amount (₹)')}</label>
                <input 
                  type="number" 
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none font-black text-slate-900" 
                  required
                />
              </div>
              <button type="submit" className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl cursor-pointer text-xs">
                Confirm Approval & Notify Patient
              </button>
              <button type="button" onClick={() => setShowApproval(false)} className="px-4 py-3.5 bg-slate-100 text-slate-600 font-black rounded-xl cursor-pointer text-xs">
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Decline Form */}
        {showDecline && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="relative z-10 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 space-y-4"
            onSubmit={handleDecline}
          >
            <h3 className="text-sm font-black text-rose-600 uppercase flex items-center gap-2">
              <X className="w-4 h-4" /> Decline Claim Request
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Reason for Decline / Rejection</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none font-bold text-slate-900 text-xs"
                >
                  <option value="Missing itemized hospital pharmacy breakdown & prescription">Missing itemized hospital pharmacy breakdown & prescription</option>
                  <option value="Policy exclusion: Pre-existing condition waiting period not completed">Policy exclusion: Pre-existing condition waiting period not completed</option>
                  <option value="Non-network hospital tariff discrepancy (requires manual billing audit)">Non-network hospital tariff discrepancy (requires manual billing audit)</option>
                  <option value="Discharge summary certificate illegible / missing doctor signature">Discharge summary certificate illegible / missing doctor signature</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl cursor-pointer text-xs">
                  Confirm Decline & Send Notification
                </button>
                <button type="button" onClick={() => setShowDecline(false)} className="px-4 py-3.5 bg-slate-100 text-slate-600 font-black rounded-xl cursor-pointer text-xs">
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* Settlement Confirmation Form */}
        {showSettlementConfirm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="relative z-10 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 space-y-4"
            onSubmit={handleConfirmSettle}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                  Hospital Direct Electronic Settlement Clearance
                </h3>
                <p className="text-xs text-slate-500">
                  Execute direct electronic funds transfer to {claim.hospital} and generate zero-dues discharge clearance certificate.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Hospital Payee:</span>
                <strong className="text-slate-900 dark:text-white">{claim.hospital}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Disbursement Amount:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black">
                  ₹{(claim.approvedAmount || claim.submittedAmount).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Settlement Channel:</span>
                <strong className="text-blue-600 dark:text-cyan-400">IRDAI Real-time RTGS / NEFT Clearinghouse</strong>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">Audit & Clearing Remarks:</label>
              <textarea
                value={settlementRemarks}
                onChange={(e) => setSettlementRemarks(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none font-bold text-slate-900 dark:text-white text-xs"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer text-xs shadow-md shadow-emerald-500/20"
              >
                Confirm Direct Settlement & Disburse Payout
              </button>
              <button 
                type="button" 
                onClick={() => setShowSettlementConfirm(false)} 
                className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* MODALS */}
        <CashlessGuaranteeLetterModal
          isOpen={showLetterModal}
          onClose={() => setShowLetterModal(false)}
          record={record}
          claim={claim}
        />

        <ClaimSettlementReceiptModal
          isOpen={showSettlementModal}
          onClose={() => setShowSettlementModal(false)}
          record={record}
          claim={claim}
        />
      </div>
    </div>
  );
};

const PolicyTab = ({ record }: { record: InsurancePolicyRecord }) => {
  const { t } = useLanguage();
  const percentUsed = Math.round((record.usedCoverage / record.coverageAmount) * 100);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
      <div>
        <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">{t('Policy Details')}</h3>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{t(record.policyName)}</p>
        <p className="text-sm font-bold text-slate-500 mt-1">{t('insurance.search.policy_number', 'Policy No')}: {record.policyNumber} • {t('insurance.search.validity', 'Valid till')} {record.policyEndDate}</p>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1">{t('insurance.search.total_coverage', 'Total Coverage')}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">₹{record.coverageAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1">{t('insurance.search.remaining_limit', 'Remaining')}</p>
            <p className="text-xl font-black text-emerald-600">₹{record.remainingCoverage.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-blue-500" style={{ width: `${percentUsed}%` }}></div>
        </div>
        <p className="text-xs font-bold text-slate-500 text-right">{percentUsed}% Used (₹{record.usedCoverage.toLocaleString()})</p>
      </div>
    </div>
  );
};

const DocumentsTab = ({ record, updateDocumentStatus }: { record: InsurancePolicyRecord, updateDocumentStatus: any }) => {
  const { t } = useLanguage();
  const docs = record.currentClaim?.documents || [];
  
  if (docs.length === 0) return <p className="p-6 text-slate-500 font-bold">No documents attached to current claim.</p>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">{t('Document Verification', 'Document Verification')}</h3>
      <div className="space-y-3">
        {docs.map(doc => (
          <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : doc.status === 'Missing' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                {doc.status === 'Verified' ? <CheckCircle2 className="w-5 h-5" /> : doc.status === 'Missing' ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{t(doc.name)}</p>
                <p className="text-xs font-bold text-slate-500">Uploaded by {t(doc.uploadedBy)} • {doc.uploadDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 
                doc.status === 'Missing' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {t(doc.status)}
              </span>
              {doc.status === 'Missing' && (
                <button 
                  onClick={() => updateDocumentStatus(record.insuranceId, doc.id, 'Verified')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs rounded-lg transition-colors cursor-pointer"
                >
                  {t('Mark Verified', 'Mark Verified')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CoverageTab = ({ record }: { record: InsurancePolicyRecord }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">{t('Coverage & Benefits', 'Coverage & Benefits')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(record.benefits).map(([key, val]) => (
          <div key={key} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{t(key)}</span>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 ${
              val === 'Covered' ? 'bg-emerald-50 text-emerald-600' : 
              val === 'Partial' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {val === 'Covered' ? <Check className="w-3 h-3" /> : val === 'Partial' ? <span className="text-[14px] leading-none">◐</span> : <X className="w-3 h-3" />}
              {t(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PastClaimsTab = ({ record }: { record: InsurancePolicyRecord }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">{t('Past Claim History', 'Past Claim History')}</h3>
      {record.claims.length === 0 ? (
        <p className="text-slate-500 font-bold">No past claims found.</p>
      ) : (
        <div className="space-y-4">
          {record.claims.map(claim => (
            <div key={claim.claimId} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-black text-slate-900 dark:text-white text-lg">{claim.claimId}</p>
                <p className="text-sm font-bold text-slate-500">{t(claim.hospital)} • {t(claim.treatment)}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{claim.admissionDate} - {claim.dischargeDate}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-bold text-slate-500 line-through">₹{claim.submittedAmount.toLocaleString()}</p>
                <p className="text-xl font-black text-emerald-600 mb-2">₹{claim.approvedAmount.toLocaleString()}</p>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {t(claim.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TimelineTab = ({ record }: { record: InsurancePolicyRecord }) => {
  const { t } = useLanguage();
  const events = record.currentClaim?.timeline || [];
  
  if (events.length === 0) return <p className="p-6 text-slate-500 font-bold">No timeline events available.</p>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-8 text-center">{t('Claim Timeline', 'Claim Timeline')}</h3>
      <div className="relative pl-6 sm:pl-8">
        <div className="absolute left-[39px] sm:left-[51px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
        <div className="space-y-8">
          {events.map((event, i) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 flex gap-4 sm:gap-6"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:bg-slate-900 ${
                event.status === 'Completed' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-500'
              } flex items-center justify-center shrink-0 shadow-sm`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-slate-900 dark:text-white">{t(event.action)}</h3>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100">{event.date}</span>
                </div>
                <p className="text-xs font-bold text-slate-500">{t(event.role)} • {event.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

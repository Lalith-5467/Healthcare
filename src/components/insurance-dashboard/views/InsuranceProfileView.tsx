import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, FileText, CheckCircle2, Clock, IndianRupee, Search, ChevronRight, 
  AlertTriangle, History, Check, X, FileCheck, Building2, CreditCard 
} from 'lucide-react';
import { useInsuranceWorkflow, type InsurancePolicyRecord, type InsuranceClaim } from '../../../utils/insuranceWorkflowStorage';

interface InsuranceProfileViewProps {
  insuranceId: string | null;
  onNavigate: (id: string) => void;
}

export const InsuranceProfileView: React.FC<InsuranceProfileViewProps> = ({ insuranceId, onNavigate }) => {
  const { records, updateCurrentClaimStatus, updateDocumentStatus } = useInsuranceWorkflow();
  const [activeTab, setActiveTab] = useState<'policy' | 'current' | 'past' | 'documents' | 'timeline' | 'coverage'>('current');
  
  const record = records.find(r => r.insuranceId === insuranceId);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Search className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Record Selected</h2>
        <p className="text-slate-500">Please search for an Insurance ID first.</p>
        <button 
          onClick={() => onNavigate('search')}
          className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg"
        >
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Profile */}
      <div className="bg-white/90 dark:bg-[#070c18]/80 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 border border-white/20 dark:border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center justify-center text-3xl font-black text-slate-400 overflow-hidden shrink-0">
              {record.patientName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-[#070c18] w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{record.patientName}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">CLAIMANT ID: {record.insuranceId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                 Active Policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-white/50 dark:bg-[#0b1120]/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 w-fit">
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
            className={`px-5 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-600 dark:text-slate-400 border border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
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
  const [showApproval, setShowApproval] = useState(false);
  const [approveAmount, setApproveAmount] = useState(claim?.submittedAmount.toString() || '');

  if (!claim) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Active Claims</h2>
        <p className="text-slate-500">All claims for this policy have been settled.</p>
      </div>
    );
  }

  const steps = [
    { label: 'Claim Submitted', done: true },
    { label: 'Document Verification', done: claim.status !== 'New' },
    { label: 'Assessment', done: claim.status !== 'New' },
    { label: 'Pending Review', done: claim.status === 'Approved' || claim.status === 'Partially Approved' || claim.status === 'Settled' },
    { label: 'Final Decision', done: claim.status === 'Settled' }
  ];

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(approveAmount);
    if (amt === claim.submittedAmount) {
      updateCurrentClaimStatus(record.insuranceId, 'Approved', amt, 'Claim Approved Full Amount');
    } else {
      updateCurrentClaimStatus(record.insuranceId, 'Partially Approved', amt, 'Claim Partially Approved');
    }
    setShowApproval(false);
  };

  const handleSettle = () => {
    updateCurrentClaimStatus(record.insuranceId, 'Settled', claim.approvedAmount, 'Payment Processed & Settled');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 dark:bg-[#0b1120]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-amber-200 dark:border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 dark:bg-amber-500/10 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/5 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
          
          {/* Left Side: Amount */}
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Current Claim</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
               <p className="text-4xl sm:text-5xl font-black text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] tracking-tight">₹{claim.submittedAmount.toLocaleString()}</p>
               <span className="px-4 py-1.5 border border-amber-500 text-amber-500 font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)] whitespace-nowrap">
                 {claim.status === 'New' ? 'Under Review' : claim.status}
               </span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Claim Value</p>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-24 bg-slate-200 dark:bg-slate-700 mx-4"></div>

          {/* Right Side: Details */}
          <div className="flex-1 flex justify-start md:justify-end">
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <div className="flex justify-between md:justify-end gap-8">
                <span className="w-24">Claim ID:</span> 
                <span className="text-white font-medium text-right w-32">{claim.claimId}</span>
              </div>
              <div className="flex justify-between md:justify-end gap-8">
                <span className="w-24">Type:</span> 
                <span className="text-white font-medium text-right w-32">{claim.treatment}</span>
              </div>
              <div className="flex justify-between md:justify-end gap-8">
                <span className="w-24">Filed:</span> 
                <span className="text-white font-medium text-right w-32">{claim.timeline[0]?.date || 'Oct 28, 2023'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Tracker */}
        <div className="relative z-10 mb-12 pt-10 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex justify-between items-center relative px-4">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            
            {/* active line filling */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${(steps.filter(s => s.done).length / (steps.length - 1)) * 100}%` }}></div>

            {steps.map((step, i) => {
              const isCurrent = !step.done && (i === 0 || steps[i - 1].done);
              
              // Dummy dates for the stepper to match mockup aesthetic
              const dates = ["Oct 28", "Nov 02", "Nov 15", "Active", "Dec 14", "TBD"];
              const subtitle = step.done ? dates[i] : (isCurrent ? dates[i] : "");

              return (
                <div key={i} className="relative flex flex-col items-center group">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                    step.done 
                      ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                      : isCurrent
                        ? 'bg-[#0b1120] border-2 sm:border-4 border-slate-700 shadow-[0_0_15px_rgba(255,255,255,0.2)] ring-4 ring-white/10 animate-pulse'
                        : 'bg-[#1a2133] border-2 border-[#2a344a]'
                  }`}>
                    {step.done ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : (isCurrent ? <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-400"></div> : <div className="w-3 h-3 rounded-full bg-[#2a344a]"></div>)}
                  </div>
                  <div className="absolute top-12 sm:top-14 flex flex-col items-center w-24 text-center">
                    <span className={`text-[9px] sm:text-[11px] font-medium leading-tight ${
                      step.done || isCurrent ? 'text-white' : 'text-slate-500'
                    }`}>{step.label}</span>
                    <span className={`text-[9px] sm:text-[11px] font-medium mt-0.5 ${
                      isCurrent ? 'text-white' : 'text-slate-500'
                    }`}>{subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decision Actions */}
        {(claim.status === 'New' || claim.status === 'Under Review') && !showApproval && (
          <div className="relative z-10 pt-16 pb-4 flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => setShowApproval(true)}
              disabled={!steps[1].done} // Disable if docs not verified
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 text-sm tracking-wider uppercase"
            >
              Make Decision
            </button>
            <button className="px-8 py-4 bg-[#0b1120] border border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20 text-blue-400 font-black rounded-2xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:-translate-y-1 text-sm tracking-wider uppercase">
              Request Info
            </button>
          </div>
        )}

        {(claim.status === 'Approved' || claim.status === 'Partially Approved') && (
          <div className="relative z-10 pt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-8">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">Approved Amount</p>
              <p className="text-2xl font-black text-emerald-600">₹{claim.approvedAmount.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleSettle}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" /> Process Payment & Settle
            </button>
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
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase">Approve Claim</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-2 block">Approved Amount (₹)</label>
                <input 
                  type="number" 
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none font-black text-slate-900" 
                  required
                />
              </div>
              <button type="submit" className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl">
                Confirm Approval
              </button>
              <button type="button" onClick={() => setShowApproval(false)} className="px-4 py-3.5 bg-slate-100 text-slate-600 font-black rounded-xl">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

const PolicyTab = ({ record }: { record: InsurancePolicyRecord }) => {
  const percentUsed = Math.round((record.usedCoverage / record.coverageAmount) * 100);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
      <div>
        <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">Policy Details</h3>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{record.policyName}</p>
        <p className="text-sm font-bold text-slate-500 mt-1">Policy No: {record.policyNumber} • Valid till {record.policyEndDate}</p>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1">Total Coverage</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">₹{record.coverageAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1">Remaining</p>
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
  const docs = record.currentClaim?.documents || [];
  
  if (docs.length === 0) return <p className="p-6 text-slate-500 font-bold">No documents attached to current claim.</p>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">Document Verification</h3>
      <div className="space-y-3">
        {docs.map(doc => (
          <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : doc.status === 'Missing' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                {doc.status === 'Verified' ? <CheckCircle2 className="w-5 h-5" /> : doc.status === 'Missing' ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{doc.name}</p>
                <p className="text-xs font-bold text-slate-500">Uploaded by {doc.uploadedBy} • {doc.uploadDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 
                doc.status === 'Missing' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {doc.status}
              </span>
              {doc.status === 'Missing' && (
                <button 
                  onClick={() => updateDocumentStatus(record.insuranceId, doc.id, 'Verified')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-xs rounded-lg transition-colors"
                >
                  Mark Verified
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
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">Coverage & Benefits</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(record.benefits).map(([key, val]) => (
          <div key={key} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{key}</span>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 ${
              val === 'Covered' ? 'bg-emerald-50 text-emerald-600' : 
              val === 'Partial' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {val === 'Covered' ? <Check className="w-3 h-3" /> : val === 'Partial' ? <span className="text-[14px] leading-none">◐</span> : <X className="w-3 h-3" />}
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PastClaimsTab = ({ record }: { record: InsurancePolicyRecord }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-6">Past Claim History</h3>
      {record.claims.length === 0 ? (
        <p className="text-slate-500 font-bold">No past claims found.</p>
      ) : (
        <div className="space-y-4">
          {record.claims.map(claim => (
            <div key={claim.claimId} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-black text-slate-900 dark:text-white text-lg">{claim.claimId}</p>
                <p className="text-sm font-bold text-slate-500">{claim.hospital} • {claim.treatment}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{claim.admissionDate} - {claim.dischargeDate}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-bold text-slate-500 line-through">₹{claim.submittedAmount.toLocaleString()}</p>
                <p className="text-xl font-black text-emerald-600 mb-2">₹{claim.approvedAmount.toLocaleString()}</p>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {claim.status}
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
  const events = record.currentClaim?.timeline || [];
  
  if (events.length === 0) return <p className="p-6 text-slate-500 font-bold">No timeline events available.</p>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
      <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-8 text-center">Claim Timeline</h3>
      <div className="relative pl-6 sm:pl-8">
        <div className="absolute left-[31px] sm:left-[39px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
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
                  <h3 className="font-black text-slate-900 dark:text-white">{event.action}</h3>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100">{event.date}</span>
                </div>
                <p className="text-xs font-bold text-slate-500">{event.role} • {event.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

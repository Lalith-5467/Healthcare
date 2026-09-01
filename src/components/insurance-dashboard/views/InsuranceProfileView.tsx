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
        <Search className="w-16 h-16 text-slate-300 mb-4" />
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
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-black text-blue-600 border-2 border-blue-100 dark:border-blue-800/50">
            {record.patientName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{record.patientName}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-500">Insurance ID: {record.insuranceId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Policy
              </span>
            </div>
          </div>
        </div>
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
            className={`px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
    { label: 'Submitted', done: true },
    { label: 'Documents', done: claim.documents.every(d => d.status === 'Verified') },
    { label: 'Verification', done: claim.status !== 'New' },
    { label: 'Medical Review', done: claim.status === 'Approved' || claim.status === 'Partially Approved' || claim.status === 'Settled' },
    { label: 'Decision', done: claim.status === 'Approved' || claim.status === 'Partially Approved' || claim.status === 'Settled' },
    { label: 'Settlement', done: claim.status === 'Settled' }
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 dark:bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{claim.claimId}</h2>
            <div className="flex flex-wrap gap-2 text-sm font-bold text-slate-500">
              <span>{claim.hospital}</span>
              <span>•</span>
              <span>{claim.treatment}</span>
              <span>•</span>
              <span>Submitted: {claim.timeline[0]?.date}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Claim Amount</p>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-500">₹{claim.submittedAmount.toLocaleString()}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-black text-xs uppercase tracking-wider rounded-md">
              {claim.status}
            </span>
          </div>
        </div>

        {/* Workflow Tracker */}
        <div className="relative z-10 mb-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-6">Processing Status</h3>
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-slate-900 transition-colors ${
                  step.done ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {step.done ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>}
                </div>
                <span className={`absolute top-10 text-[10px] font-bold whitespace-nowrap ${
                  step.done ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400'
                }`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Actions */}
        {(claim.status === 'New' || claim.status === 'Under Review') && !showApproval && (
          <div className="relative z-10 pt-12 flex gap-4">
            <button 
              onClick={() => setShowApproval(true)}
              disabled={!steps[1].done} // Disable if docs not verified
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black rounded-xl transition-colors"
            >
              Make Decision
            </button>
            <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl transition-colors">
              Request Information
            </button>
          </div>
        )}

        {(claim.status === 'Approved' || claim.status === 'Partially Approved') && (
          <div className="relative z-10 pt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-8">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Approved Amount</p>
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
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Policy Details</h3>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{record.policyName}</p>
        <p className="text-sm font-bold text-slate-500 mt-1">Policy No: {record.policyNumber} • Valid till {record.policyEndDate}</p>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Total Coverage</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">₹{record.coverageAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Remaining</p>
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
      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-6">Document Verification</h3>
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
      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-6">Coverage & Benefits</h3>
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
      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-6">Past Claim History</h3>
      {record.claims.length === 0 ? (
        <p className="text-slate-500 font-bold">No past claims found.</p>
      ) : (
        <div className="space-y-4">
          {record.claims.map(claim => (
            <div key={claim.claimId} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-black text-slate-900 dark:text-white text-lg">{claim.claimId}</p>
                <p className="text-sm font-bold text-slate-500">{claim.hospital} • {claim.treatment}</p>
                <p className="text-xs font-bold text-slate-400 mt-1">{claim.admissionDate} - {claim.dischargeDate}</p>
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
      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-8 text-center">Claim Timeline</h3>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100">{event.date}</span>
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

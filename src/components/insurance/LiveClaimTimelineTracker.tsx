import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Building2, 
  IndianRupee, 
  Sparkles, 
  Download,
  Lock,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
  Send,
  FileCheck,
  Stethoscope
} from 'lucide-react';
import { useInsuranceWorkflow, type InsuranceTimelineEvent } from '../../utils/insuranceWorkflowStorage';

interface LiveClaimTimelineTrackerProps {
  onOpenNewClaim: () => void;
}

export const LiveClaimTimelineTracker: React.FC<LiveClaimTimelineTrackerProps> = ({ onOpenNewClaim }) => {
  const { records } = useInsuranceWorkflow();
  const primaryRecord = records.find(r => r.insuranceId === 'INS-MC-2026-10245' || r.patientName === 'Ragul Kumar') || records[0];

  const currentClaim = primaryRecord?.currentClaim;
  const recentClaim = !currentClaim ? primaryRecord?.claims[0] : null;
  const activeClaim = currentClaim || recentClaim;

  const [expandedDetails, setExpandedDetails] = useState(true);

  if (!activeClaim) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-[#00a896] flex items-center justify-center mx-auto shadow-inner">
          <Activity className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            No Active Claim Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            You currently do not have any claims under review. Start a new cashless claim with mobile OTP authentication to view real-time tracking.
          </p>
        </div>
        <button
          onClick={onOpenNewClaim}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-teal-500/20 cursor-pointer transition-all hover:scale-105"
        >
          + Start New Claim with OTP Authentication
        </button>
      </div>
    );
  }

  const isApproved = activeClaim.status === 'Approved' || activeClaim.status === 'Settled' || activeClaim.status === 'Partially Approved';
  const isRejected = activeClaim.status === 'Rejected';
  const isUnderReview = activeClaim.status === 'Under Review' || activeClaim.status === 'New';

  // Construct detailed visual timeline nodes
  const timelineNodes = [
    {
      id: 'step-1',
      title: '1. Policyholder OTP Authentication & Submission',
      channel: 'Patient Mobile Gateway (+91 98765 43210)',
      time: activeClaim.timeline[0]?.date ? `${activeClaim.timeline[0].date} • ${activeClaim.timeline[0].time || '09:14 AM'}` : 'Just now',
      status: 'Completed',
      icon: Lock,
      description: 'Identity confirmed with 6-digit cryptographic OTP token. Cashless pre-authorization request dispatched.',
      badgeColor: 'bg-emerald-500 text-white',
      badgeText: 'Verified'
    },
    {
      id: 'step-2',
      title: '2. ABDM Medical Vault & Document Transmission',
      channel: 'ABDM Health Locker & Clearinghouse',
      time: activeClaim.timeline[1]?.date ? `${activeClaim.timeline[1].date} • ${activeClaim.timeline[1].time || '09:15 AM'}` : 'Just now',
      status: 'Completed',
      icon: FileCheck,
      description: `${activeClaim.documents.length} verified documents linked (Hospital Invoices, Doctor Prescriptions & Lab Biometrics).`,
      badgeColor: 'bg-emerald-500 text-white',
      badgeText: 'Transmitted'
    },
    {
      id: 'step-3',
      title: '3. Insurance Medical Officer Audit & Admissibility Check',
      channel: 'Insurance Incharge Medical Desk',
      time: isUnderReview ? 'Currently In Review' : 'Completed',
      status: isUnderReview ? 'In Progress' : 'Completed',
      icon: Stethoscope,
      description: isUnderReview
        ? 'Medical officer evaluating diagnosis, room rent capping, ICU tariffs, and policy exclusion clauses.'
        : 'Medical evaluation complete. All itemized charges verified against policy schedule.',
      badgeColor: isUnderReview ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-500 text-white',
      badgeText: isUnderReview ? 'Auditing' : 'Verified'
    },
    {
      id: 'step-4',
      title: isApproved 
        ? '4. Claim Accepted & Cashless Pre-Auth Approved'
        : isRejected
        ? '4. Claim Declined / Needs Correction'
        : '4. Incharge Final Decision & Cashless Settlement',
      channel: 'Insurance Clearance Gateway',
      time: isUnderReview ? 'Awaiting Incharge Action' : 'Finalized',
      status: isApproved ? 'Approved' : isRejected ? 'Declined' : 'Pending',
      icon: isApproved ? CheckCircle2 : isRejected ? XCircle : Clock,
      description: isApproved
        ? `Cashless authorization granted for ₹${(activeClaim.approvedAmount || activeClaim.submittedAmount).toLocaleString('en-IN')}. Clearance code: AUTH-84920-APOLLO dispatched directly to hospital desk.`
        : isRejected
        ? 'Claim declined: Missing itemized hospital pharmacy breakdown. Tap "Re-upload & Appeal" below to submit additional documents.'
        : 'Waiting for insurance officer decision on the portal.',
      badgeColor: isApproved ? 'bg-emerald-600 text-white' : isRejected ? 'bg-rose-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500',
      badgeText: isApproved ? 'Accepted' : isRejected ? 'Declined' : 'In Queue'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden font-sans select-none mb-6"
    >
      {/* 1. TOP LIVE BEACON BAR */}
      <div className={`p-5 sm:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isApproved 
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-200 dark:border-emerald-900/50'
          : isRejected
          ? 'bg-gradient-to-r from-rose-500/10 via-slate-50 to-transparent border-rose-200 dark:border-rose-900/50'
          : 'bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-transparent border-amber-200 dark:border-amber-900/50'
      }`}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isApproved
                ? 'bg-emerald-600 text-white shadow-xs'
                : isRejected
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-amber-500 text-white shadow-xs'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Live Claim Tracking Timeline
            </span>

            <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
              {activeClaim.claimId}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {primaryRecord.patientName} (ID: {primaryRecord.insuranceId})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeClaim.hospital}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {activeClaim.treatment} • Policy: <strong className="font-mono text-slate-800 dark:text-slate-200">{primaryRecord.policyNumber}</strong>
          </p>
        </div>

        {/* DECISION BADGE & FAST NEW CLAIM */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Live Status</p>
            <div className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 shadow-sm border ${
              isApproved
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : isRejected
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
            }`}>
              {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isRejected && <XCircle className="w-4 h-4 text-rose-600" />}
              {isUnderReview && <Clock className="w-4 h-4 text-amber-600" />}
              <span>{isApproved ? 'Claim Accepted / Approved' : isRejected ? 'Claim Declined' : 'Under Review'}</span>
            </div>
          </div>

          <button
            onClick={onOpenNewClaim}
            className="px-4 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5 shrink-0 hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Claim</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Claimed Amount</span>
          <strong className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
            ₹{activeClaim.submittedAmount.toLocaleString('en-IN')}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Approved Cashless Amount</span>
          <strong className={`text-base font-black mt-0.5 block ${isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {isApproved ? `₹${(activeClaim.approvedAmount || activeClaim.submittedAmount).toLocaleString('en-IN')}` : 'Evaluating Tariffs'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Patient Co-Pay</span>
          <strong className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
            ₹{activeClaim.patientContribution ? activeClaim.patientContribution.toLocaleString('en-IN') : '0 (100% Cashless)'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Security Verification</span>
          <span className="text-xs font-bold text-teal-600 dark:text-cyan-400 mt-0.5 flex items-center gap-1 font-mono">
            <Lock className="w-3.5 h-3.5" /> OTP Authenticated
          </span>
        </div>
      </div>

      {/* 3. VERTICAL INTERACTIVE TIMELINE */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Interactive Live Tracking Stepper</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time Gateway Sync Active
          </span>
        </div>

        {/* TIMELINE LIST */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[17px] sm:before:left-[21px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {timelineNodes.map((node, i) => {
            const Icon = node.icon;
            const isCompleted = node.status === 'Completed' || node.status === 'Approved';
            const isCurrent = node.status === 'In Progress';
            const isFailed = node.status === 'Declined';

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative group"
              >
                {/* TIMELINE NODE ICON PIN */}
                <div className={`absolute -left-[27px] sm:-left-[33px] top-0 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isFailed
                    ? 'bg-rose-500 text-white'
                    : isCurrent
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* CONTENT CARD */}
                <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60 shadow-md'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80'
                    : isFailed
                    ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 shadow-md'
                    : 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/40 opacity-70'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{node.title}</span>
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${node.badgeColor}`}>
                        {node.badgeText}
                      </span>
                      <span className="text-slate-400 font-bold">{node.time}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {node.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-bold font-mono">
                      Channel: <strong className="text-slate-700 dark:text-slate-300">{node.channel}</strong>
                    </span>

                    {node.id === 'step-4' && isApproved && (
                      <button
                        onClick={() => alert(`Cashless Approval Letter generated for ${activeClaim.claimId}. Direct billing confirmed.`)}
                        className="text-emerald-600 dark:text-emerald-400 font-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Clearance PDF
                      </button>
                    )}

                    {node.id === 'step-4' && isRejected && (
                      <button
                        onClick={onOpenNewClaim}
                        className="text-rose-600 dark:text-rose-400 font-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Re-upload & Appeal
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 4. FINAL ACTION ACCORDION */}
        {isApproved && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Pre-authorization settled directly with <strong>{activeClaim.hospital}</strong>. No out-of-pocket payment required.
              </span>
            </div>
            <button
              onClick={() => alert(`Direct cashless voucher token: AUTH-84920-APOLLO active at hospital discharge desk.`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-xs cursor-pointer shrink-0"
            >
              View Voucher Token
            </button>
          </div>
        )}

        {isRejected && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-200 font-bold">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                Insurance incharge noted: <strong>Missing itemized hospital pharmacy breakdown</strong>.
              </span>
            </div>
            <button
              onClick={onOpenNewClaim}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-xs cursor-pointer shrink-0"
            >
              Submit Missing Documents
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

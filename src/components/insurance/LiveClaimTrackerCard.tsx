import React from 'react';
import { motion } from 'framer-motion';
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
  ArrowUpRight, 
  RefreshCw,
  Lock,
  Download
} from 'lucide-react';
import { useInsuranceWorkflow } from '../../utils/insuranceWorkflowStorage';

interface LiveClaimTrackerCardProps {
  onOpenNewClaim: () => void;
}

export const LiveClaimTrackerCard: React.FC<LiveClaimTrackerCardProps> = ({ onOpenNewClaim }) => {
  const { records } = useInsuranceWorkflow();
  const primaryRecord = records.find(r => r.insuranceId === 'INS-MC-2026-10245' || r.patientName === 'Ragul Kumar') || records[0];

  const currentClaim = primaryRecord?.currentClaim;
  const recentClaim = !currentClaim ? primaryRecord?.claims[0] : null;
  const activeClaim = currentClaim || recentClaim;

  if (!activeClaim) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-[#00a896] flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900 dark:text-white">
          No Active Insurance Claims
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          You currently have no claims in review. You can initiate a cashless pre-authorization or reimbursement claim with OTP verification anytime.
        </p>
        <button
          onClick={onOpenNewClaim}
          className="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs shadow-md cursor-pointer transition-all"
        >
          Start New Claim with OTP Auth
        </button>
      </div>
    );
  }

  const isApproved = activeClaim.status === 'Approved' || activeClaim.status === 'Settled' || activeClaim.status === 'Partially Approved';
  const isRejected = activeClaim.status === 'Rejected';
  const isUnderReview = activeClaim.status === 'Under Review' || activeClaim.status === 'New';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden font-sans ${
        isApproved
          ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:to-slate-900 border-emerald-300 dark:border-emerald-800/60'
          : isRejected
          ? 'bg-gradient-to-br from-rose-500/10 via-slate-50 to-white dark:to-slate-900 border-rose-300 dark:border-rose-800/60'
          : 'bg-gradient-to-br from-amber-500/10 via-cyan-500/5 to-white dark:to-slate-900 border-amber-300 dark:border-amber-800/60'
      }`}
    >
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-black uppercase tracking-wider">
              <span className={`w-2 h-2 rounded-full ${isUnderReview ? 'bg-amber-400 animate-ping' : isApproved ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              Live Claim Tracker
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Claim ID: <strong className="text-slate-900 dark:text-white font-black">{activeClaim.claimId}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {activeClaim.hospital}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            {activeClaim.treatment} • Patient: <strong className="text-slate-800 dark:text-slate-200">{primaryRecord.patientName}</strong> (ID: {primaryRecord.insuranceId})
          </p>
        </div>

        {/* STATUS BADGE & ACTION */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Decision Status</p>
            <div className="inline-flex items-center gap-2 font-black text-xs uppercase shadow-sm">
              {isApproved ? (
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Claim Accepted / Approved</span>
                </span>
              ) : isRejected ? (
                <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-rose-300 dark:border-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Claim Declined / Rejected</span>
                </span>
              ) : (
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-300 dark:border-amber-800 animate-pulse">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Under Insurance Review</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onOpenNewClaim}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400 dark:text-teal-600" />
            <span>+ New Claim</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL BREAKDOWN TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 relative z-10 text-xs">
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Claimed Amount</span>
          <strong className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
            ₹{activeClaim.submittedAmount.toLocaleString('en-IN')}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Approved Amount</span>
          <strong className={`text-base font-black mt-0.5 block ${isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {isApproved ? `₹${(activeClaim.approvedAmount || activeClaim.submittedAmount).toLocaleString('en-IN')}` : 'Pending Evaluation'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Patient Co-Pay</span>
          <strong className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
            ₹{activeClaim.patientContribution ? activeClaim.patientContribution.toLocaleString('en-IN') : '0 (100% Cashless)'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Auth Security</span>
          <span className="text-xs font-bold text-teal-600 dark:text-cyan-400 mt-0.5 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> OTP Verified
          </span>
        </div>
      </div>

      {/* LIVE INTERACTIVE TIMELINE PROGRESSION */}
      <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm relative z-10 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Real-Time Processing Stages</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">1. OTP Auth & Submission</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Mobile OTP confirmed, claim dispatched.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">2. Medical Vault Sync</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Bills & Prescription verified.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isUnderReview 
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' 
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
              isUnderReview ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-500 text-white'
            }`}>
              {isUnderReview ? '⏳' : '✓'}
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">3. Medical Officer Review</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {isUnderReview ? 'Evaluating policy coverage & room rent.' : 'Admissibility review complete.'}
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isApproved 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
              : isRejected
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
              isApproved ? 'bg-emerald-500 text-white' : isRejected ? 'bg-rose-500 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              {isApproved ? '✓' : isRejected ? '✕' : '4'}
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">
                {isApproved ? '4. Claim Accepted' : isRejected ? '4. Claim Declined' : '4. Incharge Decision'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {isApproved ? 'Cashless token dispatched to hospital.' : isRejected ? 'See reason below to appeal.' : 'Awaiting final signoff.'}
              </p>
            </div>
          </div>
        </div>

        {/* DECISION SUMMARY BANNER */}
        {isApproved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cashless Pre-Auth Approved. Direct hospital billing clearance code: <strong>AUTH-84920-APOLLO</strong>.</span>
            </div>
            <button
              onClick={() => alert(`Cashless Approval Letter generated for ${activeClaim.claimId}. Direct billing confirmed.`)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Letter
            </button>
          </div>
        )}

        {isRejected && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Decline Reason: Missing itemized pharmacy bill. You can attach the missing invoice and request re-review.</span>
            </div>
            <button
              onClick={onOpenNewClaim}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] shrink-0"
            >
              Re-upload & Appeal
            </button>
          </div>
        )}
      </div>

    </motion.div>
  );
};

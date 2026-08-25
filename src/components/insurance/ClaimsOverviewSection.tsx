import React from 'react';
import { Plus, Eye } from 'lucide-react';
import type { InsuranceClaim } from './insuranceData';

interface ClaimsOverviewSectionProps {
  claims: InsuranceClaim[];
  onOpenNewClaim: () => void;
  onOpenClaimDetails: (claim: InsuranceClaim) => void;
}

export const ClaimsOverviewSection: React.FC<ClaimsOverviewSectionProps> = ({
  claims,
  onOpenNewClaim,
  onOpenClaimDetails,
}) => {
  const totalClaims = claims.length;
  const approvedClaims = claims.filter((c) => c.status === 'Approved').length;
  const pendingClaims = claims.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length;
  const rejectedClaims = claims.filter((c) => c.status === 'Rejected').length;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      {/* HEADER & NEW CLAIM TRIGGER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Insurance Claims</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Track and submit claims for medical reimbursement</p>
        </div>

        <button
          onClick={onOpenNewClaim}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Claim</span>
        </button>
      </div>

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-sans">Total Claims</span>
          <strong className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalClaims}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-sans">Approved Claims</span>
          <strong className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{approvedClaims}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-sans">Pending Review</span>
          <strong className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">{pendingClaims}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-sans">Rejected</span>
          <strong className="text-2xl font-extrabold text-rose-700 dark:text-rose-400">{rejectedClaims}</strong>
        </div>
      </div>

      {/* CLAIMS TABLE / LIST */}
      <div className="space-y-3">
        {claims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => onOpenClaimDetails(claim)}
            className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#00a896]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group shadow-sm text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#00a896] dark:text-cyan-300 font-extrabold">{claim.claimNumber}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] font-mono border ${
                  claim.status === 'Approved'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : claim.status === 'Pending' || claim.status === 'Under Review'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                }`}>
                  {claim.status}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                {claim.hospitalName}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                {claim.treatmentType} • Submitted: {claim.submittedDate}
              </p>
            </div>

            <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 font-mono">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-sans font-bold">Claimed Amount</span>
                <strong className="text-slate-900 dark:text-white text-sm">₹{claim.claimedAmount.toLocaleString()}</strong>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenClaimDetails(claim);
                }}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="View Claim Details"
              >
                <Eye className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

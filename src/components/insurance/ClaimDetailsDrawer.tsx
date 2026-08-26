import React from 'react';
import { X, FileText, Download } from 'lucide-react';
import type { InsuranceClaim } from './insuranceData';

interface ClaimDetailsDrawerProps {
  claim: InsuranceClaim | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimDetailsDrawer: React.FC<ClaimDetailsDrawerProps> = ({
  claim,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Claim Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">{claim.claimNumber}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 py-4 flex-1 overflow-y-auto text-xs">
          {/* CLAIM SUMMARY CARD */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Hospital:</span>
              <strong className="text-slate-900 dark:text-white font-sans">{claim.hospitalName}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-500 font-sans">Treatment:</span>
              <strong className="text-teal-700 dark:text-cyan-300 font-sans">{claim.treatmentType}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-500 font-sans">Submitted:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-sans">{claim.submittedDate}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-500 font-sans">Claimed Amount:</span>
              <strong className="text-amber-700 dark:text-amber-300">₹{claim.claimedAmount.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-500 font-sans">Approved Amount:</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">₹{claim.approvedAmount.toLocaleString()}</strong>
            </div>
          </div>

          {/* CLAIM STATUS TIMELINE */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Processing Timeline
            </h4>
            <div className="space-y-2.5 font-mono text-[11px]">
              {claim.timeline.map((step, idx) => (
                <div key={step.stage} className="flex items-center gap-3 relative">
                  {idx < claim.timeline.length - 1 && (
                    <div className={`absolute left-3.5 top-6 w-0.5 h-6 ${
                      step.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`} />
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    step.completed
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : step.active
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-sans">{step.stage}</span>
                    <span className="text-[10px] text-slate-500">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMITTED DOCUMENTS */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Attached Documents
            </h4>
            <div className="space-y-2 font-mono text-[11px]">
              {claim.documentsAttached.map((doc) => (
                <div key={doc} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="truncate max-w-[200px]">{doc}</span>
                  <button className="text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer font-bold">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer text-center"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

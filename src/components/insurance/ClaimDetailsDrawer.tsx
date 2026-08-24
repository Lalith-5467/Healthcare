import React from 'react';
import { X, FileText, CheckCircle2, Clock, Check, Building2, ShieldCheck, Download } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Claim Details</h3>
              <p className="text-xs text-slate-400">{claim.claimNumber}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-4 flex-1 overflow-y-auto text-xs">
          {/* CLAIM SUMMARY CARD */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between"><span className="text-slate-400">Hospital:</span><strong className="text-white font-sans">{claim.hospitalName}</strong></div>
            <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Treatment Type:</span><strong className="text-cyan-300">{claim.treatmentType}</strong></div>
            <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Submitted Date:</span><strong className="text-slate-200">{claim.submittedDate}</strong></div>
            <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Claimed Amount:</span><strong className="text-amber-300">₹{claim.claimedAmount.toLocaleString()}</strong></div>
            <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Approved Amount:</span><strong className="text-emerald-400 font-extrabold">₹{claim.approvedAmount.toLocaleString()}</strong></div>
          </div>

          {/* ANIMATED CLAIM STATUS TIMELINE */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Claim Processing Timeline</h4>
            <div className="space-y-3 font-mono text-[11px]">
              {claim.timeline.map((step, idx) => (
                <div key={step.stage} className="flex items-center gap-3 relative">
                  {idx < claim.timeline.length - 1 && (
                    <div className={`absolute left-3.5 top-6 w-0.5 h-6 ${
                      step.completed ? 'bg-emerald-500' : 'bg-slate-800'
                    }`} />
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    step.completed
                      ? 'bg-emerald-500 text-slate-950'
                      : step.active
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-slate-200">{step.stage}</span>
                    <span className="text-[10px] text-slate-400">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMITTED DOCUMENTS */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Attached Documents</h4>
            <div className="space-y-2 font-mono text-[11px]">
              {claim.documentsAttached.map((doc) => (
                <div key={doc} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-slate-300">
                  <span className="truncate max-w-[200px]">{doc}</span>
                  <button className="text-teal-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md cursor-pointer text-center"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

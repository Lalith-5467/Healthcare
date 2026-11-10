import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  Building2, 
  QrCode, 
  Receipt,
  CreditCard,
  Lock,
  ArrowRight
} from 'lucide-react';
import type { InsurancePolicyRecord, InsuranceClaim } from '../../utils/insuranceWorkflowStorage';

interface ClaimSettlementReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: InsurancePolicyRecord;
  claim: InsuranceClaim;
}

export const ClaimSettlementReceiptModal: React.FC<ClaimSettlementReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
  claim
}) => {
  if (!isOpen) return null;

  const txnId = claim.settlementTxnId || `TXN-IRDAI-${claim.claimId.replace(/\D/g, '') || '984210'}`;
  const settleDate = claim.settlementDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const paidAmt = claim.approvedAmount || claim.submittedAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
      ===============================================================
      IRDAI DIRECT HOSPITAL SETTLEMENT & NO-DUES CLEARANCE VOUCHER
      Clearinghouse Settlement Reference: ${txnId}
      ===============================================================
      Settlement Date: ${settleDate}
      Hospital Beneficiary: ${claim.hospital}
      Patient Name: ${record.patientName} (Card ID: ${record.insuranceId})
      Policy Number: ${record.policyNumber}
      Treatment: ${claim.treatment}
      
      FINANCIAL DISBURSEMENT:
      - Submitted Hospital Invoices: INR ${claim.submittedAmount.toLocaleString('en-IN')}
      - Approved Cashless Settlement: INR ${paidAmt.toLocaleString('en-IN')}
      - Direct Payout Disbursed: INR ${paidAmt.toLocaleString('en-IN')}
      - Patient Out-of-Pocket Balance: INR 0 (ZERO DUES)
      
      DISCHARGE CLEARANCE:
      Hospital account has been credited in full via IRDAI Real-time Clearinghouse.
      Patient discharge is cleared with ZERO outstanding liabilities.
      Authorized Clearing Agent: IRDAI Digital Claims Bureau
      ===============================================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Settlement_Voucher_${claim.claimId}_${txnId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* TOP BAR ACTIONS */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct Payout Settled
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                Txn Ref: <strong>{txnId}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Download Receipt"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* VOUCHER CARD */}
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900/50 space-y-6 text-xs text-slate-700 dark:text-slate-300 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 dark:border-emerald-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  <Receipt className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    HOSPITAL DIRECT SETTLEMENT VOUCHER
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Electronic Funds Transfer • IRDAI TPA Clearinghouse 2.0
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-[11px]">
                <p className="font-bold text-slate-500">Claim ID: <strong className="text-slate-900 dark:text-white font-black">{claim.claimId}</strong></p>
                <p className="text-slate-500">Settled On: <strong className="text-slate-900 dark:text-white">{settleDate}</strong></p>
              </div>
            </div>

            {/* Beneficiary & Patient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hospital Beneficiary:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{claim.hospital}</p>
                <p className="text-[11px] font-mono text-slate-500">A/C: ICICI Clearing Gateway • RTGS Settled</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Patient & Policy:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{record.patientName}</p>
                <p className="text-[11px] font-mono text-slate-500">
                  Card ID: {record.insuranceId} • Policy: {record.policyNumber}
                </p>
              </div>
            </div>

            {/* Payout Banner */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Settled Amount Disbursed</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{paidAmt.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">100% Cashless Payout Direct to Hospital</p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  NO DUES PENDING
                </span>
              </div>
            </div>

            {/* Zero Liability Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Official Discharge Clearance & Zero Patient Liability Certificate:
              </p>
              <p className="text-slate-500 leading-relaxed">
                The full itemized hospital bill for treatment of <strong>{claim.treatment}</strong> has been cleared. The policyholder ({record.patientName}) carries zero financial liability for this admission episode.
              </p>
            </div>

            {/* Policy Impact Summary */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center pt-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-sans block uppercase">Total Cover</span>
                <strong className="text-xs font-black text-slate-900 dark:text-white">₹{record.coverageAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-sans block uppercase">Claim Paid</span>
                <strong className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{paidAmt.toLocaleString('en-IN')}</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-sans block uppercase">Remaining Limit</span>
                <strong className="text-xs font-black text-blue-600 dark:text-cyan-400">₹{record.remainingCoverage.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Signoff */}
            <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                <span className="font-mono text-slate-500">Txn Verification Token: {txnId}</span>
              </div>
              <span className="font-bold text-slate-600 dark:text-slate-400">IRDAI Central Clearing Desk • Authorized</span>
            </div>

          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Tamper-evident digital disbursement voucher
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Receipt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

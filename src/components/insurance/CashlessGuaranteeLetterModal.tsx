import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  QrCode, 
  FileText,
  Calendar,
  Lock,
  Stamp
} from 'lucide-react';
import type { InsurancePolicyRecord, InsuranceClaim } from '../../utils/insuranceWorkflowStorage';

interface CashlessGuaranteeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: InsurancePolicyRecord;
  claim: InsuranceClaim;
}

export const CashlessGuaranteeLetterModal: React.FC<CashlessGuaranteeLetterModalProps> = ({
  isOpen,
  onClose,
  record,
  claim
}) => {
  if (!isOpen) return null;

  const authCode = claim.preAuthCode || `AUTH-84920-${claim.hospital.split(' ')[0].toUpperCase()}`;
  const approvedAmt = claim.approvedAmount || claim.submittedAmount;
  const issueDate = claim.timeline.find(t => t.action.toLowerCase().includes('approved') || t.action.toLowerCase().includes('accepted'))?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/html printable export
    const content = `
      ===============================================================
      IRDAI TPA CASHLESS PRE-AUTHORIZATION GUARANTEE LETTER
      Registration: TPA-019/HLT | Encrypted Token: ${authCode}
      ===============================================================
      Date: ${issueDate}
      Hospital: ${claim.hospital}
      Patient: ${record.patientName} (Card ID: ${record.insuranceId})
      Policy Number: ${record.policyNumber} (${record.policyName})
      ABDM ID: ${record.patientId}
      
      AUTHORIZATION DETAILS:
      - Claim Number: ${claim.claimId}
      - Authorized Treatment: ${claim.treatment}
      - Cashless Approved Amount: INR ${approvedAmt.toLocaleString('en-IN')}
      - Patient Co-Pay: INR ${claim.patientContribution.toLocaleString('en-IN')}
      - Clearance Status: CASHLESS GUARANTEE APPROVED
      
      TERMS:
      Hospital is instructed to provide cashless in-patient treatment. 
      Settlement will be disbursed directly by IRDAI TPA Clearinghouse.
      Authorized Signature: Dr. Shreya Menon, Chief Medical Officer
      ===============================================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cashless_PreAuth_${claim.claimId}_${authCode}.txt`;
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
                <CheckCircle2 className="w-3.5 h-3.5" /> Official IRDAI Clearance
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                Token: <strong>{authCode}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Download Document"
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

          {/* LETTERHEAD CONTAINER (PRINTABLE LOOK) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 space-y-6 text-xs text-slate-700 dark:text-slate-300 relative overflow-hidden">
            
            {/* Watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-slate-900 dark:text-white font-black text-7xl rotate-[-25deg]">
              CASHLESS
            </div>

            {/* Letterhead Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    IRDAI TPA CLEARINGHOUSE
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Reg No: TPA-019/HLT • Central Cashless Pre-Authorization Bureau
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-[11px]">
                <p className="font-bold text-slate-500">Ref: <strong className="text-slate-900 dark:text-white font-black">{claim.claimId}</strong></p>
                <p className="text-slate-500">Date: <strong className="text-slate-900 dark:text-white">{issueDate}</strong></p>
              </div>
            </div>

            {/* To Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">To Hospital Billing Desk:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{claim.hospital}</p>
                <p className="text-[11px] text-slate-500">In-Patient TPA Admissions Department</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Policyholder / Patient:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{record.patientName}</p>
                <p className="text-[11px] font-mono text-slate-500">
                  Card ID: <strong className="text-blue-600 dark:text-cyan-400">{record.insuranceId}</strong> • ABHA: {record.patientId}
                </p>
              </div>
            </div>

            {/* Subject */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 font-bold text-xs">
              <strong>SUBJECT:</strong> CASHLESS PRE-AUTHORIZATION GUARANTEE CLEARANCE FOR IN-PATIENT ADMISSION
            </div>

            {/* Authorization Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Claimed Amt</span>
                <strong className="text-sm font-black text-slate-900 dark:text-white">
                  ₹{claim.submittedAmount.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Approved Cashless</span>
                <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  ₹{approvedAmt.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Patient Co-Pay</span>
                <strong className="text-sm font-black text-slate-900 dark:text-white">
                  ₹{claim.patientContribution.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Clearance Code</span>
                <strong className="text-xs font-black text-blue-600 dark:text-cyan-400 font-mono">
                  {authCode}
                </strong>
              </div>
            </div>

            {/* Directives */}
            <div className="space-y-2 text-[11px] leading-relaxed">
              <p>
                1. <strong>Direct Billing Guarantee:</strong> This letter guarantees cashless coverage for the authorized in-patient care procedure: <strong>{claim.treatment}</strong>.
              </p>
              <p>
                2. <strong>Zero Out-of-Pocket Collection:</strong> The hospital billing desk is instructed NOT to collect deposits or charges within the pre-authorized limit of <strong>₹{approvedAmt.toLocaleString('en-IN')}</strong>.
              </p>
              <p>
                3. <strong>Discharge Settlement:</strong> Upon medical discharge, transmit the final itemized billing file via the ABDM Clearinghouse for direct electronic disbursement.
              </p>
            </div>

            {/* Digital Signoff & QR Stamp */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-800 dark:text-slate-200" />
                </div>
                <div className="text-[10px]">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Scan to verify cryptographic authenticity</p>
                  <p className="font-mono text-slate-400">AES-256 HMAC-SHA • IRDAI Node #9401</p>
                </div>
              </div>

              <div className="text-left sm:text-right font-sans">
                <div className="inline-block border-b-2 border-slate-400 pb-0.5 mb-1 font-serif italic text-sm text-slate-800 dark:text-slate-200 font-bold">
                  Dr. Shreya Menon
                </div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Chief Medical Underwriter</p>
                <p className="text-[9px] text-slate-500 font-mono">TPA Medical Board • IRDAI Authorized Signatory</p>
              </div>
            </div>

          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-600" /> Certified legal cashless guarantee under IRDAI guidelines
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Letter
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

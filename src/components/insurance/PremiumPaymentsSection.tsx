import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Download, X } from 'lucide-react';
import type { PremiumPaymentRecord } from './insuranceData';

interface PremiumPaymentsSectionProps {
  payments: PremiumPaymentRecord[];
  onPayNextPremium: () => void;
}

export const PremiumPaymentsSection: React.FC<PremiumPaymentsSectionProps> = ({
  payments,
  onPayNextPremium,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<PremiumPaymentRecord | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Premium Payment History</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Monthly policy premium receipts and payment status</p>
        </div>

        <button
          onClick={onPayNextPremium}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay Next Premium (₹2,450)</span>
        </button>
      </div>

      {/* PAYMENT LOG GRID */}
      <div className="space-y-3 font-mono text-xs">
        {payments.map((pay) => (
          <div key={pay.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white font-sans text-sm">{pay.monthYear} Premium</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Paid on {pay.paymentDate} • {pay.receiptNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">₹{pay.amount.toLocaleString()}</span>
              <button
                onClick={() => setSelectedReceipt(pay)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#00a896] dark:text-cyan-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Receipt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Premium Receipt ({selectedReceipt.monthYear})</h4>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono space-y-2">
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Receipt No:</span><strong className="text-slate-900 dark:text-white">{selectedReceipt.receiptNumber}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Paid Amount:</span><strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">₹{selectedReceipt.amount}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Payment Date:</span><strong className="text-slate-900 dark:text-white">{selectedReceipt.paymentDate}</strong></div>
            </div>
            <button onClick={() => setSelectedReceipt(null)} className="w-full py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold cursor-pointer text-center shadow-md">Close Receipt</button>
          </div>
        </div>
      )}
    </div>
  );
};

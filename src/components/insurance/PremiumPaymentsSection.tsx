import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Download, Sparkles, Check, X } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-white">Premium Payment History</h3>
          <p className="text-xs text-slate-400">Monthly policy premium receipts and payment status</p>
        </div>

        <button
          onClick={onPayNextPremium}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay Next Premium (₹2,450)</span>
        </button>
      </div>

      {/* PAYMENT LOG GRID */}
      <div className="space-y-3 font-mono text-xs">
        {payments.map((pay) => (
          <div key={pay.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white font-sans text-sm">{pay.monthYear} Premium</h4>
                <p className="text-[10px] text-slate-400">Paid on {pay.paymentDate} • {pay.receiptNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-extrabold text-white text-sm">₹{pay.amount.toLocaleString()}</span>
              <button
                onClick={() => setSelectedReceipt(pay)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 hover:bg-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Payment Receipt</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-slate-400">Receipt No:</span><strong className="text-cyan-300">{selectedReceipt.receiptNumber}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Month:</span><strong className="text-white">{selectedReceipt.monthYear}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Amount Paid:</span><strong className="text-emerald-400">₹{selectedReceipt.amount}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span><strong className="text-emerald-300">Paid (Verified)</strong></div>
            </div>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold cursor-pointer text-center"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

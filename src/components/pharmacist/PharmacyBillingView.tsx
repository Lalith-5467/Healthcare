import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  IndianRupee, 
  Printer, 
  Download, 
  Search, 
  CheckCircle2, 
  CreditCard,
  Building2,
  Calendar,
  Percent
} from 'lucide-react';

export const PharmacyBillingView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const INVOICES = [
    {
      invoiceNo: 'INV-AP-2026-4821',
      date: '01 Sep 2026',
      customer: 'Abinesh Kumar',
      abhaId: '91-8842-5921',
      itemsCount: 4,
      subtotal: 1450,
      gstAmount: 174,
      totalAmount: 1624,
      paymentMode: 'Cashless Insurance Co-Pay',
      status: 'Paid & Settled'
    },
    {
      invoiceNo: 'INV-AP-2026-4820',
      date: '01 Sep 2026',
      customer: 'Ragul Kumar',
      abhaId: '91-4829-1102',
      itemsCount: 2,
      subtotal: 780,
      gstAmount: 93.6,
      totalAmount: 873.6,
      paymentMode: 'UPI / QR Scan',
      status: 'Paid & Settled'
    },
    {
      invoiceNo: 'INV-AP-2026-4819',
      date: '31 Aug 2026',
      customer: 'Mrs. Meenakshi S.',
      abhaId: '91-7719-3382',
      itemsCount: 6,
      subtotal: 2850,
      gstAmount: 342,
      totalAmount: 3192,
      paymentMode: 'ABHA Linked Credit',
      status: 'Paid & Settled'
    }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/50 to-white dark:from-slate-900 dark:via-emerald-950/60 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-500/20 dark:border-emerald-400/30 font-mono">
            <Receipt className="w-3.5 h-3.5" /> GST & Cashless Dispensary Billing
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Pharmacy Billing & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium max-w-2xl">
            Automated e-invoice generator with GST tax breakdowns, insurance co-pay settlement, and instant thermal receipt printing.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102">
            <Receipt className="w-4 h-4" />
            <span>Generate New Counter Bill</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Today\'s Counter Sales', value: '₹28,450', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'GST Collected (12%)', value: '₹3,414', icon: Percent, color: 'text-teal-500', bg: 'bg-teal-500/10' },
          { label: 'Insurance Co-Pay Cleared', value: '₹18,200', icon: CreditCard, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Total Invoices Issued', value: '42 Bills', icon: Receipt, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">{s.label}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* INVOICE STREAM TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-500" />
            Customer Dispensing Invoices
          </h3>
          <span className="text-xs text-slate-400 font-mono">100% ABDM Linked</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {INVOICES.map((inv) => (
            <div key={inv.invoiceNo} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                    {inv.invoiceNo}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{inv.customer}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {inv.itemsCount} Items • Paid via <strong className="text-slate-900 dark:text-white">{inv.paymentMode}</strong> • {inv.date}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">GST Included</p>
                </div>

                <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer" title="Print Invoice">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

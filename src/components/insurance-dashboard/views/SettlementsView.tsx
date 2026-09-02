import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, IndianRupee, ArrowUpRight, Building2, Calendar, FileText, Download } from 'lucide-react';
import { useInsuranceWorkflow } from '../../../utils/insuranceWorkflowStorage';

export const SettlementsView: React.FC = () => {
  const { records } = useInsuranceWorkflow();
  const allSettled = records.flatMap(r => r.claims.filter(c => c.status === 'Approved' || c.status === 'Settled').map(c => ({
    ...c,
    patientName: r.patientName,
    policyName: r.policyName,
    insuranceId: r.insuranceId
  })));

  const totalPayout = allSettled.reduce((acc, c) => acc + (c.approvedAmount || 0), 0);

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <CreditCard className="w-3.5 h-3.5" /> Payouts & Disbursals
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Claims Settlements & Hospital Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Direct clearinghouse fund transfers, NEFT hospital clearances, and cashless vouchers.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm">
          <IndianRupee className="w-4 h-4" />
          <span>Total Disbursed: ₹{(totalPayout).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* SETTLEMENTS LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Direct Bank Disbursals ({allSettled.length})
          </h3>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% NEFT Reconciled</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {allSettled.map((s, i) => (
            <motion.div
              key={s.claimId || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{s.claimId}</h4>
                    <span className="text-[10px] font-mono font-bold text-slate-400">({s.insuranceId})</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono">
                      Settled
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Payee: <strong className="text-slate-800 dark:text-slate-200">{s.hospital}</strong> • Beneficiary: {s.patientName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Treatment: {s.treatment}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between sm:justify-end">
                <div className="text-right font-mono text-xs">
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400 leading-none">
                    ₹{(s.approvedAmount || s.submittedAmount).toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">UTR: NEFT-{Math.floor(10000000 + Math.random() * 90000000)}</span>
                </div>

                <button
                  onClick={() => alert(`Clearinghouse Remittance Advice Voucher downloaded for Claim ${s.claimId}.`)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  title="Download Remittance Advice"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

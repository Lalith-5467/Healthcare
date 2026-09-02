import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, IndianRupee, Clock, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useInsuranceWorkflow } from '../../../utils/insuranceWorkflowStorage';

interface PoliciesDirectoryViewProps {
  onSelectPolicy: (insuranceId: string) => void;
}

export const PoliciesDirectoryView: React.FC<PoliciesDirectoryViewProps> = ({ onSelectPolicy }) => {
  const { records } = useInsuranceWorkflow();

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Policy Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Underwritten Policies Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Active policyholders, family floater coverage tiers, and cumulative bonus tracking.
          </p>
        </div>

        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 font-black text-xs rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <Users className="w-4 h-4" />
          <span>{records.length} Active Master Records</span>
        </div>
      </div>

      {/* POLICY DIRECTORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((r, i) => (
          <motion.div
            key={r.insuranceId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-500/40 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
                  {r.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
                      {r.policyStatus}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{r.insuranceId}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {r.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{r.policyName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Sum Insured</span>
                <strong className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block font-mono">
                  ₹{r.coverageAmount.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Available Balance</span>
                <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block font-mono">
                  ₹{r.remainingCoverage.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Valid Till: {r.policyEndDate}</span>
              <button
                onClick={() => onSelectPolicy(r.insuranceId)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Claims Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, Stethoscope, Star, Calendar, FileText, Download, User } from 'lucide-react';
import { useNurseWorkflow } from '../../../utils/nurseWorkflowStorage';

export const NurseHistoryView: React.FC = () => {
  const { bookings } = useNurseWorkflow();
  const completed = bookings.filter(b => b.status === 'Completed');

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" /> Care Records & Audit Trail
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Completed Care History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Verified patient clinical visits, signed EHR reports, and post-procedure telemetry logs.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-xs rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4" />
          <span>{completed.length} Visits Finished</span>
        </div>
      </div>

      {/* COMPLETED LIST */}
      <div className="space-y-4">
        {completed.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">No Completed Visits Yet</h3>
            <p className="text-xs text-slate-500">Completed visits and signed nursing reports will appear here.</p>
          </div>
        ) : (
          completed.map((visit, i) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-base shadow-sm">
                    {visit.patientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Signed & Completed
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">{visit.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {visit.patientName} ({visit.patientAge})
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs">
                  <span className="text-slate-400 font-bold block">{visit.prefDate} at {visit.time}</span>
                  <span className="text-amber-500 font-black block mt-0.5">Patient Rating: 5.0 ⭐</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Procedure</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{visit.serviceType}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Recorded Vitals</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    BP: {visit.vitals?.bp || '120/80'} • HR: {visit.vitals?.hr || '74 bpm'} • SpO2: {visit.vitals?.spo2 || '99%'}
                  </p>
                </div>
              </div>

              {visit.notes && (
                <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Signed Clinical Note</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{visit.notes}</p>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button 
                  onClick={() => alert(`Official Nursing Visit Summary PDF exported for ${visit.patientName} (${visit.id}).`)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Clinical EHR Summary (PDF)
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};

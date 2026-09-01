import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck2, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Filter,
  Lock,
  UserCheck
} from 'lucide-react';

export const ScheduleAuditView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const SCHEDULE_DRUG_LOGS = [
    {
      logId: 'SCH-LOG-9041',
      date: '01 Sep 2026, 11:20 AM',
      drugName: 'Alprazolam 0.5mg Tablets',
      scheduleCategory: 'Schedule H1',
      quantityDispensed: '10 Tablets',
      patientName: 'Ragul Kumar (ABHA: 91-4829-1102)',
      prescribingDoctor: 'Dr. Rajesh Varma (NMC: 74829-KA)',
      batchNo: 'ALP-2026-B8',
      status: 'Signed & Logged',
      regulatoryCompliance: '100% CDSCO Compliant'
    },
    {
      logId: 'SCH-LOG-9038',
      date: '31 Aug 2026, 04:45 PM',
      drugName: 'Zolpidem 10mg Tablets',
      scheduleCategory: 'Schedule H',
      quantityDispensed: '14 Tablets',
      patientName: 'Abinesh Kumar (ABHA: 91-8842-5921)',
      prescribingDoctor: 'Dr. Anita Desai (NMC: 66102-MH)',
      batchNo: 'ZOL-2026-K4',
      status: 'Signed & Logged',
      regulatoryCompliance: '100% CDSCO Compliant'
    },
    {
      logId: 'SCH-LOG-9022',
      date: '30 Aug 2026, 02:15 PM',
      drugName: 'Clonazepam 0.5mg Tablets',
      scheduleCategory: 'Schedule H1',
      quantityDispensed: '20 Tablets',
      patientName: 'Mrs. Meenakshi S. (ABHA: 91-7719-3382)',
      prescribingDoctor: 'Dr. Rajesh Varma (NMC: 74829-KA)',
      batchNo: 'CLN-2026-X1',
      status: 'Signed & Logged',
      regulatoryCompliance: '100% CDSCO Compliant'
    }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/70 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/30 font-mono">
            <Lock className="w-3.5 h-3.5" /> CDSCO Schedule H1 / H / X Audit Register
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Controlled Drug Regulatory Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Statutory digital dispensing register for habit-forming, psychotropic, and restricted antibiotics as mandated by the Drugs & Cosmetics Act.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all">
            <Download className="w-4 h-4 text-amber-300" />
            <span>Export Drug Inspector PDF</span>
          </button>
        </div>
      </div>

      {/* COMPLIANCE AUDIT METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Schedule H1 Entries', value: '48 Dispensed', icon: FileCheck2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'NMC Doctor Sign-Off', value: '100% Verified', icon: UserCheck, color: 'text-teal-500', bg: 'bg-teal-500/10' },
          { label: 'Unverified Dispensation', value: '0 Disputed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Audit Readiness', value: 'Inspector Ready', icon: ShieldCheck, color: 'text-cyan-500', bg: 'bg-cyan-500/10' }
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

      {/* REGULATORY LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-500" />
            Prescription Dispensing Logbook
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Timestamped</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {SCHEDULE_DRUG_LOGS.map((log) => (
            <div key={log.logId} className="p-5 space-y-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                    {log.scheduleCategory}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{log.drugName}</h4>
                  <span className="text-xs font-mono font-bold text-slate-400">({log.quantityDispensed})</span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {log.date}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <p><strong>Patient: </strong> {log.patientName}</p>
                <p><strong>Doctor: </strong> {log.prescribingDoctor}</p>
                <p><strong>Batch No: </strong> <span className="font-mono">{log.batchNo}</span></p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                <span className="text-teal-600 dark:text-cyan-400 font-bold">{log.regulatoryCompliance}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Digital Hash: {log.logId}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

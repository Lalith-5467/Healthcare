import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, Search, Filter, Stethoscope, FileText, Activity, 
  ChevronRight, Eye, ShieldAlert, HeartPulse, UserX
} from 'lucide-react';
import { INITIAL_PATIENTS, type PatientAdminRecord } from '../../../utils/adminMockStorage';

export const AdminPatientManagementView: React.FC = () => {
  const [patients, setPatients] = useState<PatientAdminRecord[]>(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientAdminRecord | null>(null);

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.abhaId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
            <UserCheck className="w-3.5 h-3.5" /> ABHA Longitudinal Patient Registry
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Patient Population Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Audit clinical enrollment, physician assignments, inpatient ward status, and Ayushman Bharat health records.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-white/10 text-cyan-300 text-xs font-mono font-bold border border-white/15 backdrop-blur-md">
            8,420 Enrolled Patients
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, ABHA ID, or Patient ID..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* PATIENTS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-4 px-5">Patient Details</th>
                <th className="py-4 px-4">Demographics</th>
                <th className="py-4 px-4">Assigned Physician</th>
                <th className="py-4 px-4">Ward / Inpatient</th>
                <th className="py-4 px-4">Clinical Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black shrink-0 border border-teal-500/20 text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{p.patientId} • ABHA: {p.abhaId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {p.age}y • {p.gender} • <span className="font-mono text-rose-500 font-bold">{p.bloodGroup}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                      <span>{p.assignedDoctor}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                    {p.admittedWard || 'Outpatient (OPD)'}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      p.status === 'Critical'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
                        : p.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer">
                      Chart 360
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

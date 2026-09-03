import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, HeartPulse, Search, Phone, Mail, Building2, 
  CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import { INITIAL_DOCTORS, INITIAL_NURSES, type DoctorAdminRecord, type NurseAdminRecord } from '../../../utils/adminMockStorage';

interface AdminStaffManagementViewProps {
  type: 'doctor' | 'nurse';
}

export const AdminStaffManagementView: React.FC<AdminStaffManagementViewProps> = ({ type }) => {
  const isDoctor = type === 'doctor';
  const [searchTerm, setSearchTerm] = useState('');

  const doctors = INITIAL_DOCTORS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nmcRegNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nurses = INITIAL_NURSES.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.councilRegNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isDoctor 
          ? 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-slate-700/60' 
          : 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border-slate-700/60'
      }`}>
        <div className="space-y-2 relative z-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border font-mono ${
            isDoctor ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
          }`}>
            {isDoctor ? <Stethoscope className="w-3.5 h-3.5" /> : <HeartPulse className="w-3.5 h-3.5" />}
            {isDoctor ? 'National Medical Commission (NMC) Roster' : 'Nursing Council Clinical Duty Station'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isDoctor ? 'Doctor & Practitioner Administration' : 'Nurse & Clinical Staff Roster'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            {isDoctor 
              ? 'Verify medical licenses, duty availability, clinical departments, and assigned inpatient loads.'
              : 'Monitor bedside shifts, emergency paramedic telemetry, GPS dispatch readiness, and assigned wards.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-white/10 text-white text-xs font-mono font-bold border border-white/15 backdrop-blur-md">
            {isDoctor ? '1,240 Registered Doctors' : '1,850 Clinical Nurses'}
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isDoctor ? "Search by doctor name, specialization, or NMC Reg..." : "Search nurse name, ward, or Council Reg..."}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-4 px-5">Staff Member</th>
                <th className="py-4 px-4">{isDoctor ? 'Specialization' : 'Shift'}</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Council License</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Assigned Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {isDoctor ? (
                doctors.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shrink-0 border border-emerald-500/20 text-xs">
                          {d.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{d.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium">{d.specialization}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{d.department}</td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">{d.nmcRegNo}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        d.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-slate-900 dark:text-white font-black">
                      {d.assignedPatients} Patients
                    </td>
                  </tr>
                ))
              ) : (
                nurses.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black shrink-0 border border-rose-500/20 text-xs">
                          {n.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{n.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{n.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-rose-600 dark:text-rose-400 font-mono font-bold">{n.shift}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{n.department}</td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">{n.councilRegNo}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        n.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-slate-900 dark:text-white font-black">
                      {n.assignedPatients} Bedside Wards
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

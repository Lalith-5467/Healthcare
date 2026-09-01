import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, BarChart3, ShieldAlert, Database, Lock, 
  Settings, Download, Activity, Clock, ShieldCheck, CheckCircle2, 
  Server, RefreshCw, AlertTriangle, Cpu, HardDrive
} from 'lucide-react';
import { INITIAL_ACTIVITY_LOGS, INITIAL_SECURITY_EVENTS } from '../../../utils/adminMockStorage';

interface AdminSecurityAuditViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminSecurityAuditView: React.FC<AdminSecurityAuditViewProps> = ({ currentRole }) => {
  const [logs, setLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [secEvents, setSecEvents] = useState(INITIAL_SECURITY_EVENTS);
  const [selectedModule, setSelectedModule] = useState('All');

  const filteredLogs = logs.filter(l => selectedModule === 'All' || l.module === selectedModule);

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/80 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black uppercase tracking-wider border border-rose-400/30 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" /> Threat Detection & Enterprise Audit
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Security Radar & Compliance Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Real-time SIEM inspection for unauthorized record exports, credential anomalies, and role escalation attempts.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all">
            <Download className="w-4 h-4 text-cyan-300" />
            <span>Export Compliance Report</span>
          </button>
        </div>
      </div>

      {/* SECURITY EVENT TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secEvents.map(ev => (
          <div key={ev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  ev.severity === 'Critical' ? 'bg-rose-500 animate-ping' :
                  ev.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <h4 className="text-xs font-black text-slate-900 dark:text-white">{ev.eventType}</h4>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                ev.severity === 'Critical' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              }`}>
                {ev.severity} Severity
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Source: <strong className="text-slate-900 dark:text-white">{ev.source}</strong>
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Actor: {ev.actor}</span>
              <span className="text-emerald-600 font-bold">{ev.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AUDIT LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
              Comprehensive Administrative Audit Stream
            </h3>
            <p className="text-xs text-slate-400">Chronological history of every read, modify, or delete command executed.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Modules</option>
              <option value="Prescription">Prescription</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="EHR Records">EHR Records</option>
              <option value="Insurance">Insurance</option>
              <option value="System Settings">System Settings</option>
              <option value="User Auth">User Auth</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-4">Operator / Actor</th>
                <th className="py-4 px-4">Module</th>
                <th className="py-4 px-4">Operational Action</th>
                <th className="py-4 px-4">IP / Device Origin</th>
                <th className="py-4 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-400">{l.timestamp}</td>
                  <td className="py-4 px-4">
                    <p className="font-black text-slate-900 dark:text-white">{l.userName}</p>
                    <p className="text-[10px] text-slate-400">{l.userRole}</p>
                  </td>
                  <td className="py-4 px-4 font-mono text-blue-600 dark:text-cyan-400">{l.module}</td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{l.action}</td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">{l.ipAddress}</td>
                  <td className="py-4 px-5 text-right">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      l.status === 'Success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {l.status}
                    </span>
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

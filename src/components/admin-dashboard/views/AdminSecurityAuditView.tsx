import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, BarChart3, ShieldAlert, Database, Lock, 
  Settings, Download, Activity, Clock, ShieldCheck, CheckCircle2, 
  Server, RefreshCw, AlertTriangle, Cpu, HardDrive, Search, Loader2
} from 'lucide-react';

const formatActionTitle = (action: string) => {
  if (!action) return 'System Event';
  return action
    .toLowerCase()
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const formatEntityName = (entity: string) => {
  if (!entity) return 'System';
  const map: Record<string, string> = {
    patients: 'Patients',
    patient_access_requests: 'Access Requests',
    health_share_tokens: 'Token Sharing',
    prescriptions: 'Prescriptions',
    pharmacy_orders: 'Pharmacy Orders',
    users: 'Users',
    audit_logs: 'Audit Logs',
  };
  return map[entity.toLowerCase()] || entity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const formatIp = (ip: string) => {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return 'Localhost';
  return ip;
};
import { adminApi } from '../../../services/dhrApis';

interface AdminSecurityAuditViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminSecurityAuditView: React.FC<AdminSecurityAuditViewProps> = ({ currentRole }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs({
        page,
        limit: 25,
        module: selectedModule !== 'All' ? selectedModule : undefined,
        search: searchTerm.trim() || undefined,
      });

      if (res && res.data) {
        setLogs(Array.isArray(res.data) ? res.data : []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, selectedModule]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  // Derive high-priority security audit alerts from genuine database logs
  const securityEvents = logs.filter(l => 
    l.action.includes('ROLE') || 
    l.action.includes('STATUS') || 
    l.action.includes('PASSWORD') ||
    l.action.includes('DELETE')
  );

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00a896] text-white border border-[#009688]/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Security Radar & Compliance Audit Logs
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            Real-time SIEM inspection for user modifications, privilege assignments, data modifications, and authentication attempts.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button 
            onClick={fetchLogs}
            className="px-4 py-3 rounded-xl bg-white hover:bg-teal-50/90 text-[#00796b] font-black text-xs shadow-md shadow-teal-950/15 border border-white/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 text-[#00897b] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stream</span>
          </button>
        </div>
      </div>

      {/* SECURITY SENSITIVE EVENTS (DERIVED FROM REAL DATABASE AUDIT LOGS) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Privileged Security Actions ({securityEvents.length})
        </h3>

        {securityEvents.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No privileged security alert actions (role changes or status modifications) found in the current audit window.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityEvents.slice(0, 4).map((ev: any) => (
              <div key={ev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{ev.action}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20">
                    {ev.entityType}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Triggered by: <strong className="text-slate-900 dark:text-white">{ev.userName || ev.userEmail || 'System'}</strong> ({ev.userRole || 'SYSTEM'})
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>IP: {ev.ipAddress || '127.0.0.1'}</span>
                  <span className="text-slate-500">{new Date(ev.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AUDIT LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/50">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-rose-500" />
              Comprehensive Administrative Audit Stream
            </h3>
            <p className="text-xs text-slate-400">Chronological audit trail of all administrative and transactional events.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search action or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Modules</option>
              <option value="users">Users & Accounts</option>
              <option value="prescriptions">Prescriptions</option>
              <option value="pharmacy_orders">Pharmacy Orders</option>
              <option value="system_settings">System Settings</option>
              <option value="uploaded_files">Secure Files</option>
            </select>

            <button
              type="submit"
              className="h-9 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            <span>Loading genuine audit log records from database...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            No audit records found matching the selected module and search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {formatActionTitle(log.action)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50">
                        {formatEntityName(log.entityType)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-900 dark:text-white font-semibold">{log.userName || log.userEmail || 'System Gateway'}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{log.userRole || 'System'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {formatIp(log.ipAddress)}
                    </td>
                    <td className="py-3 px-5 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

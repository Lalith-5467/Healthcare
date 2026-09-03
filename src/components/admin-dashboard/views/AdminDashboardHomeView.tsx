import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Stethoscope, HeartPulse, Pill, HeartHandshake, 
  ShieldCheck, Activity, TrendingUp, TrendingDown, ArrowUpRight, 
  Sparkles, CheckCircle2, AlertTriangle, FileText, ArrowRight, 
  Clock, ShieldAlert, Zap, Filter
} from 'lucide-react';
import { INITIAL_ACTIVITY_LOGS, INITIAL_ADMIN_USERS, type ActivityLogItem } from '../../../utils/adminMockStorage';

interface AdminDashboardHomeViewProps {
  onNavigate: (id: string) => void;
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminDashboardHomeView: React.FC<AdminDashboardHomeViewProps> = ({
  onNavigate,
  currentRole
}) => {
  const isSuperAdmin = currentRole === 'Super Admin';

  const KPI_CARDS = [
    { label: 'Total Registered Users', value: '12,486', change: '+14.2%', isUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Registered Patients', value: '8,420', change: '+8.4%', isUp: true, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Verified Doctors', value: '1,240', change: '+3.1%', isUp: true, icon: Stethoscope, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Clinical Nurses', value: '1,850', change: '+5.6%', isUp: true, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Licensed Pharmacists', value: '426', change: '+2.0%', isUp: true, icon: Pill, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Authorized Caregivers', value: '550', change: '+11.8%', isUp: true, icon: HeartHandshake, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Insurance / TPA Desks', value: '320', change: '+4.5%', isUp: true, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Daily Active Concurrency', value: '9,842', change: '+19.3%', isUp: true, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. HERO COMMAND STATUS BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              National Health Directorate Relay Active
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-bold text-slate-300 bg-white/5 rounded-full border border-white/10">
              Role: {currentRole}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Digital Health Records Administrative Directorate
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Real-time governance console managing <strong className="text-cyan-300 font-black">12,486 registered clinical accounts</strong>, Ayushman Bharat health record exchanges, e-prescriptions, and cashless hospital billing.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('users')}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Users className="w-4 h-4" />
            <span>Manage All Users (12.4k)</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => onNavigate('security-audit')}
              className="px-5 py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Security Radar</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP SUMMARY METRICS (8 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {KPI_CARDS.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                {kpi.change}
              </span>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">{kpi.value}</p>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. SYSTEM OVERVIEW ANALYTICS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* USER GROWTH SIMULATOR (8 COLS) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                System User Growth & Telemetry Ingestion
              </h2>
              <p className="text-xs text-slate-400">Monthly breakdown across patient enrollment, clinical staff, and dispensaries.</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold">
              {['7 Days', '30 Days', '6 Months', '1 Year'].map((t, i) => (
                <button 
                  key={t}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    i === 1 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-xs font-black' : 'text-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SIMULATED ANALYTICS BARS */}
          <div className="space-y-4 pt-2">
            {[
              { role: 'Patients (Self-Registered & ABHA Linked)', count: '8,420 users', percent: 67, color: 'from-blue-500 to-cyan-500' },
              { role: 'Clinical Staff (Doctors & Nurses)', count: '3,090 users', percent: 25, color: 'from-emerald-500 to-teal-500' },
              { role: 'Ecosystem Desks (Pharmacists, Caregivers, TPA)', count: '1,296 users', percent: 10, color: 'from-amber-500 to-orange-500' }
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{bar.role}</span>
                  <span className="font-mono text-slate-900 dark:text-white font-black">{bar.count} ({bar.percent}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className={`h-full bg-gradient-to-r ${bar.color}`} style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Average Onboarding Speed: <strong>14.2s per ABHA ID</strong></span>
            <button 
              onClick={() => onNavigate('reports-analytics')}
              className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Open Full Analytical Intelligence →
            </button>
          </div>
        </div>

        {/* ROLE DISTRIBUTION DONUT METRICS (4 COLS) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            User Composition Breakdown
          </h2>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            {[
              { label: 'Patients', value: '67.4%', count: '8,420', color: 'bg-blue-500' },
              { label: 'Nurses', value: '14.8%', count: '1,850', color: 'bg-rose-500' },
              { label: 'Doctors', value: '9.9%', count: '1,240', color: 'bg-emerald-500' },
              { label: 'Caregivers', value: '4.4%', count: '550', color: 'bg-amber-500' },
              { label: 'Pharmacists', value: '3.4%', count: '426', color: 'bg-cyan-500' },
              { label: 'Insurance TPAs', value: '2.5%', count: '320', color: 'bg-indigo-500' }
            ].map((d, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.color}`} />
                  <span className="text-slate-700 dark:text-slate-300">{d.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">{d.count}</span>
                  <span className="font-mono text-slate-900 dark:text-white font-black">{d.value}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('users')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Export Directory CSV
          </button>
        </div>

      </div>

      {/* 4. REAL-TIME AUDIT ACTIVITY STREAM */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Live Enterprise Audit Trail
            </h2>
            <p className="text-xs text-slate-400">Timestamped operational logs across doctors, pharmacists, nurses, and administrators.</p>
          </div>

          <button
            onClick={() => onNavigate('activity-logs')}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Activity Logs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {INITIAL_ACTIVITY_LOGS.slice(0, 5).map((log: ActivityLogItem) => (
            <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-cyan-300 border border-blue-500/20">
                    {log.module}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{log.action}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Triggered by <strong className="text-slate-900 dark:text-white">{log.userName}</strong> ({log.userRole}) • {log.ipAddress}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 font-bold">{log.timestamp}</span>
                <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border ${
                  log.status === 'Success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Stethoscope, HeartPulse, Pill, HeartHandshake, 
  ShieldCheck, Activity, TrendingUp, TrendingDown, ArrowUpRight, 
  Sparkles, CheckCircle2, AlertTriangle, FileText, ArrowRight, 
  Clock, ShieldAlert, Zap, Filter, Loader2, Eye, QrCode
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

const getActionVisuals = (action: string) => {
  const act = (action || '').toUpperCase();
  if (act.includes('VIEW') || act.includes('READ') || act.includes('GET')) {
    return {
      icon: Eye,
      iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/50',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40'
    };
  }
  if (act.includes('APPROV') || act.includes('ACCEPT') || act.includes('SUCCESS')) {
    return {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
    };
  }
  if (act.includes('QR') || act.includes('SCAN') || act.includes('TOKEN')) {
    return {
      icon: QrCode,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/50',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
    };
  }
  if (act.includes('CREATE') || act.includes('ADD') || act.includes('NEW')) {
    return {
      icon: FileText,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-800/50',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40'
    };
  }
  if (act.includes('DELETE') || act.includes('REJECT') || act.includes('SUSPEND') || act.includes('REVOKE')) {
    return {
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/50',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40'
    };
  }
  return {
    icon: Activity,
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };
};

const formatIp = (ip: string) => {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return 'Localhost';
  return ip;
};

const formatRoleBadge = (role: string) => {
  if (!role) return 'System';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};
import { dashboardApi, adminApi } from '../../../services/dhrApis';

interface AdminDashboardHomeViewProps {
  onNavigate: (id: string) => void;
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminDashboardHomeView: React.FC<AdminDashboardHomeViewProps> = ({
  onNavigate,
  currentRole
}) => {
  const isSuperAdmin = currentRole === 'Super Admin';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalNurses: 0,
    totalPharmacists: 0,
    totalCaregivers: 0,
    totalInsurance: 0,
    totalPrescriptions: 0,
    totalOrders: 0,
    totalAppointments: 0,
    roleDistribution: {},
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      dashboardApi.getStats().catch(() => ({ data: {} })),
      adminApi.getAuditLogs({ limit: 5 }).catch(() => ({ data: [] })),
    ]).then(([statsRes, logsRes]) => {
      if (!isMounted) return;
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
      if (logsRes && logsRes.data) {
        setRecentLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsersCount = stats.totalUsers || 0;
  const roles = stats.roleDistribution || {};

  const patientCount = roles.PATIENT || stats.totalPatients || 0;
  const doctorCount = roles.DOCTOR || stats.totalDoctors || 0;
  const nurseCount = roles.NURSE || stats.totalNurses || 0;
  const pharmaCount = roles.PHARMACIST || stats.totalPharmacists || 0;
  const caregiverCount = roles.CAREGIVER || stats.totalCaregivers || 0;
  const insuranceCount = roles.INSURANCE_PROVIDER || roles.INSURANCE || stats.totalInsurance || 0;

  const clinicalStaffCount = doctorCount + nurseCount;
  const ecosystemCount = pharmaCount + caregiverCount + insuranceCount;

  const patientPct = totalUsersCount > 0 ? Math.round((patientCount / totalUsersCount) * 100) : 0;
  const clinicalStaffPct = totalUsersCount > 0 ? Math.round((clinicalStaffCount / totalUsersCount) * 100) : 0;
  const ecosystemPct = totalUsersCount > 0 ? Math.round((ecosystemCount / totalUsersCount) * 100) : 0;

  const KPI_CARDS = [
    { label: 'Total Registered Users', value: totalUsersCount.toLocaleString(), change: 'Live', isUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Registered Patients', value: patientCount.toLocaleString(), change: `${patientPct}%`, isUp: true, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Verified Doctors', value: doctorCount.toLocaleString(), change: 'Verified', isUp: true, icon: Stethoscope, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Clinical Nurses', value: nurseCount.toLocaleString(), change: 'Active', isUp: true, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Licensed Pharmacists', value: pharmaCount.toLocaleString(), change: 'Active', isUp: true, icon: Pill, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Prescriptions Issued', value: (stats.totalPrescriptions || 0).toLocaleString(), change: 'Issued', isUp: true, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Pharmacy Orders', value: (stats.totalOrders || 0).toLocaleString(), change: 'Fulfillment', isUp: true, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Appointments Booked', value: (stats.totalAppointments || 0).toLocaleString(), change: 'Consultations', isUp: true, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. HERO COMMAND STATUS BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#00796b] via-[#009688] to-[#00a896] text-white border border-teal-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle background ambient lights */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-24 w-64 h-64 rounded-full bg-teal-300/15 blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-black tracking-tight text-white leading-tight">
            Digital Health Records Administrative Directorate
          </h1>
          <p className="text-base sm:text-lg text-teal-50 font-medium leading-relaxed">
            Real-time governance console managing <strong className="text-white font-black underline decoration-white/30">{totalUsersCount} registered clinical accounts</strong>, Ayushman Bharat health record exchanges, e-prescriptions, and cashless hospital billing.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('users')}
            className="group px-6 py-3.5 rounded-xl bg-white hover:bg-teal-50 text-[#00796b] hover:text-[#004d40] font-black text-sm sm:text-base shadow-md hover:shadow-xl shadow-teal-950/20 hover:ring-4 hover:ring-white/50 border border-white/60 hover:border-teal-200 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <Users className="w-5 h-5 text-[#00897b] transition-all duration-200 group-hover:scale-110 group-hover:text-[#004d40]" />
            <span>Manage All Users ({totalUsersCount})</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => onNavigate('security-audit')}
              className="group px-5 py-3.5 rounded-xl bg-white hover:bg-teal-50 text-[#00796b] hover:text-[#004d40] font-black text-sm sm:text-base shadow-md hover:shadow-xl shadow-teal-950/20 hover:ring-4 hover:ring-white/50 border border-white/60 hover:border-teal-200 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <ShieldAlert className="w-5 h-5 text-[#00897b] transition-all duration-200 group-hover:scale-110 group-hover:text-[#004d40]" />
              <span>Security Radar</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP SUMMARY METRICS (8 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {KPI_CARDS.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00a896]/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                <kpi.icon className="w-5.5 h-5.5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                {kpi.change}
              </span>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{kpi.value}</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mt-1.5">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. SYSTEM OVERVIEW ANALYTICS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* USER GROWTH BREAKDOWN (8 COLS) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#00a896]" />
                System User Distribution & Telemetry
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Live breakdown across patient enrollment, clinical staff, and ecosystem dispensaries.</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="px-3 py-1 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">Real Database Aggregation</span>
            </div>
          </div>

          {/* REAL ANALYTICS BARS */}
          <div className="space-y-5 pt-2">
            {[
              { role: 'Patients (Self-Registered & ABHA Linked)', count: `${patientCount} users`, percent: patientPct, color: 'from-blue-500 to-cyan-500' },
              { role: 'Clinical Staff (Doctors & Nurses)', count: `${clinicalStaffCount} users`, percent: clinicalStaffPct, color: 'from-emerald-500 to-teal-500' },
              { role: 'Ecosystem Desks (Pharmacists, Caregivers, TPA, Admins)', count: `${ecosystemCount} users`, percent: ecosystemPct, color: 'from-amber-500 to-orange-500' }
            ].map((bar, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{bar.role}</span>
                  <span className="font-mono text-slate-900 dark:text-white font-black text-sm">{bar.count} ({bar.percent}%)</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className={`h-full bg-gradient-to-r ${bar.color}`} style={{ width: `${Math.max(2, bar.percent)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            <span>Platform Architecture: <strong className="text-slate-900 dark:text-white">Enterprise Health Core</strong></span>
            <button 
              onClick={() => onNavigate('reports-analytics')}
              className="text-[#00a896] dark:text-[#2dd4bf] hover:underline flex items-center gap-1.5 cursor-pointer text-sm font-bold"
            >
              Open Full Analytical Intelligence →
            </button>
          </div>
        </div>

        {/* ROLE DISTRIBUTION DONUT METRICS (4 COLS) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
            User Composition Breakdown
          </h2>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
            {[
              { label: 'Patients', count: patientCount, color: 'bg-blue-500' },
              { label: 'Doctors', count: doctorCount, color: 'bg-emerald-500' },
              { label: 'Nurses', count: nurseCount, color: 'bg-rose-500' },
              { label: 'Pharmacists', count: pharmaCount, color: 'bg-cyan-500' },
              { label: 'Caregivers', count: caregiverCount, color: 'bg-amber-500' },
              { label: 'Insurance TPAs', count: insuranceCount, color: 'bg-indigo-500' }
            ].map((d, idx) => {
              const pct = totalUsersCount > 0 ? ((d.count / totalUsersCount) * 100).toFixed(1) : '0.0';
              return (
                <div key={idx} className="flex items-center justify-between text-sm font-semibold">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${d.color}`} />
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-xs font-bold">{d.count}</span>
                    <span className="font-mono text-slate-900 dark:text-white font-black text-sm">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate('users')}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-colors cursor-pointer text-center"
          >
            Manage User Directory →
          </button>
        </div>

      </div>

      {/* 4. REAL-TIME AUDIT ACTIVITY STREAM */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#00796b] dark:text-[#2dd4bf] flex items-center justify-center border border-teal-200/60 dark:border-teal-800/50 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Live Enterprise Audit Trail
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Timestamped operational logs and real-time security events.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('security-audit')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 px-3 py-1.5 rounded-lg border border-teal-200/60 dark:border-teal-800/40 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span>All Activity Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {recentLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              No recent audit trail entries logged in the database yet.
            </div>
          ) : (
            recentLogs.map((log: any) => {
              const visuals = getActionVisuals(log.action);
              const IconComp = visuals.icon;
              const actionTitle = formatActionTitle(log.action);
              const entityName = formatEntityName(log.entityType);
              const userName = log.userName || log.userEmail || 'System';
              const roleName = formatRoleBadge(log.userRole);
              const ipDisplay = formatIp(log.ipAddress);
              const timeFormatted = log.createdAt 
                ? new Date(log.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                : 'Recent';

              return (
                <div key={log.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${visuals.iconBg} shadow-2xs`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                          {actionTitle}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${visuals.badgeBg}`}>
                          {entityName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>Triggered by <strong className="font-semibold text-slate-700 dark:text-slate-200">{userName}</strong></span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          {roleName}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="font-mono text-[11px] text-slate-400">{ipDisplay}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {timeFormatted}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

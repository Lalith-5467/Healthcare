import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, FileText, ShoppingBag, Calendar, 
  Download, ArrowUpRight, CheckCircle2, ShieldCheck, Activity, 
  Percent, IndianRupee, Loader2
} from 'lucide-react';
import { dashboardApi } from '../../../services/dhrApis';

export const AdminReportsAnalyticsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalNurses: 0,
    totalPharmacists: 0,
    totalPrescriptions: 0,
    totalOrders: 0,
    totalAppointments: 0,
    totalRecords: 0,
    roleDistribution: {},
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    dashboardApi.getStats()
      .then((res) => {
        if (isMounted && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load dashboard stats for reports:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsers = stats.totalUsers || 0;
  const totalPatients = stats.totalPatients || 0;
  const totalAppointments = stats.totalAppointments || 0;
  const totalPrescriptions = stats.totalPrescriptions || 0;
  const totalOrders = stats.totalOrders || 0;
  const totalRecords = stats.totalRecords || 0;
  const totalStaff = (stats.totalDoctors || 0) + (stats.totalNurses || 0) + (stats.totalPharmacists || 0);

  const tiles = [
    { label: 'Total Registrations', value: totalUsers.toLocaleString(), change: 'Live Database', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Registered Patients', value: totalPatients.toLocaleString(), change: 'Enrolled', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Appointments Scheduled', value: totalAppointments.toLocaleString(), change: 'Consultations', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'e-Prescriptions Issued', value: totalPrescriptions.toLocaleString(), change: 'Issued', icon: FileText, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Dispensary Orders', value: totalOrders.toLocaleString(), change: 'Fulfillment', icon: ShoppingBag, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Medical Records Stored', value: totalRecords.toLocaleString(), change: 'Encrypted', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Clinical Staff Count', value: totalStaff.toLocaleString(), change: 'Active Staff', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'ABDM Integration Status', value: 'Ready (v3)', change: 'ABDM Standard', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00a896] text-white border border-[#009688]/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Reports & Analytical Intelligence
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            Comprehensive aggregates derived from real-time digital health records, consultations, prescriptions, and pharmacy fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          {loading && (
            <div className="flex items-center gap-2 text-white text-xs font-mono font-bold bg-black/20 px-3 py-1.5 rounded-lg border border-white/20">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Syncing metrics...</span>
            </div>
          )}
        </div>
      </div>

      {/* 8 AGGREGATE SUMMARY TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {tiles.map((s, i) => (
          <div key={i} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.change}</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</p>
              <p className="text-[10px] font-black uppercase text-slate-400 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};


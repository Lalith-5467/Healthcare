import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, FileText, ShoppingBag, Calendar, 
  Download, ArrowUpRight, CheckCircle2, ShieldCheck, Activity, 
  Percent, IndianRupee
} from 'lucide-react';

export const AdminReportsAnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Monthly');

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 font-mono">
            <BarChart3 className="w-3.5 h-3.5" /> Business Intelligence & Clinical KPI Matrix
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Reports & Analytical Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Aggregate clinical throughput metrics across patient OPD consultations, e-prescriptions, pharmacy fulfillment, and cashless TPA disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102">
            <Download className="w-4 h-4" />
            <span>Export Executive Summary PDF</span>
          </button>
        </div>
      </div>

      {/* 8 AGGREGATE SUMMARY TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Total Registrations', value: '12,486', change: '+14.2%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Monthly Consults', value: '3,840', change: '+9.4%', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'e-Prescriptions', value: '8,920', change: '+18.1%', icon: FileText, color: 'text-teal-500', bg: 'bg-teal-500/10' },
          { label: 'Dispensary Orders', value: '4,150', change: '+6.2%', icon: ShoppingBag, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Cashless Payouts', value: '₹1.84 Cr', change: '+22.0%', icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Bedside Vitals Logged', value: '48,200', change: '+31.4%', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'ABDM Sync Rate', value: '99.98%', change: 'Optimal', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Avg Turnaround', value: '14 mins', change: '-3.2m', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((s, i) => (
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

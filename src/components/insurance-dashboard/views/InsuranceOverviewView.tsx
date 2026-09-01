import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2, Clock, IndianRupee, Search, ChevronRight } from 'lucide-react';
import { getGreeting } from '../../../utils/greeting';

interface InsuranceOverviewViewProps {
  onNavigate: (id: string) => void;
}

export const InsuranceOverviewView: React.FC<InsuranceOverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-16 relative">
      {/* Background Subtle Orb Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Greeting & Quick Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Insurance Team</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Review policies, claims, approvals and reimbursement activity.
          </p>
        </div>
        
        <button 
          onClick={() => onNavigate('search')}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 border border-blue-400/30 text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Search className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />
          <span className="relative z-10">Search Insurance ID</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Policies', value: '1,248', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'New Claims', value: '24', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Under Review', value: '18', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Approved', value: '42', icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
          { label: 'Reimbursements', value: '₹2.4L', icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm hover:border-indigo-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:shadow-[0_0_15px_currentColor] transition-shadow opacity-90 group-hover:opacity-100`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5 ${stat.label === 'Reimbursements' ? 'font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300' : ''}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Claims Grid */}
      <div className="mt-8 bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden relative">
        <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/80 to-transparent absolute top-0 left-0"></div>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" /> Recent Claims Activity
          </h2>
        </div>
        <div className="px-2 pb-2">
          <div className="flex flex-col">
            {[
              { id: 'CLM-2026-00231', name: 'Abinesh Kumar', type: 'Hospitalization', amount: '₹1,20,000', status: 'Under Review', statusBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500', img: 'https://i.pravatar.cc/150?img=11' },
              { id: 'CLM-2026-00232', name: 'Priya Sharma', type: 'Emergency', amount: '₹45,000', status: 'New', statusBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500', img: 'https://i.pravatar.cc/150?img=5' },
              { id: 'CLM-2026-00229', name: 'Rahul Kumar', type: 'Diagnostics', amount: '₹12,500', status: 'Approved', statusBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', img: 'https://i.pravatar.cc/150?img=13' },
            ].map((claim, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 cursor-pointer group gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 shadow-sm group-hover:border-indigo-500/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {claim.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{claim.id}</p>
                    <p className="text-xs text-slate-500 font-bold">{claim.name} • {claim.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <p className="font-mono font-black text-lg text-slate-900 dark:text-white tracking-tight">{claim.amount}</p>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-md border flex items-center gap-1.5 ${claim.statusBg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${claim.dot} shadow-[0_0_5px_currentColor]`}></span>
                      {claim.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 hidden sm:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

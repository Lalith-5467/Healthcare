import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2, Clock, IndianRupee, Search, ChevronRight } from 'lucide-react';

interface InsuranceOverviewViewProps {
  onNavigate: (id: string) => void;
}

export const InsuranceOverviewView: React.FC<InsuranceOverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-16">
      {/* Greeting & Quick Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good Morning, Insurance Team
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Review policies, claims, approvals and reimbursement activity.
          </p>
        </div>
        
        <button 
          onClick={() => onNavigate('search')}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 group"
        >
          <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
          Search Insurance ID
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
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Claims Grid */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" /> Recent Claims Activity
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[
              { id: 'CLM-2026-00231', name: 'Abinesh Kumar', type: 'Hospitalization', amount: '₹1,20,000', status: 'Under Review', statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
              { id: 'CLM-2026-00232', name: 'Priya Sharma', type: 'Emergency', amount: '₹45,000', status: 'New', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
              { id: 'CLM-2026-00229', name: 'Rahul Kumar', type: 'Diagnostics', amount: '₹12,500', status: 'Approved', statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
            ].map((claim, idx) => (
              <div key={idx} className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer group gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                    {claim.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{claim.id}</p>
                    <p className="text-xs text-slate-500 font-bold">{claim.name} • {claim.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <p className="font-black text-slate-900 dark:text-white">{claim.amount}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${claim.statusColor}`}>
                      {claim.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
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

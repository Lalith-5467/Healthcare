import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, ShieldCheck, Clock, Search, Filter, ArrowDownToLine, 
  Plus, MoreVertical, X, Calendar, User, Phone, Mail, 
  MapPin, CheckCircle2, AlertTriangle, ChevronRight, Activity, ActivitySquare, BadgeCheck, Stethoscope, BriefcaseMedical
} from 'lucide-react';

// Sample Data
const policies = [
  {
    id: 'POL-2026-10245',
    holder: 'Arun Kumar',
    memberId: 'MEM-88421',
    provider: 'Star Health',
    plan: 'Family Health Plus',
    type: 'Family',
    coverage: '₹10,00,000',
    premium: '₹28,500/year',
    validUntil: '31 Dec 2026',
    status: 'Active',
    dob: '12 Aug 1985',
    phone: '+91 98765 43210',
    email: 'arun.k@example.com',
    city: 'Chennai',
    members: [
      { name: 'Arun Kumar', relation: 'Primary' },
      { name: 'Lakshmi Kumar', relation: 'Spouse' },
      { name: 'Aarav Kumar', relation: 'Child' }
    ]
  },
  {
    id: 'POL-2026-10246',
    holder: 'Priya S',
    memberId: 'MEM-88422',
    provider: 'HDFC ERGO',
    plan: 'Optima Secure',
    type: 'Individual',
    coverage: '₹15,00,000',
    premium: '₹32,800/year',
    validUntil: '15 Sep 2026',
    status: 'Expiring Soon',
    dob: '24 May 1990',
    phone: '+91 91234 56789',
    email: 'priya.s@example.com',
    city: 'Bangalore',
    members: [
      { name: 'Priya S', relation: 'Primary' }
    ]
  },
  {
    id: 'POL-2026-10247',
    holder: 'Rahul M',
    memberId: 'MEM-88423',
    provider: 'ICICI Lombard',
    plan: 'Health AdvantEdge',
    type: 'Corporate',
    coverage: '₹20,00,000',
    premium: '₹41,200/year',
    validUntil: '05 Aug 2026',
    status: 'Expired',
    dob: '10 Nov 1982',
    phone: '+91 99887 76655',
    email: 'rahul.m@example.com',
    city: 'Mumbai',
    members: [
      { name: 'Rahul M', relation: 'Primary' }
    ]
  },
  {
    id: 'POL-2026-10248',
    holder: 'Meena R',
    memberId: 'MEM-88424',
    provider: 'Niva Bupa',
    plan: 'ReAssure',
    type: 'Senior Citizen',
    coverage: '₹10,00,000',
    premium: '₹26,500/year',
    validUntil: '22 Nov 2026',
    status: 'Active',
    dob: '15 Mar 1955',
    phone: '+91 94444 33333',
    email: 'meena.r@example.com',
    city: 'Delhi',
    members: [
      { name: 'Meena R', relation: 'Primary' }
    ]
  },
  {
    id: 'POL-2026-10249',
    holder: 'Vikram Singh',
    memberId: 'MEM-88425',
    provider: 'Care Health',
    plan: 'Care Supreme',
    type: 'Individual',
    coverage: '₹5,00,000',
    premium: '₹18,000/year',
    validUntil: 'Pending Approval',
    status: 'Pending',
    dob: '05 Jul 1995',
    phone: '+91 97777 22222',
    email: 'vikram.s@example.com',
    city: 'Pune',
    members: [
      { name: 'Vikram Singh', relation: 'Primary' }
    ]
  }
];

export const PoliciesDirectoryView: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // New Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreAuthModal, setShowPreAuthModal] = useState(false);
  const [showClaimsModal, setShowClaimsModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleAction = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      handleAction('Policy document downloaded successfully.');
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</span>;
      case 'Expiring Soon':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Expiring Soon</span>;
      case 'Expired':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Expired</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Pending</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Cancelled</span>;
      default:
        return null;
    }
  };

  // Helper for rendering a small SVG donut chart (CSS-based approximation)
  const renderDonutChart = (segments: {color: string, percentage: number}[]) => {
    let currentRotation = 0;
    return (
      <div className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
        {segments.map((segment, idx) => {
          const rotation = currentRotation;
          currentRotation += (segment.percentage / 100) * 360;
          return (
            <div 
              key={idx}
              className="absolute inset-0 origin-center"
              style={{
                background: `conic-gradient(from ${rotation}deg, ${segment.color} 0%, ${segment.color} ${segment.percentage}%, transparent ${segment.percentage}%)`
              }}
            />
          );
        })}
        {/* Inner Cutout */}
        <div className="absolute w-16 h-16 bg-white dark:bg-[#0b1120] rounded-full z-10" />
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-28 font-sans select-none max-w-7xl mx-auto">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[60] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-slate-700 dark:border-slate-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Policies Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Search, review, and manage all insurance policies across your network.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Last synced 5 minutes ago
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer">
              <ArrowDownToLine className="w-3.5 h-3.5" /> Import
            </button>
            <button className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer">
              <FileText className="w-3.5 h-3.5" /> Export Report
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create Policy
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Policies', value: '12,486', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', borderTop: 'border-t-blue-500', trend: '+8.4% this month' },
          { label: 'Active Policies', value: '9,842', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', borderTop: 'border-t-emerald-500', trend: '78.8% of total' },
          { label: 'Expiring Soon', value: '426', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', borderTop: 'border-t-amber-500', trend: 'Within next 30 days' },
          { label: 'Expired / Inactive', value: '2,218', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', borderTop: 'border-t-rose-500', trend: 'Requires attention' }
        ].map((stat, i) => (
          <div 
            key={i}
            className={`bg-white dark:bg-[#0b1120] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-t-2 ${stat.borderTop} shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stat.value}</p>
              <p className="text-xs text-slate-900 dark:text-slate-300 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-[10px] font-bold text-slate-400">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ANALYTICS & ALERTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Section */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0b1120] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center justify-around">
          <div className="flex items-center gap-6">
            {renderDonutChart([
              { color: '#10b981', percentage: 78.8 }, // Active
              { color: '#f59e0b', percentage: 3.4 },  // Expiring
              { color: '#f43f5e', percentage: 17.8 }  // Expired
            ])}
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Policy Distribution</h3>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active (78.8%)</li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Expiring Soon (3.4%)</li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Expired (17.8%)</li>
              </ul>
            </div>
          </div>

          <div className="hidden sm:block w-px h-full bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex items-center gap-6">
            {renderDonutChart([
              { color: '#3b82f6', percentage: 45 }, // Family
              { color: '#8b5cf6', percentage: 30 }, // Individual
              { color: '#06b6d4', percentage: 15 }, // Corporate
              { color: '#64748b', percentage: 10 }  // Senior
            ])}
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Coverage Type</h3>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Family (45%)</li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-violet-500"></span> Individual (30%)</li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Corporate (15%)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Expiry Alert Card */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-black text-amber-800 dark:text-amber-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" /> Policies Expiring Soon
            </h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-4">426 <span className="text-sm font-medium text-slate-500">policies</span></p>
            <ul className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <li className="flex items-center justify-between"><span>Expire in 7 days</span> <span className="text-amber-600 dark:text-amber-500">15</span></li>
              <li className="flex items-center justify-between"><span>Expire in 15 days</span> <span className="text-amber-600 dark:text-amber-500">128</span></li>
              <li className="flex items-center justify-between"><span>Expire in 30 days</span> <span className="text-amber-600 dark:text-amber-500">283</span></li>
            </ul>
          </div>
          <button className="w-full mt-6 py-2.5 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-400 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-amber-200 dark:border-amber-500/30">
            Review Expiring Policies →
          </button>
        </div>
      </div>

      {/* 4. SEARCH & FILTER SECTION */}
      <div className="bg-white dark:bg-[#0b1120] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Policy ID, Patient Name, Member ID or Insurance Provider..." 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900 dark:text-white transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
            <option>Status: All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
            <option>Cancelled</option>
          </select>
          <select className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
            <option>Provider: All</option>
            <option>Star Health</option>
            <option>HDFC ERGO</option>
            <option>ICICI Lombard</option>
          </select>
          <select className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
            <option>Type: All</option>
            <option>Individual</option>
            <option>Family</option>
            <option>Corporate</option>
          </select>
          
          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors cursor-pointer">
              Clear Filters
            </button>
            <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer hover:opacity-90 active:scale-95 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* 5. ENTERPRISE POLICY TABLE */}
      <div className="bg-white dark:bg-[#0b1120] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" /> All Policies
          </h2>
          <select className="text-xs font-bold text-slate-500 bg-transparent outline-none cursor-pointer">
            <option>Sort By: Recently Updated</option>
            <option>Sort By: Policy Expiry</option>
            <option>Sort By: Premium Amount</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Policy ID</th>
                <th className="px-6 py-4">Policy Holder</th>
                <th className="px-6 py-4">Provider & Plan</th>
                <th className="px-6 py-4">Coverage</th>
                <th className="px-6 py-4">Premium</th>
                <th className="px-6 py-4">Valid Until</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium">
              {policies.map((policy, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setSelectedPolicy(policy)}>
                      {policy.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{policy.holder}</p>
                    <p className="text-[10px] font-mono text-slate-500">{policy.memberId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{policy.provider}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{policy.type} • {policy.plan}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-300">{policy.coverage}</td>
                  <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-300">{policy.premium}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{policy.validUntil}</td>
                  <td className="px-6 py-4">{getStatusBadge(policy.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedPolicy(policy)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs font-bold text-blue-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800/50 rounded-lg transition-all cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing 1-5 of 12,486 policies</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Previous</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Next</button>
          </div>
        </div>
      </div>

      {/* 6. POLICY DETAILS DRAWER */}
      <AnimatePresence>
        {selectedPolicy && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPolicy(null)}
              className="fixed inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Centered Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
              >
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Policy {selectedPolicy.id}</h2>
                    {getStatusBadge(selectedPolicy.status)}
                  </div>
                  <button 
                    onClick={() => setSelectedPolicy(null)}
                    className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Policy Holder Summary */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Policy Holder</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 shrink-0">
                      {selectedPolicy.holder.charAt(0)}
                    </div>
                    <div className="space-y-1.5 w-full">
                      <p className="text-lg font-black text-slate-900 dark:text-white">{selectedPolicy.holder}</p>
                      <p className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit">Member ID: {selectedPolicy.memberId}</p>
                      
                      <div className="grid grid-cols-2 gap-y-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><Calendar className="w-3.5 h-3.5" /> {selectedPolicy.dob}</div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><MapPin className="w-3.5 h-3.5" /> {selectedPolicy.city}</div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><Phone className="w-3.5 h-3.5" /> {selectedPolicy.phone}</div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><Mail className="w-3.5 h-3.5" /> Email on file</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Info */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Policy Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Provider</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPolicy.provider}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Plan</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPolicy.plan}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Policy Type</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPolicy.type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Valid Until</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPolicy.validUntil}</p>
                    </div>
                  </div>
                </div>

                {/* Coverage Details */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Coverage Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Sum Insured</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">{selectedPolicy.coverage}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                      <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-cyan-400 mb-1">Available Balance</p>
                      <p className="text-base font-black text-blue-700 dark:text-cyan-300">₹7,85,000</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Deductible</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">₹10,000</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Room Limit</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">₹5k/day</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Co-Pay</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">10%</p>
                    </div>
                  </div>
                </div>

                {/* Members Covered */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Members Covered</h3>
                  <div className="space-y-2">
                    {selectedPolicy.members.map((member: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">
                          {member.relation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Key Benefits Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Hospitalization', 'Cashless', 'Day Care', 'Pre/Post Hospitalization', 'Ambulance', 'Maternity'].map((benefit, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-4"></div>
              </div>

              {/* Modal Sticky Footer Actions */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120] shrink-0 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
                <button 
                  onClick={() => setShowPreAuthModal(true)}
                  className="w-full sm:flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <ActivitySquare className="w-4 h-4" /> Start Pre-Authorization
                </button>
                <div className="flex gap-3 w-full sm:flex-1">
                  <button 
                    onClick={() => setShowClaimsModal(true)}
                    className="flex-1 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Claims
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`flex-1 py-2.5 font-bold text-xs rounded-xl border cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-95 ${
                      isDownloading 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isDownloading ? (
                      <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download Policy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>

      {/* CREATE POLICY MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Create New Policy</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Policy Holder Name</label>
                  <input type="text" placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Provider</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500">
                      <option>Star Health</option><option>HDFC ERGO</option><option>Niva Bupa</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Policy Type</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500">
                      <option>Family</option><option>Individual</option><option>Corporate</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Coverage Amount (₹)</label>
                  <input type="number" placeholder="1000000" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                <button 
                  onClick={() => { setShowCreateModal(false); handleAction('New policy created successfully.'); }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20"
                >
                  Save Policy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* START PRE-AUTH MODAL */}
      <AnimatePresence>
        {showPreAuthModal && selectedPolicy && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreAuthModal(false)} className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Start Pre-Authorization</h2>
                <button onClick={() => setShowPreAuthModal(false)} className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-2">
                  <p className="text-xs font-bold text-blue-800 dark:text-cyan-400">Initiating request for {selectedPolicy.holder} ({selectedPolicy.id})</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hospital / Clinic</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500">
                    <option>Apollo Hospitals</option><option>Fortis Healthcare</option><option>Max Super Speciality</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Estimated Amount (₹)</label>
                  <input type="number" placeholder="50000" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Diagnosis Details</label>
                  <textarea rows={3} placeholder="Enter preliminary diagnosis..." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"></textarea>
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                <button 
                  onClick={() => { setShowPreAuthModal(false); handleAction('Pre-Authorization request submitted.'); }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW CLAIMS MODAL */}
      <AnimatePresence>
        {showClaimsModal && selectedPolicy && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowClaimsModal(false)} className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Claims History</h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">For {selectedPolicy.holder} ({selectedPolicy.id})</p>
                </div>
                <button onClick={() => setShowClaimsModal(false)} className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr><th className="px-4 py-3">Claim ID</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">CLM-8812</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 Aug 2026</td>
                      <td className="px-4 py-3 font-black text-slate-900 dark:text-white">₹45,000</td>
                      <td className="px-4 py-3"><span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Settled</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">CLM-8294</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">03 Feb 2026</td>
                      <td className="px-4 py-3 font-black text-slate-900 dark:text-white">₹1,20,000</td>
                      <td className="px-4 py-3"><span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Settled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Search, Download, Calendar, Filter, X, 
  CheckCircle2, AlertCircle, Clock, ChevronRight, FileText,
  IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Landmark, Activity, Wallet
} from 'lucide-react';

type Settlement = {
  id: string;
  patient: string;
  hospital: string;
  approvedAmount: number;
  settlementAmount: number;
  paymentType: string;
  status: 'Settled' | 'Processing' | 'Pending' | 'Failed';
  date: string;
  policyId: string;
  treatment: string;
  hospitalDeduction: number;
  paymentMethod: string;
  transactionId: string;
  bankRef: string;
};

const SETTLEMENTS: Settlement[] = [
  {
    id: 'CLM-10245',
    patient: 'Arun Kumar',
    hospital: 'Apollo Central Health City',
    approvedAmount: 185000,
    settlementAmount: 175000,
    paymentType: 'Hospital Settlement',
    status: 'Settled',
    date: '28 Aug 2026',
    policyId: 'MED-2026-00125',
    treatment: 'Cardiac Procedure',
    hospitalDeduction: 10000,
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN847291',
    bankRef: 'NEX458291'
  },
  {
    id: 'CLM-10246',
    patient: 'Priya S',
    hospital: 'Kauvery Hospital',
    approvedAmount: 92000,
    settlementAmount: 85000,
    paymentType: 'Hospital Settlement',
    status: 'Processing',
    date: '30 Aug 2026',
    policyId: 'MED-2026-00342',
    treatment: 'Appendectomy',
    hospitalDeduction: 7000,
    paymentMethod: 'NEFT Transfer',
    transactionId: 'PENDING',
    bankRef: 'PENDING'
  },
  {
    id: 'CLM-10247',
    patient: 'Rahul M',
    hospital: 'Fortis Hospital',
    approvedAmount: 240000,
    settlementAmount: 240000,
    paymentType: 'Hospital Settlement',
    status: 'Settled',
    date: '31 Aug 2026',
    policyId: 'MED-2026-00812',
    treatment: 'Orthopedic Surgery',
    hospitalDeduction: 0,
    paymentMethod: 'RTGS',
    transactionId: 'TXN847298',
    bankRef: 'HDF458299'
  },
  {
    id: 'CLM-10248',
    patient: 'Meena R',
    hospital: 'MIOT International',
    approvedAmount: 120000,
    settlementAmount: 110000,
    paymentType: 'Hospital Settlement',
    status: 'Pending',
    date: '01 Sep 2026',
    policyId: 'MED-2026-00995',
    treatment: 'Chemotherapy Session',
    hospitalDeduction: 10000,
    paymentMethod: 'Awaiting Initiation',
    transactionId: 'N/A',
    bankRef: 'N/A'
  }
];

const PAYOUTS = [
  { id: 'PAY-1021', claimId: 'CLM-10245', amount: 4250, date: 'Aug 28', status: 'Paid' },
  { id: 'PAY-1022', claimId: 'CLM-10246', amount: 2800, date: 'Aug 30', status: 'Pending' },
  { id: 'PAY-1023', claimId: 'CLM-10247', amount: 5100, date: 'Aug 31', status: 'Paid' },
];

const CHART_DATA = [
  { month: 'April', approved: 42, settled: 38 },
  { month: 'May', approved: 55, settled: 51 },
  { month: 'June', approved: 48, settled: 45 },
  { month: 'July', approved: 60, settled: 52 },
  { month: 'August', approved: 75, settled: 68 },
];

export const SettlementsView: React.FC = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  
  // Draft Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Applied Filters
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');
  const [appliedType, setAppliedType] = useState('');

  const filteredSettlements = SETTLEMENTS.filter(s => {
    if (appliedSearch && !(
      s.id.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      s.patient.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      s.hospital.toLowerCase().includes(appliedSearch.toLowerCase())
    )) return false;
    
    if (appliedStatus && appliedStatus !== 'All' && s.status.toLowerCase() !== appliedStatus.toLowerCase()) return false;
    if (appliedType && s.paymentType.toLowerCase() !== appliedType.toLowerCase()) return false;
    
    return true;
  });

  const applyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedStatus(statusFilter);
    setAppliedType(typeFilter);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    setAppliedSearch('');
    setAppliedStatus('');
    setAppliedType('');
  };

  return (
    <div className="space-y-8 pb-20 font-sans select-none">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settlements & Payouts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Track claim settlements, hospital payments, and agent payouts in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button 
            onClick={() => window.alert('Date Range Picker will open here.')}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button 
            onClick={() => window.alert('Exporting Settlements Report...')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IndianRupee className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Total Settlement Amount</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">₹48.6L</p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% from last month
            </p>
          </div>
        </div>
        
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Settled Claims</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">328</p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8.2% this month
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Pending Settlements</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">42</p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1">
              Requires attention
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-cyan-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">This Month Payouts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">₹12.8L</p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +15.6% from last month
            </p>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS */}
      <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Claim ID, Patient or Hospital..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900 dark:text-white transition-all"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="">Settlement Status</option>
            <option value="All">All</option>
            <option value="Settled">Settled</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="">Payment Type</option>
            <option value="Hospital Settlement">Hospital Settlement</option>
            <option value="Agent Commission">Agent Commission</option>
            <option value="Refund">Refund</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={clearFilters}
            className="px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
          <button 
            onClick={applyFilters}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </section>

      {/* 4. SETTLEMENT TRANSACTIONS TABLE */}
      <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" /> Settlement Transactions
          </h3>
          <span className="text-xs font-bold text-slate-500">{filteredSettlements.length} Results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#070c18]/80 text-[10px] uppercase tracking-wider font-black text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 font-black">Claim ID</th>
                <th className="px-6 py-4 font-black">Patient & Hospital</th>
                <th className="px-6 py-4 font-black">Financials</th>
                <th className="px-6 py-4 font-black">Payment Type</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Date</th>
                <th className="px-6 py-4 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-bold">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredSettlements.map((s, i) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{s.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{s.patient}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">{s.hospital}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-500">Appr: ₹{s.approvedAmount.toLocaleString('en-IN')}</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Settled: ₹{s.settlementAmount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {s.paymentType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        s.status === 'Settled' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30' :
                        s.status === 'Processing' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/30' :
                        s.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800/30' :
                        'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/30'
                      }`}>
                        {s.status === 'Settled' && <CheckCircle2 className="w-3 h-3" />}
                        {s.status === 'Processing' && <Activity className="w-3 h-3" />}
                        {s.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {s.status === 'Failed' && <X className="w-3 h-3" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {s.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedSettlement(s)}
                        className="inline-flex items-center gap-1 text-sm font-black text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        View <ArrowUpRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MULTI-COLUMN SECTION: Agent Payouts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 6. AGENT PAYOUT SECTION */}
        <section className="col-span-1 lg:col-span-2 space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">My Payouts</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20"><Wallet className="w-12 h-12" /></div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-100 mb-1 relative z-10">Available Payout</p>
              <p className="text-2xl font-black relative z-10">₹1,24,500</p>
            </div>
            
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Paid This Month</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹3,82,000</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Pending Commission</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-500">₹42,500</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Agent Payout History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800/50">
                    <th className="px-4 py-3">Payout ID</th>
                    <th className="px-4 py-3">Claim ID</th>
                    <th className="px-4 py-3">Commission</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {PAYOUTS.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-white">{p.id}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-500">{p.claimId}</td>
                      <td className="px-4 py-3 text-xs font-black text-slate-900 dark:text-white">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-500">{p.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase ${
                          p.status === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {p.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-xs font-bold text-blue-600 dark:text-cyan-400 cursor-pointer hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 7. SETTLEMENT ANALYTICS */}
        <section className="col-span-1 space-y-4 flex flex-col">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Settlement Overview</h2>
          
          <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex-1 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-6">Monthly Processing</h3>
            
            <div className="flex-1 flex items-end gap-2 sm:gap-4 h-48 mt-auto border-b border-slate-200 dark:border-slate-700 pb-2 relative">
              {/* Y-axis lines (decorative) */}
              <div className="absolute inset-x-0 bottom-1/4 border-t border-slate-100 dark:border-slate-800/50 w-full" />
              <div className="absolute inset-x-0 bottom-2/4 border-t border-slate-100 dark:border-slate-800/50 w-full" />
              <div className="absolute inset-x-0 bottom-3/4 border-t border-slate-100 dark:border-slate-800/50 w-full" />
              <div className="absolute inset-x-0 top-0 border-t border-slate-100 dark:border-slate-800/50 w-full" />

              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 group relative z-10 h-full">
                  <div className="w-full max-w-[40px] flex items-end gap-0.5 sm:gap-1 h-full">
                    <div 
                      className="w-1/2 bg-blue-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400"
                      style={{ height: `${(d.approved / 80) * 100}%` }}
                      title={`Approved: ${d.approved}`}
                    />
                    <div 
                      className="w-1/2 bg-emerald-500/90 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-400"
                      style={{ height: `${(d.settled / 80) * 100}%` }}
                      title={`Settled: ${d.settled}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 pt-2">{d.month.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 pt-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-sm bg-blue-500/80"></div> Total Approved
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-sm bg-emerald-500/90"></div> Total Settled
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 flex flex-col justify-center items-center text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-1">Success Rate</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">97.4%</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 flex flex-col justify-center items-center text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-500 mb-1">Avg Process Time</p>
              <p className="text-xl font-black text-blue-700 dark:text-cyan-400">2.4 Days</p>
            </div>
          </div>

        </section>
      </div>

      {/* 5. DETAILS DRAWER */}
      <AnimatePresence>
        {selectedSettlement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSettlement(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0b1120] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
                <div>
                  <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                    Settlement #{selectedSettlement.id.split('-')[1]}
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                    selectedSettlement.status === 'Settled' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30' :
                    selectedSettlement.status === 'Processing' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/30' :
                    selectedSettlement.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800/30' :
                    'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/30'
                  }`}>
                    {selectedSettlement.status === 'Settled' ? <CheckCircle2 className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                    Settlement {selectedSettlement.status}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedSettlement(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer self-start"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
                
                {/* SECTION 1 */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Claim Information
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Claim ID</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{selectedSettlement.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Patient</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedSettlement.patient}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Policy ID</span>
                      <span className="text-sm font-mono font-medium text-blue-600 dark:text-cyan-400">{selectedSettlement.policyId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Hospital</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-right max-w-[150px] truncate">{selectedSettlement.hospital}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Treatment</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{selectedSettlement.treatment}</span>
                    </div>
                  </div>
                </section>

                {/* SECTION 2 */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5" /> Financial Summary
                  </h3>
                  <div className="bg-white dark:bg-[#0b1120] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Approved Claim Amount</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">₹{selectedSettlement.approvedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-500">
                      <span className="text-xs font-medium">Hospital Deduction (Co-pay/Non-med)</span>
                      <span className="text-sm font-bold">- ₹{selectedSettlement.hospitalDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-3 mt-1 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Final Settlement Amount</span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{selectedSettlement.settlementAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </section>

                {/* SECTION 3 */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5" /> Payment Information
                  </h3>
                  <div className="space-y-4 text-sm font-medium">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Payment Method</p>
                      <p className="text-slate-800 dark:text-slate-200">{selectedSettlement.paymentMethod}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Transaction ID</p>
                        <p className="font-mono text-slate-800 dark:text-slate-200">{selectedSettlement.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Bank Reference</p>
                        <p className="font-mono text-slate-800 dark:text-slate-200">{selectedSettlement.bankRef}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Settlement Date</p>
                        <p className="text-slate-800 dark:text-slate-200">{selectedSettlement.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Payment Status</p>
                        <p className={`font-bold ${selectedSettlement.status === 'Settled' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500'}`}>
                          {selectedSettlement.status === 'Settled' ? 'Completed' : selectedSettlement.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
              
              <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#070c18] flex flex-col sm:flex-row gap-3 shrink-0">
                <button 
                  onClick={() => alert(`Receipt downloaded for TXN: ${selectedSettlement.transactionId}`)}
                  className="flex-1 py-3 px-4 bg-white dark:bg-[#0b1120] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Receipt
                </button>
                <button className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
                  View Claim Details
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

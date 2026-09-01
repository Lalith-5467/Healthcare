import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, FileText, CheckCircle2, Clock, IndianRupee, Search, 
  ChevronRight, AlertTriangle, Building2, Zap, ArrowUpRight, Activity, 
  Percent, FileCheck, Check, Sparkles, Filter
} from 'lucide-react';
import { useInsuranceWorkflow } from '../../../utils/insuranceWorkflowStorage';

interface InsuranceOverviewViewProps {
  onNavigate: (id: string) => void;
  onSelectClaim?: (insuranceId: string) => void;
}

export const InsuranceOverviewView: React.FC<InsuranceOverviewViewProps> = ({ onNavigate, onSelectClaim }) => {
  const { records } = useInsuranceWorkflow();

  const totalActivePolicies = records.filter(r => r.policyStatus === 'Active').length;
  const allCurrentClaims = records.filter(r => r.currentClaim !== null).map(r => ({
    ...r.currentClaim!,
    patientName: r.patientName,
    policyName: r.policyName
  }));
  const allPastClaims = records.flatMap(r => r.claims.map(c => ({
    ...c,
    patientName: r.patientName,
    policyName: r.policyName
  })));

  const newClaimsCount = allCurrentClaims.filter(c => c.status === 'New').length;
  const underReviewCount = allCurrentClaims.filter(c => c.status === 'Under Review').length;
  const approvedCount = allPastClaims.filter(c => c.status === 'Approved' || c.status === 'Settled').length;
  const totalPayout = allPastClaims.reduce((acc, c) => acc + (c.approvedAmount || 0), 0);

  const handleClaimClick = (insuranceId: string) => {
    if (onSelectClaim) {
      onSelectClaim(insuranceId);
    } else {
      onNavigate('profile');
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. GREETING & QUICK SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> IRDAI TPA Clearinghouse 2.0
            </div>
            <span className="px-3 py-1 text-[11px] font-mono font-bold text-slate-300 bg-white/5 rounded-full border border-white/10">
              IRDAI-Reg: TPA-019/HLT
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Insurance & Cashless Pre-Auth Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Connected to Ayushman Bharat (ABDM) health records, live hospital billing gateways, e-prescriptions, and cashless discharge adjudication.
          </p>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button 
            onClick={() => onNavigate('search')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Patient Policy ID</span>
          </button>

          <button 
            onClick={() => onNavigate('settlements')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-2xl font-bold text-xs border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          >
            <IndianRupee className="w-4 h-4 text-cyan-300" />
            <span>Settlement Ledger</span>
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {[
          { label: 'Active Policies', value: totalActivePolicies.toString(), icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', note: '100% KYC Verified' },
          { label: 'New Cashless Claims', value: newClaimsCount.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', note: 'Requires Adjudication' },
          { label: 'Under Review', value: underReviewCount.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', note: 'Hospital Query Pending' },
          { label: 'Settled Discharges', value: approvedCount.toString(), icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20', note: 'Direct NEFT Release' },
          { label: 'Total Reimbursed', value: `₹${(totalPayout / 1000).toFixed(1)}k`, icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20', note: 'This Financial Year' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{stat.note}</span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN WORKSTATION TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE CLAIMS STREAM (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Real-Time Hospital Claims Stream
                </h2>
                <p className="text-xs text-slate-400">Click any patient claim to review hospital billing and approve cashless discharge.</p>
              </div>

              <button
                onClick={() => onNavigate('search')}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                Search by ID <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800/60">
              {records.map((record) => {
                const currentClaim = record.currentClaim;
                const pastClaim = record.claims[0];
                const displayClaim = currentClaim || pastClaim;

                if (!displayClaim) return null;

                return (
                  <div 
                    key={record.insuranceId}
                    onClick={() => handleClaimClick(record.insuranceId)}
                    className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer group gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                        {record.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                            {displayClaim.claimId}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            ({record.insuranceId})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {record.patientName} • {displayClaim.treatment} • {displayClaim.hospital}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          ₹{displayClaim.submittedAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">Claimed</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                          displayClaim.status === 'Approved' || displayClaim.status === 'Settled'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : displayClaim.status === 'Under Review'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        }`}>
                          {displayClaim.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRE-AUTH AUTOMATION, HOSPITAL INTEGRATION & AUDIT (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* INSTANT CASHLESS GATEWAY MODULE */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 border border-blue-500/30 text-white shadow-lg space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-300" />
                <h3 className="text-sm font-black text-white">Automated Pre-Auth Adjudication</h3>
              </div>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-md border border-cyan-400/30">
                AI Auto-Verify
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              OCR bill verification active. 94% of standard OPD diagnostic and ICU pre-authorizations are verified in &lt;15 seconds.
            </p>

            <button 
              onClick={() => onNavigate('search')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Verify Patient Pre-Auth Code
            </button>
          </div>

          {/* NETWORK HOSPITALS STATUS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                Hospital Clearinghouse Node
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                12 Nodes Online
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Apollo Central Super Specialty', city: 'Bangalore', speed: '< 8s sync', status: 'Online' },
                { name: 'Fortis Healthcare ICU Unit', city: 'Mumbai', speed: '< 12s sync', status: 'Online' },
                { name: 'Manipal Heart Foundation', city: 'Delhi NCR', speed: '< 10s sync', status: 'Online' }
              ].map((h, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{h.name}</h4>
                    <p className="text-[10px] text-slate-500">{h.city} • {h.speed}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {h.status}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('hospitals')}
              className="w-full py-2 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline text-center cursor-pointer block"
            >
              Manage 850+ Cashless Network Hospitals →
            </button>
          </div>

          {/* IRDAI COMPLIANCE TELEMETRY */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">IRDAI Audit Matrix</span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Compliant
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black text-slate-900 dark:text-white">99.9%</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">ABDM Auto-Audit</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black text-slate-900 dark:text-white">0 Flags</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Fraud Score</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};


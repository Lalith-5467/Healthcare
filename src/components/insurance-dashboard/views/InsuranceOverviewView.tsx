import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, FileText, CheckCircle2, Clock, IndianRupee, Search, 
  ChevronRight, Building2, Zap, ArrowRight, ArrowUpRight, TrendingUp, Check
} from 'lucide-react';
import { useInsuranceWorkflow } from '../../../utils/insuranceWorkflowStorage';
import { getGreeting } from '../../../utils/greeting';

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

  // Helper for rendering a small SVG sparkline
  const renderSparkline = (colorClass: string) => (
    <svg className={`absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none ${colorClass}`} viewBox="0 0 100 30" preserveAspectRatio="none">
      <path d="M0 30 L 10 20 L 25 25 L 40 10 L 55 18 L 70 5 L 85 15 L 100 0 L 100 30 Z" fill="currentColor" />
      <path d="M0 30 L 10 20 L 25 25 L 40 10 L 55 18 L 70 5 L 85 15 L 100 0" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="space-y-8 pb-20 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. GREETING & QUICK SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[2rem] bg-white dark:bg-[#0b1120] dark:bg-gradient-to-br dark:from-[#0b1120] dark:via-[#0f1d35] dark:to-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 dark:bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-100 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-400 text-[11px] font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-400/20 shadow-sm dark:shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <ShieldCheck className="w-4 h-4" /> IRDAI TPA Clearinghouse 2.0
            </div>
            <span className="px-3 py-1.5 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-700/50">
              IRDAI-Reg: TPA-019/HLT
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
            {getGreeting()}, Insurance & Cashless Pre-Auth Desk
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
            Connected to Ayushman Bharat (ABDM) health records, live hospital billing gateways, e-prescriptions, and cashless discharge adjudication.
          </p>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 relative z-10 shrink-0">
          <button 
            onClick={() => onNavigate('search')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-7 py-4 rounded-2xl font-bold text-sm shadow-md dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Patient Policy ID</span>
          </button>

          <button 
            onClick={() => onNavigate('settlements')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white px-6 py-4 rounded-2xl font-semibold text-sm border border-slate-200 dark:border-slate-600/50 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <IndianRupee className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Settlement Ledger</span>
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Policies', value: totalActivePolicies.toString(), icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', borderTop: 'border-t-emerald-500', sparkColor: 'text-emerald-500' },
          { label: 'New Cashless Claims', value: newClaimsCount.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', borderTop: 'border-t-blue-500', sparkColor: 'text-blue-500' },
          { label: 'Under Review', value: underReviewCount.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', borderTop: 'border-t-amber-500', sparkColor: 'text-amber-500' },
          { label: 'Settled Discharges', value: approvedCount.toString(), icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-500/10', borderTop: 'border-t-teal-500', sparkColor: 'text-teal-500' },
          { label: 'Total Reimbursed', value: `₹${(totalPayout / 1000).toFixed(1)}k`, icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-500/10', borderTop: 'border-t-indigo-500', sparkColor: 'text-indigo-500' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden bg-white dark:bg-[#0b1120] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-t-2 ${stat.borderTop} shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
          >
            {/* Sparkline Background */}
            {renderSparkline(stat.sparkColor)}

            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className={`w-4 h-4 ${stat.color} opacity-60`} />
            </div>
            
            <div className="relative z-10">
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN WORKSTATION TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE CLAIMS STREAM (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#0b1120] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-blue-500" /> Real-Time Claims Stream
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Select a claim to review billing and approve cashless discharge.</p>
              </div>

              <button
                onClick={() => onNavigate('search')}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer shrink-0 transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
              >
                Search by ID <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/50 flex-1 overflow-y-auto">
              {records.map((record) => {
                const currentClaim = record.currentClaim;
                const pastClaim = record.claims[0];
                const displayClaim = currentClaim || pastClaim;

                if (!displayClaim) return null;

                return (
                  <div 
                    key={record.insuranceId}
                    onClick={() => handleClaimClick(record.insuranceId)}
                    className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer group gap-4 mb-2 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 shadow-blue-500/20">
                        {record.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                            {displayClaim.claimId}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 rounded">
                            {record.insuranceId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{record.patientName}</span> • {displayClaim.treatment} • {displayClaim.hospital}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 justify-between sm:justify-end shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          ₹{displayClaim.submittedAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">Claimed</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          displayClaim.status === 'Approved' || displayClaim.status === 'Settled'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : displayClaim.status === 'Under Review'
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 relative'
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                        }`}>
                          {displayClaim.status === 'Under Review' && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping opacity-75"></span>
                          )}
                          {displayClaim.status}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                          <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRE-AUTH AUTOMATION, HOSPITAL INTEGRATION & AUDIT (5 COLS) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* INSTANT CASHLESS GATEWAY MODULE */}
          <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0b1120] dark:bg-gradient-to-br dark:from-slate-900 dark:via-[#0b1120] dark:to-[#0f1d35] border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-xl relative overflow-hidden group">
            {/* Background Effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-100 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20 transition-colors duration-700" />
            
            <div className="relative z-10 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/30">
                    <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wide">Automated Pre-Auth Adjudication</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-400/30">
                  AI Active
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  <span>Auto-Approval Rate</span>
                  <span className="text-cyan-600 dark:text-cyan-400">94%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                  OCR bill verification active. Standard OPD/ICU requests verified in &lt;15s.
                </p>
              </div>

              <button 
                onClick={() => onNavigate('search')}
                className="w-full py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                Verify Patient Pre-Auth Code <ArrowUpRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </button>
            </div>
          </div>

          {/* NETWORK HOSPITALS STATUS */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                Hospital Clearinghouse Node
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
                12 Nodes Online
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Apollo Central Super Specialty', city: 'Bangalore', speed: '< 8s sync', status: 'Online' },
                { name: 'Fortis Healthcare ICU Unit', city: 'Mumbai', speed: '< 12s sync', status: 'Online' },
                { name: 'Manipal Heart Foundation', city: 'Delhi NCR', speed: '< 10s sync', status: 'Online' }
              ].map((h, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{h.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{h.city} • <span className="text-blue-600 dark:text-cyan-500">{h.speed}</span></p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('hospitals')}
              className="w-full py-2.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 text-center cursor-pointer block transition-colors bg-blue-50 dark:bg-blue-900/10 rounded-xl"
            >
              Manage 850+ Cashless Network Hospitals →
            </button>
          </div>

          {/* IRDAI COMPLIANCE TELEMETRY */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
            
            <div className="relative z-10 flex items-center justify-between pb-2">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> IRDAI Audit Matrix
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
                Compliant
              </span>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <p className="text-xl font-black text-slate-900 dark:text-white mb-1">99.9%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ABDM Auto-Audit</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-1 flex items-center justify-center gap-1">
                  <Check className="w-5 h-5" /> 0 Flags
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fraud Score</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

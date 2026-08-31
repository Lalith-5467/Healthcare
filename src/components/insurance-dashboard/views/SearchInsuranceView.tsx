import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, ScanLine, Calendar, FileText, ChevronRight } from 'lucide-react';
import { useInsuranceWorkflow } from '../../../utils/insuranceWorkflowStorage';

interface SearchInsuranceViewProps {
  onSearchSuccess: (insuranceId: string) => void;
}

export const SearchInsuranceView: React.FC<SearchInsuranceViewProps> = ({ onSearchSuccess }) => {
  const { searchPolicy } = useInsuranceWorkflow();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
      setIsSearching(false);
      const policy = searchPolicy(searchInput.trim());
      if (policy) {
        setResult(policy);
      } else {
        setError('No insurance policy found for this ID.');
      }
    }, 1000);
  };

  const handleDemoSearch = () => {
    setSearchInput('INS-MC-2026-10245');
    setIsSearching(true);
    setError(null);
    setResult(null);
    setTimeout(() => {
      setIsSearching(false);
      setResult(searchPolicy('INS-MC-2026-10245'));
    }, 1000);
  };

  return (
    <div className="relative min-h-[80vh]">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Search Insurance Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Enter an Insurance ID to securely access policy and claim information.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 dark:bg-[#070c18]/70 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] overflow-hidden p-8 sm:p-12 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/0 dark:from-blue-500/5 dark:to-transparent pointer-events-none"></div>
              <form onSubmit={handleSearch} className="space-y-8 relative z-10">
                <div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                      <Search className="w-6 h-6 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="e.g. INS-MC-2026-10245"
                      className="relative w-full bg-white dark:bg-[#0f172a]/80 border-2 border-slate-200 dark:border-blue-500/30 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:text-white font-black text-xl transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 tracking-wide"
                    />
                  </div>
                  {error && <p className="text-rose-500 text-sm font-bold mt-3 pl-2">{error}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex-1 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 disabled:opacity-50 text-lg relative overflow-hidden group flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">{isSearching ? 'Searching...' : 'Search Policy'}</span>
                  </button>
                  <button
                    type="button"
                    className="px-8 py-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black rounded-2xl transition-all hover:-translate-y-1 shadow-sm flex items-center justify-center gap-2 group"
                  >
                    <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Scan QR</span>
                  </button>
                </div>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800/50 text-center relative z-10">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 tracking-widest uppercase">Development / Demo</p>
                <button 
                  onClick={handleDemoSearch}
                  disabled={isSearching}
                  className="px-6 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-transparent dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  Use Demo ID (INS-MC-2026-10245)
                </button>
              </div>
            </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-[#070c18]/80 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] overflow-hidden relative z-10"
          >
            {/* Glowing Emerald Header Banner */}
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-8 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 ring-4 ring-emerald-300/50 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase relative z-10 drop-shadow-md">
                Insurance ID Verified
              </h2>
              <p className="text-emerald-50 font-medium mt-1 relative z-10">Verification successful. View details below.</p>
            </div>
            
            <div className="p-8 sm:p-10">
              
              {/* Premium Patient Digital ID Card Style */}
              <div className="flex items-center gap-5 mb-10 pb-8 border-b border-slate-200 dark:border-slate-800/60">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center justify-center font-black text-slate-400 text-3xl shrink-0 overflow-hidden">
                    {result.patientName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-[#070c18] w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{result.patientName}</h3>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Verified Patient (ID: {result.insuranceId})</p>
                </div>
              </div>
              
              {/* Frosted Glass Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-white/50 dark:bg-[#0b1120]/60 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm hover:border-emerald-400/50 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Policy Plan
                  </p>
                  <p className="text-base font-black text-slate-900 dark:text-white leading-tight">{result.policyName}</p>
                </div>
                <div className="p-5 bg-white/50 dark:bg-[#0b1120]/60 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm hover:border-emerald-400/50 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verification Status
                  </p>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 leading-tight">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                    Active & Verified
                  </p>
                </div>
                <div className="p-5 bg-white/50 dark:bg-[#0b1120]/60 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-blue-500/20 shadow-sm hover:border-blue-400/50 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Coverage Start Date
                  </p>
                  <p className="text-base font-black text-slate-900 dark:text-white leading-tight">{result.policyStartDate}</p>
                </div>
                <div className="p-5 bg-white/50 dark:bg-[#0b1120]/60 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-blue-500/20 shadow-sm hover:border-blue-400/50 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Coverage End Date
                  </p>
                  <p className="text-base font-black text-slate-900 dark:text-white leading-tight">{result.policyEndDate}</p>
                </div>
              </div>

              <div className="flex">
                <button 
                  onClick={() => onSearchSuccess(result.insuranceId)}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1 text-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">View Patient Insurance Profile</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        <div className="mt-12 mx-auto max-w-xl">
          <div className="flex items-center justify-center gap-4 px-6 py-4 rounded-full bg-white/60 dark:bg-[#0b1120]/80 backdrop-blur-md border border-slate-200/50 dark:border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] text-slate-700 dark:text-slate-300 text-xs font-bold text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)] shrink-0">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-left leading-relaxed">
              <span className="text-slate-900 dark:text-white font-black uppercase tracking-wider block sm:inline">Secured with AES-256 Encryption.</span> Access is strictly limited to authorized personnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

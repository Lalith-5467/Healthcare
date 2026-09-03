import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, FileText, Clock, AlertTriangle, ArrowRight, X, Sparkles } from 'lucide-react';
import { useInsuranceWorkflow, type InsurancePolicyRecord } from '../../../utils/insuranceWorkflowStorage';

interface SearchInsuranceViewProps {
  onSearchSuccess: (insuranceId: string) => void;
}

export const SearchInsuranceView: React.FC<SearchInsuranceViewProps> = ({ onSearchSuccess }) => {
  const { searchPolicy } = useInsuranceWorkflow();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InsurancePolicyRecord | null>(null);

  // Auto-search immediately on input change if query matches
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (!trimmed) {
      setResult(null);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      const match = searchPolicy(trimmed);
      if (match) {
        setResult(match);
        setError(null);
      } else if (trimmed.length > 5) {
        setError(`No insurance policy found matching "${trimmed}". Please verify the Insurance ID.`);
        setResult(null);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setError(null);

    setTimeout(() => {
      setIsSearching(false);
      const match = searchPolicy(trimmed);
      if (match) {
        setResult(match);
        setError(null);
      } else {
        setError(`No insurance policy found matching "${trimmed}".`);
        setResult(null);
      }
    }, 250);
  };

  const handleSelectSample = (id: string) => {
    setSearchInput(id);
    const match = searchPolicy(id);
    if (match) {
      setResult(match);
      setError(null);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 font-sans select-none">
      
      {/* TITLE & HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Insurance Incharge Desk
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Search Patient Insurance & Claim
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto mt-1">
          Enter a Patient Insurance ID to look up policy coverage and process active claims.
        </p>
      </div>

      {/* SEARCH INPUT CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-4 mb-6">
        <form onSubmit={handleManualSearch} className="space-y-3">
          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Enter Patient Insurance ID
          </label>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. INS-MC-2026-10245"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-12 py-3.5 outline-none focus:border-blue-500 dark:focus:border-cyan-400 text-slate-900 dark:text-white font-bold text-base transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              disabled={isSearching || !searchInput}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Verifying...' : 'Search Policy'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* QUICK SAMPLES */}
        {!searchInput && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Sample Patient IDs:</span>
            <button
              type="button"
              onClick={() => handleSelectSample('INS-MC-2026-10245')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 font-mono font-bold text-[11px]"
            >
              INS-MC-2026-10245 (Ragul Kumar)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('INS-AK-2026-9901')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-mono font-bold text-[11px]"
            >
              INS-AK-2026-9901 (Abinesh Kumar)
            </button>
          </div>
        )}
      </div>

      {/* MATCHED RECORD VIEW */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-300 dark:border-emerald-800/60 shadow-xl overflow-hidden"
          >
            {/* VERIFIED BANNER */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Insurance Record Found</h3>
                  <p className="text-xs text-emerald-100 font-medium">Digital ABHA Health Token: {result.patientId}</p>
                </div>
              </div>

              <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-lg">
                {result.policyStatus}
              </span>
            </div>
            
            <div className="p-6 sm:p-8 space-y-6">
              {/* PATIENT HEADER */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                    {result.patientName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{result.patientName}</h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Insurance ID: <span className="font-mono text-blue-600 dark:text-cyan-400 font-black">{result.insuranceId}</span> • Plan: {result.policyName}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* POLICY DETAILS TILES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Policy Number</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5 font-mono truncate">{result.policyNumber}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Coverage</p>
                  <p className="text-xs font-black text-teal-600 dark:text-cyan-400 mt-0.5">₹{(result.coverageAmount).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Remaining Limit</p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{(result.remainingCoverage).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Validity</p>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5">{result.policyEndDate}</p>
                </div>
              </div>

              {/* ACTIVE CLAIM SPOTLIGHT */}
              {result.currentClaim ? (
                <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Active Claim for {result.patientName}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                      {result.currentClaim.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">
                        {result.currentClaim.treatment} ({result.currentClaim.claimId})
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {result.currentClaim.hospital} • Submitted: {result.currentClaim.admissionDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Claimed Amount</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">
                        ₹{(result.currentClaim.submittedAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No pending claims for {result.patientName}. All past claims settled.</span>
                </div>
              )}

              {/* ACTION BUTTON */}
              <button 
                onClick={() => onSearchSuccess(result.insuranceId)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>Open Full Claim Review & Approval Deck</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

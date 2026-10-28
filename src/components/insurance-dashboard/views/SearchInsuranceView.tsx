import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, FileText, Clock, AlertTriangle, ArrowRight, X, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { useInsuranceWorkflow, type InsurancePolicyRecord } from '../../../utils/insuranceWorkflowStorage';
import { useLanguage } from '../../../context/LanguageContext';

interface SearchInsuranceViewProps {
  onSearchSuccess: (insuranceId: string) => void;
  initialQuery?: string;
}

export const SearchInsuranceView: React.FC<SearchInsuranceViewProps> = ({ onSearchSuccess, initialQuery }) => {
  const { searchPolicy, records } = useInsuranceWorkflow();
  const { t } = useLanguage();
  const [searchInput, setSearchInput] = useState(initialQuery || '');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InsurancePolicyRecord | null>(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setSearchInput(initialQuery.trim());
      const match = searchPolicy(initialQuery.trim());
      if (match) {
        setResult(match);
        setError(null);
      }
    }
  }, [initialQuery]);

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

  const sampleCards = records.slice(0, 4).map((r, i) => {
    const hasActiveClaim = r.currentClaim && (r.currentClaim.status === 'New' || r.currentClaim.status === 'Under Review');
    return {
      id: r.insuranceId,
      label: hasActiveClaim ? `${t(r.patientName)} (${t('Active')}: ${r.currentClaim?.claimId})` : t(r.patientName),
      color: hasActiveClaim 
        ? 'border-amber-500/50 text-amber-700 dark:text-amber-300 font-black bg-amber-50/70 dark:bg-amber-950/40 animate-pulse'
        : i === 0 ? 'border-teal-500/40 text-teal-700 dark:text-cyan-300 font-black bg-teal-50/50 dark:bg-teal-950/30'
        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
    };
  });

  return (
    <div className="max-w-3xl mx-auto py-6 font-sans select-none">
      
      {/* TITLE & HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> {t('Insurance Incharge Desk', 'Insurance Incharge Desk')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('insurance.search.title', 'Search Patient Insurance & Claim')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto mt-1">
          {t('insurance.search.subtitle', 'Enter a Patient Insurance ID to look up policy coverage and process active claims.')}
        </p>
      </div>

      {/* SEARCH INPUT CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-4 mb-6">
        <form onSubmit={handleManualSearch} className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {t('insurance.search.input_label', 'Enter Insurance Card Number or ABHA ID:')}
          </label>
          
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-blue-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('insurance.search.input_placeholder', 'e.g. INS-STAR-2026-94821 or INS-CARE-2026-77402')}
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-24 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="absolute right-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              {isSearching ? t('insurance.search.checking', 'Checking...') : t('insurance.search.lookup_btn', 'Lookup')}
            </button>
          </div>
        </form>

        {/* QUICK DEMO PRESETS */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono">{t('insurance.search.sample_cards', 'Sample Patient Cards:')}</span>
          {sampleCards.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s.id)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:opacity-80 transition-all cursor-pointer shadow-xs ${s.color}`}
            >
              {s.label} ({s.id.slice(-5)})
            </button>
          ))}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2 mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SEARCH RESULT CARD */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-300 dark:border-emerald-800/60 shadow-xl overflow-hidden mb-8"
          >
            {/* VERIFIED BANNER */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">{t('insurance.search.record_found', 'Insurance Record Found')}</h3>
                  <p className="text-xs text-emerald-100 font-medium">{t('insurance.search.digital_token', 'Digital ABHA Health Token')}: {result.patientId}</p>
                </div>
              </div>

              <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-lg">
                {t(result.policyStatus)}
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
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{t(result.patientName)}</h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {t('Insurance ID')}: <span className="font-mono text-blue-600 dark:text-cyan-400 font-black">{result.insuranceId}</span> • {t('Plan')}: {t(result.policyName)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* POLICY DETAILS TILES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t('insurance.search.policy_number', 'Policy Number')}</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5 font-mono truncate">{result.policyNumber}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t('insurance.search.total_coverage', 'Total Coverage')}</p>
                  <p className="text-xs font-black text-teal-600 dark:text-cyan-400 mt-0.5">₹{(result.coverageAmount).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t('insurance.search.remaining_limit', 'Remaining Limit')}</p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{(result.remainingCoverage).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t('insurance.search.validity', 'Validity')}</p>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5">{result.policyEndDate}</p>
                </div>
              </div>

              {/* ACTIVE CLAIM SPOTLIGHT */}
              {result.currentClaim ? (
                <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> {t('insurance.search.active_claim_for', 'Active Claim for')} {t(result.patientName)}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                      {t(result.currentClaim.status)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">
                        {t(result.currentClaim.treatment)} ({result.currentClaim.claimId})
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t(result.currentClaim.hospital)} • {t('Submitted')}: {result.currentClaim.admissionDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{t('insurance.stream.claimed', 'Claimed Amount')}</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">
                        ₹{(result.currentClaim.submittedAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t('insurance.search.no_pending', 'No pending claims for this patient. All past claims settled.')}</span>
                </div>
              )}

              {/* ACTION BUTTON */}
              <button 
                onClick={() => onSearchSuccess(result.insuranceId)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>{t('Open Full Claim Review & Approval Deck')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-8 mx-auto max-w-xl">
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
  );
};

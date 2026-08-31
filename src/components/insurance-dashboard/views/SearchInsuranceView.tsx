import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, ScanLine } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
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
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Insurance ID
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
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 dark:text-white font-bold text-lg"
                  />
                </div>
                {error && <p className="text-rose-500 text-sm font-bold mt-2">{error}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 text-lg"
                >
                  {isSearching ? 'Searching...' : 'Search Policy'}
                </button>
                <button
                  type="button"
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ScanLine className="w-5 h-5" /> Scan QR
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-slate-400 mb-3">DEVELOPMENT / DEMO</p>
              <button 
                onClick={handleDemoSearch}
                disabled={isSearching}
                className="px-6 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-black rounded-lg transition-colors text-sm disabled:opacity-50"
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
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-emerald-200 dark:border-emerald-800/50 shadow-xl shadow-emerald-500/5 overflow-hidden"
          >
            <div className="bg-emerald-500 text-white p-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black">Insurance ID Verified</h2>
            </div>
            
            <div className="p-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Patient Insurance Profile</h3>
              
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center font-black text-blue-600 text-2xl shrink-0">
                  {result.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{result.patientName}</h3>
                  <p className="text-sm font-bold text-slate-500">ID: {result.insuranceId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Policy Plan</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{result.policyName}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-black text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {result.policyStatus}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coverage Start</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{result.policyStartDate}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coverage End</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{result.policyEndDate}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onSearchSuccess(result.insuranceId)}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 text-lg"
                >
                  View Patient Insurance Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-start gap-3 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 max-w-xl mx-auto">
        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-slate-500">
          <span className="text-slate-700 dark:text-slate-300">Protected Insurance Information.</span> Access is limited to information required for insurance processing. Patient medical data is restricted.
        </p>
      </div>
    </div>
  );
};

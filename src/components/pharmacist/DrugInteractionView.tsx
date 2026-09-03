import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Pill, 
  ArrowRight,
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const DrugInteractionView: React.FC = () => {
  const [primaryDrug, setPrimaryDrug] = useState('Warfarin 5mg');
  const [secondaryDrug, setSecondaryDrug] = useState('Aspirin 75mg');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'checker' | 'recent' | 'allergies'>('checker');

  const INTERACTIONS_DATABASE = [
    {
      id: 'INT-01',
      drugA: 'Warfarin 5mg (Oral)',
      drugB: 'Aspirin 75mg (Oral)',
      severity: 'Major Risk',
      severityColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      mechanism: 'Synergistic Anticoagulation & Antiplatelet Hemorrhage Hazard',
      clinicalAction: 'Contraindicated. Monitor INR closely or switch to alternative analgesics.',
      verifiedBy: 'AI Clinical Radar v2.4 (ABDM Pharmacopoeia)'
    },
    {
      id: 'INT-02',
      drugA: 'Atorvastatin 20mg',
      drugB: 'Clarithromycin 500mg',
      severity: 'Severe Risk',
      severityColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      mechanism: 'CYP3A4 Inhibition leading to Rhabdomyolysis Risk',
      clinicalAction: 'Temporarily withhold statin therapy during antibiotic cycle.',
      verifiedBy: 'AI Clinical Radar v2.4'
    },
    {
      id: 'INT-03',
      drugA: 'Metformin 500mg',
      drugB: 'Iodinated Radiocontrast',
      severity: 'Moderate Risk',
      severityColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      mechanism: 'Renal Clearance Competition & Lactic Acidosis',
      clinicalAction: 'Discontinue 48h prior to contrast scan; restart post eGFR check.',
      verifiedBy: 'AI Clinical Radar v2.4'
    }
  ];

  const handleRunCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 600);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider border border-indigo-400/30 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> AI Clinical Pharmacopoeia Radar
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Drug Safety & Interaction Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Real-time cross-checking of active e-prescriptions, multi-drug contraindications, dosage conflicts, and patient allergy triggers.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-white/10 text-cyan-300 text-xs font-mono font-bold border border-white/15 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Database v4.9 Active
          </span>
        </div>
      </div>

      {/* 2. INTERACTIVE CHECKER FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: SCANNER INPUTS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-500" />
              Pair-Wise Interaction Check
            </h3>

            <form onSubmit={handleRunCheck} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Drug / Active Molecule
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={primaryDrug}
                    onChange={(e) => setPrimaryDrug(e.target.value)}
                    placeholder="e.g. Warfarin, Paracetamol"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Secondary Drug / Concurrent Rx
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={secondaryDrug}
                    onChange={(e) => setSecondaryDrug(e.target.value)}
                    placeholder="e.g. Aspirin, Ibuprofen"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {analyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Interaction Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <span>Schedule H / X Auto-Lock Protocol</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Controlled psychotropics & habit-forming narcotics require verified Doctor NMC sign-off before dispensing bypass.
            </p>
          </div>
        </div>

        {/* RIGHT: FLAGGED INTERACTIONS & ACTIVE ALERTS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Verified Interaction Advisory
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {INTERACTIONS_DATABASE.length} Flagged Matches
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {INTERACTIONS_DATABASE.map((item) => (
                <div key={item.id} className="p-5 space-y-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm">
                        {item.drugA} <span className="text-slate-400 font-normal">+</span> {item.drugB}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border ${item.severityColor} self-start sm:self-center`}>
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <strong className="text-slate-900 dark:text-white font-bold">Mechanism: </strong>
                    {item.mechanism}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] font-bold text-teal-700 dark:text-cyan-300">
                      💡 Clinical Advisory: {item.clinicalAction}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>{item.verifiedBy}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Flagged in E-Rx
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

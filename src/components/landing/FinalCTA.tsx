import React from 'react';
import { ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface FinalCTAProps {
  onStartJourney: () => void;
  onExploreFeatures?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartJourney, onExploreFeatures }) => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0b1120] to-[#0f172a] text-white relative overflow-hidden">
      {/* GLOW DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-cyan-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Patient-Centered Personal Health Platform</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Take Control of Your <br className="hidden sm:inline" />
          <span className="text-[#00a896]">
            Health Records.
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Keep your medical information organized, secure, and ready whenever you need it.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartJourney}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#00a896] hover:bg-[#00897b] active:scale-98 rounded-2xl shadow-2xl shadow-teal-900/40 transition-all cursor-pointer gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreFeatures}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all shadow-sm cursor-pointer gap-2"
          >
            <FileText className="w-5 h-5 text-[#00a896]" />
            <span>Explore Features</span>
          </button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> ABDM / ABHA Integrated</span>
          <span>•</span>
          <span>End-to-End Encrypted</span>
          <span>•</span>
          <span>Caregiver Sync Ready</span>
        </div>
      </div>
    </section>
  );
};


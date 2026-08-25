import React from 'react';
import { ArrowRight, ShieldCheck, FileText, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinalCTAProps {
  onStartJourney: () => void;
  onExploreFeatures?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartJourney, onExploreFeatures }) => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PREMIUM FLOATING CTA CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1120] to-teal-950 text-white p-8 sm:p-14 border border-teal-500/20 shadow-2xl overflow-hidden text-center"
        >
          {/* AMBIENT GLOW DECORATIONS */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00a896]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a896]/20 border border-[#00a896]/30 text-teal-300 text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-[#00a896] animate-pulse" />
              <span>Patient-Centered Personal Health Platform</span>
            </div>

            {/* HEADLINE */}
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Take Control of Your <br className="hidden sm:inline" />
              <span className="text-[#00a896]">Health Records Today</span>
            </h2>

            {/* SUBTITLE */}
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Keep your medical information organized, secure, and ready whenever you or your doctor need it.
            </p>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartJourney}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-[#00a896] hover:bg-[#00897b] active:scale-98 rounded-xl shadow-xl shadow-teal-950/50 transition-all cursor-pointer gap-2 border border-teal-500/30"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-md cursor-pointer gap-2"
              >
                <FileText className="w-4 h-4 text-[#00a896]" />
                <span>Explore Features</span>
              </button>
            </div>

            {/* FOOTER BULLETS */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00a896]" /> ABDM / ABHA Integrated
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" /> End-to-End Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> Instant SOS Access
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

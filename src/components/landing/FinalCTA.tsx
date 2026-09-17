import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Activity, 
  QrCode, 
  Heart, 
  Cpu, 
  Shield, 
  Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FinalCTAProps {
  onStartJourney: () => void;
  onExploreFeatures?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartJourney, onExploreFeatures }) => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PREMIUM FLOATING CTA CARD (LOCKED DIMENSIONS: max-w-5xl, p-8 sm:p-14, rounded-3xl) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-gradient-to-br from-[#091322] via-[#07172c] to-[#041a22] text-white p-8 sm:p-14 border border-teal-500/30 ring-1 ring-teal-400/20 shadow-2xl shadow-teal-950/60 overflow-hidden text-center"
        >
          {/* AMBIENT MESH & RADIAL GLOW LAYERS */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00a896]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* SUBTLE HEALTHCARE NETWORK GRID & CONNECTION NODES (BACKGROUND AMBIENCE) */}
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#00a896_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* SVG CIRCUIT CONNECTION NODES & TRAVELING GLOW PARTICLES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00a896" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00a896" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M 50 120 Q 200 40 400 90 T 750 60 T 950 140" fill="none" stroke="url(#circuitGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 80 340 Q 300 380 550 320 T 900 300" fill="none" stroke="url(#circuitGrad)" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>

          {/* FLOATING COMPACT HEALTHCARE 3D ELEMENTS (WITHIN BOUNDARIES) */}
          {/* TOP-LEFT FLOATING SECURITY SHIELD */}
          <motion.div 
            animate={{ 
              y: [-4, 4, -4],
              rotate: [-1, 1.5, -1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="hidden md:flex absolute top-8 left-8 p-3 rounded-2xl bg-white/5 dark:bg-slate-800/40 backdrop-blur-md border border-teal-500/30 shadow-lg items-center gap-2.5 pointer-events-none select-none z-10"
          >
            <div className="p-2 rounded-xl bg-teal-500/20 text-cyan-300 border border-teal-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-cyan-300 font-mono">256-Bit Vault</span>
              <span className="block text-[9px] text-slate-300 font-semibold">ABDM Verified</span>
            </div>
          </motion.div>

          {/* TOP-RIGHT FLOATING DIGITAL HEALTH CARD CHIP */}
          <motion.div 
            animate={{ 
              y: [4, -4, 4],
              rotate: [1, -1.5, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
            className="hidden md:flex absolute top-8 right-8 p-3 rounded-2xl bg-white/5 dark:bg-slate-800/40 backdrop-blur-md border border-cyan-500/30 shadow-lg items-center gap-2.5 pointer-events-none select-none z-10"
          >
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Activity className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-teal-300 font-mono">Live Vitals Sync</span>
              <span className="block text-[9px] text-slate-300 font-semibold">Instant SOS QR</span>
            </div>
          </motion.div>

          {/* MAIN CONTENT STACK */}
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a896]/20 border border-[#00a896]/35 text-teal-300 text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#00a896] animate-pulse" />
              <span>PATIENT-CENTERED PERSONAL HEALTH PLATFORM</span>
            </motion.div>

            {/* HEADLINE */}
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            >
              Take Control of Your <br className="hidden sm:inline" />
              <span className="text-[#00d2be] drop-shadow-[0_2px_14px_rgba(0,210,190,0.4)]">
                Health Records Today
              </span>
            </motion.h2>

            {/* SUBTITLE */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
            >
              Keep your medical information organized, secure, and ready whenever you or your doctor need it.
            </motion.p>

            {/* ACTION BUTTONS */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* PRIMARY GET STARTED BUTTON */}
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartJourney}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-black text-white bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-600 hover:to-cyan-600 rounded-xl shadow-xl shadow-teal-950/60 transition-all duration-300 cursor-pointer gap-2 border border-teal-400/40 group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              {/* SECONDARY EXPLORE FEATURES BUTTON */}
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer gap-2"
              >
                <FileText className="w-4 h-4 text-[#00d2be]" />
                <span>Explore Features</span>
              </motion.button>
            </motion.div>

            {/* TRUST INDICATORS */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-200"
            >
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-[#00d2be]" />
                <span>ABDM / ABHA Integrated</span>
              </span>

              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
                <motion.span 
                  animate={{ scale: [1, 1.15, 1] }} 
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Lock className="w-4 h-4 text-cyan-300" />
                </motion.span>
                <span>End-to-End Encrypted</span>
              </span>

              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span>Instant SOS Access</span>
              </span>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

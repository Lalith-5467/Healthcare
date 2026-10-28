import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Activity, 
  QrCode, 
  Heart, 
  Cpu, 
  Shield, 
  Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '../../context/ConfigContext';

interface FinalCTAProps {
  onStartJourney: () => void;
  onExploreFeatures?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartJourney, onExploreFeatures }) => {
  let ctaConfig: any = null;
  let brandingConfig: any = null;
  try {
    const siteConfig = useSiteConfig();
    ctaConfig = siteConfig.landing?.cta;
    brandingConfig = siteConfig.branding;
  } catch {}

  const title = ctaConfig?.title || 'Take Control of Your Health Records Today';
  const subtitle = ctaConfig?.subtitle || 'Keep your medical information organized, secure, and ready whenever you or your doctor need it.';
  const primaryBtnText = ctaConfig?.primaryButtonText || 'Get Started Now';
  const secondaryBtnText = ctaConfig?.secondaryButtonText || 'Explore Features';
  const primaryColor = brandingConfig?.primaryColor || '#00a896';
  const accentColor = brandingConfig?.accentColor || '#00d2be';
  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PREMIUM FLOATING CTA CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-gradient-to-br from-teal-50/95 via-cyan-50/80 to-emerald-50/90 dark:from-[#091322] dark:via-[#07172c] dark:to-[#041a22] text-slate-900 dark:text-white p-8 sm:p-14 border border-teal-200/90 dark:border-teal-500/30 ring-1 ring-teal-300/40 dark:ring-teal-400/20 shadow-2xl shadow-teal-900/10 dark:shadow-teal-950/60 overflow-hidden text-center"
        >
          {/* AMBIENT MESH & RADIAL GLOW LAYERS */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00a896]/15 dark:bg-[#00a896]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* SUBTLE HEALTHCARE NETWORK GRID & CONNECTION NODES (BACKGROUND AMBIENCE) */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] bg-[radial-gradient(#00a896_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* SVG CIRCUIT CONNECTION NODES & TRAVELING GLOW PARTICLES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-25" xmlns="http://www.w3.org/2000/svg">
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
            className="hidden md:flex absolute top-8 left-8 p-3 rounded-2xl bg-white/90 dark:bg-slate-800/40 backdrop-blur-md border border-teal-200 dark:border-teal-500/30 shadow-md dark:shadow-lg items-center gap-2.5 pointer-events-none select-none z-10"
          >
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-200 dark:border-teal-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-cyan-300 font-mono">256-Bit Vault</span>
              <span className="block text-[9px] text-slate-600 dark:text-slate-300 font-semibold">ABDM Verified</span>
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
            className="hidden md:flex absolute top-8 right-8 p-3 rounded-2xl bg-white/90 dark:bg-slate-800/40 backdrop-blur-md border border-cyan-200 dark:border-cyan-500/30 shadow-md dark:shadow-lg items-center gap-2.5 pointer-events-none select-none z-10"
          >
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-teal-300 font-mono">Live Vitals Sync</span>
              <span className="block text-[9px] text-slate-600 dark:text-slate-300 font-semibold">Instant SOS QR</span>
            </div>
          </motion.div>

          {/* MAIN CONTENT STACK */}
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            
            {/* HEADLINE */}
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            >
              {title.includes('Health') ? (
                <>
                  {title.split('Health')[0]} <br className="hidden sm:inline" />
                  <span className="text-[#00a896] dark:text-[#00d2be] drop-shadow-xs dark:drop-shadow-[0_2px_14px_rgba(0,210,190,0.4)]">
                    Health{title.split('Health')[1]}
                  </span>
                </>
              ) : (
                <span>{title}</span>
              )}
            </motion.h2>

            {/* SUBTITLE */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              {subtitle}
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
                style={{ backgroundColor: primaryColor }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-black text-white rounded-xl shadow-xl shadow-teal-600/25 dark:shadow-teal-950/60 transition-all duration-300 cursor-pointer gap-2 border border-teal-400/40 group hover:opacity-90"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              {/* SECONDARY EXPLORE FEATURES BUTTON */}
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-slate-800 dark:text-white bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-300/90 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 rounded-xl transition-all duration-300 shadow-md shadow-slate-900/5 dark:shadow-none backdrop-blur-md cursor-pointer gap-2"
              >
                <FileText className="w-4 h-4 text-[#00a896] dark:text-[#00d2be]" />
                <span>{secondaryBtnText}</span>
              </motion.button>
            </motion.div>



          </div>
        </motion.div>

      </div>
    </section>
  );
};

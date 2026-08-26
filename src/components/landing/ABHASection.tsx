import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Lock, 
  FileCheck2, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Activity,
  Radio,
  Check
} from 'lucide-react';

interface ABHASectionProps {
  onManageConnection: () => void;
}

interface WorkflowStep {
  step: string;
  category: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

export const ABHASection: React.FC<ABHASectionProps> = ({ onManageConnection }) => {
  // Automated sequential active flow index: 0 -> 1 -> 2 -> 3 -> 4 (Central Card) -> 0
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const workflowSteps: WorkflowStep[] = [
    {
      step: '01',
      category: 'ABDM Identity',
      title: 'ABHA Identity',
      desc: 'Unique 14-digit government digital health ID linking your healthcare ecosystem.',
      icon: UserCheck,
    },
    {
      step: '02',
      category: 'Data Privacy',
      title: 'Consent Gate',
      desc: 'Encrypted request generated whenever a hospital or doctor requests record access.',
      icon: Lock,
    },
    {
      step: '03',
      category: 'Health Locker',
      title: 'Authorized Records',
      desc: 'Targeted documents retrieved securely from linked HIP labs and diagnostic centers.',
      icon: FileCheck2,
    },
    {
      step: '04',
      category: 'Clinical Care',
      title: 'Care Provider',
      desc: 'Attending doctor inspects verified medical history with time-bound authorization.',
      icon: Building2,
    },
  ];

  return (
    <section id="abha" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#080d19] dark:via-[#0b1222] dark:to-[#080d19] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      
      {/* 17. SUBTLE HEALTHCARE NETWORK BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="health-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#00a896" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#health-grid)" />
        </svg>
      </div>

      {/* AMBIENT RADIAL LIGHTING */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* =========================================================================
            HEADER & 2. TOP BADGE ANIMATION & 3. HEADING & 4. DESCRIPTION ANIMATION
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* 2. TOP BADGE WITH EXPANDING PULSE RING */}
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative inline-flex items-center"
          >
            {/* EXPANDING RING */}
            <motion.div 
              animate={{ scale: [1, 1.25, 1.45], opacity: [0.6, 0.2, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-teal-400/30 dark:bg-cyan-400/20 pointer-events-none"
            />

            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-[#00a896] dark:text-cyan-400 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ShieldCheck className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              </motion.div>
              <span>Official ABDM Integration Ready</span>
            </div>
          </motion.div>

          {/* 3. MAIN HEADING ANIMATION (2-LINE STAGGER) */}
          <motion.h2 
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white"
          >
            Connected to India’s <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a896] via-teal-500 to-cyan-500">
              Digital Health Ecosystem
            </span>
          </motion.h2>

          {/* 4. DESCRIPTION ANIMATION */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
          >
            MediCare integrates with Ayushman Bharat Digital Mission (ABDM). Your ABHA address works as your key to authorize and receive health records from participating healthcare providers nationwide.
          </motion.p>
        </div>

        {/* =========================================================================
            5. FOUR ABHA PROCESS CARDS + 6. ANIMATED CONNECTION LINE & DOT + 9. ACTIVE STATE
            ========================================================================= */}
        <div className="relative">
          
          {/* 6. ANIMATED CONNECTING TEAL BEAM PATH (DESKTOP HORIZONTAL) */}
          <div className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-slate-200 dark:bg-slate-800 z-0 overflow-hidden">
            {/* GLOWING TRAVELLING LIGHT DOT */}
            <motion.div
              animate={{
                left: ['0%', '100%'],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 11.2, // 2.8s * 4 steps
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute top-1/2 -translate-y-1/2 w-20 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,1)]"
            />
          </div>

          {/* 4 PROCESS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 items-stretch">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              const isCurrentActive = activeStep === idx;
              const isCardHovered = hoveredCard === idx;
              const hasNext = idx < workflowSteps.length - 1;

              return (
                <div 
                  key={idx} 
                  className="relative flex flex-col"
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.15 + idx * 0.12, 
                      ease: [0.4, 0, 0.2, 1] 
                    }}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -5,
                      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
                    }}
                    className={`relative p-6 rounded-[22px] transition-all duration-500 cursor-pointer flex flex-col justify-between h-full min-h-[220px] backdrop-blur-xl border ${
                      isCurrentActive
                        ? 'bg-white/95 dark:bg-slate-800/95 border-teal-500 ring-2 ring-teal-500/25 shadow-xl shadow-teal-500/15'
                        : isCardHovered
                        ? 'bg-white/95 dark:bg-slate-800/95 border-teal-400/80 ring-1 ring-teal-400/20 shadow-xl'
                        : 'bg-white/80 dark:bg-slate-850/70 border-slate-200/90 dark:border-slate-700/80 shadow-md hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* TOP ACCENT LINE (EXPANDS ON ACTIVE OR HOVER) */}
                    <motion.div
                      animate={{
                        width: (isCurrentActive || isCardHovered) ? '100%' : '24%',
                        opacity: (isCurrentActive || isCardHovered) ? 1 : 0.75,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#00a896] via-teal-400 to-cyan-400 rounded-t-full shadow-xs"
                    />

                    {/* TOP ROW: 8. ICON WITH MICRO-ANIMATION + CATEGORY + STEP CHIP */}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={
                            isCurrentActive 
                              ? { scale: [1, 1.08, 1] } 
                              : { scale: 1 }
                          }
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-400 ${
                            isCurrentActive || isCardHovered
                              ? 'bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white shadow-md shadow-teal-500/30'
                              : 'bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 border border-teal-500/20'
                          }`}
                        >
                          {/* 8. SUBTLE ICON SPECIFIC MICRO-ANIMATIONS */}
                          {idx === 0 && <UserCheck className="w-5 h-5 stroke-[2.3]" />}
                          {idx === 1 && <Lock className="w-5 h-5 stroke-[2.3]" />}
                          {idx === 2 && <FileCheck2 className="w-5 h-5 stroke-[2.3]" />}
                          {idx === 3 && <Building2 className="w-5 h-5 stroke-[2.3]" />}
                        </motion.div>
                        
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono block">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* STEP BADGE */}
                      <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border transition-colors duration-400 ${
                        isCurrentActive || isCardHovered
                          ? 'bg-[#00a896] text-white border-[#00a896] shadow-xs'
                          : 'bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 border-teal-500/20'
                      }`}>
                        {item.step}
                      </span>
                    </div>

                    {/* MAIN HEADING */}
                    <div className="space-y-1.5 my-2">
                      <h3 className={`text-lg font-black tracking-tight transition-colors duration-300 ${
                        isCurrentActive || isCardHovered 
                          ? 'text-[#00a896] dark:text-cyan-300' 
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h3>
                      
                      {/* SUPPORTING DESCRIPTION (ALWAYS VISIBLE & FULLY READABLE) */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>

                    {/* 9. ACTIVE FLOW STATUS INDICATOR */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full transition-colors ${
                          isCurrentActive 
                            ? 'bg-teal-400 animate-ping' 
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                        <span className={`text-[10px] font-mono font-bold ${
                          isCurrentActive ? 'text-[#00a896] dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {isCurrentActive ? 'Active Flow' : 'Ready'}
                        </span>
                      </div>
                      
                      {(isCurrentActive || isCardHovered) && (
                        <span className="text-[10px] font-mono text-cyan-500 dark:text-cyan-400 flex items-center gap-0.5 font-bold">
                          <span>Verified</span>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* 6. CONNECTING ARROW BADGE BETWEEN CARDS */}
                  {hasNext && (
                    <div className={`hidden md:flex absolute -right-3.5 top-[52px] -translate-y-1/2 z-20 w-7 h-7 rounded-full items-center justify-center border shadow-md transition-all duration-400 ${
                      activeStep === idx 
                        ? 'bg-[#00a896] text-white border-teal-400 shadow-teal-500/40 scale-110' 
                        : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            14. CONNECTION FLOW PARTICLES TRAVELING TOWARDS CENTRAL ABHA CARD
            ========================================================================= */}
        <div className="flex justify-center -my-6 relative z-10 pointer-events-none">
          <motion.div 
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-0.5 h-6 bg-gradient-to-b from-[#00a896] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
          </motion.div>
        </div>

        {/* =========================================================================
            10. CENTRAL ABHA CONNECTION CARD & 11. STATUS & 12. NUMBER & 13. ADDRESS & 15. BUTTON
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }}
          whileHover={{
            scale: 1.01,
            boxShadow: '0 25px 50px -12px rgba(0, 168, 150, 0.2)'
          }}
          className={`max-w-2xl mx-auto p-8 rounded-3xl backdrop-blur-2xl transition-all duration-500 space-y-6 relative overflow-hidden border ${
            activeStep === 4 
              ? 'bg-white/95 dark:bg-slate-850/95 border-teal-400 ring-2 ring-teal-400/30 shadow-2xl shadow-teal-500/20' 
              : 'bg-white/85 dark:bg-slate-850/80 border-slate-200/90 dark:border-slate-700/80 shadow-xl'
          }`}
        >
          {/* SUBTLE GLOW OVERLAY WHEN ACTIVE DESTINATION */}
          {activeStep === 4 && (
            <motion.div 
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-transparent pointer-events-none rounded-3xl"
            />
          )}

          {/* CARD HEADER: LOGO + AYUSHMAN BHARAT ACCOUNT TITLE + 11. PULSING STATUS BADGE */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-700/80 pb-6 relative z-10">
            <div className="flex items-center gap-3.5">
              <motion.div 
                animate={activeStep === 4 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/25"
              >
                ABHA
              </motion.div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Ayushman Bharat Health Account</span>
                  <CheckCircle2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  ABDM Integration Status: Linked & Verified
                </p>
              </div>
            </div>

            {/* 11. CONNECTED STATUS INDICATOR WITH BEACON PULSE */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 text-xs font-black font-mono shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>✓ Connected</span>
            </div>
          </div>

          {/* 12. ABHA NUMBER & 13. ABHA ADDRESS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            
            {/* 12. ABHA NUMBER CONTAINER */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-inner"
            >
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black font-mono">
                ABHA Number
              </p>
              <p className="font-mono text-lg font-black text-[#00a896] dark:text-cyan-400 tracking-wider">
                14-XXXX-XXXX-8921
              </p>
            </motion.div>

            {/* 13. ABHA ADDRESS CONTAINER */}
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-inner"
            >
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black font-mono">
                ABHA Address
              </p>
              <p className="font-mono text-base font-black text-slate-900 dark:text-white">
                lalith.patel@abdm
              </p>
            </motion.div>
          </div>

          {/* 15. MANAGE CONNECTION BUTTON & PROTOCOL NOTICE */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              MediCare routes authorization requests strictly through official ABDM gateway protocols.
            </p>

            <motion.button
              whileHover={{ 
                scale: 1.03, 
                y: -2,
                boxShadow: '0 10px 25px -5px rgba(0, 168, 150, 0.4)'
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onManageConnection}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-md transition-all gap-2 shrink-0 cursor-pointer border border-teal-400/30 group"
            >
              <span>Manage Connection</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

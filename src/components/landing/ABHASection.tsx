import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Lock, 
  FileCheck2, 
  Building2, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { AbhaLogo } from '../common/AbhaLogo';

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

const ABHACard: React.FC<{
  item: WorkflowStep;
  index: number;
  hasNext: boolean;
}> = ({ item, index, hasNext }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative group">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{
          height: isHovered ? 250 : 155,
        }}
        transition={{
          duration: 0.65,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <SpotlightCard
          spotlightColor="rgba(0, 168, 150, 0.25)"
          className={`relative p-5 sm:p-6 rounded-[22px] bg-white dark:bg-slate-800/95 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md select-none h-full ${
            isHovered 
              ? 'border-[#00a896] dark:border-cyan-400 shadow-2xl shadow-teal-500/20 ring-4 ring-teal-500/10' 
              : 'border-slate-200 dark:border-slate-700/90 hover:border-teal-400/50'
          }`}
        >
          {/* TOP ACCENT LINE ANIMATION (TEAL MEDICARE BRANDING) */}
          <motion.div
            initial={false}
            animate={{
              width: isHovered ? '100%' : '28%',
              opacity: isHovered ? 1 : 0.85,
            }}
            transition={{
              duration: 0.65,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-[#00a896] via-teal-400 to-cyan-400 rounded-t-full shadow-sm z-10"
          />

          {/* CARD HEADER: ICON + HIGH-CONTRAST CATEGORY PILL + STEP CHIP */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isHovered 
                  ? 'bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-105' 
                  : 'bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 border border-teal-500/30'
              }`}>
                <Icon className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider font-mono px-2.5 py-1 rounded-lg border transition-colors duration-300 ${
                isHovered
                  ? 'bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border-teal-500/40 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-600'
              }`}>
                {item.category}
              </span>
            </div>

            <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg border shadow-xs transition-colors duration-300 shrink-0 ${
              isHovered 
                ? 'text-white bg-[#00a896] border-[#00a896]' 
                : 'text-[#00a896] dark:text-cyan-400 bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/30'
            }`}>
              {item.step}
            </span>
          </div>

          {/* MAIN HEADING */}
          <div className="space-y-1 mt-2.5 relative z-10">
            <h3 className={`text-lg sm:text-xl font-black tracking-tight transition-colors duration-300 ${
              isHovered ? 'text-[#00a896] dark:text-cyan-300' : 'text-slate-900 dark:text-white'
            }`}>
              {item.title}
            </h3>
          </div>

          {/* EXPANDING SUPPORTING DESCRIPTION CARD */}
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0,
              marginTop: isHovered ? 8 : 0,
            }}
            transition={{
              duration: 0.55,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="overflow-hidden relative z-10"
          >
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80">
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                {item.desc}
              </p>
            </div>
          </motion.div>
        </SpotlightCard>
      </motion.div>

      {/* CONNECTING ARROW BETWEEN CARDS */}
      {hasNext && (
        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-slate-800 p-1.5 rounded-full text-slate-500 dark:text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-md group-hover:text-[#00a896] transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};

export const ABHASection: React.FC<ABHASectionProps> = ({ onManageConnection }) => {
  const [copiedField, setCopiedField] = useState<'number' | 'address' | null>(null);

  const handleCopy = (text: string, field: 'number' | 'address') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
    <section id="abha" className="py-14 sm:py-16 bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Connected to India’s Digital Health Ecosystem
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            MediCare integrates with Ayushman Bharat Digital Mission (ABDM). Your ABHA address works as your key to authorize and receive health records from participating healthcare providers nationwide.
          </p>
        </div>

        {/* EXPAND-AND-COLLAPSE INTERACTIVE WORKFLOW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative items-start">
          {workflowSteps.map((item, idx) => (
            <ABHACard 
              key={idx} 
              item={item} 
              index={idx} 
              hasNext={idx < workflowSteps.length - 1} 
            />
          ))}
        </div>

        {/* INTERACTIVE ABHA CONNECTED STATUS SPOTLIGHT CARD */}
        <SpotlightCard
          spotlightColor="rgba(0, 168, 150, 0.18)"
          className="max-w-2xl mx-auto p-6 sm:p-7 rounded-[28px] bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-xl"
        >
          {/* AMBIENT CORNER GLOW */}
          <div className="absolute top-0 right-0 w-52 h-52 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* TOP HEADER ROW WITH BALANCED VERTICAL ALIGNMENT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-700/80 relative z-10">
            <div className="flex items-center gap-3.5">
              <AbhaLogo className="w-12 h-12" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                    Ayushman Bharat Health Account
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  ABDM Integration Status:{' '}
                  <span className="text-[#00a896] dark:text-cyan-400 font-semibold">
                    Linked &amp; Verified
                  </span>
                </p>
              </div>
            </div>

            {/* CONNECTED PILL WITH PULSING INDICATOR */}
            <div className="self-start sm:self-center inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">
                Connected
              </span>
            </div>
          </div>

          {/* TWO DATA BOXES: BALANCED, ACCENTED & COPYABLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {/* BOX 1: ABHA NUMBER */}
            <div className="group p-4 sm:p-4.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-500/40 transition-colors flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  ABHA Number
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('14-XXXX-XXXX-8921', 'number')}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#00a896] dark:hover:text-cyan-400 transition-colors px-1.5 py-0.5 rounded cursor-pointer"
                  title="Copy ABHA Number"
                  aria-label="Copy ABHA Number"
                >
                  {copiedField === 'number' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <span className="text-[10px] tracking-normal opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                  )}
                </button>
              </div>
              <p className="font-mono text-base sm:text-lg font-bold text-[#00a896] dark:text-cyan-400 tracking-wider">
                14-XXXX-XXXX-8921
              </p>
            </div>
            
            {/* BOX 2: ABHA ADDRESS */}
            <div className="group p-4 sm:p-4.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-500/40 transition-colors flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  ABHA Address
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('medicare.phr@abdm', 'address')}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#00a896] dark:hover:text-cyan-400 transition-colors px-1.5 py-0.5 rounded cursor-pointer"
                  title="Copy ABHA Address"
                  aria-label="Copy ABHA Address"
                >
                  {copiedField === 'address' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <span className="text-[10px] tracking-normal opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                  )}
                </button>
              </div>
              <p className="font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                medicare.phr@abdm
              </p>
            </div>
          </div>

          {/* FOOTER ACTION ROW */}
          <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
              <p className="leading-relaxed">
                MediCare routes authorization requests strictly through official ABDM gateway protocols.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onManageConnection}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-500/20 transition-all gap-2 shrink-0 cursor-pointer border border-teal-500/30"
            >
              <span>Manage Connection</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.button>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};

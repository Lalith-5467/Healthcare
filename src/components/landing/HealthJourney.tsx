import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Activity, 
  Pill, 
  UserCheck, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Hand,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles
} from 'lucide-react';

export const HealthJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const journeyItems = [
    {
      num: '01',
      tag: 'MEDICAL RECORDS',
      title: 'Everything important, in one organized place.',
      desc: 'Smart categorisation for prescriptions, blood work, imaging scans, and discharge summaries with instant full-text search.',
      icon: FileText,
      color: 'from-blue-500/20 to-indigo-500/10',
      badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      visual: (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Complete Blood Count (CBC)</p>
                <p className="text-[10px] text-slate-500">Apollo Diagnostics • 14 Aug 2026</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Verified</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Cardiology Prescription</p>
                <p className="text-[10px] text-slate-500">Dr. Rajesh Kumar • 10 Aug 2026</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      tag: 'HEALTH VITALS',
      title: 'See your health change over time.',
      desc: 'Real-time telemetry tracking for Heart Rate, Blood Pressure, Glucose, and SpO₂ with trend analysis.',
      icon: Activity,
      color: 'from-rose-500/20 to-orange-500/10',
      badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      visual: (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-slate-500">Heart Rate Trend</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">78 BPM Avg</span>
          </div>
          {/* Animated SVG Mini Graph */}
          <div className="h-20 w-full flex items-end gap-1.5 pt-2">
            {[40, 65, 55, 80, 72, 88, 78].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    idx === 6 ? 'bg-[#FF5B22]' : 'bg-orange-500/30 dark:bg-slate-700'
                  }`}
                  style={{ height: `${val}%` }}
                />
                <span className="text-[9px] text-slate-400">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: '03',
      tag: 'MEDICATIONS',
      title: 'Never lose track of your daily routine.',
      desc: 'Timely reminders, dosage schedules, adherence analytics, and automatic refill alerts.',
      icon: Pill,
      color: 'from-amber-500/20 to-yellow-500/10',
      badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      visual: (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span>Today's Dosage</span>
            <span className="text-[#FF5B22]">2 / 3 Taken</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">08:00 AM • Metformin 500mg</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <span className="font-semibold text-amber-700 dark:text-amber-300">02:00 PM • Telmisartan 40mg</span>
              <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      tag: 'DOCTOR CARE TEAM',
      title: 'Connect your health journey with your care team.',
      desc: 'Direct consultation notes, follow-up scheduling, and seamless doctor access management.',
      icon: UserCheck,
      color: 'from-purple-500/20 to-indigo-500/10',
      badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      visual: (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-lg">
            DR
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dr. Ananya Sharma</h4>
            <p className="text-xs text-slate-500">Chief Endocrinologist • Max Healthcare</p>
            <span className="inline-block mt-1.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Follow-up Scheduled
            </span>
          </div>
        </div>
      ),
    },
    {
      num: '05',
      tag: 'CONSENT ARCHITECTURE',
      title: 'You decide what you share and for how long.',
      desc: 'Granular ABDM consent controls. Grant or revoke record visibility with time-bound access security.',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-teal-500/10',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      visual: (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Active Access Control
            </span>
            <span className="text-[10px] font-semibold text-slate-500">Expires in 7 Days</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Labs & Prescriptions</span>
            <span className="text-emerald-500 font-bold">Approved ✓</span>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    setHasInteracted(true);
    if (activeStep < journeyItems.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setHasInteracted(true);
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-slate-50/50 dark:bg-[#0B0F17]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-[#FF5B22]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5B22]">
                Signature Interactive Experience
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Health Journey, Unfolded.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Swipe or drag horizontally to explore how your care data flows seamlessly across every step.
            </p>
          </div>

          {/* CONTROLS & INDICATOR */}
          <div className="flex items-center gap-4">
            {/* INSTRUCTION BADGE */}
            {!hasInteracted && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#FF5B22] bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 animate-pulse"
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Swipe to explore →</span>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={activeStep === journeyItems.length - 1}
                className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                aria-label="Next step"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR INDICATOR */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-10 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-[#FF5B22] h-full transition-all duration-500 ease-out" 
            style={{ width: `${((activeStep + 1) / journeyItems.length) * 100}%` }}
          />
        </div>

        {/* HORIZONTAL SWIPE DRAG CAROUSEL DECK */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing py-4"
          onMouseDown={() => setHasInteracted(true)}
          onTouchStart={() => setHasInteracted(true)}
        >
          <motion.div 
            className="flex gap-6"
            animate={{ x: -activeStep * 360 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {journeyItems.map((item, index) => {
              const isActive = index === activeStep;


              return (
                <motion.div
                  key={index}
                  onClick={() => { setActiveStep(index); setHasInteracted(true); }}
                  className={`w-[340px] sm:w-[380px] shrink-0 rounded-3xl p-6 sm:p-8 transition-all duration-300 select-none ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 border-2 border-[#FF5B22] shadow-2xl scale-100'
                      : 'bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-md scale-95 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* TOP CARD BAR */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 tracking-tighter">
                      {item.num}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* TITLE & DESC */}
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug mb-3 min-h-[56px]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed min-h-[48px]">
                    {item.desc}
                  </p>

                  {/* INTERACTIVE VISUAL CONTENT PANEL */}
                  <div className="mt-auto">
                    {item.visual}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

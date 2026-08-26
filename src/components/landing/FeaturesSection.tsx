import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Pill, 
  QrCode, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  HeartPulse,
  Clock,
  Check,
  AlertTriangle,
  Flame,
  Activity,
  ShieldCheck,
  UserCheck,
  Radio,
  FileCheck2,
  BellRing
} from 'lucide-react';

interface FeaturesSectionProps {
  onExploreFeature?: (featureId: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onExploreFeature }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [doseTaken, setDoseTaken] = useState(false);
  const [countdown, setCountdown] = useState(872); // seconds (14m 32s)
  const [isAccessRevoked, setIsAccessRevoked] = useState(false);

  // Countdown timer for Doctor Share demo
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const featureCategories = [
    {
      id: 'phr-locker',
      title: 'Digital Health Records',
      subtitle: 'Encrypted Document Locker',
      icon: FileText,
      badge: '100% Encrypted',
      themeColor: 'teal',
      glowBg: 'from-teal-500/20 via-cyan-500/15 to-transparent',
      activeRing: 'border-teal-500 ring-4 ring-teal-500/15 shadow-teal-500/20',
      activeBadge: 'bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border-teal-500/30',
      description: 'Store, categorize, and manage your lifetime medical history, lab reports, prescriptions, and vaccination certificates securely in one digital vault.',
      bullets: [
        'Automatic OCR categorization for diagnostic reports',
        'End-to-end encryption with HIPAA compliant security',
        'Instant search by date, doctor, or medical condition',
        'Downloadable consolidated PDF health summaries'
      ],
      previewStats: [
        { label: 'Storage', value: 'Unlimited PDF' },
        { label: 'Security', value: '256-Bit AES' },
        { label: 'Format', value: 'OCR Auto-Tag' }
      ]
    },
    {
      id: 'med-reminder',
      title: 'Medicine Reminders',
      subtitle: 'Automated Dosage Tracker',
      icon: Pill,
      badge: 'Smart Alerts',
      themeColor: 'purple',
      glowBg: 'from-purple-500/20 via-indigo-500/15 to-transparent',
      activeRing: 'border-purple-500 ring-4 ring-purple-500/15 shadow-purple-500/20',
      activeBadge: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
      description: 'Never miss an essential dose with intelligent notification reminders, dosage schedules, refill alerts, and daily adherence tracking.',
      bullets: [
        'Customizable recurring schedule (Morning, Noon, Night)',
        '1-Tap "Taken" or "Snooze" pill status logging',
        'Refill warning alerts when stock runs low',
        'Family adherence report sharing for elder care'
      ],
      previewStats: [
        { label: 'Adherence', value: '99.4% Rate' },
        { label: 'Alerts', value: 'Push & SMS' },
        { label: 'Tracking', value: 'Daily History' }
      ]
    },
    {
      id: 'doctor-share',
      title: 'Doctor & Clinic Sharing',
      subtitle: 'Time-Bound Access Control',
      icon: QrCode,
      badge: 'Consent Ready',
      themeColor: 'cyan',
      glowBg: 'from-cyan-500/20 via-blue-500/15 to-transparent',
      activeRing: 'border-cyan-500 ring-4 ring-cyan-500/15 shadow-cyan-500/20',
      activeBadge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
      description: 'Share specific medical records with doctors, hospitals, or diagnostic labs via secure QR code scan, temporary web link, or OTP verification.',
      bullets: [
        'Time-limited access pins (15 mins, 1 hour, 24 hours)',
        'Select granular records (Only Lab Reports / Only Prescriptions)',
        'Instant revoke permission at any time with 1 tap',
        'ABHA integrated consent management architecture'
      ],
      previewStats: [
        { label: 'Access', value: 'Time-Bound' },
        { label: 'Verification', value: 'OTP / QR' },
        { label: 'Revoke', value: 'Instant 1-Tap' }
      ]
    },
    {
      id: 'emergency-sos',
      title: 'Emergency SOS Pass',
      subtitle: 'Instant Offline Health Card',
      icon: ShieldAlert,
      badge: 'Instant Access',
      themeColor: 'rose',
      glowBg: 'from-rose-500/20 via-pink-500/15 to-transparent',
      activeRing: 'border-rose-500 ring-4 ring-rose-500/15 shadow-rose-500/20',
      activeBadge: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
      description: 'Equip first responders and emergency care teams with immediate offline-ready access to blood group, severe allergies, and primary contact details.',
      bullets: [
        'Offline QR card viewable even without active internet',
        'Critical allergy warnings (Penicillin, Nuts, Sulfa)',
        'Emergency next-of-kin contact numbers',
        'Printable wallet card & lock-screen widget'
      ],
      previewStats: [
        { label: 'Speed', value: '< 2 Seconds' },
        { label: 'Offline', value: '100% Ready' },
        { label: 'Emergency', value: 'SOS QR Card' }
      ]
    }
  ];

  const activeFeature = featureCategories[activeTab];

  return (
    <section id="features" className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#090e1a] dark:via-[#0b1120] dark:to-[#090e1a] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* DYNAMIC AMBIENT GLOW BACKGROUND ACCENTS */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br ${activeFeature.glowBg} rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60`} />
      <div className="absolute inset-0 bg-[radial-gradient(#00a896_0.75px,transparent_0.75px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a896]/15 border border-[#00a896]/30 text-[#00a896] dark:text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#00a896] animate-pulse" />
            <span>Interactive Health Modules</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Features Designed for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a896] via-teal-500 to-cyan-500">
              Your Total Healthcare Journey
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
          >
            From lifetime medical document storage to automated pill alerts and instant doctor sharing — explore how MediCare empowers you every day.
          </motion.p>
        </div>

        {/* INTERACTIVE 4 FEATURE TAB SELECTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCategories.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = activeTab === index;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(index)}
                className={`p-5 rounded-[22px] border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm ${
                  isActive
                    ? `bg-white/95 dark:bg-slate-800/95 border-2 ${cat.activeRing} shadow-xl backdrop-blur-xl`
                    : 'bg-white/70 dark:bg-slate-850/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/80 backdrop-blur-md'
                }`}
              >
                {/* ACTIVE TAB ACCENT GRADIENT GLOW */}
                {isActive && (
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.glowBg} rounded-full blur-2xl pointer-events-none`} />
                )}

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white shadow-md shadow-teal-500/30 scale-105' 
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.3]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border font-mono ${
                    isActive ? cat.activeBadge : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}>
                    {cat.badge}
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className={`text-base font-black transition-colors ${
                    isActive ? 'text-[#00a896] dark:text-cyan-300' : 'text-slate-900 dark:text-white'
                  }`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {cat.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ACTIVE FEATURE DISPLAY SHOWCASE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white"
          >
            {/* AMBIENT CORNER AURA */}
            <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${activeFeature.glowBg} rounded-full blur-3xl pointer-events-none opacity-80`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* LEFT FEATURE DETAILS */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/25">
                    {React.createElement(activeFeature.icon, { className: "w-6 h-6 stroke-[2.4]" })}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                      {activeFeature.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {activeFeature.title}
                    </h3>
                  </div>
                </div>

                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {activeFeature.description}
                </p>

                {/* INTERACTIVE CHECKLIST PILLS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeFeature.bullets.map((bullet, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02, x: 2 }}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 shadow-xs group"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {bullet}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA BUTTON */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onExploreFeature && onExploreFeature(activeFeature.id)}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-black text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer border border-teal-400/30"
                  >
                    <span>Explore {activeFeature.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>

              {/* RIGHT LIVE INTERACTIVE PREVIEW MOCKUP */}
              <div className="lg:col-span-6">
                
                {/* 1. DIGITAL HEALTH RECORDS MOCKUP */}
                {activeFeature.id === 'phr-locker' && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-teal-500/30 text-white shadow-2xl space-y-5 relative overflow-hidden">
                    {/* SIMULATED SCANNING LASER */}
                    <motion.div 
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,1)] pointer-events-none z-20"
                    />

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black uppercase text-slate-300 font-mono">Encrypted Medical Vault</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                        ABDM Verified
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Pathology Lab Diagnostics.pdf</span>
                        <span className="text-[10px] text-teal-400 font-mono font-bold">2.4 MB · AES-256</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-cyan-300 border border-teal-500/30">Lipid Profile</span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">HbA1c: 5.6%</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Normal</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      {activeFeature.previewStats.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[9px] font-bold uppercase text-slate-400 font-mono block">{st.label}</span>
                          <strong className="text-xs font-black text-teal-300 mt-0.5 block">{st.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MEDICINE REMINDERS MOCKUP */}
                {activeFeature.id === 'med-reminder' && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-purple-500/30 text-white shadow-2xl space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-black uppercase text-slate-300 font-mono">Daily Dosage Schedule</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                        99.4% Adherence
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* DOSE 1 */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-white block">Metformin 500mg</span>
                            <span className="text-[10px] text-slate-400 font-mono">08:00 AM · After Breakfast</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">Taken</span>
                      </div>

                      {/* DOSE 2 (INTERACTIVE) */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/40 flex items-center justify-between ring-1 ring-purple-500/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                            doseTaken 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          }`}>
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-white block">Vitamin D3 60k UI</span>
                            <span className="text-[10px] text-purple-300 font-mono">01:30 PM · Due Now</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setDoseTaken(!doseTaken)}
                          className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                            doseTaken 
                              ? 'bg-emerald-500 text-white border-emerald-400' 
                              : 'bg-purple-500 hover:bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                          }`}
                        >
                          {doseTaken ? 'Taken ✓' : 'Mark Taken'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      {activeFeature.previewStats.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[9px] font-bold uppercase text-slate-400 font-mono block">{st.label}</span>
                          <strong className="text-xs font-black text-purple-300 mt-0.5 block">{st.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. DOCTOR & CLINIC SHARING MOCKUP */}
                {activeFeature.id === 'doctor-share' && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-cyan-500/30 text-white shadow-2xl space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-xs font-black uppercase text-slate-300 font-mono">Active Consent Session</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-mono border ${
                        isAccessRevoked 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {isAccessRevoked ? 'Session Revoked' : `Expires in ${formatCountdown(countdown)}`}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                            DR
                          </div>
                          <div>
                            <strong className="text-xs text-white block">Dr. Rajesh Varma</strong>
                            <span className="text-[10px] text-slate-400 font-mono">Apollo Cardiology · OTP Verified</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsAccessRevoked(!isAccessRevoked)}
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isAccessRevoked 
                              ? 'bg-teal-500 text-white border-teal-400' 
                              : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border-rose-500/30'
                          }`}
                        >
                          {isAccessRevoked ? 'Re-Grant' : 'Revoke Access'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      {activeFeature.previewStats.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[9px] font-bold uppercase text-slate-400 font-mono block">{st.label}</span>
                          <strong className="text-xs font-black text-cyan-300 mt-0.5 block">{st.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. EMERGENCY SOS PASS MOCKUP */}
                {activeFeature.id === 'emergency-sos' && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-rose-500/30 text-white shadow-2xl space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                        <span className="text-xs font-black uppercase text-slate-300 font-mono">Offline Emergency QR Matrix</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                        Zero-Latency SOS
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-rose-300 font-mono">Primary Patient</span>
                          <h4 className="text-sm font-black text-white">Rahul Sharma · 34 Yrs</h4>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-rose-500 text-white font-black text-xs shadow-md">
                          Blood: O+
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 space-y-1">
                        <div><strong className="text-rose-400 font-mono">Allergies:</strong> Penicillin, Sulfa, Peanuts</div>
                        <div><strong className="text-teal-400 font-mono">ICE Contact:</strong> Dr. Sen (+91 98765 43210)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      {activeFeature.previewStats.map((st, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[9px] font-bold uppercase text-slate-400 font-mono block">{st.label}</span>
                          <strong className="text-xs font-black text-rose-300 mt-0.5 block">{st.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

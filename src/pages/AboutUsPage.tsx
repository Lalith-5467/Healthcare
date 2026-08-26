import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Lock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  Heart,
  Award,
  Globe2,
  Cpu,
  FileCheck,
  Stethoscope,
  Zap,
  Building2,
  ChevronRight,
  Clock,
  QrCode,
  Check
} from 'lucide-react';

import { CountUp } from '../components/ui/CountUp';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onStartJourney: () => void;
  onExploreFeatures: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onNavigateHome, 
  onStartJourney, 
  onExploreFeatures 
}) => {
  const [activeStoryTab, setActiveStoryTab] = useState<'mission' | 'journey' | 'security'>('mission');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const corePillars = [
    {
      icon: Lock,
      title: 'Zero-Knowledge Privacy',
      desc: 'Health records are encrypted with 256-bit AES before touching our servers. Even our team cannot view your confidential data without explicit consent.',
      badge: '256-Bit AES',
      accent: 'from-teal-500 to-emerald-500',
    },
    {
      icon: QrCode,
      title: 'Instant Emergency SOS',
      desc: 'Offline-ready QR medical card equipping first responders with blood group, emergency contacts, and severe allergy warnings in under 3 seconds.',
      badge: 'Offline Matrix',
      accent: 'from-rose-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Caregiver & Family Sync',
      desc: 'Keep elderly parents, children, and loved ones monitored with automated pill trackers, vitals tracking, and shared clinical summaries.',
      badge: 'Multi-Profile',
      accent: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Activity,
      title: 'Universal ABDM Bridge',
      desc: 'Directly integrated with Ayushman Bharat Digital Mission (ABDM) enabling effortless record exchange with hospitals, diagnostic labs, and clinics.',
      badge: 'ABHA Certified',
      accent: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Cpu,
      title: 'Smart AI Prescription OCR',
      desc: 'Digitize handwritten prescriptions and lab reports instantly into structured dosage schedules and searchable medical timelines.',
      badge: '99.8% Accuracy',
      accent: 'from-amber-500 to-orange-500',
    },
    {
      icon: Stethoscope,
      title: 'Tele-Consultation Ready',
      desc: 'Seamless HD video consultations with verified specialists, instant electronic prescriptions, and synchronized doctor follow-ups.',
      badge: 'HD Telehealth',
      accent: 'from-emerald-500 to-teal-500',
    },
  ];

  const milestones = [
    {
      target: 100,
      suffix: '%',
      label: 'Encrypted Health Vault',
      subtext: '256-bit HIPAA & ABDM compliance',
    },
    {
      target: 50000,
      suffix: '+',
      separator: ',',
      label: 'ABHA IDs Connected',
      subtext: 'Across national digital health grid',
    },
    {
      target: 99.8,
      suffix: '%',
      label: 'OCR Precision Rate',
      subtext: 'Automated prescription parsing',
    },
    {
      target: 24,
      suffix: '/7',
      label: 'Emergency SOS Readiness',
      subtext: 'Zero-latency offline QR scanning',
    },
  ];

  const journeySteps = [
    {
      year: '2023',
      phase: 'Phase I',
      title: 'Foundation & ABDM Architecture',
      desc: 'Engineered the core encrypted health locker architecture compliant with Ayushman Bharat Digital Mission (ABDM) M1, M2, and M3 protocols.',
      highlight: 'ABHA Gateway v1.0',
    },
    {
      year: '2024',
      phase: 'Phase II',
      title: 'Offline Emergency SOS & QR Matrix',
      desc: 'Pioneered zero-latency offline QR health cards for ambulances and first responders, saving critical minutes during golden-hour emergencies.',
      highlight: '10,000+ SOS Cards Generated',
    },
    {
      year: '2025',
      phase: 'Phase III',
      title: 'AI Diagnostics & Family Health Graph',
      desc: 'Integrated machine learning OCR for handwritten prescriptions and created multi-generational family caregiver monitoring rings.',
      highlight: 'Smart Timeline & OCR AI',
    },
    {
      year: '2026',
      phase: 'Phase IV (Current)',
      title: 'Unified Hospital Network & Telehealth',
      desc: 'Connecting over 500+ multispecialty hospitals, telemedicine video consultations, pharmacy refills, and patient-first medical vaults.',
      highlight: 'Complete Healthcare Ecosystem',
    },
  ];

  const leadership = [
    {
      name: 'Dr. Rajesh Varma',
      role: 'Chief Medical Officer',
      credentials: 'MD, DM (Cardiology), AIIMS New Delhi',
      specialty: 'Clinical Governance & Digital Health Standards',
      img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
      badge: '20+ Yrs Clinical Exp',
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Health Privacy & Architecture',
      credentials: 'M.Tech, Stanford Fellow in Cryptography',
      specialty: 'ABDM Protocols & Zero-Knowledge Enclaves',
      img: 'https://images.unsplash.com/photo-1594824813571-21252df9d944?auto=format&fit=crop&w=400&q=80',
      badge: 'Data Security Pioneer',
    },
    {
      name: 'Dr. Ananya Sen',
      role: 'Director of Emergency Care & Trauma',
      credentials: 'MBBS, MRCEM (UK), Emergency Medicine',
      specialty: 'Golden-Hour SOS Systems & Paramedic Workflows',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      badge: 'Trauma Care Expert',
    },
    {
      name: 'Karthik Ramanathan',
      role: 'VP of AI & Health Informatics',
      credentials: 'PhD in Medical AI, IISc Bengaluru',
      specialty: 'OCR Prescription Parsing & Predictive Analytics',
      img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      badge: 'Health AI Researcher',
    },
  ];

  const securityBadges = [
    { title: 'ABDM Certified', sub: 'National Health Authority approved', icon: ShieldCheck },
    { title: 'AES-256 Encryption', sub: 'Military-grade end-to-end data security', icon: Lock },
    { title: 'ISO 27001 Certified', sub: 'Global information security compliance', icon: FileCheck },
    { title: 'HIPAA Aligned', sub: 'Strict patient healthcare data privacy', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* 1. HERO HEADER SECTION WITH GLOWING BACKGROUND & BREADCRUMB */}
      <section className="relative pt-12 pb-24 lg:pt-16 lg:pb-28 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#0b1120] dark:to-[#0b1120] border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        {/* BACKGROUND GLOW ACCENTS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-teal-400/20 via-[#00a896]/15 to-cyan-400/20 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* TOP PILL BADGE */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Official Video Introduction • Welcome to MediCare</span>
            </span>
          </motion.div>

          {/* MAIN HERO HEADLINE */}
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]"
            >
              Discover the Future of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#00a896] via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Unified & Connected Healthcare
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Watch how MediCare connects patients, doctors, hospitals, and emergency responders under one seamless, 100% encrypted ABDM-integrated ecosystem.
            </motion.p>
          </div>

          {/* CINEMATIC INTRODUCTION VIDEO PLAYER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/30 dark:border-teal-500/40 bg-slate-900 relative group"
          >
            <div className="aspect-video w-full relative">
              <video
                src="/about_us_.mp4"
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-3xl"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* ACTION BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-8"
          >
            <button
              onClick={onStartJourney}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Create Your Health Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-extrabold text-sm border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Explore Platform Capabilities
            </button>
          </motion.div>

          {/* QUICK CREDENTIAL TICKER STRIP */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {securityBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3.5 group hover:border-[#00a896]/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{badge.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{badge.sub}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 2. INTERACTIVE STORY & MISSION / VISION / SECURITY TABS */}
      <section className="py-20 bg-white dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* SECTION HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00a896] dark:text-cyan-400 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
              Purpose-Driven Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Transforming Fragmented Care into Connected Wellness
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
              Medical records in India have historically remained trapped in physical paper files and disconnected hospital portals. MediCare delivers a sovereign health wallet.
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
              {[
                { id: 'mission', label: 'Mission & Vision', icon: Target },
                { id: 'journey', label: 'Our Innovation Journey', icon: Clock },
                { id: 'security', label: 'Security & Encryption', icon: Lock },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeStoryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStoryTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      active
                        ? 'bg-[#00a896] text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENT WITH ANIMATION */}
          <AnimatePresence mode="wait">
            {activeStoryTab === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
              >
                {/* MISSION CARD */}
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-teal-500/5 via-slate-50 to-white dark:from-teal-950/20 dark:via-slate-800/90 dark:to-slate-800/80 border border-teal-500/20 dark:border-slate-700/80 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#00a896]/50 transition-colors">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#00a896]/15 border border-[#00a896]/30 text-[#00a896] dark:text-cyan-400 flex items-center justify-center shadow-sm">
                      <Target className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                        Our Mission
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        Democratizing Lifetime Health Ownership
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      To empower every citizen with complete sovereignty over their clinical history — eliminating lost paperwork, avoiding redundant diagnostic tests, and accelerating emergency response by turning scattered medical data into a single unified lifeline.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                    {[
                      'Instant access to prescriptions, discharge summaries & lab tests',
                      'Zero-data-selling pledge with strict cryptographic patient gates',
                      'Direct doctor sharing with revocable QR and timed consent OTPs',
                    ].map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VISION CARD */}
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-slate-50 to-white dark:from-cyan-950/20 dark:via-slate-800/90 dark:to-slate-800/80 border border-cyan-500/20 dark:border-slate-700/80 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                      <Eye className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
                        Our Vision
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        India’s Most Trusted Healthcare Ecosystem
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Building the national standard for interoperable digital health where 1.4 billion citizens, thousands of hospitals, and emergency personnel connect seamlessly under ABDM standards, creating proactive, preventive, and life-saving healthcare.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                    {[
                      'Universal ABHA ID linkage across 100,000+ empanelled health facilities',
                      'Intelligent AI health trend indicators & proactive vital alerts',
                      'Multi-generational caregiver monitoring for senior citizens & children',
                    ].map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeStoryTab === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {journeySteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col justify-between space-y-4 hover:border-[#00a896]/60 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-[#00a896] dark:text-cyan-400 font-mono">
                          {step.year}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-cyan-300 border border-teal-500/20">
                          {step.phase}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                        {step.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{step.highlight}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeStoryTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 inline-flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cryptographic Sovereignty</span>
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black">
                      Zero-Knowledge Enclaves & Patient Consent Engine
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      MediCare is built around zero-trust architectural principles. Medical files are client-side encrypted before cloud transmission. Every record access by doctors requires an affirmative OTP consent transaction logged permanently in the ABDM audit trail.
                    </p>
                  </div>

                  <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 font-mono">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-teal-300 font-bold font-sans">ENCRYPTION</span>
                      <strong className="text-sm text-white block">AES-256 GCM</strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-cyan-300 font-bold font-sans">KEY EXCHANGE</span>
                      <strong className="text-sm text-white block">ECDH Curve25519</strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-purple-300 font-bold font-sans">GOVERNMENT GRID</span>
                      <strong className="text-sm text-white block">ABDM Gateway</strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-amber-300 font-bold font-sans">AUDITABILITY</span>
                      <strong className="text-sm text-white block">Immutable Logs</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 3. CORE ARCHITECTURAL PILLARS (6 CARDS WITH HOVER ACCENTS) */}
      <section className="py-20 bg-slate-50 dark:bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00a896] dark:text-cyan-400 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Families & Doctors Rely on MediCare
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
              A comprehensive personal health ecosystem combining emergency telemetry, smart AI transcription, and unified hospital connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl flex flex-col justify-between space-y-6 group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-[#00a896] dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore integration</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. PLATFORM MILESTONES & TELEMETRY WITH ANIMATED COUNTUP */}
      <section className="py-20 bg-gradient-to-r from-[#00a896] via-teal-700 to-cyan-700 text-white shadow-2xl relative overflow-hidden">
        {/* BACKGROUND ORB ACCENTS */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-900/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-teal-100 bg-white/15 px-4 py-1 rounded-full border border-white/20 inline-flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Health Telemetry</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Trusted Across Indian Healthcare
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {milestones.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 rounded-3xl space-y-2 shadow-xl hover:bg-white/15 transition-all"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono flex items-center justify-center">
                  <CountUp
                    to={st.target}
                    from={0}
                    separator={st.separator || ''}
                    duration={2.2}
                    className="font-black"
                  />
                  {st.suffix && <span>{st.suffix}</span>}
                </div>
                <h4 className="text-sm font-black text-white">{st.label}</h4>
                <p className="text-[11px] font-medium text-teal-100/90 leading-tight">{st.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MEDICAL ADVISORY & CLINICAL LEADERSHIP TEAM */}
      <section className="py-20 bg-white dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00a896] dark:text-cyan-400 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
              Clinical & Engineering Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Guided by Foremost Medical Specialists
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
              Our clinical advisory board ensures all data flows, emergency protocols, and telemedicine standards adhere to rigorous medical ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((mem, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-md group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={mem.img} 
                      alt={mem.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                        {mem.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="text-lg font-black">{mem.name}</h4>
                      <p className="text-xs text-teal-300 font-bold">{mem.role}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                      {mem.credentials}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {mem.specialty}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00a896] dark:text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Clinical Advisor</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. HIGH-CONVERSION BOTTOM CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#00a896_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
            <span>Lifelong Health Empowerment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Take Full Control of Your Family’s Health Records Today
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Join over 50,000+ patients who manage their prescriptions, lab tests, ABHA health records, and emergency SOS medical cards with zero compromise on privacy.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="px-9 py-4 text-sm font-black text-white bg-[#00a896] hover:bg-[#00897b] rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Started Free with ABHA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateHome}
              className="px-8 py-4 text-sm font-extrabold text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-2xl border border-slate-700 transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400" /> Free Lifetime Access
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400" /> 100% ABDM Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400" /> Zero Data Selling Pledge
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;

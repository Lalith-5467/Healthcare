import React, { useEffect, useState, useRef } from 'react';
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
  ChevronLeft,
  Clock,
  QrCode,
  Check,
  Play,
  ShieldAlert,
  HeartPulse,
  Plus,
  Link2
} from 'lucide-react';

import { CountUp } from '../components/ui/CountUp';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onStartJourney: () => void;
  onExploreFeatures: () => void;
}

const corePillars = [
  {
    category: 'Secure Healthcare',
    icon: ShieldCheck,
    title: 'Zero-Knowledge Privacy',
    desc: 'Health records are encrypted with 256-bit AES before touching our servers. Even our team cannot view your confidential data without explicit consent.',
    badge: '256-Bit AES',
    accent: 'from-teal-500 to-emerald-500',
    glow: 'teal',
  },
  {
    category: 'Connected Care',
    icon: Link2,
    title: 'Unified Health Network',
    desc: 'Seamlessly connects patients, doctors, hospitals, diagnostic labs, and emergency responders under one synchronized ecosystem.',
    badge: 'Multi-Connect',
    accent: 'from-cyan-500 to-blue-500',
    glow: 'cyan',
  },
  {
    category: 'Doctor Consultation',
    icon: Stethoscope,
    title: 'Tele-Consultation Ready',
    desc: 'Instant HD video consultations with verified specialists, electronic prescriptions, dosage reminders, and follow-up tracking.',
    badge: 'HD Telehealth',
    accent: 'from-emerald-500 to-teal-500',
    glow: 'emerald',
  },
  {
    category: 'Emergency Support',
    icon: ShieldAlert,
    title: 'Instant Emergency SOS',
    desc: 'Offline-ready QR medical card equipping first responders with blood group, emergency contacts, and severe allergy warnings in under 3 seconds.',
    badge: 'Offline Matrix',
    accent: 'from-rose-500 to-pink-500',
    glow: 'rose',
  },
  {
    category: 'ABDM Integration',
    icon: Activity,
    title: 'Universal ABHA Gateway',
    desc: 'Directly certified with Ayushman Bharat Digital Mission (ABDM) enabling effortless nationwide record exchange and sovereign health storage.',
    badge: 'ABHA Certified',
    accent: 'from-cyan-500 to-teal-500',
    glow: 'cyan',
  },
  {
    category: 'Smart AI Diagnostics',
    icon: Cpu,
    title: 'AI Prescription OCR',
    desc: 'Digitize handwritten prescriptions and lab reports instantly into structured dosage schedules and searchable medical timelines.',
    badge: '99.8% Accuracy',
    accent: 'from-amber-500 to-orange-500',
    glow: 'amber',
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
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    badge: '20+ Yrs Clinical Exp',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Health Privacy & Architecture',
    credentials: 'M.Tech, Stanford Fellow in Cryptography',
    specialty: 'ABDM Protocols & Zero-Knowledge Enclaves',
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    badge: 'Data Security Pioneer',
  },
  {
    name: 'Dr. Ananya Sen',
    role: 'Director of Emergency Care & Trauma',
    credentials: 'MBBS, MRCEM (UK), Emergency Medicine',
    specialty: 'Golden-Hour SOS Systems & Paramedic Workflows',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    badge: 'Trauma Care Expert',
  },
  {
    name: 'Karthik Ramanathan',
    role: 'VP of AI & Health Informatics',
    credentials: 'PhD in Medical AI, IISc Bengaluru',
    specialty: 'OCR Prescription Parsing & Predictive Analytics',
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    badge: 'Health AI Researcher',
  },
  {
    name: 'Dr. Vikram Malhotra',
    role: 'Head of Telemedicine & Digital Surgery',
    credentials: 'MS, MCh (Neurosurgery), PGIMER Chandigarh',
    specialty: 'Remote Surgical Telemetry & Real-Time Haptic Protocols',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    badge: 'Tele-Health Pioneer',
  },
];

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onNavigateHome, 
  onStartJourney, 
  onExploreFeatures 
}) => {
  const [activeStoryTab, setActiveStoryTab] = useState<'mission' | 'journey' | 'security'>('mission');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeLeadershipIndex, setActiveLeadershipIndex] = useState(0);
  const [isLeadershipHovered, setIsLeadershipHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Continuous auto-play for 3D Cover-Flow Carousel on Leadership Team (pauses on user hover/interaction)
  useEffect(() => {
    if (isLeadershipHovered) return;
    const timer = setInterval(() => {
      setActiveLeadershipIndex((prev) => (prev + 1) % leadership.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isLeadershipHovered]);

  const handlePrevLeadership = () => {
    setActiveLeadershipIndex((prev) => (prev - 1 + leadership.length) % leadership.length);
  };

  const handleNextLeadership = () => {
    setActiveLeadershipIndex((prev) => (prev + 1) % leadership.length);
  };

  const handlePlayVideo = () => {
    setIsPlayingVideo(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 150);
    const videoSection = document.getElementById('about-video');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden font-sans">
      
      {/* =========================================================================
          SECTION 1 — PREMIUM ABOUT US HERO
          ========================================================================= */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-teal-50/70 via-white to-slate-50 dark:from-[#0b1329] dark:via-[#091024] dark:to-[#0b1120] border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        {/* SUBTLE BACKGROUND ACCENT GLOWS & PATTERNS */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/15 via-[#00a896]/10 to-cyan-400/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#00a896_0.75px,transparent_0.75px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          
          {/* TWO COLUMN HERO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT SIDE — TEXT & ACTIONS */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              {/* SMALL ROUNDED BADGE */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00a896]" />
                <span>ABOUT MEDICARE</span>
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Discover the Future of{' '}
                <span className="text-[#00a896] dark:text-cyan-400">
                  Connected Healthcare
                </span>
              </h1>

              {/* SUPPORTING TEXT */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-xl">
                MediCare brings patients, doctors, hospitals, and emergency healthcare services together through one simple, secure, and connected digital healthcare ecosystem.
              </p>

              {/* HERO BUTTONS */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handlePlayVideo}
                  className="px-7 py-3.5 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-sm flex items-center gap-2.5 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </div>
                  <span>Watch Introduction</span>
                </button>

                <button
                  onClick={onExploreFeatures}
                  className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-extrabold text-sm border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Explore Our Services
                </button>
              </div>
            </motion.div>

            {/* RIGHT SIDE — SOPHISTICATED ABSTRACT HEALTHCARE ECOSYSTEM VISUAL */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, x: 25 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-6 flex items-center justify-center relative"
            >
              <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
                
                {/* BACKGROUND ROTATING ORBITAL GLOW RINGS */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-teal-500/20 dark:border-teal-500/30 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-12 rounded-full border border-teal-500/30 dark:border-cyan-500/30 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-24 rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-transparent blur-xl" />

                {/* AMBIENT RADIAL PEDESTAL */}
                <div className="absolute bottom-6 w-72 h-14 bg-gradient-to-r from-teal-500/30 via-cyan-400/40 to-teal-500/30 rounded-full blur-xl transform scale-y-50" />
                <div className="absolute bottom-10 w-60 h-8 rounded-full bg-gradient-to-r from-teal-100 via-white to-teal-100 dark:from-teal-900/60 dark:via-cyan-900/40 dark:to-teal-900/60 border border-teal-300/40 dark:border-teal-500/40 shadow-inner" />

                {/* CENTRAL HEALTHCARE MEDICAL SHIELD WITH GLOW */}
                <motion.div 
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20 flex flex-col items-center justify-center"
                >
                  <div className="w-32 h-36 sm:w-36 sm:h-40 rounded-3xl bg-gradient-to-b from-[#00a896] via-teal-600 to-cyan-700 p-1 shadow-2xl shadow-teal-500/35 flex items-center justify-center relative group">
                    {/* INNER SHIELD CORE */}
                    <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-teal-900/40 via-teal-950/80 to-[#0b1329] backdrop-blur-md flex flex-col items-center justify-center p-4 border border-teal-300/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60" />
                      
                      {/* HEALTHCARE CROSS ICON */}
                      <div className="w-14 h-14 rounded-2xl bg-white text-[#00a896] flex items-center justify-center shadow-lg shadow-white/20 mb-1.5 relative z-10 group-hover:scale-110 transition-transform">
                        <Plus className="w-9 h-9 stroke-[3.5]" />
                      </div>
                      
                      <span className="text-[10px] font-black tracking-widest text-teal-200 uppercase font-mono relative z-10">
                        ABDM SECURE
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* 1. TOP-LEFT NODE: DOCTORS */}
                <motion.div 
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  className="absolute top-4 left-6 sm:left-10 z-20 flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-md border border-teal-200 dark:border-teal-700/80 shadow-xl shadow-teal-500/10 flex items-center justify-center text-[#00a896] dark:text-cyan-400 group hover:scale-110 transition-transform">
                    <Stethoscope className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    Doctors
                  </span>
                </motion.div>

                {/* 2. TOP-RIGHT NODE: HOSPITALS */}
                <motion.div 
                  animate={{ y: [3, -3, 3] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-4 right-6 sm:right-10 z-20 flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-md border border-cyan-200 dark:border-cyan-700/80 shadow-xl shadow-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group hover:scale-110 transition-transform">
                    <Building2 className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    Hospitals
                  </span>
                </motion.div>

                {/* 3. BOTTOM-LEFT NODE: PATIENTS */}
                <motion.div 
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute bottom-10 left-4 sm:left-8 z-20 flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-md border border-emerald-200 dark:border-emerald-700/80 shadow-xl shadow-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    Patients
                  </span>
                </motion.div>

                {/* 4. BOTTOM-RIGHT NODE: EMERGENCY */}
                <motion.div 
                  animate={{ y: [3, -3, 3] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
                  className="absolute bottom-10 right-4 sm:right-8 z-20 flex flex-col items-center gap-1.5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-md border border-rose-200 dark:border-rose-700/80 shadow-xl shadow-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group hover:scale-110 transition-transform">
                    <ShieldAlert className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    Emergency
                  </span>
                </motion.div>

              </div>
            </motion.div>

          </div>

          {/* 5 FEATURE CARDS STRIP WITH SMOOTH STAGGER & LIVING INTERFACE FLOAT */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-4 sm:p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5 relative overflow-hidden"
          >
            {/* AMBIENT BACKGROUND GLOW LIGHT */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {[
              {
                icon: ShieldCheck,
                title: 'Secure & Private',
                desc: '100% encrypted and ABDM-integrated for complete data security.',
                badge: 'ABDM Verified',
                hoverCard: 'hover:bg-gradient-to-b hover:from-teal-50/90 hover:via-emerald-50/50 hover:to-white dark:hover:from-teal-950/40 dark:hover:via-slate-900 dark:hover:to-slate-900 hover:border-teal-500/60 hover:shadow-xl hover:shadow-teal-500/15',
                iconBg: 'bg-gradient-to-tr from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/30',
                iconAnim: 'group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,168,150,0.8)]',
                glow: 'bg-teal-400/30 dark:bg-teal-500/30',
                titleColor: 'group-hover:text-teal-700 dark:group-hover:text-teal-300',
              },
              {
                icon: Link2,
                title: 'Unified Ecosystem',
                desc: 'Connects patients, doctors, hospitals & emergency responders seamlessly.',
                badge: 'Multi-Connect',
                hoverCard: 'hover:bg-gradient-to-b hover:from-cyan-50/90 hover:via-sky-50/50 hover:to-white dark:hover:from-cyan-950/40 dark:hover:via-slate-900 dark:hover:to-slate-900 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/15',
                iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30',
                iconAnim: 'group-hover:scale-110 group-hover:rotate-6',
                glow: 'bg-cyan-400/30 dark:bg-cyan-500/30',
                titleColor: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-300',
              },
              {
                icon: Zap,
                title: 'Instant Access',
                desc: 'Quick and easy access to healthcare services anytime, anywhere.',
                badge: 'Zero-Latency',
                hoverCard: 'hover:bg-gradient-to-b hover:from-amber-50/90 hover:via-orange-50/50 hover:to-white dark:hover:from-amber-950/40 dark:hover:via-slate-900 dark:hover:to-slate-900 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/15',
                iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30',
                iconAnim: 'group-hover:scale-110 group-hover:-rotate-6',
                glow: 'bg-amber-400/30 dark:bg-amber-500/30',
                titleColor: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
              },
              {
                icon: HeartPulse,
                title: 'Better Outcomes',
                desc: 'Streamlined care coordination for faster diagnosis and better treatment.',
                badge: 'Proactive Care',
                hoverCard: 'hover:bg-gradient-to-b hover:from-rose-50/90 hover:via-pink-50/50 hover:to-white dark:hover:from-rose-950/40 dark:hover:via-slate-900 dark:hover:to-slate-900 hover:border-rose-500/60 hover:shadow-xl hover:shadow-rose-500/15',
                iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30',
                iconAnim: 'group-hover:scale-110 group-hover:animate-pulse',
                glow: 'bg-rose-400/30 dark:bg-rose-500/30',
                titleColor: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
              },
              {
                icon: Users,
                title: 'Built for Everyone',
                desc: 'Designed for patients, doctors, hospitals, and communities.',
                badge: 'Universal',
                hoverCard: 'hover:bg-gradient-to-b hover:from-purple-50/90 hover:via-indigo-50/50 hover:to-white dark:hover:from-purple-950/40 dark:hover:via-slate-900 dark:hover:to-slate-900 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/15',
                iconBg: 'bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30',
                iconAnim: 'group-hover:scale-110',
                glow: 'bg-purple-400/30 dark:bg-purple-500/30',
                titleColor: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  animate={{ y: [-2.5, 2.5, -2.5] }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 flex flex-col items-center text-center space-y-3 relative overflow-hidden group cursor-pointer transition-all duration-300 ${feat.hoverCard}`}
                >
                  {/* AMBIENT CORNER GLOW ON HOVER */}
                  <div className={`absolute -top-10 -right-10 w-24 h-24 ${feat.glow} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  {/* ICON BADGE WITH MICRO-ANIMATION */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.iconBg} relative z-10 transition-all duration-300 ${feat.iconAnim}`}>
                    <Icon className="w-5 h-5 stroke-[2.3]" />
                  </div>

                  <div className="space-y-1 relative z-10">
                    <h4 className={`text-xs font-black text-slate-900 dark:text-white transition-colors duration-200 ${feat.titleColor}`}>
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — INTRODUCTION VIDEO SECTION
          ========================================================================= */}
      <section 
        id="about-video"
        className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0b1120] dark:via-slate-900/70 dark:to-[#0b1120] border-b border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden"
      >
        {/* DECORATIVE HEALTHCARE THEMED BACKGROUND AMBIENCE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-teal-400/10 via-[#00a896]/10 to-cyan-400/10 blur-3xl pointer-events-none rounded-full" />
        
        {/* SUBTLE ECG WAVE LINE BACKGROUND ACCENT */}
        <svg 
          className="absolute inset-x-0 top-1/3 w-full h-32 opacity-15 pointer-events-none text-[#00a896]" 
          viewBox="0 0 1200 120" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M0,60 L200,60 L220,60 L230,20 L240,100 L250,40 L260,75 L270,60 L600,60 L620,60 L630,15 L640,105 L650,35 L660,80 L670,60 L1200,60" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          
          {/* SECTION HEADING */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 text-xs font-black uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>OUR STORY</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              See How MediCare Connects Healthcare
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Discover how MediCare brings people, healthcare professionals, and essential healthcare services together in one connected ecosystem.
            </p>
          </div>

          {/* LARGE CENTERED VIDEO CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl mx-auto rounded-[28px] overflow-hidden shadow-2xl shadow-teal-500/10 border-2 border-teal-500/30 dark:border-teal-500/40 bg-slate-900 relative group"
          >
            <div className="aspect-video w-full relative bg-slate-950 flex items-center justify-center">
              
              {/* VIDEO PLAYER */}
              <video
                ref={videoRef}
                src="/about_us_.mp4"
                controls={isPlayingVideo}
                playsInline
                className="w-full h-full object-cover rounded-[26px]"
                onEnded={() => setIsPlayingVideo(false)}
              >
                Your browser does not support the video tag.
              </video>

              {/* INTERACTIVE PREVIEW OVERLAY (SHOWN BEFORE PLAY) */}
              {!isPlayingVideo && (
                <div 
                  onClick={handlePlayVideo}
                  className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 cursor-pointer group/overlay transition-all"
                >
                  {/* PLAY BUTTON WITH PULSING GLOW & HOVER MOVEMENT */}
                  <motion.div 
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative mb-5"
                  >
                    <div className="absolute inset-0 rounded-full bg-[#00a896] blur-xl opacity-60 group-hover/overlay:opacity-90 animate-pulse" />
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#00a896] via-teal-500 to-cyan-400 text-white flex items-center justify-center shadow-2xl shadow-teal-500/40 relative z-10 border-2 border-white/40">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                    Watch Our Introduction
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-200 mt-1 font-medium drop-shadow">
                    Click to play the 1080p MediCare platform walkthrough
                  </p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — INTERACTIVE STORY & MISSION / VISION / SECURITY TABS
          ========================================================================= */}
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
                <div className="p-8 sm:p-10 rounded-3xl border-2 border-teal-500/30 dark:border-teal-500/40 shadow-xl hover:shadow-2xl hover:border-[#00a896]/70 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  {/* AMBIENT 3D BACKGROUND LAYER WITH GRADIENT OVERLAY */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img 
                      src="/mission_3d_target.jpg" 
                      alt="" 
                      className="w-full h-full object-cover opacity-20 dark:opacity-20 scale-105 group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-teal-50/85 to-white/95 dark:from-slate-900/90 dark:via-teal-950/80 dark:to-slate-900/95 backdrop-blur-[2px]" />
                  </div>

                  {/* BACKGROUND GLOW ACCENTS */}
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal-400/25 dark:bg-teal-500/25 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-400/35 transition-all" />
                  <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-emerald-400/20 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00a896] to-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
                        <Target className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 font-mono shadow-xs">
                        Our Mission
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Democratizing Lifetime Health Ownership
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      To empower every citizen with complete sovereignty over their clinical history — eliminating lost paperwork, avoiding redundant diagnostic tests, and accelerating emergency response by turning scattered medical data into a single unified lifeline.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-teal-500/20 dark:border-teal-700/40 space-y-3 relative z-10">
                    {[
                      'Instant access to prescriptions, discharge summaries & lab tests',
                      'Zero-data-selling pledge with strict cryptographic patient gates',
                      'Direct doctor sharing with revocable QR and timed consent OTPs',
                    ].map((bullet, i) => (
                      <div 
                        key={i} 
                        className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-teal-500/20 dark:border-teal-700/40 flex items-center gap-3 shadow-xs hover:border-[#00a896]/50 transition-colors"
                      >
                        <div className="p-1 rounded-lg bg-teal-500/15 text-[#00a896] dark:text-cyan-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VISION CARD */}
                <div className="p-8 sm:p-10 rounded-3xl border-2 border-cyan-500/30 dark:border-cyan-500/40 shadow-xl hover:shadow-2xl hover:border-cyan-500/70 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  {/* AMBIENT 3D BACKGROUND LAYER WITH GRADIENT OVERLAY */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img 
                      src="/vision_3d_ecosystem.jpg" 
                      alt="" 
                      className="w-full h-full object-cover opacity-20 dark:opacity-20 scale-105 group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-sky-50/85 to-white/95 dark:from-slate-900/90 dark:via-sky-950/80 dark:to-slate-900/95 backdrop-blur-[2px]" />
                  </div>

                  {/* BACKGROUND GLOW ACCENTS */}
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/25 dark:bg-cyan-500/25 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/35 transition-all" />
                  <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                        <Eye className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-mono shadow-xs">
                        Our Vision
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      India’s Most Trusted Healthcare Ecosystem
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Building the national standard for interoperable digital health where 1.4 billion citizens, thousands of hospitals, and emergency personnel connect seamlessly under ABDM standards, creating proactive, preventive, and life-saving healthcare.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-cyan-500/20 dark:border-cyan-700/40 space-y-3 relative z-10">
                    {[
                      'Universal ABHA ID linkage across 100,000+ empanelled health facilities',
                      'Intelligent AI health trend indicators & proactive vital alerts',
                      'Multi-generational caregiver monitoring for senior citizens & children',
                    ].map((bullet, i) => (
                      <div 
                        key={i} 
                        className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-cyan-500/20 dark:border-cyan-700/40 flex items-center gap-3 shadow-xs hover:border-cyan-500/50 transition-colors"
                      >
                        <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bullet}</span>
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
                    className="p-6 rounded-3xl bg-gradient-to-br from-teal-500/5 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-900 border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:shadow-xl hover:border-[#00a896]/60 transition-all group flex flex-col justify-between space-y-4"
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

      {/* =========================================================================
          SECTION 4 — CORE ARCHITECTURAL PILLARS (6 CARDS WITH HOVER ACCENTS)
          ========================================================================= */}
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

          {/* SECTION 4 GRID OF 6 CORE CAPABILITY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.55, 
                    delay: idx * 0.1, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  animate={{ y: [-2.5, 2.5, -2.5] }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onStartJourney}
                  className="p-7 rounded-[22px] bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-teal-500/20 dark:border-teal-500/30 shadow-xl hover:shadow-2xl hover:shadow-teal-500/20 hover:border-teal-400/70 flex flex-col justify-between space-y-6 group transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  {/* CINEMATIC AMBIENT GRADIENT & GLOW ACCENTS */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-400/15 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:opacity-100 opacity-60 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      {/* CATEGORY LABEL */}
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/25 font-mono shadow-xs">
                        {pillar.category}
                      </span>

                      {/* ICON BADGE WITH PULSE HOVER */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-500/25 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,168,150,0.6)] transition-all duration-300">
                        <Icon className="w-5 h-5 stroke-[2.3]" />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#00a896] dark:text-cyan-400 relative z-10">
                    <span className="group-hover:underline font-bold">Explore integration</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — PLATFORM MILESTONES & TELEMETRY WITH ANIMATED COUNTUP
          ========================================================================= */}
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
                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 rounded-[22px] space-y-2 shadow-xl hover:bg-white/15 transition-all"
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

      {/* =========================================================================
          SECTION 6 — MEDICAL ADVISORY & CLINICAL LEADERSHIP TEAM (3D COVER-FLOW CAROUSEL)
          ========================================================================= */}
      <section className="py-20 bg-white dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 overflow-hidden">
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

          {/* 3D HORIZONTAL COVER-FLOW CAROUSEL FOR LEADERSHIP */}
          <div 
            className="relative w-full max-w-7xl mx-auto h-[540px] flex items-center justify-center overflow-hidden select-none"
            onMouseEnter={() => setIsLeadershipHovered(true)}
            onMouseLeave={() => setIsLeadershipHovered(false)}
            style={{ perspective: '1400px' }}
          >
            {/* AMBIENT BACKGROUND GLOW SPOTLIGHT BEHIND CENTER */}
            <motion.div 
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.65, 0.35]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/25 via-cyan-500/20 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" 
            />

            {/* 3D TRACK */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {leadership.map((mem, idx) => {
                const len = leadership.length;
                let diff = (idx - activeLeadershipIndex) % len;
                if (diff > len / 2) diff -= len;
                if (diff < -len / 2) diff += len;

                const isCenter = diff === 0;
                const isVisible = Math.abs(diff) <= 2;

                if (!isVisible) return null;

                // 3D Cover-Flow Cinematic Geometry with Perfect Spacing
                let xOffset = 0;
                let zOffset = 0;
                let scale = 1;
                let rotateY = 0;
                let zIndex = 30;
                let opacity = 1;
                let filter = 'blur(0px) brightness(1)';

                if (diff === 0) {
                  xOffset = 0;
                  zOffset = 80;
                  scale = 1.02;
                  rotateY = 0;
                  zIndex = 40;
                  opacity = 1.0;
                  filter = 'blur(0px) brightness(1.04)';
                } else if (Math.abs(diff) === 1) {
                  xOffset = diff * 320;
                  zOffset = -35;
                  scale = 0.88;
                  rotateY = diff * -18;
                  zIndex = 25;
                  opacity = 0.85;
                  filter = 'blur(0.4px) brightness(0.88)';
                } else if (Math.abs(diff) === 2) {
                  xOffset = diff * 540;
                  zOffset = -130;
                  scale = 0.72;
                  rotateY = diff * -30;
                  zIndex = 10;
                  opacity = 0.45;
                  filter = 'blur(1.5px) brightness(0.7)';
                }

                return (
                  <motion.div
                    key={idx}
                    animate={{
                      x: xOffset,
                      z: zOffset,
                      scale: scale,
                      rotateY: rotateY,
                      zIndex: zIndex,
                      opacity: opacity,
                      filter: filter,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                      mass: 0.85
                    }}
                    onClick={() => {
                      if (!isCenter) {
                        setActiveLeadershipIndex(idx);
                      }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className={`absolute w-[290px] sm:w-[320px] md:w-[330px] h-[470px] rounded-[22px] bg-slate-950 overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-500 ${
                      isCenter
                        ? 'border-2 border-cyan-400 dark:border-cyan-300 shadow-[0_25px_60px_-15px_rgba(0,168,150,0.45)] ring-4 ring-teal-500/25'
                        : 'border border-slate-700/80 shadow-xl hover:border-teal-400/60'
                    }`}
                  >
                    {/* SPECULAR SHEEN HIGHLIGHT FOR CENTER CARD */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-20" />
                    )}

                    {/* POSTER IMAGE AREA WITH CINEMATIC GRADIENT FADE */}
                    <div className="h-72 overflow-hidden relative">
                      <img 
                        src={mem.img} 
                        alt={mem.name} 
                        className={`w-full h-full object-cover object-[center_top] transition-transform duration-700 ease-out ${isCenter ? 'scale-105' : 'scale-100'}`}
                      />
                      
                      {/* DARK-TO-TRANSPARENT CINEMATIC GRADIENT OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                      
                      {/* TOP CORNER FLOATING BADGE CHIP */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md font-mono shadow-md transition-colors ${
                          isCenter 
                            ? 'bg-slate-950/90 text-cyan-300 border border-cyan-400/50 ring-2 ring-cyan-400/20' 
                            : 'bg-slate-950/80 text-slate-300 border border-slate-700'
                        }`}>
                          {mem.badge}
                        </span>
                      </div>

                      {/* OVERLAID NAME AND TITLE */}
                      <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                        <h4 className="text-lg font-black tracking-tight drop-shadow-md">{mem.name}</h4>
                        <p className="text-xs text-teal-300 font-bold drop-shadow-xs">{mem.role}</p>
                      </div>
                    </div>

                    {/* LOWER INFORMATION CONTENT */}
                    <div className="p-5 bg-slate-950 space-y-3 flex-1 flex flex-col justify-between border-t border-slate-800/80">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400 font-mono">
                          {mem.credentials}
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
                          {mem.specialty}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-teal-400">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Verified Clinical Advisor</span>
                        </div>
                        {!isCenter && (
                          <span className="text-[10px] text-cyan-300 font-mono underline hover:text-cyan-200">Focus</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* SLEEK BOTTOM NAVIGATION & PAGINATION CONTROL BAR */}
          <div className="flex items-center justify-center gap-5 pt-6 relative z-30">
            {/* PREVIOUS BUTTON */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevLeadership}
              aria-label="Previous Leadership Member"
              className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#00a896] hover:text-white hover:border-[#00a896] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </motion.button>

            {/* PAGINATION INDICATOR PILLS */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              {leadership.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLeadershipIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeLeadershipIndex === idx 
                      ? 'w-9 bg-gradient-to-r from-[#00a896] to-cyan-400 shadow-md shadow-teal-500/40' 
                      : 'w-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* NEXT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextLeadership}
              aria-label="Next Leadership Member"
              className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#00a896] hover:text-white hover:border-[#00a896] transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — HIGH-CONVERSION BOTTOM CALL TO ACTION
          ========================================================================= */}
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

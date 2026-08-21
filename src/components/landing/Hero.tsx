import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Volume2,
  VolumeX,
  FileText,
  Heart,
  Pill,
  AlertTriangle,
  QrCode
} from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
  onSeeHowItWorks: () => void;
}

const CARDS_DATA = [
  { 
    id: 'records', 
    title: 'Medical Records', 
    subtitle: '12 Records', 
    icon: FileText, 
    color: 'text-[#00a896] bg-teal-50 dark:bg-teal-950/60 border-teal-100 dark:border-teal-800/40' 
  },
  { 
    id: 'reminder', 
    title: 'Medicine Reminder', 
    subtitle: 'Next dose 8:00 AM', 
    icon: Pill, 
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-800/40' 
  },
  { 
    id: 'doctor', 
    title: 'Doctor Shared', 
    subtitle: 'Report Shared', 
    icon: QrCode, 
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-800/40' 
  },
  { 
    id: 'health', 
    title: 'Health Status', 
    subtitle: '98% Normal', 
    icon: Heart, 
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-800/40' 
  },
  { 
    id: 'sos', 
    title: 'Emergency SOS', 
    subtitle: 'SOS Ready', 
    icon: AlertTriangle, 
    color: 'text-red-500 bg-red-50 dark:bg-red-950/60 border-red-100 dark:border-red-800/40' 
  },
];

export const Hero: React.FC<HeroProps> = ({ onStartJourney, onSeeHowItWorks }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Hero video autoplay error:', err);
      });
    }
  }, []);

  // 3-SECOND AUTOMATIC HORIZONTAL CARD SWAP (SLIDES HORIZONTALLY, HIDES OTHERS)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prevIndex) => (prevIndex + 1) % CARDS_DATA.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const activeCard = CARDS_DATA[activeCardIndex];
  const IconComponent = activeCard.icon;

  return (
    <section id="home" className="relative w-full min-h-[calc(100vh-5rem)] py-12 sm:py-16 flex items-center overflow-hidden bg-slate-900">

      {/* 1. BACKGROUND VIDEO LAYER (100% STABLE, UNTOUCHED BY CARDS) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          src="/Digital_Health_Record_For_Project.mp4"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover object-top"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />

        {/* 2. VIDEO OVERLAY LAYER */}
        <div className="absolute inset-0 bg-slate-950/30 dark:bg-slate-950/45 bg-gradient-to-r from-slate-950/55 via-slate-950/20 to-transparent" />

        {/* AMBIENT GLOW DECORATIONS */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* SOUND TOGGLE BUTTON */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white shadow-lg hover:bg-slate-900 transition-all text-xs font-semibold cursor-pointer"
          title={isMuted ? "Unmute Video Audio" : "Mute Video Audio"}
          aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* 3. HERO CONTENT & HORIZONTAL SWAPPING CARD LAYER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: HERO TEXT & CTAS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* MAIN HEADLINE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
              Your Health, <br />
              <span className="text-[#00a896]">Always With You.</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-base sm:text-lg text-slate-100 max-w-xl font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Secure your medical records, manage your medicines, share health information with doctors, and stay prepared for emergencies — all in one place.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 pt-2">
              <button
                onClick={onStartJourney}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-[#00a896] hover:bg-[#00897b] rounded-xl shadow-xl shadow-teal-950/50 hover:shadow-2xl transition-all active:scale-98 gap-2.5 cursor-pointer border border-teal-500/30"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onSeeHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md rounded-xl transition-all shadow-md gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#00a896]" />
                <span>Connect ABHA</span>
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: SINGLE-CARD HORIZONTAL SWAPPING GLASS CAROUSEL */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center py-4 w-full">
            
            <div className="w-full max-w-[275px] flex flex-col items-center gap-3.5 relative lg:mt-16 sm:mt-8 mt-4">
              
              {/* HORIZONTAL SLIDING CARD CONTAINER */}
              <div className="w-full overflow-hidden py-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCard.id}
                    initial={{ opacity: 0, x: 45 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -45 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="w-full p-4 sm:p-4.5 rounded-2xl bg-white/60 dark:bg-slate-900/65 backdrop-blur-[18px] border border-white/50 dark:border-slate-700/60 shadow-2xl shadow-teal-950/15 dark:shadow-slate-950/60 flex items-center gap-3.5 transition-colors select-none"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${activeCard.color} shadow-sm`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        Health Feature
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                        {activeCard.title}
                      </h4>
                      <p className="text-xs font-extrabold text-[#00a896] dark:text-teal-300 mt-0.5 truncate">
                        {activeCard.subtitle}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CAROUSEL PROGRESS INDICATOR DOTS */}
              <div className="flex items-center gap-2 pt-1">
                {CARDS_DATA.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeCardIndex === idx 
                        ? 'w-7 bg-[#00a896]' 
                        : 'w-2 bg-white/40 dark:bg-slate-700 hover:bg-white/70'
                    }`}
                    title={`View ${card.title}`}
                    aria-label={`View ${card.title}`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};




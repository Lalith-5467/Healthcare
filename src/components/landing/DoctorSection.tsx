import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Sparkles,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

interface DoctorSectionProps {
  onOpenDoctorPortal: () => void;
}

interface DoctorCard {
  id: string;
  name: string;
  specialty: string;
  department: string;
  location: string;
  image: string;
  experience: string;
  rating: string;
  reviews: string;
  consultFee: string;
  availability: string;
  badge: string;
}

export const DoctorSection: React.FC<DoctorSectionProps> = ({ onOpenDoctorPortal }) => {
  const doctors: DoctorCard[] = [
    {
      id: 'dr-1',
      name: 'Dr. Rajesh Varma',
      specialty: 'Chief Cardiologist',
      department: 'Cardiology & Heart Surgery',
      location: 'Apollo Hospitals, Chennai',
      image: '/doctors/dr_rajesh_varma.jpg',
      experience: '15+ Yrs',
      rating: '4.98',
      reviews: '1.8k',
      consultFee: '₹850',
      availability: 'Available Today',
      badge: 'ABDM Verified'
    },
    {
      id: 'dr-2',
      name: 'Dr. Priya Sharma',
      specialty: 'Senior Neurologist',
      department: 'Neurosciences & Stroke Care',
      location: 'Fortis Memorial, Gurugram',
      image: '/doctors/dr_priya_sharma.jpg',
      experience: '12+ Yrs',
      rating: '4.96',
      reviews: '1.2k',
      consultFee: '₹900',
      availability: 'Next: 4:30 PM',
      badge: 'Gold Medalist'
    },
    {
      id: 'dr-3',
      name: 'Dr. Amit Patel',
      specialty: 'Robotic Orthopedic Surgeon',
      department: 'Joint Replacement & Spine',
      location: 'Max Super Specialty, Delhi',
      image: '/doctors/dr_amit_patel.jpg',
      experience: '16+ Yrs',
      rating: '4.94',
      reviews: '1.5k',
      consultFee: '₹800',
      availability: 'Available Today',
      badge: 'Robotic Expert'
    },
    {
      id: 'dr-4',
      name: 'Dr. Ananya Iyer',
      specialty: 'Senior Pediatrician',
      department: 'Pediatrics & Neonatal Care',
      location: 'Rainbow Children’s Hospital, Bengaluru',
      image: '/doctors/dr_ananya_iyer.jpg',
      experience: '11+ Yrs',
      rating: '4.97',
      reviews: '2.3k',
      consultFee: '₹750',
      availability: 'Next: Tomorrow',
      badge: 'Pediatric Fellow'
    },
    {
      id: 'dr-5',
      name: 'Dr. Vikram Malhotra',
      specialty: 'Cardiothoracic Surgeon',
      department: 'Cardiac Surgery & Transplantation',
      location: 'AIIMS & Medanta, New Delhi',
      image: '/doctors/dr_vikram_malhotra.jpg',
      experience: '18+ Yrs',
      rating: '4.99',
      reviews: '2.9k',
      consultFee: '₹950',
      availability: 'Available Today',
      badge: 'National Awardee'
    },
    {
      id: 'dr-6',
      name: 'Dr. Sunita Reddy',
      specialty: 'Interventional Physician',
      department: 'Internal Medicine & ABDM Lead',
      location: 'Apollo Health City, Hyderabad',
      image: '/doctors/dr_sunita_reddy.jpg',
      experience: '14+ Yrs',
      rating: '4.95',
      reviews: '1.4k',
      consultFee: '₹800',
      availability: 'Instant Video Consult',
      badge: 'ABDM Specialist'
    }
  ];

  const total = doctors.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);

  // Auto-play timer
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Subtle 3D mouse parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Helper to calculate circular relative index offset (-2, -1, 0, 1, 2)
  const getCardOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // Drag / Swipe handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartX.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - dragStartX.current;
    if (diff > 45) {
      prevSlide();
    } else if (diff < -45) {
      nextSlide();
    }
  };

  return (
    <section 
      id="doctors" 
      className="py-14 sm:py-16 bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-[#080d1a] dark:via-[#0b1224] dark:to-[#080d1a] transition-colors relative overflow-hidden select-none"
    >
      {/* AMBIENT RADIAL GLOW FOR 3D STACK DEPTH */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CENTERED SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20 text-xs font-black uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Certified Healthcare Specialists</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Meet Our Leading Doctors
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Verified Indian clinical specialists offering integrated ABDM digital records, instant telemedicine, and in-hospital consultations.
          </p>
        </div>

        {/* COMPACT 3D STACKED CARD CAROUSEL STAGE */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          className="relative h-[430px] sm:h-[450px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: 1200 }}
        >
          {doctors.map((doctor, index) => {
            const offset = getCardOffset(index);
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            let translateX = 0;
            let translateZ = 0;
            let scale = 1;
            let rotateY = 0;
            let opacity = 1;
            let zIndex = 30;

            if (isCenter) {
              translateX = mousePos.x * 10;
              translateZ = 70;
              scale = 1.02;
              rotateY = mousePos.x * 2;
              opacity = 1;
              zIndex = 30;
            } else if (offset === -1) {
              translateX = -185 + mousePos.x * 6;
              translateZ = -35;
              scale = 0.88;
              rotateY = 10 + mousePos.x * 1.5;
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === 1) {
              translateX = 185 + mousePos.x * 6;
              translateZ = -35;
              scale = 0.88;
              rotateY = -10 + mousePos.x * 1.5;
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === -2) {
              translateX = -340 + mousePos.x * 4;
              translateZ = -100;
              scale = 0.76;
              rotateY = 18 + mousePos.x * 1.5;
              opacity = 0.55;
              zIndex = 10;
            } else if (offset === 2) {
              translateX = 340 + mousePos.x * 4;
              translateZ = -100;
              scale = 0.76;
              rotateY = -18 + mousePos.x * 1.5;
              opacity = 0.55;
              zIndex = 10;
            }

            return (
              <motion.div
                key={doctor.id}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
                animate={{
                  x: translateX,
                  z: translateZ,
                  scale: scale,
                  rotateY: rotateY,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  zIndex: zIndex,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute w-[280px] sm:w-[310px] rounded-3xl bg-white dark:bg-slate-900 border transition-colors duration-300 overflow-hidden text-center ${
                  isCenter 
                    ? 'shadow-2xl shadow-teal-500/20 border-teal-500/50 dark:border-cyan-400/60 ring-1 ring-teal-500/30' 
                    : 'shadow-md border-slate-200/90 dark:border-slate-800 cursor-pointer hover:border-teal-500/40'
                }`}
              >
                {/* DOCTOR COVER PHOTO (BALANCED UN-CROPPED PORTRAIT) */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-[center_18%] transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80";
                    }}
                  />

                  {/* GRADIENT SCRIM OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* TOP BADGES */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-[#00a896] dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs border border-white/20">
                      {doctor.badge}
                    </span>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-amber-300 text-[10px] font-black backdrop-blur-md border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-[9px] text-slate-600 dark:text-slate-300 font-normal">({doctor.reviews})</span>
                    </div>
                  </div>

                  {/* BOTTOM LIVE STATUS (CENTERED) */}
                  <div className="absolute bottom-2 inset-x-0 flex items-center justify-center text-slate-900 dark:text-white z-10">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-teal-500/90 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {doctor.availability}
                    </span>
                  </div>
                </div>

                {/* CARD BODY CONTENT (CENTERED ALIGNMENT) */}
                <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-2.5 text-center">
                  <div className="text-center">
                    {/* SPECIALTY & EXP (CENTERED) */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#00a896] dark:text-cyan-400 tracking-wider font-mono">
                        {doctor.specialty}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {doctor.experience}
                      </span>
                    </div>

                    {/* DOCTOR NAME (CENTERED) */}
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate mt-0.5 text-center">
                      {doctor.name}
                    </h3>

                    {/* LOCATION (CENTERED) */}
                    <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-0.5">
                      <MapPin className="w-3 h-3 text-[#00a896] shrink-0" />
                      <span className="truncate">{doctor.location}</span>
                    </div>
                  </div>

                  {/* 3 STATS PILLS (CENTERED) */}
                  <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center">
                    <div>
                      <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Exp</span>
                      <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">{doctor.experience}</span>
                    </div>
                    <div className="border-x border-slate-200 dark:border-slate-700">
                      <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Rating</span>
                      <span className="text-[11px] font-black text-amber-500 flex items-center justify-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-500" />
                        {doctor.rating}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">ABDM</span>
                      <span className="text-[11px] font-black text-[#00a896] dark:text-cyan-300">Ready</span>
                    </div>
                  </div>

                  {/* BOTTOM ACTION & CONSULTATION FEE */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-left">
                      <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {doctor.consultFee}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDoctorPortal();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-md shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
                      title={`Book Consultation with ${doctor.name}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CAROUSEL NAVIGATION CONTROLS & VIEW ALL BUTTON */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous Doctor"
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#00a896] dark:hover:text-cyan-400 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* DOT INDICATORS */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80">
              {doctors.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? 'w-6 h-2 bg-[#00a896] dark:bg-cyan-400 shadow-xs'
                      : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next Doctor"
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#00a896] dark:hover:text-cyan-400 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <button 
            onClick={onOpenDoctorPortal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 transition-all shadow-xs hover:shadow group cursor-pointer"
          >
            <span>View All 50+ Doctors</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#00a896] dark:text-cyan-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

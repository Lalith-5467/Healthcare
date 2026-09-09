import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight, IconStethoscope, IconMapPin, IconClock } from '@tabler/icons-react';
import { HeartPulse } from 'lucide-react';

interface NurseHeroProps {
  onNavigate: (id: string) => void;
}

export const NurseHero: React.FC<NurseHeroProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-[20px] overflow-hidden shadow-sm"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#3a1523] pointer-events-none">
        {/* Subtle decorative curves/gradients on the right */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-20 w-64 h-full bg-gradient-to-r from-transparent via-[#5a1a38]/30 to-transparent skew-x-12"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8 md:px-10 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00a896] text-white text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,168,150,0.6)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              On Duty
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80">
              <IconMapPin className="w-3.5 h-3.5" /> Adyar Sector
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Good morning, <span className="text-[#ff4d8f]">Sarah</span>
          </h1>
          <p className="text-sm text-white/80 font-medium max-w-[320px] leading-relaxed">
            You're on duty today. Take care of your patients and keep up the great work.
          </p>
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto">
          {/* Decorative Heart icon box */}
          <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/5 border border-white/5 items-center justify-center">
            <HeartPulse className="w-10 h-10 text-[#9e2a53]" strokeWidth={2} />
          </div>

          <div className="flex flex-col gap-2 shrink-0 items-center">
            <button 
              onClick={() => onNavigate('requests')}
              className="w-full md:w-auto px-6 py-3 rounded-full bg-[#00a896] hover:bg-[#008f80] text-white text-[13px] font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <IconStethoscope className="w-4 h-4" /> View Care Requests <IconArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('schedule')}
              className="w-full md:w-[220px] px-6 py-2.5 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[13px] font-bold transition-all flex items-center justify-center gap-2"
            >
              <IconClock className="w-4 h-4" /> Shift Timetable
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

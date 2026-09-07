import React from 'react';
import { motion } from 'framer-motion';
import { IconMapPin, IconClock } from '@tabler/icons-react';
interface NurseHeroProps {
  onNavigate: (id: string) => void;
}

export const NurseHero: React.FC<NurseHeroProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b1e27] via-[#2a1723] to-[#431428] pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              On Duty
            </span>
            <span className="flex items-center gap-1 text-slate-300 text-xs font-medium">
              <IconMapPin className="w-3.5 h-3.5" />
              Adyar Sector
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            Good morning, Sarah
          </h1>
          <p className="text-sm text-slate-300 font-medium max-w-lg">
            You have 4 active care requests in your queue today. Your next scheduled visit is in 45 minutes at Velachery.
          </p>
        </div>

        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => onNavigate('care-requests')}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-bold shadow-md shadow-teal-900/50 transition-all text-center"
          >
            View Care Requests
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold backdrop-blur-md transition-all text-center flex items-center justify-center gap-2">
            <IconClock className="w-4 h-4" /> Shift Timetable
          </button>
        </div>
      </div>
    </motion.div>
  );
};

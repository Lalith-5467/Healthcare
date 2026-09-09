import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconArrowRight,
  IconMapPin,
  IconLungs,
  IconHeartRateMonitor,
  IconActivityHeartbeat,
  IconHeartbeat
} from '@tabler/icons-react';

export const NursePriorityDispatch: React.FC = () => {
  return (
    <section className="pt-2">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <IconHeartbeat className="w-5 h-5 text-rose-500" stroke={2.5} /> Priority care
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 ml-7">Immediate attention needed</p>
        </div>
        <button className="px-3 py-1.5 border border-teal-200 dark:border-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20">
          View all <IconArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white to-rose-50/50 dark:from-slate-900 dark:to-rose-950/20 p-6 lg:p-8 rounded-[24px] border border-rose-100/60 dark:border-rose-900/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12"
      >
        {/* Subtle glow and background decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[24px]">
          <div className="absolute top-0 left-0 w-64 h-full bg-rose-400/5 dark:bg-rose-500/5 blur-3xl"></div>
          {/* Subtle heartbeat waveform decoration - SVG absolute position */}
          <svg className="absolute -left-4 lg:-left-10 top-1/2 -translate-y-1/2 w-64 h-32 opacity-[0.03] text-rose-500" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50H40L55 20L75 80L90 50H200" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Left accent border */}
        <div className="absolute top-0 left-0 w-2 h-full bg-rose-600 dark:bg-rose-500"></div>

        {/* Patient Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pl-2 relative z-10 w-full lg:w-auto">
          <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold text-2xl flex items-center justify-center shrink-0 shadow-inner border border-pink-200 dark:border-pink-800">
            M
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-rose-200/50 dark:border-rose-800/50 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-500 animate-pulse"></span> Urgent
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              Meenakshi Raman, 72
            </h3>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">
              Post-Op Wound Care
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1.5">
              <IconMapPin className="w-3.5 h-3.5 shrink-0" /> Block A, 15th Main Rd, Anna Nagar, Chennai
            </p>
          </div>
        </div>

        {/* Vitals Container */}
        <div className="flex flex-col gap-3 relative z-10 w-full lg:w-auto">
          {/* Vitals */}
          <div className="flex items-center gap-6 sm:gap-10 pb-2 lg:pb-0">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center border border-teal-100 dark:border-teal-900/30">
                <IconLungs className="w-5 h-5 text-teal-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SpO2</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none mt-1">96%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center border border-pink-100 dark:border-pink-900/30">
                <IconHeartRateMonitor className="w-5 h-5 text-pink-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BPM</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none mt-1">88</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-100 dark:border-orange-900/30">
                <IconActivityHeartbeat className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BP</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none mt-1">140/90</span>
              </div>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Vitals stable
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Last checked 12 min ago</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full lg:w-auto shrink-0 relative z-10 flex lg:block mt-2 lg:mt-0">
          <button className="w-full lg:w-auto px-8 py-3.5 rounded-full bg-[#ec4899] hover:bg-[#db2777] text-white text-[15px] font-bold shadow-lg shadow-pink-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
            Start Visit <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

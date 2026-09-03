import React from 'react';
import { Droplet, Ruler, Scale, Gauge, Heart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthOverviewGridProps {
  bloodGroup?: string;
  height?: string;
  weight?: string;
  bmi?: number;
  heartRate?: string;
  bp?: string;
}

export const HealthOverviewGrid: React.FC<HealthOverviewGridProps> = ({
  bloodGroup = 'O+',
  height = '174 cm',
  weight = '72 kg',
  bmi = 23.8,
  heartRate = '72 BPM',
  bp = '120/80'
}) => {
  const cards = [
    { label: 'Blood Group', value: bloodGroup, status: 'ABDM Verified', icon: Droplet, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { label: 'Height', value: height, status: 'Recorded', icon: Ruler, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Weight', value: weight, status: 'Stable', icon: Scale, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { label: 'BMI Index', value: bmi.toString(), status: 'Normal', icon: Gauge, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { label: 'Heart Rate', value: heartRate, status: 'Resting', icon: Heart, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { label: 'Blood Pressure', value: bp, status: 'Optimal', icon: Activity, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' }
  ];

  return (
    <div className="relative h-full p-6 rounded-3xl bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/30 dark:hover:shadow-teal-400/5 group">
      {/* ANIMATED BACKGROUND IMAGE (SVG ECG LINES) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0 opacity-10 dark:opacity-20 flex items-center justify-center">
        <svg 
          viewBox="0 0 800 400" 
          className="absolute min-w-full min-h-full object-cover" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 0 200 L 150 200 L 180 150 L 220 300 L 260 100 L 300 250 L 330 200 L 800 200"
            fill="none"
            stroke="#00a896"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 0 300 L 400 300 L 430 250 L 470 350 L 510 150 L 550 280 L 580 300 L 800 300"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1.5 }}
          />
          <motion.path
            d="M 0 100 L 550 100 L 580 50 L 620 200 L 660 50 L 700 150 L 730 100 L 800 100"
            fill="none"
            stroke="#ec4899"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-500" />
          Health Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 flex-1 mt-4">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${c.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] uppercase font-bold text-slate-600 dark:text-slate-400 truncate">
                    {c.label}
                  </span>
                </div>
                
                <div className="pl-1">
                  <span className="text-base font-black text-slate-900 dark:text-white tracking-tight block">
                    {c.value}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                    {c.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

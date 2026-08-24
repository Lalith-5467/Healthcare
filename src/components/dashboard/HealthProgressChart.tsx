import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';

export const HealthProgressChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');
  const [activeMetric, setActiveMetric] = useState<'steps' | 'sleep' | 'heart'>('steps');

  const data7d = [
    { label: 'Mon', steps: 7200, sleep: 7.2, heart: 74 },
    { label: 'Tue', steps: 8400, sleep: 8.0, heart: 72 },
    { label: 'Wed', steps: 6500, sleep: 6.8, heart: 75 },
    { label: 'Thu', steps: 9100, sleep: 7.5, heart: 70 },
    { label: 'Fri', steps: 7800, sleep: 7.8, heart: 71 },
    { label: 'Sat', steps: 10200, sleep: 8.2, heart: 68 },
    { label: 'Sun', steps: 6842, sleep: 7.7, heart: 72 }
  ];

  const maxVal = activeMetric === 'steps' ? 12000 : activeMetric === 'sleep' ? 10 : 100;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 font-sans"
    >
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Health Progress Analytics
            </h3>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% average activity</span>
            </span>
          </div>
        </div>

        {/* METRIC TOGGLES & TIMEFRAME */}
        <div className="flex items-center gap-2 font-mono">
          <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveMetric('steps')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeMetric === 'steps' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              Steps
            </button>
            <button
              onClick={() => setActiveMetric('sleep')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeMetric === 'sleep' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              Sleep
            </button>
            <button
              onClick={() => setActiveMetric('heart')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeMetric === 'heart' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              Heart
            </button>
          </div>

          <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center text-xs font-bold">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${timeframe === '7d' ? 'bg-[#00a896] text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${timeframe === '30d' ? 'bg-[#00a896] text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              30D
            </button>
          </div>
        </div>
      </div>

      {/* BAR CHART GRAPH */}
      <div className="h-48 pt-6 flex items-end justify-between gap-2 border-b border-slate-800/80 px-2 font-mono">
        {data7d.map((d, idx) => {
          const val = d[activeMetric];
          const heightPercent = Math.round((val / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* HOVER TOOLTIP */}
              <div className="absolute -top-9 px-2.5 py-1 rounded-xl bg-slate-950 text-white text-[10px] font-extrabold shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                {d.label}: {val} {activeMetric === 'steps' ? 'steps' : activeMetric === 'sleep' ? 'hrs' : 'BPM'}
              </div>

              {/* BAR GRAPH STICK */}
              <div className="w-full max-w-[32px] bg-slate-950 rounded-t-xl h-36 flex items-end overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="w-full bg-gradient-to-t from-indigo-600 via-purple-600 to-[#00a896] rounded-t-xl transition-all duration-300 group-hover:brightness-125 shadow-md"
                />
              </div>

              {/* DAY LABEL */}
              <span className="text-[11px] font-bold text-slate-300">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

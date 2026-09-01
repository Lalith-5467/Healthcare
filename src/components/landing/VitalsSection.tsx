import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Wind, Scale } from 'lucide-react';


export const VitalsSection: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'hr' | 'bp' | 'spo2' | 'weight'>('hr');

  const metrics = [
    {
      id: 'hr',
      name: 'Heart Rate',
      unit: 'BPM',
      latest: '78',
      prev: '82',
      trend: 'Normal Resting Rhythm',
      icon: Heart,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      data: [72, 75, 71, 78, 74, 82, 78],
      svgPath: 'M 0 60 Q 40 20, 80 50 T 160 30 T 240 70 T 320 20 T 400 40',
    },
    {
      id: 'bp',
      name: 'Blood Pressure',
      unit: 'mmHg',
      latest: '120/80',
      prev: '124/82',
      trend: 'Optimal Systolic / Diastolic',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      data: [125, 122, 120, 118, 121, 124, 120],
      svgPath: 'M 0 40 Q 40 70, 80 30 T 160 60 T 240 20 T 320 50 T 400 30',
    },
    {
      id: 'spo2',
      name: 'Oxygen (SpO₂)',
      unit: '%',
      latest: '98',
      prev: '97',
      trend: 'Optimal Blood Oxygenation',
      icon: Wind,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      data: [97, 98, 97, 98, 99, 97, 98],
      svgPath: 'M 0 30 Q 40 20, 80 25 T 160 20 T 240 30 T 320 15 T 400 20',
    },
    {
      id: 'weight',
      name: 'Body Weight',
      unit: 'kg',
      latest: '68.4',
      prev: '69.1',
      trend: 'Steady Decline Trend',
      icon: Scale,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      data: [70, 69.8, 69.5, 69.1, 68.8, 68.6, 68.4],
      svgPath: 'M 0 20 Q 40 35, 80 45 T 160 55 T 240 65 T 320 70 T 400 75',
    },
  ];

  const current = metrics.find((m) => m.id === activeMetric) || metrics[0];

  return (
    <section className="py-24 bg-white dark:bg-[#0B0F17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <Activity className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Interactive Telemetry Visualization
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See Your Health Change Over Time.
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            Switch between vital metrics below to inspect live trend graph reveals.
          </p>
        </div>

        {/* METRIC SELECTOR TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {metrics.map((m) => {
            const Icon = m.icon;
            const isSelected = activeMetric === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id as any)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-[#FF5B22] shadow-xl scale-105'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{m.name}</span>
                  <div className={`p-2 rounded-lg ${m.bgColor} ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="text-2xl font-extrabold">{m.latest}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{m.unit}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CHART VISUALIZATION SURFACE */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900 text-white border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Selected Telemetry</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{current.name}</span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({current.unit})</span>
              </h3>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Latest Reading</p>
                <p className="text-lg font-bold text-orange-400">{current.latest} {current.unit}</p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
                <p className="text-slate-500 dark:text-slate-400">Previous Reading</p>
                <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{current.prev} {current.unit}</p>
              </div>
            </div>
          </div>

          {/* SVG DYNAMIC CHART */}
          <div className="h-64 w-full relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.svg
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full overflow-visible"
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
              >
                {/* GRID LINES */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

                {/* ANIMATED PATH */}
                <motion.path
                  d={current.svgPath}
                  fill="none"
                  stroke="#FF5B22"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </motion.svg>
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <span>Observation Trend: <strong className="text-emerald-400">{current.trend}</strong></span>
            <span>Historical Log: 7-Day Window</span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Pill, CheckCircle2, Clock, XCircle } from 'lucide-react';

export const MedicationSection: React.FC = () => {
  const [_hoveredDay, setHoveredDay] = useState<string | null>(null);


  const schedule = [
    { time: '08:00 AM', name: 'Metformin 500mg', dose: '1 Tablet after food', status: 'taken' },
    { time: '02:00 PM', name: 'Telmisartan 40mg', dose: '1 Tablet before lunch', status: 'upcoming' },
    { time: '08:00 PM', name: 'Atorvastatin 10mg', dose: '1 Tablet at bedtime', status: 'upcoming' },
  ];

  const weeklyAdherence = [
    { day: 'Mon', morning: true, evening: true },
    { day: 'Tue', morning: true, evening: true },
    { day: 'Wed', morning: true, evening: false },
    { day: 'Thu', morning: true, evening: true },
    { day: 'Fri', morning: true, evening: true },
    { day: 'Sat', morning: true, evening: true },
    { day: 'Sun', morning: true, evening: true },
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-[#0B0F17]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Pill className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Precision Medication Management
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Seamless Routine & Adherence Analytics.
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            Never miss a prescription dose with automated reminders and adherence scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* LEFT: HORIZONTAL TIMELINE SCHEDULE */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Today’s Medication Stream
            </h3>

            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    item.status === 'taken'
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      item.status === 'taken' 
                        ? 'bg-emerald-500/20 text-emerald-500' 
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      <Pill className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FF5B22]">{item.time}</span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.dose}</p>
                    </div>
                  </div>

                  <div>
                    {item.status === 'taken' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Taken
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
                        <Clock className="w-4 h-4" /> Upcoming
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: CIRCULAR 3D ADHERENCE GAUGE */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              WEEKLY ADHERENCE SCORE
            </h3>

            {/* CIRCULAR SVG GAUGE */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#orangeGradient)"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset="21"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF5B22" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">92%</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Excellent</span>
              </div>
            </div>

            {/* MON-SUN BREAKDOWN GRID */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-3">7-Day Dose Compliance</p>
              <div className="flex justify-between items-center gap-1.5">
                {weeklyAdherence.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDay(item.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 hover:border-orange-500/40 transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{item.day}</span>
                    <div className="flex flex-col gap-1">
                      {item.morning ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                      {item.evening ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

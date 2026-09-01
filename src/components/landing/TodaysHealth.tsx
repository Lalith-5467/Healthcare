import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Activity, 
  Calendar, 
  Inbox, 
  ChevronDown, 
  CheckCircle2, 
  FileText, 
  Video, 
  Sparkles
} from 'lucide-react';


export const TodaysHealth: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>('medication');

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0B0F17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#FF5B22]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5B22]">
              Live Daily Dashboard Surface
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Know Today.
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            Click any interactive widget below to reveal instant medical details and actions.
          </p>
        </div>

        {/* DYNAMIC DASHBOARD SURFACE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* 1. MEDICATION WIDGET */}
          <motion.div
            layout
            onClick={() => toggleCard('medication')}
            className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
              expandedCard === 'medication'
                ? 'bg-slate-900 text-white border-[#FF5B22] shadow-2xl ring-1 ring-orange-500/50'
                : 'bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Medication Schedule</h3>
                  <p className={`text-xs ${expandedCard === 'medication' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500'}`}>
                    8:00 AM • Morning Dose Taken
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Taken
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedCard === 'medication' ? 'rotate-180 text-orange-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedCard === 'medication' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Metformin Hydrocholoride 500mg</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">1 Tablet after breakfast • Verified by Dr. Kumar</p>
                    </div>
                    <span className="text-emerald-400 font-mono font-semibold">08:05 AM ✓</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/80 border border-slate-200 dark:border-slate-700 opacity-60">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Telmisartan 40mg</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">1 Tablet evening 08:00 PM</p>
                    </div>
                    <span className="text-amber-400 font-mono font-semibold">Upcoming</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 2. VITALS WIDGET */}
          <motion.div
            layout
            onClick={() => toggleCard('vitals')}
            className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
              expandedCard === 'vitals'
                ? 'bg-slate-900 text-white border-[#FF5B22] shadow-2xl ring-1 ring-orange-500/50'
                : 'bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Health Vitals Telemetry</h3>
                  <p className={`text-xs ${expandedCard === 'vitals' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500'}`}>
                    78 BPM • 120/80 mmHg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                  Normal
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedCard === 'vitals' ? 'rotate-180 text-orange-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedCard === 'vitals' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-500 dark:text-slate-400 text-[10px]">Resting Pulse</p>
                      <p className="text-lg font-bold text-rose-400">78 <span className="text-xs text-slate-500 dark:text-slate-400">BPM</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-500 dark:text-slate-400 text-[10px]">Blood Pressure</p>
                      <p className="text-lg font-bold text-blue-400">120/80 <span className="text-xs text-slate-500 dark:text-slate-400">mmHg</span></p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 3. APPOINTMENT WIDGET */}
          <motion.div
            layout
            onClick={() => toggleCard('appointment')}
            className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
              expandedCard === 'appointment'
                ? 'bg-slate-900 text-white border-[#FF5B22] shadow-2xl ring-1 ring-orange-500/50'
                : 'bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-[#FF5B22] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Doctor Consultation</h3>
                  <p className={`text-xs ${expandedCard === 'appointment' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500'}`}>
                    Dr. Kumar • Today 5:30 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#FF5B22] bg-orange-500/10 px-2.5 py-1 rounded-full">
                  5:30 PM
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedCard === 'appointment' ? 'rotate-180 text-orange-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedCard === 'appointment' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Dr. Rajesh Kumar (Cardiologist)</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Video Consultation Link Active</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-[#FF5B22] text-slate-900 dark:text-white font-bold text-[11px] flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> Join Video
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 4. HEALTH INBOX WIDGET */}
          <motion.div
            layout
            onClick={() => toggleCard('inbox')}
            className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
              expandedCard === 'inbox'
                ? 'bg-slate-900 text-white border-[#FF5B22] shadow-2xl ring-1 ring-orange-500/50'
                : 'bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Health Inbox</h3>
                  <p className={`text-xs ${expandedCard === 'inbox' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500'}`}>
                    2 New Updates Received
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                  2 New
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedCard === 'inbox' ? 'rotate-180 text-orange-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedCard === 'inbox' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Lab Report Ready</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Lipid Profile uploaded by Apollo Diagnostics</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Heart, 
  Moon, 
  Zap, 
  RefreshCw, 
  Sparkles,
  Info,
  X,
  CheckCircle2
} from 'lucide-react';

export const HealthScoreCard: React.FC = () => {
  const [score, setScore] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const targetScore = 85;

  // Animated Count-Up Logic
  const animateCount = () => {
    setScore(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(interval);
      } else {
        setScore(current);
      }
    }, 18);
  };

  useEffect(() => {
    animateCount();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    animateCount();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between group font-sans text-slate-900 dark:text-white dark:bg-slate-900/95 dark:border-slate-800 bg-gradient-to-br from-teal-50 via-teal-100/30 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-teal-500/20 dark:border-teal-500/10 shadow-[0_4px_32px_rgba(20,184,166,0.1),_0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
      >
        {/* BACKGROUND AMBIENT GLOWS */}
        <div className="absolute -top-16 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" style={{ background: 'radial-gradient(circle,rgba(20,184,166,.18) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)' }} />
        {/* Subtle running shoe illustration */}
        <div className="absolute bottom-8 right-6 opacity-[.06] pointer-events-none select-none text-[72px] group-hover:opacity-[.09] transition-opacity duration-500">
          🏃
        </div>

        {/* TOP LABEL & REFRESH ACTION */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            {/* Circular gradient icon — matches reference */}
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg,#2dd4bf,#059669)', boxShadow: '0 4px 14px rgba(20,184,166,.4)' }}
            >
              <Activity className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Your Health Score
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailModal(true)}
                  className="text-slate-400 hover:text-[#00a896] dark:hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Score details"
                >
                  <Info className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Optimal Vitals • Live</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-xl bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-slate-300 hover:text-[#00a896] dark:hover:text-cyan-300 transition-all cursor-pointer border border-teal-200/60 dark:border-slate-700"
              title="Re-sync Health Vitals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00a896]' : ''}`} />
            </button>

            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full text-[#00897b] dark:text-cyan-300 border font-mono shadow-xs flex items-center gap-1" style={{ background: 'rgba(20,184,166,.12)', borderColor: 'rgba(20,184,166,.25)' }}>
              <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Weekly Sync</span>
            </span>
          </div>
        </div>

        {/* MAIN BODY: CIRCULAR GAUGE + VITAL METRICS */}
        <div className="my-5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* LEFT: CIRCULAR ANIMATED GAUGE (5 COLS) */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              
              {/* PULSING RADIAL GLOW RING */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-2 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-emerald-500/20 blur-md"
              />

              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="healthScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00a896" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="46"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="11"
                  fill="transparent"
                />
                
                {/* Animated Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="46"
                  stroke="url(#healthScoreGradient)"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* CENTER TEXT SCORE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span 
                  key={score}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none bg-gradient-to-r from-slate-900 via-[#00a896] to-cyan-500 dark:from-white dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent"
                >
                  {score}
                </motion.span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-1 font-mono uppercase tracking-wider">
                  Out of 100
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: VITAL METRICS SNAPSHOT GRID (7 COLS) — styled per reference */}
          <div className="sm:col-span-7 grid grid-cols-2 gap-2.5 font-sans">
            
            {/* HEART RATE */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-2.5 rounded-2xl flex items-center gap-2.5 bg-white/85 dark:bg-slate-800/80 border border-rose-400/20 shadow-[0_2px_8px_rgba(251,113,133,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#fecaca,#f87171)' }}>
                <Heart className="w-3.5 h-3.5 text-white animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Heart Rate</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">72 BPM</span>
              </div>
            </motion.div>

            {/* SPO2 OXYGEN */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-2.5 rounded-2xl flex items-center gap-2.5 bg-white/85 dark:bg-slate-800/80 border border-teal-500/20 shadow-[0_2px_8px_rgba(20,184,166,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#5eead4,#0d9488)' }}>
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Blood SpO2</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">98%</span>
              </div>
            </motion.div>

            {/* BLOOD PRESSURE */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-2.5 rounded-2xl flex items-center gap-2.5 bg-white/85 dark:bg-slate-800/80 border border-indigo-500/20 shadow-[0_2px_8px_rgba(99,102,241,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#c7d2fe,#6366f1)' }}>
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Blood Press.</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">120/80</span>
              </div>
            </motion.div>

            {/* SLEEP QUALITY */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-2.5 rounded-2xl flex items-center gap-2.5 bg-white/85 dark:bg-slate-800/80 border border-purple-500/20 shadow-[0_2px_8px_rgba(168,85,247,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#e9d5ff,#9333ea)' }}>
                <Moon className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Sleep Avg.</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">7.8 hrs</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* FOOTER: mini sparkline + trend + analysis */}
        <div className="pt-3 border-t relative z-10" style={{ borderColor: 'rgba(20,184,166,.15)' }}>
          {/* Mini sparkline SVG */}
          <svg className="w-full h-6 mb-2" viewBox="0 0 240 24" fill="none" preserveAspectRatio="none">
            <polyline
              points="0,20 30,16 60,18 90,12 120,14 150,8 180,6 210,4 240,2"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <polyline
              points="0,20 30,16 60,18 90,12 120,14 150,8 180,6 210,4 240,2"
              stroke="url(#sparkFill)"
              strokeWidth="0"
              fill="url(#sparkFill)"
              fillOpacity=".15"
            />
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity=".3"/>
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>+4 points from last week</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Target: 90+</span>
              <button
                onClick={() => setShowDetailModal(true)}
                className="px-2 py-0.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                style={{ background: 'rgba(20,184,166,.12)', color: '#0d9488' }}
              >
                Analysis →
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Health Score Breakdown</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Calculated from wearable telemetry & medical record sync</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL SCORE METRICS */}
              <div className="space-y-3 font-mono">
                {[
                  { label: 'Cardiovascular Health', score: '92/100', status: 'Optimal', color: 'text-emerald-500' },
                  { label: 'Metabolic & Blood Glucose', score: '84/100', status: 'Good', color: 'text-teal-500' },
                  { label: 'Sleep & Recovery Cycle', score: '88/100', status: 'Optimal', color: 'text-cyan-500' },
                  { label: 'Medication Adherence', score: '100/100', status: 'Perfect', color: 'text-emerald-400' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-sans font-bold text-slate-900 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-[#00a896]" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-extrabold ${item.color}`}>{item.score}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-bold">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                <span className="font-extrabold text-[#00a896] dark:text-cyan-300 block">Doctor Recommendation:</span>
                <p className="font-medium">Maintain your current exercise regime. Consistent 30-minute daily walks will help reach your target score of 90+ next week.</p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md cursor-pointer transition-colors"
              >
                Close Analysis
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

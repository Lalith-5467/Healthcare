import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  AlertCircle,
  Activity,
  Heart,
  Target,
  RefreshCcw,
  ChevronRight,
  Zap
} from 'lucide-react';

export const ReportInsightsView: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setToastMessage("AI Analysis updated successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 2000);
  };

  // Sparkline SVG component for trend graphs
  const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 100}`).join(' ');
    
    return (
      <svg className="w-full h-12 overflow-visible" viewBox="0 -10 100 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,100 L${points} L100,100 Z`} fill={`url(#gradient-${color})`} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-sm"
        />
        {/* Last data point dot */}
        <circle 
          cx="100" 
          cy={100 - ((data[data.length - 1] - min) / range) * 100} 
          r="4" 
          fill="white" 
          stroke={color} 
          strokeWidth="2" 
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6 font-sans pb-16 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white bg-indigo-500"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-gradient-to-br from-indigo-50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-800/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 items-center justify-center">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-indigo-500 dark:text-indigo-400 uppercase mb-1 block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI HEALTH INTELLIGENCE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Report Insights & AI
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                AI-powered analysis of your medical records and biomarkers
              </p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating}
          className="relative group flex items-center gap-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] border border-indigo-400/50 dark:border-indigo-300/30 w-full sm:w-auto justify-center z-10 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <RefreshCcw className={`w-4 h-4 relative z-10 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="relative z-10 tracking-wide">{isGenerating ? 'Analyzing...' : 'Refresh Analysis'}</span>
        </motion.button>
      </motion.div>

      {/* 2. QUICK HEALTH STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Health Score', value: '88', unit: '/ 100', icon: Heart, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Biomarkers', value: '14', unit: 'Tracked', icon: Activity, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Improvement', value: '3', unit: 'Areas', icon: Target, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Last Sync', value: 'Today', unit: '09:41 AM', icon: RefreshCcw, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none flex items-baseline gap-1">
                {stat.value} <span className="text-xs font-bold text-slate-400">{stat.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. AI HEALTH SUMMARY */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(99,102,241,0.2)] text-white relative overflow-hidden group border border-indigo-500/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md shrink-0 border border-white/20">
              <Sparkles className="w-8 h-8 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-xl font-black mb-2 tracking-tight">AI Health Summary</h2>
              <p className="text-indigo-100/90 leading-relaxed font-medium">
                Based on your recent lab reports from Aug 15th, your <strong className="text-white bg-indigo-500/40 px-1.5 py-0.5 rounded">cholesterol levels have improved by 15%</strong>. However, your Vitamin D levels are slightly below the recommended range. We suggest increasing sun exposure or discussing a supplement with your doctor.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. KEY BIOMARKERS TREND */}
      <section className="space-y-4">
        <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
          <Activity className="w-5 h-5 text-indigo-500" />
          Key Biomarker Trends
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">HbA1c (Blood Sugar)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">5.4%</span>
                  <span className="text-xs font-black text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                    <TrendingDown className="w-3 h-3 mr-0.5" /> -0.2%
                  </span>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                Good
              </div>
            </div>
            <div className="mt-2 w-full pt-2">
              <Sparkline data={[5.8, 5.7, 5.6, 5.5, 5.4]} color="#10b981" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              <span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Now</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">LDL Cholesterol</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">110</span>
                  <span className="text-xs font-black text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                    <TrendingDown className="w-3 h-3 mr-0.5" /> -15%
                  </span>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                Good
              </div>
            </div>
            <div className="mt-2 w-full pt-2">
              <Sparkline data={[140, 135, 125, 118, 110]} color="#10b981" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              <span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Now</span>
            </div>
          </motion.div>

          {/* Card 3 - Attention */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-rose-200 dark:border-rose-900/50 shadow-sm flex flex-col gap-4 group transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 dark:bg-rose-500/10 blur-2xl rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Vitamin D3</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tighter">18</span>
                  <span className="text-xs font-black text-rose-500 flex items-center bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded">
                    <TrendingDown className="w-3 h-3 mr-0.5" /> -5%
                  </span>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-rose-200 dark:border-rose-800/50 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Attention
              </div>
            </div>
            <div className="mt-2 w-full pt-2 relative z-10">
              <Sparkline data={[28, 26, 24, 20, 18]} color="#f43f5e" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 relative z-10">
              <span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Now</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 5. HEALTH INSIGHTS */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-4"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-3xl p-6 border border-indigo-100/50 dark:border-indigo-800/30 flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-12 h-12 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-800/50">
            <Zap className="w-6 h-6 text-indigo-500 fill-indigo-500" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">AI Prediction</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Based on your current trajectory, increasing your daily step count by 2,000 could improve your resting heart rate by 5% within the next 30 days.
            </p>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
};

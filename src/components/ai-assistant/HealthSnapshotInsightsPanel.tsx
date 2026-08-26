import React, { useState } from 'react';
import { Sparkles, RefreshCw, Bookmark, Calendar, Pill, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import type { HealthTipItem } from './aiAssistantData';
import { HEALTH_TIPS_COLLECTION } from './aiAssistantData';

interface HealthSnapshotInsightsPanelProps {
  onNavigate: (page: string) => void;
  onSaveTip: (tip: HealthTipItem) => void;
}

export const HealthSnapshotInsightsPanel: React.FC<HealthSnapshotInsightsPanelProps> = ({
  onNavigate,
  onSaveTip,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const currentTip = HEALTH_TIPS_COLLECTION[tipIndex % HEALTH_TIPS_COLLECTION.length];

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl text-xs font-sans text-slate-900 dark:text-white">
      {/* 1. MY HEALTH SNAPSHOT */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-sans">My Health Snapshot</h3>
          <span className="text-[10px] text-[#00a896] dark:text-cyan-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
            Live Sync
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-sans font-bold">Next Visit</span>
            <strong className="text-slate-900 dark:text-white block font-sans font-extrabold truncate">25 Aug (Dr. Rajesh)</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-sans font-bold">Active Meds</span>
            <strong className="text-[#00a896] dark:text-cyan-300 block font-extrabold">3 Reminders</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-sans font-bold">Check-Up Due</span>
            <strong className="text-amber-600 dark:text-amber-300 block font-extrabold">In 30 Days</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-sans font-bold">Insurance</span>
            <strong className="text-emerald-600 dark:text-emerald-400 block font-sans font-extrabold">Active (₹10L)</strong>
          </div>
        </div>
      </div>

      {/* 2. AI HEALTH INSIGHTS */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 text-[#00a896] dark:text-cyan-300 font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Dashboard Insights</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white font-sans text-xs block font-bold">🗓 Appointment Tomorrow</strong>
            <p className="text-slate-600 dark:text-slate-400 text-[10px] font-sans font-medium">Prepare your symptoms & current medication list for Dr. Rajesh Kumar.</p>
            <button onClick={() => onNavigate('appointments')} className="text-[#00a896] dark:text-cyan-300 font-bold hover:underline cursor-pointer">
              View Appointment Details &rarr;
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white font-sans text-xs block font-bold">💊 3 Active Reminders</strong>
            <p className="text-slate-600 dark:text-slate-400 text-[10px] font-sans font-medium">Ensure Amlodipine 5mg is taken on schedule after dinner.</p>
            <button onClick={() => onNavigate('medicines')} className="text-[#00a896] dark:text-cyan-300 font-bold hover:underline cursor-pointer">
              Check Medicines Schedule &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S HEALTH TIP */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-teal-500/30 space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase text-[#00a896] dark:text-cyan-300 tracking-wider">Today's Health Tip</span>
          <span className="text-[9px] text-slate-500 font-bold">{currentTip.category}</span>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-xs font-sans leading-relaxed font-medium">{currentTip.tip}</p>

        <div className="flex justify-between items-center pt-1 text-[10px]">
          <button onClick={() => setTipIndex(tipIndex + 1)} className="text-slate-600 dark:text-slate-400 hover:text-[#00a896] flex items-center gap-1 cursor-pointer font-bold">
            <RefreshCw className="w-3 h-3" />
            <span>Next Tip</span>
          </button>
          <button onClick={() => onSaveTip(currentTip)} className="text-[#00a896] dark:text-cyan-300 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            <Bookmark className="w-3 h-3" />
            <span>Save Tip</span>
          </button>
        </div>
      </div>

      {/* 4. QUICK MODULE ACTIONS */}
      <div className="space-y-2 pt-1 font-mono text-[11px]">
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-sans">Quick Module Links</span>
        <div className="grid grid-cols-2 gap-2 font-sans font-bold">
          <button onClick={() => onNavigate('hospitals')} className="p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-left cursor-pointer transition-colors">
            🏥 Hospitals
          </button>
          <button onClick={() => onNavigate('checkup')} className="p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-left cursor-pointer transition-colors">
            🩺 Check-Up
          </button>
          <button onClick={() => onNavigate('insurance')} className="p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-left cursor-pointer transition-colors">
            🛡 Insurance
          </button>
          <button onClick={() => onNavigate('emergency')} className="p-2.5 bg-rose-50 dark:bg-slate-950 hover:bg-rose-100 dark:hover:bg-slate-800 rounded-xl border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-left cursor-pointer transition-colors font-extrabold">
            🚨 SOS Alert
          </button>
        </div>
      </div>
    </div>
  );
};

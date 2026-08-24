import React, { useState } from 'react';
import { Sparkles, RefreshCw, Bookmark } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl text-xs">
      {/* 1. MY HEALTH SNAPSHOT */}
      <div className="space-y-3 border-b border-slate-800 pb-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-sm font-sans">My Health Snapshot</h3>
          <span className="text-[10px] text-purple-300">Live Sync</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Next Appointment</span>
            <strong className="text-white block font-sans">25 Aug (Dr. Rajesh)</strong>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Active Medicines</span>
            <strong className="text-cyan-300 block">3 Reminders</strong>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Check-Up Due</span>
            <strong className="text-amber-300 block">In 30 Days</strong>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Insurance</span>
            <strong className="text-emerald-400 block font-sans">Active (₹10L)</strong>
          </div>
        </div>
      </div>

      {/* 2. AI HEALTH INSIGHTS */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 text-purple-300 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>AI Dashboard Insights</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-white font-sans text-xs block">🗓 Appointment Tomorrow</strong>
            <p className="text-slate-400 text-[10px] font-sans">Prepare your symptoms & current medication list for Dr. Rajesh Kumar.</p>
            <button onClick={() => onNavigate('appointments')} className="text-purple-300 font-bold hover:underline cursor-pointer">
              View Appointment Details →
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-white font-sans text-xs block">💊 3 Active Reminders</strong>
            <p className="text-slate-400 text-[10px] font-sans">Ensure Amlodipine 5mg is taken on schedule after dinner.</p>
            <button onClick={() => onNavigate('medicines')} className="text-cyan-300 font-bold hover:underline cursor-pointer">
              Check Medicines Schedule →
            </button>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S HEALTH TIP */}
      <div className="p-3.5 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl border border-purple-500/30 space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase text-purple-300 tracking-wider">Today's Health Tip</span>
          <span className="text-[9px] text-slate-500">{currentTip.category}</span>
        </div>

        <p className="text-slate-300 text-xs font-sans leading-relaxed">{currentTip.tip}</p>

        <div className="flex justify-between items-center pt-1 text-[10px]">
          <button onClick={() => setTipIndex(tipIndex + 1)} className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
            <RefreshCw className="w-3 h-3" />
            <span>Next Tip</span>
          </button>
          <button onClick={() => onSaveTip(currentTip)} className="text-purple-300 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            <Bookmark className="w-3 h-3" />
            <span>Save Tip</span>
          </button>
        </div>
      </div>

      {/* 4. QUICK MODULE ACTIONS */}
      <div className="space-y-2 pt-1 font-mono text-[11px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Quick Module Links</span>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onNavigate('hospitals')} className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 text-left cursor-pointer">
            🏥 Hospitals
          </button>
          <button onClick={() => onNavigate('checkup')} className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 text-left cursor-pointer">
            🩺 Check-Up
          </button>
          <button onClick={() => onNavigate('insurance')} className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 text-left cursor-pointer">
            🛡 Insurance
          </button>
          <button onClick={() => onNavigate('emergency')} className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-rose-500/30 text-rose-300 text-left cursor-pointer font-bold">
            🚨 SOS Alert
          </button>
        </div>
      </div>
    </div>
  );
};

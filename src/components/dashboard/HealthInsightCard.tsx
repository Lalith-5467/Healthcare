import React from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface HealthInsightCardProps {
  onNavigate: (id: string) => void;
}

export const HealthInsightCard: React.FC<HealthInsightCardProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
      {/* GLOW DECORATION */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Today's Health Insight
              </h3>
              <span className="text-[10px] font-bold text-amber-300">AI Daily Analysis</span>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Smart Tip</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
          "You're doing great! Your sleep quality improved by <strong>8%</strong> this week, and your resting heart rate remains optimal at 72 BPM. Maintain your evening hydration routine."
        </p>
      </div>

      <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('analytics')}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-cyan-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>View Health Analytics</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-slate-400">Updated 2h ago</span>
      </div>
    </div>
  );
};

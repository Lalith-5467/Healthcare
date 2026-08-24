import React from 'react';
import { Gauge, Info } from 'lucide-react';

interface BMIVisualizerCardProps {
  bmi?: number;
}

export const BMIVisualizerCard: React.FC<BMIVisualizerCardProps> = ({ bmi = 23.8 }) => {
  // Map BMI (15 to 35) to percentage (0% to 100%)
  const percentage = Math.min(Math.max(((bmi - 15) / (35 - 15)) * 100, 5), 95);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              BMI Index Visualizer
            </h3>
            <span className="text-[11px] text-slate-400">Body Mass Index Metric</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-900 dark:text-white">{bmi}</span>
          <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            Normal Weight
          </span>
        </div>
      </div>

      {/* HORIZONTAL RANGE BAR */}
      <div className="space-y-2 pt-2">
        <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-rose-500 overflow-visible">
          {/* USER VALUE INDICATOR MARKER */}
          <div
            style={{ left: `${percentage}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-slate-900 shadow-xl z-10 flex items-center justify-center transition-all duration-700"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00a896]" />
          </div>
        </div>

        {/* RANGE LABELS */}
        <div className="grid grid-cols-4 text-[10px] font-bold text-slate-400 text-center pt-1">
          <span className="text-blue-400">Underweight (&lt; 18.5)</span>
          <span className="text-emerald-400">Normal (18.5 - 24.9)</span>
          <span className="text-amber-400">Overweight (25 - 29.9)</span>
          <span className="text-rose-400">Obese (30+)</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>BMI is presented as a general health metric for tracking, not a formal medical diagnosis.</span>
      </div>
    </div>
  );
};

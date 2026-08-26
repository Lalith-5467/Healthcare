import React from 'react';
import { Play } from 'lucide-react';
import type { EmergencyActivityItem } from './emergencyData';

interface EmergencyHistorySectionProps {
  history: EmergencyActivityItem[];
  onRunTest: () => void;
}

export const EmergencyHistorySection: React.FC<EmergencyHistorySectionProps> = ({
  history,
  onRunTest,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency System Activity & Test</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Simulated history log of emergency alerts & system checks</p>
        </div>

        <button
          onClick={onRunTest}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Run System Test</span>
        </button>
      </div>

      {/* HISTORY LOG */}
      <div className="space-y-3 font-mono">
        {history.map((item) => (
          <div key={item.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                item.status === 'Completed'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : item.status === 'Cancelled'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
              }`}>
                {item.status === 'Completed' ? '✓' : '⚡'}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white font-sans text-xs">{item.event}</h4>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{item.date} at {item.time}</span>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
              item.status === 'Completed'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : item.status === 'Cancelled'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

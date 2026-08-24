import React from 'react';
import { Moon, Footprints, Flame, Droplets, Utensils, Smile } from 'lucide-react';

export const LifestyleWellnessGrid: React.FC = () => {
  const items = [
    { label: 'Sleep Duration', value: '7h 42m', progress: 82, icon: Moon, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', bar: 'bg-indigo-500' },
    { label: 'Daily Steps', value: '6,842', progress: 68, icon: Footprints, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', bar: 'bg-emerald-500' },
    { label: 'Exercise', value: '42 min', progress: 84, icon: Flame, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', bar: 'bg-amber-500' },
    { label: 'Hydration', value: '2.1 L', progress: 70, icon: Droplets, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', bar: 'bg-cyan-500' },
    { label: 'Nutrition', value: 'Good', progress: 85, icon: Utensils, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', bar: 'bg-teal-500' },
    { label: 'Stress Level', value: 'Moderate', progress: 50, icon: Smile, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', bar: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
        Lifestyle & Wellness
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${it.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{it.progress}%</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
                  {it.label}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {it.value}
                </span>
              </div>

              {/* SMALL PROGRESS BAR */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div style={{ width: `${it.progress}%` }} className={`h-full rounded-full ${it.bar}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

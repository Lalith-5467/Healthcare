import React from 'react';
import { Heart, Activity, Moon, Footprints, Scale, Gauge, TrendingUp, TrendingDown } from 'lucide-react';

export const HealthSnapshotGrid: React.FC = () => {
  const metrics = [
    {
      id: 'heart',
      label: 'Heart Rate',
      value: '72 BPM',
      status: 'Normal',
      trend: '↓ 2% yesterday',
      isUp: false,
      icon: Heart,
      iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 'bp',
      label: 'Blood Pressure',
      value: '120/80',
      status: 'Optimal',
      trend: '120/80 mmHg',
      isUp: true,
      icon: Activity,
      iconColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
    },
    {
      id: 'sleep',
      label: 'Sleep Duration',
      value: '7h 42m',
      status: 'Restful',
      trend: '↑ 8% this week',
      isUp: true,
      icon: Moon,
      iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 'steps',
      label: 'Daily Steps',
      value: '6,842',
      status: 'Target: 10k',
      trend: '68% completed',
      isUp: true,
      icon: Footprints,
      iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'weight',
      label: 'Body Weight',
      value: '72 kg',
      status: 'Stable',
      trend: 'No change',
      isUp: true,
      icon: Scale,
      iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'bmi',
      label: 'Body Mass Index',
      value: '23.8',
      status: 'Healthy',
      trend: 'Ideal range',
      isUp: true,
      icon: Gauge,
      iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time biometric vitals & snapshot tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${m.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {m.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
                  {m.label}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {m.value}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                {m.isUp ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500 shrink-0" />
                )}
                <span className="truncate">{m.trend}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

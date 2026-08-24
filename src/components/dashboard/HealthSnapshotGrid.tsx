import React from 'react';
import { motion } from 'framer-motion';
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
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      id: 'bp',
      label: 'Blood Pressure',
      value: '120/80',
      status: 'Optimal',
      trend: '120/80 mmHg',
      isUp: true,
      icon: Activity,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'sleep',
      label: 'Sleep Duration',
      value: '7h 42m',
      status: 'Restful',
      trend: '↑ 8% this week',
      isUp: true,
      icon: Moon,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      id: 'steps',
      label: 'Daily Steps',
      value: '6,842',
      status: 'Target: 10k',
      trend: '68% completed',
      isUp: true,
      icon: Footprints,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'weight',
      label: 'Body Weight',
      value: '72 kg',
      status: 'Stable',
      trend: 'No change',
      isUp: true,
      icon: Scale,
      iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
    },
    {
      id: 'bmi',
      label: 'Body Mass Index',
      value: '23.8',
      status: 'Healthy',
      trend: 'Ideal range',
      isUp: true,
      icon: Gauge,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    }
  ];

  return (
    <section className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Health Biometrics
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Real-time vitals, sleep, and physical activity snapshot.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${m.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 font-mono">
                  {m.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block line-clamp-1">
                  {m.label}
                </span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  {m.value}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 pt-1.5 border-t border-slate-800/80 font-mono">
                {m.isUp ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                )}
                <span className="line-clamp-1">{m.trend}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import { Droplet, Ruler, Scale, Gauge, Heart, Activity } from 'lucide-react';

interface HealthOverviewGridProps {
  bloodGroup?: string;
  height?: string;
  weight?: string;
  bmi?: number;
  heartRate?: string;
  bp?: string;
}

export const HealthOverviewGrid: React.FC<HealthOverviewGridProps> = ({
  bloodGroup = 'O+',
  height = '174 cm',
  weight = '72 kg',
  bmi = 23.8,
  heartRate = '72 BPM',
  bp = '120/80'
}) => {
  const cards = [
    { label: 'Blood Group', value: bloodGroup, status: 'ABDM Verified', icon: Droplet, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { label: 'Height', value: height, status: 'Recorded', icon: Ruler, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Weight', value: weight, status: 'Stable', icon: Scale, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { label: 'BMI Index', value: bmi.toString(), status: 'Normal', icon: Gauge, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { label: 'Heart Rate', value: heartRate, status: 'Resting', icon: Heart, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { label: 'Blood Pressure', value: bp, status: 'Optimal', icon: Activity, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' }
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
        Health Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {c.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
                  {c.label}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {c.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

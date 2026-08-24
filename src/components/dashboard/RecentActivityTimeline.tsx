import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Pill, FileText, ShieldCheck } from 'lucide-react';

export const RecentActivityTimeline: React.FC = () => {
  const activities = [
    {
      id: 1,
      title: 'Appointment Scheduled with Dr. Rajesh Kumar',
      time: '10 mins ago',
      category: 'Appointment',
      icon: Calendar,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 2,
      title: 'Amoxicillin 500mg marked as taken',
      time: '1 hour ago',
      category: 'Medication',
      icon: Pill,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 3,
      title: 'CBC & Blood Panel report uploaded to ABDM Vault',
      time: '3 hours ago',
      category: 'Records',
      icon: FileText,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 4,
      title: 'CarePlus Family Floater policy verified',
      time: 'Yesterday',
      category: 'Insurance',
      icon: ShieldCheck,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    }
  ];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Patient Activity
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">Real-time Portal Audit Feed</span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300 font-mono">● Live Feed</span>
      </div>

      {/* TIMELINE ITEMS */}
      <div className="space-y-3 font-mono text-[11px] relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex items-start gap-3 relative z-10"
            >
              <div className={`p-2 rounded-xl border shrink-0 ${act.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-0.5 font-sans">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">{act.title}</h4>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono shrink-0 ml-2">{act.time}</span>
                </div>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-300 font-mono font-bold">{act.category}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

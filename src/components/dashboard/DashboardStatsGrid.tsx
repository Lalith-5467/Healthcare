import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Pill, Activity, ShieldCheck, Users, Clock } from 'lucide-react';

interface DashboardStatsGridProps {
  onNavigate: (id: string) => void;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ onNavigate }) => {
  const stats = [
    {
      id: 'appointments',
      title: 'Appointments',
      value: '03',
      subtitle: '2 upcoming this week',
      icon: Calendar,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'medicines',
      title: 'Active Medicines',
      value: '03',
      subtitle: '100% adherence today',
      icon: Pill,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'analytics',
      title: 'Health Score',
      value: '85',
      subtitle: '+4 points from last week',
      icon: Activity,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'checkup',
      title: 'Health Check-Up',
      value: 'Due',
      subtitle: 'Scheduled in 30 days',
      icon: Clock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 'insurance',
      title: 'Insurance Policy',
      value: '₹10L',
      subtitle: 'CarePlus Floater Active',
      icon: ShieldCheck,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'family',
      title: 'Family Members',
      value: '03',
      subtitle: 'Shared emergency records',
      icon: Users,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
    }
  ];

  return (
    <section className="space-y-3 font-sans">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(s.id)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-md hover:shadow-xl transition-all space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#00a896] dark:text-cyan-300 font-mono">
                  View →
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block line-clamp-1">
                  {s.title}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </span>
              </div>

              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1 border-t border-slate-100 dark:border-slate-800/80 pt-1.5 font-mono">
                {s.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

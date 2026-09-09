import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconUsers, 
  IconMessage, 
  IconCalendarEvent, 
  IconLink,
  IconCalendar
} from '@tabler/icons-react';

const STATS = [
  {
    id: 1,
    label: 'Active Care Queue',
    value: '4',
    icon: IconUsers,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-50 dark:bg-pink-900/20',
    accentColor: 'bg-pink-500',
    navId: 'patients'
  },
  {
    id: 2,
    label: 'Inbound Requests',
    value: '2',
    icon: IconMessage,
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    accentColor: 'bg-teal-500',
    navId: 'requests'
  },
  {
    id: 3,
    label: 'Completed Visits',
    value: '12',
    icon: IconCalendarEvent,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    accentColor: 'bg-purple-500',
    navId: 'history'
  },
  {
    id: 4,
    label: 'Medicine Deliveries',
    value: '6',
    icon: IconLink,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    accentColor: 'bg-emerald-500',
    navId: 'inventory'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

interface NurseStatCardsProps {
  onNavigate?: (id: string) => void;
}

export const NurseStatCards: React.FC<NurseStatCardsProps> = ({ onNavigate }) => {
  return (
    <section className="pt-2">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Today at a glance</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Your key numbers for today</p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-400">
          <IconCalendar className="w-4 h-4" stroke={2} />
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            onClick={() => onNavigate && onNavigate(stat.navId)}
            className="cursor-pointer bg-white dark:bg-[#1b1e27] p-4 sm:p-5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col justify-between h-[110px] sm:h-[120px] hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Minimal solid accent line at the left edge */}
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.accentColor} opacity-70`} />
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} stroke={2} />
              </div>
            </div>
            
            <div className="mt-auto pb-2">
              <h3 className="text-[28px] font-black text-slate-900 dark:text-white leading-none tracking-tight mb-1.5">
                {stat.value}
              </h3>
              <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

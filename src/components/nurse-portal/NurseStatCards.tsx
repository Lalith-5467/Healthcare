import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconUsers, 
  IconInbox, 
  IconChecklist, 
  IconPill, 
  IconPhoneCall 
} from '@tabler/icons-react';

const STATS = [
  {
    id: 1,
    label: 'Active Care Queue',
    value: '4',
    icon: IconUsers,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    id: 2,
    label: 'Inbound Requests',
    value: '2',
    icon: IconInbox,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 3,
    label: 'Completed Visits',
    value: '12',
    icon: IconChecklist,
    color: 'text-[#10b981]',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    id: 4,
    label: 'Medicine Deliveries',
    value: '6',
    icon: IconPill,
    color: 'text-[#0d9488]',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    subText: '3 items low stock',
    subTextColor: 'text-[#f59e0b]',
  },
  {
    id: 5,
    label: 'Emergency Hotline',
    value: 'Active',
    icon: IconPhoneCall,
    color: 'text-[#e04848]',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
  },
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
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const NurseStatCards: React.FC = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {STATS.map((stat) => (
        <motion.div
          key={stat.id}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-[#1b1e27] p-5 rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} stroke={2} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {stat.value}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {stat.label}
            </p>
            {stat.subText && (
              <p className={`text-[10px] font-bold mt-1.5 ${stat.subTextColor}`}>
                {stat.subText}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

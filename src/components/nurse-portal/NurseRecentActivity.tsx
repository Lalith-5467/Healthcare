import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconCheck, 
  IconPill, 
  IconFileDescription, 
  IconUserCheck,
  IconArrowRight
} from '@tabler/icons-react';

const ACTIVITIES = [
  {
    id: 1,
    action: 'Visit completed',
    details: 'Post-Op checkup for Patient ID #8849',
    time: '2 hours ago',
    icon: IconCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    id: 2,
    action: 'Medicine delivery confirmed',
    details: 'Delivered to Block C, Apollo Annex',
    time: '3 hours ago',
    icon: IconPill,
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20'
  },
  {
    id: 3,
    action: 'Patient record updated',
    details: 'Added new vitals for Lakshmi N.',
    time: '4 hours ago',
    icon: IconFileDescription,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  {
    id: 4,
    action: 'Care request accepted',
    details: 'IV Fluid Administration assigned',
    time: '5 hours ago',
    icon: IconUserCheck,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20'
  }
];

interface NurseRecentActivityProps {
  onNavigate?: (id: string) => void;
}

export const NurseRecentActivity: React.FC<NurseRecentActivityProps> = ({ onNavigate }) => {
  return (
    <section className="pt-2">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent activity</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Your actions and updates</p>
        </div>
        <button 
          onClick={() => onNavigate && onNavigate('history')}
          className="text-teal-600 dark:text-teal-400 text-sm font-bold flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          View all <IconArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-6 pb-2">
          {ACTIVITIES.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6"
            >
              {/* Timeline dot/icon */}
              <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full ${activity.iconBg} border-[3px] border-white dark:border-[#1b1e27] flex items-center justify-center`}>
                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} stroke={2.5} />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                    {activity.action}
                  </h4>
                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {activity.details}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-400 shrink-0 mt-1 sm:mt-0">
                  {activity.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

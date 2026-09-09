import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconChevronRight, 
  IconFirstAidKit, 
  IconHistory, 
  IconAlertTriangle 
} from '@tabler/icons-react';

const WORKFLOWS = [
  {
    id: 'inventory',
    title: 'Medicine Kit & Supplies',
    icon: IconFirstAidKit,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'hover:border-emerald-200 dark:hover:border-emerald-800'
  },
  {
    id: 'history',
    title: 'Care History & Records',
    icon: IconHistory,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'hover:border-indigo-200 dark:hover:border-indigo-800'
  },
  {
    id: 'alerts',
    title: 'Emergency Alerts',
    icon: IconAlertTriangle,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'hover:border-rose-200 dark:hover:border-rose-800'
  }
];

interface NurseSecondaryWorkflowsProps {
  onNavigate?: (id: string) => void;
}

export const NurseSecondaryWorkflows: React.FC<NurseSecondaryWorkflowsProps> = ({ onNavigate }) => {
  return (
    <section className="pt-2">
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Secondary workflows</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quick access to your daily tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WORKFLOWS.map((workflow, index) => (
          <motion.button
            key={workflow.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onNavigate && onNavigate(workflow.id)}
            className={`w-full flex items-center justify-between p-4 rounded-xl md:rounded-2xl bg-white dark:bg-[#1b1e27] border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all group ${workflow.borderColor}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${workflow.iconBg}`}>
                <workflow.icon className={`w-4 h-4 ${workflow.iconColor}`} stroke={2.5} />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {workflow.title}
              </h3>
            </div>
            <IconChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </motion.button>
        ))}
      </div>
    </section>
  );
};

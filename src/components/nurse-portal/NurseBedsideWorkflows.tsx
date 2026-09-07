import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconActivityHeartbeat, 
  IconFirstAidKit, 
  IconCamera, 
  IconSignature 
} from '@tabler/icons-react';

const WORKFLOWS = [
  { id: 1, label: 'Record Vitals', icon: IconActivityHeartbeat, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { id: 2, label: 'Medical Kit', icon: IconFirstAidKit, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 3, label: 'Wound Photo', icon: IconCamera, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 4, label: 'e-Sign Visit', icon: IconSignature, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
];

export const NurseBedsideWorkflows: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm p-5 h-full flex flex-col">
      <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
        Bedside Workflows
      </h2>
      
      <div className="grid grid-cols-2 gap-3 flex-1">
        {WORKFLOWS.map((workflow) => (
          <motion.button
            key={workflow.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-[#eceef1] dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800/50 hover:shadow-sm bg-white dark:bg-[#12141a] transition-all"
          >
            <div className={`p-3 rounded-xl ${workflow.bg}`}>
              <workflow.icon className={`w-6 h-6 ${workflow.color}`} stroke={2} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {workflow.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

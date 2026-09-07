import React from 'react';
import { IconFirstAidKit } from '@tabler/icons-react';
import { NURSING_MOCK_DATA } from './mockData';
import { motion } from 'framer-motion';

export const NurseKitStock: React.FC = () => {
  const kitStock = NURSING_MOCK_DATA.kitStock;

  return (
    <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <IconFirstAidKit className="w-4 h-4 text-[#0d9488]" /> Kit Stock
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
        {kitStock.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {item.item}
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                item.status === 'low' 
                  ? 'bg-rose-50 text-[#e04848] dark:bg-rose-900/20' 
                  : 'bg-emerald-50 text-[#10b981] dark:bg-emerald-900/20'
              }`}>
                {item.status}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full bg-[#f6f7f9] dark:bg-[#12141a] rounded-full overflow-hidden border border-[#eceef1] dark:border-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.level}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  item.status === 'low' ? 'bg-[#f59e0b]' : 'bg-[#0d9488]'
                }`}
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

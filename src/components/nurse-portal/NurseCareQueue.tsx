import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconUser,
  IconMapPin,
  IconAlertCircle,
  IconChevronRight
} from '@tabler/icons-react';
import { NURSING_MOCK_DATA } from './mockData';

type FilterType = 'All' | 'Pending' | 'Accepted' | 'Completed';

export const NurseCareQueue: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const queue = NURSING_MOCK_DATA.careQueue;

  const filteredQueue = queue.filter(
    (item) => filter === 'All' || item.status === filter
  );

  return (
    <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Today's Care Queue
        </h2>
        <span className="text-xs font-bold text-[#0d9488] bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-md">
          {queue.length} Total
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
        {['All', 'Pending', 'Accepted', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as FilterType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
              filter === f
                ? 'bg-[#0d9488] text-white border-[#0d9488] shadow-sm'
                : 'bg-white dark:bg-[#12141a] text-slate-500 dark:text-slate-400 border-[#eceef1] dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredQueue.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors hover:shadow-sm ${
                item.urgent 
                  ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/50' 
                  : 'bg-white dark:bg-[#12141a] border-[#eceef1] dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative ${
                  item.status === 'Completed' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                  item.status === 'Accepted' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                }`}>
                  {item.initials}
                  {item.urgent && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#e04848] rounded-full border-2 border-white dark:border-[#1b1e27]"></span>
                  )}
                </div>
                
                <div className="truncate">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.patientName}
                    </h4>
                    {item.urgent && (
                      <IconAlertCircle className="w-3.5 h-3.5 text-[#e04848] shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    <span>{item.age}y</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-[#0d9488] font-semibold">{item.visitType}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></span>
                    <span className="hidden sm:flex items-center gap-0.5 truncate">
                      <IconMapPin className="w-3 h-3" /> {item.address.split(',')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  item.status === 'Accepted' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                }`}>
                  {item.status}
                </span>
                <button className="text-[10px] font-bold text-slate-400 hover:text-[#0d9488] flex items-center gap-0.5 transition-colors">
                  Care Chart <IconChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredQueue.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-[#eceef1] dark:border-slate-800 rounded-xl">
            <IconUser className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No {filter.toLowerCase()} requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

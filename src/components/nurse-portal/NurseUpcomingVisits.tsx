import React from 'react';
import { motion } from 'framer-motion';
import { IconClock, IconMapPin } from '@tabler/icons-react';

const UPCOMING_VISITS = [
  {
    id: 1,
    time: '10:30 AM',
    patient: 'Srinivasan K, 68',
    type: 'Physiotherapy',
    location: 'Velachery',
    status: 'Next',
    statusColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
  },
  {
    id: 2,
    time: '01:15 PM',
    patient: 'Lakshmi N, 55',
    type: 'IV Antibiotics',
    location: 'T. Nagar',
    status: 'Scheduled',
    statusColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  },
  {
    id: 3,
    time: '03:45 PM',
    patient: 'Ramesh R, 71',
    type: 'Wound Dressing',
    location: 'Mylapore',
    status: 'Scheduled',
    statusColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
];

export const NurseUpcomingVisits: React.FC = () => {
  return (
    <section className="pt-2">
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Upcoming visits</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Your schedule for the rest of the day</p>
      </div>

      <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-sm">
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800/80 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-6 sm:space-y-8">
          {UPCOMING_VISITS.map((visit, index) => {
            const isNext = visit.status === 'Next';
            return (
              <motion.div 
                key={visit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${isNext ? 'border-teal-500 bg-white dark:bg-slate-900 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}`}></div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                  <div className={`text-sm font-bold ${isNext ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {visit.time}
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-3">
                    {visit.patient}
                    {isNext && (
                      <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest border border-teal-200/50 dark:border-teal-800/50">
                        NEXT
                      </span>
                    )}
                    {!isNext && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        SCHEDULED
                      </span>
                    )}
                  </h4>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  <span className="text-slate-700 dark:text-slate-300">{visit.type}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span>{visit.location}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

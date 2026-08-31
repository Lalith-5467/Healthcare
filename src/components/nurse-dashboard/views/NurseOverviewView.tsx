import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, HeartPulse, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNurseWorkflow } from '../../../utils/nurseWorkflowStorage';

interface NurseOverviewViewProps {
  onNavigate: (id: string) => void;
}

export const NurseOverviewView: React.FC<NurseOverviewViewProps> = ({ onNavigate }) => {
  const { bookings } = useNurseWorkflow();

  const activePatients = bookings.filter(b => b.status === 'Accepted' || b.status === 'Scheduled' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Care in Progress');
  const pendingRequests = bookings.filter(b => b.status === 'Pending');
  const completedVisits = bookings.filter(b => b.status === 'Completed');

  return (
    <div className="space-y-6 pb-16">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Good Morning, Nurse Sarah
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
          Here’s your care schedule and patient activity for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Requests', value: pendingRequests.length, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Today\'s Visits', value: activePatients.length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Completed', value: completedVisits.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Pending Tasks', value: 3, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schedule & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Today's Schedule */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Today's Schedule
            </h2>
          </div>
          <div className="p-2 flex-1">
            {activePatients.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No visits scheduled for today.</div>
            ) : (
              <div className="space-y-2">
                {activePatients.map(b => (
                  <div key={b.id} className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 last:border-0 group cursor-pointer" onClick={() => onNavigate('tracking')}>
                    <div className="flex gap-4 items-center">
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{b.time}</p>
                      </div>
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{b.patientName}</p>
                        <p className="text-xs text-slate-500">{b.serviceType}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Action Needed */}
        <section className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/10 dark:to-slate-900 rounded-3xl border border-rose-100 dark:border-rose-800/30 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-rose-100 dark:border-rose-800/30 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> Action Needed
            </h2>
            {pendingRequests.length > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingRequests.length} New</span>
            )}
          </div>
          <div className="p-5 flex-1">
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-slate-500 font-medium">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map(b => (
                  <div key={b.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{b.patientName}</p>
                      <p className="text-xs text-slate-500">{b.serviceType} • {b.time}</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('requests')}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 rounded-xl transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

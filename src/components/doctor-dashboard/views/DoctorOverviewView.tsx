import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, RefreshCw, Bell, AlertTriangle, ChevronRight, Scan } from 'lucide-react';

interface DoctorOverviewViewProps {
  onNavigate: (id: string) => void;
}

export const DoctorOverviewView: React.FC<DoctorOverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-16">
      {/* Greeting & Quick Scan */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good Morning, Dr. Rajesh
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Review your appointments, patients, and clinical updates.
          </p>
        </div>
        
        <button 
          onClick={() => onNavigate('scan')}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-1 group"
        >
          <Scan className="w-6 h-6 group-hover:scale-110 transition-transform" />
          Scan Patient QR
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Today\'s Appointments', value: 8, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Waiting Patients', value: 3, icon: Users, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Follow-ups', value: 5, icon: RefreshCw, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
          { label: 'Patient Updates', value: 4, icon: Bell, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Unread Alerts', value: 2, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' }
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
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Appointments Grid */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-500" /> Today's Appointments
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[
              { time: '09:00 AM', name: 'Abinesh Kumar', type: 'Follow-up Consultation', status: 'Confirmed', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
              { time: '10:30 AM', name: 'Priya Sharma', type: 'General Consultation', status: 'Waiting', statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
              { time: '12:00 PM', name: 'Rahul Kumar', type: 'Lab Review', status: 'Confirmed', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            ].map((apt, idx) => (
              <div key={idx} className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="text-right w-20">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{apt.time}</p>
                  </div>
                  <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{apt.name}</p>
                    <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${apt.statusColor}`}>
                    {apt.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

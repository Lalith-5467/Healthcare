import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, RefreshCw, Bell, AlertTriangle, ChevronRight, Scan } from 'lucide-react';
import { getGreeting } from '../../../utils/greeting';

interface DoctorOverviewViewProps {
  onNavigate: (id: string) => void;
  user?: { name: string; email: string };
}

export const DoctorOverviewView: React.FC<DoctorOverviewViewProps> = ({ onNavigate, user }) => {
  return (
    <div className="space-y-6 pb-16 relative">
      {/* Background Subtle Orb Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Greeting & Quick Scan */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'Dr. Rajesh'}&background=0d9488&color=fff&size=128&rounded=true&font-size=0.33`} 
            alt="Doctor Avatar" 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-[0_0_15px_rgba(20,184,166,0.3)] border-2 border-teal-500/30 bg-teal-900/20"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">{user?.name || 'Doctor'}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Review your appointments, patients, and clinical updates.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => onNavigate('scan')}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 border border-teal-400/30 text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_15px_rgba(20,184,166,0.25)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all hover:-translate-y-1 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Scan className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />
          <span className="relative z-10">Scan Patient QR</span>
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
            className="bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm hover:border-teal-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:shadow-[0_0_15px_currentColor] transition-shadow opacity-90 group-hover:opacity-100`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stat.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Appointments Grid */}
      <div className="mt-8 bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden relative">
        <div className="h-[2px] w-full bg-gradient-to-r from-teal-500/80 to-transparent absolute top-0 left-0"></div>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" /> Today's Appointments
          </h2>
        </div>
        <div className="px-2 pb-2">
          <div className="flex flex-col">
            {[
              { time: '09:00 AM', name: 'Abinesh Kumar', type: 'Follow-up Consultation', status: 'Confirmed', statusBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', img: 'https://i.pravatar.cc/150?img=11' },
              { time: '10:30 AM', name: 'Priya Sharma', type: 'General Consultation', status: 'Waiting', statusBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500', img: 'https://i.pravatar.cc/150?img=5' },
              { time: '12:00 PM', name: 'Rahul Kumar', type: 'Lab Review', status: 'Confirmed', statusBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', img: 'https://i.pravatar.cc/150?img=13' },
            ].map((apt, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="text-right w-20">
                    <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400 font-mono tracking-tighter">{apt.time}</p>
                  </div>
                  <div className={`w-1.5 h-12 rounded-full ${apt.dot}`}></div>
                  <div className="flex items-center gap-4">
                    <img src={apt.img} alt={apt.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-teal-500/50 transition-colors" />
                    <div>
                      <p className="text-[15px] font-black text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{apt.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{apt.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-md border flex items-center gap-1.5 ${apt.statusBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${apt.dot} shadow-[0_0_5px_currentColor]`}></span>
                    {apt.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

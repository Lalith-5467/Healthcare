import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, HeartPulse, CheckCircle2, ChevronRight, CalendarDays, Users, Stethoscope, ArrowUpRight, Plus, FileText, AlertTriangle } from 'lucide-react';
import { useNurseWorkflow } from '../../../utils/nurseWorkflowStorage';
import { getGreeting } from '../../../utils/greeting';

interface NurseOverviewViewProps {
  onNavigate: (id: string) => void;
}

export const NurseOverviewView: React.FC<NurseOverviewViewProps> = ({ onNavigate }) => {
  const { bookings } = useNurseWorkflow();

  const activePatients = bookings.filter(b => b.status === 'Accepted' || b.status === 'Scheduled' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Care in Progress');
  const pendingRequests = bookings.filter(b => b.status === 'Pending');
  const completedVisits = bookings.filter(b => b.status === 'Completed');

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Background Subtle Orb Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Greeting */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-500">Nurse Sarah</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">
            Here's your care schedule and patient activity for today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-[#15192b] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm shrink-0">
          <CalendarDays className="w-5 h-5 text-teal-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">Today</span>
            <span className="text-xs font-black text-slate-900 dark:text-white leading-tight mt-0.5">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Requests', value: pendingRequests.length, desc: pendingRequests.length > 0 ? `${pendingRequests.length} pending requests` : 'No new care requests', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: "Today's Visits", value: activePatients.length, desc: activePatients.length > 0 ? `${activePatients.length} visits today` : 'No visits scheduled', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Completed', value: completedVisits.length, desc: completedVisits.length > 0 ? `${completedVisits.length} tasks completed` : 'All tasks up to date', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Pending Tasks', value: pendingRequests.length > 0 ? pendingRequests.length : 3, desc: 'Tasks need attention', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-md p-5 rounded-3xl border ${stat.label === 'Pending Tasks' ? 'border-rose-200/80 dark:border-rose-900/60 shadow-md' : 'border-slate-200/80 dark:border-slate-800/60 shadow-sm'} flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group hover:border-${stat.color.split('-')[1]}-500/30`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:shadow-[0_0_15px_currentColor] transition-shadow opacity-90 group-hover:opacity-100`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stat.value}</p>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.desc}</p>
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
          <div className="p-2 flex-1 flex flex-col">
            {activePatients.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 m-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <CalendarDays className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No visits scheduled for today.</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">Your patient visits and tasks will appear here.</p>
              </div>
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
        <section className="bg-gradient-to-b from-rose-50/50 to-white dark:from-[#0b1120] dark:to-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col h-full relative">
          <div className="h-[2px] w-full bg-gradient-to-r from-rose-500/80 to-transparent absolute top-0 left-0"></div>
          <div className="p-5 border-b border-rose-100 dark:border-slate-800/60 flex justify-between items-center bg-rose-50/30 dark:bg-transparent">
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> Action Needed
            </h2>
            {pendingRequests.length > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingRequests.length} New</span>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col">
            {pendingRequests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">All caught up!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px]">No urgent actions require your attention.</p>
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

      {/* LOWER DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Recent Patients */}
        <div className="bg-white dark:bg-[#15192b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> Recent Patients
          </h2>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/50">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold">No recent patients.</p>
              </div>
            ) : (
              bookings.slice(0,3).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0">
                    {p.patientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.patientName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Room 204 • Cardiology</p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">{p.status === 'Completed' ? 'Discharged' : 'Admitted'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-[#15192b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" /> Upcoming Tasks
          </h2>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/50">
                <Activity className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold">No upcoming tasks.</p>
              </div>
            ) : (
              bookings.slice(0,3).map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center shrink-0 w-12 border-r border-slate-200 dark:border-slate-700/50 pr-3">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Today</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{t.time.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-slate-900 dark:text-white truncate">{i === 0 ? 'Administer Meds' : i === 1 ? 'Check Vitals' : 'Wound Dressing'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.patientName}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#15192b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[
              { label: 'Add Care Note', icon: FileText, route: 'nursing-notes', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Record Vitals', icon: Activity, route: 'vitals', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
              { label: 'Medication Log', icon: Stethoscope, route: 'medication', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Patient Transfer', icon: Users, route: 'patients', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Emergency Alert', icon: AlertTriangle, route: 'alerts', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
              { label: 'New Care Plan', icon: CheckCircle2, route: 'care-plans', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => onNavigate(action.route)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#0b1120] hover:bg-slate-50 dark:hover:bg-[#15192b] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all text-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 group-hover:shadow-[0_0_12px_currentColor] transition-all relative z-10`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight relative z-10">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

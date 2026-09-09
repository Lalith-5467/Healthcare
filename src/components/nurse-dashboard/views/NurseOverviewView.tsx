import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Activity, HeartPulse, CheckCircle2, ChevronRight, 
  MapPin, Stethoscope, Car, ArrowRight, Sparkles, ShieldCheck, 
  User, AlertTriangle, Pill, Syringe, PhoneCall, Check, Navigation, Users, ArrowUpRight, Plus, FileText
} from 'lucide-react';
import { useNurseWorkflow, type BookingStatus } from '../../../utils/nurseWorkflowStorage';
import { getGreeting } from '../../../utils/greeting';

interface NurseOverviewViewProps {
  onNavigate: (id: string) => void;
  user?: { name: string; email: string };
}

export const NurseOverviewView: React.FC<NurseOverviewViewProps> = ({ onNavigate, user }) => {
  const { bookings, updateBookingStatus } = useNurseWorkflow();

  const activePatients = bookings.filter(b => b.status === 'Accepted' || b.status === 'Scheduled' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Care in Progress');
  const pendingRequests = bookings.filter(b => b.status === 'Pending');
  const completedVisits = bookings.filter(b => b.status === 'Completed');
  const currentActive = activePatients[0] || null;

  const nurseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse Sarah Jenkins, RN';

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. NURSE HERO COMMAND BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/70 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black uppercase tracking-wider border border-rose-400/30 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              On-Duty Clinical Station · Shift A
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-bold text-slate-300 bg-white/5 rounded-full border border-white/10">
              KNC Reg: RN-88421
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {getGreeting()}, {nurseName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            You have <strong className="text-rose-300 font-black">{activePatients.length} active visits</strong>, <strong className="text-amber-300 font-black">{pendingRequests.length} incoming requests</strong>, and <strong className="text-emerald-300 font-black">{completedVisits.length} completed rounds</strong> today.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('requests')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Calendar className="w-4 h-4" />
            <span>Care Requests ({pendingRequests.length})</span>
          </button>
          
          <button
            onClick={() => onNavigate('schedule')}
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Clock className="w-4 h-4 text-cyan-300" />
            <span>Shift Schedule</span>
          </button>
        </div>
      </div>

      {/* 2. STATS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Active Care Patients', value: activePatients.length.toString(), icon: User, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Pending Requests', value: pendingRequests.length.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Completed Today', value: completedVisits.length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Clinical Telemetry', value: '100% OK', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN TWO-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE VISITS & SCHEDULE (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-500" />
                Active Patient Rounds ({activePatients.length})
              </h2>
              <button 
                onClick={() => onNavigate('patients')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                View All Patients →
              </button>
            </div>

            {activePatients.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">All Rounds Completed</p>
                <p className="text-xs">No active ongoing visits at this hour.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activePatients.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center text-sm">
                        {b.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 dark:text-white text-sm">{b.patientName}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">{b.patientAge}y · {b.serviceType}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {b.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                        {b.status}
                      </span>
                      <button 
                        onClick={() => onNavigate('patients')}
                        className="text-xs font-black text-rose-600 dark:text-rose-400 hover:underline cursor-pointer bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20"
                      >
                        Care Chart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CLINICAL TOOLS & MEDICINE INVENTORY (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* NURSE CLINICAL WORKFLOW ACTIONS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-500" />
              Nurse Bedside Workflows
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('vitals')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-700 hover:border-rose-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Record Vitals</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sync SpO2 & BP Live</p>
              </button>

              <button 
                onClick={() => onNavigate('inventory')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-pink-50 dark:hover:bg-pink-950/20 border border-slate-200 dark:border-slate-700 hover:border-pink-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Syringe className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Medical Kit Stock</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Bandages, Syringes, IV</p>
              </button>
            </div>
          </div>

          {/* LIVE EMERGENCY PROTOCOL CARD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-red-950 border border-rose-500/30 text-white shadow-lg space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <h3 className="text-sm font-black text-white">Emergency Paramedic Sync</h3>
              </div>
              <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-400/30">
                108 Dispatch
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Direct emergency escalation channel to hospital trauma ward & nearest available ambulance.
            </p>

            <button 
              onClick={() => onNavigate('alerts')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Broadcast Patient Emergency SOS</span>
            </button>
          </div>

          {/* TELEMETRY VAULT STATUS */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Nursing Council Sync</span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black text-slate-900 dark:text-white">100%</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">e-Log Compliance</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black text-slate-900 dark:text-white">12 mins</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Avg. Response Time</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

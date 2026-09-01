import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Activity, HeartPulse, CheckCircle2, ChevronRight, 
  MapPin, Stethoscope, Car, ArrowRight, Sparkles, ShieldCheck, 
  User, AlertTriangle, Pill, Syringe, PhoneCall, Check, Navigation
} from 'lucide-react';
import { useNurseWorkflow, type BookingStatus } from '../../../utils/nurseWorkflowStorage';

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
            Good Morning, {nurseName}
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
            <Clock className="w-4 h-4 text-rose-300" />
            <span>Shift Timetable</span>
          </button>
        </div>
      </div>

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {[
          { label: 'Active Care Queue', value: activePatients.length.toString(), icon: Stethoscope, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', note: 'Bedside & Homecare' },
          { label: 'Inbound Requests', value: pendingRequests.length.toString(), icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', note: 'Requires OTP check' },
          { label: 'Completed Visits', value: completedVisits.length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', note: '100% verified' },
          { label: 'Medicine Deliveries', value: '6', icon: Pill, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', note: 'IV & Oral kits' },
          { label: 'Emergency Hotline', value: '24x7', icon: HeartPulse, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', note: 'GPS Dispatch Live' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-500/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} border flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">{kpi.note}</span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">{kpi.value}</p>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">{kpi.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. MAIN WORKSTATION 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE EN-ROUTE & PATIENT QUEUE (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CURRENT PATIENT SPOTLIGHT */}
          {currentActive && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-rose-50/20 to-white dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 border-2 border-rose-500/40 dark:border-rose-500/30 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4" />
                    Priority Active Dispatch
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20">
                  Care PIN: {currentActive.otpPin || '5928'}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{currentActive.patientName}</h4>
                    <span className="text-xs font-bold text-slate-500">({currentActive.patientAge} yrs)</span>
                  </div>
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{currentActive.serviceType}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{currentActive.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-center">
                  <button
                    onClick={() => onNavigate('patients')}
                    className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-black rounded-2xl shadow-md shadow-rose-500/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Open Bedside Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* UPCOMING SHIFT VISITS LIST */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Today's Care Queue & Bedside Visits
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('requests')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                All Care Requests <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black shrink-0 border border-rose-500/20 text-sm">
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


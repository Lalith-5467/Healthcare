import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, RefreshCw, Bell, AlertTriangle, ChevronRight, Scan, 
  Stethoscope, Activity, FileText, Pill, Video, CheckCircle2, 
  ArrowUpRight, HeartPulse, Clock, Sparkles
} from 'lucide-react';
import { getGreeting } from '../../../utils/greeting';

interface DoctorOverviewViewProps {
  onNavigate: (id: string) => void;
  user?: { name: string; email: string };
}

export const DoctorOverviewView: React.FC<DoctorOverviewViewProps> = ({ onNavigate, user }) => {
  const doctorName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Dr. Rajesh Varma';

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* 1. HERO GREETING, ABDM CLINICAL STATUS & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl text-white relative overflow-hidden">
        {/* Ambient mesh background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 rounded-full border border-teal-400/30 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              OPD Suite 402 · Active Duty
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-bold text-slate-300 bg-white/5 rounded-full border border-white/10">
              NMC-Reg: 74829-KA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {getGreeting()}, {doctorName}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-medium">
            You have <strong className="text-teal-300 font-black">8 appointments</strong> today, <strong className="text-amber-300 font-black">3 patients</strong> in the waiting room, and <strong className="text-rose-300 font-black">1 urgent lab report</strong> pending review.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate('scan')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-102 cursor-pointer group"
          >
            <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Scan Patient QR</span>
          </button>

          <button 
            onClick={() => onNavigate('consultations')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-2xl font-bold text-sm border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-cyan-300" />
            <span>Tele-Consult</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {[
          { label: 'Today\'s Appointments', value: 8, icon: Calendar, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', trend: '4 completed' },
          { label: 'Waiting Patients', value: 3, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', trend: 'Avg. 8m wait' },
          { label: 'Routine Follow-ups', value: 5, icon: RefreshCw, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20', trend: 'Next @ 11:45 AM' },
          { label: 'e-Prescriptions Issued', value: 14, icon: Pill, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20', trend: '100% ABDM sync' },
          { label: 'Clinical Alerts', value: 2, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', trend: '1 critical vitals' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{stat.trend}</span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
=======
            transition={{ delay: i * 0.1 }}
            className="bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm hover:border-teal-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:shadow-[0_0_15px_currentColor] transition-shadow opacity-90 group-hover:opacity-100`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{stat.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight">{stat.label}</p>
>>>>>>> origin/main
            </div>
          </motion.div>
        ))}
      </div>

<<<<<<< HEAD
      {/* 3. MAIN WORKSTATION TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE SCHEDULE & WAITING ROOM (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TODAY'S SCHEDULE & ACTIVE QUEUE */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">Active OPD Schedule & Patient Queue</h2>
              </div>
              <button 
                onClick={() => onNavigate('appointments')}
                className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Full Roster <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { 
                  id: '1', 
                  name: 'Abinesh Kumar', 
                  age: 38, 
                  gender: 'Male',
                  time: '10:30 AM', 
                  reason: 'Post-Op Surgical Incision Review', 
                  vitals: 'BP 124/82 · HR 74 · SpO2 99%',
                  status: 'In Consultation', 
                  statusColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                },
                { 
                  id: '2', 
                  name: 'Ragul Kumar', 
                  age: 45, 
                  gender: 'Male',
                  time: '11:45 AM', 
                  reason: 'Routine Cardiology & ECG Telemetry Review', 
                  vitals: 'BP 138/88 · HR 82 · SpO2 98%',
                  status: 'Waiting in Clinic', 
                  statusColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                },
                { 
                  id: '3', 
                  name: 'Mrs. Meenakshi Sundaram', 
                  age: 62, 
                  gender: 'Female',
                  time: '03:00 PM', 
                  reason: 'Elderly Vitals Check & Glycemic Adherence', 
                  vitals: 'BP 130/80 · Fasting Glu 118 mg/dL',
                  status: 'Confirmed', 
                  statusColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                },
                { 
                  id: '4', 
                  name: 'Sneha Roy', 
                  age: 29, 
                  gender: 'Female',
                  time: '04:15 PM', 
                  reason: 'Thyroid Panel & Medication Adjustment', 
                  vitals: 'BP 118/76 · HR 68',
                  status: 'Tele-Consult Pending', 
                  statusColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
                }
              ].map((apt) => (
                <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black shrink-0 border border-teal-500/20 text-sm">
                      {apt.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 dark:text-white text-sm">{apt.name}</h3>
                        <span className="text-[10px] text-slate-400 font-bold">{apt.age}y · {apt.gender}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">{apt.reason}</p>
                      <p className="text-[11px] font-mono font-bold text-teal-600 dark:text-cyan-300 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {apt.vitals}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${apt.statusColor}`}>
                      {apt.status}
                    </span>
                    <button 
                      onClick={() => onNavigate('patient-360')}
                      className="text-xs font-black text-teal-600 dark:text-cyan-400 hover:text-teal-700 flex items-center gap-1 cursor-pointer bg-teal-500/10 dark:bg-teal-500/20 px-3 py-1.5 rounded-xl border border-teal-500/20"
                    >
                      <span>Chart 360</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CLINICAL QUICK ACTION TOOLKIT */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-500" />
              Clinical Practitioner Workflows
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => onNavigate('prescriptions')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-slate-200 dark:border-slate-700 hover:border-teal-500/30 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">e-Prescriptions</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Digitally sign & dispatch Rx</p>
              </button>

              <button 
                onClick={() => onNavigate('consultations')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Active Consultation</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Live video & charting</p>
              </button>

              <button 
                onClick={() => onNavigate('patients')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Patient Directory</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Search ABHA clinical profiles</p>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLINICAL TRIAGE, AI HIGHLIGHTS & TELEMETRY (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* URGENT CLINICAL TRIAGE & ALERTS */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Priority Clinical Alerts</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                2 Critical
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">Ragul Kumar (Ward 3B)</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">10m ago</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Elevated Systolic BP (158/96 mmHg) detected via telemetry.</p>
                <div className="pt-1 flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate('patient-360')}
                    className="text-[11px] font-black text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Review Vitals Log →
                  </button>
=======
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
>>>>>>> origin/main
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">Sneha Roy · Lab Alert</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">45m ago</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">TSH report uploaded (6.8 uIU/mL). Prescription review requested.</p>
                <div className="pt-1 flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate('prescriptions')}
                    className="text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Adjust Dosage →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI CLINICAL DIAGNOSTIC COPILOT WIDGET */}
          <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-cyan-950 p-5 sm:p-6 rounded-3xl border border-teal-500/30 text-white shadow-lg space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <h3 className="text-sm font-black text-white">MediCare AI Clinical Copilot</h3>
              </div>
              <span className="text-[9px] font-mono font-bold bg-teal-400/20 text-teal-200 px-2 py-0.5 rounded-md border border-teal-300/30">
                GPT-4 Health
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              3 new diagnostic summaries compiled from ABHA hospital telemetry for your upcoming cases today.
            </p>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Drug Interaction Risk Checked</span>
              </div>
              <p className="text-[11px] text-slate-300">Zero contra-indications flagged across active patient prescriptions.</p>
            </div>

            <button 
              onClick={() => onNavigate('patient-360')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Open AI Clinical Insights
            </button>
          </div>

          {/* ABDM TELEMETRY & NETWORK STATUS */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Health Exchange Status</span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black text-slate-900 dark:text-white">99.98%</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">ABDM Gateway</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black text-slate-900 dark:text-white">&lt; 120ms</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">HL7 Fast Relay</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


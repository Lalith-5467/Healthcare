import React, { useState } from 'react';
import { IconLungs } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Phone, 
  AlertTriangle, 
  ArrowDown, 
  Activity, 
  ArrowRight,
  User,
  PhoneCall,
  ChevronDown,
  CheckCircle2,
  Clock,
  Ambulance,
  Stethoscope,
  HeartPulse,
  HelpCircle,
  X
} from 'lucide-react';

export const NurseAlertsView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<{name: string, age: string, alert: string, location: string, detected: string} | null>(null);
  
  const filters = ['All', 'Critical', 'Moderate', 'Unacknowledged'];

  return (
    <div className="space-y-8 pb-20 font-sans select-none max-w-[1000px] mx-auto">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" /> EMERGENCY TRIAGE MONITOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Clinical Alerts & Emergency SOS
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">
            Real-time biometric threshold breaches and patient rapid response dispatches.
          </p>
        </div>

        <a 
          href="tel:108"
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-500/20 flex items-center gap-2.5 self-start sm:self-auto cursor-pointer transition-all hover:-translate-y-0.5 whitespace-nowrap"
        >
          <Phone className="w-4 h-4 fill-white" />
          CALL HOSPITAL ER (108 / DIRECT)
        </a>
      </div>

      {/* 2. EMERGENCY OVERVIEW */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 px-1">
          Emergency overview
        </h3>
        <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-sm flex items-center gap-4 sm:gap-8 overflow-x-auto hide-scrollbar text-sm font-bold">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-slate-900 dark:text-white">1 Critical</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0"></div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-900 dark:text-white">1 Moderate</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0"></div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-900 dark:text-white">2 Active</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0"></div>
          
          <div className="flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>12 Resolved</span>
          </div>
        </div>
      </div>

      {/* 3. ALERT FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${
                activeFilter === filter 
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/50 shadow-sm' 
                  : 'bg-white dark:bg-[#1b1e27] text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors self-start sm:self-auto">
          Newest first <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4-7. CRITICAL ALERT */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white dark:bg-[#1b1e27] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-[0_8px_30px_rgb(225,29,72,0.06)]"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20 dark:to-transparent pointer-events-none"></div>
        {/* Strong left border */}
        <div className="absolute top-0 left-0 w-2.5 h-full bg-rose-600 dark:bg-rose-500"></div>
        {/* Waveform decoration */}
        <svg className="absolute -left-10 bottom-0 w-96 h-48 opacity-[0.02] text-rose-500 pointer-events-none" viewBox="0 0 200 100" fill="none">
          <path d="M0 50H40L55 20L75 80L90 50H200" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <div className="relative z-10 p-4 flex flex-col xl:flex-row items-center justify-between gap-3 xl:gap-4 pl-5">
          
          {/* Main Info */}
          <div className="flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-rose-200 dark:border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-500 animate-pulse"></span>
                CRITICAL ALERT
              </span>
            </div>
            
            <h2 className="text-lg font-black text-rose-600 dark:text-rose-500 tracking-tight leading-tight mb-0.5">
              Low SpO2 Alert
            </h2>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
              Meenakshi Sundaram, 68 Years
            </h3>

            <div className="flex flex-col gap-1 text-[11px]">
              <div className="truncate">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mr-1">Location:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Block A, 15th Main Rd, Anna Nagar, Chennai</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mr-1">Detected:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">12 mins ago</span>
              </div>
            </div>
          </div>

          {/* 5. Live Vital Display */}
          <div className="shrink flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#12141a] border border-rose-100 dark:border-rose-900/30 shadow-sm min-w-[220px]">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
              <IconLungs className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex flex-col pr-2.5 border-r border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">SpO2</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">91%</span>
                <span className="text-rose-500 flex items-center text-[9px] font-bold"><ArrowDown className="w-2.5 h-2.5" /> 91%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Last 15 mins</span>
              <div className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                <span>94%</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600" />
                <span>93%</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600" />
                <span>92%</span>
                <ArrowRight className="w-2.5 h-2.5 text-rose-300 dark:text-rose-800" />
                <span className="text-rose-500">91%</span>
              </div>
            </div>
          </div>

          {/* 6. Response Status */}
          <div className="w-full xl:w-44 shrink flex flex-col py-1">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Response status</h4>
            
            <div className="relative pl-3.5 space-y-3 border-l-2 border-rose-100 dark:border-rose-900/30">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[19px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-rose-500 bg-white dark:bg-[#1b1e27]"></div>
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold text-rose-600 dark:text-rose-400 leading-none truncate pr-1">Alert detected</h5>
                  <span className="text-[8px] font-medium text-slate-500 dark:text-slate-400 shrink-0">12m</span>
                </div>
              </div>
              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[19px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-rose-500 bg-white dark:bg-[#1b1e27]"></div>
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold text-rose-600 dark:text-rose-400 leading-none truncate pr-1">Nurse notified</h5>
                  <span className="text-[8px] font-medium text-slate-500 dark:text-slate-400 shrink-0">11m</span>
                </div>
              </div>
              {/* Step 3 (Current) */}
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold text-slate-900 dark:text-white leading-none truncate pr-1">Dispatched</h5>
                  <span className="text-[8px] font-medium text-amber-500 dark:text-amber-400 shrink-0">Pending</span>
                </div>
              </div>
              {/* Step 4 */}
              <div className="relative opacity-40">
                <div className="absolute -left-[19px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1b1e27]"></div>
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-none truncate pr-1">Stabilized</h5>
                  <span className="text-[8px] font-medium text-slate-400 dark:text-slate-500 shrink-0">—</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Critical Actions */}
          <div className="w-full xl:w-36 shrink flex flex-col gap-1.5 min-w-[120px]">
            <button onClick={() => alert('Dispatching response team to Meenakshi Sundaram at Block A...')} className="w-full py-2 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1 group">
              Dispatch <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800/80 my-0.5"></div>
            <button onClick={() => setSelectedPatient({ name: 'Meenakshi Sundaram', age: '68 Years', alert: 'Low SpO2 Alert', location: 'Block A, 15th Main Rd, Anna Nagar, Chennai', detected: '12 mins ago' })} className="w-full py-1.5 px-2 rounded-md bg-slate-50 dark:bg-[#12141a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/60 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" /> View Patient
            </button>
            <button onClick={() => alert('Initiating call with on-duty nurse...')} className="w-full py-1.5 px-2 rounded-md bg-slate-50 dark:bg-[#12141a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/60 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-slate-400" /> Call Nurse
            </button>
            <button onClick={() => alert('Opening detailed vitals history...')} className="w-full py-1.5 px-2 rounded-md bg-slate-50 dark:bg-[#12141a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/60 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5">
              <Activity className="w-3 h-3 text-slate-400" /> View Vitals
            </button>
          </div>

        </div>
      </motion.div>

      {/* 8. MODERATE ALERT */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-white dark:bg-[#1b1e27] rounded-2xl border border-amber-200/60 dark:border-amber-900/30 shadow-sm"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        <div className="p-4 flex flex-col xl:flex-row gap-3 xl:gap-4 xl:items-center justify-between pl-5">
          
          <div className="flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-200/50 dark:border-amber-800/50">
                MODERATE ALERT
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-0.5 line-clamp-1">
              Post-Op Suture Dressing Due
            </h3>
            <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
              Rahul Kumar, 34 Years
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2 max-w-2xl line-clamp-1">
              Scheduled 48-hour incision drain inspection and IV cannula flush.
            </p>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</span>
                <span className="text-slate-700 dark:text-slate-300">T. Nagar, Chennai</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Detected</span>
                <span className="text-slate-700 dark:text-slate-300">45 mins ago</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status</span>
                <span className="text-amber-500 font-bold">Pending</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col gap-1.5 shrink-0 xl:w-36 border-t border-slate-100 dark:border-slate-800/50 pt-3 xl:pt-0 xl:border-t-0 xl:border-l xl:pl-4 min-w-[140px]">
            <button onClick={() => alert('Alert acknowledged for Rahul Kumar.')} className="w-full py-2 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 border border-amber-200/50 dark:border-amber-800/50">
              Acknowledge Alert <ArrowRight className="w-3 h-3" />
            </button>
            <button onClick={() => setSelectedPatient({ name: 'Rahul Kumar', age: '34 Years', alert: 'Post-Op Suture Dressing Due', location: 'T. Nagar, Chennai', detected: '45 mins ago' })} className="w-full py-1.5 px-2 rounded-md bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-[10px] font-bold transition-colors flex items-center justify-center gap-1.5">
               View Patient
            </button>
          </div>

        </div>
      </motion.div>

      {/* 9. ACTIVE RESPONSES */}
      <div className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Active responses</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Ongoing alerts and emergency dispatches</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-800/50">
                <Ambulance className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Meenakshi Sundaram</h4>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Low SpO2</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-0.5">Response team dispatched</span>
              <span className="block text-[11px] font-bold text-slate-400">ETA 4 min</span>
            </div>
            <button className="text-slate-400 hover:text-teal-500 transition-colors ml-2 shrink-0 p-2">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800/50">
                <Stethoscope className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Rahul Kumar</h4>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Post-op dressing</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">Nurse assigned</span>
              <span className="block text-[11px] font-bold text-slate-400">Visit scheduled 2:30 PM</span>
            </div>
            <button className="text-slate-400 hover:text-teal-500 transition-colors ml-2 shrink-0 p-2">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 10. RESOLVED TODAY */}
      <div className="pt-2">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Resolved today</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Alerts successfully handled</p>
        </div>
        
        <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
          <div className="flex flex-col">
            {[
              { title: 'Low BP alert', time: '10:42 AM' },
              { title: 'Medication missed', time: '09:18 AM' },
              { title: 'Fall-risk alert', time: '08:51 AM' },
              { title: 'Oxygen level normalized', time: '08:12 AM' },
            ].map((item, i, arr) => (
              <div key={i} className={`flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="mt-3 text-teal-600 dark:text-teal-400 text-sm font-bold flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 11. QUICK EMERGENCY ACTIONS */}
      <div className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Quick actions</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Common emergency and clinical actions</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="p-4 rounded-xl bg-white dark:bg-[#1b1e27] border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-teal-200 dark:hover:border-teal-800 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all flex items-center gap-3 text-left group">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
              <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Call Hospital ER</span>
          </button>
          
          <button className="p-4 rounded-xl bg-white dark:bg-[#1b1e27] border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-teal-200 dark:hover:border-teal-800 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all flex items-center gap-3 text-left group">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
              <HeartPulse className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">View Patient Vitals</span>
          </button>
          
          <button className="p-4 rounded-xl bg-white dark:bg-[#1b1e27] border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-teal-200 dark:hover:border-teal-800 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all flex items-center gap-3 text-left group">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
              <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Open Care Request</span>
          </button>
          
          <button className="p-4 rounded-xl bg-white dark:bg-[#1b1e27] border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-teal-200 dark:hover:border-teal-800 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all flex items-center gap-3 text-left group">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
              <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Contact Support</span>
          </button>
        </div>
      </div>

      {/* PATIENT DETAILS MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-[#1b1e27] rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-[#12141a]/50">
              <h3 className="font-black text-slate-900 dark:text-white">Patient Details</h3>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 flex items-center justify-center text-xl font-black text-teal-600 dark:text-teal-400 shrink-0">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {selectedPatient.name}
                  </h4>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {selectedPatient.age}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Alert</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400">{selectedPatient.alert}</span>
                  </div>
                </div>
                
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedPatient.location}</span>
                </div>
                
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alert Detected</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" /> {selectedPatient.detected}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#12141a]/80 border-t border-slate-100 dark:border-slate-800/60">
              <button 
                onClick={() => setSelectedPatient(null)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-black shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-0.5"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

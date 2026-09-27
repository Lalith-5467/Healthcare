import React from 'react';
import { 
  Calendar, Clock, Activity, HeartPulse, CheckCircle2, ChevronRight, 
  MapPin, Stethoscope, ArrowRight, ShieldCheck, 
  Users, CalendarCheck, Sparkles, Pill, FileText, AlertTriangle, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useNurseWorkflow, type BookingStatus } from '../../../utils/nurseWorkflowStorage';
import { getGreeting } from '../../../utils/greeting';

interface NurseOverviewViewProps {
  onNavigate: (id: string) => void;
  user?: { name: string; email: string };
}

export const NurseOverviewView: React.FC<NurseOverviewViewProps> = ({ onNavigate, user }) => {
  const { t } = useLanguage();
  const { bookings } = useNurseWorkflow();
  const activePatients = bookings.filter(b => b.status === 'Accepted' || b.status === 'Scheduled' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Care in Progress');
  const pendingRequests = bookings.filter(b => b.status === 'Pending');
  const completedVisits = bookings.filter(b => b.status === 'Completed');

  const baseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse';
  const nurseName = (baseName !== 'Nurse' && !baseName.includes('Senior RN')) 
    ? `${baseName}, Senior RN` 
    : baseName;

  return (
    <div className="space-y-4 pb-16 px-5 font-sans select-none w-full max-w-7xl mx-auto">
      
      {/* 1. NURSE HERO COMMAND BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/70 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black uppercase tracking-wider border border-rose-400/30 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              {t('nurse.overview.shift_status', 'On-Duty Clinical Station · Shift A')}
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-bold text-slate-300 bg-white/5 rounded-full border border-white/10">
              {t('nurse.overview.knc_reg', 'KNC Reg:')} RN-88421
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {getGreeting()}, {nurseName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            {t('nurse.overview.you_have', 'You have')} <strong className="text-rose-300 font-black">{activePatients.length} {t('nurse.overview.active_visits', 'active visits')}</strong>, <strong className="text-amber-300 font-black">{pendingRequests.length} {t('nurse.overview.incoming_requests', 'incoming requests')}</strong>, {t('nurse.overview.and', 'and')} <strong className="text-emerald-300 font-black">{completedVisits.length} {t('nurse.overview.completed_rounds_today', 'completed rounds today.')}</strong>
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('requests')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('nurse.overview.care_requests', 'Care Requests')} ({pendingRequests.length})</span>
          </button>
          
          <button
            onClick={() => onNavigate('schedule')}
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Clock className="w-4 h-4 text-cyan-300" />
            <span>{t('nurse.overview.shift_schedule', 'Shift Schedule')}</span>
          </button>
        </div>
      </div>
      
      {/* ROW 1: Today's Shift & Date */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-4">
        {/* Left: Today's Shift */}
        <div className="lg:col-span-8 flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 h-[55px] shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-800 dark:text-rose-400" />
            <span>Today's Shift</span>
            <span className="font-normal text-slate-500 dark:text-slate-400 ml-2">8:00 AM – 4:00 PM</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-800 dark:text-rose-400" />
            <span>2 Active Patients</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-rose-800 dark:text-rose-400" />
            <span>3 Visits Remaining</span>
          </div>
        </div>

        {/* Right: Date Control */}
        <div className="lg:col-span-4 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 h-[55px] shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-800 dark:text-rose-400" />
            <span>
              {new Date().toLocaleDateString('en-GB', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* ROW 2: Priority Care & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-4">
        {/* Left: Priority Care */}
        <div className="lg:col-span-8 border border-rose-100 dark:border-rose-900/50 rounded-[20px] bg-[#FFF5F7] dark:bg-rose-950/20 shadow-sm flex flex-col h-full p-4 gap-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3.5">
               <div className="p-2.5 bg-[#831b39] dark:bg-rose-900 rounded-2xl shadow-sm">
                 <HeartPulse className="w-6 h-6 text-white" strokeWidth={2.5} />
               </div>
               <div>
                 <h2 className="font-black text-xl text-[#831b39] dark:text-rose-300 leading-tight">Priority Care</h2>
                 <p className="text-[13px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Immediate attention needed</p>
               </div>
            </div>
            <button onClick={() => onNavigate('patients')} className="text-xs font-bold text-[#831b39] dark:text-rose-400 flex items-center gap-1 hover:underline cursor-pointer">
              View All <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row relative overflow-hidden">
            {/* Left red accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E11D48] dark:bg-red-500" />
            
            {/* Left section (Patient Info) */}
            <div className="flex-1 p-5 pl-7 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-900/40 text-[#831b39] dark:text-rose-300 font-black text-2xl flex items-center justify-center shrink-0 mt-3 border border-transparent dark:border-rose-800/50">
                R
              </div>
              <div className="flex flex-col items-start">
                <div className="bg-[#E11D48] dark:bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 mb-1.5 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> URGENT
                </div>
                <h3 className="font-black text-[#1E293B] dark:text-white text-[17px] leading-tight">Ragul Kumar</h3>
                <p className="text-[13px] font-semibold text-[#64748B] dark:text-slate-300 mt-1">34 yrs · Post-Op Wound Dressing & IV</p>
                <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8] dark:text-slate-500" /> Anna Nagar West, Chennai (Flat 4B, Green Towers)
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-rose-100/70 dark:bg-slate-800 hidden sm:block my-5" />

            {/* Right section (Action) */}
            <div className="p-5 flex items-center sm:w-[280px] shrink-0 justify-between gap-4 border-t border-rose-100 dark:border-slate-800 sm:border-t-0 pl-6 pr-6">
              <div className="flex flex-col">
                <p className="text-[15px] font-black text-[#E11D48] dark:text-red-400 flex items-center gap-1.5"><Clock className="w-4 h-4" strokeWidth={2.5} /> Due in 20 min</p>
                <p className="text-[13px] font-semibold text-[#64748B] dark:text-slate-400 mt-1">Wound dressing</p>
              </div>
              <button onClick={() => onNavigate('patients')} className="px-5 py-3 bg-[#831b39] dark:bg-rose-900 hover:bg-[#6c162f] dark:hover:bg-rose-800 text-white rounded-[10px] text-[13px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm transition-colors border border-transparent dark:border-rose-700/50">
                Open Chart <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-rose-800 dark:text-rose-400" />
            <h2 className="font-black text-slate-900 dark:text-white text-sm">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button onClick={() => onNavigate('vitals')} className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3 text-left hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-colors group flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
              </div>
              <p className="font-bold text-[11px] leading-tight text-slate-700 dark:text-slate-300">Record Vitals</p>
            </button>
            <button onClick={() => onNavigate('medications')} className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3 text-left hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-colors group flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-2">
                <Pill className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
              </div>
              <p className="font-bold text-[11px] leading-tight text-slate-700 dark:text-slate-300">Medication<br/>Administration</p>
            </button>
            <button onClick={() => onNavigate('patients')} className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3 text-left hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-colors group flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
              </div>
              <p className="font-bold text-[11px] leading-tight text-slate-700 dark:text-slate-300">Patient Notes</p>
            </button>
            <button onClick={() => onNavigate('inventory')} className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3 text-left hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-colors group flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
              </div>
              <p className="font-bold text-[11px] leading-tight text-slate-700 dark:text-slate-300">Medical Kit<br/>Stock</p>
            </button>
          </div>
        </div>
      </div>

      {/* ROW 3: Active Patient Rounds & Emergency Paramedic Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-4 items-start">
        {/* Left: Active Patient Rounds */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-rose-800 dark:text-rose-400" /> Active Patient Rounds (2)
            </h2>
            <button onClick={() => onNavigate('patients')} className="text-[11px] font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1 hover:underline cursor-pointer">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-bold">PATIENT</th>
                  <th className="px-5 py-3 font-bold">AGE / GENDER</th>
                  <th className="px-5 py-3 font-bold">PRIMARY DIAGNOSIS</th>
                  <th className="px-5 py-3 font-bold">CURRENT TASK</th>
                  <th className="px-5 py-3 font-bold">STATUS</th>
                  <th className="px-5 py-3 font-bold">NEXT DUE</th>
                  <th className="px-5 py-3 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('patients')}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center border border-rose-100 dark:border-rose-800">R</div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">Ragul Kumar</p>
                        <p className="text-[9px] text-slate-400 font-medium">ID: #4587</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-xs">34 / Male</td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Post-Op Wound Dressing & IV</p>
                    <p className="text-[9px] text-slate-500 font-medium">(Cannula Care)</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Wound dressing</p>
                    <p className="text-[9px] text-slate-500 font-medium">Bed 4B</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold flex w-fit items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Accepted
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-red-600 dark:text-red-400 flex items-center gap-1 mt-2.5">
                    <Clock className="w-3 h-3" /> 2:30 PM
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 inline-block" />
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('patients')}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center border border-teal-100 dark:border-teal-800">S</div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">Sowmiya P.</p>
                        <p className="text-[9px] text-slate-400 font-medium">ID: #4721</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-xs">45 / Female</td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Pneumonia</p>
                    <p className="text-[9px] text-slate-500 font-medium">(IV Antibiotics)</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Vitals Monitoring</p>
                    <p className="text-[9px] text-slate-500 font-medium">Bed 6A</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold flex w-fit items-center gap-1 text-[10px]">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1 mt-2.5">
                    <Clock className="w-3 h-3" /> 4:00 PM
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 inline-block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Emergency Paramedic Sync */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/50 shadow-sm p-5 flex flex-col h-full border-l-[4px] border-l-rose-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-rose-800 dark:text-rose-400" /> Emergency Paramedic Sync
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> System Ready
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-4 leading-relaxed flex-1">
            Direct emergency escalation channel to hospital trauma ward & nearest available ambulance.
          </p>
          <button onClick={() => onNavigate('alerts')} className="w-full py-2.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold text-[11px] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-auto">
            <AlertTriangle className="w-3.5 h-3.5" /> Broadcast Patient Emergency SOS
          </button>
        </div>
      </div>

      {/* ROW 4: Today's Visits & Station Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-4 items-start">
        {/* Left: Today's Visits */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <CalendarCheck className="w-4 h-4 text-rose-800 dark:text-rose-400" /> Today's Visits
            </h2>
            <button onClick={() => onNavigate('schedule')} className="text-[11px] font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1 hover:underline cursor-pointer">
              View Schedule <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-bold">TIME</th>
                  <th className="px-5 py-3 font-bold">PATIENT</th>
                  <th className="px-5 py-3 font-bold">TASK</th>
                  <th className="px-5 py-3 font-bold">PRIORITY</th>
                  <th className="px-5 py-3 font-bold">STATUS</th>
                  <th className="px-5 py-3 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('schedule')}>
                  <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> 8:00 AM</td>
                  <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">Ragul Kumar</td>
                  <td className="px-5 py-3 font-medium">Wound dressing & IV</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-[9px] flex items-center w-fit">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mr-1"></span> High
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-[9px] flex items-center w-fit">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Completed
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right"><ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 inline-block" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('schedule')}>
                  <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 10:30 AM</td>
                  <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">Meena S.</td>
                  <td className="px-5 py-3 font-medium">Vital signs check</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold text-[9px] flex items-center w-fit">
                      <span className="w-1 h-1 rounded-full bg-blue-500 mr-1"></span> Normal
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold text-[9px] flex items-center w-fit">
                      <Activity className="w-2.5 h-2.5 mr-1" /> Ongoing
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right"><ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 inline-block" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('schedule')}>
                  <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> 1:00 PM</td>
                  <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">Sanjay P.</td>
                  <td className="px-5 py-3 font-medium">Medication delivery</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold text-[9px] flex items-center w-fit">
                      <span className="w-1 h-1 rounded-full bg-blue-500 mr-1"></span> Normal
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold text-[9px] flex items-center w-fit">
                      <Clock className="w-2.5 h-2.5 mr-1" /> Upcoming
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right"><ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 inline-block" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('schedule')}>
                  <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> 3:30 PM</td>
                  <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">Keerthy V.</td>
                  <td className="px-5 py-3 font-medium">Follow-up check</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold text-[9px] flex items-center w-fit">
                      <span className="w-1 h-1 rounded-full bg-slate-400 mr-1"></span> Low
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold text-[9px] flex items-center w-fit">
                      <Clock className="w-2.5 h-2.5 mr-1" /> Upcoming
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right"><ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 inline-block" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Station Status */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-rose-800 dark:text-rose-400" /> Station Status
            </h2>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-slate-900 dark:text-white">100%</p>
                <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">E-Log Compliance</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-slate-900 dark:text-white">12 mins</p>
                <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Avg. Response Time</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Telemetry Active</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

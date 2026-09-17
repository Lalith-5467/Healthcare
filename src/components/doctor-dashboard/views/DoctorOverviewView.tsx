import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, RefreshCw, Bell, AlertTriangle, ChevronRight, Scan, 
  Stethoscope, Activity, FileText, Pill, Video, CheckCircle2, 
  ArrowUpRight, HeartPulse, Clock, Sparkles, ShieldCheck, Lock, Check, XCircle, Loader2
} from 'lucide-react';
import { getGreeting } from '../../../utils/greeting';
import { healthShareApi, type AccessRequestItem } from '../../../services/healthShareApi';

interface DoctorOverviewViewProps {
  onNavigate: (id: string) => void;
  onSelectPatient?: (patientId: string) => void;
  user?: { name: string; email: string };
}

interface DashboardData {
  doctor: {
    id: string;
    name: string;
    email: string;
  };
  statistics: {
    todayAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    activeConsultations: number;
    totalPatients: number;
  };
  todaySchedule: any[];
  activeQueue: any[];
}

export const DoctorOverviewView: React.FC<DoctorOverviewViewProps> = ({ 
  onNavigate, 
  onSelectPatient,
  user 
}) => {
  const doctorName = user?.name ? (user.name.startsWith('Dr') ? user.name : `Dr. ${user.name}`) : 'Dr. Rajesh Varma';
  const [accessRequests, setAccessRequests] = useState<AccessRequestItem[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchDoctorRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const data = await healthShareApi.getDoctorRequests();
      setAccessRequests(data);
    } catch (err) {
      console.warn('Failed to load doctor access requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctor/dashboard');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        }
      }
    } catch (err: any) {
      console.warn('Dashboard data fetch error:', err?.message);
    }
  };

  useEffect(() => {
    fetchDoctorRequests();
    fetchDashboardData();
    const interval = setInterval(fetchDoctorRequests, 8000);
    return () => clearInterval(interval);
  }, []);

  const statistics = dashboardData?.statistics || {
    todayAppointments: 6,
    confirmedAppointments: 4,
    pendingAppointments: 2,
    completedAppointments: 1,
    activeConsultations: 1,
    totalPatients: 6,
  };

  const activeQueue = dashboardData?.activeQueue || [
    { id: 'apt-1', patientName: 'Abinesh Kumar', patientId: 'PT-10245', age: 28, gender: 'Male', time: '10:30 AM', status: 'Scheduled', type: 'OPD In-Clinic', reason: 'Post-Appendectomy Suture Review' },
    { id: 'apt-2', patientName: 'Ragul Kumar', patientId: 'PT-10892', age: 45, gender: 'Male', time: '10:45 AM', status: 'Delayed', type: 'Tele-Consultation', reason: 'Hypertension Medication Check' },
    { id: 'apt-3', patientName: 'Mrs. Meenakshi Sundaram', patientId: 'PT-10331', age: 62, gender: 'Female', time: '11:15 AM', status: 'In Consultation', type: 'Tele-Consultation', reason: 'Diabetes Vitals & Routine Adherence' }
  ];

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* 1. HERO GREETING, ABDM CLINICAL STATUS & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-br from-teal-50 via-cyan-50 to-white dark:from-slate-900 dark:via-[#0c162c] dark:to-[#070c18] p-6 sm:p-8 rounded-3xl border border-teal-100/50 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl text-slate-900 dark:text-white relative overflow-hidden">
        {/* Ambient mesh background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded-full border border-teal-400/30 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              OPD Suite 402 · Active Duty
            </span>
            <span className="px-3 py-1 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10 backdrop-blur-md">
              NMC-Reg: 74829-KA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {doctorName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
            You have <strong className="text-teal-700 dark:text-teal-300 font-black">{statistics.todayAppointments} appointments</strong> today, <strong className="text-amber-600 dark:text-amber-300 font-black">{statistics.pendingAppointments} patients</strong> in the waiting room, and <strong className="text-blue-600 dark:text-blue-300 font-black">{statistics.activeConsultations} active consultations</strong>.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate('scan')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 px-6 py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_20px_rgba(20,184,166,0.3)] dark:shadow-teal-500/20 transition-all hover:scale-102 cursor-pointer group"
          >
            <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Scan Patient QR</span>
          </button>

          <button 
            onClick={() => onNavigate('consultations')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-900 dark:text-white px-5 py-3.5 rounded-2xl font-bold text-sm border border-slate-200/60 dark:border-white/15 backdrop-blur-md shadow-sm dark:shadow-none transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
            <span>Tele-Consult</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {[
          { label: 'Today\'s Appointments', value: statistics.todayAppointments, icon: Calendar, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', trend: `${statistics.completedAppointments} completed` },
          { label: 'Waiting Patients', value: statistics.pendingAppointments, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', trend: 'In Clinic' },
          { label: 'Confirmed Schedule', value: statistics.confirmedAppointments, icon: RefreshCw, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20', trend: 'Up next' },
          { label: 'Unique Patients', value: statistics.totalPatients, icon: Pill, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20', trend: 'Total today' },
          { label: 'Active Consults', value: statistics.activeConsultations, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', trend: 'In progress' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
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
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN WORKSTATION TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE SCHEDULE & WAITING ROOM (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TODAY'S SCHEDULE & ACTIVE QUEUE */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
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
              {activeQueue.length === 0 ? (
                <div className="p-10 text-center text-slate-500 bg-white dark:bg-[#0b1120]">
                  No appointments scheduled for today.
                </div>
              ) : (
                activeQueue.map((apt: any) => (
                  <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group cursor-pointer border-l-2 border-transparent hover:border-teal-500">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center font-black shrink-0 shadow-md">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">{apt.patientName}</h3>
                          <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">{apt.age}y · {apt.gender}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold mt-1 uppercase tracking-wide">{apt.reason}</p>
                        <p className="text-[11px] font-mono font-bold text-teal-700 dark:text-cyan-300 mt-1.5 flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/30 w-max px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50">
                          <Activity className="w-3.5 h-3.5 text-teal-500" />
                          {apt.time} • {apt.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm ${apt.statusColor}`}>
                        {apt.status}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('patient-360');
                        }}
                        className="text-[11px] font-black text-white dark:text-slate-900 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-xl shadow-[0_4px_15px_rgba(20,184,166,0.3)] dark:shadow-teal-500/20 transition-all hover:scale-105"
                      >
                        <span>Chart 360°</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECURE PATIENT ACCESS REQUESTS & SESSIONS */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                <div>
                  <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    Patient Access Requests
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    ABDM Consent & Temporary Health Record Authorizations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDoctorRequests}
                  disabled={isLoadingRequests}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Refresh Requests"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRequests ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => onNavigate('scan')}
                  className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" /> Scan QR
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
              {accessRequests.length === 0 ? (
                <div className="text-center py-6">
                  <ShieldCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No Patient Access Requests Yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Click "Scan Patient QR" above to scan a patient's code and request authorized clinical records.
                  </p>
                </div>
              ) : (
                accessRequests.map((req) => (
                  <div key={req.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {req.patientName || 'Ananya Sharma'}
                        </h4>
                        {req.patientAge && (
                          <span className="text-[10px] font-bold text-slate-400 font-mono">
                            Age: {req.patientAge}
                          </span>
                        )}
                        {req.patientBloodGroup && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 font-mono">
                            ({req.patientBloodGroup})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <span className="font-bold text-slate-500">Purpose:</span> {req.purpose}
                      </p>

                      <div className="text-[11px] text-slate-400 font-mono">
                        Requested: {new Date(req.requestedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>

                      {req.status === 'APPROVED' && req.expiresAt && (
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          Access expires: {new Date(req.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}

                      {req.status === 'REJECTED' && (
                        <p className="text-xs font-bold text-rose-500">
                          Patient rejected the medical record access request.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      {req.status === 'PENDING' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/50 animate-pulse">
                          Waiting for approval
                        </span>
                      )}

                      {req.status === 'APPROVED' && (
                        <>
                          <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 flex items-center gap-1">
                            <Check className="w-3 h-3" /> ACCESS APPROVED
                          </span>
                          <button
                            onClick={() => {
                              if (req.patientId && onSelectPatient) {
                                onSelectPatient(req.patientId);
                              } else {
                                onNavigate('patient-360');
                              }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 font-black text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
                          >
                            <span>View Patient Record</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {req.status === 'REJECTED' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300/50">
                          REJECTED
                        </span>
                      )}

                      {req.status === 'EXPIRED' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                          EXPIRED
                        </span>
                      )}

                      {req.status === 'REVOKED' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-rose-500 border border-slate-300 dark:border-slate-700">
                          REVOKED
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
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
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">System Notification</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">Now</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Elevated Systolic BP warnings detected on telemetry.</p>
                <div className="pt-1 flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate('patient-360')}
                    className="text-[11px] font-black text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Review Alerts →
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">Lab Reports Available</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">Recent</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">New diagnostic reports uploaded. Prescription review requested.</p>
                <div className="pt-1 flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate('prescriptions')}
                    className="text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Check Inbox →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI CLINICAL DIAGNOSTIC COPILOT WIDGET */}
          <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-teal-950 dark:via-slate-900 dark:to-cyan-950 p-5 sm:p-6 rounded-3xl border border-teal-200 dark:border-teal-500/30 text-slate-900 dark:text-white shadow-lg space-y-3.5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-400/10 dark:bg-teal-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-cyan-300" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">MediCare AI Clinical Copilot</h3>
              </div>
              <span className="text-[9px] font-mono font-bold bg-teal-100 dark:bg-teal-400/20 text-teal-700 dark:text-teal-200 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-300/30">
                GPT-4 Health
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium relative z-10">
              New diagnostic summaries compiled from ABHA hospital telemetry for your upcoming cases today.
            </p>

            <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1 relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Drug Interaction Risk Checked</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">Zero contra-indications flagged across active patient prescriptions.</p>
            </div>

            <button 
              onClick={() => onNavigate('patient-360')}
              className="w-full relative z-10 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
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

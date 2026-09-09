import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, 
  Users, 
  Pill, 
  Activity, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Stethoscope, 
  ShieldCheck, 
  AlertOctagon, 
  X, 
  Heart,
  Droplets,
  Wind,
  Thermometer,
  ArrowUpRight
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

interface CaregiverOverviewViewProps {
  onNavigate: (navId: string) => void;
  onOpenSOSModal?: () => void;
}

export const CaregiverOverviewView: React.FC<CaregiverOverviewViewProps> = ({ onNavigate }) => {
  const { 
    wards, 
    activeWard, 
    setActiveWardId, 
    tasks, 
    toggleTask, 
    toggleMedicationTaken, 
    requestMedicationRefill,
    addVitalReading,
    triggerSOS,
    alerts
  } = useCaregiverWorkflow();

  const [isLogVitalOpen, setIsLogVitalOpen] = useState(false);
  const [isSOSConfirmOpen, setIsSOSConfirmOpen] = useState(false);
  const [systolic, setSystolic] = useState('126');
  const [diastolic, setDiastolic] = useState('82');
  const [bloodSugar, setBloodSugar] = useState('115');
  const [spo2, setSpo2] = useState('98');
  const [heartRate, setHeartRate] = useState('74');
  const [vitalNotes, setVitalNotes] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalReading(activeWard.id, {
      systolic: parseInt(systolic, 10) || undefined,
      diastolic: parseInt(diastolic, 10) || undefined,
      bloodSugar: parseInt(bloodSugar, 10) || undefined,
      sugarType: 'Random',
      spo2: parseInt(spo2, 10) || undefined,
      heartRate: parseInt(heartRate, 10) || undefined,
      notes: vitalNotes || 'Logged by Caregiver'
    });
    setIsLogVitalOpen(false);
    showToast(`Vitals successfully recorded for ${activeWard.name}!`);
  };

  const handleTriggerSOS = () => {
    triggerSOS(activeWard.id, 'SOS Panic Button');
    setIsSOSConfirmOpen(false);
    showToast(`🚨 Emergency SOS dispatched for ${activeWard.name}!`);
  };

  // Calculations
  const allMeds = wards.flatMap(w => w.medications);
  const totalMedsToday = allMeds.length;
  const takenMedsToday = allMeds.filter(m => m.takenToday).length;
  const adherenceRate = totalMedsToday > 0 ? Math.round((takenMedsToday / totalMedsToday) * 100) : 100;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;

  const latestVital = activeWard.vitals[0];

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* TOAST ALERT */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50/80 via-white to-cyan-50/80 dark:from-[#0b1b36] dark:via-[#092b49] dark:to-[#041a2e] p-6 sm:p-8 text-slate-900 dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl border border-transparent dark:border-slate-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-fuchsia-100/40 to-cyan-100/40 dark:from-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-400/30 text-teal-700 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Caregiver Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Family Health & Guardian Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
              Monitoring <span className="font-bold text-slate-900 dark:text-white">{wards.length} dependents</span> across medication adherence, live vitals telemetry, geofence safety rings, and emergency doctor dispatch.
            </p>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLogVitalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>Log Vitals</span>
            </button>
            <button
              onClick={() => onNavigate('medications')}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/20 transition-all flex items-center gap-2"
            >
              <Pill className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
              <span>Manage Pills</span>
            </button>
            <button
              onClick={() => setIsSOSConfirmOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* METRIC PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/60">
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dependents</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{wards.length} Active</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Meds Adherence</p>
            <p className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1">{adherenceRate}%</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Care Tasks</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingTasksCount} Tasks</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-white/50 dark:border-slate-700/40 backdrop-blur-md shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Alerts</p>
            <p className={`text-xl font-black mt-1 ${activeAlertsCount > 0 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {activeAlertsCount > 0 ? `${activeAlertsCount} Active Alert` : 'All Safe'}
            </p>
          </div>
        </div>
      </div>

      {/* DEPENDENTS MULTI-PATIENT SWITCHER CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
            <span>Assigned Wards & Family Health Status</span>
          </h2>
          <button 
            onClick={() => onNavigate('wards')} 
            className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            View All Profiles <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wards.map((ward) => {
            const isSelected = ward.id === activeWard.id;
            const medCount = ward.medications.length;
            const takenCount = ward.medications.filter(m => m.takenToday).length;

            return (
              <motion.div
                key={ward.id}
                whileHover={{ y: -3 }}
                onClick={() => setActiveWardId(ward.id)}
                className={`cursor-pointer rounded-2xl p-4 transition-all relative overflow-hidden border ${
                  isSelected 
                    ? 'bg-white dark:bg-[#0f1d35] border-teal-500 dark:border-cyan-400 ring-2 ring-teal-500/20 shadow-xl'
                    : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-base shadow-md">
                      {ward.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {ward.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        {ward.relationship} • {ward.age} yrs • {ward.bloodGroup}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    ward.overallStatus === 'Alert' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse' :
                    ward.overallStatus === 'Needs Attention' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    {ward.overallStatus}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" /> Today's Meds
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {takenCount}/{medCount} taken
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> Geofence
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[140px]">
                      {ward.geofenceStatus}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 bg-teal-50 dark:bg-cyan-950/40 text-teal-700 dark:text-cyan-300 text-[11px] font-black py-1 px-2.5 rounded-lg flex items-center justify-between">
                    <span>Currently Monitoring</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SELECTED WARD ACTIVE TELEMETRY DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 8 COLS: VITALS & MEDICATIONS & ROUTINES */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* VITALS TELEMETRY DECK */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <span>Real-time Biometrics: {activeWard.name}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last recorded: {latestVital?.date || 'Today'} at {latestVital?.time || 'Morning'}
                </p>
              </div>

              <button
                onClick={() => setIsLogVitalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" /> Record Vitals
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* BP */}
              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> BP</span>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Normal</span>
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {latestVital?.systolic || 126}/{latestVital?.diastolic || 82}
                </p>
                <p className="text-[10px] text-slate-400">mmHg</p>
              </div>

              {/* Blood Sugar */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-cyan-500" /> Sugar</span>
                  <span className="text-[10px] font-black uppercase text-teal-600 dark:text-cyan-400">Fasting</span>
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {latestVital?.bloodSugar || 118}
                </p>
                <p className="text-[10px] text-slate-400">mg/dL</p>
              </div>

              {/* SpO2 */}
              <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-900/30">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                  <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-sky-500" /> SpO2</span>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Optimal</span>
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {latestVital?.spo2 || 98}%
                </p>
                <p className="text-[10px] text-slate-400">Oxygen Saturation</p>
              </div>

              {/* Heart Rate */}
              <div className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/30">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                  <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-violet-500" /> Pulse</span>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Resting</span>
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {latestVital?.heartRate || 74}
                </p>
                <p className="text-[10px] text-slate-400">bpm</p>
              </div>
            </div>
          </div>

          {/* TODAY'S MEDICINE SCHEDULE & PILL ASSIST */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Today's Medicine Schedule for {activeWard.name}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tap checkmark to record dosage administered or assisted
                </p>
              </div>

              <button 
                onClick={() => onNavigate('medications')} 
                className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                All Meds <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeWard.medications.map((med) => {
                const isLowStock = med.stockLeft <= 5;
                return (
                  <div
                    key={med.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      med.takenToday
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/40'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-transparent dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleMedicationTaken(activeWard.id, med.id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          med.takenToday
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-black ${med.takenToday ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {med.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-cyan-300 font-bold">
                            {med.timing}
                          </span>
                          {isLowStock && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold">
                              Low ({med.stockLeft} left)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {med.dosage} • {med.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLowStock && (
                        <button
                          onClick={() => requestMedicationRefill(activeWard.id, med.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black transition-all flex items-center gap-1 shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3" /> 1-Click Refill
                        </button>
                      )}
                      {med.takenToday && med.takenAt && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {med.takenAt}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DAILY CARE TASKS */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <span>Caregiver Daily Tasks & Routine</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Essential health duties for {activeWard.name} and family members
                </p>
              </div>

              <button 
                onClick={() => onNavigate('routines')} 
                className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                Manage Routines <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-900/30 border-transparent dark:border-slate-800/60 opacity-70'
                      : 'bg-white dark:bg-slate-900/70 border-slate-100 dark:border-slate-800 hover:border-teal-500/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'bg-teal-500 text-white' 
                        : 'border-2 border-slate-300 dark:border-slate-600'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {task.category} • Scheduled: {task.time}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: SAFETY & GEOFENCE, DOCTOR CONTACT, AI CARE NOTES */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* GEOFENCE & SAFETY STATUS CARD */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Geofence & Safety</span>
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Safe
              </span>
            </div>

            {/* RADAR MAP SIMULATOR */}
            <div className="relative h-36 rounded-2xl bg-slate-50 dark:bg-gradient-to-tr dark:from-slate-900 dark:to-slate-800 overflow-hidden p-3 flex flex-col justify-between border border-slate-200 dark:border-slate-700/60 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#00a896_1px,transparent_1px)] dark:bg-[radial-gradient(#00a896_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-25" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-teal-500/30 dark:border-teal-500/40 animate-ping pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-500/10 border-2 border-teal-500 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)] dark:shadow-teal-500/50">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-white" />
              </div>

              <div className="relative z-10 flex justify-between items-center text-[10px] font-bold">
                <span className="bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-transparent">GPS Active</span>
                <span className="bg-white/80 dark:bg-slate-900/80 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-transparent">98% Battery</span>
              </div>

              <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 rounded-xl p-2 text-xs backdrop-blur-md shadow-sm border border-slate-100 dark:border-transparent text-slate-900 dark:text-white">
                <p className="font-black truncate">{activeWard.currentLocation}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Updated: {activeWard.lastLocationUpdate}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('emergency')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-900 dark:text-white transition-all flex items-center justify-center gap-2"
            >
              <span>View Safety Ring & SOS Settings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* PRIMARY DOCTOR CONNECT */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-transparent dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Primary Doctor</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-cyan-500/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm">
                  Dr
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {activeWard.primaryDoctor.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    {activeWard.primaryDoctor.specialty}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeWard.primaryDoctor.hospital}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${activeWard.primaryDoctor.phone}`}
                  className="flex-1 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Clinic
                </a>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Visit
                </button>
              </div>
            </div>
          </div>

          {/* AI CAREGIVER SUMMARY & ADVICE */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-50/80 via-fuchsia-50/50 to-cyan-50/80 dark:from-indigo-950/40 dark:via-fuchsia-950/20 dark:to-cyan-950/40 border border-indigo-100/50 dark:border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm text-slate-800 dark:text-slate-200 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-200/20 dark:bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider relative z-10">
              <Sparkles className="w-4 h-4 animate-pulse text-fuchsia-500" /> AI Care Assistant Summary
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium relative z-10">
              "{activeWard.name}'s blood pressure trend is stable (126/82 mmHg). Morning medications are complete. Remember to assist with 20 minutes of gentle walking before sunset."
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold relative z-10">
              <span>ABDM Health ID Linked</span>
              <span className="text-indigo-600 dark:text-indigo-400">Consent Verified</span>
            </div>
          </div>

        </div>
      </div>

      {/* LOG VITAL MODAL */}
      <AnimatePresence>
        {isLogVitalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsLogVitalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Log Vitals for {activeWard.name}</span>
                </h3>
                <button onClick={() => setIsLogVitalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVital} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      placeholder="110"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="98"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Heart Rate / Pulse (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="75"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caregiver Observation Notes</label>
                  <textarea
                    rows={2}
                    value={vitalNotes}
                    onChange={(e) => setVitalNotes(e.target.value)}
                    placeholder="Patient took medication on time. Feeling energetic..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLogVitalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    Save Vitals
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOS CONFIRMATION MODAL */}
      <AnimatePresence>
        {isSOSConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsSOSConfirmOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-rose-500/40 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto animate-bounce">
                <AlertOctagon className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Trigger Emergency SOS?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This will dispatch Apollo 108 Emergency Ambulance to <span className="font-bold text-slate-900 dark:text-white">{activeWard.currentLocation}</span> and broadcast urgent alerts to all family caregivers.
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-2xl border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-bold text-left space-y-1">
                <p>• Patient: {activeWard.name} ({activeWard.age} yrs, {activeWard.bloodGroup})</p>
                <p>• ABHA ID: {activeWard.abhaId}</p>
                <p>• Known Allergies: {activeWard.allergies.join(', ')}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsSOSConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTriggerSOS}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30"
                >
                  Confirm & Dispatch SOS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

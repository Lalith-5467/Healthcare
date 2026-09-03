import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertOctagon, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Users, 
  Ambulance, 
  Sparkles,
  X
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverEmergencyView: React.FC = () => {
  const { wards, activeWard, setActiveWardId, alerts, triggerSOS, resolveSOS } = useCaregiverWorkflow();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDispatchSOS = (type: any) => {
    triggerSOS(activeWard.id, type);
    setIsConfirmOpen(false);
    showToast(`🚨 Urgent Emergency SOS dispatched for ${activeWard.name}!`);
  };

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-rose-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            <span>Emergency SOS & Rapid Dispatch Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Direct 108 ambulance dispatch, GPS geofence breaches, fall detection telemetry, and family alerts.
          </p>
        </div>

        {/* WARD SWITCHER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {wards.map((ward) => (
            <button
              key={ward.id}
              onClick={() => setActiveWardId(ward.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                ward.id === activeWard.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {ward.name}
            </button>
          ))}
        </div>
      </div>

      {/* SOS PANIC TRIGGER CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/90 via-rose-900/80 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-rose-600/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-black uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" /> Rapid Dispatch Ready
          </div>
          <h2 className="text-2xl font-black">
            Emergency Panic Button for {activeWard.name}
          </h2>
          <p className="text-xs text-rose-200/90 max-w-xl leading-relaxed">
            Pressing this button will instantly dispatch an emergency ambulance to <span className="font-bold text-white">{activeWard.currentLocation}</span>, transmit critical medical records to the nearest trauma team, and notify all verified family contacts.
          </p>
        </div>

        <button
          onClick={() => setIsConfirmOpen(true)}
          className="w-40 h-40 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-base shadow-2xl shadow-rose-600/60 border-4 border-rose-400/40 flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shrink-0 animate-pulse"
        >
          <AlertOctagon className="w-10 h-10" />
          <span>TRIGGER SOS</span>
        </button>
      </div>

      {/* GEOFENCE RADAR & RESCUE NETWORK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LIVE GPS & GEOFENCE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Real-Time Geofence Radar: {activeWard.name}</span>
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              {activeWard.geofenceStatus}
            </span>
          </div>

          <div className="relative h-48 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700 overflow-hidden p-4 flex flex-col justify-between text-white">
            <div className="absolute inset-0 bg-[radial-gradient(#00a896_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            
            <div className="flex justify-between items-center text-xs font-bold relative z-10">
              <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> GPS Live Broadcast
              </span>
              <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs text-slate-300">
                Safe Zone Radius: 500m
              </span>
            </div>

            <div className="text-center relative z-10 space-y-1">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/40">
                <MapPin className="w-6 h-6 text-teal-300" />
              </div>
              <p className="font-black text-sm text-white">{activeWard.currentLocation}</p>
              <p className="text-[10px] text-slate-400">Last Telemetry Ping: {activeWard.lastLocationUpdate}</p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 relative z-10">
              <span>Sensor: Apple Watch Series 9 Health Ring</span>
              <span>Cellular Triangulation: Optimal</span>
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACT CIRCLE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            <span>Emergency Responders & Family Ring</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
                  108
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Apollo Emergency Trauma Hotline</p>
                  <p className="text-[11px] text-slate-500">24x7 Ambulance & Paramedic Unit</p>
                </div>
              </div>
              <a href="tel:108" className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Call 108
              </a>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black">
                  Dr
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">{activeWard.primaryDoctor.name}</p>
                  <p className="text-[11px] text-slate-500">{activeWard.primaryDoctor.specialty} • {activeWard.primaryDoctor.hospital}</p>
                </div>
              </div>
              <a href={`tel:${activeWard.primaryDoctor.phone}`} className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Call Doctor
              </a>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black">
                  CG
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Anita Sharma (Primary Caregiver)</p>
                  <p className="text-[11px] text-slate-500">Verified Legal Guardian • +91 98765 11223</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-50 dark:bg-cyan-950/40 text-teal-700 dark:text-cyan-300">
                Primary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ALERTS AUDIT LOG */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
          <span>Emergency Broadcast Audit Log</span>
        </h3>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-bold">
            No emergency alerts triggered. All family members are safe in designated zones.
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                    alert.status === 'Active' ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500 text-white'
                  }`}>
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">
                      {alert.type} — {alert.wardName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Location: {alert.location} • Responder: {alert.responder || 'Dispatched'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    alert.status === 'Active' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}>
                    {alert.status}
                  </span>

                  {alert.status === 'Active' && (
                    <button
                      onClick={() => resolveSOS(alert.id)}
                      className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsConfirmOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-rose-500/40 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                <AlertOctagon className="w-9 h-9 animate-bounce" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Confirm Emergency SOS Dispatch
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose the nature of the emergency for {activeWard.name}:
                </p>
              </div>

              <div className="space-y-2">
                {[
                  'SOS Panic Button',
                  'Fall Detected',
                  'Abnormal Vitals',
                  'Geofence Breach'
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleDispatchSOS(type)}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-600 hover:text-white text-rose-700 dark:text-rose-300 font-black text-xs border border-rose-200 dark:border-rose-800/60 transition-all text-left flex items-center justify-between"
                  >
                    <span>{type}</span>
                    <AlertOctagon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsConfirmOpen(false)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

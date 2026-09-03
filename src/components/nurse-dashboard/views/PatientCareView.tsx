import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Activity, Thermometer, Droplets, Clock, CheckCircle2, 
  MapPin, Phone, AlertTriangle, ShieldCheck, FileText, Check, 
  ChevronRight, Car, User, Pill, ArrowRight, ClipboardList, KeyRound, Stethoscope
} from 'lucide-react';
import { useNurseWorkflow, type BookingStatus } from '../../../utils/nurseWorkflowStorage';

interface PatientCareViewProps {
  onNavigate: (id: string) => void;
}

export const PatientCareView: React.FC<PatientCareViewProps> = ({ onNavigate }) => {
  const { bookings, updateBookingStatus, updateBookingData, addNotification, toggleChecklistItem } = useNurseWorkflow();
  const [activeTab, setActiveTab] = useState<'tracking' | 'vitals' | 'checklist' | 'notes'>('tracking');

  // Find active booking
  const activeBooking = bookings.find(b => 
    b.status !== 'Pending' && 
    b.status !== 'Rejected' && 
    b.status !== 'Completed'
  ) || bookings[0];

  const [vitalsForm, setVitalsForm] = useState({
    bp: activeBooking?.vitals?.bp || '120/80',
    hr: activeBooking?.vitals?.hr || '74',
    temp: activeBooking?.vitals?.temp || '98.6',
    spo2: activeBooking?.vitals?.spo2 || '99',
    bs: activeBooking?.vitals?.bs || '105'
  });
  const [notes, setNotes] = useState(activeBooking?.notes || 'Post-operative wound dressing completed with sterile antiseptic. Suture line healthy with no signs of infection or swelling.');

  if (!activeBooking) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Active Patient Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">Please accept an inbound request from the Care Requests tab to open the clinical console.</p>
      </div>
    );
  }

  const handleStatusAdvance = () => {
    let nextStatus: BookingStatus = 'Pending';
    
    switch(activeBooking.status) {
      case 'Accepted':
      case 'Scheduled':
        nextStatus = 'On the Way';
        break;
      case 'On the Way':
        nextStatus = 'Arrived';
        break;
      case 'Arrived':
        nextStatus = 'Care in Progress';
        break;
      case 'Care in Progress':
        nextStatus = 'Completed';
        break;
    }
    
    if (nextStatus !== 'Pending') {
      updateBookingStatus(activeBooking.id, nextStatus);
      addNotification(`Patient status updated: ${nextStatus}`, 'success');
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingData(activeBooking.id, {
      vitals: {
        bp: `${vitalsForm.bp} mmHg`,
        hr: `${vitalsForm.hr} bpm`,
        temp: `${vitalsForm.temp} °F`,
        spo2: `${vitalsForm.spo2}%`,
        bs: `${vitalsForm.bs} mg/dL`
      }
    });
    addNotification('Patient biometrics saved & transmitted to EHR.', 'success');
    setActiveTab('checklist');
  };

  const handleCompleteVisit = () => {
    updateBookingData(activeBooking.id, { notes });
    updateBookingStatus(activeBooking.id, 'Completed');
    addNotification('In-Home Nursing Visit finalized and synced to ABDM EHR.', 'success');
  };

  const defaultChecklist = activeBooking.checklist || [
    { id: '1', label: 'Verify patient identity & ABHA ID', done: true },
    { id: '2', label: 'Sanitize hands & equip sterile clinical kit', done: true },
    { id: '3', label: 'Record baseline vitals (BP, SpO2, Temperature)', done: false },
    { id: '4', label: 'Perform procedure according to doctor prescription', done: false },
    { id: '5', label: 'Dispose biomedical waste per clinical standards', done: false }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. PATIENT CARE HERO CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            {activeBooking.patientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-md">
                Active In-Home Care
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {activeBooking.id}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeBooking.patientName} ({activeBooking.patientAge}y)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{activeBooking.serviceType}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                {activeBooking.location}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {activeBooking.patientPhone && (
            <a 
              href={`tel:${activeBooking.patientPhone}`}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>Call Patient</span>
            </a>
          )}

          {activeBooking.status !== 'Completed' && (
            <button
              onClick={handleStatusAdvance}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 cursor-pointer transition-all hover:scale-102"
            >
              <Car className="w-4 h-4" />
              <span>
                {activeBooking.status === 'Accepted' || activeBooking.status === 'Scheduled' 
                  ? 'Start Travel → On the Way'
                  : activeBooking.status === 'On the Way'
                  ? 'Confirm Doorstep Arrival'
                  : activeBooking.status === 'Arrived'
                  ? 'Begin Bedside Care'
                  : 'Complete Visit'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUBTAB CONTROLS */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
        {[
          { id: 'tracking', label: 'Visit Navigation & Live Transit', icon: Car },
          { id: 'vitals', label: 'Bedside Vitals & Telemetry', icon: Activity },
          { id: 'checklist', label: 'Clinical Checklist', icon: ClipboardList },
          { id: 'notes', label: 'EHR Clinical Notes', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* TRACKING TAB */}
            {activeTab === 'tracking' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-4 h-4 text-rose-600" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Patient Start-Care Auth PIN: <strong className="font-mono text-rose-600 font-black text-sm">{activeBooking.otpPin || '5928'}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Verify at Doorstep</span>
                </div>

                <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {[
                    { label: 'Booking Accepted & Assigned to Nurse Sarah', status: ['Accepted', 'Scheduled', 'On the Way', 'Arrived', 'Care in Progress', 'Completed'], desc: 'Procedure schedule confirmed.' },
                    { label: 'En Route to Patient Location', status: ['On the Way', 'Arrived', 'Care in Progress', 'Completed'], desc: `Traveling to ${activeBooking.location}. Distance: ~${activeBooking.distanceKm || '2.4 km'}.` },
                    { label: 'Arrived at Patient Doorstep', status: ['Arrived', 'Care in Progress', 'Completed'], desc: 'Doorstep arrival confirmed.' },
                    { label: 'Bedside Clinical Care in Progress', status: ['Care in Progress', 'Completed'], desc: 'Surgical wound change & IV telemetry active.' },
                    { label: 'Visit Completed & EHR Dispatched', status: ['Completed'], desc: 'Final vitals and clinical notes uploaded.' }
                  ].map((step, idx) => {
                    const isCompleted = step.status.includes(activeBooking.status);
                    return (
                      <div key={idx} className="relative group">
                        <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${
                          isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}>
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                          <p className={`text-xs font-black ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VITALS TAB */}
            {activeTab === 'vitals' && (
              <form onSubmit={handleSaveVitals} className="max-w-2xl mx-auto space-y-5">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Record Bedside Biometrics</h3>
                  <p className="text-xs text-slate-500">Telemetry is synchronized directly to the Doctor and Patient dashboard.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Pressure (mmHg)
                    </label>
                    <input 
                      type="text" 
                      placeholder="120/80" 
                      value={vitalsForm.bp} 
                      onChange={e => setVitalsForm({...vitalsForm, bp: e.target.value})} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-black text-sm" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-500" /> Pulse Heart Rate (bpm)
                    </label>
                    <input 
                      type="number" 
                      placeholder="74" 
                      value={vitalsForm.hr} 
                      onChange={e => setVitalsForm({...vitalsForm, hr: e.target.value})} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-black text-sm" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Body Temperature (°F)
                    </label>
                    <input 
                      type="text" 
                      placeholder="98.6" 
                      value={vitalsForm.temp} 
                      onChange={e => setVitalsForm({...vitalsForm, temp: e.target.value})} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-black text-sm" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-teal-500" /> Blood Oxygen SpO2 (%)
                    </label>
                    <input 
                      type="number" 
                      placeholder="99" 
                      value={vitalsForm.spo2} 
                      onChange={e => setVitalsForm({...vitalsForm, spo2: e.target.value})} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-black text-sm" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition-all shadow-lg shadow-rose-500/20 text-xs cursor-pointer"
                >
                  Save Telemetry & Proceed to Checklist →
                </button>
              </form>
            )}

            {/* CHECKLIST TAB */}
            {activeTab === 'checklist' && (
              <div className="max-w-2xl mx-auto space-y-5">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Clinical Procedure Steps</h3>
                  <p className="text-xs text-slate-500">Check off procedural milestones during patient care.</p>
                </div>

                <div className="space-y-2.5">
                  {defaultChecklist.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => toggleChecklistItem(activeBooking.id, item.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        item.done 
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' 
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white dark:bg-slate-900'
                        }`}>
                          {item.done && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>

                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {item.done ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('notes')}
                  className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl text-xs cursor-pointer hover:opacity-90"
                >
                  Proceed to Clinical EHR Notes →
                </button>
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="max-w-2xl mx-auto space-y-5">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Nursing Clinical EHR Summary</h3>
                  <p className="text-xs text-slate-500">Add detailed observation notes for attending doctors & hospital records.</p>
                </div>

                <textarea 
                  rows={5}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter clinical observations, suture status, dressing change notes, and post-procedure advice..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-rose-500 dark:text-white font-medium text-xs resize-none"
                />
                
                <button 
                  onClick={handleCompleteVisit}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs cursor-pointer hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign & Complete In-Home Visit</span>
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

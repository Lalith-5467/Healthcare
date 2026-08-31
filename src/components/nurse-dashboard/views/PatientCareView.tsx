import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Car, 
  Stethoscope, 
  Activity, 
  Pill, 
  ClipboardList, 
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNurseWorkflow, type CareRequest, type BookingStatus } from '../../../utils/nurseWorkflowStorage';

export const PatientCareView: React.FC = () => {
  const { bookings, updateBookingStatus, updateBookingData, addNotification } = useNurseWorkflow();
  const [activeTab, setActiveTab] = useState<'tracking' | 'vitals' | 'medication' | 'notes'>('tracking');
  const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', temp: '', spo2: '', bs: '' });
  const [notes, setNotes] = useState('');

  // Find the first active booking that isn't completed or pending (so Accepted -> Care in Progress)
  const activeBooking = bookings.find(b => 
    b.status !== 'Pending' && 
    b.status !== 'Rejected' && 
    b.status !== 'Completed'
  );

  if (!activeBooking) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Active Patient</h3>
        <p className="text-slate-500 dark:text-slate-400">Accept a care request from the Care Requests tab to begin.</p>
      </div>
    );
  }

  const handleStatusAdvance = () => {
    let nextStatus: BookingStatus = 'Pending';
    let notif = '';
    
    switch(activeBooking.status) {
      case 'Accepted':
      case 'Scheduled':
        nextStatus = 'On the Way';
        notif = 'Your nurse is on the way.';
        break;
      case 'On the Way':
        nextStatus = 'Arrived';
        notif = 'Your nurse has arrived.';
        break;
      case 'Arrived':
        nextStatus = 'Care in Progress';
        notif = 'Your nursing visit has started.';
        break;
      case 'Care in Progress':
        nextStatus = 'Completed';
        notif = 'Your nursing visit has been completed.';
        break;
    }
    
    if (nextStatus !== 'Pending') {
      updateBookingStatus(activeBooking.id, nextStatus);
      // We would ideally notify the patient here, but since it's shared storage, 
      // the patient dashboard will just see the status change.
      // We can simulate an outbound notification to the system:
      addNotification(`Status updated to: ${nextStatus}`, 'success');
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingData(activeBooking.id, { vitals: vitalsForm });
    addNotification('Vitals saved successfully.', 'success');
    setActiveTab('notes');
  };

  const handleCompleteVisit = () => {
    updateBookingData(activeBooking.id, { notes });
    updateBookingStatus(activeBooking.id, 'Completed');
    addNotification('Visit marked as completed and report submitted.', 'success');
  };

  const getButtonConfig = () => {
    switch(activeBooking.status) {
      case 'Accepted':
      case 'Scheduled':
        return { label: 'Start Travel', icon: Car, color: 'bg-blue-500 hover:bg-blue-400', shadow: 'shadow-blue-500/20' };
      case 'On the Way':
        return { label: 'Mark Arrived', icon: MapPin, color: 'bg-amber-500 hover:bg-amber-400', shadow: 'shadow-amber-500/20' };
      case 'Arrived':
        return { label: 'Start Care', icon: Activity, color: 'bg-rose-500 hover:bg-rose-400', shadow: 'shadow-rose-500/20' };
      case 'Care in Progress':
        return null; // Will show complete visit inside tabs
      default:
        return null;
    }
  };
  
  const btnConfig = getButtonConfig();

  return (
    <div className="space-y-6 pb-16">
      {/* Patient Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-500 border-2 border-white dark:border-slate-900 shadow-md">
              {activeBooking.patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md">
                  {activeBooking.status}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{activeBooking.patientName}</h1>
              <p className="text-sm font-medium text-slate-500">{activeBooking.patientAge} • {activeBooking.serviceType}</p>
            </div>
          </div>
          
          {btnConfig && (
            <button 
              onClick={handleStatusAdvance}
              className={`px-6 py-3.5 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2 ${btnConfig.color} ${btnConfig.shadow}`}
            >
              {btnConfig.label} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'tracking', label: 'Tracking', icon: MapPin },
          { id: 'vitals', label: 'Vitals', icon: Activity },
          { id: 'medication', label: 'Medication', icon: Pill },
          { id: 'notes', label: 'Nursing Notes', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
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
              <div className="max-w-2xl mx-auto py-8">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 text-center">Visit Timeline</h3>
                <div className="relative pl-8 space-y-8">
                  <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                  
                  {[
                    { label: 'Booking Accepted', status: ['Accepted', 'Scheduled', 'On the Way', 'Arrived', 'Care in Progress'] },
                    { label: 'Nurse On the Way', status: ['On the Way', 'Arrived', 'Care in Progress'] },
                    { label: 'Nurse Arrived', status: ['Arrived', 'Care in Progress'] },
                    { label: 'Care in Progress', status: ['Care in Progress'] }
                  ].map((step, idx) => {
                    const isCompleted = step.status.includes(activeBooking.status);
                    return (
                      <div key={idx} className="flex items-center gap-4 relative z-10">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCompleted ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}>
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`text-base font-black ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VITALS TAB */}
            {activeTab === 'vitals' && (
              <form onSubmit={handleSaveVitals} className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Record Vitals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Blood Pressure</label>
                    <input type="text" placeholder="120/80" value={vitalsForm.bp} onChange={e => setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Heart Rate (bpm)</label>
                    <input type="number" placeholder="72" value={vitalsForm.hr} onChange={e => setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Temperature (°F)</label>
                    <input type="text" placeholder="98.6" value={vitalsForm.temp} onChange={e => setVitalsForm({...vitalsForm, temp: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">SpO2 (%)</label>
                    <input type="number" placeholder="98" value={vitalsForm.spo2} onChange={e => setVitalsForm({...vitalsForm, spo2: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-bold" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl transition-colors">
                  Save Vitals
                </button>
              </form>
            )}

            {/* NOTES TAB & COMPLETE */}
            {activeTab === 'notes' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Nursing Notes</h3>
                <textarea 
                  rows={6}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter clinical observations, care provided, and patient status..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:text-white font-medium resize-none"
                ></textarea>
                
                {activeBooking.status === 'Care in Progress' && (
                  <button 
                    onClick={handleCompleteVisit}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Complete Visit & Submit Report
                  </button>
                )}
              </div>
            )}
            
            {/* MEDICATION TAB */}
            {activeTab === 'medication' && (
              <div className="max-w-2xl mx-auto text-center py-12">
                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Medications Prescribed</h3>
                <p className="text-slate-500">The patient does not have any pending medications for this visit.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

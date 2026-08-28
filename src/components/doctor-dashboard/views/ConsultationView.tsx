import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, FileText, Pill, Calendar, CheckCircle2 } from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface ConsultationViewProps {
  patientId: string | null;
}

export const ConsultationView: React.FC<ConsultationViewProps> = ({ patientId }) => {
  const { records, addTimelineEvent, addPrescription } = useDoctorWorkflow();
  const [activeTab, setActiveTab] = useState<'notes' | 'prescription' | 'followup'>('notes');
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptionForm, setPrescriptionForm] = useState({ medicine: '', dose: '', frequency: '' });

  const patient = records.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Stethoscope className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Patient Selected</h2>
        <p className="text-slate-500">Scan a patient QR code first to start a consultation.</p>
      </div>
    );
  }

  const handleSaveConsultation = () => {
    // Add to timeline
    addTimelineEvent(patient.id, {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title: 'Clinical Consultation',
      actor: 'Dr. Rajesh',
      type: 'consultation',
      details: chiefComplaint || 'Routine Checkup'
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (prescriptionForm.medicine) {
      addPrescription(patient.id, {
        medicine: prescriptionForm.medicine,
        dose: prescriptionForm.dose,
        frequency: prescriptionForm.frequency,
        isAntibiotic: false
      });
      setPrescriptionForm({ medicine: '', dose: '', frequency: '' });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-black text-slate-500">
            {patient.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h1>
            <p className="text-sm font-medium text-slate-500">{patient.age} • ID: {patient.patientId}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 font-bold rounded-lg text-sm">
          Active Consultation
        </span>
      </div>

      <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'notes', label: 'Clinical Notes', icon: FileText },
          { id: 'prescription', label: 'Prescription', icon: Pill },
          { id: 'followup', label: 'Follow-up', icon: Calendar },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-cyan-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3 font-bold border border-emerald-100 dark:border-emerald-800/50"
          >
            <CheckCircle2 className="w-5 h-5" /> Saved successfully to patient timeline!
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Chief Complaint</label>
              <input 
                type="text" 
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="e.g. Persistent cough and mild fever"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Clinical Assessment & Notes</label>
              <textarea 
                rows={6}
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
                placeholder="Enter detailed clinical observations..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white font-medium resize-none"
              ></textarea>
            </div>
            <button 
              onClick={handleSaveConsultation}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black rounded-xl transition-all shadow-lg shadow-teal-500/20"
            >
              Save Consultation Notes
            </button>
          </div>
        )}

        {activeTab === 'prescription' && (
          <div className="space-y-8">
            <form onSubmit={handleSavePrescription} className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Add Medication</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Medicine Name</label>
                  <input type="text" placeholder="e.g. Amoxicillin" value={prescriptionForm.medicine} onChange={e => setPrescriptionForm({...prescriptionForm, medicine: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Dose</label>
                  <input type="text" placeholder="e.g. 500mg" value={prescriptionForm.dose} onChange={e => setPrescriptionForm({...prescriptionForm, dose: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Frequency</label>
                  <input type="text" placeholder="e.g. Twice Daily" value={prescriptionForm.frequency} onChange={e => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white font-bold" required />
                </div>
              </div>
              <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black rounded-xl transition-all shadow-lg shadow-teal-500/20">
                Add to Prescription
              </button>
            </form>
          </div>
        )}

        {activeTab === 'followup' && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Schedule Follow-up</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Select a date to schedule the next appointment for this patient.</p>
            <input type="date" className="mt-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-teal-500 dark:text-white font-bold inline-block" />
          </div>
        )}
      </div>
    </div>
  );
};

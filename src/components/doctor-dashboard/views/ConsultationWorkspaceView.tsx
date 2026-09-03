import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, CheckCircle, Clock, Plus, AlertCircle, FileText, Activity, TestTube, Pill, Beaker, Stethoscope, History } from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface ConsultationWorkspaceViewProps {
  patientId: string | null;
  onNavigate: (id: string) => void;
}

export const ConsultationWorkspaceView: React.FC<ConsultationWorkspaceViewProps> = ({ patientId, onNavigate }) => {
  const { records, addTimelineEvent, addPrescription, saveClinicalNotes } = useDoctorWorkflow();
  const patient = records.find(p => p.id === patientId) || records[0];

  // Clinical Form State
  const [complaint, setComplaint] = useState(patient.chiefComplaint || '');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  
  // Prescription Form State
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [rxDuration, setRxDuration] = useState('');
  
  // Temporary added items for UI simulation
  const [addedRx, setAddedRx] = useState<any[]>([]);

  const handleComplete = () => {
    // Save everything and exit
    saveClinicalNotes(patient.id, notes);
    
    // Add timeline event
    addTimelineEvent(patient.id, {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title: 'Clinical Consultation Completed',
      actor: 'Dr. Rajesh',
      type: 'consultation',
      details: complaint || 'Routine Checkup'
    });

    // Add prescriptions
    addedRx.forEach(rx => {
      addPrescription(patient.id, {
        medicine: rx.medicine,
        dose: rx.dose,
        frequency: rx.frequency,
        isAntibiotic: false
      });
    });

    onNavigate('appointments');
  };

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxMedicine && rxDose) {
      setAddedRx([...addedRx, { medicine: rxMedicine, dose: rxDose, frequency: rxFreq, duration: rxDuration }]);
      setRxMedicine(''); setRxDose(''); setRxFreq(''); setRxDuration('');
    }
  };

  if (!patient) return null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col font-sans bg-slate-100 dark:bg-[#070c18] overflow-hidden absolute inset-0 top-16 z-40">
      
      {/* Header Bar */}
      <header className="h-14 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('appointments')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Cancel & Exit
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Active Encounter Workspace</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <Clock className="w-4 h-4" /> 
          <span>Duration: 04:22</span>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Context (25%) */}
        <div className="w-1/4 min-w-[280px] bg-slate-50 dark:bg-[#0b1120]/50 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-sm">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">{patient.name}</h2>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {patient.patientId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</p>
              <p className="font-black text-slate-700 dark:text-slate-200 mt-0.5">{patient.age} / {patient.gender.charAt(0)}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Blood</p>
              <p className="font-black text-rose-500 mt-0.5">{patient.bloodGroup}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Clinical Alerts</h3>
            {patient.allergies.map((a, i) => (
              <div key={i} className="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400">
                Allergy: {a}
              </div>
            ))}
            <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400">
              Chronic: {patient.diagnosis[0]}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Recent History</h3>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">Last Visit</span>
                <span className="text-teal-600 dark:text-teal-400">2 Weeks ago</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">Follow-up on respiratory infection. Prescribed Azithromycin.</p>
            </div>
          </div>

        </div>

        {/* Center Panel: Clinical Notes (50%) */}
        <div className="flex-1 bg-white dark:bg-[#070c18] overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border border-teal-100 dark:border-teal-800/50">
                  <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Clinical Assessment</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Chief Complaint & Symptoms</label>
                  <input 
                    type="text" 
                    value={complaint}
                    onChange={e => setComplaint(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Objective / Observations</label>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Patient appears well nourished, no acute distress. Chest clear..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors resize-none custom-scrollbar"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Diagnosis & Plan</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Primary Diagnosis (ICD-10)</label>
                  <input 
                    type="text" 
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis (J20.9)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Treatment Plan</label>
                  <textarea 
                    rows={4}
                    value={treatment}
                    onChange={e => setTreatment(e.target.value)}
                    placeholder="Rest, hydration, start antibiotics course..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors resize-none custom-scrollbar"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel: Orders (25%) */}
        <div className="w-[30%] min-w-[320px] bg-slate-50 dark:bg-[#0b1120]/50 border-l border-slate-200 dark:border-slate-800 overflow-y-auto p-5 custom-scrollbar">
          
          <div className="space-y-6">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-500" /> Rx Form
              </h3>
            </div>

            <form onSubmit={handleAddRx} className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Medicine</label>
                <input type="text" value={rxMedicine} onChange={e => setRxMedicine(e.target.value)} placeholder="e.g. Paracetamol" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Dose</label>
                  <input type="text" value={rxDose} onChange={e => setRxDose(e.target.value)} placeholder="500mg" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Freq</label>
                  <input type="text" value={rxFreq} onChange={e => setRxFreq(e.target.value)} placeholder="1-1-1" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500" required />
                </div>
              </div>
              <button type="submit" className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-black transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Drug
              </button>
            </form>

            <div className="space-y-2">
              {addedRx.map((rx, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-teal-900/30 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{rx.medicine}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rx.dose} • {rx.frequency}</p>
                  </div>
                  <button onClick={() => setAddedRx(addedRx.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs">Remove</button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800 pt-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Beaker className="w-4 h-4 text-blue-500" /> Lab Orders
              </h3>
            </div>
            
            <button className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Order Diagnostic Tests
            </button>

          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="h-16 bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none z-10">
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Auto-saved a few seconds ago</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
            Save as Draft
          </button>
          <button 
            onClick={handleComplete}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Sign & Complete
          </button>
        </div>
      </div>

    </div>
  );
};

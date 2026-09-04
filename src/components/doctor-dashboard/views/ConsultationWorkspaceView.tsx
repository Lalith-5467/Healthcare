import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, CheckCircle, Clock, Plus, AlertCircle, FileText, Activity, Pill, Beaker, Stethoscope, History } from 'lucide-react';

interface ConsultationWorkspaceViewProps {
  patientId: string | null; // This is actually appointmentId
  onNavigate: (id: string) => void;
}

export const ConsultationWorkspaceView: React.FC<ConsultationWorkspaceViewProps> = ({ patientId: appointmentId, onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Clinical Form State
  const [complaint, setComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [followUp, setFollowUp] = useState('');
  
  // Prescription Form State
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [rxDuration, setRxDuration] = useState('');
  
  // Added items
  const [addedRx, setAddedRx] = useState<any[]>([]);

  // Auto-save state
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!appointmentId) return;
      try {
        let response = await fetch(`http://localhost:5000/api/consultations/${appointmentId}`);
        let result = await response.json();
        
        if (result.success) {
          // Auto-start if not exists
          if (!result.data.consultation) {
            const startResp = await fetch(`http://localhost:5000/api/consultations/${appointmentId}/start`, { method: 'POST' });
            const startResult = await startResp.json();
            if (startResult.success) {
              result.data.consultation = startResult.data;
            }
          }
          
          setData(result.data);
          const cons = result.data.consultation;
          if (cons) {
            setComplaint(cons.chiefComplaint || '');
            setSymptoms(cons.symptoms || '');
            setNotes(cons.clinicalNotes || '');
            setDiagnosis(cons.diagnosis || '');
            setTreatment(cons.treatmentPlan || '');
            setFollowUp(cons.followUpInstructions || '');
          }
        }
      } catch (error) {
        console.error("Failed to fetch workspace data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [appointmentId]);

  const handleSaveDraft = async () => {
    if (!data?.consultation?.id) return;
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/consultations/${data.consultation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint: complaint,
          symptoms,
          clinicalNotes: notes,
          diagnosis,
          treatmentPlan: treatment,
          followUpInstructions: followUp
        })
      });
      const result = await response.json();
      if (result.success) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!data?.consultation?.id) return;
    try {
      // First save draft to ensure latest data is there
      await handleSaveDraft();
      
      const response = await fetch(`http://localhost:5000/api/consultations/${data.consultation.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicines: addedRx.map(rx => ({
            name: rx.medicine,
            dosage: rx.dose,
            frequency: rx.frequency,
            durationDays: rx.duration
          }))
        })
      });
      const result = await response.json();
      if (result.success) {
        onNavigate('appointments');
      } else {
        alert(result.message || 'Failed to complete consultation');
      }
    } catch (error) {
      console.error("Error completing consultation:", error);
      alert('Error completing consultation');
    }
  };

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxMedicine && rxDose) {
      setAddedRx([...addedRx, { medicine: rxMedicine, dose: rxDose, frequency: rxFreq, duration: rxDuration }]);
      setRxMedicine(''); setRxDose(''); setRxFreq(''); setRxDuration('');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-bold text-slate-500">Loading workspace...</p>
      </div>
    );
  }

  if (!data || !data.appointment) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Workspace Not Available</h2>
        <button onClick={() => onNavigate('appointments')} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl">Back</button>
      </div>
    );
  }

  const { appointment } = data;
  const patient = appointment.patient;

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
          <span>In Progress</span>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Context (25%) */}
        <div className="w-1/4 min-w-[280px] bg-slate-50 dark:bg-[#0b1120]/50 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-sm uppercase">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">{patient.fullName}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Blood</p>
              <p className="font-black text-rose-500 mt-0.5">{patient.bloodGroup || 'Unknown'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Gender</p>
              <p className="font-black text-slate-700 dark:text-slate-200 mt-0.5">{patient.gender}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Recent Records</h3>
            {patient.medicalRecords?.length > 0 ? (
              patient.medicalRecords.slice(0, 2).map((rec: any) => (
                <div key={rec.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">{new Date(rec.recordDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">{rec.title}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No recent history.</p>
            )}
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
                    onBlur={handleSaveDraft}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Objective / Observations</label>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    onBlur={handleSaveDraft}
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
                    onBlur={handleSaveDraft}
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
                    onBlur={handleSaveDraft}
                    placeholder="Rest, hydration, start antibiotics course..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors resize-none custom-scrollbar"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Follow-up Instructions</label>
                  <input 
                    type="text" 
                    value={followUp}
                    onChange={e => setFollowUp(e.target.value)}
                    onBlur={handleSaveDraft}
                    placeholder="e.g. Visit again after 5 days"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
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
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Days</label>
                  <input type="text" value={rxDuration} onChange={e => setRxDuration(e.target.value)} placeholder="5" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500" required />
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
                    <p className="text-[10px] text-slate-500 mt-0.5">{rx.dose} • {rx.frequency} • {rx.duration} days</p>
                  </div>
                  <button onClick={() => setAddedRx(addedRx.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs font-bold">Remove</button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="h-16 bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none z-10">
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          {saving ? (
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div> Saving...</span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
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

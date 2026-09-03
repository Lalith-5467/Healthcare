import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Pill, 
  Sparkles, 
  UserCheck, 
  Clock, 
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

export const ClinicalNotesPrescriptionsView: React.FC = () => {
  const { records, addPrescription, saveClinicalNotes } = useDoctorWorkflow();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(records[0]?.id || '1');

  const selectedPatient = records.find(p => p.id === selectedPatientId) || records[0];

  // Prescription Form State
  const [newMedName, setNewMedName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newFrequency, setNewFrequency] = useState('Twice daily after food');
  const [newInstructions, setNewInstructions] = useState('');
  const [notesText, setNotesText] = useState(selectedPatient?.clinicalNotes || '');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newDose) return;

    addPrescription(selectedPatient.id, {
      medicine: newMedName,
      dose: newDose,
      frequency: newFrequency,
      instructions: newInstructions,
      isAntibiotic: newMedName.toLowerCase().includes('cillin') || newMedName.toLowerCase().includes('biotic')
    });

    setNewMedName('');
    setNewDose('');
    setNewInstructions('');
    setToastMsg(`E-Prescription for ${newMedName} generated and synced with Pharmacy!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveNotes = () => {
    saveClinicalNotes(selectedPatient.id, notesText);
    setToastMsg('Clinical EHR Encounter notes saved to ABDM Health Vault.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* TOAST FEEDBACK */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Pill className="w-3.5 h-3.5" /> E-Prescriptions & Clinical Notes
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Prescription Writer & Clinical Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Issue tamper-proof digitally signed prescriptions directly linked to Apollo dispensary & patient app.
          </p>
        </div>

        {/* PATIENT SELECTOR DROPDOWN */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs">
          <span className="text-slate-400 uppercase text-[10px]">Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              const p = records.find(r => r.id === e.target.value);
              if (p) setNotesText(p.clinicalNotes || '');
            }}
            className="bg-transparent font-black text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {records.map(p => (
              <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {p.name} ({p.age})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: E-PRESCRIPTION GENERATOR */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" /> New Medication Prescription
            </h3>

            <form onSubmit={handleAddMed} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Medicine Name & Formulation</label>
                  <input
                    type="text"
                    placeholder="e.g. Azithromycin 500mg"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Dosage Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Tablet"
                    value={newDose}
                    onChange={(e) => setNewDose(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Frequency & Timing</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  >
                    <option value="Once daily in the morning">Once daily in the morning</option>
                    <option value="Once daily at bedtime">Once daily at bedtime</option>
                    <option value="Twice daily after food">Twice daily after food</option>
                    <option value="Three times daily after meals">Three times daily after meals</option>
                    <option value="As needed for severe pain/fever">As needed for severe pain/fever</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Special Clinical Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Complete 5 days course"
                    value={newInstructions}
                    onChange={(e) => setNewInstructions(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-500 hover:to-teal-600 text-white font-black rounded-2xl transition-all shadow-md shadow-teal-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Pill className="w-4 h-4" />
                <span>Issue & Sign E-Prescription</span>
              </button>
            </form>
          </div>

          {/* ACTIVE MEDICATIONS LIST */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Current Active Prescriptions for {selectedPatient?.name} ({selectedPatient?.medications.length})
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {selectedPatient?.medications.map(m => (
                <div key={m.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white">{m.medicine}</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {m.dose}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{m.frequency} {m.instructions && `• ${m.instructions}`}</p>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                    Adherence: {m.adherencePercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: CLINICAL NOTES / ENCOUNTER SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Clinical Encounter Notes
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Dr. Rajesh Varma, MD</span>
            </div>

            <textarea
              rows={8}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Record subjective history, objective clinical exam findings, differential diagnosis, and patient care recommendations..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium dark:text-white leading-relaxed focus:outline-none focus:border-teal-500"
            />

            <button
              onClick={handleSaveNotes}
              className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl transition-all shadow-sm hover:scale-102 cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Save & Publish to ABDM Health Record</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

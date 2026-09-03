import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, FileText, Pill, Activity, Syringe, ClipboardList, AlertCircle, Video, Stethoscope, Beaker } from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface ConsultationDetailsViewProps {
  patientId: string | null;
  onNavigate: (id: string) => void;
}

export const ConsultationDetailsView: React.FC<ConsultationDetailsViewProps> = ({ patientId, onNavigate }) => {
  const { records } = useDoctorWorkflow();
  const patient = records.find(p => p.id === patientId) || records[0];

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Patient Selected</h2>
        <p className="text-slate-500">Please return to the schedule and select an appointment.</p>
        <button 
          onClick={() => onNavigate('appointments')}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 font-sans select-none">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => onNavigate('appointments')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Schedule
        </button>
        <button 
          onClick={() => onNavigate('consultation-workspace')}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Stethoscope className="w-4 h-4" /> Begin Consultation
        </button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-500 shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h1>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                ID: {patient.patientId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <span>{patient.age}</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className="text-rose-500">Blood: {patient.bloodGroup}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 w-full md:w-auto">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Appointment Context</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Calendar className="w-4 h-4 text-teal-500" />
              {patient.appointmentTime || 'Today'}
            </div>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Video className="w-4 h-4 text-blue-500" />
              Tele-Consultation
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Clinical Context */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ClipboardList className="w-4 h-4 text-teal-500" /> Encounter Overview
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Chief Complaint</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                  {patient.chiefComplaint}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Known Diagnoses</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.diagnosis.map((d, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-bold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((a, i) => (
                      <span key={i} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded text-xs font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-teal-500" /> Doctor's Clinical Notes
            </h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {patient.clinicalNotes || 'No previous clinical notes available.'}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Beaker className="w-4 h-4 text-teal-500" /> Recent Lab Reports
            </h2>
            <div className="space-y-3">
              {patient.labReports.slice(0,3).map((lab, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{lab.testName}</p>
                    <p className="text-xs text-slate-500">{lab.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{lab.value}</p>
                    <p className="text-[10px] text-slate-400">Ref: {lab.normalRange}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Medications & Vitals */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Pill className="w-4 h-4 text-teal-500" /> Current Medications
            </h2>
            <div className="space-y-3">
              {patient.medications.length === 0 && (
                <p className="text-sm text-slate-500">No active medications.</p>
              )}
              {patient.medications.map(med => (
                <div key={med.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{med.medicine}</h3>
                    {med.isAntibiotic && (
                      <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded text-[9px] font-black uppercase">ABX</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{med.dose} • {med.frequency}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-teal-500" /> Recent Vitals
            </h2>
            <div className="space-y-3">
              {patient.vitalsHistory.slice(0, 2).map((vital, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                  <div className="col-span-2 flex justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">{vital.date}</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">BP</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{vital.bp}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">SpO2</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{vital.spo2}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">HR</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{vital.hr} bpm</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Temp</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{vital.temp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

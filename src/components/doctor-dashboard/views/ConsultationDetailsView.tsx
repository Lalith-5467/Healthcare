import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, FileText, Pill, Activity, Syringe, ClipboardList, AlertCircle, Video, Stethoscope, Beaker, MapPin } from 'lucide-react';

interface ConsultationDetailsViewProps {
  patientId: string | null; // Note: This is actually passed as appointmentId from the schedule view
  onNavigate: (id: string) => void;
}

export const ConsultationDetailsView: React.FC<ConsultationDetailsViewProps> = ({ patientId: appointmentId, onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!appointmentId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/consultations/${appointmentId}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch consultation details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [appointmentId]);

  const handleStartConsultation = async () => {
    if (!appointmentId) return;
    setStarting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/consultations/${appointmentId}/start`, {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        onNavigate('consultation-workspace');
      } else {
        alert(result.message || 'Failed to start consultation');
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
      alert('Error starting consultation');
    } finally {
      setStarting(false);
    }
  };

  if (!appointmentId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Appointment Selected</h2>
        <p className="text-slate-500">Please return to the schedule and select an appointment.</p>
        <button 
          onClick={() => onNavigate('appointments')}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 cursor-pointer"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-bold text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (!data || !data.appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Appointment Not Found</h2>
        <button 
          onClick={() => onNavigate('appointments')}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 cursor-pointer"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  const { appointment } = data;
  const patient = appointment.patient;
  const vitals = patient.vitals?.[0] || null;
  const records = patient.medicalRecords || [];
  const prescriptions = patient.prescriptions || [];

  const getAge = (dob: string) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

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
          onClick={handleStartConsultation}
          disabled={starting || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
          className={`px-6 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all flex items-center gap-2 ${
            appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-teal-500/20 cursor-pointer'
          }`}
        >
          {starting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Stethoscope className="w-4 h-4" /> 
          )}
          {appointment.status === 'COMPLETED' ? 'Consultation Completed' : 'Begin Consultation'}
        </button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-500 shrink-0 uppercase">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{patient.fullName}</h1>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <span>{getAge(patient.dateOfBirth)} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className="text-rose-500">Blood: {patient.bloodGroup || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 w-full md:w-auto">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Appointment Context</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Calendar className="w-4 h-4 text-teal-500" />
              {new Date(appointment.appointmentDate).toLocaleDateString()} {appointment.slotTime}
            </div>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              {appointment.type === 'VIDEO' ? <Video className="w-4 h-4 text-blue-500" /> : <MapPin className="w-4 h-4 text-teal-500" />}
              {appointment.type === 'VIDEO' ? 'Tele-Consultation' : 'In-Person'}
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
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Reason for Visit</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                  {appointment.reason || 'No specific reason provided.'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-teal-500" /> Previous Medical Records
            </h2>
            <div className="space-y-3">
              {records.length === 0 && <p className="text-sm text-slate-500">No previous records.</p>}
              {records.map((rec: any) => (
                <div key={rec.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(rec.recordDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{rec.notes}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Medications & Vitals */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Pill className="w-4 h-4 text-teal-500" /> Recent Prescriptions
            </h2>
            <div className="space-y-3">
              {prescriptions.length === 0 && (
                <p className="text-sm text-slate-500">No recent prescriptions.</p>
              )}
              {prescriptions.map((presc: any) => (
                <div key={presc.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="mb-2">
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(presc.createdAt).toLocaleDateString()}</span>
                  </div>
                  {presc.items.map((item: any) => (
                    <div key={item.id} className="mb-2 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.medicineName}</h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.dosage} • {item.frequency} for {item.durationDays} days</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-teal-500" /> Latest Vitals
            </h2>
            {vitals ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <div className="col-span-2 flex justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">{new Date(vitals.recordedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500">BP</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{vitals.systolicBp}/{vitals.diastolicBp}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500">SpO2</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{vitals.oxygenSaturation}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500">HR</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{vitals.heartRate} bpm</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500">Temp</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{vitals.temperature}°F</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No vitals recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

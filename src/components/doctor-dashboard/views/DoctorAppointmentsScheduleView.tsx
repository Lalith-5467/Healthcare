import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  Video, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  CalendarCheck,
  CalendarX,
  Stethoscope
} from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface DoctorAppointmentsScheduleViewProps {
  onStartConsultation: (patientId: string) => void;
}

export const DoctorAppointmentsScheduleView: React.FC<DoctorAppointmentsScheduleViewProps> = ({ onStartConsultation }) => {
  const { records } = useDoctorWorkflow();
  const [filter, setFilter] = useState<'All' | 'Today' | 'Telemedicine' | 'OPD'>('All');

  const slots = [
    {
      id: 'apt-1',
      patientId: '1',
      patientName: 'Abinesh Kumar',
      time: '10:30 AM',
      date: 'Today',
      type: 'OPD In-Clinic',
      status: 'Confirmed',
      reason: 'Post-Appendectomy Suture Review',
      isTele: false
    },
    {
      id: 'apt-2',
      patientId: '2',
      patientName: 'Ragul Kumar',
      time: '11:45 AM',
      date: 'Today',
      type: 'Tele-Consultation',
      status: 'Ready in Waiting Room',
      reason: 'Hypertension Medication Check',
      isTele: true
    },
    {
      id: 'apt-3',
      patientId: '3',
      patientName: 'Mrs. Meenakshi Sundaram',
      time: '03:00 PM',
      date: 'Today',
      type: 'Tele-Consultation',
      status: 'Confirmed',
      reason: 'Diabetes Vitals & Routine Adherence',
      isTele: true
    },
    {
      id: 'apt-4',
      patientId: '1',
      patientName: 'Suresh Menon',
      time: '04:30 PM',
      date: 'Today',
      type: 'OPD In-Clinic',
      status: 'Confirmed',
      reason: 'General Executive Health Checkup',
      isTele: false
    }
  ];

  const filtered = slots.filter(s => {
    if (filter === 'Today') return s.date === 'Today';
    if (filter === 'Telemedicine') return s.isTele;
    if (filter === 'OPD') return !s.isTele;
    return true;
  });

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" /> OPD & Tele-Health Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Today's Doctor Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Confirmed clinical appointments, patient queue management, and 1-click video call start.
          </p>
        </div>

        {/* FILTER PILLS */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
          {(['All', 'Today', 'Telemedicine', 'OPD'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filter === tab 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* APPOINTMENTS CARDS */}
      <div className="space-y-3">
        {filtered.map((apt, i) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-500/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                apt.isTele 
                  ? 'bg-blue-500/15 text-blue-600 dark:text-cyan-400' 
                  : 'bg-teal-500/15 text-teal-600 dark:text-cyan-400'
              }`}>
                {apt.isTele ? <Video className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{apt.patientName}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                    apt.status.includes('Waiting') 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{apt.reason}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                  <span>Slot: {apt.time}</span>
                  <span>•</span>
                  <span>{apt.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => onStartConsultation(apt.patientId)}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                  apt.isTele
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/20'
                    : 'bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-500 hover:to-teal-600 text-white shadow-teal-500/20'
                }`}
              >
                {apt.isTele ? <Video className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
                <span>{apt.isTele ? 'Start Video Consultation' : 'Begin OPD Consultation'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

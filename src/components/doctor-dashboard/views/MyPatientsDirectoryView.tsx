import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Phone, 
  UserCheck, 
  Stethoscope, 
  Activity,
  FileText
} from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface MyPatientsDirectoryViewProps {
  onSelectPatient: (patientId: string) => void;
}

export const MyPatientsDirectoryView: React.FC<MyPatientsDirectoryViewProps> = ({ onSelectPatient }) => {
  const { records } = useDoctorWorkflow();

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" /> Clinical Patient Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Assigned Clinical Patients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Verified patient cases, upcoming OPD slots, and active telemedicine consultations.
          </p>
        </div>

        <div className="px-4 py-2 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-cyan-300 font-black text-xs rounded-2xl flex items-center gap-2 self-start sm:self-auto shadow-xs">
          <UserCheck className="w-4 h-4 text-[#00a896]" />
          <span>{records.length} Active Consultations</span>
        </div>
      </div>

      {/* PATIENT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {records.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl space-y-4 hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => onSelectPatient(p.id)}
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent dark:from-teal-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">ID: {p.patientId}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-cyan-300 font-mono">
                      Blood: {p.bloodGroup}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors mt-0.5">
                    {p.name} ({p.age})
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{p.gender}</p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <span className="text-[11px] font-black text-teal-700 dark:text-cyan-400 font-mono px-3 py-1 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-100 dark:border-teal-800/50 shadow-sm">
                  {p.appointmentTime}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-800/50">
                  Waiting Area
                </span>
              </div>
            </div>

            {/* Quick Vitals Summary (Added for better clinical context) */}
            <div className="flex items-center gap-5 py-3 border-y border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">BP: 120/80</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">HR: 72 bpm</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 text-xs space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Chief Complaint</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{p.chiefComplaint}</p>
              </div>
              <div className="pt-1.5 flex flex-wrap gap-1.5">
                {p.diagnosis.map((d, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold text-[10px] border border-slate-200/80 dark:border-slate-600 shadow-sm">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                {p.medications.length} Rx • {p.labReports.length} Labs
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPatient(p.id);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 font-black text-xs rounded-xl shadow-[0_4px_15px_rgba(20,184,166,0.3)] dark:shadow-teal-500/20 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer relative z-10"
              >
                <span>Patient 360°</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

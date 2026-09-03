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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-all cursor-pointer group"
            onClick={() => onSelectPatient(p.id)}
          >
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

              <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">{p.appointmentTime}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Chief Complaint</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{p.chiefComplaint}</p>
              </div>
              <div className="pt-1 flex flex-wrap gap-1.5">
                {p.diagnosis.map((d, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] border border-slate-200 dark:border-slate-600">
                    • {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">
                {p.medications.length} Active Rx • {p.labReports.length} Lab Reports
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPatient(p.id);
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Patient 360°</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {records.map((p, i) => {
          // Determine mock status based on index for demo purposes
          const status = i === 0 ? 'In Consultation' : i === 1 ? 'Delayed' : i === 2 ? 'Completed' : 'Waiting';
          const statusColors = {
            'Waiting': 'text-teal-700 bg-teal-50 border-teal-200 dark:text-cyan-400 dark:bg-cyan-950/30 dark:border-cyan-800/50',
            'In Consultation': 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-800/50',
            'Completed': 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/50',
            'Delayed': 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-800/50'
          }[status];
          const statusDot = {
            'Waiting': 'bg-teal-500',
            'In Consultation': 'bg-blue-500 animate-pulse',
            'Completed': 'bg-emerald-500',
            'Delayed': 'bg-orange-500'
          }[status];

          return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#0b1120] rounded-[24px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 hover:border-teal-500/30 transition-all cursor-pointer group"
            onClick={() => onSelectPatient(p.id)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black text-xl border border-slate-200 dark:border-slate-700 shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50">
                      ID: {p.patientId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{p.age}y</span>
                    <span>•</span>
                    <span>{p.gender}</span>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">Blood: {p.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  {p.appointmentTime}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border flex items-center gap-1.5 ${statusColors}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                  {status}
                </span>
              </div>
            </div>

            {/* Quick Vitals Summary */}
            <div className="flex items-center gap-5 py-3 border-y border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 -mx-6 px-6">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">BP:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">120/80</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">HR:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">72 bpm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Chief Complaint</span>
                <p className="font-bold text-slate-900 dark:text-white leading-relaxed">{p.chiefComplaint}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Diagnostic Context</span>
                <div className="flex flex-wrap gap-1.5">
                  {p.diagnosis.map((d, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-200 dark:border-slate-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase flex items-center gap-2">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {p.medications.length} Rx</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {p.labReports.length} Labs</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPatient(p.id);
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-lg transition-transform flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <span>Patient 360°</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )})}
      </div>

    </div>
  );
};

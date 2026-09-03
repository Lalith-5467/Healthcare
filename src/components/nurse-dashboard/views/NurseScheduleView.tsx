import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Stethoscope, ChevronRight, CheckCircle2, Phone, Navigation } from 'lucide-react';
import { useNurseWorkflow } from '../../../utils/nurseWorkflowStorage';

interface NurseScheduleViewProps {
  onNavigate?: (navId: string) => void;
}

export const NurseScheduleView: React.FC<NurseScheduleViewProps> = ({ onNavigate }) => {
  const { bookings } = useNurseWorkflow();

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" /> Shift Schedule & GPS Route
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Today’s Nursing Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Optimized route plan and appointment milestones for your current shift.
          </p>
        </div>

        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 font-black text-xs rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <Clock className="w-4 h-4" />
          <span>Shift: 08:00 AM – 06:00 PM</span>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {bookings.map((booking, i) => {
            const isDone = booking.status === 'Completed';
            const isActive = booking.status === 'Accepted' || booking.status === 'On the Way' || booking.status === 'Arrived' || booking.status === 'Care in Progress';

            return (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${
                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isActive ? 'bg-rose-500 border-rose-500 text-white animate-pulse' : 'bg-slate-200 border-slate-300 text-slate-500'
                }`}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-blue-600 dark:text-cyan-400">
                        {booking.time}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isDone ? 'bg-emerald-100 text-emerald-700' : isActive ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {booking.patientName} ({booking.patientAge})
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-rose-500" />
                      {booking.serviceType}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {booking.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {booking.patientPhone && (
                      <a 
                        href={`tel:${booking.patientPhone}`}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                        title="Call Patient"
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                      </a>
                    )}
                    {onNavigate && isActive && (
                      <button
                        onClick={() => onNavigate('patients')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-sm transition-all"
                      >
                        Start Visit →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

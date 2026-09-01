import React from 'react';
import { X, Calendar, Clock, Video, Building2, User, Bell, RefreshCw, Trash2, CheckCircle2, MapPin, FileText } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface AppointmentDetailsDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (apt: Appointment) => void;
  onReschedule: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  onAddReminder: (apt: Appointment) => void;
}

export const AppointmentDetailsDrawer: React.FC<AppointmentDetailsDrawerProps> = ({
  appointment,
  isOpen,
  onClose,
  onJoin,
  onReschedule,
  onCancel,
  onAddReminder,
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400 font-mono">
              ID: {appointment.id}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Appointment Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs">
          {/* DOCTOR CARD */}
          <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl">
            <img
              src={appointment.doctorPhoto}
              alt={appointment.doctorName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shrink-0"
            />
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{appointment.doctorName}</h4>
              <p className="text-xs font-bold text-[#00a896] dark:text-cyan-300">{appointment.speciality}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="truncate">{appointment.hospital}</span>
              </div>
            </div>
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Date</span>
                <strong className="text-slate-800 dark:text-slate-200">{appointment.date}</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Time</span>
                <strong className="text-slate-800 dark:text-slate-200">{appointment.time}</strong>
              </div>
            </div>
          </div>

          {/* TYPE & STATUS */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {appointment.type === 'Video' ? (
                <Video className="w-4 h-4 text-teal-600" />
              ) : (
                <Building2 className="w-4 h-4 text-blue-600" />
              )}
              <span className="font-bold text-slate-800 dark:text-slate-200">{appointment.type} Consultation</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono">
              {appointment.status}
            </span>
          </div>

          {/* DOCTOR CLINICAL NOTES (IF ANY) */}
          {appointment.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Doctor Notes</h4>
              <p className="text-xs text-slate-700 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 p-3.5 rounded-2xl leading-relaxed">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
            {appointment.type === 'Video' && (
              <button
                onClick={() => {
                  onClose();
                  onJoin(appointment);
                }}
                className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Join Video Consultation</span>
              </button>
            )}

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onAddReminder(appointment);
                }}
                className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Reminder</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onReschedule(appointment);
                }}
                className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00a896]" />
                <span>Reschedule</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCancel(appointment);
                }}
                className="py-2.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              ID: {appointment.id}
            </span>
            <h3 className="text-lg font-extrabold text-white">Appointment Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto">
          {/* DOCTOR CARD */}
          <div className="flex items-center gap-4 bg-slate-800/60 border border-slate-700/60 p-4 rounded-3xl">
            <img
              src={appointment.doctorPhoto}
              alt={appointment.doctorName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shrink-0"
            />
            <div>
              <h4 className="text-base font-extrabold text-white">{appointment.doctorName}</h4>
              <p className="text-xs font-bold text-[#00a896]">{appointment.speciality}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{appointment.hospital}</span>
              </div>
            </div>
          </div>

          {/* DATE & TIME BANNER */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                <p className="text-xs font-bold text-white">{appointment.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Time Slot</span>
                <p className="text-xs font-bold text-white">{appointment.time}</p>
              </div>
            </div>
          </div>

          {/* APPOINTMENT SPECIFICS */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Consultation Type:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                {appointment.type === 'Video' ? (
                  <Video className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Building2 className="w-4 h-4 text-purple-400" />
                )}
                {appointment.type} Consultation
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2.5">
              <span className="text-slate-400">Status:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                appointment.status === 'Completed'
                  ? 'bg-slate-800 text-slate-300'
                  : appointment.status === 'Cancelled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {appointment.status}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2.5">
              <span className="text-slate-400">Consultation Fee:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">₹{appointment.fee}</span>
            </div>

            {appointment.reminderOffset && (
              <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2.5">
                <span className="text-slate-400">Reminder Set:</span>
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  {appointment.reminderOffset}
                </span>
              </div>
            )}
          </div>

          {/* REASON FOR VISIT */}
          {appointment.reason && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reason for Visit</h4>
              <p className="text-xs text-slate-300 bg-slate-800/40 border border-slate-800 p-3.5 rounded-2xl leading-relaxed">
                {appointment.reason}
              </p>
            </div>
          )}

          {/* DOCTOR CLINICAL NOTES (IF ANY) */}
          {appointment.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Doctor Notes</h4>
              <p className="text-xs text-teal-200 bg-teal-950/40 border border-teal-500/30 p-3.5 rounded-2xl leading-relaxed">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* CANCELLATION INFO (IF CANCELLED) */}
          {appointment.status === 'Cancelled' && (
            <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl space-y-1 text-xs text-rose-300">
              <div className="font-bold text-rose-200">Cancelled on {appointment.cancellationDate || 'Recently'}</div>
              <p className="text-[11px] text-rose-300/80">Reason: {appointment.cancellationReason || 'User request'}</p>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {appointment.type === 'Video' && (
              <button
                onClick={() => {
                  onClose();
                  onJoin(appointment);
                }}
                className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
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
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Reminder</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onReschedule(appointment);
                }}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reschedule</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCancel(appointment);
                }}
                className="py-2.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
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

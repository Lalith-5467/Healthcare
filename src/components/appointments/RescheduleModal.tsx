import React, { useState } from 'react';
import { X, Calendar, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface RescheduleModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmReschedule: (aptId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmReschedule,
}) => {
  const [selectedDate, setSelectedDate] = useState('26 Aug 2026');
  const [selectedTime, setSelectedTime] = useState('02:30 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !appointment) return null;

  const dates = [
    { label: 'Wed, 26 Aug', value: '26 Aug 2026' },
    { label: 'Thu, 27 Aug', value: '27 Aug 2026' },
    { label: 'Fri, 28 Aug', value: '28 Aug 2026' },
    { label: 'Sat, 29 Aug', value: '29 Aug 2026' },
    { label: 'Mon, 31 Aug', value: '31 Aug 2026' },
  ];

  const slots = ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmReschedule(appointment.id, selectedDate, selectedTime);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Reschedule Appointment</h3>
              <p className="text-xs text-slate-400">Select a new date and time for consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CURRENT DETAILS SUMMARY */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-white">{appointment.doctorName}</h4>
            <p className="text-[11px] text-teal-400 font-semibold">{appointment.speciality}</p>
          </div>
          <div className="text-right text-[11px] text-slate-400 font-mono">
            <div>Current: {appointment.date}</div>
            <div className="text-cyan-300 font-bold">{appointment.time}</div>
          </div>
        </div>

        {/* SELECT NEW DATE */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Select New Date</label>
          <div className="grid grid-cols-2 gap-2">
            {dates.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSelectedDate(d.value)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                  selectedDate === d.value
                    ? 'bg-[#00a896] text-white border-teal-500 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* SELECT NEW TIME */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Select New Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedTime(s)}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-mono border transition-colors cursor-pointer ${
                  selectedTime === s
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Rescheduling...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Reschedule</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

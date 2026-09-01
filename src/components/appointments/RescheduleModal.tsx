import React, { useState } from 'react';
import { X, Calendar, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface RescheduleModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmReschedule?: (aptId: string, newDate: string, newTime: string) => void;
  onConfirm?: (aptId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmReschedule,
  onConfirm,
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
      if (onConfirmReschedule) onConfirmReschedule(appointment.id, selectedDate, selectedTime);
      if (onConfirm) onConfirm(appointment.id, selectedDate, selectedTime);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Reschedule Appointment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select a new date and time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CURRENT APPOINTMENT CHIP */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
          <img
            src={appointment.doctorPhoto}
            alt={appointment.doctorName}
            className="w-10 h-10 rounded-xl object-cover border border-teal-500/30 shrink-0"
          />
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{appointment.doctorName}</h4>
            <p className="text-[10px] text-slate-500 font-mono">
              Current: {appointment.date} at {appointment.time}
            </p>
          </div>
        </div>

        {/* SELECT DATE */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Select New Date
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                  selectedDate === d.value
                    ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* SELECT TIME */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Select New Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer text-center ${
                  selectedTime === time
                    ? 'bg-[#00a896] text-white border-teal-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-sans">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

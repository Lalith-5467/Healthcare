import React, { useState } from 'react';
import { X, Calendar, Check, Sparkles, ExternalLink } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalAppointmentModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (hospName: string, dept: string, doc: string, date: string) => void;
}

export const HospitalAppointmentModal: React.FC<HospitalAppointmentModalProps> = ({
  hospital,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<string>('Dr. Rajesh Kumar');
  const [preferredDate, setPreferredDate] = useState<string>('2026-08-25');
  const [preferredTime, setPreferredTime] = useState<string>('10:30 AM');
  const [reason, setReason] = useState<string>('Routine health consultation & checkup');
  const [booking, setBooking] = useState(false);

  if (!isOpen || !hospital) return null;

  const activeDept = selectedDept || (hospital.specialties[0] || 'General Medicine');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    setTimeout(() => {
      setBooking(false);
      onConfirmBooking(hospital.name, activeDept, selectedDoc, preferredDate);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00a896]/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Book Appointment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{hospital.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">Department</label>
            <select
              value={activeDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896]"
            >
              {hospital.specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">Select Doctor</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896]"
            >
              <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar (Senior Consultant)</option>
              <option value="Dr. Priya Sharma">Dr. Priya Sharma (General Physician)</option>
              <option value="Dr. Arun V. Patel">Dr. Arun V. Patel (Specialist)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">Time</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-[#00a896]"
              >
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="02:15 PM">02:15 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">Reason for Visit</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-700 dark:text-cyan-300">
            <span>ℹ Demo appointment request will be recorded locally in your portal.</span>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={booking}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {booking ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Video, Building2, Clock, CheckCircle2 } from 'lucide-react';
import type { Appointment } from './appointmentsData';

interface CalendarViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
}

export const CalendarViewModal: React.FC<CalendarViewModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onSelectAppointment,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(23); // August 23

  if (!isOpen) return null;

  // Days in August 2026 (31 days, Starts on Saturday)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Map appointments to days of August
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter((apt) => {
      if (apt.date.includes(`${day} Aug`) || apt.date.includes(`Aug ${day}`) || (day === 23 && apt.date.includes('23'))) {
        return true;
      }
      return false;
    });
  };

  const selectedDayAppointments = getAppointmentsForDay(selectedDay);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Appointment Calendar</h3>
              <p className="text-xs text-slate-400">August 2026 Schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MONTH CONTROLS */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-extrabold text-white">August 2026</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CALENDAR MONTH GRID */}
        <div>
          {/* DAY NAMES */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500 mb-2 uppercase">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank start offset (Sat start = 6 blanks) */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-10" />
            ))}

            {daysInMonth.map((day) => {
              const dayApts = getAppointmentsForDay(day);
              const isSelected = selectedDay === day;
              const hasApts = dayApts.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00a896] text-white font-extrabold shadow-md scale-105 z-10'
                      : hasApts
                      ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 text-xs font-semibold'
                  }`}
                >
                  <span>{day}</span>
                  {hasApts && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {dayApts.map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-cyan-400 animate-pulse'}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED DAY APPOINTMENTS SECTION */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>Appointments on 23 August 2026</span>
            <span className="text-cyan-400">{selectedDayAppointments.length} scheduled</span>
          </div>

          <div className="space-y-2.5 max-h-40 overflow-y-auto">
            {selectedDayAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => {
                  onClose();
                  onSelectAppointment(apt);
                }}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={apt.doctorPhoto}
                    alt={apt.doctorName}
                    className="w-10 h-10 rounded-xl object-cover border border-teal-500/30 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-extrabold text-white truncate">{apt.doctorName}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="text-teal-400 font-semibold">{apt.speciality}</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-300">{apt.time}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full shrink-0">
                  {apt.type}
                </span>
              </div>
            ))}

            {selectedDayAppointments.length === 0 && (
              <p className="text-center text-xs text-slate-500 py-3">
                No appointments scheduled for {selectedDay} August 2026.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

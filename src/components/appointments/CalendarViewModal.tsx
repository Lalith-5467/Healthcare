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
  // Default to August 2026 (Month index 7)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 23));
  const [selectedDay, setSelectedDay] = useState<number>(23);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const currentMonthName = monthNames[month];
  const currentShortMonth = shortMonthNames[month];

  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of current month (0 = Sunday, 1 = Monday, ...)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 23));
    setSelectedDay(23);
  };

  // Map appointments for specific day in current displayed month & year
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter((apt) => {
      const matchDay = apt.date.includes(`${day} ${currentShortMonth}`) ||
                       apt.date.includes(`${currentShortMonth} ${day}`) ||
                       (month === 7 && year === 2026 && (
                         (day === 23 && (apt.date.includes('23') || apt.date.includes('Today'))) ||
                         (day === 25 && apt.date.includes('25')) ||
                         (day === 28 && apt.date.includes('28')) ||
                         (day === 18 && apt.date.includes('18'))
                       ));
      return matchDay;
    });
  };

  const selectedDayAppointments = getAppointmentsForDay(selectedDay);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Appointment Calendar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {currentMonthName} {year} Schedule
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MONTH CONTROLS */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-900 dark:text-white font-sans">
              {currentMonthName} {year}
            </span>
            <button
              onClick={handleToday}
              className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-teal-500/10 hover:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 border border-teal-500/20 cursor-pointer transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CALENDAR MONTH GRID */}
        <div>
          {/* DAY NAMES */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 mb-1.5 uppercase font-mono">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-1.5 font-mono">
            {/* Blank start offsets */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-11 rounded-xl bg-transparent" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayApts = getAppointmentsForDay(day);
              const isSelected = selectedDay === day;
              const hasApts = dayApts.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-[#00a896] text-white font-black shadow-md scale-105 z-10'
                      : hasApts
                      ? 'bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 text-teal-900 dark:text-cyan-300 font-bold border border-teal-300 dark:border-teal-500/30'
                      : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-700 dark:text-slate-400 font-medium border border-transparent'
                  }`}
                >
                  <span>{day}</span>
                  {hasApts && (
                    <div className="flex items-center gap-0.5 mt-0.5 max-w-[28px] overflow-hidden justify-center">
                      {dayApts.length <= 3 ? (
                        dayApts.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSelected ? 'bg-white' : 'bg-[#00a896] dark:bg-cyan-400'
                            }`}
                          />
                        ))
                      ) : (
                        <span
                          className={`text-[8px] font-bold px-1 rounded-full ${
                            isSelected ? 'bg-white text-teal-700' : 'bg-teal-600 text-white'
                          }`}
                        >
                          {dayApts.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED DAY APPOINTMENTS SECTION */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>
              Appointments on {selectedDay} {currentMonthName} {year}
            </span>
            <span className="text-[#00a896] dark:text-cyan-400 font-mono">
              {selectedDayAppointments.length} scheduled
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 font-medium">No consultations scheduled on this date.</p>
              </div>
            ) : (
              selectedDayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    onClose();
                    onSelectAppointment(apt);
                  }}
                  className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={apt.doctorPhoto}
                      alt={apt.doctorName}
                      className="w-10 h-10 rounded-xl object-cover border border-teal-500/30 shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{apt.doctorName}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        <span className="text-[#00a896] dark:text-teal-400 font-semibold">{apt.speciality}</span>
                        <span>•</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-cyan-300">{apt.time}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-full shrink-0">
                    {apt.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

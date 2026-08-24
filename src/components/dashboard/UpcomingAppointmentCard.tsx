import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, ChevronRight } from 'lucide-react';

interface UpcomingAppointmentCardProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  onNavigate,
  onToast
}) => {
  const [secondsLeft, setSecondsLeft] = useState(6135); // 01h 42m 15s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const isReady = secondsLeft === 0;

  const handleJoinCall = () => {
    onToast('Joining Tele-Consult video room (Demo)...');
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Upcoming Appointment
            </h3>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              ● {isReady ? 'Ready to Join' : 'Scheduled Consult'}
            </span>
          </div>
        </div>

        {/* COUNTDOWN TIMER BADGE */}
        <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{isReady ? 'Ready!' : `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`}</span>
        </div>
      </div>

      {/* DOCTOR DETAILS */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&q=80"
          alt="Dr. Rajesh Kumar"
          className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/30 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
            Dr. Rajesh Kumar
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Senior General Physician</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span>22 Aug 2026, 10:30 AM</span>
            </span>
          </div>
        </div>
      </div>

      {/* BUTTON ACTIONS */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => onNavigate('appointments')}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleJoinCall}
          className="flex-1 py-2 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Join Call</span>
        </button>
      </div>
    </div>
  );
};

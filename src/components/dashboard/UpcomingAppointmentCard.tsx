import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    onToast('✓ Joining Tele-Consult video room (Demo)...');
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Upcoming Appointment
            </h3>
            <span className="text-xs font-bold text-cyan-300 font-mono">
              ● {isReady ? 'Ready to Join' : 'Scheduled Consult'}
            </span>
          </div>
        </div>

        {/* COUNTDOWN TIMER BADGE */}
        <div className="px-3 py-1 rounded-full bg-blue-500/10 text-cyan-300 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <Clock className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>{isReady ? 'Ready!' : `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`}</span>
        </div>
      </div>

      {/* DOCTOR DETAILS */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5 shadow-inner">
        <img
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&q=80"
          alt="Dr. Rajesh Kumar"
          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-extrabold text-white line-clamp-1">
            Dr. Rajesh Kumar
          </h4>
          <p className="text-[11px] text-slate-300 font-medium">Senior General Physician</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-1 font-mono font-bold">
            <span className="flex items-center gap-1 text-cyan-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>25 Aug 2026, 10:30 AM</span>
            </span>
          </div>
        </div>
      </div>

      {/* BUTTON ACTIONS */}
      <div className="flex items-center gap-3 pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('appointments')}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-extrabold border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleJoinCall}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Video className="w-4 h-4" />
          <span>Join Call Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

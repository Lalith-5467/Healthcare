import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface UpcomingAppointmentCardProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  onNavigate,
  onToast
}) => {
  const [secondsLeft, setSecondsLeft] = useState(6135);

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
      className="p-6 rounded-3xl border flex flex-col justify-between space-y-4 group font-sans relative overflow-hidden bg-gradient-to-br from-sky-50 via-sky-100/30 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-sky-500/15 dark:border-sky-500/10 shadow-[0_4px_24px_rgba(14,165,233,0.08),_0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    >
      {/* Decorative corner shape */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(14,165,233,.12) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(20,184,166,.08) 0%,transparent 70%)' }} />

      {/* HEADER */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Circular gradient icon */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-md shrink-0"
            style={{ background: 'linear-gradient(135deg,#38bdf8,#0284c7)', boxShadow: '0 4px 12px rgba(14,165,233,.3)' }}>
            <Video className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Upcoming Appointment
            </h3>
            <span className="text-xs font-bold flex items-center gap-1.5 mt-0.5" style={{ color: '#0284c7' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
              </span>
              {isReady ? 'Ready to Join' : 'Scheduled Consult'}
            </span>
          </div>
        </div>

        {/* Premium countdown pill */}
        <div className="px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
          style={{ background: 'rgba(14,165,233,.1)', border: '1px solid rgba(14,165,233,.25)', color: '#0369a1' }}>
          <Clock className="w-3.5 h-3.5 animate-spin-slow" style={{ color: '#0284c7' }} />
          <span>{isReady ? '🟢 Ready!' : `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`}</span>
        </div>
      </div>

      {/* DOCTOR DETAILS — tinted premium container */}
      <div className="relative z-10 p-4 rounded-2xl flex items-center gap-3.5 bg-white/80 dark:bg-slate-800/80 border border-sky-500/10 backdrop-blur-sm shadow-[0_2px_10px_rgba(14,165,233,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        <img
          src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80"
          alt="Dr. Rajesh Kumar"
          className="w-12 h-12 rounded-2xl object-cover shrink-0"
          style={{ boxShadow: '0 0 0 2.5px rgba(14,165,233,.35)' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
              Dr. Rajesh Kumar
            </h4>
            {/* Confirmed status indicator */}
            <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,.1)', color: '#059669', border: '1px solid rgba(16,185,129,.25)' }}>
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Confirmed</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Senior General Physician</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold mt-1.5" style={{ color: '#0284c7' }}>
            <Calendar className="w-3 h-3" />
            <span className="font-mono">25 Aug 2026 · 10:30 AM</span>
          </div>
        </div>
      </div>

      {/* BUTTON ACTIONS */}
      <div className="flex items-center gap-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('appointments')}
          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1 cursor-pointer"
          style={{ background: 'rgba(255,255,255,.9)', border: '1.5px solid rgba(14,165,233,.2)', color: '#0369a1', boxShadow: '0 1px 4px rgba(14,165,233,.08)' }}
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Join Call — teal gradient glow button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleJoinCall}
          className="flex-1 py-2.5 px-3 rounded-xl text-slate-900 dark:text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg,#00a896,#0284c7)',
            boxShadow: '0 4px 14px rgba(0,168,150,.3)'
          }}
        >
          <Video className="w-4 h-4" />
          <span>Join Call Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

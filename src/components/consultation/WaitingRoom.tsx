import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Camera, CameraOff, Mic, MicOff, CheckCircle2, AlertCircle, Sparkles, LogOut } from 'lucide-react';
import type { ConsultationAppointment } from './consultationData';

interface WaitingRoomProps {
  appointment: ConsultationAppointment;
  cameraEnabled: boolean;
  micEnabled: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onLeaveWaitingRoom: () => void;
  onDoctorJoined: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  appointment,
  cameraEnabled,
  micEnabled,
  onToggleCamera,
  onToggleMic,
  onLeaveWaitingRoom,
  onDoctorJoined,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(135); // 02:15 countdown
  const [isJoiningTransition, setIsJoiningTransition] = useState(false);

  // Countdown timer simulation
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setIsJoiningTransition(true);
      const timer = setTimeout(() => {
        onDoctorJoined();
      }, 2000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 py-6 text-center">
      {isJoiningTransition ? (
        <div className="py-16 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="w-12 h-12 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">{appointment.doctor.name} is joining...</h2>
            <p className="text-xs text-slate-400 mt-1">Connecting HD encrypted audio & video stream</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
          {/* HEADER */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 font-mono">
              Waiting Room • {appointment.id}
            </span>
            <h2 className="text-2xl font-extrabold text-white">You're in the waiting room</h2>
            <p className="text-xs text-slate-400">
              {appointment.doctor.name} will join shortly. Please stay on this screen.
            </p>
          </div>

          {/* DOCTOR AVATAR WITH PULSING HALO */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-cyan-500/20 border border-cyan-400/40"
            />
            <img
              src={appointment.doctor.avatarUrl}
              alt={appointment.doctor.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-900 relative z-10 shadow-xl"
            />
          </div>

          {/* COUNTDOWN TIMER */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 inline-block px-8 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Estimated Wait</span>
            <span className="font-mono text-3xl font-extrabold text-cyan-400">{formatCountdown(secondsRemaining)}</span>
          </div>

          {/* STATUS TIMELINE */}
          <div className="max-w-md mx-auto space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Appointment confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Identity & patient records verified</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping ml-1 mr-1" />
              <span>Waiting for doctor to initiate call</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-700 ml-1 mr-1" />
              <span>Consultation starting</span>
            </div>
          </div>

          {/* FOOTER CONTROLS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMic}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  micEnabled ? 'bg-slate-800 text-white border-slate-700' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {micEnabled ? <Mic className="w-4 h-4 text-teal-400" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggleCamera}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  cameraEnabled ? 'bg-slate-800 text-white border-slate-700' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {cameraEnabled ? <Camera className="w-4 h-4 text-cyan-400" /> : <CameraOff className="w-4 h-4" />}
              </button>
            </div>

            {/* DEV MOCK SKIP TRIGGER */}
            <button
              onClick={() => setIsJoiningTransition(true)}
              className="text-[10px] text-slate-500 hover:text-cyan-400 underline cursor-pointer"
            >
              [Simulate Doctor Join Now]
            </button>

            <button
              onClick={onLeaveWaitingRoom}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Waiting Room</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

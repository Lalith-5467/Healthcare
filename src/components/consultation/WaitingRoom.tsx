import React, { useState, useEffect } from 'react';
import { Clock, Camera, CameraOff, Mic, MicOff, Sparkles, LogOut } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 py-6 text-center font-sans">
      {isJoiningTransition ? (
        <div className="py-16 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{appointment.doctor.name} is joining...</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Connecting HD encrypted audio & video stream</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white">
          <div className="w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mx-auto text-[#00a896] dark:text-cyan-400">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
              Virtual Waiting Room
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Waiting for Doctor to join</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium">
              You are next in queue. <strong className="text-slate-900 dark:text-white">{appointment.doctor.name}</strong> will connect with you shortly.
            </p>
          </div>

          {/* TIMER BANNER */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 inline-block font-mono text-center">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase font-sans">Estimated Wait Time</span>
            <span className="text-3xl font-extrabold text-[#00a896] dark:text-cyan-400">{formatCountdown(secondsRemaining)}</span>
          </div>

          {/* CONTROLS BAR */}
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onToggleCamera}
              className={`p-3 rounded-xl transition-colors cursor-pointer ${cameraEnabled ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200' : 'bg-rose-600 text-white'}`}
              title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleMic}
              className={`p-3 rounded-xl transition-colors cursor-pointer ${micEnabled ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200' : 'bg-rose-600 text-white'}`}
              title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onLeaveWaitingRoom}
              className="px-4 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 font-extrabold text-xs border border-rose-500/30 flex items-center gap-1.5 cursor-pointer font-sans"
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

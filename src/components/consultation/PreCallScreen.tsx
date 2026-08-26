import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Volume2, VolumeX, Settings, Video, User, Sparkles } from 'lucide-react';
import type { ConsultationAppointment } from './consultationData';

interface PreCallScreenProps {
  appointment: ConsultationAppointment;
  cameraEnabled: boolean;
  micEnabled: boolean;
  speakerEnabled: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleSpeaker: () => void;
  onOpenDeviceSettings: () => void;
  onJoinWaitingRoom: () => void;
  onNavigateAppointments: () => void;
}

export const PreCallScreen: React.FC<PreCallScreenProps> = ({
  appointment,
  cameraEnabled,
  micEnabled,
  speakerEnabled,
  onToggleCamera,
  onToggleMic,
  onToggleSpeaker,
  onOpenDeviceSettings,
  onJoinWaitingRoom,
  onNavigateAppointments,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [_cameraPermissionError, setCameraPermissionError] = useState(false);

  // Request browser camera stream if cameraEnabled
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (cameraEnabled && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((s) => {
          activeStream = s;
          setStream(s);
          setCameraPermissionError(false);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access error or permission denied:', err);
          setCameraPermissionError(true);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <button
            onClick={onNavigateAppointments}
            className="text-xs font-extrabold text-[#00a896] dark:text-cyan-400 hover:underline mb-1 flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to Appointments
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Prepare for your consultation</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            Test your camera, microphone & speakers before joining the consultation room.
          </p>
        </div>

        <div className="hidden sm:block text-right font-mono">
          <span className="text-[10px] font-extrabold text-[#00a896] dark:text-cyan-400 block">{appointment.id}</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            {appointment.status}
          </span>
        </div>
      </div>

      {/* DOCTOR SUMMARY CARD */}
      <div className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 flex flex-col sm:flex-row items-center justify-between gap-6 transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#00a896]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-4 text-center sm:text-left z-10">
          <img
            src={appointment.doctor.avatarUrl}
            alt={appointment.doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-lg shadow-teal-500/20"
          />
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{appointment.doctor.name}</h3>
            <p className="text-xs font-bold text-[#00a896] dark:text-cyan-400">{appointment.doctor.speciality} • {appointment.doctor.hospital}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg inline-block">
              Scheduled: {appointment.scheduledTime} ({appointment.date})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono z-10">
          <button className="px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 flex items-center gap-1.5 font-sans transition-all cursor-pointer shadow-sm hover:shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HD Tele-Consult</span>
          </button>
        </div>
      </div>

      {/* VIDEO PREVIEW BOX & DEVICE TOGGLES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* CAMERA FEED PREVIEW (8 COLS) */}
        <div className="md:col-span-8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:to-black rounded-3xl border border-slate-700/50 overflow-hidden relative min-h-[320px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 group">
          {cameraEnabled ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-3xl"
            />
          ) : (
            <div className="text-center space-y-4 p-8 z-10">
              <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mx-auto shadow-inner backdrop-blur-sm">
                <User className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">Camera Off</p>
                <p className="text-xs text-slate-400 max-w-xs font-medium mt-1">Enable camera to preview your video before entering the call room.</p>
              </div>
            </div>
          )}

          {/* DECORATIVE GLOW */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

          {/* OVERLAY CONTROLS */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 dark:bg-black/30 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-2xl z-20 transition-all duration-300">
            <button
              onClick={onToggleCamera}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${cameraEnabled ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1' : 'bg-rose-500/80 text-white hover:bg-rose-600/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:-translate-y-1'}`}
              title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleMic}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${micEnabled ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1' : 'bg-rose-500/80 text-white hover:bg-rose-600/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:-translate-y-1'}`}
              title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleSpeaker}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${speakerEnabled ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1' : 'bg-rose-500/80 text-white hover:bg-rose-600/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:-translate-y-1'}`}
              title={speakerEnabled ? 'Mute Speaker' : 'Unmute Speaker'}
            >
              {speakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* READY CHECK & JOIN BUTTON (4 COLS) */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Equipment Status Check</h4>

            <div className="space-y-2.5 text-xs font-semibold">
              <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${cameraEnabled ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/50' : 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-800/50'}`}>
                <div className="flex items-center gap-2.5">
                  {cameraEnabled ? <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <CameraOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  <span className="text-slate-700 dark:text-slate-300">Camera Feed</span>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cameraEnabled ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400'}`}>
                  {cameraEnabled ? 'Ready ✓' : 'Disabled'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${micEnabled ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/50' : 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-800/50'}`}>
                <div className="flex items-center gap-2.5">
                  {micEnabled ? <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <MicOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  <span className="text-slate-700 dark:text-slate-300">Microphone</span>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${micEnabled ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400'}`}>
                  {micEnabled ? 'Active ✓' : 'Muted'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${speakerEnabled ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/50' : 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-800/50'}`}>
                <div className="flex items-center gap-2.5">
                  {speakerEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  <span className="text-slate-700 dark:text-slate-300">Audio Output</span>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${speakerEnabled ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400'}`}>
                  {speakerEnabled ? 'Connected ✓' : 'Muted'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenDeviceSettings}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>Change Device Settings</span>
            </button>
          </div>

          <button
            onClick={onJoinWaitingRoom}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 text-white font-black text-[13px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,168,150,0.4)] hover:shadow-[0_0_25px_rgba(0,168,150,0.6)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 group relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Join Waiting Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

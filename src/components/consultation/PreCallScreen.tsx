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
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={appointment.doctor.avatarUrl}
            alt={appointment.doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-md"
          />
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{appointment.doctor.name}</h3>
            <p className="text-xs font-bold text-[#00a896] dark:text-cyan-400">{appointment.doctor.speciality} • {appointment.doctor.hospital}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
              Scheduled: {appointment.scheduledTime} ({appointment.date})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HD Tele-Consult</span>
          </span>
        </div>
      </div>

      {/* VIDEO PREVIEW BOX & DEVICE TOGGLES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* CAMERA FEED PREVIEW (8 COLS) */}
        <div className="md:col-span-8 bg-slate-900 dark:bg-slate-950 rounded-3xl border border-slate-300 dark:border-slate-800 overflow-hidden relative min-h-[320px] flex items-center justify-center shadow-2xl">
          {cameraEnabled ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-3xl"
            />
          ) : (
            <div className="text-center space-y-3 p-8">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                <User className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-slate-300">Camera Off</p>
              <p className="text-[11px] text-slate-400 max-w-xs font-medium">Enable camera to preview your video before entering the call room.</p>
            </div>
          )}

          {/* OVERLAY CONTROLS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-2xl z-20">
            <button
              onClick={onToggleCamera}
              className={`p-3 rounded-xl transition-colors cursor-pointer ${cameraEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
              title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleMic}
              className={`p-3 rounded-xl transition-colors cursor-pointer ${micEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
              title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleSpeaker}
              className={`p-3 rounded-xl transition-colors cursor-pointer ${speakerEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
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
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Camera Feed</span>
                <span className={`text-[10px] font-extrabold ${cameraEnabled ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {cameraEnabled ? 'Ready ✓' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Microphone</span>
                <span className={`text-[10px] font-extrabold ${micEnabled ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {micEnabled ? 'Active ✓' : 'Muted'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Audio Output</span>
                <span className={`text-[10px] font-extrabold ${speakerEnabled ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
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
            className="w-full py-3.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Video className="w-4 h-4" />
            <span>Join Waiting Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

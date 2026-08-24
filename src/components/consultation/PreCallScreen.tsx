import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Mic, MicOff, Volume2, VolumeX, Settings, Video, CheckCircle2, User, Sparkles, ArrowRight } from 'lucide-react';
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
  const [cameraPermissionError, setCameraPermissionError] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onNavigateAppointments}
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 mb-1 flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to Appointments
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Prepare for your consultation</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Test your camera, microphone & speakers before joining the consultation room.
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[10px] font-extrabold font-mono text-cyan-400 block">{appointment.id}</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {appointment.status}
          </span>
        </div>
      </div>

      {/* DOCTOR SUMMARY CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={appointment.doctor.avatarUrl}
            alt={appointment.doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-md"
          />
          <div>
            <h3 className="text-lg font-extrabold text-white">{appointment.doctor.name}</h3>
            <p className="text-xs font-bold text-teal-400">{appointment.doctor.speciality} • {appointment.doctor.hospital}</p>
            <p className="text-[11px] text-slate-400 mt-1">Scheduled for: <strong className="text-white">{appointment.date} ({appointment.time})</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">Doctor Online & Ready</span>
        </div>
      </div>

      {/* CAMERA & DEVICE TEST SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CAMERA PREVIEW CONTAINER (LEFT 7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {cameraEnabled && !cameraPermissionError ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-300">
                    {cameraPermissionError ? 'Camera preview unavailable' : 'Camera is turned off'}
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                    {cameraPermissionError
                      ? 'Browser permission denied or no camera device connected. You can continue without camera.'
                      : 'Click the camera button below to turn on video preview.'}
                  </p>
                </div>
                {cameraPermissionError && (
                  <button
                    onClick={onToggleCamera}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition-colors cursor-pointer"
                  >
                    Try Re-enabling Camera
                  </button>
                )}
              </div>
            )}

            {/* LIVE PREVIEW BADGE */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${cameraEnabled && !cameraPermissionError ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{cameraEnabled && !cameraPermissionError ? 'Live Self Preview' : 'Avatar Preview'}</span>
            </div>
          </div>

          {/* DEVICE CONTROL TOGGLES */}
          <div className="flex items-center justify-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
            {/* CAM */}
            <button
              onClick={onToggleCamera}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                cameraEnabled
                  ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {cameraEnabled ? <Camera className="w-5 h-5 text-cyan-400" /> : <CameraOff className="w-5 h-5" />}
              <span>{cameraEnabled ? 'Cam ON' : 'Cam OFF'}</span>
            </button>

            {/* MIC */}
            <button
              onClick={onToggleMic}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                micEnabled
                  ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {micEnabled ? <Mic className="w-5 h-5 text-teal-400" /> : <MicOff className="w-5 h-5" />}
              <span>{micEnabled ? 'Mic ON' : 'Mic OFF'}</span>
            </button>

            {/* SPEAKER */}
            <button
              onClick={onToggleSpeaker}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                speakerEnabled
                  ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {speakerEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5" />}
              <span>{speakerEnabled ? 'Audio ON' : 'Audio OFF'}</span>
            </button>
          </div>
        </div>

        {/* MICROPHONE LEVEL TEST & JOIN CARD (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* MIC LEVEL VISUALIZER */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Mic className="w-4 h-4 text-teal-400" />
                <span>Microphone Level Test</span>
              </span>
              <span className="text-[10px] font-bold text-teal-400 font-mono">{micEnabled ? 'Listening...' : 'Muted'}</span>
            </div>

            {/* AUDIO ANIMATION BARS */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center gap-1.5 h-16">
              {[40, 75, 55, 90, 65, 80, 45, 70, 85, 50, 60, 95].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: micEnabled ? [10, h * 0.4, 10] : 8 }}
                  transition={{ repeat: Infinity, duration: 1 + i * 0.1, ease: 'easeInOut' }}
                  className={`w-1.5 rounded-full ${micEnabled ? 'bg-gradient-to-t from-[#00a896] to-cyan-400' : 'bg-slate-800'}`}
                />
              ))}
            </div>

            <button
              onClick={onOpenDeviceSettings}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Test Audio & Change Hardware</span>
            </button>
          </div>

          {/* JOIN BUTTON & CHECKS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted HD Tele-consultation connection</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Identity & ABHA ID Verified</span>
              </div>
            </div>

            <button
              onClick={onJoinWaitingRoom}
              className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join Consultation Room</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

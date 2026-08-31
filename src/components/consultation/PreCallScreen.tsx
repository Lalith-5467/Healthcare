import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Volume2, VolumeX, Settings, Video, User, Sparkles, BadgeCheck, Star, Wifi, ShieldCheck, Lock, HeadphonesIcon, CheckCircle2, RotateCw, X, MessageCircle, HeartPulse, Stethoscope } from 'lucide-react';
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
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleRunTest = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 1500);
  };

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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 font-sans pb-10">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <button onClick={onNavigateAppointments} className="text-xs font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 mb-2 cursor-pointer">
            ← Back to Appointments
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Prepare for your consultation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-2xl">
            Test your camera, microphone, and speakers before joining the consultation room to ensure a smooth experience.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3">
          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-blue-100 dark:border-blue-800/30">
            <HeadphonesIcon className="w-3.5 h-3.5" />
            Need Help?
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 font-mono">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ID: {appointment.id}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {appointment.status}
            </span>
          </div>
        </div>
      </div>

      {/* 2. DOCTOR CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:shadow-md hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-teal-900/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={appointment.doctor.avatarUrl} alt={appointment.doctor.name} className="w-14 h-14 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {appointment.doctor.name}
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{appointment.doctor.speciality} • {appointment.doctor.hospital}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-500/20"><Star className="w-3 h-3 fill-amber-500" /> 4.9 (120+ Reviews)</span>
              <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">•</span>
              <span className="font-mono bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">📅 {appointment.date}, {appointment.time}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowDoctorModal(true)} className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap self-stretch sm:self-auto shadow-sm hover:shadow">
          View Doctor Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: VIDEO PREVIEW (2 COLS) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* 3. VIDEO PREVIEW AREA */}
          <div className="bg-slate-900 dark:bg-[#050B14] rounded-3xl border border-slate-200 dark:border-slate-800/80 overflow-hidden relative flex flex-col h-[350px] sm:h-[420px] shadow-xl shadow-teal-900/10">
            
            {/* Subtle Wave Background Overlay when empty (Animated) */}
            {!cameraEnabled && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="w-[150%] h-[150%] opacity-30 animate-[pulse_4s_ease-in-out_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 168, 150, 0.5) 0%, transparent 60%)' }} />
                <div className="absolute w-[100%] h-[100%] opacity-20 animate-[pulse_6s_ease-in-out_infinite_reverse]" style={{ backgroundImage: 'radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)' }} />
              </div>
            )}

            <div className="flex-1 relative flex items-center justify-center p-6">
              {cameraEnabled ? (
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center space-y-4 z-10">
                  <div className="w-20 h-20 rounded-full bg-slate-800/40 border border-slate-600/30 flex items-center justify-center text-slate-500 dark:text-slate-400 mx-auto backdrop-blur-xl shadow-2xl">
                    <CameraOff className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Camera is turned off</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 font-medium">Enable your camera to test your video feed before joining.</p>
                  </div>
                </div>
              )}

              {/* Camera Ready Status Overlay */}
              {cameraEnabled && (
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 z-10 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Camera Ready</span>
                </div>
              )}
            </div>

            {/* DEVICE CONTROLS BOTTOM BAR (Glassmorphism) */}
            <div className="bg-slate-950/40 backdrop-blur-2xl border-t border-white/5 p-4 flex items-center justify-center gap-6 sm:gap-8 relative z-20 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
              <button onClick={onToggleCamera} className={`flex flex-col items-center gap-2 group cursor-pointer ${cameraEnabled ? 'text-white' : 'text-slate-500 hover:text-slate-600 dark:text-slate-300'}`}>
                <div className={`p-3.5 rounded-2xl transition-all duration-300 ${cameraEnabled ? 'bg-teal-500/20 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:bg-teal-500/30' : 'bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-slate-700'}`}>
                  {cameraEnabled ? <Camera className="w-5 h-5 text-teal-400" /> : <CameraOff className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Camera</span>
              </button>
              
              <button onClick={onToggleMic} className={`flex flex-col items-center gap-2 group cursor-pointer ${micEnabled ? 'text-white' : 'text-slate-500 hover:text-slate-600 dark:text-slate-300'}`}>
                <div className={`p-3.5 rounded-2xl transition-all duration-300 ${micEnabled ? 'bg-teal-500/20 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:bg-teal-500/30' : 'bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-slate-700'}`}>
                  {micEnabled ? <Mic className="w-5 h-5 text-teal-400" /> : <MicOff className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Mic</span>
              </button>

              <button onClick={onToggleSpeaker} className={`flex flex-col items-center gap-2 group cursor-pointer ${speakerEnabled ? 'text-white' : 'text-slate-500 hover:text-slate-600 dark:text-slate-300'}`}>
                <div className={`p-3.5 rounded-2xl transition-all duration-300 ${speakerEnabled ? 'bg-teal-500/20 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:bg-teal-500/30' : 'bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-slate-700'}`}>
                  {speakerEnabled ? <Volume2 className="w-5 h-5 text-teal-400" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Speaker</span>
              </button>
              
              <div className="w-px h-10 bg-slate-800 mx-1 sm:mx-2" />

              <button onClick={onOpenDeviceSettings} className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors cursor-pointer group">
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-transparent group-hover:bg-slate-800 group-hover:border-slate-200 dark:border-slate-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
              </button>
            </div>
          </div>

          {/* 4. & 5. JOIN BUTTON & INTERNET STATUS */}
          <div className="space-y-3">
            <button
              onClick={onJoinWaitingRoom}
              disabled={!cameraEnabled || !micEnabled}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-slate-200 disabled:to-slate-200 disabled:dark:from-slate-800 disabled:dark:to-slate-800 disabled:cursor-not-allowed disabled:text-slate-500 dark:text-slate-400 text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-widest transition-all shadow-lg shadow-teal-500/30 disabled:shadow-none flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Join Waiting Room</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-900/10 py-2.5 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
              <Wifi className="w-3.5 h-3.5 text-blue-500" />
              <span>Please ensure you have a stable internet connection for the best experience.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CARDS (1 COL) */}
        <div className="lg:col-span-1 space-y-5 flex flex-col">
          
          {/* 6. EQUIPMENT STATUS CHECK */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-teal-900/5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Equipment Status</h4>
              <button onClick={handleRunTest} disabled={isTesting} className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <RotateCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Run Test</span>
              </button>
            </div>

            <div className="space-y-1.5 font-medium text-xs">
              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Camera className="w-3.5 h-3.5" /></div> 
                  <span>Camera</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : cameraEnabled ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready <CheckCircle2 className="w-3 h-3" /></span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5">Disabled</span>
                )}
              </div>
              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Mic className="w-3.5 h-3.5" /></div> 
                  <span>Microphone</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : micEnabled ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready <CheckCircle2 className="w-3 h-3" /></span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5">Muted</span>
                )}
              </div>
              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Volume2 className="w-3.5 h-3.5" /></div> 
                  <span>Speaker</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : speakerEnabled ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready <CheckCircle2 className="w-3 h-3" /></span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5">Muted</span>
                )}
              </div>
              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Wifi className="w-3.5 h-3.5" /></div> 
                  <span>Internet</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Good <CheckCircle2 className="w-3 h-3" /></span>
                )}
              </div>
            </div>
          </div>

          {/* 7. CONSULTATION GUIDELINES */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-teal-900/5">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-teal-600 pointer-events-none">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <div className="p-1 bg-teal-50 dark:bg-teal-500/10 text-teal-500 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                Consultation Guidelines
              </h4>
              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-medium ml-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Find a quiet and well-lit place</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Ensure a stable internet connection</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Keep your medical documents ready</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Be on time for your appointment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 9. TRUST & SECURITY SECTION */}
      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center divide-x-0 md:divide-x divide-slate-100 dark:divide-slate-800/60">
          <div className="flex flex-col items-center gap-3 px-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-100 dark:group-hover:bg-teal-500/20 transition-all duration-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Secure & Private</h5>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Your privacy is our priority</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 px-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">HIPAA Compliant</h5>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Strict privacy standards</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 px-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-all duration-300">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Expert Doctors</h5>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Consult verified specialists</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 px-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-all duration-300">
              <HeadphonesIcon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">24/7 Support</h5>
              <p className="text-[11px] font-medium text-slate-500 mt-1">We're here to help anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTOR PROFILE MODAL */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl w-full max-w-[380px] border border-slate-200 dark:border-[#2a2a2a] overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl relative font-sans">
            
            {/* Cover Photo / Header Banner */}
            <div className="h-24 w-full bg-gradient-to-r from-teal-400 to-blue-500 dark:from-teal-900/40 dark:to-blue-900/40 relative">
              <div className="absolute inset-0 bg-white/10 dark:bg-black/20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
            </div>

            <div className="p-5 pt-0 relative">
              {/* Avatar & Header */}
              <div className="flex flex-col mb-4">
                <div className="w-[72px] h-[72px] rounded-full bg-slate-100 dark:bg-[#1e1e1e] border-4 border-white dark:border-[#0f0f0f] shrink-0 overflow-hidden -mt-10 relative z-10 shadow-sm">
                  <img src={appointment.doctor.avatarUrl} alt={appointment.doctor.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-2">
                  <h3 className="text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {appointment.doctor.name}
                    <BadgeCheck className="w-[18px] h-[18px] text-blue-500 dark:text-blue-400" />
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5">{appointment.doctor.speciality} at {appointment.doctor.hospital.split(',')[0]}</p>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 dark:text-zinc-500 mt-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Chennai, India
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed mb-5">
                Works on the preventive care surface. Currently reviewing patient health outcomes and writing about it as it happens.
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 text-[11px] font-bold shadow-[0_2px_10px_rgba(59,130,246,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:bg-blue-100 dark:hover:bg-blue-500/20 cursor-default">
                  <MessageCircle className="w-3 h-3" />
                  Consultations
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[11px] font-bold shadow-[0_2px_10px_rgba(16,185,129,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 cursor-default">
                  <HeartPulse className="w-3 h-3" />
                  Cardiology
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100/50 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 text-[11px] font-bold shadow-[0_2px_10px_rgba(168,85,247,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(168,85,247,0.2)] hover:bg-purple-100 dark:hover:bg-purple-500/20 cursor-default">
                  <Stethoscope className="w-3 h-3" />
                  Medicine
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 border border-slate-200 dark:border-[#2a2a2a] rounded-xl mb-5 divide-x divide-slate-200 dark:divide-[#2a2a2a] bg-slate-50 dark:bg-[#141414] shadow-inner">
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">15</span>
                  <span className="text-slate-500 dark:text-zinc-500 text-[11px] mt-0.5">Years Exp</span>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">120+</span>
                  <span className="text-slate-500 dark:text-zinc-500 text-[11px] mt-0.5">Reviews</span>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-blue-600 dark:text-[#60a5fa] font-bold text-lg tracking-tight flex items-center gap-1">4.9 <Star className="w-3.5 h-3.5 fill-current" /></span>
                  <span className="text-slate-500 dark:text-zinc-500 text-[11px] mt-0.5">Rating</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white border border-transparent py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer shadow-sm">
                  Follow
                </button>
                <button onClick={() => setShowDoctorModal(false)} className="flex-1 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-[#1a1a1a] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a2a] py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer shadow-sm dark:shadow-none">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

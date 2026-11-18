import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Volume2, VolumeX, Settings, Video, User, Sparkles, BadgeCheck, Star, Wifi, ShieldCheck, Lock, HeadphonesIcon, CheckCircle2, RotateCw, X, MessageCircle, HeartPulse, Stethoscope, ChevronDown, Check, Users } from 'lucide-react';
import type { ConsultationAppointment, ConsultationDoctor } from './consultationData';
import { AVAILABLE_CONSULTATION_DOCTORS } from './consultationData';
import { DoctorSelectionModal } from './DoctorSelectionModal';
import { useLanguage } from '../../context/LanguageContext';

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
  onSelectDoctor?: (doctor: ConsultationDoctor) => void;
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
  onSelectDoctor,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [_cameraPermissionError, setCameraPermissionError] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showDoctorDirectoryModal, setShowDoctorDirectoryModal] = useState(false);
  const [showDoctorSelector, setShowDoctorSelector] = useState(false);
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
            {t('consultation.back_to_apts', '← Back to Appointments')}
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('consultation.prepare_title', 'Prepare for your consultation')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-2xl">
            {t('consultation.prepare_sub', 'Test your camera, microphone, and speakers before joining the consultation room to ensure a smooth experience.')}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3">
          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-blue-100 dark:border-blue-800/30">
            <HeadphonesIcon className="w-3.5 h-3.5" />
            {t('consultation.need_help', 'Need Help?')}
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 font-mono">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ID: {appointment.id}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t(`status.${appointment.status.toLowerCase()}`, appointment.status)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. DOCTOR CARD WITH CHANGE DOCTOR CAPABILITY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:shadow-md hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-teal-900/5 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={appointment.doctor.avatarUrl} alt={appointment.doctor.name} className="w-14 h-14 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {appointment.doctor.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                Attending Physician
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{appointment.doctor.speciality} • {appointment.doctor.hospital}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-500/20"><Star className="w-3 h-3 fill-amber-500" /> {appointment.doctor.rating} (120+ Reviews)</span>
              <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">•</span>
              <span className="font-mono bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">📅 {appointment.date}, {appointment.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          {/* Change Doctor Button */}
          {onSelectDoctor && (
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <button
                onClick={() => setShowDoctorDirectoryModal(true)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Select Doctor</span>
              </button>
            </div>
          )}

          <button onClick={() => setShowDoctorModal(true)} className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shadow-sm hover:shadow">
            {t('consultation.view_doc_profile', 'View Doctor Profile')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: VIDEO PREVIEW (2 COLS) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* 3. VIDEO PREVIEW AREA */}
          <div className="bg-slate-900 dark:bg-[#050B14] rounded-3xl border border-slate-200 dark:border-slate-800/80 overflow-hidden relative flex flex-col h-[350px] sm:h-[420px] shadow-xl shadow-teal-900/10">
            
            {/* Subtle Wave Background Overlay when empty */}
            {!cameraEnabled && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="w-[150%] h-[150%] opacity-30 animate-[pulse_4s_ease-in-out_infinite]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 168, 150, 0.5) 0%, transparent 60%)' }} />
                <div className="absolute w-[100%] h-[100%] opacity-20 animate-[pulse_6s_ease-in-out_infinite_reverse]" style={{ backgroundImage: 'radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)' }} />
              </div>
            )}

            {/* Video Container */}
            <div className="flex-1 relative flex items-center justify-center">
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-slate-500 z-10">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <CameraOff className="w-8 h-8 text-slate-500" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-slate-400 block">{t('consultation.cam_disabled', 'Camera is disabled')}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300">{t('consultation.click_enable', 'Click the camera button below to turn it back on')}</span>
                  </div>
                </div>
              )}

              {/* Status overlay badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10 font-mono">
                <span className={`w-2 h-2 rounded-full ${cameraEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                  {cameraEnabled ? t('consultation.preview_live', 'Live Feed') : t('consultation.preview_standby', 'Standby')}
                </span>
              </div>
            </div>

            {/* Floating Quick Action Row */}
            <div className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-center gap-3 sm:gap-4 z-10">
              <button
                onClick={onToggleMic}
                className={`flex flex-col items-center gap-2 transition-colors cursor-pointer group ${micEnabled ? 'text-slate-300 hover:text-white' : 'text-rose-400'}`}
              >
                <div className={`p-3.5 rounded-2xl border transition-colors ${micEnabled ? 'bg-slate-800/50 border-transparent group-hover:bg-slate-800 group-hover:border-slate-700' : 'bg-rose-500/20 border-rose-500/30'}`}>
                  {micEnabled ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5 text-rose-500" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{micEnabled ? t('consultation.mic_on', 'Mic On') : t('consultation.mic_off', 'Muted')}</span>
              </button>

              <button
                onClick={onToggleCamera}
                className={`flex flex-col items-center gap-2 transition-colors cursor-pointer group ${cameraEnabled ? 'text-slate-300 hover:text-white' : 'text-rose-400'}`}
              >
                <div className={`p-3.5 rounded-2xl border transition-colors ${cameraEnabled ? 'bg-slate-800/50 border-transparent group-hover:bg-slate-800 group-hover:border-slate-700' : 'bg-rose-500/20 border-rose-500/30'}`}>
                  {cameraEnabled ? <Camera className="w-5 h-5 text-emerald-400" /> : <CameraOff className="w-5 h-5 text-rose-500" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{cameraEnabled ? t('consultation.cam_on', 'Cam On') : t('consultation.cam_off', 'Disabled')}</span>
              </button>

              <button
                onClick={onToggleSpeaker}
                className={`flex flex-col items-center gap-2 transition-colors cursor-pointer group ${speakerEnabled ? 'text-slate-300 hover:text-white' : 'text-rose-400'}`}
              >
                <div className={`p-3.5 rounded-2xl border transition-colors ${speakerEnabled ? 'bg-slate-800/50 border-transparent group-hover:bg-slate-800 group-hover:border-slate-700' : 'bg-rose-500/20 border-rose-500/30'}`}>
                  {speakerEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-rose-500" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{speakerEnabled ? 'Speaker' : 'Muted'}</span>
              </button>

              <div className="w-px h-10 bg-slate-800 mx-1 sm:mx-2" />

              <button onClick={onOpenDeviceSettings} className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group">
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-transparent group-hover:bg-slate-800 group-hover:border-slate-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
              </button>
            </div>
          </div>

          {/* JOIN BUTTON & INTERNET STATUS */}
          <div className="space-y-3">
            <button
              onClick={onJoinWaitingRoom}
              disabled={!cameraEnabled || !micEnabled}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-slate-200 disabled:to-slate-200 disabled:dark:from-slate-800 disabled:dark:to-slate-800 disabled:cursor-not-allowed disabled:text-slate-400 text-white font-extrabold text-sm uppercase tracking-widest transition-all shadow-lg shadow-teal-500/30 disabled:shadow-none flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t('consultation.join_waiting', 'Join Waiting Room')}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-900/10 py-2.5 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
              <Wifi className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('consultation.stable_internet', 'Please ensure you have a stable internet connection for the best experience.')}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CARDS (1 COL) */}
        <div className="lg:col-span-1 space-y-5 flex flex-col">
          
          {/* EQUIPMENT STATUS CHECK */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-teal-900/5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{t('consultation.equip_status', 'Equipment Status')}</h4>
              <button onClick={handleRunTest} disabled={isTesting} className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <RotateCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{t('consultation.run_test', 'Run Test')}</span>
              </button>
            </div>

            <div className="space-y-1.5 font-medium text-xs">
              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Camera className="w-3.5 h-3.5" /></div> 
                  <span>{t('consultation.camera', 'Camera')}</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : cameraEnabled ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready <CheckCircle2 className="w-3 h-3" /></span>
                ) : (
                  <span className="text-slate-400 font-bold px-2 py-0.5">Disabled</span>
                )}
              </div>

              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Mic className="w-3.5 h-3.5" /></div> 
                  <span>Microphone</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : micEnabled ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready <CheckCircle2 className="w-3 h-3" /></span>
                ) : (
                  <span className="text-slate-400 font-bold px-2 py-0.5">Muted</span>
                )}
              </div>

              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Volume2 className="w-3.5 h-3.5" /></div> 
                  <span>Speaker</span>
                </div>
                {isTesting ? (
                  <span className="text-slate-400 flex items-center gap-1 font-bold px-2 py-0.5"><RotateCw className="w-3 h-3 animate-spin" /> Testing</span>
                ) : speakerEnabled ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Ready <CheckCircle2 className="w-3 h-3" /></span>
                ) : (
                  <span className="text-slate-400 font-bold px-2 py-0.5">Muted</span>
                )}
              </div>

              <div className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors"><Wifi className="w-3.5 h-3.5" /></div> 
                  <span>Internet</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">Good <CheckCircle2 className="w-3 h-3" /></span>
              </div>
            </div>
          </div>

          {/* CONSULTATION GUIDELINES */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-teal-900/5 relative overflow-hidden">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>Consultation Guidelines</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Find a quiet and well-lit place for clear visibility.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Ensure a stable internet connection.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Keep your medical documents and reports ready.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Be on time for your appointment.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* DOCTOR PROFILE MODAL */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Doctor Profile</h3>
              <button onClick={() => setShowDoctorModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center space-y-2">
              <img src={appointment.doctor.avatarUrl} alt={appointment.doctor.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-teal-500" />
              <h4 className="font-extrabold text-base">{appointment.doctor.name}</h4>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">{appointment.doctor.speciality}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.doctor.hospital}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 leading-relaxed">{appointment.doctor.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR DIRECTORY SELECTION MODAL */}
      <DoctorSelectionModal
        isOpen={showDoctorDirectoryModal}
        onClose={() => setShowDoctorDirectoryModal(false)}
        selectedDoctorId={appointment.doctor.id}
        onSelectDoctor={(doc) => {
          if (onSelectDoctor) {
            onSelectDoctor(doc);
          }
        }}
      />
    </div>
  );
};

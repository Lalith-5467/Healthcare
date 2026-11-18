import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Monitor,
  MessageSquare,
  FileText,
  Paperclip,
  MoreVertical,
  PhoneOff,
  Send,
  X,
  User,
  Wifi,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Room, RoomEvent, VideoPresets, Track, RemoteParticipant, RemoteTrackPublication, RemoteTrack } from 'livekit-client';
import type { ConsultationAppointment, ChatMessage, SharedDocument } from './consultationData';
import { MOCK_SHARED_DOCUMENTS } from './consultationData';
import { teleConsultationService, type CallChatMessage } from '../../services/teleConsultationService';
import { socketService } from '../../services/socketService';
import { videoConsultationApi } from '../../services/videoConsultationApi';

interface ActiveConsultationRoomProps {
  appointment: ConsultationAppointment;
  cameraEnabled: boolean;
  micEnabled: boolean;
  speakerEnabled: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleSpeaker: () => void;
  onOpenReportIssue: () => void;
  onOpenDeviceSettings: () => void;
  onEndCall: (durationSeconds: number, notes: string) => void;
  onNavigateRecords: () => void;
  currentRole?: 'Doctor' | 'Patient';
  currentUserName?: string;
  remoteUserName?: string;
  remoteUserAvatar?: string;
  remoteUserRoleTitle?: string;
}

export const ActiveConsultationRoom: React.FC<ActiveConsultationRoomProps> = ({
  appointment,
  cameraEnabled,
  micEnabled,
  speakerEnabled: _speakerEnabled,
  onToggleCamera,
  onToggleMic,
  onToggleSpeaker: _onToggleSpeaker,
  onOpenReportIssue,
  onOpenDeviceSettings,
  onEndCall,
  onNavigateRecords: _onNavigateRecords,
  currentRole = 'Patient',
  currentUserName,
  remoteUserName,
  remoteUserAvatar,
  remoteUserRoleTitle,
}) => {
  // LIVE TIMER TICKER
  const [callSeconds, setCallSeconds] = useState(1);

  // CONTROL STATES
  const [screenSharing, setScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'Excellent' | 'Good' | 'Poor' | 'Connecting' | 'Failed'>('Connecting');
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [mediaPermissionError, setMediaPermissionError] = useState<string | null>(null);

  // RIGHT PANEL STATES ('chat' | 'notes' | 'documents' | 'details' | null)
  const [activePanel, setActivePanel] = useState<'chat' | 'notes' | 'documents' | 'details' | null>('chat');

  // SHARED REAL-TIME CHAT STATE
  const [messages, setMessages] = useState<CallChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // NOTES STATE
  const [notesText, setNotesText] = useState('Patient reported mild fatigue and requested review of fasting glucose and vitals.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MORE MENU DROPDOWN
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // WEBRTC REFS
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // LIVEKIT REFS
  const roomRef = useRef<Room | null>(null);

  // Determine identities
  const isDoctor = currentRole === 'Doctor';
  const myName = currentUserName || (isDoctor ? appointment.doctor.name : 'Helen Persia');
  const otherPartyName = remoteUserName || (isDoctor ? 'Helen Persia' : appointment.doctor.name);
  const otherPartyAvatar = remoteUserAvatar || (isDoctor
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    : appointment.doctor.avatarUrl);
  const otherPartyTitle = remoteUserRoleTitle || (isDoctor ? 'Patient · Helen Persia (ABHA Verified)' : appointment.doctor.speciality);

  // Subscribe to real-time sync chat
  useEffect(() => {
    const unsub = teleConsultationService.subscribeChat((chatList) => {
      setMessages(chatList);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsub();
  }, []);

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // LiveKit Room Connection & Real-Time Audio/Video Initialization
  useEffect(() => {
    let isMounted = true;
    let room: Room | null = null;

    const connectLiveKit = async () => {
      try {
        setConnectionStatus('Connecting');
        setMediaPermissionError(null);

        // 1. Resolve consultationId from active session, fallback to API lookup
        let consultationId = teleConsultationService.getActiveSession()?.consultationId;
        
        if (!consultationId) {
          try {
            if (isDoctor) {
              const reqs = await videoConsultationApi.getDoctorRequests();
              const activeReq = reqs.find(
                (r: any) => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS' || r.status === 'WAITING_FOR_DOCTOR'
              );
              if (activeReq) consultationId = activeReq.id;
            } else {
              const reqs = await videoConsultationApi.getPatientRequests();
              const activeReq = reqs.find(
                (r: any) => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS' || r.status === 'WAITING_FOR_PATIENT'
              );
              if (activeReq) consultationId = activeReq.id;
            }
          } catch (e) {
            console.warn('[LiveKit] Fallback request query failed:', e);
          }
        }

        if (!consultationId) {
          consultationId = appointment.id;
        }

        // Join room on Socket.IO for status updates & notifications
        socketService.joinCallRoom(consultationId, teleConsultationService.getActiveSession()?.roomId);

        // 2. Fetch authenticated LiveKit token from backend
        const tokenData = await videoConsultationApi.getLiveKitToken(consultationId);
        if (!isMounted) return;

        // 2. Initialize LiveKit Client Room
        room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
          },
        });
        roomRef.current = room;

        // 3. Setup Participant and Track Event Listeners
        room.on(RoomEvent.Connected, () => {
          if (!isMounted) return;
          setConnectionStatus('Excellent');
          console.log('[LiveKit] Connected to room:', room?.name);
        });

        room.on(RoomEvent.Reconnecting, () => {
          if (!isMounted) return;
          setConnectionStatus('Connecting');
        });

        room.on(RoomEvent.Reconnected, () => {
          if (!isMounted) return;
          setConnectionStatus('Excellent');
        });

        room.on(RoomEvent.Disconnected, () => {
          if (!isMounted) return;
          setConnectionStatus('Poor');
        });

        // Remote track subscribed (attach video/audio elements)
        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
          if (!isMounted) return;
          if (track.kind === Track.Kind.Video) {
            if (remoteVideoRef.current) {
              track.attach(remoteVideoRef.current);
              setHasRemoteVideo(true);
            }
          } else if (track.kind === Track.Kind.Audio) {
            const audioElement = document.createElement('audio');
            audioElement.autoplay = true;
            track.attach(audioElement);
          }
        });

        // Remote track unsubscribed
        room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
          track.detach();
          if (track.kind === Track.Kind.Video) {
            setHasRemoteVideo(false);
          }
        });

        // 4. Connect to LiveKit Cloud Room
        await room.connect(tokenData.url, tokenData.token);
        if (!isMounted) {
          await room.disconnect();
          return;
        }

        // 5. Publish Local Camera and Microphone Tracks
        try {
          await room.localParticipant.enableCameraAndMicrophone();

          // Attach local camera stream to preview element
          const videoTrack = room.localParticipant.getTrackPublication(Track.Source.Camera)?.videoTrack;
          if (videoTrack && selfVideoRef.current) {
            videoTrack.attach(selfVideoRef.current);
          }

          // Apply initial toggle states
          if (!cameraEnabled) {
            await room.localParticipant.setCameraEnabled(false);
          }
          if (!micEnabled) {
            await room.localParticipant.setMicrophoneEnabled(false);
          }
        } catch (mediaErr: any) {
          console.warn('[LiveKit] Local media permission error:', mediaErr);
          setMediaPermissionError(mediaErr.message || 'Camera or microphone access denied');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('[LiveKit] Connection error:', err);
        setConnectionStatus('Failed');
        setMediaPermissionError(err.message || 'Failed to establish secure consultation connection');
      }
    };

    connectLiveKit();

    return () => {
      isMounted = false;
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [appointment.id]);

  // Sync mic track toggle with LiveKit room
  useEffect(() => {
    if (roomRef.current && roomRef.current.localParticipant) {
      roomRef.current.localParticipant.setMicrophoneEnabled(micEnabled).catch((e) => {
        console.warn('[LiveKit] Toggle mic error:', e);
      });
    }
  }, [micEnabled]);

  // Sync camera track toggle with LiveKit room
  useEffect(() => {
    if (roomRef.current && roomRef.current.localParticipant) {
      roomRef.current.localParticipant.setCameraEnabled(cameraEnabled).catch((e) => {
        console.warn('[LiveKit] Toggle camera error:', e);
      });
    }
  }, [cameraEnabled]);

  // KEYBOARD SHORTCUTS LISTENER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        onToggleMic();
        showToast(micEnabled ? 'Microphone Muted' : 'Microphone Unmuted');
      } else if (e.key === 'v' || e.key === 'V') {
        onToggleCamera();
        showToast(cameraEnabled ? 'Camera Turned Off' : 'Camera Turned On');
      } else if (e.key === 'c' || e.key === 'C') {
        setActivePanel((prev) => (prev === 'chat' ? null : 'chat'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraEnabled, micEnabled]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SEND CHAT MESSAGE
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const session = teleConsultationService.getActiveSession();
    const effectiveConsultationId = session?.consultationId || appointment.id;

    teleConsultationService.sendChatMessage(
      isDoctor ? 'Doctor' : 'Patient',
      myName,
      inputMessage.trim(),
      effectiveConsultationId
    );

    setInputMessage('');
    if (activePanel !== 'chat') {
      setUnreadCount((c) => c + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* TOAST NOTIFICATION */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none select-none max-w-md w-full px-4">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              className="pointer-events-auto select-auto bg-[#00a896] text-white px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 1. TOP HEADER BAR */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center shrink-0 w-3.5 h-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {otherPartyName}
              </h2>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-mono tracking-wide uppercase">
                {isDoctor ? 'Patient' : 'Attending Physician'}
              </span>
            </div>
            <p className="text-[11px] text-teal-400/90 font-medium truncate mt-0.5">
              {otherPartyTitle}
            </p>
          </div>
        </div>

        {/* TIMER & CONNECTION STATUS */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/90 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold text-cyan-300 tracking-wider">
              {formatTimer(callSeconds)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-xs font-semibold text-emerald-400 border border-slate-700/80 shadow-xs">
            <Wifi className="w-3.5 h-3.5 shrink-0" />
            <span>{connectionStatus} Connection</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONSULTATION WORKSPACE */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* REMOTE PARTY VIDEO AREA (FULL CONTAINER) */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Real WebRTC Remote Video Stream */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover absolute inset-0 ${hasRemoteVideo ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
          />

          {/* Placeholder / Connecting fallback view */}
          <div className={`w-full h-full relative flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950/40 ${hasRemoteVideo ? 'hidden' : 'flex'}`}>
            <div className="relative text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/40 shadow-2xl"
              >
                <img
                  src={otherPartyAvatar}
                  alt={otherPartyName}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  {connectionStatus === 'Connecting' ? 'CONNECTING HD STREAM...' : 'LIVE ENCRYPTED HD STREAM'}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">{otherPartyName}</h3>
                <p className="text-xs text-slate-400">{isDoctor ? 'Medicare Patient 360 Session' : appointment.doctor.hospital}</p>
                {mediaPermissionError && (
                  <p className="text-xs text-rose-400 mt-2 font-medium">Notice: {mediaPermissionError}</p>
                )}
              </div>
            </div>

            {/* SCREEN SHARE OVERLAY SIMULATION */}
            {screenSharing && (
              <div className="absolute inset-4 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-3xl p-6 flex items-center justify-center text-center space-y-3 z-20">
                <Monitor className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <h4 className="text-lg font-bold text-white">Live Screen Share Active</h4>
                <p className="text-xs text-slate-300">Sharing medical reports with {otherPartyName}</p>
              </div>
            )}
          </div>

          {/* SELF-VIEW FLOATING WEBRTC OVERLAY (TOP RIGHT) */}
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 0, top: 0, bottom: 200 }}
            className="absolute top-4 right-4 z-20 w-36 sm:w-48 aspect-video rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden cursor-move"
          >
            {cameraEnabled ? (
              <video
                ref={selfVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-2 text-center">
                <User className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-bold">You (Cam Off)</span>
              </div>
            )}

            <div className="absolute bottom-1 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-bold text-white font-mono">
              {myName} {!micEnabled && '(Muted)'}
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE PANELS (CHAT / NOTES / DOCUMENTS / DETAILS) */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-full sm:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between z-20 shadow-2xl"
            >
              {/* PANEL HEADER */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activePanel === 'chat' && <MessageSquare className="w-4 h-4 text-cyan-400" />}
                  {activePanel === 'notes' && <FileText className="w-4 h-4 text-teal-400" />}
                  {activePanel === 'documents' && <Paperclip className="w-4 h-4 text-amber-400" />}
                  {activePanel === 'details' && <Info className="w-4 h-4 text-cyan-400" />}
                  <h3 className="text-sm font-extrabold text-white capitalize">
                    {activePanel === 'chat' && 'Live Consultation Chat'}
                    {activePanel === 'notes' && 'Clinical Consultation Notes'}
                    {activePanel === 'documents' && 'Shared Records'}
                    {activePanel === 'details' && 'Encounter Info'}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePanel(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PANEL CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
                {activePanel === 'chat' && (
                  <div className="space-y-3">
                    {messages.map((m) => {
                      const isMe = m.senderName === myName || (isDoctor && m.sender === 'Doctor') || (!isDoctor && m.sender === 'Patient');
                      return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-400 font-bold mb-0.5">{m.senderName} • {m.timestamp}</span>
                          <div
                            className={`p-3 rounded-2xl max-w-[85%] font-medium text-xs leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-tr-xs'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-xs'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatBottomRef} />
                  </div>
                )}

                {activePanel === 'notes' && (
                  <div className="space-y-3">
                    <p className="text-slate-400 text-xs">Clinical consultation notes shared across session records.</p>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows={8}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                )}

                {activePanel === 'documents' && (
                  <div className="space-y-2">
                    {MOCK_SHARED_DOCUMENTS.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-xs">{doc.title}</p>
                          <p className="text-[10px] text-slate-400">{doc.date} • {doc.type}</p>
                        </div>
                        <span className="text-[10px] text-teal-400 font-mono font-bold">Encrypted PDF</span>
                      </div>
                    ))}
                  </div>
                )}

                {activePanel === 'details' && (
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Appointment ID</p>
                      <p className="font-mono text-xs font-bold text-teal-400">{appointment.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Doctor</p>
                      <p className="text-xs font-bold text-white">{appointment.doctor.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Patient</p>
                      <p className="text-xs font-bold text-white">{isDoctor ? otherPartyName : myName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CHAT INPUT AREA */}
              {activePanel === 'chat' && (
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${otherPartyName}...`}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM CONTROL BAR */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-center gap-3 z-30">
        {/* MIC TOGGLE */}
        <button
          onClick={onToggleMic}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            micEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
          }`}
          title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* CAMERA TOGGLE */}
        <button
          onClick={onToggleCamera}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            cameraEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
          }`}
          title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
        </button>

        {/* SCREEN SHARE */}
        <button
          onClick={() => setScreenSharing(!screenSharing)}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            screenSharing
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title={screenSharing ? 'Stop Screen Share' : 'Share Screen'}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* CHAT TOGGLE */}
        <button
          onClick={() => setActivePanel((prev) => (prev === 'chat' ? null : 'chat'))}
          className={`relative p-3.5 rounded-2xl transition-all cursor-pointer ${
            activePanel === 'chat'
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title="Toggle Consultation Chat"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && activePanel !== 'chat' && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* CLINICAL NOTES */}
        <button
          onClick={() => setActivePanel((prev) => (prev === 'notes' ? null : 'notes'))}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
            activePanel === 'notes'
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title="Toggle Consultation Notes"
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* MORE OPTIONS */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {moreMenuOpen && (
            <div className="absolute bottom-16 right-0 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 text-xs font-bold z-50">
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  onOpenDeviceSettings();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                Device Settings
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  onOpenReportIssue();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Report Technical Issue
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  setShortcutsModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Keyboard Shortcuts
              </button>
            </div>
          )}
        </div>

        {/* END CALL BUTTON */}
        <button
          onClick={() => onEndCall(callSeconds, notesText)}
          className="py-3.5 px-6 rounded-2xl font-extrabold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xl hover:shadow-rose-600/30 flex items-center gap-2 cursor-pointer ml-2"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="hidden sm:inline">End Consultation</span>
        </button>
      </div>

      {/* KEYBOARD SHORTCUTS MODAL */}
      {shortcutsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
              <button onClick={() => setShortcutsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Toggle Mute/Unmute:</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded font-mono text-cyan-400 border border-slate-700">M</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Toggle Camera On/Off:</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded font-mono text-cyan-400 border border-slate-700">V</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

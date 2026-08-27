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
import type { ConsultationAppointment, ChatMessage, SharedDocument } from './consultationData';
import { INITIAL_CHAT_MESSAGES, MOCK_SHARED_DOCUMENTS } from './consultationData';

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
}

export const ActiveConsultationRoom: React.FC<ActiveConsultationRoomProps> = ({
  appointment,
  cameraEnabled,
  micEnabled,
  speakerEnabled,
  onToggleCamera,
  onToggleMic,
  onToggleSpeaker,
  onOpenReportIssue,
  onOpenDeviceSettings,
  onEndCall,
  onNavigateRecords,
}) => {
  // LIVE TIMER TICKER
  const [callSeconds, setCallSeconds] = useState(1);

  // CONTROL STATES
  const [screenSharing, setScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'Excellent' | 'Good' | 'Poor'>('Excellent');

  // RIGHT PANEL STATES ('chat' | 'notes' | 'documents' | 'details' | null)
  const [activePanel, setActivePanel] = useState<'chat' | 'notes' | 'documents' | 'details' | null>('chat');

  // CHAT STATE
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [doctorTyping, setDoctorTyping] = useState(false);

  // NOTES STATE
  const [notesText, setNotesText] = useState('Patient reported mild fatigue and requested review of fasting glucose report.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MORE MENU DROPDOWN
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // WEBRTC SELF CAMERA REF
  const selfVideoRef = useRef<HTMLVideoElement>(null);

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebRTC camera stream for patient self-view
  useEffect(() => {
    let selfStream: MediaStream | null = null;
    if (cameraEnabled && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((s) => {
          selfStream = s;
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = s;
          }
        })
        .catch((err) => console.warn(err));
    }
    return () => {
      if (selfStream) {
        selfStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraEnabled]);

  // KEYBOARD SHORTCUTS LISTENER (M = Mute, V = Camera, C = Chat)
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

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'Patient',
      senderName: 'Samson L.',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate doctor response
    setDoctorTyping(true);
    setTimeout(() => {
      setDoctorTyping(false);
      const docReply: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'Doctor',
        senderName: appointment.doctor.name,
        text: 'Thank you for sharing. Everything looks stable on your blood parameters.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: activePanel === 'chat'
      };
      setMessages((prev) => [...prev, docReply]);
      if (activePanel !== 'chat') {
        setUnreadCount((c) => c + 1);
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#00a896] text-white px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER BAR */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">{appointment.doctor.name}</h2>
            <p className="text-[11px] text-teal-400 font-semibold">{appointment.doctor.speciality}</p>
          </div>
        </div>

        {/* TIMER & CONNECTION STATUS */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-extrabold text-cyan-400">{formatTimer(callSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-emerald-400 border border-slate-700">
            <Wifi className="w-3.5 h-3.5" />
            <span>{connectionStatus} Connection</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONSULTATION WORKSPACE */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* DOCTOR VIDEO AREA (FULL CONTAINER) */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* POLISHED ANIMATED DOCTOR PLACEHOLDER */}
          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950/40">
            <div className="relative text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/40 shadow-2xl"
              >
                <img
                  src={appointment.doctor.avatarUrl}
                  alt={appointment.doctor.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  LIVE CONSULTATION STREAM
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">{appointment.doctor.name}</h3>
                <p className="text-xs text-slate-400">{appointment.doctor.hospital}</p>
              </div>
            </div>

            {/* SCREEN SHARE OVERLAY SIMULATION */}
            {screenSharing && (
              <div className="absolute inset-4 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-3xl p-6 flex items-center justify-center text-center space-y-3">
                <Monitor className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <h4 className="text-lg font-bold text-white">Patient Screen Share Active</h4>
                <p className="text-xs text-slate-300">Sharing medical reports with {appointment.doctor.name}</p>
              </div>
            )}
          </div>

          {/* PATIENT FLOATING SELF-VIEW CARD (TOP RIGHT OVERLAY) */}
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
              You {!micEnabled && '(Muted)'}
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
                    {activePanel === 'chat' && 'Consultation Chat'}
                    {activePanel === 'notes' && 'Consultation Notes'}
                    {activePanel === 'documents' && 'Shared Records'}
                    {activePanel === 'details' && 'Appointment Details'}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePanel(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PANEL BODY CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* 1. CHAT PANEL */}
                {activePanel === 'chat' && (
                  <div className="flex flex-col h-full justify-between space-y-4">
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'Patient' ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-slate-400 mb-0.5">{msg.senderName} • {msg.timestamp}</span>
                          <div
                            className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                              msg.sender === 'Patient'
                                ? 'bg-[#00a896] text-white rounded-br-none'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {doctorTyping && (
                        <div className="text-[11px] text-cyan-400 font-semibold animate-pulse flex items-center gap-1.5">
                          <span>{appointment.doctor.name} is typing...</span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="p-2.5 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* 2. NOTES PANEL */}
                {activePanel === 'notes' && (
                  <div className="space-y-4">
                    <p className="text-slate-400 leading-relaxed">
                      Write private consultation notes for your personal health journal:
                    </p>
                    <textarea
                      rows={8}
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Add private notes..."
                      className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500 resize-none"
                    />
                    <button
                      onClick={() => showToast('✓ Consultation notes saved to health record')}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#00a896] hover:bg-teal-600 transition-colors shadow cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                )}

                {/* 3. DOCUMENTS PANEL */}
                {activePanel === 'documents' && (
                  <div className="space-y-3">
                    <p className="text-slate-400">Recently attached records shared with doctor:</p>
                    {MOCK_SHARED_DOCUMENTS.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white">{doc.title}</h4>
                          <p className="text-[10px] text-slate-400">{doc.date} • {doc.type}</p>
                        </div>
                        <button
                          onClick={onNavigateRecords}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-bold hover:bg-slate-700 cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. DETAILS PANEL */}
                {activePanel === 'details' && (
                  <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Doctor:</span>
                      <span className="font-bold text-white">{appointment.doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hospital:</span>
                      <span className="font-semibold text-slate-300">{appointment.doctor.hospital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Appointment ID:</span>
                      <span className="font-mono text-cyan-400 font-bold">{appointment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Elapsed Time:</span>
                      <span className="font-mono font-bold text-emerald-400">{formatTimer(callSeconds)}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM FLOATING CONTROL BAR */}
      <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-center gap-3 sm:gap-4 z-30">
        {/* MUTE */}
        <button
          onClick={onToggleMic}
          title="Mute / Unmute (Press M)"
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            micEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}
        >
          {micEnabled ? <Mic className="w-5 h-5 text-teal-400" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* CAMERA */}
        <button
          onClick={onToggleCamera}
          title="Turn Camera On / Off (Press V)"
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            cameraEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}
        >
          {cameraEnabled ? <Camera className="w-5 h-5 text-cyan-400" /> : <CameraOff className="w-5 h-5" />}
        </button>

        {/* SPEAKER */}
        <button
          onClick={onToggleSpeaker}
          title="Speaker Toggle"
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            speakerEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}
        >
          {speakerEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* SCREEN SHARE */}
        <button
          onClick={() => {
            setScreenSharing(!screenSharing);
            showToast(screenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
          }}
          title="Share Screen"
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            screenSharing ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
          }`}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* CHAT TOGGLE */}
        <button
          onClick={() => {
            setActivePanel((prev) => (prev === 'chat' ? null : 'chat'));
            setUnreadCount(0);
          }}
          title="Chat Panel (Press C)"
          className={`p-3.5 rounded-2xl border transition-all relative cursor-pointer ${
            activePanel === 'chat' ? 'bg-[#00a896] text-white border-teal-400' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* NOTES TOGGLE */}
        <button
          onClick={() => setActivePanel((prev) => (prev === 'notes' ? null : 'notes'))}
          title="Consultation Notes"
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activePanel === 'notes' ? 'bg-[#00a896] text-white border-teal-400' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
          }`}
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* MORE MENU DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            title="More Options"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
              <button onClick={() => setShortcutsModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Toggle Mute/Unmute:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[#00a896] dark:text-cyan-400 border border-slate-200 dark:border-slate-700">M</kbd>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Toggle Camera On/Off:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[#00a896] dark:text-cyan-400 border border-slate-200 dark:border-slate-700">V</kbd>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Toggle Fullscreen:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[#00a896] dark:text-cyan-400 border border-slate-200 dark:border-slate-700">F</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

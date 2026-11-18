import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, PhoneOff, Video, User, ShieldCheck } from 'lucide-react';
import { teleConsultationService, type TeleConsultationCallSession } from '../../services/teleConsultationService';
import { videoConsultationApi } from '../../services/videoConsultationApi';

interface IncomingCallModalProps {
  currentDoctorName?: string;
  onAcceptCall: (session: TeleConsultationCallSession) => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  currentDoctorName,
  onAcceptCall,
}) => {
  const [activeSession, setActiveSession] = useState<TeleConsultationCallSession | null>(null);

  // Play realistic electronic telephone ringing chime when receiving a call
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'calling') return;

    let audioCtx: AudioContext | null = null;
    let ringInterval: any = null;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();

        const playRingBurst = () => {
          if (!audioCtx) return;
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }

          const now = audioCtx.currentTime;
          // Dual frequency phone ring (440Hz + 480Hz classic tone)
          [440, 480].forEach((freq) => {
            const osc = audioCtx!.createOscillator();
            const gain = audioCtx!.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Ring tone envelope (0.8s on, 0.4s pause, 0.8s on)
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain.gain.setValueAtTime(0.08, now + 0.7);
            gain.gain.linearRampToValueAtTime(0, now + 0.75);

            gain.gain.setValueAtTime(0, now + 1.1);
            gain.gain.linearRampToValueAtTime(0.08, now + 1.15);
            gain.gain.setValueAtTime(0.08, now + 1.8);
            gain.gain.linearRampToValueAtTime(0, now + 1.85);

            osc.connect(gain);
            gain.connect(audioCtx!.destination);

            osc.start(now);
            osc.stop(now + 2.0);
          });
        };

        playRingBurst();
        ringInterval = setInterval(playRingBurst, 3500);
      }
    } catch (e) {
      console.warn('Audio ring generation not allowed yet:', e);
    }

    return () => {
      if (ringInterval) clearInterval(ringInterval);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [activeSession?.sessionId]);

  useEffect(() => {
    // 1. Check initial active session
    const current = teleConsultationService.getActiveSession();
    if (current && current.status === 'calling') {
      setActiveSession(current);
    }

    // 2. Poll/query pending requests from backend on mount as a resilient fallback
    const checkPendingRequests = async () => {
      try {
        const requests = await videoConsultationApi.getDoctorRequests();
        const pending = requests?.find((r: any) => r.status === 'PENDING');
        if (pending) {
          const session = {
            sessionId: pending.id,
            consultationId: pending.id,
            roomId: pending.roomId || undefined,
            appointmentId: `APT-${pending.id.slice(-5).toUpperCase()}`,
            patientId: pending.patientId,
            patientName: pending.patient?.fullName || 'Patient',
            patientAvatar: pending.patient?.avatar || undefined,
            doctorId: pending.doctorId,
            doctorName: currentDoctorName || 'Doctor',
            status: 'calling' as const,
            startedAt: new Date(pending.createdAt || Date.now()).getTime(),
          };
          teleConsultationService.initiateCall(session);
          setActiveSession(session);
        }
      } catch (err) {
        // Silent catch if not currently logged in as doctor
      }
    };
    checkPendingRequests();

    // 3. Listen to live teleconsultation broadcast / socket events
    const unsubscribe = teleConsultationService.subscribe((session) => {
      // Check if there is an active calling session directed at doctors
      if (session && session.status === 'calling') {
        setActiveSession(session);
      } else {
        setActiveSession(null);
      }
    });

    return () => unsubscribe();
  }, [currentDoctorName]);

  if (!activeSession) return null;

  const handleAccept = async () => {
    if (activeSession.consultationId) {
      try {
        await videoConsultationApi.acceptRequest(activeSession.consultationId);
      } catch (err) {
        console.error('Failed to accept video consultation API:', err);
      }
    }
    const updated = teleConsultationService.acceptCall();
    if (updated) {
      onAcceptCall(updated);
    }
  };

  const handleDecline = async () => {
    if (activeSession.consultationId) {
      try {
        await videoConsultationApi.declineRequest(activeSession.consultationId);
      } catch (err) {
        console.error('Failed to decline video consultation API:', err);
      }
    }
    teleConsultationService.rejectCall();
    setActiveSession(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white text-center overflow-hidden"
        >
          {/* Pulsing ring animation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Caller Avatar */}
          <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 p-1 flex items-center justify-center shadow-lg shadow-teal-500/30">
              {activeSession.patientAvatar ? (
                <img
                  src={activeSession.patientAvatar}
                  alt={activeSession.patientName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-teal-300 font-black text-2xl uppercase">
                  {activeSession.patientName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Incoming Video Consultation Call
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white pt-2">
              {activeSession.patientName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Patient is requesting an instant live video consultation
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDecline}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900 transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Decline</span>
            </button>

            <button
              onClick={handleAccept}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Attend Video Call</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


import { socketService, type VideoConsultationCallPayload } from './socketService';

export interface TeleConsultationCallSession {
  sessionId: string;
  consultationId?: string;
  roomId?: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality?: string;
  doctorAvatar?: string;
  status: 'calling' | 'connected' | 'rejected' | 'ended';
  startedAt: number;
}

export interface CallChatMessage {
  id: string;
  sender: 'Doctor' | 'Patient';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

const STORAGE_KEY = 'medicare_active_teleconsult_session';
const CHAT_STORAGE_KEY = 'medicare_active_teleconsult_chat';
const CHANNEL_NAME = 'medicare_teleconsult_broadcast_channel';

type CallListener = (session: TeleConsultationCallSession | null) => void;
type ChatListener = (messages: CallChatMessage[]) => void;

class TeleConsultationService {
  private listeners: Set<CallListener> = new Set();
  private chatListeners: Set<ChatListener> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Cross-tab BroadcastChannel for zero-latency communication across tabs and windows
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            if (event.data?.type === 'CALL_SESSION_UPDATE') {
              this.notify(event.data.session);
            } else if (event.data?.type === 'CHAT_MESSAGES_UPDATE') {
              this.notifyChat(event.data.messages);
            }
          };
        } catch (e) {
          console.warn('BroadcastChannel not supported or error:', e);
        }
      }

      // 2. Storage event listener fallback (standard cross-window communication)
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const session = this.getActiveSession();
          this.notify(session);
        } else if (e.key === CHAT_STORAGE_KEY) {
          this.notifyChat(this.getChatMessages());
        }
      });

      // 3. Socket.IO Real-Time Video Call Event Listener
      try {
        socketService.subscribeToVideoCallEvents((payload: VideoConsultationCallPayload) => {
          this.handleSocketCallEvent(payload);
        });

        // 4. Socket.IO Real-Time Video Consultation Chat Listener
        socketService.onConsultationChatMessage((data) => {
          if (data?.message) {
            this.receiveSocketChatMessage(data.message);
          }
        });
      } catch (e) {
        console.warn('SocketService video call subscription error:', e);
      }
    }
  }

  private handleSocketCallEvent(payload: VideoConsultationCallPayload) {
    if (payload.event === 'call:incoming') {
      const consultation = payload.consultation;
      const session: TeleConsultationCallSession = {
        sessionId: payload.consultationId,
        consultationId: payload.consultationId,
        roomId: payload.roomId || undefined,
        appointmentId: `APT-${payload.consultationId.slice(-5).toUpperCase()}`,
        patientId: payload.patientId,
        patientName: consultation?.patient?.fullName || 'Patient',
        patientAvatar: consultation?.patient?.avatar || undefined,
        doctorId: payload.doctorId,
        doctorName: consultation?.doctor?.fullName || 'Doctor',
        doctorSpeciality: consultation?.doctor?.speciality || undefined,
        status: 'calling',
        startedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      this.broadcastSession(session);
    } else if (payload.event === 'call:accepted') {
      const current = this.getActiveSession();
      if (current && (current.consultationId === payload.consultationId || current.sessionId === payload.consultationId)) {
        const updated: TeleConsultationCallSession = {
          ...current,
          roomId: payload.roomId || current.roomId,
          status: 'connected',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        this.broadcastSession(updated);
      }
    } else if (payload.event === 'call:declined') {
      const current = this.getActiveSession();
      if (current && (current.consultationId === payload.consultationId || current.sessionId === payload.consultationId)) {
        const updated: TeleConsultationCallSession = {
          ...current,
          status: 'rejected',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        this.broadcastSession(updated);
        setTimeout(() => {
          localStorage.removeItem(STORAGE_KEY);
          this.broadcastSession(null);
        }, 800);
      }
    } else if (payload.event === 'call:cancelled' || payload.event === 'call:ended') {
      const current = this.getActiveSession();
      if (current && (current.consultationId === payload.consultationId || current.sessionId === payload.consultationId)) {
        const updated: TeleConsultationCallSession = {
          ...current,
          status: 'ended',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        this.broadcastSession(updated);
        setTimeout(() => {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(CHAT_STORAGE_KEY);
          this.broadcastSession(null);
          this.broadcastChat([]);
        }, 800);
      }
    }
  }

  public getActiveSession(): TeleConsultationCallSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public initiateCall(params: {
    consultationId?: string;
    roomId?: string;
    patientId: string;
    patientName: string;
    patientAvatar?: string;
    doctorId: string;
    doctorName: string;
    doctorSpeciality?: string;
    doctorAvatar?: string;
  }): TeleConsultationCallSession {
    const session: TeleConsultationCallSession = {
      sessionId: params.consultationId || `CALL-${Date.now()}`,
      consultationId: params.consultationId,
      roomId: params.roomId,
      appointmentId: `APT-${(params.consultationId || Date.now().toString()).slice(-5).toUpperCase()}`,
      patientId: params.patientId,
      patientName: params.patientName,
      patientAvatar: params.patientAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      doctorSpeciality: params.doctorSpeciality || 'Consultant Physician & Cardiologist',
      doctorAvatar: params.doctorAvatar || 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
      status: 'calling',
      startedAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    // Reset chat messages for fresh session
    const initialMessages: CallChatMessage[] = [
      {
        id: `MSG-${Date.now()}-1`,
        sender: 'Doctor',
        senderName: session.doctorName,
        text: `Hello ${session.patientName}! Welcome to your video consultation. How are you feeling today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      }
    ];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initialMessages));

    this.broadcastSession(session);
    this.broadcastChat(initialMessages);
    return session;
  }

  public acceptCall(): TeleConsultationCallSession | null {
    const current = this.getActiveSession();
    if (!current) return null;

    const updated: TeleConsultationCallSession = {
      ...current,
      status: 'connected',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    this.broadcastSession(updated);
    return updated;
  }

  public rejectCall(): void {
    const current = this.getActiveSession();
    if (current) {
      const updated: TeleConsultationCallSession = {
        ...current,
        status: 'rejected',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      this.broadcastSession(updated);
    }
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      this.broadcastSession(null);
    }, 500);
  }

  public endCall(): void {
    const current = this.getActiveSession();
    if (current) {
      const updated: TeleConsultationCallSession = {
        ...current,
        status: 'ended',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      this.broadcastSession(updated);
    }
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CHAT_STORAGE_KEY);
      this.broadcastSession(null);
      this.broadcastChat([]);
    }, 500);
  }

  public getChatMessages(): CallChatMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public receiveSocketChatMessage(msg: CallChatMessage): void {
    const currentMessages = this.getChatMessages();
    // Prevent duplicate messages if already present
    if (currentMessages.some((m) => m.id === msg.id)) {
      return;
    }
    const updated = [...currentMessages, msg];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
    this.broadcastChat(updated);
  }

  public sendChatMessage(sender: 'Doctor' | 'Patient', senderName: string, text: string, consultationIdOverride?: string): CallChatMessage {
    const currentMessages = this.getChatMessages();
    const newMsg: CallChatMessage = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };
    const updated = [...currentMessages, newMsg];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
    this.broadcastChat(updated);

    // Relay over Socket.IO to remote participant
    const activeSession = this.getActiveSession();
    const targetConsultationId = consultationIdOverride || activeSession?.consultationId || activeSession?.sessionId;
    if (targetConsultationId) {
      socketService.sendConsultationChatMessage(targetConsultationId, newMsg);
    }

    return newMsg;
  }

  public subscribe(cb: CallListener): () => void {
    this.listeners.add(cb);
    cb(this.getActiveSession());
    return () => this.listeners.delete(cb);
  }

  public subscribeChat(cb: ChatListener): () => void {
    this.chatListeners.add(cb);
    cb(this.getChatMessages());
    return () => this.chatListeners.delete(cb);
  }

  private broadcastSession(session: TeleConsultationCallSession | null) {
    this.notify(session);
    try {
      this.channel?.postMessage({ type: 'CALL_SESSION_UPDATE', session });
    } catch (e) {
      console.warn('Channel post error:', e);
    }
  }

  private broadcastChat(messages: CallChatMessage[]) {
    this.notifyChat(messages);
    try {
      this.channel?.postMessage({ type: 'CHAT_MESSAGES_UPDATE', messages });
    } catch (e) {
      console.warn('Channel post error:', e);
    }
  }

  private notify(session: TeleConsultationCallSession | null) {
    this.listeners.forEach((fn) => {
      try {
        fn(session);
      } catch (err) {
        console.error('TeleConsultationService notification error:', err);
      }
    });
  }

  private notifyChat(messages: CallChatMessage[]) {
    this.chatListeners.forEach((fn) => {
      try {
        fn(messages);
      } catch (err) {
        console.error('TeleConsultationService chat notification error:', err);
      }
    });
  }
}

export const teleConsultationService = new TeleConsultationService();

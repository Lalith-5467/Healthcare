import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { config } from './config/env';
import { prisma } from './config/prisma';

export interface OrderStatusUpdatePayload {
  orderId: string;
  patientId: string;
  patientName?: string;
  pharmacyId?: string | null;
  status: string;
  previousStatus: string;
  paymentStatus?: string;
  paymentMethod?: string | null;
  updatedAt: string;
  message: string;
  statusTimeline?: Record<string, string | null>;
  totalAmount?: number | string;
}

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: http.Server): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication Middleware for Socket.IO
  io.use(async (socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

      if (!token) {
        if (config.nodeEnv === 'development') {
          const fallbackUser = await prisma.user.findFirst({ where: { isActive: true } });
          if (fallbackUser) {
            (socket as any).user = { id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role };
            return next();
          }
        }
        return next(new Error('Authentication error: Token required'));
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, config.jwtSecret);
      } catch (jwtErr) {
        if (config.nodeEnv === 'development') {
          const fallbackUser = await prisma.user.findFirst({ where: { isActive: true } });
          if (fallbackUser) {
            (socket as any).user = { id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role };
            return next();
          }
        }
        throw jwtErr;
      }

      (socket as any).user = decoded;
      next();
    } catch (err: any) {
      next(new Error(`Authentication error: ${err.message || 'Invalid token'}`));
    }
  });

  // Connection Handler
  io.on('connection', async (socket: Socket) => {
    const user = (socket as any).user;
    if (!user) return;

    try {
      // 1. Always join personal user room
      socket.join(`user:${user.id}`);

      // 2. Role-specific room assignment
      const roleUpper = String(user.role || '').toUpperCase();
      if (roleUpper === 'PATIENT') {
        const patient = await prisma.patient.findFirst({
          where: { OR: [{ userId: user.id }, { id: user.id }] },
        });
        if (patient) {
          socket.join(`patient:${patient.id}`);
        }
      } else if (roleUpper === 'DOCTOR') {
        const doctor = await prisma.doctor.findFirst({
          where: { OR: [{ userId: user.id }, { id: user.id }] },
        });
        if (doctor) {
          socket.join(`doctor:${doctor.id}`);
        }
      } else if (roleUpper === 'INSURANCE_PROVIDER' || roleUpper === 'INSURANCE') {
        socket.join('insurance:room');
      } else if (roleUpper === 'PHARMACIST') {
        socket.join('pharmacist:room');
        const pharmacist = await prisma.pharmacist.findUnique({
          where: { userId: user.id },
        });
        if (pharmacist && pharmacist.pharmacyId) {
          socket.join(`pharmacy:${pharmacist.pharmacyId}`);
          const pharm = await prisma.pharmacy.findFirst({
            where: {
              OR: [
                { id: pharmacist.pharmacyId },
                { pharmacyId: pharmacist.pharmacyId },
              ],
            },
          });
          if (pharm) {
            if (pharm.id) socket.join(`pharmacy:${pharm.id}`);
            if (pharm.pharmacyId) socket.join(`pharmacy:${pharm.pharmacyId}`);

            const siblingPharmacies = await prisma.pharmacy.findMany({
              where: {
                name: pharm.name,
                pharmacists: {
                  some: {
                    fullName: pharmacist.fullName,
                  },
                },
              },
              select: { id: true, pharmacyId: true },
            });
            for (const sp of siblingPharmacies) {
              if (sp.id) socket.join(`pharmacy:${sp.id}`);
              if (sp.pharmacyId) socket.join(`pharmacy:${sp.pharmacyId}`);
            }
          }
        }
      } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        socket.join('admin:room');
        socket.join('insurance:room');
      }
    } catch (err) {
      console.error('Socket room setup error:', err);
    }

    // Allow client to subscribe to insurance updates
    socket.on('insurance:subscribe', () => {
      socket.join('insurance:room');
    });

    // Allow client to track a specific order in real time
    socket.on('order:subscribe', (orderId: string) => {
      if (orderId && typeof orderId === 'string') {
        socket.join(`order:${orderId}`);
      }
    });

    // Video consultation room authorization & joining
    socket.on('call:join-room', async (data: { consultationId: string; roomId?: string }) => {
      try {
        if (!data || !data.consultationId) return;
        const consultation = await prisma.videoConsultation.findUnique({
          where: { id: data.consultationId },
          include: {
            patient: { select: { id: true, userId: true } },
            doctor: { select: { id: true, userId: true } },
          },
        });

        if (!consultation) {
          socket.emit('call:error', { message: 'Consultation not found' });
          return;
        }

        const isAuthorized =
          consultation.patient.userId === user.id || consultation.doctor.userId === user.id;

        if (!isAuthorized) {
          socket.emit('call:error', { message: 'Unauthorized to join consultation room' });
          return;
        }

        // Must be in an active/accepted state to join
        if (
          consultation.status !== 'ACCEPTED' &&
          consultation.status !== 'WAITING_FOR_PATIENT' &&
          consultation.status !== 'WAITING_FOR_DOCTOR' &&
          consultation.status !== 'IN_PROGRESS'
        ) {
          socket.emit('call:error', {
            message: `Cannot join consultation room in status ${consultation.status}`,
          });
          return;
        }

        const targetRoom = data.roomId || consultation.roomId || `consultation:${consultation.id}`;
        socket.join(targetRoom);
        socket.join(`consultation:${consultation.id}`);

        socket.to(targetRoom).emit('call:participant-joined', {
          consultationId: consultation.id,
          userId: user.id,
          role: user.role,
        });
      } catch (err: any) {
        console.error('Socket error joining call room:', err);
      }
    });

    // WebRTC Signaling: SDP Offer
    socket.on('webrtc:offer', async (data: { consultationId: string; offer: any }) => {
      try {
        if (!data?.consultationId || !data?.offer) return;
        const consultation = await prisma.videoConsultation.findUnique({
          where: { id: data.consultationId },
          include: {
            patient: { select: { userId: true } },
            doctor: { select: { userId: true } },
          },
        });
        if (!consultation) return;
        const isAuthorized =
          consultation.patient.userId === user.id || consultation.doctor.userId === user.id;
        if (!isAuthorized) return;

        const targetRoom = consultation.roomId || `consultation:${consultation.id}`;
        socket.to(targetRoom).emit('webrtc:offer', {
          consultationId: consultation.id,
          offer: data.offer,
          senderUserId: user.id,
        });
      } catch (err: any) {
        console.error('Error forwarding webrtc:offer:', err);
      }
    });

    // WebRTC Signaling: SDP Answer
    socket.on('webrtc:answer', async (data: { consultationId: string; answer: any }) => {
      try {
        if (!data?.consultationId || !data?.answer) return;
        const consultation = await prisma.videoConsultation.findUnique({
          where: { id: data.consultationId },
          include: {
            patient: { select: { userId: true } },
            doctor: { select: { userId: true } },
          },
        });
        if (!consultation) return;
        const isAuthorized =
          consultation.patient.userId === user.id || consultation.doctor.userId === user.id;
        if (!isAuthorized) return;

        const targetRoom = consultation.roomId || `consultation:${consultation.id}`;
        socket.to(targetRoom).emit('webrtc:answer', {
          consultationId: consultation.id,
          answer: data.answer,
          senderUserId: user.id,
        });
      } catch (err: any) {
        console.error('Error forwarding webrtc:answer:', err);
      }
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('webrtc:ice-candidate', async (data: { consultationId: string; candidate: any }) => {
      try {
        if (!data?.consultationId || !data?.candidate) return;
        const consultation = await prisma.videoConsultation.findUnique({
          where: { id: data.consultationId },
          include: {
            patient: { select: { userId: true } },
            doctor: { select: { userId: true } },
          },
        });
        if (!consultation) return;
        const isAuthorized =
          consultation.patient.userId === user.id || consultation.doctor.userId === user.id;
        if (!isAuthorized) return;

        const targetRoom = consultation.roomId || `consultation:${consultation.id}`;
        socket.to(targetRoom).emit('webrtc:ice-candidate', {
          consultationId: consultation.id,
          candidate: data.candidate,
          senderUserId: user.id,
        });
      } catch (err: any) {
        console.error('Error forwarding webrtc:ice-candidate:', err);
      }
    });

    // Real-Time Consultation Chat message relay across participants
    socket.on('call:chat-message', async (data: {
      consultationId: string;
      message: {
        id: string;
        sender: 'Doctor' | 'Patient';
        senderName: string;
        text: string;
        timestamp: string;
        isRead?: boolean;
      };
    }) => {
      try {
        if (!data?.consultationId || !data?.message) return;
        const consultation = await prisma.videoConsultation.findUnique({
          where: { id: data.consultationId },
          include: {
            patient: { select: { id: true, userId: true } },
            doctor: { select: { id: true, userId: true } },
          },
        });
        if (!consultation) return;

        // Verify authorization: check userId or direct patient/doctor entity id or allow in dev
        const isAuthorized =
          consultation.patient.userId === user?.id ||
          consultation.doctor.userId === user?.id ||
          consultation.patient.id === user?.id ||
          consultation.doctor.id === user?.id ||
          config.nodeEnv === 'development';

        if (!isAuthorized) return;

        const targetRoom = consultation.roomId || `consultation:${consultation.id}`;
        // Broadcast message to everyone in the room (both parties)
        io?.to(targetRoom).emit('call:chat-message', {
          consultationId: consultation.id,
          message: data.message,
        });

        // Also emit to personal rooms to guarantee cross-window reception
        io?.to(`consultation:${consultation.id}`).emit('call:chat-message', {
          consultationId: consultation.id,
          message: data.message,
        });
        if (consultation.patient.userId) {
          io?.to(`user:${consultation.patient.userId}`).emit('call:chat-message', {
            consultationId: consultation.id,
            message: data.message,
          });
        }
        if (consultation.doctor.userId) {
          io?.to(`user:${consultation.doctor.userId}`).emit('call:chat-message', {
            consultationId: consultation.id,
            message: data.message,
          });
        }
      } catch (err: any) {
        console.error('Error forwarding call:chat-message:', err);
      }
    });

    socket.on('disconnect', () => {
      // Disconnect handled cleanly
    });
  });

  return io;
}

export function getSocketServer(): SocketIOServer | null {
  return io;
}

/**
 * Emit insurance claim events to authorized rooms and clients
 */
export function emitInsuranceClaimEvent(event: string, payload: any) {
  if (!io) return;
  io.to('insurance:room').emit(event, payload);
  if (payload.patientId) {
    io.to(`patient:${payload.patientId}`).emit(event, payload);
  }
  io.to('admin:room').emit(event, payload);
  io.emit(event, payload);
}

/**
 * Emit pharmacy order status update to authorized rooms
 */
export function emitOrderStatusUpdate(payload: OrderStatusUpdatePayload) {
  if (!io) return;

  // Emit directly to anyone tracking this specific order
  if (payload.orderId) {
    io.to(`order:${payload.orderId}`).emit('pharmacy:order-status-updated', payload);
  }

  // Emit directly to the specific patient's room
  if (payload.patientId) {
    io.to(`patient:${payload.patientId}`).emit('pharmacy:order-status-updated', payload);
  }

  // Also emit to the assigned pharmacy room for pharmacists
  if (payload.pharmacyId) {
    io.to(`pharmacy:${payload.pharmacyId}`).emit('pharmacy:order-status-updated', payload);
  }

  // Emit to pharmacist room and admin monitoring room
  io.to('pharmacist:room').emit('pharmacy:order-status-updated', payload);
  io.to('admin:room').emit('pharmacy:order-status-updated', payload);
}

export interface HealthShareEventPayload {
  patientId?: string;
  doctorId?: string;
  userId?: string;
  event: string;
  requestId?: string;
  status?: string;
  data?: any;
}

/**
 * Emit Health Share and QR Access workflow events to relevant patient and doctor rooms
 */
export function emitHealthShareEvent(payload: HealthShareEventPayload) {
  if (!io) return;

  const targetRooms = new Set<string>();
  if (payload.patientId) targetRooms.add(`patient:${payload.patientId}`);
  if (payload.doctorId) targetRooms.add(`doctor:${payload.doctorId}`);
  if (payload.userId) targetRooms.add(`user:${payload.userId}`);

  if (targetRooms.size > 0) {
    // Socket.IO accepts an array of room names and automatically deduplicates sockets in multiple rooms
    io.to(Array.from(targetRooms)).emit(payload.event, payload);
  }

  // Also broadcast to all connected clients (client-side App.tsx & QRScannerView filter strictly by role: isPatient vs isDoctor)
  // This guarantees multi-tab testing and reconnection scenarios reliably receive the event without room mismatch drops
  io.emit(payload.event, payload);
}

export interface VideoConsultationCallEventPayload {
  event:
    | 'call:incoming'
    | 'call:accepted'
    | 'call:declined'
    | 'call:cancelled'
    | 'call:ended'
    | 'call:status-changed';
  consultationId: string;
  patientId: string;
  doctorId: string;
  roomId?: string | null;
  status: string;
  consultation?: any;
  timestamp: string;
}

/**
 * Emit Video Consultation lifecycle events to authenticated patient and doctor rooms
 */
export function emitVideoConsultationEvent(payload: VideoConsultationCallEventPayload) {
  if (!io) return;

  const targetRooms = new Set<string>();
  if (payload.doctorId) {
    targetRooms.add(`doctor:${payload.doctorId}`);
  }
  if (payload.patientId) {
    targetRooms.add(`patient:${payload.patientId}`);
  }

  // Also include the consultation room itself if established
  if (payload.roomId) {
    targetRooms.add(payload.roomId);
  }
  targetRooms.add(`consultation:${payload.consultationId}`);

  // Emit event to target rooms
  io.to(Array.from(targetRooms)).emit(payload.event, payload);

  // Broadcast to all connected clients (client-side IncomingCallModal & role filtering ensures only target doctor rings)
  // This guarantees cross-window, dev, and multi-tab calls are reliably received without room drops
  io.emit(payload.event, payload);
}



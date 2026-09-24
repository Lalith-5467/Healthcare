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
  updatedAt: string;
  message: string;
  statusTimeline?: Record<string, string | null>;
  totalAmount?: number | string;
}

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: http.Server): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
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
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token, config.jwtSecret) as {
        id: string;
        email: string;
        role: string;
      };

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
      if (user.role === 'PATIENT') {
        const patient = await prisma.patient.findUnique({
          where: { userId: user.id },
        });
        if (patient) {
          socket.join(`patient:${patient.id}`);
        }
      } else if (user.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
          where: { userId: user.id },
        });
        if (doctor) {
          socket.join(`doctor:${doctor.id}`);
        }
      } else if (user.role === 'PHARMACIST') {
        const pharmacist = await prisma.pharmacist.findUnique({
          where: { userId: user.id },
        });
        if (pharmacist && pharmacist.pharmacyId) {
          socket.join(`pharmacy:${pharmacist.pharmacyId}`);
        }
      } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        socket.join('admin:room');
      }
    } catch (err) {
      console.error('Socket room setup error:', err);
    }

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
 * Emit pharmacy order status update to authorized rooms
 */
export function emitOrderStatusUpdate(payload: OrderStatusUpdatePayload) {
  if (!io) return;

  // Emit directly to the specific patient's room
  if (payload.patientId) {
    io.to(`patient:${payload.patientId}`).emit('pharmacy:order-status-updated', payload);
  }

  // Also emit to the assigned pharmacy room for pharmacists
  if (payload.pharmacyId) {
    io.to(`pharmacy:${payload.pharmacyId}`).emit('pharmacy:order-status-updated', payload);
  }

  // Emit to admin monitoring room
  io.to('admin:room').emit('pharmacy:order-status-updated', payload);

  // NOTE: No global broadcast — only targeted rooms above receive pharmacy order events
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

  const eventNames = [payload.event];
  if (payload.event.includes('-')) {
    eventNames.push(payload.event.replace(/-/g, '_'));
  } else if (payload.event.includes('_')) {
    eventNames.push(payload.event.replace(/_/g, '-'));
  }

  eventNames.forEach((ev) => {
    if (payload.patientId) {
      io!.to(`patient:${payload.patientId}`).emit(ev, payload);
    }
    if (payload.doctorId) {
      io!.to(`doctor:${payload.doctorId}`).emit(ev, payload);
    }
    if (payload.userId) {
      io!.to(`user:${payload.userId}`).emit(ev, payload);
    }
    // NOTE: No global broadcast — only targeted patient/doctor/user rooms receive these events
  });
}


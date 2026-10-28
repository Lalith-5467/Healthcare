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


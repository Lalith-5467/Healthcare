import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthUser } from '../@types/express';
import { AuditService } from './audit.service';
import { PharmacyService } from './pharmacy.service';
import { emitOrderStatusUpdate } from '../socket';

const OrderStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

const ALLOWED_ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['ACCEPTED', 'DECLINED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['OUT_FOR_DELIVERY', 'READY_FOR_PICKUP', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'COMPLETED'],
  READY_FOR_PICKUP: ['COMPLETED', 'DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  DECLINED: [],
  CANCELLED: [],
};

const PrescriptionStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  REVIEWED: 'REVIEWED',
  CONFIRMED: 'CONFIRMED',
  PHARMACY_ORDER_CREATED: 'PHARMACY_ORDER_CREATED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PHARMACIST: 'PHARMACIST',
  CAREGIVER: 'CAREGIVER',
  INSURANCE_PROVIDER: 'INSURANCE_PROVIDER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export interface CreatePharmacyOrderInput {
  prescriptionId: string;
  pharmacyId: string; // can be internal cuid or public pharmacyId (e.g. "DHR-PH-00124")
  deliveryAddress?: string;
  deliveryType?: string;
}

export interface PharmacyOrderQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
  pharmacyId?: string;
  patientId?: string;
}

export class PharmacyOrderService {
  /**
   * Helper: verify pharmacist or admin authority for a specific order
   */
  private static async verifyPharmacistAuthority(
    order: { pharmacyId: string | null },
    user: AuthUser
  ) {
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      return;
    }

    if (user.role !== Role.PHARMACIST) {
      const err: AppError = new Error('Access denied: Only pharmacists or administrators can manage pharmacy orders');
      err.statusCode = 403;
      throw err;
    }

    const pharmacist = await prisma.pharmacist.findUnique({
      where: { userId: user.id },
    });

    if (!pharmacist || !pharmacist.pharmacyId) {
      const err: AppError = new Error('Access denied: Pharmacist profile is not associated with any registered pharmacy');
      err.statusCode = 403;
      throw err;
    }

    if (order.pharmacyId !== pharmacist.pharmacyId) {
      const err: AppError = new Error('Access denied: You can only manage orders assigned to your registered pharmacy');
      err.statusCode = 403;
      throw err;
    }
  }

  /**
   * Securely create a Pharmacy Order from a confirmed prescription
   */
  static async createPharmacyOrder(
    data: CreatePharmacyOrderInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    // 1. Fetch prescription with items and patient details
    const prescription = await prisma.prescription.findUnique({
      where: { id: data.prescriptionId },
      include: {
        items: true,
        patient: true,
      },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID "${data.prescriptionId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Patient ownership validation
    if (user.role === Role.PATIENT && prescription.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only order for your own prescription');
      err.statusCode = 403;
      throw err;
    }

    // 3. Status validation: MUST be in CONFIRMED status
    if (prescription.status !== PrescriptionStatus.CONFIRMED) {
      const err: AppError = new Error(
        `Prescription must be in CONFIRMED status to place an order. Current status is "${prescription.status}"`
      );
      err.statusCode = 400;
      throw err;
    }

    // 4. Validate prescription has items
    if (!prescription.items || prescription.items.length === 0) {
      const err: AppError = new Error('Cannot create pharmacy order: Prescription contains no items');
      err.statusCode = 400;
      throw err;
    }

    // 5. Selected pharmacy validation & eligibility check via dedicated verification service
    const pharmacy = await PharmacyService.validatePharmacyEligibility(data.pharmacyId);

    // 6. Duplicate order protection: Check if an active order already exists for this prescription
    const existingOrder = await prisma.pharmacyOrder.findFirst({
      where: {
        prescriptionId: prescription.id,
        status: { not: OrderStatus.CANCELLED },
      },
    });

    if (existingOrder) {
      const err: AppError = new Error(
        `A pharmacy order (${existingOrder.id}) has already been created for this prescription`
      );
      err.statusCode = 409;
      throw err;
    }

    // 7. Atomic Transaction: Create Order, create OrderItems, transition Prescription to PHARMACY_ORDER_CREATED
    const order = await prisma.$transaction(async (tx: any) => {
      const createdOrder = await tx.pharmacyOrder.create({
        data: {
          patientId: prescription.patientId,
          prescriptionId: prescription.id,
          pharmacyId: pharmacy.id,
          status: OrderStatus.PENDING,
          deliveryAddress: data.deliveryAddress || prescription.patient.address || 'Standard Delivery Address',
          deliveryType: data.deliveryType || 'Home Delivery',
          items: {
            create: prescription.items.map((item: any) => ({
              medicineId: item.medicineId || null,
              medicineName: item.medicineName,
              dosage: item.dosage,
              quantity: item.durationDays ? Math.max(1, Math.ceil(item.durationDays / 10)) : 1,
              unitPrice: 0.0,
              subtotal: 0.0,
            })),
          },
        },
        include: {
          items: true,
          pharmacy: {
            select: {
              id: true,
              pharmacyId: true,
              name: true,
              address: true,
              city: true,
              phone: true,
            },
          },
          patient: {
            select: {
              id: true,
              fullName: true,
              gender: true,
              bloodGroup: true,
            },
          },
        },
      });

      // Atomically update prescription status
      await tx.prescription.update({
        where: { id: prescription.id },
        data: { status: PrescriptionStatus.PHARMACY_ORDER_CREATED },
      });

      return createdOrder;
    });

    // 8. Audit Log
    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_ORDER_CREATED',
      entityType: 'pharmacy_orders',
      entityId: order.id,
      ipAddress,
      details: {
        prescriptionId: prescription.id,
        pharmacyId: pharmacy.pharmacyId,
        itemCount: order.items.length,
        status: order.status,
      },
    });

    // Realtime Socket.IO Event: notify pharmacist of incoming order
    emitOrderStatusUpdate({
      orderId: order.id,
      patientId: order.patientId,
      patientName: order.patient?.fullName,
      pharmacyId: order.pharmacyId,
      status: OrderStatus.PENDING,
      previousStatus: 'NEW',
      updatedAt: order.orderedAt.toISOString(),
      message: `New prescription order received #${order.id}`,
    });

    return order;
  }

  /**
   * Get pharmacy orders with strict patient/pharmacy isolation and pagination
   */
  static async getPharmacyOrders(
    options: PharmacyOrderQueryOptions,
    user: AuthUser
  ) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    // 1. Patient Isolation
    if (user.role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (!patient) {
        return { orders: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }

      where.patientId = patient.id;
    }
    // 2. Pharmacist Isolation: only see orders routed to their registered pharmacy
    else if (user.role === Role.PHARMACIST) {
      const pharmacist = await prisma.pharmacist.findUnique({
        where: { userId: user.id },
      });

      if (!pharmacist || !pharmacist.pharmacyId) {
        return { orders: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }

      where.pharmacyId = pharmacist.pharmacyId;
    }
    // 3. Admin filters
    else {
      if (options.patientId) where.patientId = options.patientId;
      if (options.pharmacyId) where.pharmacyId = options.pharmacyId;
    }

    if (options.status && Object.values(OrderStatus).includes(options.status.toUpperCase() as any)) {
      where.status = options.status.toUpperCase();
    }

    const [total, orders] = await Promise.all([
      prisma.pharmacyOrder.count({ where }),
      prisma.pharmacyOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderedAt: 'desc' },
        include: {
          items: true,
          pharmacy: {
            select: {
              id: true,
              pharmacyId: true,
              name: true,
              address: true,
              city: true,
              phone: true,
            },
          },
          patient: {
            select: {
              id: true,
              fullName: true,
              gender: true,
              bloodGroup: true,
            },
          },
          prescription: {
            select: {
              id: true,
              diagnosis: true,
              issuedAt: true,
            },
          },
        },
      }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Get single pharmacy order by ID with ownership validation
   */
  static async getPharmacyOrderById(
    id: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    const order = await prisma.pharmacyOrder.findUnique({
      where: { id },
      include: {
        items: true,
        pharmacy: true,
        patient: true,
        prescription: {
          include: {
            doctor: {
              select: {
                id: true,
                fullName: true,
                speciality: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      const err: AppError = new Error(`Pharmacy order with ID "${id}" not found`);
      err.statusCode = 404;
      throw err;
    }

    // Patient isolation check
    if (user.role === Role.PATIENT && order.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only view your own pharmacy orders');
      err.statusCode = 403;
      throw err;
    }

    // Pharmacist isolation check
    if (user.role === Role.PHARMACIST) {
      const pharmacist = await prisma.pharmacist.findUnique({
        where: { userId: user.id },
      });

      if (!pharmacist || order.pharmacyId !== pharmacist.pharmacyId) {
        const err: AppError = new Error('Access denied: You can only view orders assigned to your registered pharmacy');
        err.statusCode = 403;
        throw err;
      }
    }

    return order;
  }

  /**
   * Pharmacist accepts a PENDING order (PENDING -> ACCEPTED)
   */
  static async acceptPharmacyOrder(
    orderId: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    const order = await prisma.pharmacyOrder.findUnique({
      where: { id: orderId },
      include: { pharmacy: true },
    });

    if (!order) {
      const err: AppError = new Error(`Pharmacy order with ID "${orderId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    // Verify authority
    await this.verifyPharmacistAuthority(order, user);

    // Concurrency / state transition check in transaction
    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      const current = await tx.pharmacyOrder.findUnique({ where: { id: orderId } });
      if (!current) {
        const err: AppError = new Error(`Pharmacy order with ID "${orderId}" not found`);
        err.statusCode = 404;
        throw err;
      }

      if (current.status !== OrderStatus.PENDING) {
        const err: AppError = new Error(
          `Cannot accept order currently in status "${current.status}". Only PENDING orders can be accepted.`
        );
        err.statusCode = 400;
        throw err;
      }

      return tx.pharmacyOrder.update({
        where: { id: orderId },
        data: { status: OrderStatus.ACCEPTED as any },
        include: {
          items: true,
          pharmacy: true,
          patient: true,
          prescription: true,
        },
      });
    });

    // Audit Log
    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_ORDER_ACCEPTED',
      entityType: 'pharmacy_orders',
      entityId: updatedOrder.id,
      ipAddress,
      details: {
        orderId: updatedOrder.id,
        pharmacyId: updatedOrder.pharmacyId,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.ACCEPTED,
      },
    });

    // Realtime Socket.IO Event
    emitOrderStatusUpdate({
      orderId: updatedOrder.id,
      patientId: updatedOrder.patientId,
      patientName: updatedOrder.patient?.fullName,
      pharmacyId: updatedOrder.pharmacyId,
      status: OrderStatus.ACCEPTED,
      previousStatus: OrderStatus.PENDING,
      updatedAt: updatedOrder.updatedAt.toISOString(),
      message: 'Pharmacy accepted your medicine order.',
    });

    return updatedOrder;
  }

  /**
   * Pharmacist declines a PENDING order (PENDING -> DECLINED)
   */
  static async declinePharmacyOrder(
    orderId: string,
    reason: string | undefined,
    user: AuthUser,
    ipAddress?: string
  ) {
    const order = await prisma.pharmacyOrder.findUnique({
      where: { id: orderId },
      include: { pharmacy: true },
    });

    if (!order) {
      const err: AppError = new Error(`Pharmacy order with ID "${orderId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    await this.verifyPharmacistAuthority(order, user);

    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      const current = await tx.pharmacyOrder.findUnique({ where: { id: orderId } });
      if (!current) {
        const err: AppError = new Error(`Pharmacy order with ID "${orderId}" not found`);
        err.statusCode = 404;
        throw err;
      }

      if (current.status !== OrderStatus.PENDING) {
        const err: AppError = new Error(
          `Cannot decline order currently in status "${current.status}". Only PENDING orders can be declined.`
        );
        err.statusCode = 400;
        throw err;
      }

      return tx.pharmacyOrder.update({
        where: { id: orderId },
        data: { status: OrderStatus.DECLINED as any },
        include: {
          items: true,
          pharmacy: true,
          patient: true,
          prescription: true,
        },
      });
    });

    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_ORDER_DECLINED',
      entityType: 'pharmacy_orders',
      entityId: updatedOrder.id,
      ipAddress,
      details: {
        orderId: updatedOrder.id,
        pharmacyId: updatedOrder.pharmacyId,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.DECLINED,
        declineReason: reason || null,
      },
    });

    // Realtime Socket.IO Event
    emitOrderStatusUpdate({
      orderId: updatedOrder.id,
      patientId: updatedOrder.patientId,
      patientName: updatedOrder.patient?.fullName,
      pharmacyId: updatedOrder.pharmacyId,
      status: OrderStatus.DECLINED,
      previousStatus: OrderStatus.PENDING,
      updatedAt: updatedOrder.updatedAt.toISOString(),
      message: 'Pharmacy declined your medicine order.',
    });

    return updatedOrder;
  }

  /**
   * Update order status through valid state machine transitions
   */
  static async updatePharmacyOrderStatus(
    orderId: string,
    requestedStatus: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    const nextStatus = requestedStatus.toUpperCase();

    // Check valid enum value
    if (!Object.values(OrderStatus).includes(nextStatus as any)) {
      const err: AppError = new Error(`Invalid order status value: "${requestedStatus}"`);
      err.statusCode = 400;
      throw err;
    }

    const order = await prisma.pharmacyOrder.findUnique({
      where: { id: orderId },
      include: { pharmacy: true },
    });

    if (!order) {
      const err: AppError = new Error(`Pharmacy order with ID "${orderId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    await this.verifyPharmacistAuthority(order, user);

    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      const current = await tx.pharmacyOrder.findUnique({ where: { id: orderId } });
      if (!current) {
        const err: AppError = new Error(`Pharmacy order with ID "${orderId}" not found`);
        err.statusCode = 404;
        throw err;
      }

      const currentStatus = current.status;
      const allowedNextList = ALLOWED_ORDER_TRANSITIONS[currentStatus] || [];

      if (!allowedNextList.includes(nextStatus)) {
        const err: AppError = new Error(
          `Invalid status transition from "${currentStatus}" to "${nextStatus}". Allowed next statuses: [${allowedNextList.join(', ')}]`
        );
        err.statusCode = 400;
        throw err;
      }

      return tx.pharmacyOrder.update({
        where: { id: orderId },
        data: { status: nextStatus as any },
        include: {
          items: true,
          pharmacy: true,
          patient: true,
          prescription: true,
        },
      });
    });

    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_ORDER_STATUS_UPDATED',
      entityType: 'pharmacy_orders',
      entityId: updatedOrder.id,
      ipAddress,
      details: {
        orderId: updatedOrder.id,
        pharmacyId: updatedOrder.pharmacyId,
        previousStatus: order.status,
        newStatus: updatedOrder.status,
      },
    });

    // Realtime Socket.IO Event
    const statusMessages: Record<string, string> = {
      PREPARING: 'Your medicines are being prepared.',
      READY: 'Your medicines are ready.',
      READY_FOR_PICKUP: 'Your medicines are ready for pickup.',
      OUT_FOR_DELIVERY: 'Your medicine order is out for delivery.',
      DELIVERED: 'Your medicine order has been completed.',
      COMPLETED: 'Your medicine order has been completed.',
      CANCELLED: 'Your pharmacy order has been cancelled.',
    };

    emitOrderStatusUpdate({
      orderId: updatedOrder.id,
      patientId: updatedOrder.patientId,
      patientName: updatedOrder.patient?.fullName,
      pharmacyId: updatedOrder.pharmacyId,
      status: updatedOrder.status,
      previousStatus: order.status,
      updatedAt: updatedOrder.updatedAt.toISOString(),
      message: statusMessages[updatedOrder.status] || `Order status updated to ${updatedOrder.status}`,
    });

    return updatedOrder;
  }
}

import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthUser } from '../@types/express';
import { AuditService } from './audit.service';
import { PharmacyService } from './pharmacy.service';
import { CaregiverService } from './caregiver.service';
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
  DISPENSED: 'DISPENSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

const ALLOWED_ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['ACCEPTED', 'DECLINED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['OUT_FOR_DELIVERY', 'READY_FOR_PICKUP', 'DELIVERED', 'DISPENSED', 'COMPLETED', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DISPENSED', 'COMPLETED'],
  READY_FOR_PICKUP: ['DISPENSED', 'COMPLETED', 'DELIVERED'],
  DELIVERED: ['DISPENSED', 'COMPLETED'],
  DISPENSED: ['COMPLETED'],
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
   * Helper: Calculate real item unit prices, quantities, subtotals, and order total from MySQL medicine catalog
   */
  private static async calculateOrderItemsAndTotal(prescriptionItems: any[]): Promise<{
    itemsToCreate: Array<{
      medicineId: string | null;
      medicineName: string;
      dosage: string | null;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }>;
    totalAmount: number;
  }> {
    let total = 0;
    const itemsToCreate = [];

    for (const item of prescriptionItems) {
      let matchedMed: any = null;
      if (item.medicineId) {
        matchedMed = await prisma.medicine.findUnique({ where: { id: item.medicineId } });
      }
      if (!matchedMed && item.medicineName) {
        const cleanName = item.medicineName.trim();
        const firstWord = cleanName.split(/[\s-(]+/)[0];
        matchedMed = await prisma.medicine.findFirst({
          where: {
            OR: [
              { name: { contains: cleanName } },
              { genericName: { contains: cleanName } },
              ...(firstWord.length >= 3
                ? [
                    { name: { contains: firstWord } },
                    { genericName: { contains: firstWord } },
                  ]
                : []),
            ],
          },
        });
      }

      const unitPrice = matchedMed?.unitPrice ? Number(matchedMed.unitPrice) : 12.0;

      let dosesPerDay = 1;
      const freqLower = (item.frequency || '').toLowerCase();
      if (freqLower.includes('thrice') || freqLower.includes('3 times') || freqLower.includes('tds') || freqLower.includes('tid')) {
        dosesPerDay = 3;
      } else if (freqLower.includes('twice') || freqLower.includes('2 times') || freqLower.includes('bd') || freqLower.includes('bid')) {
        dosesPerDay = 2;
      } else if (freqLower.includes('four') || freqLower.includes('4 times') || freqLower.includes('qid')) {
        dosesPerDay = 4;
      }

      const durationDays = item.durationDays && item.durationDays > 0 ? item.durationDays : 7;
      const calculatedQty = Math.max(1, durationDays * dosesPerDay);
      let parsedQty = 0;
      if (item.instructions) {
        const match = item.instructions.match(/\[?Qty:\s*(\d+)\]?/i);
        if (match) parsedQty = parseInt(match[1], 10);
      }
      const quantity = (item.quantity && item.quantity > 0)
        ? item.quantity
        : (parsedQty > 0 ? parsedQty : calculatedQty);
      const subtotal = Number((quantity * unitPrice).toFixed(2));

      total += subtotal;

      itemsToCreate.push({
        medicineId: matchedMed?.id || item.medicineId || null,
        medicineName: item.medicineName,
        dosage: item.dosage || matchedMed?.dosage || null,
        quantity,
        unitPrice,
        subtotal,
      });
    }

    return { itemsToCreate, totalAmount: Number(total.toFixed(2)) };
  }

  /**
   * Helper: Construct real status timestamps from database audit logs and order timestamps
   */
  private static async buildOrderTimeline(orderId: string, order: any): Promise<Record<string, string | null>> {
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        entityType: 'pharmacy_orders',
        entityId: orderId,
      },
      orderBy: { createdAt: 'asc' },
    });

    const timelineTimestamps: Record<string, string | null> = {
      TRANSMITTED: order.orderedAt ? new Date(order.orderedAt).toISOString() : null,
      PENDING: order.orderedAt ? new Date(order.orderedAt).toISOString() : null,
      ACCEPTED: null,
      PREPARING: null,
      READY: null,
      READY_FOR_PICKUP: null,
      OUT_FOR_DELIVERY: null,
      DELIVERED: null,
      COMPLETED: null,
      DECLINED: null,
      CANCELLED: null,
    };

    for (const log of auditLogs) {
      const iso = new Date(log.createdAt).toISOString();
      if (log.action === 'PHARMACY_ORDER_CREATED') {
        timelineTimestamps.TRANSMITTED = iso;
        timelineTimestamps.PENDING = iso;
      } else if (log.action === 'PHARMACY_ORDER_ACCEPTED') {
        timelineTimestamps.ACCEPTED = iso;
      } else if (log.action === 'PHARMACY_ORDER_DECLINED') {
        timelineTimestamps.DECLINED = iso;
      } else if (log.action === 'PHARMACY_ORDER_STATUS_UPDATED') {
        let details: any = {};
        try {
          details = typeof log.details === 'string' ? JSON.parse(log.details) : (log.details || {});
        } catch {}
        const st = (details.newStatus || details.status || '').toUpperCase();
        if (st && timelineTimestamps.hasOwnProperty(st)) {
          timelineTimestamps[st] = iso;
          if (st === 'READY') timelineTimestamps.READY_FOR_PICKUP = iso;
          if (st === 'READY_FOR_PICKUP') timelineTimestamps.READY = iso;
        }
      }
    }

    // Ensure active status has an authoritative timestamp if not recorded in audit log
    const cur = (order.status || '').toUpperCase();
    const orderUpdatedIso = order.updatedAt ? new Date(order.updatedAt).toISOString() : new Date().toISOString();

    if (timelineTimestamps.hasOwnProperty(cur) && !timelineTimestamps[cur]) {
      timelineTimestamps[cur] = orderUpdatedIso;
      if (cur === 'READY') timelineTimestamps.READY_FOR_PICKUP = orderUpdatedIso;
      if (cur === 'READY_FOR_PICKUP') timelineTimestamps.READY = orderUpdatedIso;
    }

    return timelineTimestamps;
  }

  /**
   * Helper: Hydrate order with real total calculation and authoritative status timeline
   */
  private static async hydrateOrder(order: any): Promise<any> {
    if (!order) return order;

    // 1. If totalAmount is 0 or items have 0 unitPrice, dynamically calculate and persist
    if ((Number(order.totalAmount) === 0 || !order.totalAmount) && order.items && order.items.length > 0) {
      let newTotal = 0;
      for (const it of order.items) {
        if (Number(it.unitPrice) === 0 || Number(it.subtotal) === 0) {
          let med: any = null;
          if (it.medicineId) {
            med = await prisma.medicine.findUnique({ where: { id: it.medicineId } });
          }
          if (!med && it.medicineName) {
            const firstWord = it.medicineName.trim().split(/[\s-(]+/)[0];
            med = await prisma.medicine.findFirst({
              where: {
                OR: [
                  { name: { contains: it.medicineName.trim() } },
                  { genericName: { contains: it.medicineName.trim() } },
                  ...(firstWord.length >= 3 ? [{ name: { contains: firstWord } }, { genericName: { contains: firstWord } }] : []),
                ],
              },
            });
          }
          const price = med?.unitPrice ? Number(med.unitPrice) : 12.0;
          const qty = it.quantity && it.quantity > 0 ? it.quantity : 10;
          const sub = Number((qty * price).toFixed(2));
          
          try {
            await prisma.pharmacyOrderItem.update({
              where: { id: it.id },
              data: { unitPrice: price, subtotal: sub },
            });
          } catch {}

          it.unitPrice = price;
          it.subtotal = sub;
          newTotal += sub;
        } else {
          newTotal += Number(it.subtotal);
        }
      }

      if (newTotal > 0) {
        newTotal = Number(newTotal.toFixed(2));
        try {
          await prisma.pharmacyOrder.update({
            where: { id: order.id },
            data: { totalAmount: newTotal },
          });
        } catch {}
        order.totalAmount = newTotal;
      }
    }

    // 2. Attach statusTimeline and payment information
    const statusTimeline = await this.buildOrderTimeline(order.id, order);
    return {
      ...order,
      paymentStatus: order.paymentStatus || 'PENDING',
      paymentMethod: order.paymentMethod || null,
      paidAt: order.paidAt ? new Date(order.paidAt).toISOString() : null,
      payments: order.payments || [],
      statusTimeline,
      timeline: statusTimeline,
    };
  }

  /**
   * Helper: verify pharmacist or admin authority for a specific order
   */
  private static async verifyPharmacistAuthority(
    order: { pharmacyId: string | null; pharmacy?: any },
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

    let pharmacist = await prisma.pharmacist.findUnique({
      where: { userId: user.id },
      include: { pharmacy: true },
    });

    if (!pharmacist) {
      const err: AppError = new Error('Access denied: Pharmacist profile not found');
      err.statusCode = 403;
      throw err;
    }

    if (!pharmacist.pharmacyId) {
      const err: AppError = new Error('Access denied: Pharmacist profile is not associated with a registered pharmacy');
      err.statusCode = 403;
      throw err;
    }

    const isMatch =
      order.pharmacyId &&
      (order.pharmacyId === pharmacist.pharmacyId ||
        order.pharmacyId === pharmacist.pharmacy?.id ||
        order.pharmacyId === pharmacist.pharmacy?.pharmacyId ||
        (order.pharmacy && pharmacist.pharmacy && order.pharmacy.pharmacyId === pharmacist.pharmacy.pharmacyId) ||
        (order.pharmacy && pharmacist.pharmacy && order.pharmacy.id === pharmacist.pharmacy.id) ||
        (order.pharmacy && pharmacist.pharmacy && order.pharmacy.name.toLowerCase() === pharmacist.pharmacy.name.toLowerCase()));

    if (!isMatch) {
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

    // 2. Patient / Caregiver / Clinician ownership validation
    if (user.role === Role.PATIENT) {
      const ownPat = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (prescription.patient.userId !== user.id && (!ownPat || ownPat.id !== prescription.patientId)) {
        const err: AppError = new Error('Access denied: You can only order for your own prescription');
        err.statusCode = 403;
        throw err;
      }
    } else if (user.role === Role.CAREGIVER) {
      await CaregiverService.validateCaregiverAccess(user.id, user.role as any, prescription.patientId);
    }
    // Doctors, Nurses, and Admins are permitted to route confirmed prescriptions to pharmacies on behalf of patients

    // 3. Duplicate order protection: Check if an active order already exists for this prescription
    const existingOrder = await prisma.pharmacyOrder.findFirst({
      where: {
        prescriptionId: prescription.id,
        status: { not: OrderStatus.CANCELLED },
      },
    });

    if (existingOrder || prescription.status === PrescriptionStatus.PHARMACY_ORDER_CREATED) {
      const err: AppError = new Error(
        `A pharmacy order${existingOrder ? ` (${existingOrder.id})` : ''} has already been created for this prescription`
      );
      err.statusCode = 409;
      throw err;
    }

    // 4. Status validation: MUST be in CONFIRMED status
    if (prescription.status !== PrescriptionStatus.CONFIRMED) {
      const err: AppError = new Error(
        `Prescription must be in CONFIRMED status to place an order. Current status is "${prescription.status}"`
      );
      err.statusCode = 400;
      throw err;
    }

    // 5. Validate prescription has items
    if (!prescription.items || prescription.items.length === 0) {
      const err: AppError = new Error('Cannot create pharmacy order: Prescription contains no items');
      err.statusCode = 400;
      throw err;
    }

    // 6. Selected pharmacy validation & eligibility check via dedicated verification service
    const pharmacy = await PharmacyService.validatePharmacyEligibility(data.pharmacyId);

    // 7. Calculate real medicine item prices and total amount from catalogue
    const { itemsToCreate, totalAmount } = await this.calculateOrderItemsAndTotal(prescription.items);

    // 8. Atomic Transaction: Create Order, create OrderItems, transition Prescription to PHARMACY_ORDER_CREATED
    const order = await prisma.$transaction(async (tx: any) => {
      const createdOrder = await tx.pharmacyOrder.create({
        data: {
          patientId: prescription.patientId,
          prescriptionId: prescription.id,
          pharmacyId: pharmacy.id,
          status: OrderStatus.PENDING,
          totalAmount,
          deliveryAddress: data.deliveryAddress || prescription.patient.address || 'Standard Delivery Address',
          deliveryType: data.deliveryType || 'Home Delivery',
          items: {
            create: itemsToCreate,
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

    const hydratedOrder = await this.hydrateOrder(order);

    // Realtime Socket.IO Event: notify pharmacist of incoming order
    emitOrderStatusUpdate({
      orderId: hydratedOrder.id,
      patientId: hydratedOrder.patientId,
      patientName: hydratedOrder.patient?.fullName,
      pharmacyId: hydratedOrder.pharmacyId,
      status: OrderStatus.PENDING,
      previousStatus: 'NEW',
      updatedAt: hydratedOrder.orderedAt ? new Date(hydratedOrder.orderedAt).toISOString() : new Date().toISOString(),
      message: `New prescription order received #${hydratedOrder.id}`,
      statusTimeline: hydratedOrder.statusTimeline,
      totalAmount: hydratedOrder.totalAmount,
    });

    // Notify Patient
    if (prescription.patient?.userId) {
      await prisma.notification.create({
        data: {
          userId: prescription.patient.userId,
          title: 'Pharmacy Order Placed',
          message: `Your prescription order #${hydratedOrder.id.slice(-6)} has been placed with ${pharmacy.name}.`,
          type: 'ORDER',
          category: 'Pharmacy',
          relatedModule: `orders:${hydratedOrder.id}`,
        },
      });
    }

    // Notify Pharmacists of that pharmacy
    const pharmacists = await prisma.pharmacist.findMany({ where: { pharmacyId: pharmacy.id } });
    for (const ph of pharmacists) {
      await prisma.notification.create({
        data: {
          userId: ph.userId,
          title: 'New Pharmacy Order Received',
          message: `Order #${hydratedOrder.id.slice(-6)} from ${prescription.patient?.fullName || 'Patient'} (${hydratedOrder.items.length} items) is ready for fulfillment.`,
          type: 'ORDER',
          category: 'Pharmacy',
          relatedModule: `orders:${hydratedOrder.id}`,
        },
      });
    }

    return hydratedOrder;
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

      const pharm = await prisma.pharmacy.findFirst({
        where: {
          OR: [
            { id: pharmacist.pharmacyId },
            { pharmacyId: pharmacist.pharmacyId },
          ],
        },
      });
      const matchedIds: string[] = [pharmacist.pharmacyId];
      if (pharm) {
        if (pharm.id) matchedIds.push(pharm.id);
        if (pharm.pharmacyId) matchedIds.push(pharm.pharmacyId);

        // Include sibling pharmacy IDs sharing the same registered pharmacy name and pharmacist identity
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
          if (sp.id) matchedIds.push(sp.id);
          if (sp.pharmacyId) matchedIds.push(sp.pharmacyId);
        }
      }
      where.pharmacyId = { in: Array.from(new Set(matchedIds)) };
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

    const hydratedOrders = await Promise.all(orders.map((o) => this.hydrateOrder(o)));

    return {
      orders: hydratedOrders,
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
      let pharmacist = await prisma.pharmacist.findUnique({
        where: { userId: user.id },
        include: { pharmacy: true },
      });

      if (!pharmacist) {
        const err: AppError = new Error('Access denied: Pharmacist profile not found');
        err.statusCode = 403;
        throw err;
      }

      if (!pharmacist || !pharmacist.pharmacyId) {
        const err: AppError = new Error('Access denied: Pharmacist profile is not associated with a registered pharmacy');
        err.statusCode = 403;
        throw err;
      }

      const isMatch =
        order.pharmacyId &&
        (order.pharmacyId === pharmacist.pharmacyId ||
          order.pharmacyId === pharmacist.pharmacy?.id ||
          order.pharmacyId === pharmacist.pharmacy?.pharmacyId ||
          (order.pharmacy && pharmacist.pharmacy && order.pharmacy.pharmacyId === pharmacist.pharmacy.pharmacyId) ||
          (order.pharmacy && pharmacist.pharmacy && order.pharmacy.id === pharmacist.pharmacy.id));

      if (!isMatch) {
        const err: AppError = new Error('Access denied: You can only view orders assigned to your registered pharmacy');
        err.statusCode = 403;
        throw err;
      }
    }

    return this.hydrateOrder(order);
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

    const hydrated = await this.hydrateOrder(updatedOrder);

    // Realtime Socket.IO Event
    emitOrderStatusUpdate({
      orderId: hydrated.id,
      patientId: hydrated.patientId,
      patientName: hydrated.patient?.fullName,
      pharmacyId: hydrated.pharmacyId,
      status: OrderStatus.ACCEPTED,
      previousStatus: OrderStatus.PENDING,
      updatedAt: hydrated.updatedAt ? new Date(hydrated.updatedAt).toISOString() : new Date().toISOString(),
      message: 'Pharmacy accepted your medicine order.',
      statusTimeline: hydrated.statusTimeline,
      totalAmount: hydrated.totalAmount,
    });

    return hydrated;
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

    const hydrated = await this.hydrateOrder(updatedOrder);

    // Realtime Socket.IO Event
    emitOrderStatusUpdate({
      orderId: hydrated.id,
      patientId: hydrated.patientId,
      patientName: hydrated.patient?.fullName,
      pharmacyId: hydrated.pharmacyId,
      status: OrderStatus.DECLINED,
      previousStatus: OrderStatus.PENDING,
      updatedAt: hydrated.updatedAt ? new Date(hydrated.updatedAt).toISOString() : new Date().toISOString(),
      message: 'Pharmacy declined your medicine order.',
      statusTimeline: hydrated.statusTimeline,
      totalAmount: hydrated.totalAmount,
    });

    return hydrated;
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

      // DISPENSING RULE:
      // A medicine order must NOT be marked as dispensed or completed while payment is still pending.
      if (['DISPENSED', 'COMPLETED', 'DELIVERED'].includes(nextStatus)) {
        if (current.paymentStatus !== 'PAID') {
          const err: AppError = new Error(
            `Cannot dispense order #${orderId.slice(-6)}: Payment is still pending (status: ${current.paymentStatus || 'PENDING'}). Successful payment must be verified before medicines can be dispensed.`
          );
          err.statusCode = 400;
          throw err;
        }
      }

      console.log(`[PharmacyOrder Lifecycle] Order ID: ${orderId} | Previous status: ${currentStatus} | New status: ${nextStatus}`);

      const result = await tx.pharmacyOrder.update({
        where: { id: orderId },
        data: { status: nextStatus as any },
        include: {
          items: true,
          pharmacy: true,
          patient: true,
          prescription: true,
        },
      });

      console.log(`[PharmacyOrder Lifecycle] Confirmed DB status: ${result.status} for Order ID: ${orderId}`);
      return result;
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

    const hydrated = await this.hydrateOrder(updatedOrder);

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
      orderId: hydrated.id,
      patientId: hydrated.patientId,
      patientName: hydrated.patient?.fullName,
      pharmacyId: hydrated.pharmacyId,
      status: hydrated.status,
      previousStatus: order.status,
      updatedAt: hydrated.updatedAt ? new Date(hydrated.updatedAt).toISOString() : new Date().toISOString(),
      message: statusMessages[hydrated.status] || `Order status updated to ${hydrated.status}`,
      statusTimeline: hydrated.statusTimeline,
      totalAmount: hydrated.totalAmount,
    });

    // Notify Patient
    if (hydrated.patient?.userId) {
      await prisma.notification.create({
        data: {
          userId: hydrated.patient.userId,
          title: 'Pharmacy Order Update',
          message: statusMessages[hydrated.status] || `Your order #${hydrated.id.slice(-6)} is now ${hydrated.status.replace(/_/g, ' ')}.`,
          type: 'ORDER',
          category: 'Pharmacy',
          relatedModule: `orders:${hydrated.id}`,
        },
      });
    }

    return hydrated;
  }

  /**
   * Get itemised bill and payment calculation with real database pricing
   */
  static async getPharmacyOrderBill(id: string, user: AuthUser) {
    const order: any = await (prisma.pharmacyOrder as any).findUnique({
      where: { id },
      include: {
        items: true,
        pharmacy: true,
        patient: true,
        payments: { orderBy: { createdAt: 'desc' } },
        prescription: {
          include: {
            doctor: {
              select: { id: true, fullName: true, speciality: true },
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
      const err: AppError = new Error('Access denied: You can only view billing for your own pharmacy orders');
      err.statusCode = 403;
      throw err;
    }

    // Recalculate genuine unit prices and subtotals directly from DB
    let calculatedSubtotal = 0;
    const itemisedBill = [];

    for (const item of order.items) {
      let matchedMed: any = null;
      if (item.medicineId) {
        matchedMed = await prisma.medicine.findUnique({ where: { id: item.medicineId } });
      }
      if (!matchedMed && item.medicineName) {
        const cleanName = item.medicineName.trim();
        const firstWord = cleanName.split(/[\s-(]+/)[0];
        matchedMed = await prisma.medicine.findFirst({
          where: {
            OR: [
              { name: { contains: cleanName } },
              { genericName: { contains: cleanName } },
              ...(firstWord.length >= 3 ? [{ name: { contains: firstWord } }, { genericName: { contains: firstWord } }] : []),
            ],
          },
        });
      }

      const unitPrice = matchedMed?.unitPrice ? Number(matchedMed.unitPrice) : (Number(item.unitPrice) > 0 ? Number(item.unitPrice) : 12.0);
      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
      const subtotal = Number((quantity * unitPrice).toFixed(2));
      calculatedSubtotal += subtotal;

      itemisedBill.push({
        id: item.id,
        medicineId: item.medicineId || matchedMed?.id || null,
        medicineName: item.medicineName,
        dosage: item.dosage,
        quantity,
        unitPrice,
        subtotal,
      });
    }

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2));

    if (Number(order.totalAmount) !== calculatedSubtotal && calculatedSubtotal > 0) {
      try {
        await prisma.pharmacyOrder.update({
          where: { id: order.id },
          data: { totalAmount: calculatedSubtotal },
        });
        order.totalAmount = calculatedSubtotal as any;
      } catch {}
    }

    return {
      orderId: order.id,
      prescriptionId: order.prescriptionId,
      orderedAt: order.orderedAt,
      status: order.status,
      paymentStatus: order.paymentStatus || 'PENDING',
      paymentMethod: order.paymentMethod || null,
      paidAt: order.paidAt ? new Date(order.paidAt).toISOString() : null,
      patient: {
        id: order.patient.id,
        fullName: order.patient.fullName,
        gender: order.patient.gender,
        bloodGroup: order.patient.bloodGroup,
      },
      pharmacy: order.pharmacy ? {
        id: order.pharmacy.id,
        pharmacyId: order.pharmacy.pharmacyId,
        name: order.pharmacy.name,
        address: order.pharmacy.address,
        city: order.pharmacy.city,
        phone: order.pharmacy.phone,
      } : null,
      doctor: order.prescription?.doctor ? {
        id: order.prescription.doctor.id,
        fullName: order.prescription.doctor.fullName,
        speciality: order.prescription.doctor.speciality,
      } : null,
      items: itemisedBill,
      subtotal: calculatedSubtotal,
      taxAmount: 0.0,
      finalAmount: calculatedSubtotal,
      payments: order.payments || [],
    };
  }

  /**
   * Process pharmacy payment (Patient / Caregiver) with strict backend recalculation
   */
  static async processPharmacyOrderPayment(
    id: string,
    paymentData: { paymentMethod: string; transactionRef?: string; notes?: string },
    user: AuthUser,
    ipAddress?: string
  ) {
    const order: any = await prisma.pharmacyOrder.findUnique({
      where: { id },
      include: {
        items: true,
        patient: true,
        pharmacy: true,
      },
    });

    if (!order) {
      const err: AppError = new Error(`Pharmacy order with ID "${id}" not found`);
      err.statusCode = 404;
      throw err;
    }

    // Verify patient ownership
    if (user.role === Role.PATIENT && order.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only pay for your own pharmacy orders');
      err.statusCode = 403;
      throw err;
    }

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DECLINED) {
      const err: AppError = new Error(`Cannot process payment for an order in status "${order.status}"`);
      err.statusCode = 400;
      throw err;
    }

    // Prevent duplicate payment
    if (order.paymentStatus === 'PAID') {
      const err: AppError = new Error('This pharmacy order has already been paid in full');
      err.statusCode = 400;
      throw err;
    }

    // RECALCULATE FINAL PAYABLE AMOUNT FROM DATABASE PRICES (Never trust frontend amount!)
    let calculatedAmount = 0;
    for (const item of order.items) {
      let matchedMed: any = null;
      if (item.medicineId) {
        matchedMed = await prisma.medicine.findUnique({ where: { id: item.medicineId } });
      }
      if (!matchedMed && item.medicineName) {
        const cleanName = item.medicineName.trim();
        const firstWord = cleanName.split(/[\s-(]+/)[0];
        matchedMed = await prisma.medicine.findFirst({
          where: {
            OR: [
              { name: { contains: cleanName } },
              { genericName: { contains: cleanName } },
              ...(firstWord.length >= 3 ? [{ name: { contains: firstWord } }, { genericName: { contains: firstWord } }] : []),
            ],
          },
        });
      }

      const unitPrice = matchedMed?.unitPrice ? Number(matchedMed.unitPrice) : (Number(item.unitPrice) > 0 ? Number(item.unitPrice) : 12.0);
      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
      calculatedAmount += Number((quantity * unitPrice).toFixed(2));
    }

    calculatedAmount = Number(calculatedAmount.toFixed(2));

    const method = (paymentData.paymentMethod || 'ONLINE_UPI').toUpperCase();
    const isCashAtPharmacy = method === 'CASH_AT_PHARMACY';

    const txnRef = paymentData.transactionRef?.trim() || (isCashAtPharmacy ? null : `TXN-UPI-${Date.now()}-${order.id.slice(-6).toUpperCase()}`);
    const isPaid = !isCashAtPharmacy;
    const paymentStatus = isPaid ? 'PAID' : 'PENDING';
    const paidAt = isPaid ? new Date() : null;

    const [createdPayment, updatedOrder] = await prisma.$transaction([
      (prisma as any).pharmacyPayment.create({
        data: {
          orderId: order.id,
          patientId: order.patientId,
          amount: calculatedAmount,
          currency: 'INR',
          paymentMethod: method,
          transactionRef: txnRef,
          status: paymentStatus as any,
          notes: paymentData.notes || (isCashAtPharmacy ? 'Patient elected cash payment at counter upon collection' : 'Online digital payment verified'),
          paidAt,
        },
      }),
      (prisma.pharmacyOrder as any).update({
        where: { id: order.id },
        data: {
          totalAmount: calculatedAmount,
          paymentStatus: paymentStatus as any,
          paymentMethod: method,
          paidAt,
        },
        include: {
          items: true,
          pharmacy: true,
          patient: true,
          payments: { orderBy: { createdAt: 'desc' } },
        },
      }),
    ]);

    await AuditService.log({
      userId: user.id,
      action: isPaid ? 'PHARMACY_ORDER_PAID' : 'PHARMACY_PAYMENT_INITIATED',
      entityType: 'pharmacy_orders',
      entityId: order.id,
      ipAddress,
      details: {
        orderId: order.id,
        amount: calculatedAmount,
        paymentMethod: method,
        paymentStatus,
        transactionRef: txnRef,
      },
    });

    const hydrated = await this.hydrateOrder(updatedOrder);

    // Socket.IO event for real-time synchronization on both patient & pharmacist screens
    emitOrderStatusUpdate({
      orderId: hydrated.id,
      patientId: hydrated.patientId,
      patientName: hydrated.patient?.fullName,
      pharmacyId: hydrated.pharmacyId,
      status: hydrated.status,
      previousStatus: order.status,
      paymentStatus: hydrated.paymentStatus,
      paymentMethod: hydrated.paymentMethod,
      updatedAt: hydrated.updatedAt ? new Date(hydrated.updatedAt).toISOString() : new Date().toISOString(),
      message: isPaid
        ? `Payment of ₹${calculatedAmount} received successfully via ${method}.`
        : 'Cash at pharmacy payment recorded as pending collection.',
      statusTimeline: hydrated.statusTimeline,
      totalAmount: calculatedAmount,
    });

    // Notify Pharmacist
    if (order.pharmacyId) {
      const phs = await prisma.pharmacist.findMany({ where: { pharmacyId: order.pharmacyId } });
      for (const ph of phs) {
        await prisma.notification.create({
          data: {
            userId: ph.userId,
            title: isPaid ? 'Pharmacy Order Paid' : 'Cash on Pickup Selected',
            message: isPaid
              ? `Order #${order.id.slice(-6)}: Payment of ₹${calculatedAmount} confirmed via ${method}. Ready for dispensing.`
              : `Order #${order.id.slice(-6)}: Patient elected to pay ₹${calculatedAmount} cash at pharmacy counter.`,
            type: 'ORDER',
            category: 'Pharmacy',
            relatedModule: `orders:${order.id}`,
          },
        });
      }
    }

    return {
      order: hydrated,
      payment: createdPayment,
    };
  }

  /**
   * Pharmacist confirms cash payment received at counter
   */
  static async confirmCashPayment(
    id: string,
    user: AuthUser,
    notes?: string,
    ipAddress?: string
  ) {
    const order: any = await prisma.pharmacyOrder.findUnique({
      where: { id },
      include: {
        items: true,
        patient: true,
        pharmacy: true,
      },
    });

    if (!order) {
      const err: AppError = new Error(`Pharmacy order with ID "${id}" not found`);
      err.statusCode = 404;
      throw err;
    }

    // Verify pharmacist authority for this order
    await this.verifyPharmacistAuthority(order, user);

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DECLINED) {
      const err: AppError = new Error(`Cannot collect payment for an order in status "${order.status}"`);
      err.statusCode = 400;
      throw err;
    }

    if (order.paymentStatus === 'PAID') {
      const err: AppError = new Error('This order is already marked as PAID');
      err.statusCode = 400;
      throw err;
    }

    // Recalculate true total amount from database
    let calculatedAmount = 0;
    for (const item of order.items) {
      let matchedMed: any = null;
      if (item.medicineId) {
        matchedMed = await prisma.medicine.findUnique({ where: { id: item.medicineId } });
      }
      if (!matchedMed && item.medicineName) {
        const cleanName = item.medicineName.trim();
        const firstWord = cleanName.split(/[\s-(]+/)[0];
        matchedMed = await prisma.medicine.findFirst({
          where: {
            OR: [
              { name: { contains: cleanName } },
              { genericName: { contains: cleanName } },
              ...(firstWord.length >= 3 ? [{ name: { contains: firstWord } }, { genericName: { contains: firstWord } }] : []),
            ],
          },
        });
      }

      const unitPrice = matchedMed?.unitPrice ? Number(matchedMed.unitPrice) : (Number(item.unitPrice) > 0 ? Number(item.unitPrice) : 12.0);
      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
      calculatedAmount += Number((quantity * unitPrice).toFixed(2));
    }
    calculatedAmount = Number(calculatedAmount.toFixed(2));

    const paidAt = new Date();
    const txnRef = `CASH-${Date.now()}-${order.id.slice(-6).toUpperCase()}`;

    const [paymentRecord, updatedOrder] = await prisma.$transaction([
      (prisma as any).pharmacyPayment.create({
        data: {
          orderId: order.id,
          patientId: order.patientId,
          amount: calculatedAmount,
          currency: 'INR',
          paymentMethod: 'CASH_AT_PHARMACY',
          transactionRef: txnRef,
          status: 'PAID' as any,
          notes: notes || `Cash payment of ₹${calculatedAmount} received at counter by pharmacist`,
          paidAt,
        },
      }),
      (prisma.pharmacyOrder as any).update({
        where: { id: order.id },
        data: {
          totalAmount: calculatedAmount,
          paymentStatus: 'PAID' as any,
          paymentMethod: 'CASH_AT_PHARMACY',
          paidAt,
        },
        include: {
          items: true,
          pharmacy: true,
          patient: true,
          payments: { orderBy: { createdAt: 'desc' } },
        },
      }),
    ]);

    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_CASH_PAYMENT_COLLECTED',
      entityType: 'pharmacy_orders',
      entityId: order.id,
      ipAddress,
      details: {
        orderId: order.id,
        amount: calculatedAmount,
        paymentMethod: 'CASH_AT_PHARMACY',
        transactionRef: txnRef,
      },
    });

    const hydrated = await this.hydrateOrder(updatedOrder);

    // Realtime Socket.IO Event
    emitOrderStatusUpdate({
      orderId: hydrated.id,
      patientId: hydrated.patientId,
      patientName: hydrated.patient?.fullName,
      pharmacyId: hydrated.pharmacyId,
      status: hydrated.status,
      previousStatus: order.status,
      paymentStatus: 'PAID',
      paymentMethod: 'CASH_AT_PHARMACY',
      updatedAt: hydrated.updatedAt ? new Date(hydrated.updatedAt).toISOString() : new Date().toISOString(),
      message: `Cash payment of ₹${calculatedAmount} confirmed at pharmacy counter. Ready to dispense.`,
      statusTimeline: hydrated.statusTimeline,
      totalAmount: calculatedAmount,
    });

    // Notify Patient
    if (order.patient?.userId) {
      await prisma.notification.create({
        data: {
          userId: order.patient.userId,
          title: 'Pharmacy Cash Payment Received',
          message: `Your cash payment of ₹${calculatedAmount} for Order #${order.id.slice(-6)} has been verified. The pharmacist can now dispense your medications.`,
          type: 'ORDER',
          category: 'Pharmacy',
          relatedModule: `orders:${order.id}`,
        },
      });
    }

    return {
      order: hydrated,
      payment: paymentRecord,
    };
  }
}

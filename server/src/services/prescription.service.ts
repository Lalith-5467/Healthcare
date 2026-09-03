import { Prisma, PrescriptionStatus, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthUser } from '../@types/express';
import { AuditService } from './audit.service';

export interface PrescriptionItemInput {
  medicineId?: string;
  medicineName: string;
  dosage: string;
  unit: string;
  frequency: string;
  route?: string;
  durationDays?: number;
  instructions?: string;
  foodInstruction?: string;
}

export interface CreatePrescriptionInput {
  patientId: string;
  diagnosis?: string;
  notes?: string;
  validUntil?: string | Date;
  items: PrescriptionItemInput[];
}

export interface UpdatePrescriptionInput {
  diagnosis?: string;
  notes?: string;
  validUntil?: string | Date;
}

export interface PrescriptionQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
  patientId?: string;
  doctorId?: string;
  search?: string;
}

export class PrescriptionService {
  /**
   * Create a new prescription with nested items (Doctor, Admin, Super Admin)
   */
  static async createPrescription(
    data: CreatePrescriptionInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    // 1. Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) {
      const err: AppError = new Error(`Patient with ID ${data.patientId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Patient access check: Patients can only submit prescriptions for themselves
    if (user.role === Role.PATIENT && patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: Patients can only submit prescriptions for their own record');
      err.statusCode = 403;
      throw err;
    }

    // 2. Resolve Doctor identity securely from user.id
    let doctorId: string;
    if (user.role === Role.DOCTOR) {
      let doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
      });

      if (!doctor) {
        doctor = await prisma.doctor.create({
          data: {
            userId: user.id,
            fullName: user.email.split('@')[0],
            speciality: 'General Medicine',
          },
        });
      }
      doctorId = doctor.id;
    } else {
      // Admin fallback: find first doctor or create an administrative doctor profile
      let doctor = await prisma.doctor.findFirst();
      if (!doctor) {
        doctor = await prisma.doctor.create({
          data: {
            userId: user.id,
            fullName: 'Staff Physician',
            speciality: 'General Practice',
          },
        });
      }
      doctorId = doctor.id;
    }

    // 3. Create prescription and nested items
    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        doctorId,
        diagnosis: data.diagnosis || null,
        notes: data.notes || null,
        status: PrescriptionStatus.PENDING_REVIEW,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        items: {
          create: data.items.map((item) => ({
            medicineId: item.medicineId || null,
            medicineName: item.medicineName,
            dosage: item.dosage,
            unit: item.unit,
            frequency: item.frequency,
            route: item.route || 'Oral',
            durationDays: item.durationDays || null,
            instructions: item.instructions || null,
            foodInstruction: item.foodInstruction || null,
          })),
        },
      },
      include: {
        items: true,
        patient: {
          select: {
            id: true,
            fullName: true,
            gender: true,
            bloodGroup: true,
            dateOfBirth: true,
          },
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            speciality: true,
            hospital: true,
          },
        },
      },
    });

    // 4. Audit Log
    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_CREATED',
      entityType: 'prescriptions',
      entityId: prescription.id,
      ipAddress,
      details: {
        patientId: prescription.patientId,
        doctorId: prescription.doctorId,
        itemCount: prescription.items.length,
      },
    });

    return prescription;
  }

  /**
   * Get prescriptions with strict patient isolation and pagination
   */
  static async getPrescriptions(
    options: PrescriptionQueryOptions,
    user: AuthUser
  ) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.PrescriptionWhereInput = {};

    // 1. Patient Isolation: Force filter to the authenticated patient's profile ID
    if (user.role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (!patient) {
        return {
          prescriptions: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }

      where.patientId = patient.id;
    } else if (options.patientId) {
      where.patientId = options.patientId;
    }

    // 2. Doctor Filter if requested
    if (options.doctorId) {
      where.doctorId = options.doctorId;
    }

    // 3. Status Filter
    if (options.status && Object.values(PrescriptionStatus).includes(options.status.toUpperCase() as PrescriptionStatus)) {
      where.status = options.status.toUpperCase() as PrescriptionStatus;
    }

    // 4. Search Filter
    if (options.search) {
      where.OR = [
        { diagnosis: { contains: options.search } },
        { notes: { contains: options.search } },
        { doctor: { fullName: { contains: options.search } } },
        { items: { some: { medicineName: { contains: options.search } } } },
      ];
    }

    const [total, prescriptions] = await Promise.all([
      prisma.prescription.count({ where }),
      prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
        include: {
          items: true,
          patient: {
            select: {
              id: true,
              fullName: true,
              gender: true,
              bloodGroup: true,
              dateOfBirth: true,
            },
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              speciality: true,
              hospital: true,
            },
          },
        },
      }),
    ]);

    return {
      prescriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Get single prescription by ID with ownership verification
   */
  static async getPrescriptionById(
    id: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        patient: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            gender: true,
            bloodGroup: true,
            dateOfBirth: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            speciality: true,
            hospital: true,
          },
        },
      },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Patient isolation: Patient can only view their own prescription
    if (user.role === Role.PATIENT && prescription.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only access your own prescriptions');
      err.statusCode = 403;
      throw err;
    }

    // Audit log
    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_VIEWED',
      entityType: 'prescriptions',
      entityId: prescription.id,
      ipAddress,
      details: { patientId: prescription.patientId, role: user.role },
    });

    return prescription;
  }

  /**
   * Patient reviews prescription: PENDING_REVIEW -> REVIEWED
   */
  static async reviewPrescription(
    id: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Patient ownership check
    if (user.role === Role.PATIENT && prescription.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only review your own prescriptions');
      err.statusCode = 403;
      throw err;
    }

    // Status transition validation
    if (
      prescription.status !== PrescriptionStatus.PENDING_REVIEW &&
      prescription.status !== PrescriptionStatus.ACTIVE
    ) {
      const err: AppError = new Error(
        `Cannot review prescription currently in status "${prescription.status}"`
      );
      err.statusCode = 400;
      throw err;
    }

    const updated = await prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.REVIEWED },
      include: { items: true, patient: true, doctor: true },
    });

    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_REVIEWED',
      entityType: 'prescriptions',
      entityId: updated.id,
      ipAddress,
      details: { previousStatus: prescription.status, newStatus: updated.status },
    });

    return updated;
  }

  /**
   * Patient confirms reviewed prescription: REVIEWED -> CONFIRMED
   * CRITICAL: Does NOT create any pharmacy order (Step 10 will do that).
   */
  static async confirmPrescription(
    id: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Patient ownership check
    if (user.role === Role.PATIENT && prescription.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only confirm your own prescriptions');
      err.statusCode = 403;
      throw err;
    }

    // Status transition validation: must be REVIEWED or PENDING_REVIEW
    if (
      prescription.status !== PrescriptionStatus.REVIEWED &&
      prescription.status !== PrescriptionStatus.PENDING_REVIEW &&
      prescription.status !== PrescriptionStatus.ACTIVE
    ) {
      const err: AppError = new Error(
        `Cannot confirm prescription currently in status "${prescription.status}". Please review it first.`
      );
      err.statusCode = 400;
      throw err;
    }

    const updated = await prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.CONFIRMED },
      include: { items: true, patient: true, doctor: true },
    });

    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_CONFIRMED',
      entityType: 'prescriptions',
      entityId: updated.id,
      ipAddress,
      details: {
        previousStatus: prescription.status,
        newStatus: updated.status,
        pharmacyReady: true,
      },
    });

    return updated;
  }

  /**
   * Doctor updates clinical prescription details (Doctor, Admin, Super Admin)
   */
  static async updatePrescription(
    id: string,
    data: UpdatePrescriptionInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    if (user.role === Role.PATIENT) {
      const err: AppError = new Error('Access denied: Patients cannot modify clinical prescriptions');
      err.statusCode = 403;
      throw err;
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Doctor ownership check: only the author doctor (or admin) can update
    if (user.role === Role.DOCTOR && prescription.doctor.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only modify prescriptions authored by you');
      err.statusCode = 403;
      throw err;
    }

    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        ...(data.diagnosis !== undefined ? { diagnosis: data.diagnosis } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.validUntil !== undefined
          ? { validUntil: data.validUntil ? new Date(data.validUntil) : null }
          : {}),
      },
      include: { items: true, patient: true, doctor: true },
    });

    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_UPDATED',
      entityType: 'prescriptions',
      entityId: updated.id,
      ipAddress,
      details: { updatedFields: Object.keys(data) },
    });

    return updated;
  }

  /**
   * Add a single item to an existing prescription
   */
  static async addPrescriptionItem(
    prescriptionId: string,
    itemData: PrescriptionItemInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    if (user.role === Role.PATIENT) {
      const err: AppError = new Error('Access denied: Patients cannot add prescription items');
      err.statusCode = 403;
      throw err;
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { doctor: true },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID ${prescriptionId} not found`);
      err.statusCode = 404;
      throw err;
    }

    if (user.role === Role.DOCTOR && prescription.doctor.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only modify your own prescriptions');
      err.statusCode = 403;
      throw err;
    }

    const item = await prisma.prescriptionItem.create({
      data: {
        prescriptionId,
        medicineId: itemData.medicineId || null,
        medicineName: itemData.medicineName,
        dosage: itemData.dosage,
        unit: itemData.unit,
        frequency: itemData.frequency,
        route: itemData.route || 'Oral',
        durationDays: itemData.durationDays || null,
        instructions: itemData.instructions || null,
        foodInstruction: itemData.foodInstruction || null,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_ITEM_UPDATED',
      entityType: 'prescription_items',
      entityId: item.id,
      ipAddress,
      details: { prescriptionId, medicineName: item.medicineName, actionType: 'ITEM_ADDED' },
    });

    return item;
  }

  /**
   * Delete an item from a prescription
   */
  static async deletePrescriptionItem(
    prescriptionId: string,
    itemId: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    if (user.role === Role.PATIENT) {
      const err: AppError = new Error('Access denied: Patients cannot remove prescription items');
      err.statusCode = 403;
      throw err;
    }

    const item = await prisma.prescriptionItem.findFirst({
      where: { id: itemId, prescriptionId },
      include: { prescription: { include: { doctor: true } } },
    });

    if (!item) {
      const err: AppError = new Error(
        `Prescription item with ID ${itemId} not found on prescription ${prescriptionId}`
      );
      err.statusCode = 404;
      throw err;
    }

    if (user.role === Role.DOCTOR && item.prescription.doctor.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only modify your own prescriptions');
      err.statusCode = 403;
      throw err;
    }

    await prisma.prescriptionItem.delete({ where: { id: itemId } });

    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_ITEM_UPDATED',
      entityType: 'prescription_items',
      entityId: itemId,
      ipAddress,
      details: { prescriptionId, medicineName: item.medicineName, actionType: 'ITEM_REMOVED' },
    });

    return { success: true, message: 'Prescription item removed successfully' };
  }

  /**
   * Cancel prescription (Doctor, Admin, Super Admin)
   */
  static async cancelPrescription(
    id: string,
    user: AuthUser,
    ipAddress?: string
  ) {
    if (user.role === Role.PATIENT) {
      const err: AppError = new Error('Access denied: Patients cannot cancel clinical prescriptions directly');
      err.statusCode = 403;
      throw err;
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!prescription) {
      const err: AppError = new Error(`Prescription with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    if (user.role === Role.DOCTOR && prescription.doctor.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only cancel your own prescriptions');
      err.statusCode = 403;
      throw err;
    }

    const updated = await prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.CANCELLED },
      include: { items: true, patient: true, doctor: true },
    });

    await AuditService.log({
      userId: user.id,
      action: 'PRESCRIPTION_CANCELLED',
      entityType: 'prescriptions',
      entityId: updated.id,
      ipAddress,
      details: { previousStatus: prescription.status },
    });

    return updated;
  }
}

import { Prisma, RecordType, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthUser } from '../@types/express';
import { AuditService } from './audit.service';

export interface CreateMedicalRecordInput {
  patientId: string;
  title: string;
  type?: RecordType;
  hospital?: string;
  status?: string;
  isImportant?: boolean;
  notes?: string;
  recordDate?: string | Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface UpdateMedicalRecordInput {
  title?: string;
  type?: RecordType;
  hospital?: string;
  status?: string;
  isImportant?: boolean;
  notes?: string;
  recordDate?: string | Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface MedicalRecordQueryOptions {
  page?: number;
  limit?: number;
  type?: string;
  patientId?: string;
  status?: string;
  isImportant?: boolean | string;
  search?: string;
}

export class MedicalRecordService {
  /**
   * Create a new Medical Record (Doctor, Nurse, Admin, Super Admin)
   */
  static async createMedicalRecord(
    data: CreateMedicalRecordInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    // 1. Verify target patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) {
      const err: AppError = new Error(`Patient with ID ${data.patientId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Associate doctor if author is a Doctor
    let doctorId: string | null = null;
    if (user.role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
      });
      if (doctor) doctorId = doctor.id;
    }

    // 3. Create medical record
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: data.patientId,
        doctorId: doctorId || undefined,
        title: data.title,
        type: data.type || RecordType.OTHER,
        hospital: data.hospital || (user.role === Role.DOCTOR ? 'Medical Practice' : null),
        status: data.status || 'Normal',
        isImportant: data.isImportant || false,
        notes: data.notes || null,
        recordDate: data.recordDate ? new Date(data.recordDate) : new Date(),
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        fileSize: data.fileSize || null,
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            bloodGroup: true,
            dateOfBirth: true,
            gender: true,
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
      action: 'MEDICAL_RECORD_CREATED',
      entityType: 'medical_records',
      entityId: record.id,
      ipAddress,
      details: {
        title: record.title,
        type: record.type,
        patientId: record.patientId,
      },
    });

    return record;
  }

  /**
   * Get medical records with strict patient isolation and pagination
   */
  static async getMedicalRecords(
    options: MedicalRecordQueryOptions,
    user: AuthUser
  ) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.MedicalRecordWhereInput = {};

    // 1. Patient Isolation Enforcement
    if (user.role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (!patient) {
        // If patient profile doesn't exist yet, return empty list
        return {
          records: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }

      // STRICT ISOLATION: Force filter to the authenticated patient's ID
      where.patientId = patient.id;
    } else if (options.patientId) {
      // Clinical users & admins can filter by a specific patientId
      where.patientId = options.patientId;
    }

    // 2. Filter by RecordType
    if (options.type && Object.values(RecordType).includes(options.type.toUpperCase() as RecordType)) {
      where.type = options.type.toUpperCase() as RecordType;
    }

    // 3. Filter by Status
    if (options.status) {
      where.status = options.status;
    }

    // 4. Filter by isImportant
    if (options.isImportant !== undefined) {
      where.isImportant = options.isImportant === true || options.isImportant === 'true';
    }

    // 5. Search in title, hospital, or notes
    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { hospital: { contains: options.search } },
        { notes: { contains: options.search } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.medicalRecord.count({ where }),
      prisma.medicalRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { recordDate: 'desc' },
        include: {
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
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Get single medical record by ID with patient ownership check
   */
  static async getMedicalRecordById(id: string, user: AuthUser, ipAddress?: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
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
            fullName: true,
            speciality: true,
            hospital: true,
          },
        },
      },
    });

    if (!record) {
      const err: AppError = new Error(`Medical record with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    // PATIENT ISOLATION CHECK: Patient can only view their own record
    if (user.role === Role.PATIENT && record.patient.userId !== user.id) {
      const err: AppError = new Error('Access denied: You can only access your own medical records');
      err.statusCode = 403;
      throw err;
    }

    // Audit Log for record view
    await AuditService.log({
      userId: user.id,
      action: 'MEDICAL_RECORD_VIEWED',
      entityType: 'medical_records',
      entityId: record.id,
      ipAddress,
      details: { patientId: record.patientId, role: user.role },
    });

    return record;
  }

  /**
   * Update clinical medical record (Doctor, Nurse, Admin, Super Admin)
   */
  static async updateMedicalRecord(
    id: string,
    data: UpdateMedicalRecordInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    // Patients cannot modify clinical records
    if (user.role === Role.PATIENT) {
      const err: AppError = new Error('Access denied: Patients cannot modify clinical medical records');
      err.statusCode = 403;
      throw err;
    }

    const existing = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!existing) {
      const err: AppError = new Error(`Medical record with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.hospital !== undefined ? { hospital: data.hospital } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.isImportant !== undefined ? { isImportant: data.isImportant } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.recordDate !== undefined
          ? { recordDate: new Date(data.recordDate) }
          : {}),
        ...(data.fileUrl !== undefined ? { fileUrl: data.fileUrl } : {}),
        ...(data.fileName !== undefined ? { fileName: data.fileName } : {}),
        ...(data.fileSize !== undefined ? { fileSize: data.fileSize } : {}),
      },
      include: {
        patient: {
          select: { id: true, fullName: true, bloodGroup: true },
        },
        doctor: {
          select: { id: true, fullName: true, speciality: true },
        },
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'MEDICAL_RECORD_UPDATED',
      entityType: 'medical_records',
      entityId: updated.id,
      ipAddress,
      details: { updatedFields: Object.keys(data), patientId: updated.patientId },
    });

    return updated;
  }

  /**
   * Delete a medical record (Admin, Super Admin only)
   */
  static async deleteMedicalRecord(id: string, user: AuthUser, ipAddress?: string) {
    // Only Admin or Super Admin can delete records
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      const err: AppError = new Error('Access denied: Only administrators can permanently delete medical records');
      err.statusCode = 403;
      throw err;
    }

    const existing = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!existing) {
      const err: AppError = new Error(`Medical record with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    await prisma.medicalRecord.delete({ where: { id } });

    await AuditService.log({
      userId: user.id,
      action: 'MEDICAL_RECORD_DELETED',
      entityType: 'medical_records',
      entityId: id,
      ipAddress,
      details: { title: existing.title, patientId: existing.patientId },
    });

    return { success: true, message: 'Medical record deleted successfully' };
  }
}

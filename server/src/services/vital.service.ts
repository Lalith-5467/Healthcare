import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export interface CreateVitalDTO {
  patientId?: string;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  temperature?: number;
  bloodSugar?: number;
  weightKg?: number;
  notes?: string;
  recordedAt?: string | Date;
}

export class VitalService {
  /**
   * Get vitals history for a patient
   */
  static async getVitals(userId: string, role: Role, patientIdQuery?: string) {
    let patientId = patientIdQuery;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId && role !== Role.PATIENT) {
      // If doctor/nurse without specific patientId, return latest vitals recorded across patients
      return prisma.vital.findMany({
        include: {
          patient: true,
          recordedBy: { select: { id: true, email: true, role: true } },
        },
        orderBy: { recordedAt: 'desc' },
        take: 50,
      });
    }

    if (!patientId) {
      throw new AppError('Patient ID is required', 400);
    }

    return prisma.vital.findMany({
      where: { patientId },
      include: {
        recordedBy: { select: { id: true, email: true, role: true } },
      },
      orderBy: { recordedAt: 'desc' },
    });
  }

  /**
   * Record new vitals reading
   */
  static async createVital(userId: string, role: Role, data: CreateVitalDTO) {
    let patientId = data.patientId;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) throw new AppError('Patient ID is required', 400);

    const vital = await prisma.vital.create({
      data: {
        patientId,
        recordedById: userId,
        systolicBp: data.systolicBp ?? null,
        diastolicBp: data.diastolicBp ?? null,
        heartRate: data.heartRate ?? null,
        respiratoryRate: data.respiratoryRate ?? null,
        oxygenSaturation: data.oxygenSaturation ?? null,
        temperature: data.temperature ?? null,
        bloodSugar: data.bloodSugar ?? null,
        weightKg: data.weightKg ?? null,
        notes: data.notes ?? '',
        recordedAt: data.recordedAt ? new Date(data.recordedAt) : new Date(),
      },
      include: {
        patient: true,
      },
    });

    return vital;
  }
}

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
   * Helper to verify if the user is authorized to access the given patient's vitals
   */
  private static async checkAuthorization(userId: string, role: Role, patientId: string): Promise<boolean> {
    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      return !!patient && patient.id === patientId;
    }

    if (role === Role.CAREGIVER) {
      const caregiver = await prisma.caregiver.findUnique({ where: { userId } });
      if (!caregiver) return false;
      const linked = await prisma.patient.findFirst({
        where: {
          id: patientId,
          caregivers: { some: { id: caregiver.id } }
        }
      });
      return !!linked;
    }

    if (role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) return false;
      const now = new Date();
      const activeSession = await prisma.patientAccessRequest.findFirst({
        where: {
          patientId,
          doctorId: doctor.id,
          status: 'APPROVED',
          expiresAt: { gt: now }
        }
      });
      return !!activeSession;
    }
    
    return false;
  }

  /**
   * Get vitals history for a patient (bounded to 6 months)
   */
  static async getVitals(userId: string, role: Role, patientIdQuery?: string) {
    let patientId = patientIdQuery;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id; // Override to strictly own ID
    }

    if (!patientId) {
      throw new AppError('patientId is required', 400);
    }

    // Check authorization for Doctor/Caregiver
    const isAuthorized = await this.checkAuthorization(userId, role, patientId);
    if (!isAuthorized) {
      throw new AppError('Forbidden: Not authorized to access this patient', 403);
    }

    // 6-month bound
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return prisma.vital.findMany({
      where: { 
        patientId,
        recordedAt: {
          gte: sixMonthsAgo
        }
      },
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
      patientId = patient.id; // Force own ID
    }

    if (!patientId) throw new AppError('patientId is required', 400);

    // Verify Authorization for write
    const isAuthorized = await this.checkAuthorization(userId, role, patientId);
    if (!isAuthorized) {
      throw new AppError('Forbidden: Not authorized to create vitals for this patient', 403);
    }

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

    // Run clinical alert detection asynchronously to not block response
    import('./clinicalAlert.service').then(m => {
      m.ClinicalAlertService.evaluateVital(vital).catch(console.error);
    });

    return vital;
  }
}

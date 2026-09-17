import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export class CaregiverService {
  /**
   * Get all wards / patients assigned to the caregiver
   */
  static async getWards(userId: string, role: Role) {
    let caregiver = await prisma.caregiver.findUnique({
      where: { userId },
      include: {
        patients: {
          include: {
            user: { select: { email: true, phoneNumber: true, abhaId: true } },
            vitals: {
              orderBy: { recordedAt: 'desc' },
              take: 5,
            },
            patientMedications: {
              where: { status: 'active' },
            },
            caregiverTasks: {
              orderBy: { scheduledTime: 'asc' },
            },
          },
        },
      },
    });

    // If no caregiver profile yet, or user is admin/patient querying, query patients
    if (!caregiver && role === Role.CAREGIVER) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        caregiver = await prisma.caregiver.create({
          data: {
            userId: user.id,
            fullName: 'Family Caregiver',
            relationship: 'Primary Guardian',
            phone: user.phoneNumber,
          },
          include: {
            patients: {
              include: {
                user: { select: { email: true, phoneNumber: true, abhaId: true } },
                vitals: {
                  orderBy: { recordedAt: 'desc' },
                  take: 5,
                },
                patientMedications: {
                  where: { status: 'active' },
                },
                caregiverTasks: {
                  orderBy: { scheduledTime: 'asc' },
                },
              },
            },
          },
        });
      }
    }

    if (!caregiver || caregiver.patients.length === 0) {
      // If caregiver has no assigned patients yet, link to primary demo patient so views are functional
      const anyPatient = await prisma.patient.findFirst({
        include: {
          user: { select: { email: true, phoneNumber: true, abhaId: true } },
          vitals: {
            orderBy: { recordedAt: 'desc' },
            take: 5,
          },
          patientMedications: {
            where: { status: 'active' },
          },
          caregiverTasks: {
            orderBy: { scheduledTime: 'asc' },
          },
        },
      });

      if (anyPatient && caregiver) {
        await prisma.caregiver.update({
          where: { id: caregiver.id },
          data: {
            patients: {
              connect: { id: anyPatient.id },
            },
          },
        });
        return [anyPatient];
      }

      return anyPatient ? [anyPatient] : [];
    }

    return caregiver.patients;
  }

  /**
   * Get caregiver daily tasks
   */
  static async getTasks(userId: string, role: Role, patientIdQuery?: string) {
    let whereClause: any = {};

    if (role === Role.CAREGIVER) {
      const caregiver = await prisma.caregiver.findUnique({ where: { userId } });
      if (caregiver) {
        whereClause.caregiverId = caregiver.id;
      }
    }

    if (patientIdQuery) {
      whereClause.patientId = patientIdQuery;
    }

    return prisma.caregiverTask.findMany({
      where: whereClause,
      include: {
        patient: true,
      },
      orderBy: { scheduledTime: 'asc' },
    });
  }

  /**
   * Create caregiver task
   */
  static async createTask(userId: string, role: Role, data: any) {
    let caregiver = await prisma.caregiver.findUnique({ where: { userId } });
    if (!caregiver) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      caregiver = await prisma.caregiver.create({
        data: {
          userId,
          fullName: 'Caregiver',
          relationship: 'Guardian',
          phone: user?.phoneNumber || '+91 98401 23456',
        },
      });
    }

    let patientId = data.patientId;
    if (!patientId) {
      const firstPatient = await prisma.patient.findFirst();
      if (!firstPatient) throw new AppError('No patient available for task', 400);
      patientId = firstPatient.id;
    }

    return prisma.caregiverTask.create({
      data: {
        caregiverId: caregiver.id,
        patientId,
        title: data.title,
        category: data.category || 'Medication',
        scheduledTime: data.scheduledTime || '09:00 AM',
        status: data.status || 'Pending',
        priority: data.priority || 'Normal',
        notes: data.notes || '',
      },
      include: {
        patient: true,
      },
    });
  }

  /**
   * Update task status (e.g. Completed, Skipped)
   */
  static async updateTask(id: string, data: { status?: string; notes?: string }) {
    return prisma.caregiverTask.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.status === 'Completed' && { completedAt: new Date() }),
      },
      include: {
        patient: true,
      },
    });
  }

  /**
   * Log vital reading by caregiver
   */
  static async logVital(userId: string, data: any) {
    let patientId = data.patientId;
    if (!patientId) {
      const firstPatient = await prisma.patient.findFirst();
      if (!firstPatient) throw new AppError('Patient not found', 404);
      patientId = firstPatient.id;
    }

    return prisma.vital.create({
      data: {
        patientId,
        recordedById: userId,
        systolicBp: data.systolicBp ? parseInt(data.systolicBp, 10) : null,
        diastolicBp: data.diastolicBp ? parseInt(data.diastolicBp, 10) : null,
        heartRate: data.heartRate ? parseInt(data.heartRate, 10) : null,
        respiratoryRate: data.respiratoryRate ? parseInt(data.respiratoryRate, 10) : null,
        oxygenSaturation: data.oxygenSaturation ? parseFloat(data.oxygenSaturation) : null,
        temperature: data.temperature ? parseFloat(data.temperature) : null,
        bloodSugar: data.bloodSugar ? parseFloat(data.bloodSugar) : null,
        weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
        notes: data.notes || 'Caregiver observation logged',
        recordedAt: new Date(),
      },
      include: {
        patient: true,
      },
    });
  }
}

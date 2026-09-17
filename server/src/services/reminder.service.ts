import { prisma } from '../config/prisma';
import { ReminderStatus, ReminderType, Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export interface CreateReminderDTO {
  patientId?: string;
  title: string;
  type?: ReminderType;
  scheduledTime: string;
  frequency?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: ReminderStatus;
  isCompletedToday?: boolean;
  notes?: string;
  sourcePrescriptionId?: string;
  doctorName?: string;
  clinicName?: string;
  followUpStatus?: string;
  followUpDate?: string | Date;
  priority?: string;
}

export interface UpdateReminderDTO {
  title?: string;
  type?: ReminderType;
  scheduledTime?: string;
  frequency?: string;
  status?: ReminderStatus;
  isCompletedToday?: boolean;
  notes?: string;
  followUpStatus?: string;
  followUpDate?: string | Date;
  priority?: string;
}

export class ReminderService {
  /**
   * Get all reminders for a user (or patient)
   */
  static async getReminders(userId: string, role: Role, patientIdQuery?: string) {
    let patientId = patientIdQuery;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) throw new AppError('Patient ID is required', 400);

    return prisma.reminder.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new reminder
   */
  static async createReminder(userId: string, role: Role, data: CreateReminderDTO) {
    let patientId = data.patientId;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) throw new AppError('Patient ID is required', 400);

    // Prevent duplicate reminders for the same prescription follow-up
    if (data.sourcePrescriptionId) {
      const existing = await prisma.reminder.findFirst({
        where: {
          patientId,
          sourcePrescriptionId: data.sourcePrescriptionId,
        },
      });
      if (existing) return existing;
    }

    const reminder = await prisma.reminder.create({
      data: {
        patientId,
        title: data.title,
        type: data.type || ReminderType.MEDICATION,
        scheduledTime: data.scheduledTime,
        frequency: data.frequency || 'Once daily',
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || ReminderStatus.ACTIVE,
        isCompletedToday: data.isCompletedToday || false,
        notes: data.notes || '',
        sourcePrescriptionId: data.sourcePrescriptionId || null,
        doctorName: data.doctorName || null,
        clinicName: data.clinicName || null,
        followUpStatus: data.followUpStatus || 'Pending',
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        priority: data.priority || 'Normal',
      },
    });

    return reminder;
  }

  /**
   * Update a reminder
   */
  static async updateReminder(id: string, data: UpdateReminderDTO) {
    const existing = await prisma.reminder.findUnique({ where: { id } });
    if (!existing) throw new AppError('Reminder not found', 404);

    return prisma.reminder.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.type && { type: data.type }),
        ...(data.scheduledTime && { scheduledTime: data.scheduledTime }),
        ...(data.frequency && { frequency: data.frequency }),
        ...(data.status && { status: data.status }),
        ...(data.isCompletedToday !== undefined && { isCompletedToday: data.isCompletedToday }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.followUpStatus !== undefined && { followUpStatus: data.followUpStatus }),
        ...(data.followUpDate && { followUpDate: new Date(data.followUpDate) }),
        ...(data.priority && { priority: data.priority }),
      },
    });
  }

  /**
   * Update follow-up status (Accept / Decline)
   */
  static async updateFollowUpStatus(id: string, followUpStatus: 'Accepted' | 'Declined') {
    const reminder = await this.updateReminder(id, {
      followUpStatus,
      priority: followUpStatus === 'Accepted' ? 'High Priority' : 'Normal',
    });

    // Create Notification
    const patient = await prisma.patient.findUnique({ where: { id: reminder.patientId } });
    if (patient) {
      await prisma.notification.create({
        data: {
          userId: patient.userId,
          title: followUpStatus === 'Accepted' ? 'Follow-up Confirmed' : 'Follow-up Declined',
          message: `${reminder.title} status has been updated to ${followUpStatus}.`,
          type: 'APPOINTMENT',
          category: 'Appointment',
          relatedModule: 'appointments',
        },
      });
    }

    return reminder;
  }

  /**
   * Delete a reminder
   */
  static async deleteReminder(id: string) {
    const existing = await prisma.reminder.findUnique({ where: { id } });
    if (!existing) throw new AppError('Reminder not found', 404);

    await prisma.reminder.delete({ where: { id } });
    return { success: true };
  }
}

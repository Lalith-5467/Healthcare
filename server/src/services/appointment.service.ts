import { prisma } from '../config/prisma';
import { AppointmentStatus, AppointmentType, Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export interface CreateAppointmentDTO {
  doctorId: string;
  patientId?: string;
  appointmentDate: string | Date;
  slotTime: string;
  type?: AppointmentType;
  reason?: string;
  notes?: string;
  meetingLink?: string;
}

export interface UpdateAppointmentDTO {
  appointmentDate?: string | Date;
  slotTime?: string;
  status?: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  cancellationReason?: string;
}

export class AppointmentService {
  /**
   * Get appointments for a user based on their role
   */
  static async getAppointments(userId: string, role: Role) {
    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);

      return prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: {
            include: {
              user: { select: { email: true, phoneNumber: true } },
            },
          },
        },
        orderBy: { appointmentDate: 'asc' },
      });
    }

    if (role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) throw new AppError('Doctor profile not found', 404);

      return prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: {
            include: {
              user: { select: { email: true, phoneNumber: true, abhaId: true } },
            },
          },
        },
        orderBy: { appointmentDate: 'asc' },
      });
    }

    // Admin / Nurse / Caregiver
    return prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  /**
   * Get single appointment by ID
   */
  static async getAppointmentById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!appointment) throw new AppError('Appointment not found', 404);
    return appointment;
  }

  /**
   * Create a new appointment booking
   */
  static async createAppointment(userId: string, role: Role, data: CreateAppointmentDTO) {
    let patientId = data.patientId;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) throw new AppError('Patient ID is required', 400);

    let doctor = await prisma.doctor.findFirst({
      where: {
        OR: [
          { id: data.doctorId },
          { userId: data.doctorId },
          { fullName: { contains: data.doctorId } },
        ],
      },
    });

    if (!doctor) {
      doctor = await prisma.doctor.findFirst();
    }

    if (!doctor) throw new AppError('Doctor not found', 404);

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctor.id,
        appointmentDate: new Date(data.appointmentDate),
        slotTime: data.slotTime,
        type: data.type || AppointmentType.VIDEO,
        status: AppointmentStatus.CONFIRMED,
        fee: doctor.consultationFee,
        reason: data.reason || 'General Consultation',
        notes: data.notes || '',
        meetingLink: data.type === AppointmentType.VIDEO ? (data.meetingLink || 'https://meet.google.com/dhr-rxv-cardio') : null,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    // Create Notification for Patient
    const patientRecord = await prisma.patient.findUnique({ where: { id: patientId } });
    if (patientRecord) {
      await prisma.notification.create({
        data: {
          userId: patientRecord.userId,
          title: 'Appointment Confirmed',
          message: `Your appointment with ${doctor.fullName} on ${new Date(data.appointmentDate).toLocaleDateString()} at ${data.slotTime} is confirmed.`,
          type: 'APPOINTMENT',
          category: 'Appointment',
          relatedModule: 'appointments',
        },
      });
    }

    // Create Notification for Doctor
    if (doctor.userId) {
      await prisma.notification.create({
        data: {
          userId: doctor.userId,
          title: 'New Appointment Booked',
          message: `Patient ${patientRecord?.fullName || 'Patient'} booked an appointment on ${new Date(data.appointmentDate).toLocaleDateString()} at ${data.slotTime}.`,
          type: 'APPOINTMENT',
          category: 'Appointment',
          relatedModule: 'appointments',
        },
      });
    }

    return appointment;
  }

  /**
   * Update appointment details or status
   */
  static async updateAppointment(id: string, data: UpdateAppointmentDTO) {
    const existing = await prisma.appointment.findUnique({ 
      where: { id },
      include: { doctor: true, patient: true },
    });
    if (!existing) throw new AppError('Appointment not found', 404);

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(data.appointmentDate && { appointmentDate: new Date(data.appointmentDate) }),
        ...(data.slotTime && { slotTime: data.slotTime }),
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.meetingLink !== undefined && { meetingLink: data.meetingLink }),
        ...(data.cancellationReason !== undefined && { cancellationReason: data.cancellationReason }),
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    // Notify patient when status changes
    if (data.status && data.status !== existing.status && updated.patient?.userId) {
      await prisma.notification.create({
        data: {
          userId: updated.patient.userId,
          title: `Appointment ${updated.status}`,
          message: `Your appointment with ${updated.doctor.fullName} on ${new Date(updated.appointmentDate).toLocaleDateString()} is now ${updated.status.toLowerCase()}.`,
          type: 'APPOINTMENT',
          category: 'Appointment',
          relatedModule: 'appointments',
        },
      });
    }

    return updated;
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(id: string, reason?: string) {
    return this.updateAppointment(id, {
      status: AppointmentStatus.CANCELLED,
      cancellationReason: reason || 'Cancelled by user',
    });
  }
}

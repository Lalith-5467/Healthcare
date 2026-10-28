import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { ConsultationStatus, AppointmentStatus, PrescriptionStatus, Role } from '@prisma/client';

// ─────────────────────────────────────────────────────────────────────────────
// GET /consultations/:id  (id = appointmentId)
// Returns appointment + consultation data.
// Access control: Doctor on this appointment, the Patient on this appointment,
// Nurses (read-only for care coordination), Admin/Super Admin.
// ─────────────────────────────────────────────────────────────────────────────
export const getConsultationByAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointmentId = id as string;
    const requestingUser = req.user!;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: { select: { id: true } },
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
            medicalRecords: { orderBy: { recordDate: 'desc' }, take: 5 },
            prescriptions: { include: { items: true }, orderBy: { createdAt: 'desc' }, take: 3 },
          },
        },
        doctor: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Enforce patient-level access: a PATIENT can only see their own consultation
    if (requestingUser.role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId: requestingUser.id } });
      if (!patient || patient.id !== appointment.patientId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only view your own consultation records.',
        });
      }
    }

    // Enforce doctor-level access: a DOCTOR can only see appointments assigned to them
    if (requestingUser.role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId: requestingUser.id } });
      if (!doctor || doctor.id !== appointment.doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only view consultations for your own appointments.',
        });
      }
    }

    const consultation = await prisma.consultation.findUnique({
      where: { appointmentId },
    });

    res.status(200).json({
      success: true,
      data: {
        appointment,
        consultation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /consultations/:id/start  (id = appointmentId)
// Doctor starts a consultation session. Idempotent — safe to call again.
// ─────────────────────────────────────────────────────────────────────────────
export const startConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointmentId = id as string;
    const requestingUser = req.user!;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Doctors may only start their own assigned appointment consultations
    if (requestingUser.role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId: requestingUser.id } });
      if (!doctor || doctor.id !== appointment.doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only start consultations for your own appointments.',
        });
      }
    }

    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot start a completed or cancelled appointment',
      });
    }

    // Auto-confirm the appointment if it was still PENDING
    if (appointment.status === 'PENDING') {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' },
      });
    }

    let consultation;
    try {
      consultation = await prisma.consultation.upsert({
        where: { appointmentId },
        update: {
          status: ConsultationStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
        create: {
          appointmentId,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          status: ConsultationStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        consultation = await prisma.consultation.findUnique({ where: { appointmentId } });
      } else {
        throw e;
      }
    }

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /consultations/:id  (id = consultationId)
// Doctor updates clinical notes on an in-progress consultation.
// ─────────────────────────────────────────────────────────────────────────────
export const updateConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const consultationId = id as string;
    const requestingUser = req.user!;
    const { chiefComplaint, symptoms, clinicalNotes, diagnosis, treatmentPlan, followUpInstructions } = req.body;

    // Verify the consultation exists and belongs to the requesting doctor
    if (requestingUser.role === Role.DOCTOR) {
      const existing = await prisma.consultation.findUnique({ where: { id: consultationId } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Consultation not found' });
      }
      const doctor = await prisma.doctor.findUnique({ where: { userId: requestingUser.id } });
      if (!doctor || doctor.id !== existing.doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only update your own consultation records.',
        });
      }
    }

    const consultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        chiefComplaint,
        symptoms,
        clinicalNotes,
        diagnosis,
        treatmentPlan,
        followUpInstructions,
      },
    });

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /consultations/:id/complete  (id = consultationId)
// Doctor completes a consultation. Optionally creates a prescription.
// Uses a DB transaction to keep appointment + consultation + prescription in sync.
// ─────────────────────────────────────────────────────────────────────────────
export const completeConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const consultationId = id as string;
    const requestingUser = req.user!;
    const { medicines } = req.body; // optional medicines array for auto-prescription

    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { appointment: true },
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    // Doctors may only complete their own consultations
    if (requestingUser.role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId: requestingUser.id } });
      if (!doctor || doctor.id !== consultation.doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only complete your own consultation records.',
        });
      }
    }

    if (consultation.status === ConsultationStatus.COMPLETED) {
      return res.status(400).json({ success: false, message: 'Consultation is already completed' });
    }

    const completedAt = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark consultation COMPLETED
      const updatedConsultation = await tx.consultation.update({
        where: { id: consultationId },
        data: {
          status: ConsultationStatus.COMPLETED,
          completedAt,
        },
      });

      // 2. Mark the linked appointment COMPLETED
      await tx.appointment.update({
        where: { id: consultation.appointmentId },
        data: { status: AppointmentStatus.COMPLETED },
      });

      // 3. Optionally auto-create a prescription from medicines list
      if (medicines && medicines.length > 0) {
        const prescription = await tx.prescription.create({
          data: {
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            diagnosis: consultation.diagnosis,
            status: PrescriptionStatus.ACTIVE,
          },
        });

        for (const med of medicines) {
          await tx.prescriptionItem.create({
            data: {
              prescriptionId: prescription.id,
              medicineName: med.name,
              dosage: med.dosage,
              unit: med.unit || 'Tablet',
              frequency: med.frequency,
              route: med.route,
              durationDays: parseInt(med.durationDays) || 5,
              foodInstruction: med.foodInstruction,
              instructions: med.instructions,
            },
          });
        }
      }

      return updatedConsultation;
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

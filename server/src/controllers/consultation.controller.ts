import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { ConsultationStatus, AppointmentStatus, PrescriptionStatus } from '@prisma/client';

export const getConsultationByAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointmentId = id as string;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
            medicalRecords: { orderBy: { recordDate: 'desc' }, take: 5 },
            prescriptions: { include: { items: true }, orderBy: { createdAt: 'desc' }, take: 3 }
          }
        },
        doctor: true,
      }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    let consultation = await prisma.consultation.findUnique({
      where: { appointmentId }
    });

    res.status(200).json({
      success: true,
      data: {
        appointment,
        consultation
      }
    });
  } catch (error) {
    next(error);
  }
};

export const startConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointmentId = id as string;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Cannot start a completed or cancelled appointment' });
    }

    // Update appointment status if needed
    if (appointment.status === 'PENDING') {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' }
      });
    }

    let consultation;
    try {
      consultation = await prisma.consultation.upsert({
        where: { appointmentId },
        update: {
          status: ConsultationStatus.IN_PROGRESS,
          startedAt: new Date()
        },
        create: {
          appointmentId,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          status: ConsultationStatus.IN_PROGRESS,
          startedAt: new Date()
        }
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

export const updateConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const consultationId = id as string;
    const { chiefComplaint, symptoms, clinicalNotes, diagnosis, treatmentPlan, followUpInstructions } = req.body;

    const consultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        chiefComplaint,
        symptoms,
        clinicalNotes,
        diagnosis,
        treatmentPlan,
        followUpInstructions,
      }
    });

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

export const completeConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const consultationId = id as string;
    const { medicines } = req.body; // medicines array for prescription

    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { appointment: true }
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    if (consultation.status === ConsultationStatus.COMPLETED) {
      return res.status(400).json({ success: false, message: 'Consultation is already completed' });
    }

    const completedAt = new Date();

    // Use a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Consultation
      const updatedConsultation = await tx.consultation.update({
        where: { id: consultationId },
        data: {
          status: ConsultationStatus.COMPLETED,
          completedAt
        }
      });

      // 2. Update Appointment
      await tx.appointment.update({
        where: { id: consultation.appointmentId },
        data: { status: AppointmentStatus.COMPLETED }
      });

      // 3. Create Prescription if medicines exist
      if (medicines && medicines.length > 0) {
        const prescription = await tx.prescription.create({
          data: {
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            diagnosis: consultation.diagnosis,
            status: PrescriptionStatus.ACTIVE,
          }
        });

        // Add items
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
              instructions: med.instructions
            }
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
